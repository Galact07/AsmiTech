import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, MapPin, Clock, Users, CheckCircle, DollarSign, Loader2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const APPLY_FORM_INITIAL_STATE = {
  name: '',
  email: '',
  phone: '',
  resumeUrl: '',
  coverLetter: '',
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

  const handleSubmitApplication = async (event) => {
    event.preventDefault();
    if (!selectedJob) return;

    if (!formData.name.trim() || !formData.email.trim()) {
      setApplyError('Please provide both your name and email.');
      toast.error('Please provide both your name and email.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('applications').insert({
        job_id: selectedJob.id,
        candidate_name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        resume_url: formData.resumeUrl.trim() || null,
        cover_letter: formData.coverLetter.trim() || null,
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
      setApplyError('Unable to submit your application right now. Please try again.');
      toast.error('Unable to submit your application right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-16 max-w-7xl mr-auto ml-auto pt-10 pr-5 pl-5" aria-labelledby="careers-title">
        <div className="rounded-3xl bg-white/70 backdrop-blur-[10px] border border-slate-200 shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] overflow-hidden transition duration-500 ease-in">
          <div className="sm:p-8 md:p-12 pt-6 pr-6 pb-6 pl-6">
            <div className="flex items-start md:items-center gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-light text-slate-500 tracking-[0.18em]">
                  Join Our Team
                </p>
                <h1 id="careers-title" className="sm:text-5xl md:text-6xl text-4xl font-light text-slate-900 tracking-tight mt-2">
                  Build the future of SAP consulting.
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  Join our growing team of SAP experts and help mid-market enterprises transform their business with cutting-edge technology solutions.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/jobs"
                    className="group inline-flex items-center gap-2 hover:shadow-[0_0_0_5px_rgba(212,160,23,0.25)] hover:brightness-105 transition text-sm font-medium text-slate-50 bg-primary border-slate-200 border rounded-full px-5 py-3"
                  >
                    View Open Positions
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition"
                  >
                    Learn About Us
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* Team Illustration */}
              <div className="w-full md:w-[440px] shrink-0 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=60&auto=format&fit=crop"
                  alt="Our team collaboration"
                  loading="lazy"
                  className="backdrop-blur-[10px] bg-white/70 w-full border-slate-200 border rounded-2xl pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="why-join">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="why-join" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Why Join Asmi?
          </h2>
          <p className="mt-2 text-slate-700/80">
            We offer a unique opportunity to work with cutting-edge SAP technology while making a real impact on mid-market businesses.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Growth Opportunities',
                description: 'Continuous learning and career development with access to the latest SAP certifications and training.',
                icon: '📈'
              },
              {
                title: 'Flexible Work',
                description: 'Hybrid work model with flexible hours and remote work options to support work-life balance.',
                icon: '🏠'
              },
              {
                title: 'Competitive Benefits',
                description: 'Attractive salary packages, health insurance, and performance-based bonuses.',
                icon: '💰'
              },
              {
                title: 'Innovation Focus',
                description: 'Work with the latest SAP technologies and contribute to innovative solutions for our clients.',
                icon: '🚀'
              },
              {
                title: 'Team Culture',
                description: 'Collaborative environment with experienced professionals who are passionate about SAP excellence.',
                icon: '🤝'
              },
              {
                title: 'Client Impact',
                description: 'Make a real difference by helping mid-market companies transform their business processes.',
                icon: '💼'
              }
            ].map((benefit, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-700/80 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="positions">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h2 id="positions" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
                Open Positions
              </h2>
              <p className="mt-2 text-slate-700/80">
                Explore our current openings and find the perfect role to advance your SAP career.
              </p>
            </div>
            {!loadingJobs && parsedJobs.length > 0 && (
              <Link
                to="/jobs"
                className="group inline-flex items-center gap-2 bg-primary text-white hover:shadow-[0_0_0_5px_rgba(212,160,23,0.25)] hover:brightness-105 transition px-5 py-3 rounded-full font-medium text-sm whitespace-nowrap"
              >
                View All Jobs
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 transition">
                  <ArrowRight className="h-3 w-3" />
                </span>
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
              <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
                <h3 className="text-lg font-medium text-slate-900">No open positions right now</h3>
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
                <div key={job.id} className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-slate-900">{job.title}</h3>
                      {job.specialization && (
                        <p className="text-sm text-primary/80 font-medium">{job.specialization}</p>
                      )}
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
                        {job.salary_range && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary_range}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
                      onClick={() => openApplyDialog(job)}
                    >
                      Apply Now
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {job.description && (
                    <p className="text-slate-700/80 mb-4 whitespace-pre-line">{job.description}</p>
                  )}
                  {job.requirementList.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-2">Requirements:</h4>
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
                </div>
              ))
            )}
            {!loadingJobs && parsedJobs.length > 3 && (
              <div className="pt-6 text-center border-t border-slate-200">
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:shadow-[0_0_0_5px_rgba(212,160,23,0.25)] hover:brightness-105 transition px-6 py-3 rounded-full font-medium"
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
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="process" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Application Process
          </h2>
          <p className="mt-2 text-slate-700/80">
            Our streamlined application process ensures a smooth experience for all candidates.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Apply Online',
                description: 'Submit your application through our online portal with your resume and cover letter.'
              },
              {
                step: '02',
                title: 'Initial Screening',
                description: 'Our HR team will review your application and conduct an initial phone screening.'
              },
              {
                step: '03',
                title: 'Technical Interview',
                description: 'Meet with our technical team to discuss your SAP experience and problem-solving approach.'
              },
              {
                step: '04',
                title: 'Final Interview',
                description: 'Final interview with leadership team to discuss culture fit and career aspirations.'
              }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-lg font-medium mb-4">
                  {phase.step}
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">{phase.title}</h3>
                <p className="text-slate-700/80 text-sm">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="cta">
        <div className="rounded-2xl bg-primary text-white p-8 md:p-12 text-center">
          <h2 id="cta" className="text-2xl md:text-3xl font-light tracking-tight">
            Ready to join our team?
          </h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Don't see the perfect role? We're always looking for talented SAP professionals. Send us your resume and let's start a conversation.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-white text-primary hover:bg-slate-50 transition px-6 py-3 rounded-full font-medium"
            >
              Browse All Jobs
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 transition px-6 py-3 rounded-full font-medium"
            >
              Send Your Resume
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
    <Dialog open={applyDialogOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-2xl md:max-w-3xl border border-slate-200 bg-white shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
          <DialogDescription>
            Submit your details and we will get in touch if your profile is a good match.
          </DialogDescription>
        </DialogHeader>

        {selectedJob && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm space-y-2">
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
                  Posted {new Date(selectedJob.created_at).toLocaleDateString()}
                </span>
              </div>
              {selectedJob.specialization && (
                <p className="text-sm text-slate-600">
                  Specialization: <span className="font-medium text-slate-800">{selectedJob.specialization}</span>
                </p>
              )}
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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
                    className="bg-white border border-slate-200 focus-visible:ring-primary"
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
                    className="bg-white border border-slate-200 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+31 6 12345678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="bg-white border border-slate-200 focus-visible:ring-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="resumeUrl">Resume URL (optional)</Label>
                  <Input
                    id="resumeUrl"
                    name="resumeUrl"
                    placeholder="Link to your resume or portfolio"
                    value={formData.resumeUrl}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="bg-white border border-slate-200 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="coverLetter">Cover Letter / Message (optional)</Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  placeholder="Share a brief motivation for this role"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows={4}
                  disabled={submitting}
                  className="bg-white border border-slate-200 focus-visible:ring-primary"
                />
              </div>

              {applyError && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {applyError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogChange(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
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
