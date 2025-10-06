import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Shield, Award, Factory, ShoppingCart, Banknote, HeartPulse, CheckCircle } from 'lucide-react';

const Services = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-16 max-w-7xl mr-auto ml-auto pt-10 pr-5 pl-5" aria-labelledby="services-title">
        <div className="rounded-3xl bg-white/70 backdrop-blur-[10px] border border-slate-200 shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] overflow-hidden transition duration-500 ease-in">
          <div className="sm:p-8 md:p-12 pt-6 pr-6 pb-6 pl-6">
            <div className="flex items-start md:items-center gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-light text-slate-500 tracking-[0.18em]">
                  Our Services
                </p>
                <h1 id="services-title" className="sm:text-5xl md:text-6xl text-4xl font-light text-slate-900 tracking-tight mt-2">
                  End-to-end SAP solutions for mid-market success.
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  From strategy to optimization, we deliver comprehensive SAP services that drive measurable business value and sustainable growth.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:shadow-[0_0_0_5px_rgba(212,160,23,0.25)] hover:brightness-105 transition text-sm font-medium text-slate-50 bg-primary border-slate-200 border rounded-full px-5 py-3"
                  >
                    Start Your Project
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    to="/industries"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition"
                  >
                    Industry Solutions
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* Services Illustration */}
              <div className="w-full md:w-[440px] shrink-0 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=60&auto=format&fit=crop"
                  alt="SAP services overview"
                  loading="lazy"
                  className="backdrop-blur-[10px] bg-white/70 w-full border-slate-200 border rounded-2xl pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <div className="px-6 sm:px-8 md:px-12 py-4 flex items-center gap-4">
            <div className="inline-flex items-center gap-2 text-xs text-slate-600/80">
              <Shield className="h-4 w-4 text-primary" />
              <span>GDPR compliant • SAP Partner aligned</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="inline-flex items-center gap-2 text-xs text-slate-600/80">
              <Award className="h-4 w-4 text-primary" />
              <span>Trusted by mid‑market enterprises</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="core-services">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="core-services" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Core Services
          </h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'SAP Advisory & Strategy',
                description: 'Transform your business with strategic SAP roadmaps that align technology with measurable outcomes.',
                features: [
                  'Digital transformation strategy',
                  'SAP landscape assessment',
                  'Business case development',
                  'Change management planning',
                  'Vendor selection support'
                ],
                image: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=480&q=60&auto=format&fit=crop',
                alt: 'Strategy planning'
              },
              {
                title: 'Implementation & Migration',
                description: 'Seamless SAP implementations and migrations with proven methodologies and best practices.',
                features: [
                  'S/4HANA implementations',
                  'ERP system migrations',
                  'Cloud and hybrid deployments',
                  'Data migration and cleansing',
                  'Integration and testing'
                ],
                image: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80',
                alt: 'Implementation process'
              },
              {
                title: 'Optimization & Support',
                description: 'Maximize your SAP investment with ongoing optimization and expert support services.',
                features: [
                  'Performance tuning',
                  'Process optimization',
                  'User training and adoption',
                  'System monitoring',
                  'Maintenance and updates'
                ],
                image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=480&q=60&auto=format&fit=crop',
                alt: 'System optimization'
              },
              {
                title: 'Industry Solutions',
                description: 'Tailored SAP solutions for specific industries with deep domain expertise.',
                features: [
                  'Manufacturing solutions',
                  'Retail and commerce',
                  'Financial services',
                  'Healthcare systems',
                  'Composable architecture'
                ],
                image: 'https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=1080&q=80',
                alt: 'Industry solutions'
              }
            ].map((service, index) => (
              <article key={index} className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-[10px] p-6 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <img
                    src={service.image}
                    alt={service.alt}
                    loading="lazy"
                    className="bg-white/70 w-24 h-16 object-cover border-slate-200 border rounded-lg pt-1 pr-1 pb-1 pl-1"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg tracking-tight font-light text-slate-900">{service.title}</h3>
                    <p className="mt-2 text-slate-700/80 text-sm">{service.description}</p>
                    <ul className="mt-3 space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-slate-700/80">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="process">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="process" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Our Process
          </h2>
          <p className="mt-2 text-slate-700/80">
            We follow a proven methodology that ensures successful project delivery and maximum business value.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Discovery',
                description: 'We start by understanding your business goals, current systems, and challenges to create a comprehensive transformation roadmap.'
              },
              {
                step: '02',
                title: 'Design',
                description: 'Our team designs a tailored solution architecture that aligns with your business processes and technical requirements.'
              },
              {
                step: '03',
                title: 'Implement',
                description: 'We execute the implementation using agile methodologies, ensuring minimal disruption to your business operations.'
              },
              {
                step: '04',
                title: 'Optimize',
                description: 'We provide ongoing support and optimization to ensure your SAP system continues to deliver value and grow with your business.'
              }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-lg font-medium mb-4">
                  {phase.step}
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">{phase.title}</h3>
                <p className="text-slate-700/80 text-sm">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="technology">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="technology" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Technology Stack
          </h2>
          <p className="mt-2 text-slate-700/80">
            We work with the latest SAP technologies and complementary solutions to deliver comprehensive business value.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'SAP S/4HANA',
              'SAP Fiori',
              'SAP Analytics Cloud',
              'SAP SuccessFactors',
              'SAP Ariba',
              'SAP Concur',
              'SAP Integration Suite',
              'SAP Business Technology Platform'
            ].map((tech, index) => (
              <div key={index} className="flex items-center justify-center h-16 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition">
                <span className="text-slate-600 text-sm font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="cta">
        <div className="rounded-2xl bg-primary text-white p-8 md:p-12 text-center">
          <h2 id="cta" className="text-2xl md:text-3xl font-light tracking-tight">
            Ready to transform your business with SAP?
          </h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Let's discuss how our SAP expertise can help you achieve your business goals and drive sustainable growth.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary hover:bg-slate-50 transition px-6 py-3 rounded-full font-medium"
            >
              Get Started Today
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 transition px-6 py-3 rounded-full font-medium"
            >
              Learn More About Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
