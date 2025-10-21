import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ShoppingBag, Flame, Pill, FlaskConical, Landmark, Truck, Cloud, Settings, FileText, Users, Database, Headphones, GraduationCap, Clipboard } from 'lucide-react';
import Carousel from '../components/ui/carousel';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-16 max-w-7xl mr-auto ml-auto pt-10 pr-5 pl-5" aria-labelledby="home-title">
        <div className="rounded-3xl bg-white/70 backdrop-blur-[10px] border border-slate-200 shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] overflow-hidden transition duration-500 ease-in">
          <div className="sm:p-8 md:p-12 pt-6 pr-6 pb-6 pl-6">
            <div className="flex items-start md:items-center gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-light text-slate-500 tracking-[0.18em]">
                Premier SAP Consulting — Utrecht, Netherlands
                </p>
                <h1 id="home-title" className="sm:text-5xl md:text-6xl text-4xl font-light text-slate-900 tracking-tight mt-2">
                Simplifying SAP, Amplifying Success.
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                At ASMI, we deliver end-to-end SAP consulting to enhance efficiency, innovation, and growth. Our experts manage implementation, integration, and optimization, aligning your SAP systems with business goals for reliable, future-proof results.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-medium text-slate-50 bg-primary border-slate-200 border rounded-full px-5 py-3 focus:outline-none"
                  >
                    Request Consultation
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition"
                  >
                    Explore Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* Vector Illustration + image placeholder */}
              <div className="w-full md:w-[440px] shrink-0 space-y-3">
                <img
                  src="https://i.pinimg.com/736x/e6/ac/b8/e6acb84a0f96a818e0700c7d4b3e1c97.jpg"
                  alt="SAP workflow visual"
                  loading="lazy"
                  className="backdrop-blur-[10px] bg-white/70 w-full border-slate-200 border rounded-2xl pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-8 md:pt-12" aria-labelledby="partners-title">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <div className="flex items-center justify-between gap-3">
            <h2 id="partners-title" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Clients We've Served
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
                <div key={index} className="flex-shrink-0 mx-6 flex items-center justify-center h-20 w-48">
                  <div className="flex items-center justify-center h-16 w-44 bg-white border border-slate-200 rounded-lg px-4 hover:bg-slate-50 transition-colors">
                    <img 
                      src={`/src/assets/logos/${client.logoFile}`}
                      alt={`${client.name} logo`}
                      className="max-h-12 max-w-32 object-contain"
                    />
          </div>
              </div>
            ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="mission-title">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 id="mission-title" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">Our Mission</h2>
              <p className="mt-3 text-slate-700/90">
                At ASMI, we create SAP solutions that make a real difference. We simplify complex processes, unlock new opportunities, and deliver results you can measure. Our goal is to help businesses work smarter, innovate faster, and achieve more with every solution we implement.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="https://i.pinimg.com/1200x/4e/36/82/4e368242894207ed5bcda793b443f050.jpg"
                alt="Our Mission - SAP Solutions"
                loading="lazy"
                className="aspect-square w-full object-cover rounded-2xl border border-slate-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Services Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="services-title">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <div className="flex items-center justify-between">
            <h2 id="services-title" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
              Our Services
            </h2>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 hover:bg-slate-50 transition text-sm font-medium text-primary bg-white border-secondary border rounded-full pt-2 pr-4 pb-2 pl-4"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                title: 'SAP Public Cloud',
                description: 'Deploy secure, scalable SAP cloud solutions for streamlined operations and agility.',
                logo: 'Cloud',
                alt: 'SAP Public Cloud'
              },
              {
                title: 'SAP Implementations and Rollouts',
                description: 'Execute tailored SAP deployments with proven Greenfield, Brownfield, or Bluefield strategies.',
                logo: 'Settings',
                alt: 'SAP Implementations and Rollouts'
              },
              {
                title: 'SAP Document and Reporting Compliance',
                description: 'Simplify e-Invoicing and tax reporting with seamless, compliant SAP solutions.',
                logo: 'FileText',
                alt: 'SAP Document and Reporting Compliance'
              },
              {
                title: 'SAP Consulting & Advisory',
                description: 'Unlock strategic value with expert SAP guidance tailored to your business goals.',
                logo: 'Users',
                alt: 'SAP Consulting & Advisory'
              },
              {
                title: 'Data & Migration Services',
                description: 'Ensure smooth, secure data migration for optimized SAP performance.',
                logo: 'Database',
                alt: 'Data & Migration Services'
              },
              {
                title: 'Support & Managed Services',
                description: 'Maintain peak SAP performance with proactive support and management.',
                logo: 'Headphones',
                alt: 'Support & Managed Services'
              },
              {
                title: 'Training & Change Management',
                description: 'Empower teams with targeted training for seamless SAP adoption.',
                logo: 'GraduationCap',
                alt: 'Training & Change Management'
              },
              {
                title: 'SAP Project Management & Governance',
                description: 'Drive project success with expert oversight and disciplined governance.',
                logo: 'Clipboard',
                alt: 'SAP Project Management & Governance'
              }
            ].map((service, index) => (
              <article key={index} className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-[10px] p-5 hover:shadow-md transition h-full">
                <div className="flex items-start gap-4 h-full">
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
                    {service.logo === 'Cloud' && <Cloud className="h-8 w-8 text-primary" />}
                    {service.logo === 'Settings' && <Settings className="h-8 w-8 text-primary" />}
                    {service.logo === 'FileText' && <FileText className="h-8 w-8 text-primary" />}
                    {service.logo === 'Users' && <Users className="h-8 w-8 text-primary" />}
                    {service.logo === 'Database' && <Database className="h-8 w-8 text-primary" />}
                    {service.logo === 'Headphones' && <Headphones className="h-8 w-8 text-primary" />}
                    {service.logo === 'GraduationCap' && <GraduationCap className="h-8 w-8 text-primary" />}
                    {service.logo === 'Clipboard' && <Clipboard className="h-8 w-8 text-primary" />}
                  </div>
                  <div className="flex flex-col justify-between">
                    <h3 className="mt-2 text-lg tracking-tight font-light">{service.title}</h3>
                    <p className="mt-2 text-slate-700/80">{service.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="sectors">
        <div className="backdrop-blur-[10px] md:p-8 transition duration-500 ease-in bg-white/60 border-slate-200 border rounded-2xl pt-6 pr-6 pb-6 pl-6">
          <h2 className="md:text-2xl text-xl font-light text-slate-900 tracking-tight" id="sectors">
          Industries We Serve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 gap-x-6 gap-y-6">
            {[
              {
                icon: ShoppingBag,
                title: 'Retail & Consumer Goods',
                description: 'Integrate sales, inventory, and customer insights to make smarter decisions and deliver a seamless shopping experience across all channels.',
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
            ].map((sector, index) => (
              <article key={index} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex text-sm text-slate-700/80 gap-x-2 gap-y-2 items-center">
                  <sector.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-3 text-base md:text-lg tracking-tight font-light text-slate-900">
                  {sector.title}
                </h3>
                <p className="mt-2 text-sm text-slate-700/90">{sector.description}</p>
                <ul className="mt-3 text-sm text-slate-700/80 list-disc list-inside space-y-1">
                  {sector.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
                <img
                  src={sector.image}
                  alt={sector.alt}
                  loading="lazy"
                  className="mt-4 w-full rounded-lg border border-slate-200"
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What Clients Say Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="testimonials-title">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="testimonials-title" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">What Clients Say</h2>
          <div className="mt-5">
            <Carousel speed="slow" className="py-4">
              {[
                { quote: '"Their SAP expertise transformed our processes, efficient, reliable, and seamless implementation!" – Cargill Corporation', logoFile: 'cargill logo.jpg' },
                { quote: '"A trusted partner for SAP solutions. They understood our business needs perfectly." – Hitachi Energy', logoFile: 'hitachi logo.png' },
                { quote: '"Professional, proactive, and results-driven. Our SAP system has never run smoother." – Sucafina', logoFile: 'sucafina logo.svg' },
                { quote: '"Exceptional support and guidance throughout our SAP journey. Highly recommended!" – Johnson & Johnson', logoFile: 'johnson and johnson logo.png' }
              ].map((testimonial, idx) => (
                <div key={idx} className="flex-shrink-0 mx-4 w-96">
                  <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-[10px] p-6 h-36 flex items-center gap-6">
                    <div className="flex-shrink-0 w-24 h-20 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-3">
                      <img 
                        src={`/src/assets/logos/${testimonial.logoFile}`}
                        alt={`${testimonial.logoFile.split(' ')[0]} logo`}
                        className="max-h-16 max-w-20 object-contain"
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
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="faq-title" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">Frequently Asked Questions</h2>
          <FAQ />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="final-cta-title">
        <div className="rounded-2xl bg-primary text-white p-8 md:p-12 text-center">
          <h2 id="final-cta-title" className="text-2xl md:text-3xl font-light tracking-tight">
            Transform your SAP operations with ASMI.
          </h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Streamline your systems, improve reporting, and get results that matter.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary hover:bg-slate-50 transition px-6 py-3 rounded-full font-medium"
            >
              Request a consultation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 transition px-6 py-3 rounded-full font-medium"
            >
              Explore Our Services
              <ArrowRight className="h-4 w-4" />
            </Link>
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
    <div className="mt-4 divide-y divide-slate-200 border border-slate-200 rounded-2xl bg-white/70">
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
                <span className="text-slate-900">{item.q}</span>
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
              <div className="px-5 pb-4 text-slate-700/90">
                {item.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
