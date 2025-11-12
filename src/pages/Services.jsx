import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Shield, Award, Factory, ShoppingCart, Banknote, HeartPulse, CheckCircle } from 'lucide-react';
import Carousel from '../components/ui/carousel';
import { useTranslation } from '@/hooks/useTranslation';

const Services = () => {
  const { t, tArray } = useTranslation();
  
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
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: t('services.servicesSection.list.sapPublicCloud.title'),
                description: t('services.servicesSection.list.sapPublicCloud.description'),
                features: tArray('services.servicesSection.list.sapPublicCloud.features'),
                logo: 'Cloud',
                alt: 'SAP Public Cloud',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop'
              },
              {
                title: t('services.servicesSection.list.sapImplementations.title'),
                description: t('services.servicesSection.list.sapImplementations.description'),
                features: tArray('services.servicesSection.list.sapImplementations.features'),
                logo: 'Settings',
                alt: 'SAP Implementations and Rollouts',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop'
              },
              {
                title: t('services.servicesSection.list.sapDocumentCompliance.title'),
                description: t('services.servicesSection.list.sapDocumentCompliance.description'),
                features: tArray('services.servicesSection.list.sapDocumentCompliance.features'),
                logo: 'FileText',
                alt: 'SAP Document and Reporting Compliance',
                image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop'
              },
              {
                title: t('services.servicesSection.list.sapConsulting.title'),
                description: t('services.servicesSection.list.sapConsulting.description'),
                features: tArray('services.servicesSection.list.sapConsulting.features'),
                logo: 'Users',
                alt: 'SAP Consulting & Advisory',
                image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop'
              },
              {
                title: t('services.servicesSection.list.dataMigration.title'),
                description: t('services.servicesSection.list.dataMigration.description'),
                features: tArray('services.servicesSection.list.dataMigration.features'),
                logo: 'Database',
                alt: 'Data & Migration Services',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop'
              },
              {
                title: t('services.servicesSection.list.supportManaged.title'),
                description: t('services.servicesSection.list.supportManaged.description'),
                features: tArray('services.servicesSection.list.supportManaged.features'),
                logo: 'Headphones',
                alt: 'Support & Managed Services',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop'
              },
              {
                title: t('services.servicesSection.list.training.title'),
                description: t('services.servicesSection.list.training.description'),
                features: tArray('services.servicesSection.list.training.features'),
                logo: 'GraduationCap',
                alt: 'Training & Change Management',
                image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop'
              },
              {
                title: t('services.servicesSection.list.projectManagement.title'),
                description: t('services.servicesSection.list.projectManagement.description'),
                features: tArray('services.servicesSection.list.projectManagement.features'),
                logo: 'Clipboard',
                alt: 'SAP Project Management & Governance',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop'
              }
            ].map((service, index) => {
              const serviceHrefs = [
                '/services/sap-public-cloud',
                '/services/sap-implementations-and-rollouts',
                '/services/sap-document-and-reporting-compliance',
                '/services/sap-consulting-advisory',
                '/services/data-migration-services',
                '/services/support-managed-services',
                '/services/training-change-management',
                '/services/sap-project-management-governance'
              ];
              return (
                <article key={index} className="bg-white hover:shadow-md transition rounded-none overflow-hidden flex flex-col">
                  <img 
                    src={service.image}
                    alt={service.alt}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-base tracking-tight font-bold text-slate-700">{service.title}</h3>
                    <p className="mt-2 text-slate-700/80 text-sm">{service.description}</p>
                    <ul className="mt-3 space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-slate-700/80">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link 
                      to={serviceHrefs[index]}
                      className="mt-4 inline-flex items-center gap-2 text-primary hover:text-primary/80 transition text-sm font-bold hover:underline"
                    >
                      {t('buttons.learnMore')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
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
                <div className={`w-full flex items-center justify-center bg-slate-50 rounded-none ${tech.name === 'SAP S/4HANA' ? 'h-20' : 'h-24'}`}>
                  <img
                    src={`/logos/${tech.logo}`}
                    alt={`${tech.name} logo`}
                    className={`max-w-full object-contain ${tech.name === 'SAP S/4HANA' ? 'max-h-16' : 'max-h-20'}`}
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
