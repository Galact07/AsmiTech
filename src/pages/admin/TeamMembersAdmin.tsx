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
  Users,
  Image as ImageIcon,
  Linkedin,
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

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  profile_image_url: string | null;
  linkedin_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().optional(),
  profile_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

export default function TeamMembersAdmin() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: '',
      role: '',
      bio: '',
      profile_image_url: '',
      linkedin_url: '',
      display_order: 0,
      is_active: true,
    },
  });

  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
    
    // Set up real-time subscriptions
    const teamMembersChannel = supabase
      .channel('team-members-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => {
        fetchTeamMembers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(teamMembersChannel);
    };
  }, [fetchTeamMembers]);

  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && member.is_active) ||
      (statusFilter === 'inactive' && !member.is_active);
    
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
      const fileName = `team-member-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('team-member-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('team-member-images')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        form.setValue('profile_image_url', urlData.publicUrl);
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
    const currentUrl = form.getValues('profile_image_url');
    if (!currentUrl) return;

    try {
      // Extract file path from URL
      const urlParts = currentUrl.split('/');
      const fileName = urlParts[urlParts.length - 1].split('?')[0];

      // Delete from storage
      const { error } = await supabase.storage
        .from('team-member-images')
        .remove([fileName]);

      if (error) throw error;

      form.setValue('profile_image_url', '');
      setImagePreview(null);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (data: TeamMemberFormData) => {
    try {
      const payload = {
        ...data,
        profile_image_url: data.profile_image_url || null,
        linkedin_url: data.linkedin_url || null,
        bio: data.bio || null,
      };

      if (selectedTeamMember) {
        // Update existing team member
        const { error } = await supabase
          .from('team_members')
          .update(payload)
          .eq('id', selectedTeamMember.id);

        if (error) throw error;
        toast.success('Team member updated successfully');
      } else {
        // Create new team member
        // Set display_order to max + 1 if not specified
        if (data.display_order === 0) {
          const maxOrder = teamMembers.length > 0 
            ? Math.max(...teamMembers.map(m => m.display_order)) 
            : 0;
          payload.display_order = maxOrder + 1;
        }

        const { error } = await supabase
          .from('team_members')
          .insert(payload);

        if (error) throw error;
        toast.success('Team member created successfully');
      }

      handleFormDialogChange(false);
      await fetchTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Failed to save team member');
    }
  };

  const handleFormDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedTeamMember(null);
      form.reset();
      setImagePreview(null);
    }
  };

  const handleViewDialogChange = (open: boolean) => {
    setViewDialogOpen(open);
    if (!open) {
      setSelectedTeamMember(null);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedTeamMember(member);
    form.reset({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      profile_image_url: member.profile_image_url || '',
      linkedin_url: member.linkedin_url || '',
      display_order: member.display_order,
      is_active: member.is_active,
    });
    setImagePreview(member.profile_image_url);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTeamMember) return;

    try {
      // Delete image from storage if exists
      if (selectedTeamMember.profile_image_url) {
        const urlParts = selectedTeamMember.profile_image_url.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0];
        await supabase.storage
          .from('team-member-images')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', selectedTeamMember.id);

      if (error) throw error;

      toast.success('Team member deleted successfully');
      setSelectedTeamMember(null);
      await fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  const handleOrderChange = async (memberId: string, direction: 'up' | 'down') => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    const sortedMembers = [...teamMembers].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedMembers.findIndex(m => m.id === memberId);
    
    if (direction === 'up' && currentIndex > 0) {
      const prevMember = sortedMembers[currentIndex - 1];
      const tempOrder = member.display_order;
      
      try {
        await supabase
          .from('team_members')
          .update({ display_order: prevMember.display_order })
          .eq('id', memberId);
        
        await supabase
          .from('team_members')
          .update({ display_order: tempOrder })
          .eq('id', prevMember.id);
        
        await fetchTeamMembers();
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update display order');
      }
    } else if (direction === 'down' && currentIndex < sortedMembers.length - 1) {
      const nextMember = sortedMembers[currentIndex + 1];
      const tempOrder = member.display_order;
      
      try {
        await supabase
          .from('team_members')
          .update({ display_order: nextMember.display_order })
          .eq('id', memberId);
        
        await supabase
          .from('team_members')
          .update({ display_order: tempOrder })
          .eq('id', nextMember.id);
        
        await fetchTeamMembers();
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update display order');
      }
    }
  };

  const openCreateDialog = () => {
    setSelectedTeamMember(null);
    form.reset({
      name: '',
      role: '',
      bio: '',
      profile_image_url: '',
      linkedin_url: '',
      display_order: teamMembers.length > 0 
        ? Math.max(...teamMembers.map(m => m.display_order)) + 1 
        : 0,
      is_active: true,
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
        <title>Team Members Management - Admin Dashboard</title>
        <meta name="description" content="Manage team members for the About page." />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Members Management</h1>
            <p className="text-muted-foreground">
              Manage team members displayed on the About page
            </p>
          </div>
          <Button 
            onClick={openCreateDialog} 
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 focus:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Team Member
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
              placeholder="Search team members..."
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

        {/* Team Members Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Team Members ({filteredTeamMembers.length})</CardTitle>
              <CardDescription>
                Manage all team members displayed on the About page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeamMembers.map((member, index) => (
                      <motion.tr
                        key={member.id}
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
                              onClick={() => handleOrderChange(member.id, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium">{member.display_order}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleOrderChange(member.id, 'down')}
                              disabled={index === filteredTeamMembers.length - 1}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.profile_image_url ? (
                            <img 
                              src={member.profile_image_url} 
                              alt={member.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                              {getInitials(member.name)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{member.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">{member.role}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(member.is_active)}</TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(member.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedTeamMember(member);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(member)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedTeamMember(member)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-md rounded-none border border-slate-200 bg-white shadow-2xl p-6">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{member.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setSelectedTeamMember(null)}>Cancel</AlertDialogCancel>
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

                {filteredTeamMembers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No team members found matching your criteria</p>
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
                {selectedTeamMember ? 'Edit Team Member' : 'Create New Team Member'}
              </DialogTitle>
              <DialogDescription>
                {selectedTeamMember ? 'Update team member details' : 'Add a new team member to the About page'}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role/Position</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Managing Director" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio/Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter a brief description of the team member..."
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label>Profile Image</Label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      {imagePreview || form.watch('profile_image_url') ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview || form.watch('profile_image_url') || ''}
                            alt="Preview"
                            className="h-24 w-24 rounded-full object-cover border-2 border-slate-200"
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
                        <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
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
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      </Button>
                      <FormField
                        control={form.control}
                        name="profile_image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">Or enter image URL</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="https://example.com/image.jpg"
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

                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://www.linkedin.com/in/username" />
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
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Show this member on the About page
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
                        {selectedTeamMember ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      selectedTeamMember ? 'Update Member' : 'Create Member'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Team Member Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={handleViewDialogChange}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none border border-slate-200 bg-white shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle>{selectedTeamMember?.name}</DialogTitle>
              <DialogDescription>
                Team member details and information
              </DialogDescription>
            </DialogHeader>

            {selectedTeamMember && (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  {selectedTeamMember.profile_image_url ? (
                    <img
                      src={selectedTeamMember.profile_image_url}
                      alt={selectedTeamMember.name}
                      className="h-32 w-32 rounded-full object-cover border-2 border-slate-200"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold">
                      {getInitials(selectedTeamMember.name)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{selectedTeamMember.name}</h3>
                    <p className="text-lg text-primary mt-1">{selectedTeamMember.role}</p>
                    <div className="mt-3">
                      {getStatusBadge(selectedTeamMember.is_active)}
                    </div>
                  </div>
                </div>

                {selectedTeamMember.bio && (
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Bio</Label>
                    <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                      {selectedTeamMember.bio}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Display Order</Label>
                    <p className="text-muted-foreground mt-1">
                      {selectedTeamMember.display_order}
                    </p>
                  </div>
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">Created</Label>
                    <p className="text-muted-foreground mt-1">
                      {new Date(selectedTeamMember.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedTeamMember.linkedin_url && (
                  <div className="rounded-none border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium">LinkedIn</Label>
                    <a
                      href={selectedTeamMember.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline mt-2"
                    >
                      <Linkedin className="h-4 w-4" />
                      View Profile
                    </a>
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

