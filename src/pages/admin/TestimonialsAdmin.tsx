import { useState, useEffect, useCallback, useRef } from 'react';
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
  MessageSquare,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
  Star,
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
import { Switch } from '@/components/ui/switch';

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string | null;
  company_name: string;
  company_logo_url: string | null;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const testimonialSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  author_name: z.string().min(1, 'Author name is required'),
  author_role: z.string().optional(),
  company_name: z.string().min(1, 'Company name is required'),
  company_logo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
  is_featured: z.boolean(),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      quote: '',
      author_name: '',
      author_role: '',
      company_name: '',
      company_logo_url: '',
      display_order: 0,
      is_active: true,
      is_featured: false,
    },
  });

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
    
    // Set up real-time subscriptions
    const testimonialsChannel = supabase
      .channel('testimonials-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => {
        fetchTestimonials();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(testimonialsChannel);
    };
  }, [fetchTestimonials]);

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = 
      testimonial.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.author_role?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && testimonial.is_active) ||
      (statusFilter === 'inactive' && !testimonial.is_active);
    
    const matchesFeatured = featuredFilter === 'all' ||
      (featuredFilter === 'featured' && testimonial.is_featured) ||
      (featuredFilter === 'not-featured' && !testimonial.is_featured);
    
    return matchesSearch && matchesStatus && matchesFeatured;
  });

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `testimonial-logo-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase storage (reuse client-logos bucket)
      const { error: uploadError } = await supabase.storage
        .from('client-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('client-logos')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        form.setValue('company_logo_url', urlData.publicUrl);
        setImagePreview(urlData.publicUrl);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    const currentUrl = form.getValues('company_logo_url');
    if (!currentUrl) return;

    try {
      // Extract file path from URL
      const urlParts = currentUrl.split('/');
      const fileName = urlParts[urlParts.length - 1].split('?')[0];

      // Delete from storage
      const { error } = await supabase.storage
        .from('client-logos')
        .remove([fileName]);

      if (error) throw error;

      form.setValue('company_logo_url', '');
      setImagePreview(null);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (data: TestimonialFormData) => {
    try {
      const payload = {
        ...data,
        company_logo_url: data.company_logo_url || null,
        author_role: data.author_role || null,
      };

      if (selectedTestimonial) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', selectedTestimonial.id);

        if (error) throw error;
        toast.success('Testimonial updated successfully');
      } else {
        // Create new testimonial
        // Set display_order to max + 1 if not specified
        if (data.display_order === 0) {
          const maxOrder = testimonials.length > 0 
            ? Math.max(...testimonials.map(t => t.display_order)) 
            : 0;
          payload.display_order = maxOrder + 1;
        }

        const { error } = await supabase
          .from('testimonials')
          .insert(payload);

        if (error) throw error;
        toast.success('Testimonial created successfully');
      }

      handleFormDialogChange(false);
      await fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    }
  };

  const handleFormDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedTestimonial(null);
      form.reset();
      setImagePreview(null);
    }
  };

  const handleViewDialogChange = (open: boolean) => {
    setViewDialogOpen(open);
    if (!open) {
      setSelectedTestimonial(null);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    form.reset({
      quote: testimonial.quote,
      author_name: testimonial.author_name,
      author_role: testimonial.author_role || '',
      company_name: testimonial.company_name,
      company_logo_url: testimonial.company_logo_url || '',
      display_order: testimonial.display_order,
      is_active: testimonial.is_active,
      is_featured: testimonial.is_featured,
    });
    setImagePreview(testimonial.company_logo_url);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTestimonial) return;

    try {
      // Delete image from storage if exists
      if (selectedTestimonial.company_logo_url) {
        const urlParts = selectedTestimonial.company_logo_url.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0];
        await supabase.storage
          .from('client-logos')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', selectedTestimonial.id);

      if (error) throw error;

      toast.success('Testimonial deleted successfully');
      setSelectedTestimonial(null);
      await fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const handleOrderChange = async (testimonialId: string, direction: 'up' | 'down') => {
    const testimonial = testimonials.find(t => t.id === testimonialId);
    if (!testimonial) return;

    const sortedTestimonials = [...testimonials].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedTestimonials.findIndex(t => t.id === testimonialId);
    
    if (direction === 'up' && currentIndex > 0) {
      const prevTestimonial = sortedTestimonials[currentIndex - 1];
      const tempOrder = testimonial.display_order;
      
      try {
        await supabase
          .from('testimonials')
          .update({ display_order: prevTestimonial.display_order })
          .eq('id', testimonialId);
        
        await supabase
          .from('testimonials')
          .update({ display_order: tempOrder })
          .eq('id', prevTestimonial.id);
        
        await fetchTestimonials();
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update display order');
      }
    } else if (direction === 'down' && currentIndex < sortedTestimonials.length - 1) {
      const nextTestimonial = sortedTestimonials[currentIndex + 1];
      const tempOrder = testimonial.display_order;
      
      try {
        await supabase
          .from('testimonials')
          .update({ display_order: nextTestimonial.display_order })
          .eq('id', testimonialId);
        
        await supabase
          .from('testimonials')
          .update({ display_order: tempOrder })
          .eq('id', nextTestimonial.id);
        
        await fetchTestimonials();
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update display order');
      }
    }
  };

  const openCreateDialog = () => {
    setSelectedTestimonial(null);
    form.reset({
      quote: '',
      author_name: '',
      author_role: '',
      company_name: '',
      company_logo_url: '',
      display_order: testimonials.length > 0 
        ? Math.max(...testimonials.map(t => t.display_order)) + 1 
        : 0,
      is_active: true,
      is_featured: false,
    });
    setImagePreview(null);
    setDialogOpen(true);
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'Active' : 'Inactive'}
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
        <title>Testimonials Management - Admin Dashboard</title>
        <meta name="description" content="Manage testimonials for the website pages." />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Testimonials Management</h1>
            <p className="text-muted-foreground">
              Manage testimonials displayed on Home, About, Services, and Industries pages
            </p>
          </div>
          <Button 
            onClick={openCreateDialog} 
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 focus:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Testimonial
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
              placeholder="Search testimonials..."
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
            </SelectContent>
          </Select>
          <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="not-featured">Not Featured</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Testimonials Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Testimonials ({filteredTestimonials.length})</CardTitle>
              <CardDescription>
                Manage all testimonials displayed on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Quote Preview</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTestimonials.map((testimonial, index) => (
                      <motion.tr
                        key={testimonial.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleOrderChange(testimonial.id, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium">{testimonial.display_order}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleOrderChange(testimonial.id, 'down')}
                              disabled={index === filteredTestimonials.length - 1}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-muted-foreground truncate">
                              {testimonial.quote.substring(0, 60)}...
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{testimonial.author_name}</div>
                            {testimonial.author_role && (
                              <div className="text-xs text-muted-foreground">{testimonial.author_role}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{testimonial.company_name}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(testimonial.is_active)}</TableCell>
                        <TableCell>
                          {testimonial.is_featured ? (
                            <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(testimonial.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedTestimonial(testimonial);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(testimonial)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedTestimonial(testimonial)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-md rounded-none border border-slate-200 bg-white shadow-2xl p-6">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this testimonial from {testimonial.company_name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setSelectedTestimonial(null)}>Cancel</AlertDialogCancel>
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

                {filteredTestimonials.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No testimonials found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={handleFormDialogChange}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none border border-slate-200 bg-white shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle>
                {selectedTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
              </DialogTitle>
              <DialogDescription>
                {selectedTestimonial ? 'Update testimonial details' : 'Add a new testimonial to the website'}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-4">
                <FormField
                  control={form.control}
                  name="quote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote/Testimonial Text</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter the testimonial quote..."
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="author_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. John Doe" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author_role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Role/Position (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. CEO, Director" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Cargill Corporation" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company Logo Upload Section */}
                <div className="space-y-2">
                  <Label>Company Logo (Optional)</Label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      {imagePreview || form.watch('company_logo_url') ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview || form.watch('company_logo_url') || ''}
                            alt="Preview"
                            className="h-24 w-32 object-contain bg-white border-2 border-slate-200 rounded p-2"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={handleDeleteImage}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="h-24 w-32 bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 rounded">
                          <ImageIcon className="h-8 w-8 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingImage ? 'Uploading...' : 'Upload Logo'}
                      </Button>
                      <FormField
                        control={form.control}
                        name="company_logo_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Or enter image URL</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="https://example.com/logo.png"
                                onChange={(e) => {
                                  field.onChange(e);
                                  setImagePreview(e.target.value || null);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="display_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            min={0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Show on website
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Show on homepage
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleFormDialogChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting || uploadingImage}
                    className="bg-primary text-white hover:bg-primary/90 focus:bg-primary/90"
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {selectedTestimonial ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      selectedTestimonial ? 'Update Testimonial' : 'Create Testimonial'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Testimonial Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={handleViewDialogChange}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none border border-slate-200 bg-white shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle>Testimonial Details</DialogTitle>
              <DialogDescription>
                View testimonial information
              </DialogDescription>
            </DialogHeader>

            {selectedTestimonial && (
              <div className="space-y-6">
                <div className="rounded-none border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    {selectedTestimonial.company_logo_url ? (
                      <img
                        src={selectedTestimonial.company_logo_url}
                        alt={selectedTestimonial.company_name}
                        className="h-28 w-32 object-contain bg-white border-2 border-slate-200 rounded p-2 flex-shrink-0"
                      />
                    ) : (
                      <div className="h-28 w-32 bg-slate-100 flex items-center justify-center border-2 border-slate-200 rounded flex-shrink-0">
                        <ImageIcon className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <blockquote className="text-slate-700 text-base leading-relaxed italic mb-4">
                        "{selectedTestimonial.quote}"
                      </blockquote>
                      <div className="border-t border-slate-200 pt-4">
                        <p className="font-bold text-slate-700">{selectedTestimonial.author_name}</p>
                        {selectedTestimonial.author_role && (
                          <p className="text-sm text-slate-600 mt-1">{selectedTestimonial.author_role}</p>
                        )}
                        <p className="text-sm text-primary font-semibold mt-1">{selectedTestimonial.company_name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Display Order</Label>
                    <p className="text-muted-foreground mt-1">
                      {selectedTestimonial.display_order}
                    </p>
                  </div>
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Created</Label>
                    <p className="text-muted-foreground mt-1">
                      {new Date(selectedTestimonial.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {getStatusBadge(selectedTestimonial.is_active)}
                  {selectedTestimonial.is_featured && (
                    <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

