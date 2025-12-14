import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight, ShoppingBag, Flame, Pill, FlaskConical, Landmark, Truck, CheckCircle, Factory, Loader2 } from 'lucide-react';
import Carousel from '../components/ui/carousel';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const Industries = () => {
  const { t, tArray } = useTranslation();
  const { language } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [industries, setIndustries] = useState([]);
  const [industriesLoading, setIndustriesLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
    fetchIndustries();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setTestimonialsLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, quote, author_name, author_role, company_name, company_logo_url, content_nl, content_de')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

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
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-20 max-w-7xl mr-auto ml-auto pt-14 pr-5 pl-5" aria-labelledby="industries-title">
        <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
          <div className="pt-0 pr-6 pb-6 pl-6 md:pr-12 md:pb-12 md:pl-12">
            <div className="flex items-stretch gap-6 md:gap-10 flex-col md:flex-row min-h-[240px] md:min-h-[280px]">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em] mt-0 pt-2">
                  {t('industries.hero.tagline')}
                </p>
                <h1 id="industries-title" className="sm:text-4xl md:text-5xl text-3xl font-bold text-slate-700 tracking-tight mt-2">
                  {t('industries.hero.title')}
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  {t('industries.hero.description')}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3 focus:outline-none"
                  >
                    {t('buttons.contactUs')}
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <a
                    href="#industries"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById('industries');
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
                    {t('buttons.viewIndustries')}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
              {/* Industry Illustration */}
              <div className="w-full md:w-[280px] shrink-0 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&auto=format&fit=crop"
                  alt="Industry solutions overview"
                  loading="lazy"
                  className="w-full rounded-none pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>
      </section>

      {/* Industries Grid Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="industries">
        <div className="bg-dark-blue p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 className="md:text-2xl text-xl font-bold text-white tracking-tight" id="industries">
            {t('industries.industriesSection.title')}
          </h2>
          {industriesLoading ? (
            <div className="mt-5 flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
          ) : industries.length === 0 ? (
            <div className="mt-5 text-center py-20">
              <p className="text-white/80 text-lg">No industries available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 gap-x-6 gap-y-6">
              {industries.map((industry) => {
                const IconComponent = getIconComponent(industry.icon_name);
                const localizedFeatures = getLocalizedArrayValue(industry, 'features');
                return (
                  <article key={industry.id} className="bg-blue-50 p-6 hover:shadow-md transition rounded-none">
                    <div className="flex text-sm text-slate-700/80 gap-x-2 gap-y-2 items-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl tracking-tight font-bold text-slate-700 mb-3">
                      {getLocalizedValue(industry, 'name')}
                    </h3>
                    <p className="text-slate-700/90 mb-4">{getLocalizedValue(industry, 'description')}</p>
                    {localizedFeatures && localizedFeatures.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {localizedFeatures.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2 text-sm text-slate-700/80">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    <img
                      src={industry.hero_image_url || '/logos/sap logo.jpg'}
                      alt={getLocalizedValue(industry, 'name')}
                      loading="lazy"
                      className="w-full rounded-none"
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
                  const companyName = getLocalizedValue(testimonial, 'company_name');
                  const getLogoUrl = () => {
                    if (testimonial.company_logo_url) {
                      return testimonial.company_logo_url;
                    }
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

      {/* CTA Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="cta">
        <div className="rounded-none bg-blue-100 text-slate-700 p-8 md:p-12">
          <div className="flex justify-center">
            <div className="text-center max-w-2xl">
              <h2 id="cta" className="text-3xl md:text-4xl font-bold tracking-tight">
                {t('industries.finalCTA.title')}
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl">
                {t('industries.finalCTA.description')}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
                >
                  {t('buttons.contactUs')}
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

export default Industries;
