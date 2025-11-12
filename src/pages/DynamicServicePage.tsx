import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  BarChart3,
  GaugeCircle,
  Users,
  Zap,
  Loader2,
  Award,
  Target,
  Rocket,
  Globe,
  Lock,
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  Heart,
  Shield,
  Lightbulb,
  Settings,
  MessageCircle,
  ThumbsUp,
  Briefcase,
  Activity,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

const ICON_MAP: Record<string, LucideIcon> = {
  'check-circle': CheckCircle,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  'bar-chart-3': BarChart3,
  'gauge-circle': GaugeCircle,
  users: Users,
  zap: Zap,
  award: Award,
  target: Target,
  rocket: Rocket,
  globe: Globe,
  lock: Lock,
  'trending-up': TrendingUp,
  clock: Clock,
  'dollar-sign': DollarSign,
  star: Star,
  heart: Heart,
  shield: Shield,
  lightbulb: Lightbulb,
  settings: Settings,
  'message-circle': MessageCircle,
  'thumbs-up': ThumbsUp,
  briefcase: Briefcase,
  activity: Activity,
};

interface ServicePageData {
  id: string;
  slug: string;
  title: string;
  status: string;
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
  mini_cta_text: string | null;
  mini_cta_subtext: string | null;
  mini_cta_link: string | null;
  content_nl?: Record<string, unknown>;
}

