import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ShoppingBag, Flame, Pill, FlaskConical, Landmark, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import Carousel from '../components/ui/carousel';

const Home = () => {
  const [industryIndex, setIndustryIndex] = useState(0);
  
  const industriesData = [
              {
                icon: ShoppingBag,
                title: 'Retail & Consumer Goods',
                description: 'Integrate sales, inventory, and customer insights for smarter decisions and seamless shopping experiences across channels.',
                features: [
                  'Cut inventory waste and stockouts with smarter SAP planning',
                  'Accelerate supply chain processes to get products to customers faster',
                  'Use real-time data to improve sales decisions and customer satisfaction'
                ],
                image: 'https://i.pinimg.com/736x/ec/be/ba/ecbeba29212ecb314faf2760a9b200a3.jpg',
                alt: 'Retail & Consumer Goods'
              },
              {
                icon: Flame,
                title: 'Oil, Gas & Energy',
                description: 'Connect operations, maintenance, and compliance systems to improve efficiency, reduce downtime, and maintain the highest safety standards.',
                features: [
                  'Keep critical equipment running longer with predictive maintenance',
                  'Stay fully compliant with safety and environmental regulations',
                  'Turn operational data into cost-saving, actionable insights'
                ],
                image: 'https://i.pinimg.com/736x/56/c4/ec/56c4ec50629e9b8c7082b86bd1fe5332.jpg',
                alt: 'Oil, Gas & Energy'
              },
              {
                icon: Pill,
                title: 'Pharmaceuticals & Life Sciences',
                description: 'Link research, production, and regulatory processes to ensure product quality, accelerate delivery, and stay fully compliant.',
                features: [
                  'Speed up manufacturing without compromising quality or compliance',
                  'Track every batch to ensure regulatory standards are met',
                  'Coordinate distribution to meet demand efficiently and reliably'
                ],
                image: 'https://i.pinimg.com/1200x/b7/56/19/b7561971cb6257a1e6b99b1c1fdf795d.jpg',
                alt: 'Pharmaceuticals & Life Sciences'
              },
              {
                icon: FlaskConical,
                title: 'Chemicals & Petrochemicals',
                description: 'Coordinate production, safety, and supply chain operations to boost efficiency, minimize risks, and respond quickly to market demands.',
                features: [
                  'Optimize production to reduce waste and energy usage',
                  'Simplify compliance reporting with automated SAP processes',
                  'Respond quickly to supply chain disruptions or market changes'
                ],
                image: 'https://images.unsplash.com/photo-1757912666361-8c226b7279b9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870',
                alt: 'Chemicals & Petrochemicals'
              },
              {
                icon: Landmark,
                title: 'Public Sector & Government',
                description: 'Streamline financial, operational, and citizen services to improve transparency, accountability, and service delivery across departments.',
                features: [
                  'Automate budgeting and fund management for clarity and control',
                  'Increase transparency across departments and operations',
                  'Deliver citizen services more efficiently using real-time insights'
                ],
                image: 'https://images.pexels.com/photos/20432166/pexels-photo-20432166.jpeg?_gl=1*ydoi7k*_ga*MTU5Njc0NzgwOS4xNzU5ODE5NDIw*_ga_8JE65Q40S6*czE3NjEwNTc3MDYkbzMkZzEkdDE3NjEwNTgyNzEkajQzJGwwJGgw',
                alt: 'Public Sector & Government'
              },
              {
                icon: Truck,
                title: 'Logistics & Supply Chain',
                description: 'Unify procurement, warehousing, and distribution with real-time insights to ensure faster, more reliable, and cost-effective operations.',
                features: [
                  'Streamline warehousing, shipping, and inventory tracking',
                  'Get full visibility across suppliers and deliveries',
                  'Resolve bottlenecks quickly to maintain smooth operations'
                ],
                image: 'https://i.pinimg.com/736x/94/b0/ed/94b0ed2a49f4452f0b4930f7c9ef09c1.jpg',
                alt: 'Logistics & Supply Chain'
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
      <section className="md:px-8 md:pt-6 max-w-7xl mr-auto ml-auto pt-4 pr-5 pl-5" aria-labelledby="home-title">
        <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
          <div className="sm:p-8 md:p-12 pt-6 pr-6 pb-6 pl-6">
            <div className="flex items-start md:items-center gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em]">
                Premier SAP Consulting — Utrecht, Netherlands
                </p>
                <h1 id="home-title" className="sm:text-4xl md:text-5xl text-3xl font-bold text-slate-700 tracking-tight mt-2">
                ASMI: Your SAP Success Partner
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                At ASMI, we deliver end-to-end SAP consulting to enhance efficiency, innovation, and growth. Our experts manage implementation, integration, and optimization, aligning your SAP systems with business goals for reliable, future-proof results.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3 focus:outline-none"
                  >
                    Request Consultation
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-none px-5 py-3 text-sm font-bold text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition"
                  >
                    Explore Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* Vector Illustration + image placeholder */}
              <div className="w-full md:w-[400px] shrink-0 space-y-3">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-1">
              <h2 id="who-we-are-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">Who We Are</h2>
              <div className="md:block order-2 mt-4 md:mt-0">
                <img
                  src="https://i.pinimg.com/1200x/4e/36/82/4e368242894207ed5bcda793b443f050.jpg"
                  alt="Who We Are - ASMI Team"
                  loading="lazy"
                  className="aspect-square w-full object-cover rounded-none md:hidden"
                />
              </div>
              <p className="mt-3 md:mt-3 text-slate-700/90">
                At ASMI, we are a premier SAP consulting firm dedicated to transforming how businesses operate. Our experienced team of SAP experts brings deep technical knowledge and industry insights to every project. We believe in creating solutions that not only meet today's needs but also position your business for future growth.
              </p>
              <p className="mt-4 text-slate-700/90">
                With offices in the Netherlands and India, we serve clients across the globe, delivering tailored SAP solutions that drive efficiency, innovation, and measurable results. Our commitment to excellence and client success sets us apart in the SAP consulting landscape.
              </p>
              <div className="mt-6 md:hidden">
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
            <div className="order-2 hidden md:block">
              <img
                src="https://i.pinimg.com/1200x/4e/36/82/4e368242894207ed5bcda793b443f050.jpg"
                alt="Who We Are - ASMI Team"
                loading="lazy"
                className="aspect-square w-full object-cover rounded-none"
              />
            </div>
          </div>
          <div className="hidden md:flex mt-6">
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
      </section>

      {/* Clients Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-8 md:pt-12" aria-labelledby="partners-title">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <div className="flex items-center justify-between gap-3">
            <h2 id="partners-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">
            Clients We've Served
            </h2>
          </div>
          <div className="mt-5">
            <Carousel speed="slow" className="py-4">
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
              <h2 id="services-title" className="text-3xl md:text-4xl tracking-tight font-bold text-white">
                Our Services
              </h2>
              <p className="text-white/90 text-lg max-w-3xl">
                Comprehensive SAP solutions tailored to your business needs. From cloud deployment to ongoing support, we deliver end-to-end services that drive efficiency and innovation.
              </p>
              <div className="mt-4 md:hidden">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 hover:bg-slate-50 transition text-sm font-bold text-primary bg-white border-secondary border rounded-none pt-2 pr-4 pb-2 pl-4"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 hover:bg-slate-50 transition text-sm font-bold text-primary bg-white border-secondary border rounded-none pt-2 pr-4 pb-2 pl-4"
              >
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: 'SAP Public Cloud',
                description: 'Deploy secure, scalable SAP cloud solutions for streamlined operations and agility.',
                href: '/services/sap-public-cloud',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop'
              },
              {
                title: 'SAP Implementations and Rollouts',
                description: 'Execute tailored SAP deployments with proven Greenfield, Brownfield, or Bluefield strategies.',
                href: '/services/sap-implementations-and-rollouts',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop'
              },
              {
                title: 'SAP Document and Reporting Compliance',
                description: 'Simplify e-Invoicing and tax reporting with seamless, compliant SAP solutions.',
                href: '/services/sap-document-and-reporting-compliance',
                image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop'
              },
              {
                title: 'SAP Consulting & Advisory',
                description: 'Unlock strategic value with expert SAP guidance tailored to your business goals.',
                href: '/services/sap-consulting-advisory',
                image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop'
              },
              {
                title: 'Data & Migration Services',
                description: 'Ensure smooth, secure data migration for optimized SAP performance.',
                href: '/services/data-migration-services',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop'
              },
              {
                title: 'Support & Managed Services',
                description: 'Maintain peak SAP performance with proactive support and management.',
                href: '/services/support-managed-services',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop'
              },
              {
                title: 'Training & Change Management',
                description: 'Empower teams with targeted training for seamless SAP adoption.',
                href: '/services/training-change-management',
                image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop'
              },
              {
                title: 'SAP Project Management & Governance',
                description: 'Drive project success with expert oversight and disciplined governance.',
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
                    Learn more
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
            Industries We Serve
            </h2>
            <div className="mt-3 md:hidden">
              <Link
                to="/industries"
                className="inline-flex items-center gap-2 hover:bg-slate-50 transition text-sm font-bold text-primary bg-white border-secondary border rounded-none pt-2 pr-4 pb-2 pl-4"
              >
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="hidden md:block">
              <Link
                to="/industries"
                className="inline-flex items-center gap-2 hover:bg-slate-50 transition text-sm font-bold text-primary bg-white border-secondary border rounded-none pt-2 pr-4 pb-2 pl-4"
              >
                Learn more
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
          <h2 id="testimonials-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">What Clients Say</h2>
          <div className="mt-5">
            <Carousel speed="slow" className="py-4">
              {[
                { quote: '"Their SAP expertise transformed our processes, efficient, reliable, and seamless implementation!" – Cargill Corporation', logoFile: 'cargill logo.jpg' },
                { quote: '"A trusted partner for SAP solutions. They understood our business needs perfectly." – Hitachi Energy', logoFile: 'hitachi logo.png' },
                { quote: '"Professional, proactive, and results-driven. Our SAP system has never run smoother." – Sucafina', logoFile: 'sucafina logo.svg' },
                { quote: '"Exceptional support and guidance throughout our SAP journey. Highly recommended!" – Johnson & Johnson', logoFile: 'johnson and johnson logo.png' }
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

      {/* Frequently Asked Questions Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="faq-title">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="faq-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">Frequently Asked Questions</h2>
          <FAQ />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="final-cta-title">
        <div className="rounded-none bg-blue-100 text-slate-700 p-8 md:p-12">
          <div className="flex justify-center">
            <div className="text-center max-w-2xl">
              <h2 id="final-cta-title" className="text-3xl md:text-4xl font-bold tracking-tight">
            Transform your SAP operations with ASMI.
          </h2>
              <p className="mt-4 text-slate-600 max-w-2xl">
            Streamline your systems, improve reporting, and get results that matter.
          </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
            >
              Request a consultation
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
  const items = [
    {
      q: 'How does ASMI ensure a smooth SAP implementation?',
      a: 'We follow a structured rollout plan with clear milestones, thorough testing, and close collaboration with your team to avoid downtime and ensure the system works from day one.'
    },
    {
      q: 'Can we customize SAP solutions for our unique business needs?',
      a: 'Yes, we configure SAP workflows, reports, and dashboards to match your exact operational requirements, so the system fits your business processes perfectly.'
    },
    {
      q: 'Can we integrate SAP with our existing systems?',
      a: 'Absolutely. We connect SAP with your ERP, CRM, and other software, enabling seamless data flow and unified reporting without disrupting ongoing operations.'
    },
    {
      q: 'Does ASMI provide training for our team on SAP systems?',
      a: 'Yes, we deliver tailored training sessions, user manuals, and hands-on support to ensure your staff can use SAP confidently and independently.'
    },
    {
      q: 'How quickly can we see improvements after implementing SAP with ASMI?',
      a: 'Clients typically notice better process efficiency and accurate reporting within the first few weeks, with measurable operational improvements and cost savings visible within 2–3 months.'
    }
  ];

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
