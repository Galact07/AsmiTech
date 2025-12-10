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
  Layers,
  Image as ImageIcon,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
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

interface Technology {
  id: string;
  name: string;
  logo_image_url: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
  link_url: string | null;
  created_at: string;
  updated_at: string;
}

const technologySchema = z.object({
  name: z.string().min(1, 'Technology name is required'),
  logo_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
  link_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type TechnologyFormData = z.infer<typeof technologySchema>;

export default function TechnologyStackAdmin() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: '',
      logo_image_url: '',
      description: '',
      display_order: 0,
      is_active: true,
      link_url: '',
    },
  });

  const fetchTechnologies = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('technology_stack')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTechnologies(data || []);
    } catch (error) {
      console.error('Error fetching technologies:', error);
      toast.error('Failed to fetch technologies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechnologies();
    
    // Set up real-time subscriptions
    const technologiesChannel = supabase
      .channel('technology-stack-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'technology_stack' }, () => {
        fetchTechnologies();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(technologiesChannel);
    };
  }, [fetchTechnologies]);

  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = 
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && tech.is_active) ||
      (statusFilter === 'inactive' && !tech.is_active);
    
    return matchesSearch && matchesStatus;
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
      const fileName = `tech-logo-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('technology-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('technology-logos')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        form.setValue('logo_image_url', urlData.publicUrl);
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
    const currentUrl = form.getValues('logo_image_url');
    if (!currentUrl) return;

    try {
      // Extract file path from URL
      const urlParts = currentUrl.split('/');
      const fileName = urlParts[urlParts.length - 1].split('?')[0];

      // Delete from storage
      const { error } = await supabase.storage
        .from('technology-logos')
        .remove([fileName]);

      if (error) throw error;

      form.setValue('logo_image_url', '');
      setImagePreview(null);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (data: TechnologyFormData) => {
    try {
      const payload = {
        ...data,
        logo_image_url: data.logo_image_url || null,
        description: data.description || null,
        link_url: data.link_url || null,
      };

      if (selectedTechnology) {
        // Update existing technology
        const { error } = await supabase
          .from('technology_stack')
          .update(payload)
          .eq('id', selectedTechnology.id);

        if (error) throw error;
        toast.success('Technology updated successfully');
      } else {
        // Create new technology
        // Set display_order to max + 1 if not specified
        if (data.display_order === 0) {
          const maxOrder = technologies.length > 0 
            ? Math.max(...technologies.map(t => t.display_order)) 
            : 0;
          payload.display_order = maxOrder + 1;
        }

        const { error } = await supabase
          .from('technology_stack')
          .insert(payload);

        if (error) throw error;
        toast.success('Technology created successfully');
      }

      handleFormDialogChange(false);
      await fetchTechnologies();
    } catch (error) {
      console.error('Error saving technology:', error);
      toast.error('Failed to save technology');
    }
  };

  const handleFormDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedTechnology(null);
      form.reset();
      setImagePreview(null);
    }
  };

  const handleViewDialogChange = (open: boolean) => {
    setViewDialogOpen(open);
    if (!open) {
      setSelectedTechnology(null);
    }
  };

  const handleEdit = (tech: Technology) => {
    setSelectedTechnology(tech);
    form.reset({
      name: tech.name,
      logo_image_url: tech.logo_image_url || '',
      description: tech.description || '',
      display_order: tech.display_order,
      is_active: tech.is_active,
      link_url: tech.link_url || '',
    });
    setImagePreview(tech.logo_image_url);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTechnology) return;

    try {
      // Delete image from storage if exists
      if (selectedTechnology.logo_image_url) {
        const urlParts = selectedTechnology.logo_image_url.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0];
        await supabase.storage
          .from('technology-logos')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('technology_stack')
        .delete()
        .eq('id', selectedTechnology.id);

      if (error) throw error;

      toast.success('Technology deleted successfully');
      setSelectedTechnology(null);
      await fetchTechnologies();
    } catch (error) {
      console.error('Error deleting technology:', error);
      toast.error('Failed to delete technology');
    }
  };

  const handleOrderChange = async (techId: string, direction: 'up' | 'down') => {
    const tech = technologies.find(t => t.id === techId);
    if (!tech) return;

    const sortedTechnologies = [...technologies].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedTechnologies.findIndex(t => t.id === techId);
    
    if (direction === 'up' && currentIndex > 0) {
      const prevTech = sortedTechnologies[currentIndex - 1];
      const tempOrder = tech.display_order;
      
      try {
        await supabase
          .from('technology_stack')
          .update({ display_order: prevTech.display_order })
          .eq('id', techId);
        
        await supabase
          .from('technology_stack')
          .update({ display_order: tempOrder })
          .eq('id', prevTech.id);
        
        await fetchTechnologies();
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update display order');
      }
    } else if (direction === 'down' && currentIndex < sortedTechnologies.length - 1) {
      const nextTech = sortedTechnologies[currentIndex + 1];
      const tempOrder = tech.display_order;
      
      try {
        await supabase
          .from('technology_stack')
          .update({ display_order: nextTech.display_order })
          .eq('id', techId);
        
        await supabase
          .from('technology_stack')
          .update({ display_order: tempOrder })
          .eq('id', nextTech.id);
        
        await fetchTechnologies();
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update display order');
      }
    }
  };

  const openCreateDialog = () => {
    setSelectedTechnology(null);
    form.reset({
      name: '',
      logo_image_url: '',
      description: '',
      display_order: technologies.length > 0 
        ? Math.max(...technologies.map(t => t.display_order)) + 1 
        : 0,
      is_active: true,
      link_url: '',
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
        <title>Technology Stack Management - Admin Dashboard</title>
        <meta name="description" content="Manage technology stack displayed on the Services page." />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Technology Stack Management</h1>
            <p className="text-muted-foreground">
              Manage SAP technologies displayed on the Services page
            </p>
          </div>
          <Button 
            onClick={openCreateDialog} 
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 focus:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Technology
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
              placeholder="Search technologies..."
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
        </motion.div>

        {/* Technologies Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Technologies ({filteredTechnologies.length})</CardTitle>
              <CardDescription>
                Manage all technologies displayed on the Services page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Logo</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTechnologies.map((tech, index) => (
                      <motion.tr
                        key={tech.id}
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
                              onClick={() => handleOrderChange(tech.id, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium">{tech.display_order}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleOrderChange(tech.id, 'down')}
                              disabled={index === filteredTechnologies.length - 1}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {tech.logo_image_url ? (
                            <div className="w-16 h-16 bg-slate-50 rounded-none flex items-center justify-center p-2">
                              <img
                                src={tech.logo_image_url}
                                alt={tech.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-slate-100 rounded-none flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="font-medium text-sm">{tech.name}</p>
                            {tech.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {tech.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(tech.is_active)}</TableCell>
                        <TableCell>
                          {tech.link_url ? (
                            <a
                              href={tech.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span className="text-xs">Link</span>
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(tech.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedTechnology(tech);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(tech)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedTechnology(tech)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-md rounded-none border border-slate-200 bg-white shadow-2xl p-6">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Technology</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this technology? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setSelectedTechnology(null)}>Cancel</AlertDialogCancel>
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

                {filteredTechnologies.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No technologies found matching your criteria</p>
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
                {selectedTechnology ? 'Edit Technology' : 'Create New Technology'}
              </DialogTitle>
              <DialogDescription>
                {selectedTechnology ? 'Update technology details' : 'Add a new technology to the Services page'}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technology Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. SAP S/4HANA" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label>Logo Image</Label>
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative">
                        <div className="w-full h-48 bg-slate-50 rounded-none border border-slate-200 flex items-center justify-center p-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={handleDeleteImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-300 rounded-none p-8 text-center">
                        <ImageIcon className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                        <p className="text-sm text-slate-600 mb-4">Upload technology logo</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="flex items-center gap-2"
                        >
                          {uploadingImage ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Choose Image
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter a brief description of the technology..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    name="link_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/technology" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Show this technology on the Services page
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
                    disabled={form.formState.isSubmitting}
                    className="bg-primary text-white hover:bg-primary/90 focus:bg-primary/90"
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {selectedTechnology ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      selectedTechnology ? 'Update Technology' : 'Create Technology'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Technology Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={handleViewDialogChange}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none border border-slate-200 bg-white shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle>Technology Details</DialogTitle>
              <DialogDescription>
                View technology information
              </DialogDescription>
            </DialogHeader>

            {selectedTechnology && (
              <div className="space-y-6">
                {selectedTechnology.logo_image_url && (
                  <div className="w-full h-64 bg-slate-50 rounded-none border border-slate-200 flex items-center justify-center p-4">
                    <img
                      src={selectedTechnology.logo_image_url}
                      alt={selectedTechnology.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}

                <div className="rounded-none border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-700 mb-2">{selectedTechnology.name}</h3>
                  {selectedTechnology.description && (
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {selectedTechnology.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Display Order</Label>
                    <p className="text-muted-foreground mt-1">
                      {selectedTechnology.display_order}
                    </p>
                  </div>
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Created</Label>
                    <p className="text-muted-foreground mt-1">
                      {new Date(selectedTechnology.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedTechnology.link_url && (
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Link URL</Label>
                    <p className="text-muted-foreground mt-1">
                      <a
                        href={selectedTechnology.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-2"
                      >
                        {selectedTechnology.link_url}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </p>
                  </div>
                )}

                <div>
                  {getStatusBadge(selectedTechnology.is_active)}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