export default function DynamicServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [pageData, setPageData] = useState<ServicePageData | null>(null);
  const [dutchContent, setDutchContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Helper function to get localized content
  const getLocalizedValue = (enValue: string, nlKey: string) => {
    if (language === 'nl' && dutchContent && dutchContent[nlKey]) {
      return dutchContent[nlKey];
    }
    return enValue;
  };

  const getLocalizedArray = (enArray: any[], nlKey: string) => {
    if (language === 'nl' && dutchContent && Array.isArray(dutchContent[nlKey]) && dutchContent[nlKey].length > 0) {
      return dutchContent[nlKey];
    }
    return enArray || [];
  };

  // Consultation form state
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  useEffect(() => {
    fetchServicePage();
  }, [slug, language]);

  const fetchServicePage = async () => {
    try {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from('service_pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        console.error('Service page not found:', error);
        setNotFound(true);
        return;
      }

      const normalizedData = {
        ...data,
        core_offerings: Array.isArray(data.core_offerings) ? data.core_offerings : [],
        benefits: Array.isArray(data.benefits)
          ? data.benefits.map((benefit: BenefitItem) => ({
              ...benefit,
              icon: benefit?.icon || 'check-circle',
            }))
          : [],
        process_steps: Array.isArray(data.process_steps) ? data.process_steps : [],
        case_studies: Array.isArray(data.case_studies) ? data.case_studies : [],
        tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack : [],
        why_choose_us: Array.isArray(data.why_choose_us)
          ? data.why_choose_us.map((item: WhyChooseItem) => ({
              ...item,
              icon: item?.icon || 'check-circle',
            }))
          : [],
        social_proof_logos: Array.isArray(data.social_proof_logos) ? data.social_proof_logos : [],
        testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
        mini_cta_text: data.mini_cta_text ?? '',
        mini_cta_subtext: data.mini_cta_subtext ?? '',
        mini_cta_link: data.mini_cta_link ?? '',
      } as ServicePageData;

      setPageData(normalizedData);
      
      // Parse content_nl if it's a string, otherwise use as-is
      const nlContent = typeof data.content_nl === 'string' 
        ? JSON.parse(data.content_nl) 
        : (data.content_nl || {});
      setDutchContent(nlContent);
    } catch (error) {
      console.error('Error fetching service page:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          name: consultationForm.name,
          email: consultationForm.email,
          company: consultationForm.company,
          message: `Service: ${getLocalizedValue(pageData?.title || '', 'title')}\n\n${consultationForm.message}`,
          subject: `Consultation Request - ${getLocalizedValue(pageData?.title || '', 'title')}`,
          status: 'new'
        }]);

      if (error) throw error;

      toast.success('Consultation request submitted successfully!');
      setConsultationForm({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      console.error('Error submitting consultation:', error);
      toast.error('Failed to submit consultation request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-700 mb-4">Service Not Found</h1>
          <p className="text-slate-600 mb-6">The service you're looking for doesn't exist.</p>
          <Link to="/services" className="text-primary hover:underline">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const resolveIcon = (iconName?: string) => {
    const normalized = (iconName || 'check-circle').toLowerCase();
    return ICON_MAP[normalized] || CheckCircle;
  };

  const localizedCoreOfferings = getLocalizedArray(pageData.core_offerings, 'core_offerings') as CoreOffering[];
  const localizedBenefits = getLocalizedArray(pageData.benefits, 'benefits') as BenefitItem[];
  const localizedProcess = getLocalizedArray(pageData.process_steps, 'process_steps') as ProcessStep[];
  const localizedCaseStudies = getLocalizedArray(pageData.case_studies, 'case_studies') as CaseStudyItem[];
  const localizedTechStack = getLocalizedArray(pageData.tech_stack, 'tech_stack') as TechStackItem[];
  const localizedWhyChoose = getLocalizedArray(pageData.why_choose_us, 'why_choose_us') as WhyChooseItem[];
  const localizedSocialProof = getLocalizedArray(
    pageData.social_proof_logos,
    'social_proof_logos'
  ) as SocialProofLogo[];
  const localizedTestimonials = getLocalizedArray(pageData.testimonials, 'testimonials') as TestimonialItem[];

  return (
    <>
      <Helmet>
        <title>{getLocalizedValue(pageData.title, 'title')} - ASMI BV</title>
        <meta name="description" content={getLocalizedValue(pageData.meta_description || pageData.hero_subheadline, 'meta_description')} />
      </Helmet>

      <div className="min-h-screen">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.2),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(139,92,246,0.15),_transparent_50%)]" />
          <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[url('/grid.svg')] opacity-10" />
          <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-20 md:px-10 md:pt-32 md:pb-24">
            <div className="grid items-center gap-12 md:grid-cols-[1.1fr_minmax(0,0.9fr)] md:items-stretch">
              <div className="space-y-8 text-white">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-white/10 to-white/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-white/90 backdrop-blur-xl shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  {language === 'nl' ? 'Onze Diensten' : 'Our Services'}
                </div>
                <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent">
                  {getLocalizedValue(pageData.hero_headline || pageData.title, 'hero_headline') ||
                    getLocalizedValue(pageData.title, 'title')}
                </h1>
                <p className="max-w-2xl text-lg text-white/90 leading-relaxed md:text-xl font-light">
                  {getLocalizedValue(pageData.hero_subheadline, 'hero_subheadline')}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    {getLocalizedValue(pageData.hero_cta_text || 'Get Started', 'hero_cta_text')}
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-xl transition-all hover:border-white/80 hover:bg-white/15 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    {language === 'nl' ? 'Bekijk al onze diensten' : 'Explore services'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {pageData.hero_image_url && (
                <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 shadow-[0_40px_100px_-50px_rgba(79,70,229,0.5)] backdrop-blur-xl ring-1 ring-white/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                  <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
                  <img
                    src={pageData.hero_image_url}
                    alt={getLocalizedValue(pageData.title, 'title')}
                    loading="lazy"
                    className="relative h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mini CTA */}
        {(pageData.mini_cta_text || pageData.mini_cta_subtext) && (
          <section className="-mt-16 px-6 pb-16 md:px-10">
            <div className="mx-auto max-w-5xl rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-white via-white to-primary/5 p-8 shadow-2xl shadow-primary/10 md:p-12 ring-1 ring-white/50 backdrop-blur-sm">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                    <Zap className="h-3 w-3" />
                    {language === 'nl' ? 'Snelkoppeling' : 'Quick Action'}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
                    {getLocalizedValue(pageData.mini_cta_text || '', 'mini_cta_text')}
                  </h2>
                  {pageData.mini_cta_subtext && (
                    <p className="text-base text-slate-600 leading-relaxed">
                      {getLocalizedValue(pageData.mini_cta_subtext, 'mini_cta_subtext')}
                    </p>
                  )}
                </div>
                {(() => {
                  const href = (pageData.mini_cta_link || '/contact').trim();
                  const isExternal = href.startsWith('http');
                  const content = (
                    <span className="inline-flex items-center gap-2">
                      {language === 'nl' ? 'Plan een gesprek' : 'Schedule now'}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  );
                  const buttonClass =
                    'group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2';
                  return isExternal ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
                      {content}
                    </a>
                  ) : (
                    <Link to={href} className={buttonClass}>
                      {content}
                    </Link>
                  );
                })()}
              </div>
            </div>
          </section>
        )}

        {/* 2. Introduction / Why This Service */}
        {pageData.introduction_content && (
          <section className="px-6 pt-12 md:px-10 md:pt-20">
            <div className="mx-auto max-w-5xl rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-white p-12 shadow-2xl shadow-slate-900/10 backdrop-blur-sm md:p-16">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-700">
                  <Target className="h-3 w-3" />
                  {language === 'nl' ? 'Waarom Deze Service' : 'Why This Service'}
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {getLocalizedValue(pageData.introduction_title, 'introduction_title')}
                </h2>
                <p className="whitespace-pre-line text-xl leading-relaxed text-slate-600 font-light">
                  {getLocalizedValue(pageData.introduction_content, 'introduction_content')}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 3. Key Differentiator / What Makes It Unique */}
        {pageData.differentiator_content && (
          <section className="px-6 pt-12 md:px-10 md:pt-20">
            <div className="mx-auto max-w-7xl rounded-3xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 via-white to-amber-50 p-12 shadow-2xl shadow-yellow-500/10 md:p-16">
              <div className="flex flex-col gap-10 md:flex-row md:items-start">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-yellow-700">
                    <Star className="h-3 w-3" />
                    {language === 'nl' ? 'Ons Onderscheid' : 'Our Edge'}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                    {getLocalizedValue(pageData.differentiator_title, 'differentiator_title')}
                  </h2>
                  <p className="whitespace-pre-line text-xl leading-relaxed text-slate-600 font-light">
                    {getLocalizedValue(pageData.differentiator_content, 'differentiator_content')}
                  </p>
                </div>
                {pageData.differentiator_video_url && (
                  <div className="w-full max-w-xl overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-2xl ring-1 ring-slate-100">
                    <div className="aspect-video w-full">
                      <iframe
                        src={pageData.differentiator_video_url}
                        className="h-full w-full"
                        allowFullScreen
                        title={getLocalizedValue(pageData.differentiator_title, 'differentiator_title')}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 4. Core Offerings / Sub-Services */}
        {localizedCoreOfferings.length > 0 && (
          <section className="px-6 pt-12 md:px-10 md:pt-20">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-violet-50 p-12 shadow-2xl shadow-primary/10 md:p-16">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                    <Layers className="h-3 w-3" />
                    {language === 'nl' ? 'Aanbod' : 'Offerings'}
                  </div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                    {language === 'nl' ? 'Kernaanbiedingen' : 'Core Offerings'}
                  </h2>
                </div>
                <p className="max-w-xl text-lg text-slate-600 leading-relaxed font-light">
                  {language === 'nl'
                    ? 'Ontdek de bouwstenen van deze dienst, elk ontworpen voor voorspelbare waarde.'
                    : 'Explore the pillars of this service, each crafted to deliver measurable value.'}
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {localizedCoreOfferings.map((offering: CoreOffering, index) => (
                  <div
                    key={`${offering.title}-${index}`}
                    className="group relative h-full overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-xl transition-all hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute inset-x-8 top-0 h-1.5 w-2/3 rounded-full bg-gradient-to-r from-primary via-violet-500 to-primary/40" />
                    <div className="relative flex items-start justify-between pt-4">
                      <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 p-4 text-primary ring-1 ring-primary/20 transition-all group-hover:scale-110 group-hover:ring-primary/40">
                        <Sparkles className="h-7 w-7" />
                      </div>
                      <span className="text-lg font-black text-slate-300 transition-colors group-hover:text-primary">0{index + 1}</span>
                    </div>
                    <h3 className="relative mt-8 text-2xl font-black text-slate-900">{offering.title}</h3>
                    <p className="relative mt-4 text-base leading-relaxed text-slate-600 font-light">{offering.description}</p>
                    {offering.link && (
                      <Link
                        to={offering.link}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
                      >
                        {language === 'nl' ? 'Meer weten' : 'Learn More'}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Benefits / Value Section */}
        {localizedBenefits.length > 0 && (
          <section className="px-6 pt-12 md:px-10 md:pt-20">
            <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-8 py-12 text-white shadow-2xl shadow-slate-900/60 md:px-16 md:py-16 ring-1 ring-white/10">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                    <CheckCircle className="h-3 w-3" />
                    {language === 'nl' ? 'Impact' : 'Impact'}
                  </div>
                  <h2 className="text-4xl font-black tracking-tight md:text-5xl bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent">
                    {language === 'nl' ? 'Voordelen' : 'Benefits'}
                  </h2>
                </div>
                <p className="max-w-xl text-lg text-white/80 leading-relaxed font-light">
                  {language === 'nl'
                    ? 'Samengevatte waardeproposities die laten zien hoe wij efficiëntie, snelheid en zekerheid leveren.'
                    : 'Curated value propositions that show how we drive efficiency, velocity, and assurance.'}
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                {localizedBenefits.map((benefit, index) => {
                  const BenefitIcon = resolveIcon(benefit.icon);
                  return (
                    <div
                      key={index}
                      className="group flex gap-5 rounded-2xl border-2 border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl transition-all hover:-translate-y-2 hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/20 hover:to-primary/10 hover:shadow-2xl hover:shadow-primary/20"
                    >
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/20 text-primary ring-1 ring-primary/30 transition-all group-hover:scale-110 group-hover:from-primary group-hover:to-primary/80 group-hover:text-white group-hover:ring-primary/50 group-hover:shadow-lg group-hover:shadow-primary/40">
                        <BenefitIcon className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{benefit.title}</h3>
                        <p className="mt-3 text-base text-white/80 leading-relaxed font-light">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 6. Process / Roadmap */}
        {localizedProcess.length > 0 && (
          <section className="px-6 pt-12 md:px-10 md:pt-20">
            <div className="mx-auto max-w-7xl rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 p-12 shadow-2xl shadow-blue-500/10 md:p-16">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
                    <Activity className="h-3 w-3" />
                    {language === 'nl' ? 'Roadmap' : 'Roadmap'}
                  </div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                    {language === 'nl' ? 'Ons Proces' : 'Our Process'}
                  </h2>
                </div>
                <p className="max-w-xl text-lg text-slate-600 leading-relaxed font-light">
                  {language === 'nl'
                    ? 'Een bewezen leveringsmodel met duidelijke stappen van afstemming tot optimalisatie.'
                    : 'A proven delivery model with explicit stages from alignment to optimization.'}
                </p>
              </div>
              <div className="mt-12 relative">
                <div className="absolute left-8 top-0 hidden h-full w-1 rounded-full bg-gradient-to-b from-blue-400 via-primary to-violet-400 opacity-20 md:block" />
                <div className="space-y-6">
                  {localizedProcess.map((step, index) => (
                    <div key={index} className="relative flex flex-col gap-6 rounded-3xl border-2 border-blue-100 bg-white/80 p-8 shadow-lg transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 md:flex-row md:items-center md:gap-8 backdrop-blur-sm">
                      <div className="flex items-center gap-5 md:w-52">
                        <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-white text-2xl font-black shadow-lg shadow-primary/30 ring-4 ring-white">
                          {index + 1}
                        </div>
                        <div className="font-bold text-slate-800 text-lg md:hidden">{step.title}</div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="hidden text-2xl font-black text-slate-900 md:block">{step.title}</h3>
                        <p className="text-base leading-relaxed text-slate-600 font-light">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 7. Case Studies / Proof of Success */}
        {localizedCaseStudies.length > 0 && (
          <section className="px-6 pt-12 md:px-10 md:pt-20">
            <div className="mx-auto max-w-7xl rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-purple-50 px-8 py-12 shadow-2xl shadow-purple-500/10 md:px-16 md:py-16">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-purple-700">
                    <Award className="h-3 w-3" />
                    {language === 'nl' ? 'Bewijs' : 'Proof'}
                  </div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                    {language === 'nl' ? 'Succesverhalen' : 'Success Stories'}
                  </h2>
                </div>
                <p className="max-w-xl text-lg text-slate-600 leading-relaxed font-light">
                  {language === 'nl'
                    ? 'Concrete voorbeelden van projecten waarin we meetbare bedrijfsresultaten realiseerden.'
                    : 'Real client outcomes demonstrating how we deliver tangible business impact.'}
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {localizedCaseStudies.map((caseStudy, index) => (
                  <Card key={index} className="group relative h-full overflow-hidden rounded-3xl border-2 border-purple-200 bg-white p-8 shadow-xl transition-all hover:-translate-y-2 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50 via-white to-white opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-purple-200/30 blur-3xl transition-all group-hover:bg-purple-300/50" />
                    <div className="relative flex items-start justify-between">
                      <div className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-purple-700 ring-1 ring-purple-200">
                        {language === 'nl' ? 'Case' : 'Case'}
                      </div>
                      <span className="text-2xl font-black text-purple-200 transition-colors group-hover:text-purple-400">0{index + 1}</span>
                    </div>
                    <h3 className="relative mt-6 text-xl font-black text-slate-900">{caseStudy.title}</h3>
                    <div className="relative mt-6 space-y-4 text-base leading-relaxed text-slate-600 font-light">
                      <div className="flex items-start gap-2">
                        <div className="mt-1 rounded-lg bg-red-100 p-1">
                          <Target className="h-3 w-3 text-red-600" />
                        </div>
                        <p>
                          <span className="font-bold text-red-700">
                            {language === 'nl' ? 'Probleem:' : 'Problem:'}
                          </span>{' '}
                          {caseStudy.problem}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 rounded-lg bg-blue-100 p-1">
                          <Lightbulb className="h-3 w-3 text-blue-600" />
                        </div>
                        <p>
                          <span className="font-bold text-blue-700">
                            {language === 'nl' ? 'Oplossing:' : 'Solution:'}
                          </span>{' '}
                          {caseStudy.solution}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 rounded-lg bg-green-100 p-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        </div>
                        <p>
                          <span className="font-bold text-green-700">
                            {language === 'nl' ? 'Resultaat:' : 'Result:'}
                          </span>{' '}
                          {caseStudy.result}
                        </p>
                      </div>
                    </div>
                    {caseStudy.link && (
                      <Link
                        to={caseStudy.link}
                        className="relative mt-8 inline-flex items-center gap-2 text-sm font-bold text-purple-600 transition-all hover:gap-3 hover:text-purple-700"
                      >
                        {language === 'nl' ? 'Lees meer' : 'Read More'}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 8. Tools / Technology Stack */}
        {localizedTechStack.length > 0 && (
          <section className="px-6 pt-12 md:px-10 md:pt-20">
            <div className="mx-auto max-w-7xl rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 px-8 py-12 shadow-2xl shadow-orange-500/10 md:px-16 md:py-16">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-700">
                    <Settings className="h-3 w-3" />
                    {language === 'nl' ? 'Stack' : 'Stack'}
                  </div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                    {language === 'nl' ? 'Technologie Stack' : 'Technology Stack'}
                  </h2>
                </div>
                <p className="max-w-xl text-lg text-slate-600 leading-relaxed font-light">
                  {language === 'nl'
                    ? 'Platforms, frameworks en tools die wij inzetten om duurzame resultaten te behalen.'
                    : 'Platforms, frameworks, and accelerators we leverage to produce sustainable outcomes.'}
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {localizedTechStack.map((tech, index) => (
                  <div
                    key={index}
                    className="group rounded-3xl border-2 border-orange-100 bg-white p-8 text-center shadow-lg transition-all hover:-translate-y-2 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-500/20"
                  >
                    <div className="relative">
                      {tech.logo && (
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-white shadow-lg ring-2 ring-orange-100 transition-all group-hover:scale-110 group-hover:ring-orange-300 group-hover:shadow-xl">
                          <img src={tech.logo} alt={tech.name} className="h-16 w-16 object-contain transition-transform group-hover:scale-110" />
                        </div>
                      )}
                      {!tech.logo && (
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 transition-all group-hover:scale-110 group-hover:from-orange-200 group-hover:to-orange-100">
                          <Settings className="h-10 w-10 text-orange-600" />
                        </div>
                      )}
                      <p className="text-lg font-black text-slate-900">{tech.name}</p>
                      {tech.description && (
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed font-light">{tech.description}</p>
                      )}
                      {tech.link && (
                        <Link
                          to={tech.link}
                          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition-all hover:gap-3 hover:text-orange-700"
                        >
                          {language === 'nl' ? 'Bekijk' : 'View'}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 9. Why Choose Us / Differentiators */}
        {localizedWhyChoose.length > 0 && (
          <section className="px-6 pt-12 md:px-10 md:pt-20">
            <div className="mx-auto max-w-7xl rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 px-8 py-12 shadow-2xl shadow-indigo-500/10 md:px-16 md:py-16">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-indigo-700">
                    <ShieldCheck className="h-3 w-3" />
                    {language === 'nl' ? 'Differentiatie' : 'Differentiators'}
                  </div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                    {language === 'nl' ? 'Waarom Kiezen Voor Ons' : 'Why Choose Us'}
                  </h2>
                </div>
                <p className="max-w-xl text-lg text-slate-600 leading-relaxed font-light">
                  {language === 'nl'
                    ? 'Onze bewezen staat van dienst, certificeringen en wereldwijde bereik onderscheiden ons.'
                    : 'Our proven delivery record, certifications, and global reach set us apart.'}
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                {localizedWhyChoose.map((reason, index) => {
                  const ReasonIcon = resolveIcon(reason.icon);
                  return (
                    <Card
                      key={index}
                      className="group relative overflow-hidden rounded-3xl border-2 border-indigo-100 bg-white p-8 shadow-xl transition-all hover:-translate-y-2 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/20"
                    >
                      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-white opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-200/30 blur-3xl transition-all group-hover:bg-indigo-300/50" />
                      <div className="relative flex items-start gap-5">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 ring-2 ring-indigo-100 transition-all group-hover:scale-110 group-hover:from-indigo-600 group-hover:to-indigo-500 group-hover:text-white group-hover:ring-indigo-300 group-hover:shadow-lg group-hover:shadow-indigo-500/40">
                          <ReasonIcon className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900">{reason.title}</h3>
                          <p className="mt-3 text-base leading-relaxed text-slate-600 font-light">{reason.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 10. Consultation / Offer Section */}
        {pageData.consultation_title && (
          <section className="px-6 pt-12 md:px-10 md:pt-20">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-white px-8 py-12 shadow-2xl shadow-primary/20 md:px-16 md:py-16">
              <div className="mx-auto max-w-3xl text-center space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                  <MessageCircle className="h-3 w-3" />
                  {language === 'nl' ? 'Laten We Beginnen' : "Let's Start"}
                </div>
                <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                  {getLocalizedValue(pageData.consultation_title, 'consultation_title')}
                </h2>
                {pageData.consultation_description && (
                  <p className="text-lg text-slate-600 leading-relaxed font-light">
                    {getLocalizedValue(pageData.consultation_description, 'consultation_description')}
                  </p>
                )}
              </div>
              <form onSubmit={handleConsultationSubmit} className="mx-auto mt-12 max-w-3xl space-y-6 rounded-3xl border-2 border-white/80 bg-white/95 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white md:p-10">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Input
                    type="text"
                    placeholder={language === 'nl' ? 'Uw naam' : 'Your Name'}
                    value={consultationForm.name}
                    onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                    required
                    className="rounded-2xl border-2 border-slate-200 bg-white py-6 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Input
                    type="email"
                    placeholder={language === 'nl' ? 'Uw e-mail' : 'Your Email'}
                    value={consultationForm.email}
                    onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                    required
                    className="rounded-2xl border-2 border-slate-200 bg-white py-6 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Input
                  type="text"
                  placeholder={language === 'nl' ? 'Bedrijfsnaam (optioneel)' : 'Company (optional)'}
                  value={consultationForm.company}
                  onChange={(e) => setConsultationForm({ ...consultationForm, company: e.target.value })}
                  className="rounded-2xl border-2 border-slate-200 bg-white py-6 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Textarea
                  placeholder={
                    language === 'nl'
                      ? 'Vertel ons kort over uw uitdagingen...'
                      : 'Tell us about your objectives...'
                  }
                  value={consultationForm.message}
                  onChange={(e) => setConsultationForm({ ...consultationForm, message: e.target.value })}
                  required
                  rows={5}
                  className="rounded-2xl border-2 border-slate-200 bg-white text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  type="submit"
                  className="group w-full rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-8 py-6 text-lg font-bold text-white shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/40"
                >
                  <span className="inline-flex items-center gap-2">
                    {language === 'nl' ? 'Plan een gesprek' : 'Book a Consultation'}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </form>
            </div>
          </section>
        )}

        {/* 11. Social Proof / Trust Section */}
        {(localizedSocialProof.length > 0 || localizedTestimonials.length > 0) && (
          <section className="px-6 pt-12 md:px-10 md:pt-20">
            <div className="mx-auto max-w-7xl space-y-16 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 px-8 py-12 shadow-2xl shadow-slate-900/10 md:px-16 md:py-16">
              {localizedSocialProof.length > 0 && (
                <div className="space-y-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-700">
                        <Award className="h-3 w-3" />
                        {language === 'nl' ? 'Partners' : 'Partners'}
                      </div>
                      <h2 className="text-4xl font-black tracking-tight text-slate-900">
                        {language === 'nl' ? 'Vertrouwd door leiders' : 'Trusted by leaders'}
                      </h2>
                    </div>
                    <p className="max-w-xl text-lg text-slate-600 leading-relaxed font-light">
                      {language === 'nl'
                        ? 'Strategische partnerschappen en certificeringen die onze expertise onderbouwen.'
                        : 'Strategic partnerships and certifications underpinning our delivery credentials.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                    {localizedSocialProof.map((logo, index) => (
                      <a
                        key={index}
                        href={logo.url || '#'}
                        target={logo.url ? '_blank' : undefined}
                        rel={logo.url ? 'noopener noreferrer' : undefined}
                        className="group flex h-24 items-center justify-center rounded-3xl border-2 border-slate-200 bg-white px-6 shadow-md transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/5 hover:shadow-xl"
                      >
                        {logo.logo ? (
                          <img
                            src={logo.logo}
                            alt={logo.name}
                            className="max-h-12 w-auto object-contain opacity-80 transition group-hover:opacity-100"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-slate-500">{logo.name}</span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {localizedTestimonials.length > 0 && (
                <div className="space-y-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-700">
                        <ThumbsUp className="h-3 w-3" />
                        {language === 'nl' ? 'Testimonials' : 'Testimonials'}
                      </div>
                      <h2 className="text-4xl font-black tracking-tight text-slate-900">
                        {language === 'nl' ? 'Wat Klanten Zeggen' : 'What Clients Say'}
                      </h2>
                    </div>
                    <p className="max-w-xl text-lg text-slate-600 leading-relaxed font-light">
                      {language === 'nl'
                        ? 'Directe citaten van klanten over onze samenwerking en resultaten.'
                        : 'Direct client commentary on collaborating with our teams.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {localizedTestimonials.map((testimonial, index) => (
                      <Card key={index} className="group relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-10 shadow-xl transition-all hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-white to-white opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute top-0 left-0 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
                        <div className="relative">
                          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                            <MessageCircle className="h-6 w-6" />
                          </div>
                          <p className="text-lg text-slate-700 leading-relaxed font-light italic">
                            "{testimonial.quote}"
                          </p>
                          <div className="mt-8 space-y-2">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                              {testimonial.role || ''}
                            </p>
                            <p className="text-xl font-black text-slate-900">{testimonial.author}</p>
                            <p className="text-base text-slate-600 font-medium">{testimonial.company}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 12. Final CTA / Closing Section */}
        {pageData.final_cta_title && (
          <section className="px-6 pt-12 pb-20 md:px-10 md:pt-20">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-violet-600 px-8 py-16 text-white shadow-2xl md:px-16 md:py-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent_50%)]" />
              <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
              <div className="relative mx-auto max-w-3xl text-center space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white backdrop-blur-xl">
                  <Rocket className="h-3 w-3" />
                  {language === 'nl' ? 'Klaar om te starten?' : 'Ready to Start?'}
                </div>
                <h2 className="text-4xl font-black tracking-tight md:text-6xl bg-gradient-to-br from-white via-white to-white/90 bg-clip-text text-transparent">
                  {getLocalizedValue(pageData.final_cta_title, 'final_cta_title')}
                </h2>
                {pageData.final_cta_description && (
                  <p className="text-xl text-white/90 leading-relaxed font-light">
                    {getLocalizedValue(pageData.final_cta_description, 'final_cta_description')}
                  </p>
                )}
                <div className="flex flex-col items-center justify-center gap-5 pt-4 sm:flex-row">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-5 text-base font-bold text-primary shadow-xl shadow-white/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/40"
                  >
                    {getLocalizedValue(
                      pageData.final_cta_button_text || 'Contact Us',
                      'final_cta_button_text'
                    )}
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 bg-white/10 px-8 py-5 text-base font-bold text-white backdrop-blur-xl transition-all hover:scale-105 hover:border-white hover:bg-white/20"
                  >
                    {language === 'nl' ? 'Bekijk alle diensten' : 'Explore all services'}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

