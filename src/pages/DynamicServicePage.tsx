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
  const getLocalizedValue = (enValue: string, key: string) => {
    // Check for German content
    if (language === 'de' && dutchContent && dutchContent[key]) {
      return dutchContent[key];
    }
    // Check for Dutch content (legacy variable name dutchContent used for both)
    if (language === 'nl' && dutchContent && dutchContent[key]) {
      return dutchContent[key];
    }
    return enValue;
  };

  const getLocalizedArray = (enArray: any[], key: string) => {
    if ((language === 'nl' || language === 'de') && dutchContent && Array.isArray(dutchContent[key]) && dutchContent[key].length > 0) {
      return dutchContent[key];
    }
    // Debug: Log when localized content is missing or empty
    if ((language === 'nl' || language === 'de') && enArray && enArray.length > 0) {
      if (!dutchContent) {
        console.warn(`⚠️  No ${language} content available for page`);
      } else if (!dutchContent[key]) {
        console.warn(`⚠️  Missing ${language} translation for array field: "${key}"`);
      } else if (!Array.isArray(dutchContent[key])) {
        console.warn(`⚠️  ${language} content for "${key}" is not an array:`, typeof dutchContent[key]);
      } else if (dutchContent[key].length === 0) {
        console.warn(`⚠️  ${language} translation for "${key}" is an empty array`);
      }
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
        mini_cta_text: data.mini_cta_text ?? null,
        mini_cta_subtext: data.mini_cta_subtext ?? null,
        mini_cta_link: data.mini_cta_link ?? null,
      } as ServicePageData;

      setPageData(normalizedData);

      // Determine which content field to use based on language
      // We reuse the 'dutchContent' state variable to hold ANY localized content (nl or de)
      let localizedContentRaw = null;
      if (language === 'nl') {
        localizedContentRaw = data.content_nl;
      } else if (language === 'de') {
        // @ts-ignore - content_de might not be in the types yet
        localizedContentRaw = data.content_de;
      }

      // Parse content if it's a string, otherwise use as-is
      const localizedContent = typeof localizedContentRaw === 'string'
        ? JSON.parse(localizedContentRaw)
        : (localizedContentRaw || {});

      // Debug logging for localized content
      console.log(`📖 Loaded service page: ${data.title}`);
      console.log(`🌐 Language: ${language}`);
      if (localizedContent && Object.keys(localizedContent).length > 0) {
        console.log(`✅ Localized content available with ${Object.keys(localizedContent).length} fields`);

        // Log array field counts
        ['process_steps', 'tech_stack', 'why_choose_us', 'core_offerings', 'benefits'].forEach(field => {
          if (Array.isArray(localizedContent[field])) {
            console.log(`  - ${field}: ${localizedContent[field].length} items`);
          } else if (localizedContent[field]) {
            console.log(`  - ${field}: exists but not an array (${typeof localizedContent[field]})`);
          }
        });
      } else {
        console.log(`⚠️  No localized content available for this page in ${language}`);
      }

      setDutchContent(localizedContent);
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
        <section className="md:px-8 md:pt-20 max-w-7xl mr-auto ml-auto pt-14 pr-5 pl-5" aria-labelledby="service-title">
          <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
            <div className="pt-0 pr-6 pb-6 pl-6 md:pr-12 md:pb-12 md:pl-12">
              <div className="flex items-stretch gap-6 md:gap-10 flex-col md:flex-row min-h-[240px] md:min-h-[280px]">
                <div className="flex-1">
                  <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em] mt-0 pt-2">
                    {language === 'nl' ? 'Onze Diensten' : language === 'de' ? 'Unsere Dienstleistungen' : 'Our Services'}
                  </p>
                  <h1 id="service-title" className="sm:text-4xl md:text-5xl text-3xl font-bold text-slate-700 tracking-tight mt-2">
                    {getLocalizedValue(pageData.hero_headline || pageData.title, 'hero_headline') ||
                      getLocalizedValue(pageData.title, 'title')}
                  </h1>
                  <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                    {getLocalizedValue(pageData.hero_subheadline, 'hero_subheadline')}
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/contact"
                      className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3 focus:outline-none"
                    >
                      {getLocalizedValue(pageData.hero_cta_text || 'Get Started', 'hero_cta_text')}
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-black/5">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                    <Link
                      to="/services"
                      className="inline-flex items-center gap-2 rounded-none px-5 py-3 text-sm font-bold text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition cursor-pointer"
                    >
                      {language === 'nl' ? 'Al onze diensten' : language === 'de' ? 'Alle Dienstleistungen' : 'All Services'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                {pageData.hero_image_url && (
                  <div className="w-full md:w-[280px] shrink-0 space-y-3">
                    <img
                      src={pageData.hero_image_url}
                      alt={getLocalizedValue(pageData.title, 'title')}
                      loading="lazy"
                      className="w-full rounded-none pt-2 pr-2 pb-2 pl-2"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          </div>
        </section>

        {/* Mini CTA */}
        {(pageData.mini_cta_text || pageData.mini_cta_subtext) && (
          <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5">
            <div className="bg-blue-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-700 tracking-tight">
                    {getLocalizedValue(pageData.mini_cta_text || '', 'mini_cta_text')}
                  </h2>
                  {pageData.mini_cta_subtext && (
                    <p className="mt-2 text-slate-700/80 leading-relaxed">
                      {getLocalizedValue(pageData.mini_cta_subtext, 'mini_cta_subtext')}
                    </p>
                  )}
                </div>
                {(() => {
                  const href = (pageData.mini_cta_link || '/contact').trim();
                  const isExternal = href.startsWith('http');
                  const content = (
                    <span className="inline-flex items-center gap-2">
                      {language === 'nl' ? 'Plan een gesprek' : language === 'de' ? 'Jetzt planen' : 'Schedule now'}
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  );
                  const buttonClass =
                    'inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold whitespace-nowrap';
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

        {/* 2 & 3. Why This Service + What Makes It Unique - Side by Side */}
        {(pageData.introduction_content || pageData.differentiator_content) && (
          <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Why This Service */}
              {pageData.introduction_content && (
                <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-none flex-shrink-0">
                      <Lightbulb className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-700">
                      {getLocalizedValue(pageData.introduction_title, 'introduction_title')}
                    </h2>
                  </div>
                  <p className="whitespace-pre-line text-base leading-relaxed text-slate-700/80 pl-16">
                    {getLocalizedValue(pageData.introduction_content, 'introduction_content')}
                  </p>
                </div>
              )}

              {/* What Makes It Unique */}
              {pageData.differentiator_content && (
                <div className="bg-blue-100 p-6 md:p-8 transition duration-500 ease-in rounded-none h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-none flex-shrink-0">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-700">
                      {getLocalizedValue(pageData.differentiator_title, 'differentiator_title')}
                    </h2>
                  </div>
                  <p className="whitespace-pre-line text-base leading-relaxed text-slate-700/80 pl-16 mb-4">
                    {getLocalizedValue(pageData.differentiator_content, 'differentiator_content')}
                  </p>
                  {pageData.differentiator_video_url && (
                    <div className="pl-16">
                      <div className="w-full overflow-hidden rounded-none bg-white shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)]">
                        <div className="aspect-video w-full">
                          <iframe
                            src={pageData.differentiator_video_url}
                            className="h-full w-full"
                            allowFullScreen
                            title={getLocalizedValue(pageData.differentiator_title, 'differentiator_title')}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. Core Offerings / Sub-Services */}
        {localizedCoreOfferings.length > 0 && (
          <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5">
            <div className="bg-dark-blue p-6 md:p-8 transition duration-500 ease-in rounded-none">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
                  {language === 'nl' ? 'Kernaanbiedingen' : language === 'de' ? 'Kernangebote' : 'Core Offerings'}
                </h2>
                <p className="text-white/90 text-lg max-w-2xl mx-auto">
                  {language === 'nl'
                    ? 'Ontdek de bouwstenen van deze dienst, elk ontworpen voor voorspelbare waarde.'
                    : language === 'de'
                      ? 'Entdecken Sie die Säulen dieses Services, die jeweils darauf ausgelegt sind, messbaren Wert zu liefern.'
                      : 'Explore the pillars of this service, each crafted to deliver measurable value.'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {localizedCoreOfferings.map((offering: CoreOffering, index) => {
                  // Cycle through icons for variety
                  const icons = [Rocket, Zap, ShieldCheck, TrendingUp, Star, BarChart3];
                  const OfferingIcon = icons[index % icons.length];

                  return (
                    <article
                      key={`${offering.title}-${index}`}
                      className="bg-white hover:shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition-all hover:-translate-y-1 h-full rounded-none overflow-hidden flex flex-col group"
                    >
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="bg-primary/10 p-2 rounded-none flex-shrink-0 group-hover:bg-primary transition-all">
                            <OfferingIcon className="h-6 w-6 text-primary group-hover:text-white transition-all" />
                          </div>
                          <h3 className="text-lg tracking-tight font-bold text-slate-700 flex-1">{offering.title}</h3>
                        </div>
                        <p className="text-slate-700/80 mb-4 text-sm leading-relaxed flex-1">{offering.description}</p>
                        {offering.link && (
                          <Link
                            to={offering.link}
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition text-sm font-bold hover:underline"
                          >
                            {language === 'nl' ? 'Meer weten' : language === 'de' ? 'Mehr erfahren' : 'Learn More'}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 5. Benefits / Value Section */}
        {localizedBenefits.length > 0 && (
          <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5">
            <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-700 mb-3">
                  {language === 'nl' ? 'Voordelen' : language === 'de' ? 'Hauptvorteile' : 'Key Benefits'}
                </h2>
                <p className="text-slate-700/80 text-lg max-w-2xl mx-auto">
                  {language === 'nl'
                    ? 'Samengevatte waardeproposities die laten zien hoe wij efficiëntie, snelheid en zekerheid leveren.'
                    : language === 'de'
                      ? 'Kuratierte Wertversprechen, die zeigen, wie wir Effizienz, Geschwindigkeit und Sicherheit vorantreiben.'
                      : 'Curated value propositions that show how we drive efficiency, velocity, and assurance.'}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {localizedBenefits.map((benefit, index) => {
                  const BenefitIcon = resolveIcon(benefit.icon);
                  return (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-none transition-all hover:shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] hover:-translate-y-1 group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-none bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                          <BenefitIcon className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">{benefit.title}</h3>
                        <p className="text-sm text-slate-700/80 leading-relaxed">{benefit.description}</p>
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
          <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5">
            <div className="bg-blue-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-700 mb-3">
                  {language === 'nl' ? 'Ons Proces' : language === 'de' ? 'Unser Prozess' : 'Our Process'}
                </h2>
                <p className="text-slate-700/80 text-lg max-w-2xl mx-auto">
                  {language === 'nl'
                    ? 'Een bewezen leveringsmodel met duidelijke stappen van afstemming tot optimalisatie.'
                    : language === 'de'
                      ? 'Ein bewährtes Liefermodell mit expliziten Phasen von der Abstimmung bis zur Optimierung.'
                      : 'A proven delivery model with explicit stages from alignment to optimization.'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localizedProcess.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-none transition-all hover:shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] relative group"
                  >
                    <div className="absolute -top-3 -left-3 flex h-12 w-12 items-center justify-center rounded-none bg-primary text-white text-xl font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <div className="pl-6">
                      <h3 className="text-lg font-bold text-slate-700 mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                      <p className="text-sm text-slate-700/80 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. Case Studies / Proof of Success */}
        {localizedCaseStudies.length > 0 && (
          <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5">
            <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-700 mb-3">
                  {language === 'nl' ? 'Succesverhalen' : language === 'de' ? 'Erfolgsgeschichten' : 'Success Stories'}
                </h2>
                <p className="text-slate-700/80 text-lg max-w-2xl mx-auto">
                  {language === 'nl'
                    ? 'Concrete voorbeelden van projecten waarin we meetbare bedrijfsresultaten realiseerden.'
                    : language === 'de'
                      ? 'Echte Kundenergebnisse, die zeigen, wie wir greifbare Geschäftsauswirkungen liefern.'
                      : 'Real client outcomes demonstrating how we deliver tangible business impact.'}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {localizedCaseStudies.map((caseStudy, index) => (
                  <Card key={index} className="bg-white p-6 rounded-none transition-all hover:shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] hover:-translate-y-1 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-none bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700">{caseStudy.title}</h3>
                    </div>
                    <div className="space-y-4 flex-1">
                      <div>
                        <p className="text-xs uppercase font-bold text-primary mb-1">
                          {language === 'nl' ? 'Probleem' : language === 'de' ? 'Problem' : 'Problem'}
                        </p>
                        <p className="text-sm text-slate-700/80 leading-relaxed">
                          {caseStudy.problem}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase font-bold text-primary mb-1">
                          {language === 'nl' ? 'Oplossing' : language === 'de' ? 'Lösung' : 'Solution'}
                        </p>
                        <p className="text-sm text-slate-700/80 leading-relaxed">
                          {caseStudy.solution}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase font-bold text-primary mb-1">
                          {language === 'nl' ? 'Resultaat' : language === 'de' ? 'Ergebnis' : 'Result'}
                        </p>
                        <p className="text-sm text-slate-700/80 leading-relaxed">
                          {caseStudy.result}
                        </p>
                      </div>
                    </div>
                    {caseStudy.link && (
                      <Link
                        to={caseStudy.link}
                        className="mt-4 inline-flex items-center gap-2 text-primary hover:text-primary/80 transition text-sm font-bold hover:underline"
                      >
                        {language === 'nl' ? 'Lees meer' : language === 'de' ? 'Mehr lesen' : 'Read More'}
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
          <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5">
            <div className="bg-blue-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-700 mb-3">
                  {language === 'nl' ? 'Technologie Stack' : language === 'de' ? 'Technologie-Stack' : 'Technology Stack'}
                </h2>
                <p className="text-slate-700/80 text-lg max-w-2xl mx-auto">
                  {language === 'nl'
                    ? 'Platforms, frameworks en tools die wij inzetten om duurzame resultaten te behalen.'
                    : language === 'de'
                      ? 'Plattformen, Frameworks und Beschleuniger, die wir nutzen, um nachhaltige Ergebnisse zu erzielen.'
                      : 'Platforms, frameworks, and accelerators we leverage to produce sustainable outcomes.'}
                </p>
              </div>
              <div
                className={`grid gap-6 ${localizedTechStack.length === 1
                  ? 'grid-cols-1 max-w-sm mx-auto'
                  : localizedTechStack.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : localizedTechStack.length === 3
                      ? 'grid-cols-1 md:grid-cols-3'
                      : localizedTechStack.length === 4
                        ? 'grid-cols-2 md:grid-cols-4'
                        : localizedTechStack.length <= 6
                          ? 'grid-cols-2 md:grid-cols-3'
                          : localizedTechStack.length <= 8
                            ? 'grid-cols-2 md:grid-cols-4'
                            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  }`}
              >
                {localizedTechStack.map((tech, index) => (
                  <div
                    key={index}
                    className="bg-white p-8 text-center rounded-none transition-all hover:shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] hover:-translate-y-1 group"
                  >
                    {tech.logo && (
                      <div className="mx-auto mb-5 flex h-32 w-48 items-center justify-center overflow-hidden rounded-none bg-slate-50 group-hover:bg-primary/5 transition-all">
                        <img src={tech.logo} alt={tech.name} className="h-28 w-44 object-contain" />
                      </div>
                    )}
                    {!tech.logo && (
                      <div className="mx-auto mb-5 flex h-32 w-48 items-center justify-center rounded-none bg-primary/10 group-hover:bg-primary transition-all">
                        <Layers className="h-14 w-14 text-primary group-hover:text-white transition-all" />
                      </div>
                    )}
                    <p className="text-base font-bold text-slate-700">{tech.name}</p>
                    {tech.description && (
                      <p className="mt-3 text-sm text-slate-700/80 leading-relaxed">{tech.description}</p>
                    )}
                    {tech.link && (
                      <Link
                        to={tech.link}
                        className="mt-4 inline-flex items-center gap-2 text-primary hover:text-primary/80 transition text-sm font-bold hover:underline"
                      >
                        {language === 'nl' ? 'Bekijk' : language === 'de' ? 'Ansehen' : 'View'}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 9. Why Choose Us / Differentiators */}
        {localizedWhyChoose.length > 0 && (
          <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5">
            <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-700 mb-3">
                  {language === 'nl' ? 'Waarom Kiezen Voor Ons' : language === 'de' ? 'Warum uns wählen' : 'Why Choose Us'}
                </h2>
                <p className="text-slate-700/80 text-lg max-w-2xl mx-auto">
                  {language === 'nl'
                    ? 'Onze bewezen staat van dienst, certificeringen en wereldwijde bereik onderscheiden ons.'
                    : language === 'de'
                      ? 'Unsere bewährte Erfolgsbilanz, Zertifizierungen und globale Reichweite zeichnen uns aus.'
                      : 'Our proven delivery record, certifications, and global reach set us apart.'}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {localizedWhyChoose.map((reason, index) => {
                  const ReasonIcon = resolveIcon(reason.icon);
                  return (
                    <Card
                      key={index}
                      className="bg-white p-6 rounded-none transition-all hover:shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] hover:-translate-y-1 group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-none bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                          <ReasonIcon className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">{reason.title}</h3>
                        <p className="text-sm text-slate-700/80 leading-relaxed">{reason.description}</p>
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
          <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5">
            <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
              <div className="mx-auto max-w-3xl text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-700 mb-2">
                  {getLocalizedValue(pageData.consultation_title, 'consultation_title')}
                </h2>
                {pageData.consultation_description && (
                  <p className="text-lg text-slate-700/80 leading-relaxed">
                    {getLocalizedValue(pageData.consultation_description, 'consultation_description')}
                  </p>
                )}
              </div>
              <form onSubmit={handleConsultationSubmit} className="mx-auto max-w-3xl space-y-4 bg-white p-6 md:p-8 rounded-none shadow-lg">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    type="text"
                    placeholder={language === 'nl' ? 'Uw naam' : 'Your Name'}
                    value={consultationForm.name}
                    onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                    required
                    className="rounded-none border-2 border-slate-200 bg-white py-3 px-4 text-base"
                  />
                  <Input
                    type="email"
                    placeholder={language === 'nl' ? 'Uw e-mail' : 'Your Email'}
                    value={consultationForm.email}
                    onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                    required
                    className="rounded-none border-2 border-slate-200 bg-white py-3 px-4 text-base"
                  />
                </div>
                <Input
                  type="text"
                  placeholder={language === 'nl' ? 'Bedrijfsnaam (optioneel)' : 'Company (optional)'}
                  value={consultationForm.company}
                  onChange={(e) => setConsultationForm({ ...consultationForm, company: e.target.value })}
                  className="rounded-none border-2 border-slate-200 bg-white py-3 px-4 text-base"
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
                  className="rounded-none border-2 border-slate-200 bg-white px-4 py-3 text-base"
                />
                <Button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
                >
                  <span className="inline-flex items-center gap-2">
                    {language === 'nl' ? 'Plan een gesprek' : 'Book a Consultation'}
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
              </form>
            </div>
          </section>
        )}

        {/* 11. Social Proof / Trust Section */}
        {(localizedSocialProof.length > 0 || localizedTestimonials.length > 0) && (
          <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5">
            <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
              {localizedSocialProof.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-700 mb-4">
                    {language === 'nl' ? 'Vertrouwd door leiders' : 'Trusted by Industry Leaders'}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {localizedSocialProof.map((logo, index) => (
                      <a
                        key={index}
                        href={logo.url || '#'}
                        target={logo.url ? '_blank' : undefined}
                        rel={logo.url ? 'noopener noreferrer' : undefined}
                        className="flex h-20 items-center justify-center bg-white px-4 rounded-none transition hover:bg-slate-50"
                      >
                        {logo.logo ? (
                          <img
                            src={logo.logo}
                            alt={logo.name}
                            className="max-h-12 w-auto object-contain"
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
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-700 mb-6">
                    {language === 'nl' ? 'Wat Klanten Zeggen' : 'What Clients Say'}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {localizedTestimonials.map((testimonial, index) => (
                      <Card key={index} className="bg-white p-6 rounded-none transition-all hover:shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] hover:-translate-y-1 flex flex-col">
                        <div className="flex items-start gap-3 mb-4">
                          <MessageCircle className="h-8 w-8 text-primary flex-shrink-0" />
                          <p className="text-base text-slate-700 leading-relaxed italic">
                            "{testimonial.quote}"
                          </p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-slate-200">
                          <p className="text-sm font-bold text-slate-700">{testimonial.author}</p>
                          <p className="text-xs text-slate-600 mt-1">{testimonial.role}</p>
                          <p className="text-xs text-primary font-semibold mt-1">{testimonial.company}</p>
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
          <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5">
            <div className="rounded-none bg-blue-100 text-slate-700 p-8 md:p-12">
              <div className="flex justify-center">
                <div className="text-center max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {getLocalizedValue(pageData.final_cta_title, 'final_cta_title')}
                  </h2>
                  {pageData.final_cta_description && (
                    <p className="mt-4 text-slate-600 max-w-2xl">
                      {getLocalizedValue(pageData.final_cta_description, 'final_cta_description')}
                    </p>
                  )}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
                    >
                      {getLocalizedValue(
                        pageData.final_cta_button_text || 'Contact Us',
                        'final_cta_button_text'
                      )}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

