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
  BookOpen,
  Building,
  Image as ImageIcon,
  Link as LinkIcon,
  Calendar,
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

interface CaseStudy {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  client_name: string | null;
  industry: string | null;
  image_url: string | null;
  link: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const caseStudySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().optional(),
  content: z.string().optional(),
  client_name: z.string().optional(),
  industry: z.string().optional(),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']),
});

type CaseStudyFormData = z.infer<typeof caseStudySchema>;

export default function CaseStudiesAdmin() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const form = useForm<CaseStudyFormData>({
    resolver: zodResolver(caseStudySchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      client_name: '',
      industry: '',
      image_url: '',
      link: '',
      status: 'draft',
    },
  });

  const fetchCaseStudies = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
    } catch (error) {
      console.error('Error fetching case studies:', error);
      toast.error('Failed to fetch case studies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCaseStudies();
    
    // Set up real-time subscriptions
    const caseStudiesChannel = supabase
      .channel('case-studies-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'case_studies' }, () => {
        fetchCaseStudies();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(caseStudiesChannel);
    };
  }, [fetchCaseStudies]);

  const filteredCaseStudies = caseStudies.filter(caseStudy => {
    const matchesSearch = 
      caseStudy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseStudy.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseStudy.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseStudy.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || caseStudy.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (data: CaseStudyFormData) => {
    try {
      const payload = {
        ...data,
        image_url: data.image_url || null,
        link: data.link || null,
        summary: data.summary || null,
        content: data.content || null,
        client_name: data.client_name || null,
        industry: data.industry || null,
      };

      if (selectedCaseStudy) {
        // Update existing case study
        const { error } = await supabase
          .from('case_studies')
          .update(payload)
          .eq('id', selectedCaseStudy.id);

        if (error) throw error;
        toast.success('Case study updated successfully');
      } else {
        // Create new case study
        const { error } = await supabase
          .from('case_studies')
          .insert(payload);

        if (error) throw error;
        toast.success('Case study created successfully');
      }

      handleFormDialogChange(false);
      await fetchCaseStudies();
    } catch (error) {
      console.error('Error saving case study:', error);
      toast.error('Failed to save case study');
    }
  };

  const handleFormDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedCaseStudy(null);
      form.reset();
    }
  };

  const handleViewDialogChange = (open: boolean) => {
    setViewDialogOpen(open);
    if (!open) {
      setSelectedCaseStudy(null);
    }
  };

  const handleEdit = (caseStudy: CaseStudy) => {
    setSelectedCaseStudy(caseStudy);
    form.reset({
      title: caseStudy.title,
      summary: caseStudy.summary || '',
      content: caseStudy.content || '',
      client_name: caseStudy.client_name || '',
      industry: caseStudy.industry || '',
      image_url: caseStudy.image_url || '',
      link: caseStudy.link || '',
      status: caseStudy.status as any,
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCaseStudy) return;

    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', selectedCaseStudy.id);

      if (error) throw error;

      toast.success('Case study deleted successfully');
      setSelectedCaseStudy(null);
      setViewDialogOpen(false);
      await fetchCaseStudies();
    } catch (error) {
      console.error('Error deleting case study:', error);
      toast.error('Failed to delete case study');
    }
  };

  const openCreateDialog = () => {
    setSelectedCaseStudy(null);
    form.reset();
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'published': 'default',
      'draft': 'secondary',
      'archived': 'outline',
    };

    const colors: Record<string, string> = {
      'published': 'bg-green-100 text-green-800 border-green-300',
      'draft': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'archived': 'bg-gray-100 text-gray-800 border-gray-300',
    };

    return (
      <Badge 
        variant={variants[status] || 'outline'}
        className={colors[status]}
      >
        {status}
      </Badge>
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
        <title>Case Studies Management - Admin Dashboard</title>
        <meta name="description" content="Manage case studies and project showcases." />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Case Studies Management</h1>
            <p className="text-muted-foreground">
              Create and manage case studies and project showcases
            </p>
          </div>
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Case Study
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
              placeholder="Search case studies..."
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
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Case Studies Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Case Studies ({filteredCaseStudies.length})</CardTitle>
              <CardDescription>
                Manage all your case studies and project showcases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCaseStudies.map((caseStudy, index) => (
                      <motion.tr
                        key={caseStudy.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {caseStudy.image_url ? (
                              <img 
                                src={caseStudy.image_url} 
                                alt={caseStudy.title}
                                className="h-10 w-10 rounded object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{caseStudy.title}</div>
                              {caseStudy.summary && (
                                <div className="text-sm text-muted-foreground truncate max-w-xs">
                                  {caseStudy.summary}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {caseStudy.client_name ? (
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3 text-muted-foreground" />
                              {caseStudy.client_name}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {caseStudy.industry || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>{getStatusBadge(caseStudy.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(caseStudy.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedCaseStudy(caseStudy);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(caseStudy)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedCaseStudy(caseStudy)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Case Study</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{caseStudy.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setSelectedCaseStudy(null)}>Cancel</AlertDialogCancel>
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

                {filteredCaseStudies.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No case studies found matching your criteria</p>
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
                {selectedCaseStudy ? 'Edit Case Study' : 'Create New Case Study'}
              </DialogTitle>
              <DialogDescription>
                {selectedCaseStudy ? 'Update case study details' : 'Add a new case study to showcase your work'}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. SAP Implementation for Fortune 500 Company" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief summary of the case study..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Content</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Detailed description of the project, challenges, solutions, and results..."
                          rows={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="client_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Acme Corporation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Manufacturing, Retail" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/image.jpg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>External Link</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/case-study" />
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
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
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
                        {selectedCaseStudy ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      selectedCaseStudy ? 'Update Case Study' : 'Create Case Study'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Case Study Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={handleViewDialogChange}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle>{selectedCaseStudy?.title}</DialogTitle>
              <DialogDescription>
                Case study details and information
              </DialogDescription>
            </DialogHeader>

            {selectedCaseStudy && (
              <div className="space-y-6">
                {/* Image */}
                {selectedCaseStudy.image_url && (
                  <div className="rounded-xl overflow-hidden border border-slate-200">
                    <img 
                      src={selectedCaseStudy.image_url} 
                      alt={selectedCaseStudy.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Status and Meta */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm flex flex-wrap gap-2">
                  {getStatusBadge(selectedCaseStudy.status)}
                  <Badge variant="outline" className="capitalize">
                    Created {new Date(selectedCaseStudy.created_at).toLocaleDateString()}
                  </Badge>
                  {selectedCaseStudy.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedCaseStudy.link!, '_blank')}
                    >
                      <LinkIcon className="h-3 w-3 mr-1" />
                      View External
                    </Button>
                  )}
                </div>

                {/* Client and Industry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Client</Label>
                    <p className="text-muted-foreground">
                      {selectedCaseStudy.client_name || 'Not specified'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Industry</Label>
                    <p className="text-muted-foreground">
                      {selectedCaseStudy.industry || 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Summary */}
                {selectedCaseStudy.summary && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Summary</Label>
                    <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                      {selectedCaseStudy.summary}
                    </p>
                  </div>
                )}

                {/* Content */}
                {selectedCaseStudy.content && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Full Content</Label>
                    <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                      {selectedCaseStudy.content}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
