import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Edit, Trash2, ExternalLink, Info, Image, Layers, Share2,
  CheckCircle, ShieldCheck, Sparkles, BarChart3, GaugeCircle, 
  Users, Zap, Award, Target, Rocket, Globe, Lock, TrendingUp,
  Clock, DollarSign, Star, Heart, Shield, Lightbulb, Settings,
  MessageCircle, ThumbsUp, Briefcase, Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';

type CoreOffering = {
  title?: string;
  description?: string;
  link?: string;
};

type BenefitItem = {
  title?: string;
  description?: string;
  icon?: string;
};

type ProcessStep = {
  title?: string;
  description?: string;
};

type CaseStudyItem = {
  title?: string;
  problem?: string;
  solution?: string;
  result?: string;
  link?: string;
};

type TechStackItem = {
  name?: string;
  description?: string;
  logo?: string;
  link?: string;
};

type WhyChooseItem = {
  title?: string;
  description?: string;
  icon?: string;
};

type SocialProofLogo = {
  name?: string;
  logo?: string;
  url?: string;
};

type TestimonialItem = {
  quote?: string;
  author?: string;
  company?: string;
  role?: string;
};

const ICON_OPTIONS = [
  { label: '✓ Checkmark', value: 'check-circle', category: 'General' },
  { label: '🛡️ Shield Check', value: 'shield-check', category: 'Security' },
  { label: '✨ Sparkles', value: 'sparkles', category: 'General' },
  { label: '📊 Analytics', value: 'bar-chart-3', category: 'Data' },
  { label: '⚡ Speed', value: 'gauge-circle', category: 'Performance' },
  { label: '👥 Team', value: 'users', category: 'People' },
  { label: '⚡ Energy', value: 'zap', category: 'Performance' },
  { label: '🏆 Award', value: 'award', category: 'Achievement' },
  { label: '🎯 Target', value: 'target', category: 'Strategy' },
  { label: '🚀 Rocket', value: 'rocket', category: 'Innovation' },
  { label: '🌍 Globe', value: 'globe', category: 'Global' },
  { label: '🔒 Lock', value: 'lock', category: 'Security' },
  { label: '📈 Trending Up', value: 'trending-up', category: 'Growth' },
  { label: '⏱️ Clock', value: 'clock', category: 'Time' },
  { label: '💰 Dollar', value: 'dollar-sign', category: 'Finance' },
  { label: '⭐ Star', value: 'star', category: 'Quality' },
  { label: '❤️ Heart', value: 'heart', category: 'Care' },
  { label: '🛡️ Shield', value: 'shield', category: 'Security' },
  { label: '💡 Lightbulb', value: 'lightbulb', category: 'Innovation' },
  { label: '⚙️ Settings', value: 'settings', category: 'Technical' },
  { label: '💬 Message', value: 'message-circle', category: 'Communication' },
  { label: '👍 Thumbs Up', value: 'thumbs-up', category: 'Approval' },
  { label: '💼 Briefcase', value: 'briefcase', category: 'Business' },
  { label: '📊 Activity', value: 'activity', category: 'Performance' },
];

const baseFormState: Partial<ServicePage> = {
  slug: '',
  title: '',
  status: 'draft',
  hero_headline: '',
  hero_subheadline: '',
  hero_cta_text: 'Get Started',
  hero_image_url: '',
  introduction_title: 'Why This Service',
  introduction_content: '',
  differentiator_title: 'What Makes It Unique',
  differentiator_content: '',
  differentiator_video_url: null,
  core_offerings: [] as CoreOffering[],
  benefits: [] as BenefitItem[],
  process_steps: [] as ProcessStep[],
  case_studies: [] as CaseStudyItem[],
  tech_stack: [] as TechStackItem[],
  why_choose_us: [] as WhyChooseItem[],
  consultation_title: 'Book a Free Consultation',
  consultation_description: '',
  social_proof_logos: [] as SocialProofLogo[],
  testimonials: [] as TestimonialItem[],
  final_cta_title: '',
  final_cta_description: '',
  final_cta_button_text: 'Contact Us Now',
  meta_description: '',
  display_order: 0,
  mini_cta_text: '',
  mini_cta_subtext: '',
  mini_cta_link: '',
};

