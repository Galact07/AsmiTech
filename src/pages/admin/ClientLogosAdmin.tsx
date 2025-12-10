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
  Building2,
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

interface ClientLogo {
  id: string;
  company_name: string;
  logo_image_url: string | null;
  logo_file_name: string | null;
  display_order: number;
  is_active: boolean;
  website_url: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

const clientLogoSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  logo_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  logo_file_name: z.string().optional(),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
  website_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  category: z.string().optional(),
});

type ClientLogoFormData = z.infer<typeof clientLogoSchema>;

export default function ClientLogosAdmin() {
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedClientLogo, setSelectedClientLogo] = useState<ClientLogo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ClientLogoFormData>({
    resolver: zodResolver(clientLogoSchema),
    defaultValues: {
      company_name: '',
      logo_image_url: '',
      logo_file_name: '',
      display_order: 0,
      is_active: true,
      website_url: '',
      category: '',
    },
  });

  const fetchClientLogos = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClientLogos(data || []);
    } catch (error) {
      console.error('Error fetching client logos:', error);
      toast.error('Failed to fetch client logos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientLogos();
    
    // Set up real-time subscriptions
    const clientLogosChannel = supabase
      .channel('client-logos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_logos' }, () => {
        fetchClientLogos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(clientLogosChannel);
    };
  }, [fetchClientLogos]);

  const filteredClientLogos = clientLogos.filter(logo => {
    const matchesSearch = 
      logo.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      logo.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && logo.is_active) ||
      (statusFilter === 'inactive' && !logo.is_active);
    
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
      const fileName = `client-logo-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase storage
      const { error: uploadError, data: uploadData } = await supabase.storage
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
        form.setValue('logo_image_url', urlData.publicUrl);
        form.setValue('logo_file_name', file.name);
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
        .from('client-logos')
        .remove([fileName]);

      if (error) throw error;

      form.setValue('logo_image_url', '');
      form.setValue('logo_file_name', '');
      setImagePreview(null);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (data: ClientLogoFormData) => {
    try {
      const payload = {
        ...data,
        logo_image_url: data.logo_image_url || null,
        logo_file_name: data.logo_file_name || null,
        website_url: data.website_url || null,
        category: data.category || null,
      };

      if (selectedClientLogo) {
        // Update existing client logo
        const { error } = await supabase
          .from('client_logos')
          .update(payload)
          .eq('id', selectedClientLogo.id);

        if (error) throw error;
        toast.success('Client logo updated successfully');
      } else {
        // Create new client logo
        // Set display_order to max + 1 if not specified
        if (data.display_order === 0) {
          const maxOrder = clientLogos.length > 0 
            ? Math.max(...clientLogos.map(l => l.display_order)) 
            : 0;
          payload.display_order = maxOrder + 1;
        }

        const { error } = await supabase
          .from('client_logos')
          .insert(payload);

        if (error) throw error;
        toast.success('Client logo created successfully');
      }

      handleFormDialogChange(false);
      await fetchClientLogos();
    } catch (error) {
      console.error('Error saving client logo:', error);
      toast.error('Failed to save client logo');
    }
  };

  const handleFormDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedClientLogo(null);
      form.reset();
      setImagePreview(null);
    }
  };

  const handleViewDialogChange = (open: boolean) => {
    setViewDialogOpen(open);
    if (!open) {
      setSelectedClientLogo(null);
    }
  };

  const handleEdit = (logo: ClientLogo) => {
    setSelectedClientLogo(logo);
    form.reset({
      company_name: logo.company_name,
      logo_image_url: logo.logo_image_url || '',
      logo_file_name: logo.logo_file_name || '',
      display_order: logo.display_order,
      is_active: logo.is_active,
      website_url: logo.website_url || '',
      category: logo.category || '',
    });
    setImagePreview(logo.logo_image_url);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedClientLogo) return;

    try {
      // Delete image from storage if exists
      if (selectedClientLogo.logo_image_url) {
        const urlParts = selectedClientLogo.logo_image_url.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0];
        await supabase.storage
          .from('client-logos')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('client_logos')
        .delete()
        .eq('id', selectedClientLogo.id);

      if (error) throw error;

      toast.success('Client logo deleted successfully');
      setSelectedClientLogo(null);
      await fetchClientLogos();
    } catch (error) {
      console.error('Error deleting client logo:', error);
      toast.error('Failed to delete client logo');
    }
  };

  const handleOrderChange = async (logoId: string, direction: 'up' | 'down') => {
    const logo = clientLogos.find(l => l.id === logoId);
    if (!logo) return;

    const sortedLogos = [...clientLogos].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedLogos.findIndex(l => l.id === logoId);
    
    if (direction === 'up' && currentIndex > 0) {
      const prevLogo = sortedLogos[currentIndex - 1];
      const tempOrder = logo.display_order;
      
      try {
        await supabase
          .from('client_logos')
          .update({ display_order: prevLogo.display_order })
          .eq('id', logoId);
        
        await supabase
          .from('client_logos')
          .update({ display_order: tempOrder })
          .eq('id', prevLogo.id);
        
        await fetchClientLogos();
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update display order');
      }
    } else if (direction === 'down' && currentIndex < sortedLogos.length - 1) {
      const nextLogo = sortedLogos[currentIndex + 1];
      const tempOrder = logo.display_order;
      
      try {
        await supabase
          .from('client_logos')
          .update({ display_order: nextLogo.display_order })
          .eq('id', logoId);
        
        await supabase
          .from('client_logos')
          .update({ display_order: tempOrder })
          .eq('id', nextLogo.id);
        
        await fetchClientLogos();
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update display order');
      }
    }
  };

  const openCreateDialog = () => {
    setSelectedClientLogo(null);
    form.reset({
      company_name: '',
      logo_image_url: '',
      logo_file_name: '',
      display_order: clientLogos.length > 0 
        ? Math.max(...clientLogos.map(l => l.display_order)) + 1 
        : 0,
      is_active: true,
      website_url: '',
      category: '',
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
        <title>Client Logos Management - Admin Dashboard</title>
        <meta name="description" content="Manage client/partner logos for the Home and Services pages." />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Logos Management</h1>
            <p className="text-muted-foreground">
              Manage client/partner logos displayed on Home and Services pages
            </p>
          </div>
          <Button 
            onClick={openCreateDialog} 
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 focus:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Client Logo
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
              placeholder="Search client logos..."
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

        {/* Client Logos Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Client Logos ({filteredClientLogos.length})</CardTitle>
              <CardDescription>
                Manage all client/partner logos displayed on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Logo</TableHead>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClientLogos.map((logo, index) => (
                      <motion.tr
                        key={logo.id}
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
                              onClick={() => handleOrderChange(logo.id, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium">{logo.display_order}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleOrderChange(logo.id, 'down')}
                              disabled={index === filteredClientLogos.length - 1}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {logo.logo_image_url ? (
                            <img 
                              src={logo.logo_image_url} 
                              alt={logo.company_name}
                              className="h-12 w-24 object-contain bg-white rounded border border-slate-200 p-1"
                            />
                          ) : (
                            <div className="h-12 w-24 bg-slate-100 rounded flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-slate-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{logo.company_name}</div>
                        </TableCell>
                        <TableCell>
                          {logo.category ? (
                            <Badge variant="outline">{logo.category}</Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(logo.is_active)}</TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(logo.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedClientLogo(logo);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(logo)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedClientLogo(logo)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-md rounded-none border border-slate-200 bg-white shadow-2xl p-6">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Client Logo</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{logo.company_name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setSelectedClientLogo(null)}>Cancel</AlertDialogCancel>
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

                {filteredClientLogos.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No client logos found matching your criteria</p>
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
                {selectedClientLogo ? 'Edit Client Logo' : 'Create New Client Logo'}
              </DialogTitle>
              <DialogDescription>
                {selectedClientLogo ? 'Update client logo details' : 'Add a new client/partner logo to the website'}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-4">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Cargill" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label>Logo Image</Label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      {imagePreview || form.watch('logo_image_url') ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview || form.watch('logo_image_url') || ''}
                            alt="Preview"
                            className="h-24 w-48 object-contain bg-white border-2 border-slate-200 rounded p-2"
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
                        <div className="h-24 w-48 bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 rounded">
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
                        name="logo_image_url"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="website_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://www.company.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category/Industry (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Manufacturing, Retail" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Show this logo on the website
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
                        {selectedClientLogo ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      selectedClientLogo ? 'Update Logo' : 'Create Logo'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Client Logo Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={handleViewDialogChange}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none border border-slate-200 bg-white shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle>{selectedClientLogo?.company_name}</DialogTitle>
              <DialogDescription>
                Client logo details and information
              </DialogDescription>
            </DialogHeader>

            {selectedClientLogo && (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  {selectedClientLogo.logo_image_url ? (
                    <img
                      src={selectedClientLogo.logo_image_url}
                      alt={selectedClientLogo.company_name}
                      className="h-32 w-64 object-contain bg-white border-2 border-slate-200 rounded p-4"
                    />
                  ) : (
                    <div className="h-32 w-64 bg-slate-100 flex items-center justify-center border-2 border-slate-200 rounded">
                      <ImageIcon className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{selectedClientLogo.company_name}</h3>
                    {selectedClientLogo.category && (
                      <div className="mt-2">
                        <Badge variant="outline">{selectedClientLogo.category}</Badge>
                      </div>
                    )}
                    <div className="mt-3">
                      {getStatusBadge(selectedClientLogo.is_active)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Display Order</Label>
                    <p className="text-muted-foreground mt-1">
                      {selectedClientLogo.display_order}
                    </p>
                  </div>
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Created</Label>
                    <p className="text-muted-foreground mt-1">
                      {new Date(selectedClientLogo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedClientLogo.website_url && (
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Website</Label>
                    <a
                      href={selectedClientLogo.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline mt-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {selectedClientLogo.website_url}
                    </a>
                  </div>
                )}

                {selectedClientLogo.logo_file_name && (
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">File Name</Label>
                    <p className="text-muted-foreground mt-1">
                      {selectedClientLogo.logo_file_name}
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

