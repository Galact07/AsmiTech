import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  FileText,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface Application {
  id: string;
  candidate_name: string;
  email: string;
  phone: string | null;
  resume_url: string | null;
  cover_letter: string | null;
  status: string | null;
  submitted_at: string;
  details: Record<string, unknown> | null;
}

interface Job {
  id: string;
  title: string;
  specialization: string | null;
  description: string | null;
  location: string | null;
  type: string;
  salary_range: string | null;
  requirements: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  applications?: Application[];
}

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  specialization: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  salary_range: z.string().optional(),
  requirements: z.string().optional(),
  status: z.enum(['active', 'inactive', 'closed']),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function JobsAdmin() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      specialization: '',
      description: '',
      location: '',
      type: 'full-time',
      salary_range: '',
      requirements: '',
      status: 'active',
    },
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`*, applications:applications(
          id,
          candidate_name,
          email,
          phone,
          resume_url,
          cover_letter,
          status,
          submitted_at,
          details
        )`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const formatted = (data || []).map(job => ({
        ...job,
        applications: (job.applications || [])
          .filter((application: Application | null): application is Application => application !== null)
          .sort((a: Application, b: Application) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
      }));
      setJobs(formatted);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    
    // Set up real-time subscriptions for jobs and applications
    const jobsChannel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
        fetchJobs();
      })
      .subscribe();

    const applicationsChannel = supabase
      .channel('applications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => {
        fetchJobs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(applicationsChannel);
    };
  }, [fetchJobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (data: JobFormData) => {
    try {
      if (selectedJob) {
        // Update existing job
        const { error } = await supabase
          .from('jobs')
          .update(data)
          .eq('id', selectedJob.id);

        if (error) throw error;
        toast.success('Job updated successfully');
      } else {
        // Create new job
        const { error } = await supabase
          .from('jobs')
          .insert({
            ...data,
            title: data.title!, // Assert title is present since it's validated by Zod
          });

        if (error) throw error;
        toast.success('Job created successfully');
      }

      handleFormDialogChange(false);
      await fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job');
    }
  };

  const handleFormDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedJob(null);
      form.reset();
    }
  };

  const handleViewDialogChange = (open: boolean) => {
    setViewDialogOpen(open);
    if (!open) {
      setSelectedJob(null);
    }
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    form.reset({
      title: job.title,
      specialization: job.specialization || '',
      description: job.description || '',
      location: job.location || '',
      type: job.type as any,
      salary_range: job.salary_range || '',
      requirements: job.requirements || '',
      status: job.status as any,
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedJob) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', selectedJob.id);

      if (error) throw error;

      toast.success('Job deleted successfully');
      setSelectedJob(null);
      await fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const openCreateDialog = () => {
    setSelectedJob(null);
    form.reset();
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'active': 'default',
      'inactive': 'secondary',
      'closed': 'destructive',
    };

    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-orange-100 text-orange-800',
      'internship': 'bg-purple-100 text-purple-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type.replace('-', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Jobs Management - Admin Dashboard</title>
        <meta name="description" content="Manage job listings and career opportunities." />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jobs Management</h1>
            <p className="text-muted-foreground">
              Create and manage job listings for your company
            </p>
          </div>
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Job
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Jobs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Job Listings ({filteredJobs.length})</CardTitle>
              <CardDescription>
                Manage all your job postings and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job, index) => (
                      <motion.tr
                        key={job.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{job.title}</div>
                            {job.specialization && (
                              <div className="text-sm text-muted-foreground">
                                {job.specialization}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(job.type)}</TableCell>
                        <TableCell>
                          {job.location ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {job.location}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            {job.applications?.length ?? 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(job.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedJob(job);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(job)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedJob(job)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Job</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{job.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setSelectedJob(null)}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={handleDelete}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>

                {filteredJobs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No jobs found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={handleFormDialogChange}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle>
                {selectedJob ? 'Edit Job' : 'Create New Job'}
              </DialogTitle>
              <DialogDescription>
                {selectedJob ? 'Update job details' : 'Add a new job listing to your careers page'}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Senior SAP Developer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. SAP S/4HANA" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Amsterdam, Netherlands" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="internship">Internship</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salary_range"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary Range</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. €60,000 - €80,000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe the role, responsibilities, and what you're looking for..."
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="List the required skills, experience, and qualifications..."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleFormDialogChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {selectedJob ? 'Updating...' : 'Creating...'}
                        </div>
                      ) : (
                        selectedJob ? 'Update Job' : 'Create Job'
                      )}
                    </Button>
                  </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Job Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={handleViewDialogChange}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle>{selectedJob?.title}</DialogTitle>
              <DialogDescription>
                Job details and information
              </DialogDescription>
            </DialogHeader>

            {selectedJob && (
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm flex flex-wrap gap-2">
                  {getStatusBadge(selectedJob.status)}
                  {getTypeBadge(selectedJob.type)}
                  <Badge variant="outline" className="capitalize">
                    Created {new Date(selectedJob.created_at).toLocaleDateString()}
                  </Badge>
                  {selectedJob.salary_range && (
                    <Badge variant="outline">{selectedJob.salary_range}</Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Specialization</Label>
                    <p className="text-muted-foreground">
                      {selectedJob.specialization || 'Not specified'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Location</Label>
                    <p className="text-muted-foreground">
                      {selectedJob.location || 'Not specified'}
                    </p>
                  </div>
                </div>

                {selectedJob.description && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Description</Label>
                    <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                      {selectedJob.description}
                    </p>
                  </div>
                )}

                {selectedJob.requirements && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Requirements</Label>
                    <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                      {selectedJob.requirements}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <Label className="font-medium flex items-center gap-2">
                    Applications
                    <Badge variant="outline">{selectedJob.applications?.length ?? 0}</Badge>
                  </Label>
                  {!selectedJob.applications || selectedJob.applications.length === 0 ? (
                    <p className="text-muted-foreground mt-2 text-sm">
                      No applications received yet.
                    </p>
                  ) : (
                    <div className="mt-4 grid gap-4">
                      {selectedJob.applications.map((application) => (
                        <div key={application.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium text-foreground">{application.candidate_name}</p>
                              <p className="text-xs text-muted-foreground">
                                Applied on {new Date(application.submitted_at).toLocaleString()}
                              </p>
                            </div>
                            {application.status && (
                              <Badge variant="secondary" className="text-xs capitalize">
                                {application.status}
                              </Badge>
                            )}
                          </div>
                          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                            <span>
                              Email: <a className="underline" href={`mailto:${application.email}`}>{application.email}</a>
                            </span>
                            {application.phone && (
                              <span>
                                Phone: <a className="underline" href={`tel:${application.phone}`}>{application.phone}</a>
                              </span>
                            )}
                            {application.resume_url && (
                              <span className="sm:col-span-2">
                                Resume: <a className="text-primary underline" href={application.resume_url} target="_blank" rel="noopener noreferrer">View</a>
                              </span>
                            )}
                          </div>
                          {application.cover_letter && (
                            <div className="rounded-md bg-slate-100 border border-slate-200 p-3 text-sm text-slate-600">
                              <p className="font-medium text-slate-900 mb-1">Cover Letter</p>
                              <p className="whitespace-pre-wrap">{application.cover_letter}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
      </div>
    </>
  );
}