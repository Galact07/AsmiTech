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
  Factory,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
  ShoppingBag,
  Flame,
  Pill,
  FlaskConical,
  Landmark,
  Truck,
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

interface Industry {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  features: string[];
  hero_image_url: string | null;
  display_order: number;
  is_active: boolean;
  content_sections: any | null;
  created_at: string;
  updated_at: string;
}

const industrySchema = z.object({
  name: z.string().min(1, 'Industry name is required'),
  description: z.string().min(1, 'Description is required'),
  icon_name: z.string().min(1, 'Icon selection is required'),
  features: z.array(z.string().min(1, 'Feature cannot be empty')),
  hero_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
  content_sections: z.any().optional(),
});

type IndustryFormData = z.infer<typeof industrySchema>;

// Icon options for the select dropdown
const iconOptions = [
  { value: 'ShoppingBag', label: 'Shopping Bag', icon: ShoppingBag },
  { value: 'Flame', label: 'Flame', icon: Flame },
  { value: 'Pill', label: 'Pill', icon: Pill },
  { value: 'FlaskConical', label: 'Flask Conical', icon: FlaskConical },
  { value: 'Landmark', label: 'Landmark', icon: Landmark },
  { value: 'Truck', label: 'Truck', icon: Truck },
  { value: 'Factory', label: 'Factory', icon: Factory },
];

