import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ShoppingBag, Flame, Pill, FlaskConical, Landmark, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import Carousel from '../components/ui/carousel';
import { useTranslation } from '@/hooks/useTranslation';

const Home = () => {
  const { t, tArray, tObject } = useTranslation();
  const [industryIndex, setIndustryIndex] = useState(0);
  
  // Get translated industries data
  const industriesData = [
              {
                icon: ShoppingBag,
                title: t('home.industries.retail.title'),
                description: t('home.industries.retail.description'),
                features: tArray('home.industries.retail.features'),
                image: 'https://i.pinimg.com/736x/ec/be/ba/ecbeba29212ecb314faf2760a9b200a3.jpg',
                alt: t('home.industries.retail.title')
              },
              {
                icon: Flame,
                title: t('home.industries.oilGas.title'),
                description: t('home.industries.oilGas.description'),
                features: tArray('home.industries.oilGas.features'),
                image: 'https://i.pinimg.com/736x/56/c4/ec/56c4ec50629e9b8c7082b86bd1fe5332.jpg',
                alt: t('home.industries.oilGas.title')
              },
              {
                icon: Pill,
                title: t('home.industries.pharma.title'),
                description: t('home.industries.pharma.description'),
                features: tArray('home.industries.pharma.features'),
                image: 'https://i.pinimg.com/1200x/b7/56/19/b7561971cb6257a1e6b99b1c1fdf795d.jpg',
                alt: t('home.industries.pharma.title')
              },
              {
                icon: FlaskConical,
                title: t('home.industries.chemicals.title'),
                description: t('home.industries.chemicals.description'),
                features: tArray('home.industries.chemicals.features'),
                image: 'https://images.unsplash.com/photo-1757912666361-8c226b7279b9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870',
                alt: t('home.industries.chemicals.title')
              },
              {
                icon: Landmark,
                title: t('home.industries.publicSector.title'),
                description: t('home.industries.publicSector.description'),
                features: tArray('home.industries.publicSector.features'),
                image: 'https://images.pexels.com/photos/20432166/pexels-photo-20432166.jpeg?_gl=1*ydoi7k*_ga*MTU5Njc0NzgwOS4xNzU5ODE5NDIw*_ga_8JE65Q40S6*czE3NjEwNTc3MDYkbzMkZzEkdDE3NjEwNTgyNzEkajQzJGwwJGgw',
                alt: t('home.industries.publicSector.title')
              },
              {
                icon: Truck,
                title: t('home.industries.logistics.title'),
                description: t('home.industries.logistics.description'),
                features: tArray('home.industries.logistics.features'),
                image: 'https://i.pinimg.com/736x/94/b0/ed/94b0ed2a49f4452f0b4930f7c9ef09c1.jpg',
                alt: t('home.industries.logistics.title')
              }
  ];

  const nextIndustry = () => {
    setIndustryIndex((prev) => (prev + 1 >= industriesData.length - 1 ? 0 : prev + 1));
  };

  const prevIndustry = () => {
    setIndustryIndex((prev) => (prev - 1 < 0 ? industriesData.length - 2 : prev - 1));
  };

  const canGoPrev = industryIndex > 0;
  const canGoNext = industryIndex < industriesData.length - 2;

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
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: t('home.services.list.sapPublicCloud.title'),
                description: t('home.services.list.sapPublicCloud.description'),
                href: '/services/sap-public-cloud',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop'
              },
              {
                title: t('home.services.list.sapImplementations.title'),
                description: t('home.services.list.sapImplementations.description'),
                href: '/services/sap-implementations-and-rollouts',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop'
              },
              {
                title: t('home.services.list.sapDocumentCompliance.title'),
                description: t('home.services.list.sapDocumentCompliance.description'),
                href: '/services/sap-document-and-reporting-compliance',
                image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop'
              },
              {
                title: t('home.services.list.sapConsulting.title'),
                description: t('home.services.list.sapConsulting.description'),
                href: '/services/sap-consulting-advisory',
                image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop'
              },
              {
                title: t('home.services.list.dataMigration.title'),
                description: t('home.services.list.dataMigration.description'),
                href: '/services/data-migration-services',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop'
              },
              {
                title: t('home.services.list.supportManaged.title'),
                description: t('home.services.list.supportManaged.description'),
                href: '/services/support-managed-services',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop'
              },
              {
                title: t('home.services.list.training.title'),
                description: t('home.services.list.training.description'),
                href: '/services/training-change-management',
                image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop'
              },
              {
                title: t('home.services.list.projectManagement.title'),
                description: t('home.services.list.projectManagement.description'),
                href: '/services/sap-project-management-governance',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop'
              }
            ].map((service, index) => (
              <article key={index} className="bg-white hover:shadow-md transition h-full rounded-none overflow-hidden flex flex-col">
                <img 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base tracking-tight font-bold text-slate-700">{service.title}</h3>
                  <p className="mt-2 text-slate-700/80 mb-4 text-sm">{service.description}</p>
                  <Link 
                    to={service.href}
                    className="mt-auto inline-flex items-center gap-2 text-primary hover:text-primary/80 transition text-sm font-bold hover:underline"
                  >
                    {t('buttons.learnMore')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
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
                {industriesData.map((sector, index) => {
                  const IconComponent = sector.icon;
                  return (
                    <div key={index} className="flex-shrink-0 w-[calc(50%-12px)]">
                      <article className="bg-white p-5 rounded-none h-full flex flex-col">
                <div className="flex text-sm text-slate-700/80 gap-x-2 gap-y-2 items-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-3 text-base md:text-lg tracking-tight font-bold text-slate-700">
                  {sector.title}
                </h3>
                <p className="mt-2 text-sm text-slate-700/90">{sector.description}</p>
                <img
                  src={sector.image}
                  alt={sector.alt}
                  loading="lazy"
                          className="mt-4 w-full h-64 object-cover rounded-none"
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
          
          {/* Mobile vertical list */}
          <div className="mt-5 block md:hidden space-y-4">
            {industriesData.map((sector, index) => {
              const IconComponent = sector.icon;
              return (
                <article key={index} className="bg-white p-5 rounded-none flex flex-col">
                  <div className="flex text-sm text-slate-700/80 gap-x-2 gap-y-2 items-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-3 text-base tracking-tight font-bold text-slate-700">
                    {sector.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-700/90">{sector.description}</p>
                  <img
                    src={sector.image}
                    alt={sector.alt}
                    loading="lazy"
                    className="mt-4 w-full h-64 object-cover rounded-none"
                  />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Clients Say Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="testimonials-title">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="testimonials-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">{t('home.testimonials.title')}</h2>
          <div className="mt-5">
            <Carousel speed="very-slow" className="py-4">
              {tArray('home.testimonials.list').map((quote, idx) => {
                const logoFiles = ['cargill logo.jpg', 'hitachi logo.png', 'sucafina logo.svg', 'johnson and johnson logo.png'];
                return (
                  <div key={idx} className="flex-shrink-0 mx-4 w-96">
                    <div className="bg-white/70 backdrop-blur-[10px] p-6 h-36 flex items-center gap-6 rounded-none">
                      <div className="flex-shrink-0 w-32 h-28 bg-white rounded-none flex items-center justify-center p-3">
                        <img 
                          src={`/logos/${logoFiles[idx] || 'sap logo.jpg'}`}
                          alt={`${logoFiles[idx]?.split(' ')[0] || 'Client'} logo`}
                          className="max-h-24 max-w-28 object-contain"
                        />
                      </div>
                      <blockquote className="text-slate-700/90 text-sm leading-relaxed flex-1">
                        {quote}
                      </blockquote>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="faq-title">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="faq-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">{t('home.faq.title')}</h2>
          <FAQ />
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
function FAQ() {
  const { tArray } = useTranslation();
  const items = tArray('home.faq.questions');

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mt-4 divide-y divide-blue-200 rounded-none bg-blue-50">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div key={index} className="">
            <h3>
              <button
                id={buttonId}
                className="w-full text-left px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="text-slate-700 font-bold">{item.q}</span>
                <span className="ml-4 text-slate-600 transition-transform duration-300 ease-in-out" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-5 pb-4 text-slate-600">
                {item.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