interface ServicePage {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_text: string;
  hero_image_url: string;
  introduction_title: string;
  introduction_content: string;
  differentiator_title: string;
  differentiator_content: string;
  differentiator_video_url: string | null;
  core_offerings: CoreOffering[];
  benefits: BenefitItem[];
  process_steps: ProcessStep[];
  case_studies: CaseStudyItem[];
  tech_stack: TechStackItem[];
  why_choose_us: WhyChooseItem[];
  consultation_title: string;
  consultation_description: string;
  social_proof_logos: SocialProofLogo[];
  testimonials: TestimonialItem[];
  final_cta_title: string;
  final_cta_description: string;
  final_cta_button_text: string;
  meta_description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  mini_cta_text: string | null;
  mini_cta_subtext: string | null;
  mini_cta_link: string | null;
}

export default function ServicePagesAdmin() {
  const [servicePages, setServicePages] = useState<ServicePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ServicePage | null>(null);
  const [currentTab, setCurrentTab] = useState('basic');

  const ensureArray = <T,>(value: T[] | null | undefined): T[] =>
    Array.isArray(value) ? value : [];

  const createFormState = (data?: Partial<ServicePage>): Partial<ServicePage> => {
    const merged = { ...baseFormState, ...data };
    const normalizedBenefits = ensureArray(merged.benefits as BenefitItem[] | null | undefined).map((benefit) => ({
      ...benefit,
      icon: benefit?.icon || ICON_OPTIONS[0].value,
    }));
    const normalizedWhyChoose = ensureArray(merged.why_choose_us as WhyChooseItem[] | null | undefined).map((item) => ({
      ...item,
      icon: item?.icon || ICON_OPTIONS[0].value,
    }));
    return {
      ...merged,
      core_offerings: ensureArray(merged.core_offerings as CoreOffering[] | null | undefined),
      benefits: normalizedBenefits,
      process_steps: ensureArray(merged.process_steps as ProcessStep[] | null | undefined),
      case_studies: ensureArray(merged.case_studies as CaseStudyItem[] | null | undefined),
      tech_stack: ensureArray(merged.tech_stack as TechStackItem[] | null | undefined),
      why_choose_us: normalizedWhyChoose,
      social_proof_logos: ensureArray(merged.social_proof_logos as SocialProofLogo[] | null | undefined),
      testimonials: ensureArray(merged.testimonials as TestimonialItem[] | null | undefined),
      mini_cta_text: merged.mini_cta_text ?? '',
      mini_cta_subtext: merged.mini_cta_subtext ?? '',
      mini_cta_link: merged.mini_cta_link ?? '',
    };
  };

  // Form state
  const [formData, setFormData] = useState<Partial<ServicePage>>(createFormState());

  useEffect(() => {
    fetchServicePages();

    // Set up real-time subscription
    const channel = supabase
      .channel('service-pages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_pages' }, fetchServicePages)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchServicePages = async () => {
    try {
      const { data, error } = await supabase
        .from('service_pages')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServicePages(data || []);
    } catch (error) {
      console.error('Error fetching service pages:', error);
      toast.error('Failed to load service pages');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (page?: ServicePage) => {
    if (page) {
      setEditingPage(page);
      setFormData(createFormState(page));
    } else {
      setEditingPage(null);
      setFormData(createFormState({ display_order: servicePages.length }));
    }
    setDialogOpen(true);
    setCurrentTab('basic');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPage(null);
  };

  const handleSave = async () => {
    try {
      if (!formData.slug || !formData.title) {
        toast.error('Slug and Title are required');
        return;
      }

      if (editingPage) {
        // Update existing page
        const { error } = await supabase
          .from('service_pages')
          .update(formData)
          .eq('id', editingPage.id);

        if (error) throw error;
        toast.success('Service page updated successfully');
      } else {
        // Create new page
        const { error } = await supabase
          .from('service_pages')
          .insert([formData]);

        if (error) throw error;
        toast.success('Service page created successfully');
      }

      handleCloseDialog();
      fetchServicePages();
    } catch (error: any) {
      console.error('Error saving service page:', error);
      toast.error(error.message || 'Failed to save service page');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service page?')) return;

    try {
      const { error } = await supabase
        .from('service_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Service page deleted successfully');
      fetchServicePages();
    } catch (error: any) {
      console.error('Error deleting service page:', error);
      toast.error('Failed to delete service page');
    }
  };

  const handleArrayFieldChange = (field: keyof ServicePage, index: number, key: string, value: string) => {
    const currentArray = ensureArray(formData[field] as any[] | null | undefined);
    const newArray = [...currentArray];
    const existing = newArray[index] || {};
    newArray[index] = { ...existing, [key]: value };
    setFormData({ ...formData, [field]: newArray });
  };

  const handleAddArrayItem = (field: keyof ServicePage, template: Record<string, any> = {}) => {
    const currentArray = ensureArray(formData[field] as any[] | null | undefined);
    setFormData({ ...formData, [field]: [...currentArray, template] });
  };

  const handleRemoveArrayItem = (field: keyof ServicePage, index: number) => {
    const currentArray = ensureArray(formData[field] as any[] | null | undefined);
    const newArray = currentArray.filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const coreOfferings = (formData.core_offerings ?? []) as CoreOffering[];
  const benefits = (formData.benefits ?? []) as BenefitItem[];
  const processSteps = (formData.process_steps ?? []) as ProcessStep[];
  const caseStudies = (formData.case_studies ?? []) as CaseStudyItem[];
  const techStack = (formData.tech_stack ?? []) as TechStackItem[];
  const whyChooseUs = (formData.why_choose_us ?? []) as WhyChooseItem[];
  const socialProofLogos = (formData.social_proof_logos ?? []) as SocialProofLogo[];
  const testimonials = (formData.testimonials ?? []) as TestimonialItem[];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Service Pages Management - ASMI Admin</title>
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Service Pages</h1>
            <p className="text-muted-foreground">
              Manage dynamic service pages with custom content
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Service Page
          </Button>
        </motion.div>

        {/* Service Pages List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicePages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{page.title}</CardTitle>
                      <CardDescription className="line-clamp-1">/{page.slug}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(page.status)}>{page.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {page.hero_subheadline || page.introduction_content}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(page)}
                        className="flex-1 gap-2"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/services/${page.slug}`, '_blank')}
                        className="gap-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(page.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {servicePages.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No service pages found. Create your first one!</p>
          </Card>
        )}

        {/* Dialog for Add/Edit */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-[95vw] w-full h-[95vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <DialogHeader className="pb-5 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  {editingPage ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    {editingPage ? 'Edit Service Page' : 'Create New Service Page'}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600 mt-1">
                    Configure all sections for your service page. Changes are saved to the database.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 overflow-hidden flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 mb-4 sm:grid-cols-5 flex-shrink-0">
                <TabsTrigger 
                  value="basic" 
                  className="gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-slate-600 font-medium transition-all py-2.5"
                >
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">Basic</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="hero" 
                  className="gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-slate-600 font-medium transition-all py-2.5"
                >
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">Hero</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="offerings" 
                  className="gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-slate-600 font-medium transition-all py-2.5"
                >
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">Offerings</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="proof" 
                  className="gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-slate-600 font-medium transition-all py-2.5"
                >
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Proof</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="cta" 
                  className="gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-slate-600 font-medium transition-all py-2.5"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">CTAs</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto px-1 space-y-6 min-h-0"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 #f1f5f9'
                }}
              >

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6 mt-0">
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-slate-900">Page Information</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-6">Basic metadata and settings for your service page.</p>
                  
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-700 font-medium">Service Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., SAP Public Cloud Services"
                          className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                        />
                        <p className="text-xs text-slate-600">The main title shown on the page</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug" className="text-slate-200 font-medium">URL Slug *</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                          placeholder="sap-public-cloud-services"
                          className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 font-mono text-sm"
                        />
                        <p className="text-xs text-slate-600">URL: /services/<span className="text-primary">{formData.slug || 'your-slug'}</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-slate-200 font-medium">Publication Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-slate-200">
                            <SelectItem value="draft" className="text-slate-900">📝 Draft</SelectItem>
                            <SelectItem value="published" className="text-slate-900">✅ Published</SelectItem>
                            <SelectItem value="archived" className="text-slate-900">📦 Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-600">Only published pages are visible</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="display_order" className="text-slate-200 font-medium">Display Order</Label>
                        <Input
                          id="display_order"
                          type="number"
                          value={formData.display_order}
                          onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                          className="bg-white border-slate-300 text-slate-900"
                        />
                        <p className="text-xs text-slate-600">Lower numbers appear first</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta_description" className="text-slate-200 font-medium">SEO Meta Description</Label>
                      <Textarea
                        id="meta_description"
                        value={formData.meta_description}
                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                        placeholder="Brief description for search engines (150-160 characters)"
                        rows={3}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                      <p className="text-xs text-slate-600">{(formData.meta_description?.length || 0)}/160 characters</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Hero & Introduction Tab */}
              <TabsContent value="hero" className="space-y-6 mt-0">
                {/* Section 1: Hero Section */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="rounded-lg bg-primary/20 p-2">
                      <Image className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">1. Hero Section</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Capture attention with a bold value proposition</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="hero_headline" className="text-slate-200 font-medium">Headline</Label>
                      <Input
                        id="hero_headline"
                        value={formData.hero_headline}
                        onChange={(e) => setFormData({ ...formData, hero_headline: e.target.value })}
                        placeholder="e.g., Transform Your Business with SAP"
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                      <p className="text-xs text-slate-600">Bold, outcome-focused statement</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hero_subheadline" className="text-slate-200 font-medium">Subheadline</Label>
                      <Textarea
                        id="hero_subheadline"
                        value={formData.hero_subheadline}
                        onChange={(e) => setFormData({ ...formData, hero_subheadline: e.target.value })}
                        placeholder="Brief value proposition explaining the key benefit..."
                        rows={3}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                      <p className="text-xs text-slate-600">Short introduction to the service (1-2 sentences)</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="hero_cta_text" className="text-slate-200 font-medium">CTA Button Text</Label>
                        <Input
                          id="hero_cta_text"
                          value={formData.hero_cta_text}
                          onChange={(e) => setFormData({ ...formData, hero_cta_text: e.target.value })}
                          placeholder="Get Started"
                          className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                        />
                        <p className="text-xs text-slate-600">Main call-to-action button</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hero_image_url" className="text-slate-200 font-medium">Hero Image URL (Optional)</Label>
                        <Input
                          id="hero_image_url"
                          value={formData.hero_image_url}
                          onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                          placeholder="https://images.example.com/hero.jpg"
                          className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 font-mono text-sm"
                        />
                        <p className="text-xs text-slate-600">Visual or background image</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Introduction */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="rounded-lg bg-blue-500/20 p-2">
                      <Info className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">2. Introduction / Why This Service</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Explain the relevance and business value</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="introduction_title" className="text-slate-200 font-medium">Section Title</Label>
                      <Input
                        id="introduction_title"
                        value={formData.introduction_title}
                        onChange={(e) => setFormData({ ...formData, introduction_title: e.target.value })}
                        placeholder="Why This Service"
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="introduction_content" className="text-slate-200 font-medium">Introduction Content</Label>
                      <Textarea
                        id="introduction_content"
                        value={formData.introduction_content}
                        onChange={(e) => setFormData({ ...formData, introduction_content: e.target.value })}
                        placeholder="Explain what the service is, why it matters, and the key benefit it offers..."
                        rows={5}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                      <p className="text-xs text-slate-600">1-2 paragraphs describing the service context</p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Key Differentiator */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="rounded-lg bg-yellow-500/20 p-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">3. Key Differentiator</h3>
                      <p className="text-xs text-slate-600 mt-0.5">What makes your solution unique</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="differentiator_title" className="text-slate-200 font-medium">Differentiator Title</Label>
                      <Input
                        id="differentiator_title"
                        value={formData.differentiator_title}
                        onChange={(e) => setFormData({ ...formData, differentiator_title: e.target.value })}
                        placeholder="What Makes It Unique"
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="differentiator_content" className="text-slate-200 font-medium">Differentiator Content</Label>
                      <Textarea
                        id="differentiator_content"
                        value={formData.differentiator_content}
                        onChange={(e) => setFormData({ ...formData, differentiator_content: e.target.value })}
                        placeholder="Highlight the unique tech, process, or innovation behind your service..."
                        rows={4}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                      <p className="text-xs text-slate-600">Short paragraph showing how your solution stands out</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="differentiator_video_url" className="text-slate-200 font-medium">Video URL (Optional)</Label>
                      <Input
                        id="differentiator_video_url"
                        value={formData.differentiator_video_url ?? ''}
                        onChange={(e) => setFormData({ ...formData, differentiator_video_url: e.target.value })}
                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                        className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 font-mono text-sm"
                      />
                      <p className="text-xs text-slate-600">Embedded explainer video (YouTube/Vimeo embed URL)</p>
                    </div>
                  </div>
                </div>

                {/* Section 5: Mini CTA */}
                <div className="rounded-lg bg-slate-800 border-2 border-dashed border-primary/40 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="rounded-lg bg-primary/20 p-2">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">5. Mini CTA (Optional)</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Quick action prompt after benefits section</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="mini_cta_text" className="text-slate-200 font-medium">Mini CTA Title</Label>
                      <Input
                        id="mini_cta_text"
                        value={formData.mini_cta_text}
                        onChange={(e) => setFormData({ ...formData, mini_cta_text: e.target.value })}
                        placeholder="Schedule a Consultation"
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                      <p className="text-xs text-slate-600">Compact callout text</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mini_cta_subtext" className="text-slate-200 font-medium">Supporting Text</Label>
                      <Textarea
                        id="mini_cta_subtext"
                        value={formData.mini_cta_subtext}
                        onChange={(e) => setFormData({ ...formData, mini_cta_subtext: e.target.value })}
                        placeholder="Optional supporting line to reinforce the action"
                        rows={2}
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mini_cta_link" className="text-slate-200 font-medium">Link URL</Label>
                      <Input
                        id="mini_cta_link"
                        value={formData.mini_cta_link}
                        onChange={(e) => setFormData({ ...formData, mini_cta_link: e.target.value })}
                        placeholder="/contact or https://calendly.com/..."
                        className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 font-mono text-sm"
                      />
                      <p className="text-xs text-slate-600">Where the button should link to</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Offerings Tab */}
              <TabsContent value="offerings" className="space-y-6 mt-0">
                {/* Section 4: Core Offerings */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary/20 p-2">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">4. Core Offerings / Sub-Services</h3>
                        <p className="text-xs text-slate-600 mt-0.5">Service components or packages (3-4 cards recommended)</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90"
                      onClick={() =>
                        handleAddArrayItem('core_offerings', { title: '', description: '', link: '' })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add Offering
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {coreOfferings.map((offering, index) => (
                      <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">
                            Offering #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveArrayItem('core_offerings', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Title</Label>
                            <Input
                              value={offering.title ?? ''}
                              onChange={(e) => handleArrayFieldChange('core_offerings', index, 'title', e.target.value)}
                              placeholder="e.g., Implementation & Migration"
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Link (Optional)</Label>
                            <Input
                              value={offering.link ?? ''}
                              onChange={(e) => handleArrayFieldChange('core_offerings', index, 'link', e.target.value)}
                              placeholder="/services/detail-page"
                              className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 font-mono text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200 font-medium">Description</Label>
                          <Textarea
                            value={offering.description ?? ''}
                            onChange={(e) =>
                              handleArrayFieldChange('core_offerings', index, 'description', e.target.value)
                            }
                            placeholder="One-line summary of what this offering includes..."
                            rows={2}
                            className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    ))}
                    {coreOfferings.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">No offerings added yet. Click "Add Offering" to get started.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 5: Benefits */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-green-500/20 p-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">5. Benefits / Value Section</h3>
                        <p className="text-xs text-slate-600 mt-0.5">Tangible advantages with icons (4-6 recommended)</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90"
                      onClick={() =>
                        handleAddArrayItem('benefits', {
                          title: '',
                          description: '',
                          icon: ICON_OPTIONS[0].value,
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add Benefit
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">
                            Benefit #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveArrayItem('benefits', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-slate-700 font-medium">Title</Label>
                            <Input
                              value={benefit.title ?? ''}
                              onChange={(e) => handleArrayFieldChange('benefits', index, 'title', e.target.value)}
                              placeholder="e.g., Cost Efficiency"
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Icon</Label>
                            <Select
                              value={benefit.icon || ICON_OPTIONS[0].value}
                              onValueChange={(value) => handleArrayFieldChange('benefits', index, 'icon', value)}
                            >
                              <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                                <SelectValue placeholder="Select icon" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-slate-200 max-h-[300px]">
                                {ICON_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value} className="text-slate-900">
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200 font-medium">Description</Label>
                          <Textarea
                            value={benefit.description ?? ''}
                            onChange={(e) =>
                              handleArrayFieldChange('benefits', index, 'description', e.target.value)
                            }
                            placeholder="Explain the value in one sentence..."
                            rows={2}
                            className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    ))}
                    {benefits.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">No benefits added yet. Click "Add Benefit" above.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 6: Process */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-blue-500/20 p-2">
                        <Activity className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">6. Process / Roadmap</h3>
                        <p className="text-xs text-slate-600 mt-0.5">Delivery steps from plan to support (5-6 steps)</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90"
                      onClick={() =>
                        handleAddArrayItem('process_steps', {
                          title: '',
                          description: '',
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add Step
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {processSteps.map((step, index) => (
                      <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                              {index + 1}
                            </span>
                            <span className="text-sm font-semibold text-slate-700">
                              Step #{index + 1}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveArrayItem('process_steps', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Step Title</Label>
                            <Input
                              value={step.title ?? ''}
                              onChange={(e) => handleArrayFieldChange('process_steps', index, 'title', e.target.value)}
                              placeholder="e.g., Plan & Align"
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Description</Label>
                            <Textarea
                              value={step.description ?? ''}
                              onChange={(e) =>
                                handleArrayFieldChange('process_steps', index, 'description', e.target.value)
                              }
                              placeholder="One-line explanation..."
                              rows={2}
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {processSteps.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">No steps added yet. Add 5-6 delivery steps.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Proof Tab */}
              <TabsContent value="proof" className="space-y-6 mt-0">
                {/* Section 7: Case Studies */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-purple-500/20 p-2">
                        <Award className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">7. Case Studies / Proof of Success</h3>
                        <p className="text-xs text-slate-600 mt-0.5">Real examples with Problem → Solution → Result (1-3 stories)</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90"
                      onClick={() =>
                        handleAddArrayItem('case_studies', {
                          title: '',
                          problem: '',
                          solution: '',
                          result: '',
                          link: '',
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add Case Study
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {caseStudies.map((caseStudy, index) => (
                      <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">
                            Case Study #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveArrayItem('case_studies', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200 font-medium">Story Title</Label>
                          <Input
                            value={caseStudy.title ?? ''}
                            onChange={(e) => handleArrayFieldChange('case_studies', index, 'title', e.target.value)}
                            placeholder="e.g., Global Manufacturing SAP Rollout"
                            className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">🎯 Problem</Label>
                            <Textarea
                              value={caseStudy.problem ?? ''}
                              onChange={(e) =>
                                handleArrayFieldChange('case_studies', index, 'problem', e.target.value)
                              }
                              rows={3}
                              placeholder="Key challenge..."
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">💡 Solution</Label>
                            <Textarea
                              value={caseStudy.solution ?? ''}
                              onChange={(e) =>
                                handleArrayFieldChange('case_studies', index, 'solution', e.target.value)
                              }
                              rows={3}
                              placeholder="Approach used..."
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">📈 Result</Label>
                            <Textarea
                              value={caseStudy.result ?? ''}
                              onChange={(e) =>
                                handleArrayFieldChange('case_studies', index, 'result', e.target.value)
                              }
                              rows={3}
                              placeholder="Outcomes achieved..."
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200 font-medium">Link to Full Story (Optional)</Label>
                          <Input
                            value={caseStudy.link ?? ''}
                            onChange={(e) => handleArrayFieldChange('case_studies', index, 'link', e.target.value)}
                            placeholder="/case-studies/detailed-story"
                            className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 font-mono text-sm"
                          />
                        </div>
                      </div>
                    ))}
                    {caseStudies.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">No case studies added yet. Add 1-3 success stories.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 8: Technology Stack */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-orange-500/20 p-2">
                        <Settings className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">8. Tools / Technology Stack (Optional)</h3>
                        <p className="text-xs text-slate-600 mt-0.5">Platforms, tools, or frameworks you use</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90"
                      onClick={() =>
                        handleAddArrayItem('tech_stack', {
                          name: '',
                          description: '',
                          logo: '',
                          link: '',
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add Tool
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {techStack.map((tool, index) => (
                      <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">
                            Tool #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveArrayItem('tech_stack', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Name</Label>
                            <Input
                              value={tool.name ?? ''}
                              onChange={(e) => handleArrayFieldChange('tech_stack', index, 'name', e.target.value)}
                              placeholder="e.g., SAP S/4HANA"
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Logo URL (Optional)</Label>
                            <Input
                              value={tool.logo ?? ''}
                              onChange={(e) => handleArrayFieldChange('tech_stack', index, 'logo', e.target.value)}
                              placeholder="https://cdn.example.com/logo.png"
                              className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 font-mono text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200 font-medium">Description</Label>
                          <Textarea
                            value={tool.description ?? ''}
                            onChange={(e) =>
                              handleArrayFieldChange('tech_stack', index, 'description', e.target.value)
                            }
                            rows={2}
                            placeholder="One-line explanation of this tool..."
                            className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200 font-medium">Link (Optional)</Label>
                          <Input
                            value={tool.link ?? ''}
                            onChange={(e) => handleArrayFieldChange('tech_stack', index, 'link', e.target.value)}
                            placeholder="https://example.com/tech-page"
                            className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 font-mono text-sm"
                          />
                        </div>
                      </div>
                    ))}
                    {techStack.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">No tools added yet. Add platforms or frameworks you use.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 9: Why Choose Us */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-indigo-500/20 p-2">
                        <ShieldCheck className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">9. Why Choose Us / Differentiators</h3>
                        <p className="text-xs text-slate-600 mt-0.5">Trust factors: experience, results, partnerships (4-5 points)</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90"
                      onClick={() =>
                        handleAddArrayItem('why_choose_us', {
                          title: '',
                          description: '',
                          icon: ICON_OPTIONS[0].value,
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add Differentiator
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {whyChooseUs.map((item, index) => (
                      <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">
                            Differentiator #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveArrayItem('why_choose_us', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-slate-700 font-medium">Title</Label>
                            <Input
                              value={item.title ?? ''}
                              onChange={(e) => handleArrayFieldChange('why_choose_us', index, 'title', e.target.value)}
                              placeholder="e.g., Certified SAP Gold Partner"
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Icon</Label>
                            <Select
                              value={item.icon || ICON_OPTIONS[0].value}
                              onValueChange={(value) => handleArrayFieldChange('why_choose_us', index, 'icon', value)}
                            >
                              <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                                <SelectValue placeholder="Select icon" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-slate-200 max-h-[300px]">
                                {ICON_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value} className="text-slate-900">
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200 font-medium">Description</Label>
                          <Textarea
                            value={item.description ?? ''}
                            onChange={(e) =>
                              handleArrayFieldChange('why_choose_us', index, 'description', e.target.value)
                            }
                            rows={2}
                            placeholder="Explain this differentiator..."
                            className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    ))}
                    {whyChooseUs.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">No differentiators added yet. Add 4-5 trust factors.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* CTA & Social Tab */}
              <TabsContent value="cta" className="space-y-6 mt-0">
                {/* Section 10: Consultation / Offer */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="rounded-lg bg-primary/20 p-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">10. Consultation / Offer Section</h3>
                      <p className="text-xs text-slate-600 mt-0.5">CTA with form fields (Name, Email, Company, Message)</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="consultation_title" className="text-slate-700 font-medium">Title</Label>
                      <Input
                        id="consultation_title"
                        value={formData.consultation_title}
                        onChange={(e) => setFormData({ ...formData, consultation_title: e.target.value })}
                        placeholder="e.g., Book a Free Consultation"
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultation_description" className="text-slate-700 font-medium">Description</Label>
                      <Textarea
                        id="consultation_description"
                        value={formData.consultation_description}
                        onChange={(e) => setFormData({ ...formData, consultation_description: e.target.value })}
                        rows={3}
                        placeholder="Supporting text explaining why visitors should book..."
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 11: Social Proof Logos */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-amber-500/20 p-2">
                        <Award className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">11. Client Logos / Certifications</h3>
                        <p className="text-xs text-slate-600 mt-0.5">Partner badges and trust markers</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90"
                      onClick={() =>
                        handleAddArrayItem('social_proof_logos', {
                          name: '',
                          logo: '',
                          url: '',
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add Logo
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {socialProofLogos.map((logo, index) => (
                      <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">
                            Logo #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveArrayItem('social_proof_logos', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Name</Label>
                            <Input
                              value={logo.name ?? ''}
                              onChange={(e) => handleArrayFieldChange('social_proof_logos', index, 'name', e.target.value)}
                              placeholder="e.g., SAP"
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Logo URL</Label>
                            <Input
                              value={logo.logo ?? ''}
                              onChange={(e) => handleArrayFieldChange('social_proof_logos', index, 'logo', e.target.value)}
                              placeholder="https://cdn.example.com/logo.svg"
                              className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 font-mono text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Link (Optional)</Label>
                            <Input
                              value={logo.url ?? ''}
                              onChange={(e) => handleArrayFieldChange('social_proof_logos', index, 'url', e.target.value)}
                              placeholder="https://partner.com"
                              className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 font-mono text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {socialProofLogos.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">No logos added yet. Add client or partner logos.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 12: Testimonials */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-emerald-500/20 p-2">
                        <ThumbsUp className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">12. Testimonials</h3>
                        <p className="text-xs text-slate-600 mt-0.5">Client quotes highlighting impact (1-3 quotes)</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90"
                      onClick={() =>
                        handleAddArrayItem('testimonials', {
                          quote: '',
                          author: '',
                          company: '',
                          role: '',
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add Testimonial
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">
                            Testimonial #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveArrayItem('testimonials', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200 font-medium">Quote</Label>
                          <Textarea
                            value={testimonial.quote ?? ''}
                            onChange={(e) => handleArrayFieldChange('testimonials', index, 'quote', e.target.value)}
                            rows={3}
                            placeholder='"This service transformed our operations..."'
                            className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Author</Label>
                            <Input
                              value={testimonial.author ?? ''}
                              onChange={(e) => handleArrayFieldChange('testimonials', index, 'author', e.target.value)}
                              placeholder="Jane Doe"
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Role</Label>
                            <Input
                              value={testimonial.role ?? ''}
                              onChange={(e) => handleArrayFieldChange('testimonials', index, 'role', e.target.value)}
                              placeholder="Head of IT"
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Company</Label>
                            <Input
                              value={testimonial.company ?? ''}
                              onChange={(e) => handleArrayFieldChange('testimonials', index, 'company', e.target.value)}
                              placeholder="Global Manufacturing Co."
                              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {testimonials.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">No testimonials added yet. Add 1-3 client quotes.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 13: Final CTA */}
                <div className="rounded-lg bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="rounded-lg bg-primary/20 p-2">
                      <Rocket className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">13. Final CTA / Closing Section</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Closing motivational message with next-step CTA</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="final_cta_title" className="text-slate-700 font-medium">Title</Label>
                      <Input
                        id="final_cta_title"
                        value={formData.final_cta_title}
                        onChange={(e) => setFormData({ ...formData, final_cta_title: e.target.value })}
                        placeholder="e.g., Ready to Accelerate Your SAP Journey?"
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="final_cta_description" className="text-slate-700 font-medium">Description</Label>
                      <Textarea
                        id="final_cta_description"
                        value={formData.final_cta_description}
                        onChange={(e) => setFormData({ ...formData, final_cta_description: e.target.value })}
                        rows={3}
                        placeholder="Reinforce the partnership promise..."
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="final_cta_button_text" className="text-slate-700 font-medium">Button Text</Label>
                      <Input
                        id="final_cta_button_text"
                        value={formData.final_cta_button_text}
                        onChange={(e) => setFormData({ ...formData, final_cta_button_text: e.target.value })}
                        placeholder="e.g., Talk to an Expert"
                        className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="border-t border-slate-200 bg-slate-50 p-6 flex-shrink-0">
              <Button 
                variant="outline" 
                onClick={handleCloseDialog}
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {editingPage ? '💾 Update Page' : '✨ Create Page'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

