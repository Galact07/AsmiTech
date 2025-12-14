import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ShoppingBag, Flame, Pill, FlaskConical, Landmark, Truck, ChevronLeft, ChevronRight, Loader2, Factory } from 'lucide-react';
import Carousel from '../components/ui/carousel';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const Home = () => {
  const { t, tArray, tObject } = useTranslation();
  const { language } = useLanguage();
  const [industryIndex, setIndustryIndex] = useState(0);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [clientLogos, setClientLogos] = useState([]);
  const [clientLogosLoading, setClientLogosLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [industries, setIndustries] = useState([]);
  const [industriesLoading, setIndustriesLoading] = useState(true);

  useEffect(() => {
    fetchServices();
    fetchClientLogos();
    fetchTestimonials();
    fetchFAQs();
    fetchIndustries();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setTestimonialsLoading(true);
      // First try to fetch featured testimonials with translation fields
      let { data, error } = await supabase
        .from('testimonials')
        .select('id, quote, author_name, author_role, company_name, company_logo_url, content_nl, content_de')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      // If no featured testimonials, fetch all active ones
      if (!error && (!data || data.length === 0)) {
        const result = await supabase
          .from('testimonials')
          .select('id, quote, author_name, author_role, company_name, company_logo_url, content_nl, content_de')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });
        data = result.data;
        error = result.error;
      }

      if (error) throw error;
      // Remove duplicates by id
      const uniqueTestimonials = (data || []).filter((testimonial, index, self) =>
        index === self.findIndex((t) => t.id === testimonial.id)
      );
      setTestimonials(uniqueTestimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const fetchClientLogos = async () => {
    try {
      setClientLogosLoading(true);
      const { data, error } = await supabase
        .from('client_logos')
        .select('id, company_name, logo_image_url, website_url, content_nl, content_de')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Remove duplicates by id to ensure each logo appears only once
      const uniqueLogos = (data || []).filter((logo, index, self) =>
        index === self.findIndex((l) => l.id === logo.id)
      );
      setClientLogos(uniqueLogos);
    } catch (error) {
      console.error('Error fetching client logos:', error);
      setClientLogos([]);
    } finally {
      setClientLogosLoading(false);
    }
  };

  const fetchFAQs = async () => {
    try {
      setFaqsLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('id, question, answer, display_order, content_nl, content_de')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setFaqs([]);
    } finally {
      setFaqsLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      setIndustriesLoading(true);
      const { data, error } = await supabase
        .from('industries')
        .select('id, name, description, icon_name, features, hero_image_url, content_nl, content_de')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Ensure features is always an array
      const industriesWithFeatures = (data || []).map(industry => ({
        ...industry,
        features: Array.isArray(industry.features) ? industry.features : [],
      }));
      setIndustries(industriesWithFeatures);
    } catch (error) {
      console.error('Error fetching industries:', error);
      setIndustries([]);
    } finally {
      setIndustriesLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const { data, error } = await supabase
        .from('service_pages')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: true });

      if (error) throw error;
      const all = Array.isArray(data) ? data : [];
      // Sort by optional 'rank' (ascending, nulls last), then by created_at
      const sorted = all
        .slice()
        .sort((a, b) => {
          const ar = Number.isFinite(a?.rank) ? a.rank : Number.POSITIVE_INFINITY;
          const br = Number.isFinite(b?.rank) ? b.rank : Number.POSITIVE_INFINITY;
          if (ar !== br) return ar - br;
          const ad = a?.created_at ? Date.parse(a.created_at) : 0;
          const bd = b?.created_at ? Date.parse(b.created_at) : 0;
          return ad - bd;
        });
      // Only top 3 for home page
      setServices(sorted.slice(0, 3));
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setServicesLoading(false);
    }
  };

  // Generic function to get translated field value from any dynamic content record
  const getLocalizedValue = (record, field) => {
    if (!record) return '';
    
    // Check for German
    if (language === 'de' && record.content_de) {
      const deContent = typeof record.content_de === 'string'
        ? JSON.parse(record.content_de)
        : record.content_de;
      if (deContent && deContent[field] !== undefined && deContent[field] !== null && deContent[field] !== '') {
        return deContent[field];
      }
    }

    // Check for Dutch
    if (language === 'nl' && record.content_nl) {
      const nlContent = typeof record.content_nl === 'string'
        ? JSON.parse(record.content_nl)
        : record.content_nl;
      if (nlContent && nlContent[field] !== undefined && nlContent[field] !== null && nlContent[field] !== '') {
        return nlContent[field];
      }
    }

    // Fallback to English (original field value)
    return record[field];
  };
  
  // Helper for array fields (like features)
  const getLocalizedArrayValue = (record, field) => {
    if (!record) return [];
    
    // Check for German
    if (language === 'de' && record.content_de) {
      const deContent = typeof record.content_de === 'string'
        ? JSON.parse(record.content_de)
        : record.content_de;
      if (deContent && Array.isArray(deContent[field]) && deContent[field].length > 0) {
        return deContent[field];
      }
    }

    // Check for Dutch
    if (language === 'nl' && record.content_nl) {
      const nlContent = typeof record.content_nl === 'string'
        ? JSON.parse(record.content_nl)
        : record.content_nl;
      if (nlContent && Array.isArray(nlContent[field]) && nlContent[field].length > 0) {
        return nlContent[field];
      }
    }

    // Fallback to English
    return Array.isArray(record[field]) ? record[field] : [];
  };

  // Icon mapping for dynamic icon rendering
  const iconMap = {
    ShoppingBag,
    Flame,
    Pill,
    FlaskConical,
    Landmark,
    Truck,
    Factory,
  };

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || Factory;
  };

  const nextIndustry = () => {
    setIndustryIndex((prev) => (prev + 1 >= industries.length - 1 ? 0 : prev + 1));
  };

  const prevIndustry = () => {
    setIndustryIndex((prev) => (prev - 1 < 0 ? industries.length - 2 : prev - 1));
  };

  const canGoPrev = industryIndex > 0;
  const canGoNext = industryIndex < industries.length - 2;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-20 max-w-7xl mr-auto ml-auto pt-14 pr-5 pl-5" aria-labelledby="home-title">
        <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
          <div className="pt-0 pr-6 pb-6 pl-6 md:pr-12 md:pb-12 md:pl-12">
            <div className="flex items-stretch gap-6 md:gap-10 flex-col md:flex-row min-h-[240px] md:min-h-[280px]">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em] mt-0 pt-2">
                  {t('home.hero.tagline')}
                </p>
                <h1 id="home-title" className="sm:text-4xl md:text-5xl text-3xl font-bold text-slate-700 tracking-tight mt-2">
                  {t('home.hero.title')}
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  {t('home.hero.description')}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3 focus:outline-none"
                  >
                    {t('buttons.getStarted')}
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <a
                    href="#who-we-are-title"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById('who-we-are-title');
                      if (element) {
                        const headerOffset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-none px-5 py-3 text-sm font-bold text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition cursor-pointer"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
              {/* Vector Illustration + image placeholder */}
              <div className="w-full md:w-[280px] shrink-0 space-y-3">
                <img
                  src="/logos/sap logo.jpg"
                  alt="SAP Technology Logo"
                  loading="lazy"
                  className="w-full rounded-none pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="who-we-are-title">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 items-stretch">
            <div className="order-1">
              <h2 id="who-we-are-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">{t('home.whoWeAre.title')}</h2>
              <div className="md:block order-2 mt-4 md:mt-0 md:hidden">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870"
                  alt="Who We Are - ASMI Team"
                  loading="lazy"
                  className="aspect-video w-full max-w-xs mx-auto object-cover rounded-none"
                />
              </div>
              <p className="mt-3 md:mt-3 text-slate-700/90">
                {t('home.whoWeAre.paragraph1')}
              </p>
              <p className="mt-4 text-slate-700/90">
                {t('home.whoWeAre.paragraph2')}
              </p>
              <div className="mt-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3"
                >
                  Learn More
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-black/5">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="order-2 flex items-end justify-center md:justify-start h-full">
              <div className="hidden md:block w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870"
                  alt="Who We Are - ASMI Team"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-8 md:pt-12" aria-labelledby="partners-title">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <div className="flex items-center justify-between gap-3">
            <h2 id="partners-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">
              {t('home.clients.title')}
            </h2>
          </div>
          <div className="mt-5">
            {clientLogosLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse space-x-4 flex">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 w-60 bg-slate-200 rounded-none"></div>
                  ))}
                </div>
              </div>
            ) : clientLogos.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>No client logos available at the moment.</p>
              </div>
            ) : (
              <Carousel speed="very-slow" className="py-4">
                {clientLogos.map((client) => {
                  const logoContent = (
                    <div className="flex items-center justify-center h-24 w-60 bg-white rounded-none px-4 hover:bg-slate-50 transition-colors">
                      <img
                        src={client.logo_image_url || '/logos/sap logo.jpg'}
                        alt={`${client.company_name} logo`}
                        className="max-h-20 max-w-48 object-contain"
                        onError={(e) => {
                          e.target.src = '/logos/sap logo.jpg';
                        }}
                      />
                    </div>
                  );

                  return (
                    <div key={client.id} className="flex-shrink-0 mx-6 flex items-center justify-center h-28 w-64">
                      {client.website_url ? (
                        <a
                          href={client.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          {logoContent}
                        </a>
                      ) : (
                        logoContent
                      )}
                    </div>
                  );
                })}
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* Key Services Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="services-title">
        <div className="bg-dark-blue p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex-1">
              <h2 id="services-title" className="text-3xl md:text-4xl tracking-tight font-bold text-white mb-2">
                {t('home.services.title')}
              </h2>
              <p className="text-white/90 text-lg max-w-3xl">
                {t('home.services.description')}
              </p>
              <div className="mt-4 md:hidden">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 hover:bg-slate-50 transition text-sm font-bold text-primary bg-white border-secondary border rounded-none pt-2 pr-4 pb-2 pl-4"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 hover:bg-slate-50 transition text-sm font-bold text-primary bg-white border-secondary border rounded-none pt-2 pr-4 pb-2 pl-4"
              >
                {t('buttons.learnMore')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          {servicesLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/80 text-lg">No services available at the moment.</p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {services.map((service) => (
                <article key={service.id} className="bg-white hover:shadow-md transition h-full rounded-none overflow-hidden flex flex-col">
                  {service.hero_image_url && (
                    <img
                      src={service.hero_image_url}
                      alt={getLocalizedValue(service, 'title')}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-base tracking-tight font-bold text-slate-700">
                      {getLocalizedValue(service, 'title')}
                    </h3>
                    <p className="mt-2 text-slate-700/80 mb-4 text-sm">
                      {getLocalizedValue(service, 'hero_subheadline') || getLocalizedValue(service, 'meta_description') || ''}
                    </p>
                    <Link
                      to={`/services/${service.slug}`}
                      className="mt-auto inline-flex items-center gap-2 text-primary hover:text-primary/80 transition text-sm font-bold hover:underline"
                    >
                      {t('buttons.learnMore')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sectors Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="sectors">
        <div className="bg-blue-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700" id="sectors">
              {t('home.industries.title')}
            </h2>
            <div className="mt-3 md:hidden">
              <Link
                to="/industries"
                className="inline-flex items-center gap-2 hover:bg-slate-50 transition text-sm font-bold text-primary bg-white border-secondary border rounded-none pt-2 pr-4 pb-2 pl-4"
              >
                {t('buttons.learnMore')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="hidden md:block">
              <Link
                to="/industries"
                className="inline-flex items-center gap-2 hover:bg-slate-50 transition text-sm font-bold text-primary bg-white border-secondary border rounded-none pt-2 pr-4 pb-2 pl-4"
              >
                {t('buttons.learnMore')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          {/* Desktop carousel */}
          {industriesLoading ? (
            <div className="mt-5 flex items-center justify-center py-8">
              <div className="animate-pulse space-x-4 flex">
                {[1, 2].map((i) => (
                  <div key={i} className="h-96 w-[calc(50%-12px)] bg-slate-200 rounded-none"></div>
                ))}
              </div>
            </div>
          ) : industries.length === 0 ? (
            <div className="mt-5 text-center py-8 text-slate-500">
              <p>No industries available at the moment.</p>
            </div>
          ) : (
            <div className="mt-5 relative py-4 hidden md:block">
              {canGoPrev && (
                <button
                  onClick={prevIndustry}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-slate-50 transition rounded-none p-2 shadow-lg"
                  aria-label="Previous industry"
                >
                  <ChevronLeft className="h-5 w-5 text-primary" />
                </button>
              )}

              <div className="overflow-hidden mx-16">
                <div
                  className="flex gap-6 transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(calc(-${industryIndex} * (50% + 12px)))` }}
                >
                  {industries.map((industry) => {
                    const IconComponent = getIconComponent(industry.icon_name);
                    return (
                      <div key={industry.id} className="flex-shrink-0 w-[calc(50%-12px)]">
                        <article className="bg-white p-5 rounded-none h-full flex flex-col">
                          <div className="flex text-sm text-slate-700/80 gap-x-2 gap-y-2 items-center">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="mt-3 text-base md:text-lg tracking-tight font-bold text-slate-700">
                            {getLocalizedValue(industry, 'name')}
                          </h3>
                          <p className="mt-2 text-sm text-slate-700/90">{getLocalizedValue(industry, 'description')}</p>
                          <img
                            src={industry.hero_image_url || '/logos/sap logo.jpg'}
                            alt={getLocalizedValue(industry, 'name')}
                            loading="lazy"
                            className="mt-4 w-full h-64 object-cover rounded-none"
                            onError={(e) => {
                              e.target.src = '/logos/sap logo.jpg';
                            }}
                          />
                        </article>
                      </div>
                    );
                  })}
                </div>
              </div>

              {canGoNext && (
                <button
                  onClick={nextIndustry}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-slate-50 transition rounded-none p-2 shadow-lg"
                  aria-label="Next industry"
                >
                  <ChevronRight className="h-5 w-5 text-primary" />
                </button>
              )}
            </div>
          )}

          {/* Mobile vertical list */}
          {industriesLoading ? (
            <div className="mt-5 block md:hidden space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-slate-200 rounded-none animate-pulse"></div>
              ))}
            </div>
          ) : industries.length === 0 ? (
            <div className="mt-5 block md:hidden text-center py-8 text-slate-500">
              <p>No industries available at the moment.</p>
            </div>
          ) : (
            <div className="mt-5 block md:hidden space-y-4">
              {industries.map((industry) => {
                const IconComponent = getIconComponent(industry.icon_name);
                return (
                  <article key={industry.id} className="bg-white p-5 rounded-none flex flex-col">
                    <div className="flex text-sm text-slate-700/80 gap-x-2 gap-y-2 items-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mt-3 text-base tracking-tight font-bold text-slate-700">
                      {getLocalizedValue(industry, 'name')}
                    </h3>
                    <p className="mt-2 text-sm text-slate-700/90">{getLocalizedValue(industry, 'description')}</p>
                    <img
                      src={industry.hero_image_url || '/logos/sap logo.jpg'}
                      alt={getLocalizedValue(industry, 'name')}
                      loading="lazy"
                      className="mt-4 w-full h-64 object-cover rounded-none"
                      onError={(e) => {
                        e.target.src = '/logos/sap logo.jpg';
                      }}
                    />
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* What Clients Say Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="testimonials-title">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="testimonials-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">{t('home.testimonials.title')}</h2>
          <div className="mt-5">
            {testimonialsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse space-x-4 flex">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-36 w-96 bg-slate-200 rounded-none"></div>
                  ))}
                </div>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>No testimonials available at the moment.</p>
              </div>
            ) : (
              <Carousel speed="very-slow" className="py-4">
                {testimonials.map((testimonial) => {
                  // Try to get logo from company_logo_url, or try to match company name with logo files
                  const companyName = getLocalizedValue(testimonial, 'company_name');
                  const getLogoUrl = () => {
                    if (testimonial.company_logo_url) {
                      return testimonial.company_logo_url;
                    }
                    // Fallback: try to match company name with existing logo files (use original English for matching)
                    const companyLower = (testimonial.company_name || companyName).toLowerCase();
                    if (companyLower.includes('cargill')) return '/logos/cargill logo.jpg';
                    if (companyLower.includes('hitachi')) return '/logos/hitachi logo.png';
                    if (companyLower.includes('sucafina')) return '/logos/sucafina logo.svg';
                    if (companyLower.includes('johnson')) return '/logos/johnson and johnson logo.png';
                    return '/logos/sap logo.jpg';
                  };

                  return (
                    <div key={testimonial.id} className="flex-shrink-0 mx-4 w-96">
                      <div className="bg-white/70 backdrop-blur-[10px] p-6 h-36 flex items-center gap-6 rounded-none">
                        <div className="flex-shrink-0 w-32 h-28 bg-white rounded-none flex items-center justify-center p-3">
                          <img
                            src={getLogoUrl()}
                            alt={`${companyName} logo`}
                            className="max-h-24 max-w-28 object-contain"
                            onError={(e) => {
                              e.target.src = '/logos/sap logo.jpg';
                            }}
                          />
                        </div>
                        <blockquote className="text-slate-700/90 text-sm leading-relaxed flex-1">
                          {getLocalizedValue(testimonial, 'quote')}
                        </blockquote>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="faq-title">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="faq-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">{t('home.faq.title')}</h2>
          <FAQ faqs={faqs} loading={faqsLoading} />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="final-cta-title">
        <div className="rounded-none bg-blue-100 text-slate-700 p-8 md:p-12">
          <div className="flex justify-center">
            <div className="text-center max-w-2xl">
              <h2 id="final-cta-title" className="text-3xl md:text-4xl font-bold tracking-tight">
                {t('home.finalCTA.title')}
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl">
                {t('home.finalCTA.description')}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
                >
                  {t('buttons.requestConsultation')}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

// Accessible FAQ accordion component
function FAQ({ faqs, loading }) {
  const [openIndex, setOpenIndex] = useState(null);
  const { language } = useLanguage();
  
  // Helper to get localized FAQ field
  const getLocalizedFaqField = (faq, field) => {
    if (!faq) return '';
    
    if (language === 'de' && faq.content_de) {
      const deContent = typeof faq.content_de === 'string'
        ? JSON.parse(faq.content_de)
        : faq.content_de;
      if (deContent && deContent[field]) {
        return deContent[field];
      }
    }

    if (language === 'nl' && faq.content_nl) {
      const nlContent = typeof faq.content_nl === 'string'
        ? JSON.parse(faq.content_nl)
        : faq.content_nl;
      if (nlContent && nlContent[field]) {
        return nlContent[field];
      }
    }

    return faq[field];
  };

  if (loading) {
    return (
      <div className="mt-4 divide-y divide-blue-200 rounded-none bg-blue-50">
        <div className="px-5 py-4 text-center text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <div className="mt-4 divide-y divide-blue-200 rounded-none bg-blue-50">
        <div className="px-5 py-4 text-center text-slate-600">
          No FAQs available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 divide-y divide-blue-200 rounded-none bg-blue-50">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${faq.id}`;
        const buttonId = `faq-button-${faq.id}`;
        return (
          <div key={faq.id} className="">
            <h3>
              <button
                id={buttonId}
                className="w-full text-left px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="text-slate-700 font-bold">{getLocalizedFaqField(faq, 'question')}</span>
                <span className="ml-4 text-slate-600 transition-transform duration-300 ease-in-out" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="px-5 pb-4 text-slate-600 whitespace-pre-wrap">
                {getLocalizedFaqField(faq, 'answer')}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
