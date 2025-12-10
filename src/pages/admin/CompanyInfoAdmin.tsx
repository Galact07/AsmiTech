import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Building,
  Plus,
  X,
  Save,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface CompanyInfo {
  id: string;
  company_name: string;
  netherlands_address: string;
  india_address: string;
  phone_number: string;
  email_address: string;
  linkedin_url: string;
  other_social_links: Array<{ platform: string; url: string }> | null;
  copyright_text: string | null;
  created_at: string;
  updated_at: string;
}

const companyInfoSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  netherlands_address: z.string().min(1, 'Netherlands address is required'),
  india_address: z.string().min(1, 'India address is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  email_address: z.string().email('Must be a valid email address'),
  linkedin_url: z.string().url('Must be a valid URL'),
  other_social_links: z.array(z.object({
    platform: z.string().min(1, 'Platform name is required'),
    url: z.string().url('Must be a valid URL'),
  })).optional(),
  copyright_text: z.string().optional(),
});

type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;

export default function CompanyInfoAdmin() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      company_name: '',
      netherlands_address: '',
      india_address: '',
      phone_number: '',
      email_address: '',
      linkedin_url: '',
      other_social_links: [],
      copyright_text: '',
    },
  });

  const fetchCompanyInfo = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_info' as any)
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      if (data) {
        setCompanyInfo(data as CompanyInfo);
        form.reset({
          company_name: data.company_name,
          netherlands_address: data.netherlands_address,
          india_address: data.india_address,
          phone_number: data.phone_number,
          email_address: data.email_address,
          linkedin_url: data.linkedin_url,
          other_social_links: Array.isArray(data.other_social_links) ? data.other_social_links : [],
          copyright_text: data.copyright_text || '',
        });
      } else {
        // No record exists, form will be empty
        setCompanyInfo(null);
        form.reset({
          company_name: '',
          netherlands_address: '',
          india_address: '',
          phone_number: '',
          email_address: '',
          linkedin_url: '',
          other_social_links: [],
          copyright_text: '',
        });
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
      toast.error('Failed to fetch company information');
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchCompanyInfo();
    
    // Set up real-time subscriptions
    const companyInfoChannel = supabase
      .channel('company-info-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'company_info' as any }, () => {
        fetchCompanyInfo();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(companyInfoChannel);
    };
  }, [fetchCompanyInfo]);

  const handleSubmit = async (data: CompanyInfoFormData) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        other_social_links: data.other_social_links || [],
        copyright_text: data.copyright_text || null,
      };

      if (companyInfo) {
        // Update existing record
        const { error } = await supabase
          .from('company_info' as any)
          .update(payload)
          .eq('id', companyInfo.id);

        if (error) throw error;
        toast.success('Company information updated successfully');
      } else {
        // Create new record
        const { error } = await supabase
          .from('company_info' as any)
          .insert(payload);

        if (error) throw error;
        toast.success('Company information created successfully');
      }

      await fetchCompanyInfo();
    } catch (error) {
      console.error('Error saving company info:', error);
      toast.error('Failed to save company information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Company Information - Admin Dashboard</title>
        <meta name="description" content="Manage company information displayed in Footer and Header." />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Company Information</h1>
            <p className="text-muted-foreground">
              Manage company details displayed in the Footer and Header
            </p>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {companyInfo ? 'Edit Company Information' : 'Create Company Information'}
              </CardTitle>
              <CardDescription>
                {companyInfo 
                  ? 'Update company information displayed across the website'
                  : 'Add company information to display in Footer and Header'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. ASMI Technology Consulting" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="netherlands_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Netherlands Office Address</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter Netherlands office address..."
                              rows={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="india_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>India Office Address</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter India office address..."
                              rows={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. +31-622098973" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} placeholder="e.g. info@asmitechconsulting.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://www.linkedin.com/company/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Other Social Media Links */}
                  {/* <div className="space-y-2">
                    <Label>Other Social Media Links (Optional)</Label>
                    <FormField
                      control={form.control}
                      name="other_social_links"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="space-y-3">
                              {field.value?.map((link, index) => (
                                <div key={index} className="flex gap-2">
                                  <Input
                                    value={link.platform}
                                    onChange={(e) => {
                                      const newLinks = [...(field.value || [])];
                                      newLinks[index] = { ...newLinks[index], platform: e.target.value };
                                      field.onChange(newLinks);
                                    }}
                                    placeholder="Platform (e.g. Twitter, Facebook)"
                                    className="flex-1"
                                  />
                                  <Input
                                    value={link.url}
                                    onChange={(e) => {
                                      const newLinks = [...(field.value || [])];
                                      newLinks[index] = { ...newLinks[index], url: e.target.value };
                                      field.onChange(newLinks);
                                    }}
                                    placeholder="https://..."
                                    className="flex-2"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                      const newLinks = field.value?.filter((_, i) => i !== index) || [];
                                      field.onChange(newLinks);
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
                                  field.onChange([...(field.value || []), { platform: '', url: '' }]);
                                }}
                                className="w-full"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Social Media Link
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> */}

                  <FormField
                    control={form.control}
                    name="copyright_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Copyright Text (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Leave empty to use default: © 2025 {Company Name} All Rights Reserved"
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button 
                      type="submit" 
                      disabled={saving || form.formState.isSubmitting}
                      className="bg-primary text-white hover:bg-primary/90 focus:bg-primary/90"
                    >
                      {saving || form.formState.isSubmitting ? (
                        <div className="flex items-center">
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          {companyInfo ? 'Updating...' : 'Creating...'}
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {companyInfo ? 'Update Company Info' : 'Create Company Info'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Current Information Preview */}
          {companyInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Current Information</CardTitle>
                  <CardDescription>
                    Preview of how company information appears on the website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Company Name</Label>
                      <p className="text-sm font-medium mt-1">{companyInfo.company_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                      <p className="text-sm font-medium mt-1">{companyInfo.phone_number}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                      <p className="text-sm font-medium mt-1">{companyInfo.email_address}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">LinkedIn URL</Label>
                      <p className="text-sm font-medium mt-1 break-all">{companyInfo.linkedin_url}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Netherlands Address</Label>
                    <p className="text-sm mt-1 whitespace-pre-line">{companyInfo.netherlands_address}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">India Address</Label>
                    <p className="text-sm mt-1 whitespace-pre-line">{companyInfo.india_address}</p>
                  </div>
                  {companyInfo.other_social_links && companyInfo.other_social_links.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Other Social Links</Label>
                      <div className="mt-1 space-y-1">
                        {companyInfo.other_social_links.map((link, index) => (
                          <p key={index} className="text-sm">
                            <span className="font-medium">{link.platform}:</span> {link.url}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {companyInfo.copyright_text && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Copyright Text</Label>
                      <p className="text-sm mt-1">{companyInfo.copyright_text}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}