export default function IndustriesAdmin() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<IndustryFormData>({
    resolver: zodResolver(industrySchema),
    defaultValues: {
      name: '',
      description: '',
      icon_name: '',
      features: [],
      hero_image_url: '',
      display_order: 0,
      is_active: true,
      content_sections: null,
    },
  });

  const fetchIndustries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('industries' as any)
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Ensure features is always an array
      const industriesWithFeatures = ((data || []) as any[]).map((industry: any) => ({
        ...industry,
        features: Array.isArray(industry.features) ? industry.features : [],
      })) as Industry[];
      setIndustries(industriesWithFeatures);
    } catch (error) {
      console.error('Error fetching industries:', error);
      toast.error('Failed to fetch industries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndustries();
    
    // Set up real-time subscriptions
    const industriesChannel = supabase
      .channel('industries-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'industries' as any }, () => {
        fetchIndustries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(industriesChannel);
    };
  }, [fetchIndustries]);

  const filteredIndustries = industries.filter(industry => {
    const matchesSearch = 
      industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && industry.is_active) ||
      (statusFilter === 'inactive' && !industry.is_active);
    
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
      const fileName = `industry-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('industry-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('industry-images')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        form.setValue('hero_image_url', urlData.publicUrl);
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
    const currentUrl = form.getValues('hero_image_url');
    if (!currentUrl) return;

    try {
      // Extract file path from URL
      const urlParts = currentUrl.split('/');
      const fileName = urlParts[urlParts.length - 1].split('?')[0];

      // Delete from storage
      const { error } = await supabase.storage
        .from('industry-images')
        .remove([fileName]);

      if (error) throw error;

      form.setValue('hero_image_url', '');
      setImagePreview(null);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (data: IndustryFormData) => {
    try {
      const payload = {
        ...data,
        hero_image_url: data.hero_image_url || null,
        features: data.features || [],
        content_sections: data.content_sections || null,
      };

      if (selectedIndustry) {
        // Update existing industry
        const { error } = await supabase
          .from('industries' as any)
          .update(payload)
          .eq('id', selectedIndustry.id);

        if (error) throw error;
        toast.success('Industry updated successfully');
      } else {
        // Create new industry
        // Set display_order to max + 1 if not specified
        if (data.display_order === 0) {
          const maxOrder = industries.length > 0 
            ? Math.max(...industries.map(i => i.display_order)) 
            : 0;
          payload.display_order = maxOrder + 1;
        }

        const { error } = await supabase
          .from('industries' as any)
          .insert(payload);

        if (error) throw error;
        toast.success('Industry created successfully');
      }

      handleFormDialogChange(false);
      await fetchIndustries();
    } catch (error) {
      console.error('Error saving industry:', error);
      toast.error('Failed to save industry');
    }
  };

  const handleFormDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedIndustry(null);
      form.reset();
      setImagePreview(null);
    }
  };

  const handleViewDialogChange = (open: boolean) => {
    setViewDialogOpen(open);
    if (!open) {
      setSelectedIndustry(null);
    }
  };

  const handleEdit = (industry: Industry) => {
    setSelectedIndustry(industry);
    form.reset({
      name: industry.name,
      description: industry.description,
      icon_name: industry.icon_name,
      features: Array.isArray(industry.features) ? industry.features : [],
      hero_image_url: industry.hero_image_url || '',
      display_order: industry.display_order,
      is_active: industry.is_active,
      content_sections: industry.content_sections || null,
    });
    setImagePreview(industry.hero_image_url);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedIndustry) return;

    try {
      // Delete image from storage if exists
      if (selectedIndustry.hero_image_url) {
        const urlParts = selectedIndustry.hero_image_url.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0];
        await supabase.storage
          .from('industry-images')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('industries' as any)
        .delete()
        .eq('id', selectedIndustry.id);

      if (error) throw error;

      toast.success('Industry deleted successfully');
      setSelectedIndustry(null);
      await fetchIndustries();
    } catch (error) {
      console.error('Error deleting industry:', error);
      toast.error('Failed to delete industry');
    }
  };

  const handleOrderChange = async (industryId: string, direction: 'up' | 'down') => {
    const industry = industries.find(i => i.id === industryId);
    if (!industry) return;

    const sortedIndustries = [...industries].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedIndustries.findIndex(i => i.id === industryId);
    
    if (direction === 'up' && currentIndex > 0) {
      const prevIndustry = sortedIndustries[currentIndex - 1];
      const tempOrder = industry.display_order;
      
      try {
        await supabase
          .from('industries' as any)
          .update({ display_order: prevIndustry.display_order })
          .eq('id', industryId);
        
        await supabase
          .from('industries' as any)
          .update({ display_order: tempOrder })
          .eq('id', prevIndustry.id);
        
        await fetchIndustries();
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update display order');
      }
    } else if (direction === 'down' && currentIndex < sortedIndustries.length - 1) {
      const nextIndustry = sortedIndustries[currentIndex + 1];
      const tempOrder = industry.display_order;
      
      try {
        await supabase
          .from('industries' as any)
          .update({ display_order: nextIndustry.display_order })
          .eq('id', industryId);
        
        await supabase
          .from('industries' as any)
          .update({ display_order: tempOrder })
          .eq('id', nextIndustry.id);
        
        await fetchIndustries();
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update display order');
      }
    }
  };

  const openCreateDialog = () => {
    setSelectedIndustry(null);
    form.reset({
      name: '',
      description: '',
      icon_name: '',
      features: [],
      hero_image_url: '',
      display_order: industries.length > 0 
        ? Math.max(...industries.map(i => i.display_order)) + 1 
        : 0,
      is_active: true,
      content_sections: null,
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

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Factory;
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
        <title>Industries Management - Admin Dashboard</title>
        <meta name="description" content="Manage industries displayed on the Home and Industries pages." />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Industries Management</h1>
            <p className="text-muted-foreground">
              Manage industries displayed on the Home and Industries pages
            </p>
          </div>
          <Button 
            onClick={openCreateDialog} 
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 focus:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Industry
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
              placeholder="Search industries..."
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

        {/* Industries Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Industries ({filteredIndustries.length})</CardTitle>
              <CardDescription>
                Manage all industries displayed on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Icon</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIndustries.map((industry, index) => {
                      const IconComponent = getIconComponent(industry.icon_name);
                      return (
                        <motion.tr
                          key={industry.id}
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
                                onClick={() => handleOrderChange(industry.id, 'up')}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium">{industry.display_order}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleOrderChange(industry.id, 'down')}
                                disabled={index === filteredIndustries.length - 1}
                              >
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <IconComponent className="h-5 w-5 text-primary" />
                          </TableCell>
                          <TableCell>
                            <div className="max-w-md">
                              <p className="font-medium text-sm">{industry.name}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {industry.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-muted-foreground">
                              {industry.features.length} feature{industry.features.length !== 1 ? 's' : ''}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(industry.is_active)}</TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {new Date(industry.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedIndustry(industry);
                                  setViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(industry)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedIndustry(industry)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-md rounded-none border border-slate-200 bg-white shadow-2xl p-6">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Industry</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this industry? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setSelectedIndustry(null)}>Cancel</AlertDialogCancel>
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
                      );
                    })}
                  </TableBody>
                </Table>

                {filteredIndustries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Factory className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No industries found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={handleFormDialogChange}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-none border border-slate-200 bg-white shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle>
                {selectedIndustry ? 'Edit Industry' : 'Create New Industry'}
              </DialogTitle>
              <DialogDescription>
                {selectedIndustry ? 'Update industry details' : 'Add a new industry to the Home and Industries pages'}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Retail & Consumer Goods" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="icon_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {iconOptions.map((option) => {
                              const IconComponent = option.icon;
                              return (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4" />
                                    <span>{option.label}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter industry description..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Features Array */}
                <div className="space-y-2">
                  <Label>Features</Label>
                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-2">
                            {field.value.map((feature, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={feature}
                                  onChange={(e) => {
                                    const newFeatures = [...field.value];
                                    newFeatures[index] = e.target.value;
                                    field.onChange(newFeatures);
                                  }}
                                  placeholder={`Feature ${index + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    const newFeatures = field.value.filter((_, i) => i !== index);
                                    field.onChange(newFeatures);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                field.onChange([...field.value, '']);
                              }}
                              className="w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Feature
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hero Image Upload */}
                <div className="space-y-2">
                  <Label>Hero Image</Label>
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative">
                        <div className="w-full h-64 bg-slate-50 rounded-none border border-slate-200 flex items-center justify-center p-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-full object-cover rounded-none"
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
                        <p className="text-sm text-slate-600 mb-4">Upload industry hero image</p>
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
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Show this industry on the Home and Industries pages
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
                        {selectedIndustry ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      selectedIndustry ? 'Update Industry' : 'Create Industry'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Industry Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={handleViewDialogChange}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none border border-slate-200 bg-white shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle>Industry Details</DialogTitle>
              <DialogDescription>
                View industry information
              </DialogDescription>
            </DialogHeader>

            {selectedIndustry && (
              <div className="space-y-6">
                {selectedIndustry.hero_image_url && (
                  <div className="w-full h-64 bg-slate-50 rounded-none border border-slate-200 flex items-center justify-center p-4">
                    <img
                      src={selectedIndustry.hero_image_url}
                      alt={selectedIndustry.name}
                      className="max-w-full max-h-full object-cover rounded-none"
                    />
                  </div>
                )}

                <div className="rounded-none border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    {(() => {
                      const IconComponent = getIconComponent(selectedIndustry.icon_name);
                      return <IconComponent className="h-6 w-6 text-primary" />;
                    })()}
                    <h3 className="text-lg font-bold text-slate-700">{selectedIndustry.name}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {selectedIndustry.description}
                  </p>
                </div>

                {selectedIndustry.features && selectedIndustry.features.length > 0 && (
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium mb-2 block">Features</Label>
                    <ul className="space-y-2">
                      {selectedIndustry.features.map((feature, index) => (
                        <li key={index} className="text-sm text-slate-600">• {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Display Order</Label>
                    <p className="text-muted-foreground mt-1">
                      {selectedIndustry.display_order}
                    </p>
                  </div>
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Created</Label>
                    <p className="text-muted-foreground mt-1">
                      {new Date(selectedIndustry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  {getStatusBadge(selectedIndustry.is_active)}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

