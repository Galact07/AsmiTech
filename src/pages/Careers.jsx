import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, MapPin, Clock, Users, CheckCircle, DollarSign, Loader2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ ...APPLY_FORM_INITIAL_STATE });
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');

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
      .channel('public:jobs-careers')
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
          source: 'careers_page',
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
      {/* Hero Section */}
      <section className="md:px-8 md:pt-20 max-w-7xl mr-auto ml-auto pt-14 pr-5 pl-5" aria-labelledby="careers-title">
        <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
          <div className="pt-0 pr-6 pb-6 pl-6 md:pr-12 md:pb-12 md:pl-12">
            <div className="flex items-stretch gap-6 md:gap-10 flex-col md:flex-row min-h-[240px] md:min-h-[280px]">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em] mt-0 pt-2">
                  Careers
                </p>
                <h1 id="careers-title" className="sm:text-4xl md:text-5xl text-3xl font-bold text-slate-700 tracking-tight mt-2">
                  Join Our Team
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  Join a team that values your skills and ambitions. At ASMI, we grow together and create real impact.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    href="#positions"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById('positions');
                      if (element) {
                        const headerOffset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3 focus:outline-none cursor-pointer"
                  >
                    Open Positions
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 rounded-none px-5 py-3 text-sm font-bold text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition"
                  >
                    View Jobs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* Team Illustration */}
              <div className="w-full md:w-[280px] shrink-0 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&auto=format&fit=crop"
                  alt="Our team collaboration"
                  loading="lazy"
                  className="w-full rounded-none pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="positions">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h2 id="positions" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">
                Open Positions
              </h2>
              <p className="mt-2 text-slate-700/80">
                Explore our current openings and find the perfect role to advance your SAP career.
              </p>
            </div>
            {!loadingJobs && parsedJobs.length > 0 && (
              <Link
                to="/jobs"
                className="group inline-flex items-center gap-2 bg-primary text-white hover:brightness-110 transition px-5 py-3 rounded-none font-medium text-sm whitespace-nowrap focus:outline-none"
              >
                View All Jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="mt-6 space-y-4">
            {loadingJobs ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p>Loading open positions...</p>
              </div>
            ) : parsedJobs.length === 0 ? (
              <div className="rounded-none border border-dashed border-slate-300 bg-white/60 p-10 text-center">
                <h3 className="text-lg font-medium text-slate-700">No open positions right now</h3>
                <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
                  We&apos;re not actively hiring for new roles at the moment. Please check back soon or send us your resume so we can reach out when a matching opportunity opens up.
                </p>
                <div className="mt-4 flex justify-center">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Share Your Resume
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              parsedJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="rounded-none border border-slate-200 bg-white p-6 hover:shadow-md transition">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-slate-700">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                        )}
                        {job.type && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatEmploymentType(job.type)}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <Button
                        variant="ghost"
                        className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 text-sm font-medium rounded-none"
                        onClick={() => openApplyDialog(job)}
                      >
                        Apply Now
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {job.description && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Responsibilities:</h4>
                      <ul className="space-y-1">
                        {parseRequirements(job.description).map((responsibility, respIndex) => (
                          <li key={respIndex} className="flex items-start gap-2 text-sm text-slate-700/80">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {job.requirementList.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {job.requirementList.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start gap-2 text-sm text-slate-700/80">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="block md:hidden pt-4 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 text-sm font-medium rounded-none"
                      onClick={() => openApplyDialog(job)}
                    >
                      Apply Now
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            {!loadingJobs && parsedJobs.length > 3 && (
              <div className="pt-6 text-center border-t border-slate-200">
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:brightness-110 transition px-6 py-3 rounded-none font-medium focus:outline-none"
                >
                  View All {parsedJobs.length} Open Positions
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="process">
        <div className="bg-dark-blue p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="process" className="text-3xl md:text-4xl tracking-tight font-bold text-white text-center">
            Application Process
          </h2>
          <p className="mt-2 text-white/80 text-center">
          Join Our Global Team at ASMI Technologies
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 gap-y-8">
            {[
              {
                step: '01',
                title: 'Find a Job',
                description: 'Explore current openings on our ASMI Careers Page and find roles that match your skills and interests.'
              },
              {
                step: '02',
                title: 'Apply',
                description: 'Submit your online application and receive instant confirmation.'
              },
              {
                step: '03',
                title: 'Pre-Selection',
                description: 'We review your skills and experience to determine fit and may consider you for other relevant positions.'
              },
              {
                step: '04',
                title: 'Interview',
                description: 'Shortlisted candidates meet the recruiting manager and HR. Additional rounds or assessments may apply. Virtual or in-person interviews available.'
              },
              {
                step: '05',
                title: 'Selection',
                description: 'References may be checked. If selected, you\'ll receive an offer with a competitive package. All other applicants are notified.'
              },
              {
                step: '06',
                title: 'Onboarding',
                description: 'New hires undergo an introduction program to integrate quickly and start contributing effectively.'
              }
            ].map((phase, index) => (
              <div key={index} className="rounded-none bg-blue-50 p-6 text-center hover:shadow-md transition">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white text-xl font-bold mb-4 rounded-none">
                  {phase.step}
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">{phase.title}</h3>
                <p className="text-slate-700/80 text-sm">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="cta">
        <div className="rounded-none bg-blue-100 text-slate-700 p-8 md:p-12">
          <div className="flex justify-center">
            <div className="text-center max-w-2xl">
              <h2 id="cta" className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to Join the ASMI Team?
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl">
              Join a team where you can grow, learn, and build your career.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
                >
                  Browse All Jobs
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Dialog open={applyDialogOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-xl border border-slate-200 bg-white shadow-2xl p-6 rounded-none">
        <DialogHeader>
          <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
          <DialogDescription>
            Submit your details and we will get in touch if your profile is a good match.
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
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Posted {new Date(selectedJob.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
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
                  <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="phone">Phone Number</Label>
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
                <Label htmlFor="resumeFile">Resume (PDF only) *</Label>
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
                <Label htmlFor="cvFile">Cover Letter (PDF only, optional)</Label>
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
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="rounded-none">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};

export default Careers;
