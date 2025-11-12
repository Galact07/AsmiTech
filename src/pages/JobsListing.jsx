import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CheckCircle, DollarSign, Loader2, Calendar, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

const APPLY_FORM_INITIAL_STATE = {
  name: '',
  email: '',
  phone: '',
  resumeFile: null,
  cvFile: null,
};

const parseRequirements = (requirements) => {
  if (!requirements) return [];
  const byLine = requirements
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean);
  if (byLine.length > 0) {
    return byLine;
  }
  return requirements
    .split(',')
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean);
};

const formatEmploymentType = (type) => {
  if (!type) return 'N/A';
  return type
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
};

const JobsListing = () => {
  const { t } = useTranslation();
  const { t: tDb } = useLanguage(); // For database content
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ ...APPLY_FORM_INITIAL_STATE });
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const resetForm = useCallback(() => {
    setFormData({ ...APPLY_FORM_INITIAL_STATE });
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Unable to load open positions right now.');
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();

    const channel = supabase
      .channel('public:jobs-listing')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, fetchJobs)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchJobs]);

  const parsedJobs = useMemo(
    () =>
      jobs.map((job) => ({
        ...job,
        requirementList: parseRequirements(job.requirements),
      })),
    [jobs],
  );

  // Get unique locations and types for filters
  const uniqueLocations = useMemo(() => {
    const locations = [...new Set(jobs.map(job => job.location).filter(Boolean))];
    return locations;
  }, [jobs]);

  const uniqueTypes = useMemo(() => {
    const types = [...new Set(jobs.map(job => job.type).filter(Boolean))];
    return types;
  }, [jobs]);

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return parsedJobs.filter(job => {
      // Get translated title and description for search
      const title = tDb(job.title, job.content_nl?.title);
      const specialization = job.specialization ? tDb(job.specialization, job.content_nl?.specialization) : '';
      const description = job.description ? tDb(job.description, job.content_nl?.description) : '';
      
      const matchesSearch = searchTerm === '' || 
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || job.type === typeFilter;
      const matchesLocation = locationFilter === 'all' || job.location === locationFilter;
      
      return matchesSearch && matchesType && matchesLocation;
    });
  }, [parsedJobs, searchTerm, typeFilter, locationFilter, tDb]);

  const handleDialogChange = (open) => {
    setApplyDialogOpen(open);
    if (!open) {
      setSelectedJob(null);
      resetForm();
    }
  };

  const openApplyDialog = (job) => {
    setSelectedJob(job);
    resetForm();
    setApplyError('');
    setApplyDialogOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    if (applyError) {
      setApplyError('');
    }
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (files && files.length > 0) {
      const file = files[0];
      // Validate file type is PDF
      if (file.type !== 'application/pdf') {
        setApplyError('Please upload only PDF files.');
        toast.error('Please upload only PDF files.');
        return;
      }
      setFormData((previous) => ({
        ...previous,
        [name]: file,
      }));
      if (applyError) {
        setApplyError('');
      }
    }
  };

  const handleSubmitApplication = async (event) => {
    event.preventDefault();
    if (!selectedJob) return;

    if (!formData.name.trim() || !formData.email.trim()) {
      setApplyError('Please provide both your name and email.');
      toast.error('Please provide both your name and email.');
      return;
    }

    if (!formData.phone.trim()) {
      setApplyError('Please provide your phone number.');
      toast.error('Please provide your phone number.');
      return;
    }

    // Resume is recommended but do not block submission in production

    setSubmitting(true);
    try {
      let resumeUrl = null;
      let cvUrl = null;

      // Upload resume file to the correct bucket and folder if provided
      if (formData.resumeFile) {
        const resumeExt = formData.resumeFile.name.split('.').pop();
        const resumeFileName = `${Date.now()}-resume.${resumeExt}`;
        const resumePath = `applications/${resumeFileName}`;
        const { error: resumeError } = await supabase.storage
          .from('resumes')
          .upload(resumePath, formData.resumeFile, { cacheControl: '3600', upsert: false });

        if (resumeError) {
          console.error('Resume upload failed:', resumeError);
          toast('Submitted without resume: upload failed.', { icon: '⚠️' });
        } else {
          // Store private storage path (admin will generate signed URL when viewing)
          resumeUrl = resumePath;
        }
      }

      // Upload CV file if provided
      if (formData.cvFile) {
        const cvExt = formData.cvFile.name.split('.').pop();
        const cvFileName = `${Date.now()}-cv.${cvExt}`;
        const cvPath = `applications/${cvFileName}`;
        const { error: cvError } = await supabase.storage
          .from('resumes')
          .upload(cvPath, formData.cvFile, { cacheControl: '3600', upsert: false });

        if (cvError) {
          console.error('Cover letter upload failed:', cvError);
          toast('Submitted without cover letter: upload failed.', { icon: '⚠️' });
        } else {
          // Store private storage path
          cvUrl = cvPath;
        }
      }

      const { error } = await supabase.from('applications').insert({
        job_id: selectedJob.id,
        candidate_name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        resume_url: resumeUrl,
        cover_letter: cvUrl,
        details: {
          source: 'jobs_listing_page',
          job_title: selectedJob.title,
        },
      });

      if (error) throw error;

      toast.success('Application submitted successfully!');
      setApplyDialogOpen(false);
      setSelectedJob(null);
      resetForm();
    } catch (error) {
      console.error('Error submitting application:', error);
      const message = error?.message || String(error);
      setApplyError('Unable to submit your application right now. Please try again.');
      toast.error(`Unable to submit your application right now. ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Header Section */}
        <section className="md:px-8 md:pt-20 max-w-7xl mr-auto ml-auto pt-14 pr-5 pl-5">
          <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
            <div className="pt-0 pr-6 pb-6 pl-6 md:pr-12 md:pb-12 md:pl-12">
              <Link 
                to="/careers" 
                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary mb-6 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('buttons.backToCareers')}
              </Link>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em] mt-0 pt-2">
                  {t('jobs.header.tagline')}
                </p>
                <h1 className="sm:text-5xl md:text-6xl text-4xl font-bold text-slate-700 tracking-tight mt-2">
                  {t('jobs.header.title')}
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  {t('jobs.header.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="md:px-8 md:pt-8 max-w-7xl mr-auto ml-auto pt-6 pr-5 pl-5">
          <div className="rounded-none bg-slate-100 p-6 transition duration-500 ease-in">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder={t('jobs.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-slate-200"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white border-slate-200">
                  <SelectValue placeholder={t('jobs.search.employmentType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('jobs.search.allTypes')}</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {formatEmploymentType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white border-slate-200">
                  <SelectValue placeholder={t('jobs.search.location')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('jobs.search.allLocations')}</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(searchTerm || typeFilter !== 'all' || locationFilter !== 'all') && (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <Filter className="h-4 w-4" />
                <span>
                  {t('jobs.search.showing')} {filteredJobs.length} {t('jobs.search.of')} {parsedJobs.length} {t('jobs.search.positions')}
                </span>
                {(searchTerm || typeFilter !== 'all' || locationFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setTypeFilter('all');
                      setLocationFilter('all');
                    }}
                    className="text-primary hover:text-primary/80 underline ml-2"
                  >
                    {t('buttons.clearFilters')}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Jobs List */}
        <section className="md:px-8 md:pt-8 max-w-7xl mr-auto ml-auto pt-6 pr-5 pl-5 pb-12">
          <div className="space-y-4">
            {loadingJobs ? (
              <div className="rounded-none bg-slate-800 p-12">
                <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>{t('jobs.status.loading')}</p>
                </div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-none bg-slate-800 p-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-slate-900">
                    {searchTerm || typeFilter !== 'all' || locationFilter !== 'all' 
                      ? t('jobs.status.noResults')
                      : t('jobs.status.noOpenings')}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
                    {searchTerm || typeFilter !== 'all' || locationFilter !== 'all'
                      ? t('jobs.status.noResultsDescription')
                      : t('jobs.status.noOpeningsDescription')}
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    {(searchTerm || typeFilter !== 'all' || locationFilter !== 'all') && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm('');
                          setTypeFilter('all');
                          setLocationFilter('all');
                        }}
                      >
                        {t('buttons.clearAllFilters')}
                      </Button>
                    )}
                    <Link to="/contact">
                      <Button>
                        {t('buttons.contactUs')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              filteredJobs.map((job, index) => (
                <div 
                  key={job.id} 
                  className="rounded-none bg-white/70 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 hover:shadow-lg transition duration-300"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards',
                  }}
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl font-medium text-slate-900 mb-2">{tDb(job.title, job.content_nl?.title)}</h3>
                        {job.specialization && (
                          <p className="text-base text-primary/90 font-medium">{tDb(job.specialization, job.content_nl?.specialization)}</p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        {job.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        {job.type && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{formatEmploymentType(job.type)}</span>
                          </div>
                        )}
                        {job.salary_range && (
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary_range}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{t('jobs.details.posted')} {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {job.description && (
                        <p className="text-slate-700/80 leading-relaxed whitespace-pre-line">
                          {tDb(job.description, job.content_nl?.description)}
                        </p>
                      )}

                      {job.requirementList.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 mb-3">{t('jobs.details.keyRequirements')}</h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {job.requirementList.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-start gap-2 text-sm text-slate-700/80">
                                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="lg:ml-6">
                      <Button
                        onClick={() => openApplyDialog(job)}
                        className="w-full lg:w-auto whitespace-nowrap px-8 py-6 text-base"
                      >
                        {t('buttons.applyForPosition')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Application Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-xl border border-slate-200 bg-white shadow-2xl p-6 rounded-none">
          <DialogHeader>
            <DialogTitle>{t('jobs.apply.title')} {selectedJob && tDb(selectedJob.title, selectedJob.content_nl?.title)}</DialogTitle>
            <DialogDescription>
              {t('jobs.apply.description')}
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-6">
              <div className="rounded-none border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm space-y-2">
                <div className="flex flex-wrap gap-3">
                  {selectedJob.location && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {selectedJob.location}
                    </span>
                  )}
                  {selectedJob.type && (
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatEmploymentType(selectedJob.type)}
                    </span>
                  )}
                  {selectedJob.salary_range && (
                    <span className="inline-flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {selectedJob.salary_range}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('jobs.details.posted')} {new Date(selectedJob.created_at).toLocaleDateString()}
                  </span>
                </div>
                {selectedJob.specialization && (
                  <p className="text-sm text-slate-600">
                    {t('jobs.details.specialization')} <span className="font-medium text-slate-800">{tDb(selectedJob.specialization, selectedJob.content_nl?.specialization)}</span>
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('jobs.apply.fullName')}</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={submitting}
                      className="bg-white border border-slate-200 focus-visible:ring-primary rounded-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('jobs.apply.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={submitting}
                      className="bg-white border border-slate-200 focus-visible:ring-primary rounded-none"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">{t('jobs.apply.phone')}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+31 6 12345678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className="bg-white border border-slate-200 focus-visible:ring-primary rounded-none"
                  />
                </div>

                <div>
                  <Label htmlFor="resumeFile">{t('jobs.apply.resume')}</Label>
                  <Input
                    id="resumeFile"
                    type="file"
                    name="resumeFile"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                    disabled={submitting}
                    className="bg-white border border-slate-200 focus-visible:ring-primary rounded-none"
                  />
                </div>

                <div>
                  <Label htmlFor="cvFile">{t('jobs.apply.coverLetter')}</Label>
                  <Input
                    id="cvFile"
                    type="file"
                    name="cvFile"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={submitting}
                    className="bg-white border border-slate-200 focus-visible:ring-primary rounded-none"
                  />
                </div>

                {applyError && (
                  <div className="rounded-none border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {applyError}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogChange(false)}
                    disabled={submitting}
                    className="rounded-none"
                  >
                    {t('buttons.cancel')}
                  </Button>
                  <Button type="submit" disabled={submitting} className="rounded-none">
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {t('jobs.apply.submitting')}
                      </>
                    ) : (
                      t('buttons.submitApplication')
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default JobsListing;

