import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Loader2 } from 'lucide-react';
import Carousel from '../components/ui/carousel';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t, tArray } = useTranslation();
  const { language } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_pages')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedValue = (service, field) => {
    // Check for German
    if (language === 'de' && service.content_de) {
      const deContent = typeof service.content_de === 'string'
        ? JSON.parse(service.content_de)
        : service.content_de;
      if (deContent && deContent[field]) {
        return deContent[field];
      }
    }

    // Check for Dutch
    if (language === 'nl' && service.content_nl) {
      const nlContent = typeof service.content_nl === 'string'
        ? JSON.parse(service.content_nl)
        : service.content_nl;
      if (nlContent && nlContent[field]) {
        return nlContent[field];
      }
    }

    // Fallback to English
    return service[field];
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-20 max-w-7xl mr-auto ml-auto pt-14 pr-5 pl-5" aria-labelledby="services-title">
        <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
          <div className="pt-0 pr-6 pb-6 pl-6 md:pr-12 md:pb-12 md:pl-12">
            <div className="flex items-stretch gap-6 md:gap-10 flex-col md:flex-row min-h-[240px] md:min-h-[280px]">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em] mt-0 pt-2">
                  {t('services.hero.tagline')}
                </p>
                <h1 id="services-title" className="sm:text-4xl md:text-5xl text-3xl font-bold text-slate-700 tracking-tight mt-2">
                  {t('services.hero.title')}
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  {t('services.hero.description')}
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
                    href="#our-services"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById('our-services');
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
                    {t('buttons.ourServices')}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
              {/* Services Illustration */}
              <div className="w-full md:w-[280px] shrink-0 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&auto=format&fit=crop"
                  alt="SAP services overview"
                  loading="lazy"
                  className="w-full rounded-none pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-8 md:pt-12" aria-labelledby="partners-title">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <div className="flex items-center justify-between gap-3">
            <h2 id="partners-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">
              {t('services.clients.title')}
            </h2>
          </div>
          <div className="mt-5">
            <Carousel speed="very-slow" className="py-4">
              {[
                { name: 'HITACHI', logoFile: 'hitachi logo.png' },
                { name: 'CARGILL', logoFile: 'cargill logo.jpg' },
                { name: 'DELOITTE', logoFile: 'deloitte logo.svg' },
                { name: 'KPMG', logoFile: 'kpmg logo.png' },
                { name: 'SUCAFINA', logoFile: 'sucafina logo.svg' },
                { name: 'GREENWORKS', logoFile: 'greenworks logo.jpg' },
                { name: 'SEGWAY-NINEBOT', logoFile: 'segway-ninebot logo.jpg' }
              ].map((client, index) => (
                <div key={index} className="flex-shrink-0 mx-6 flex items-center justify-center h-28 w-64">
                  <div className="flex items-center justify-center h-24 w-60 bg-white rounded-none px-4 hover:bg-slate-50 transition-colors">
                    <img
                      src={`/logos/${client.logoFile}`}
                      alt={`${client.name} logo`}
                      className="max-h-20 max-w-48 object-contain"
                    />
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="our-services">
        <div className="bg-dark-blue p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <div className="mb-8">
            <h2 id="our-services" className="text-3xl md:text-4xl tracking-tight font-bold text-white mb-4">
              {t('services.servicesSection.title')}
            </h2>
            <p className="text-white/90 text-lg max-w-4xl">
              {t('services.servicesSection.description')}
            </p>
          </div>
          {loading ? (
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

      {/* Technology Stack Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="technology">
        <div className="bg-blue-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="technology" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">
            {t('services.technology.title')}
          </h2>
          <p className="mt-2 text-slate-700/80">
            {t('services.technology.description')}
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'SAP S/4HANA', logo: 'SAP S4HANA.png' },
              { name: 'SAP Fiori', logo: 'SAP Fiori.png' },
              { name: 'SAP Analytics Cloud', logo: 'SAP Analytics Cloud.png' },
              { name: 'SAP Ariba', logo: 'SAP Ariba.png' },
              { name: 'SAP Integration Suite', logo: 'SAP Integration Suite.png' },
              { name: 'SAP Business Technology Platform', logo: 'SAP Business Technology Platform.png' }
            ].map((tech, index) => (
              <div key={index} className="flex items-center justify-center p-4 bg-white hover:bg-slate-50 transition rounded-none">
                <div className={`w-full flex items-center justify-center bg-slate-50 rounded-none ${tech.name === 'SAP S/4HANA' ? 'h-28' : 'h-32'}`}>
                  <img
                    src={`/logos/${tech.logo}`}
                    alt={`${tech.name} logo`}
                    className={`max-w-full object-contain ${tech.name === 'SAP S/4HANA' ? 'max-h-24' : 'max-h-28'}`}
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Clients Say Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="testimonials-title">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="testimonials-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">{t('home.testimonials.title')}</h2>
          <div className="mt-5">
            <Carousel speed="very-slow" className="py-4">
              {[
                { quote: tArray('home.testimonials.list')[0], logoFile: 'cargill logo.jpg' },
                { quote: tArray('home.testimonials.list')[1], logoFile: 'hitachi logo.png' },
                { quote: tArray('home.testimonials.list')[2], logoFile: 'sucafina logo.svg' },
                { quote: tArray('home.testimonials.list')[3], logoFile: 'johnson and johnson logo.png' }
              ].map((testimonial, idx) => (
                <div key={idx} className="flex-shrink-0 mx-4 w-96">
                  <div className="bg-white/70 backdrop-blur-[10px] p-6 h-36 flex items-center gap-6 rounded-none">
                    <div className="flex-shrink-0 w-32 h-28 bg-white rounded-none flex items-center justify-center p-3">
                      <img
                        src={`/logos/${testimonial.logoFile}`}
                        alt={`${testimonial.logoFile.split(' ')[0]} logo`}
                        className="max-h-24 max-w-28 object-contain"
                      />
                    </div>
                    <blockquote className="text-slate-700/90 text-sm leading-relaxed flex-1">
                      {testimonial.quote}
                    </blockquote>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="cta">
        <div className="rounded-none bg-blue-100 text-slate-700 p-8 md:p-12">
          <div className="flex justify-center">
            <div className="text-center max-w-2xl">
              <h2 id="cta" className="text-3xl md:text-4xl font-bold tracking-tight">
                {t('services.finalCTA.title')}
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl">
                {t('services.finalCTA.description')}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
                >
                  {t('buttons.getStartedToday')}
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

export default Services;
