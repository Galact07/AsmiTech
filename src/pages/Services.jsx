import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Shield, Award, Factory, ShoppingCart, Banknote, HeartPulse, CheckCircle, Cloud, Settings, FileText, Users, Database, Headphones, GraduationCap, Clipboard } from 'lucide-react';
import Carousel from '../components/ui/carousel';

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
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-medium text-slate-50 bg-primary border-slate-200 border rounded-full px-5 py-3 focus:outline-none"
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
                  src="https://i.pinimg.com/736x/96/9d/14/969d14e99603860237ae3526342f47c7.jpg"
                  alt="SAP services overview"
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
                      src={`/logos/${client.logoFile}`}
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

      {/* Our Services Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="our-services">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="our-services" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Our Services
          </h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'SAP Public Cloud',
                description: 'Deploy secure, scalable SAP cloud solutions for streamlined operations and agility.',
                features: [
                  'Rapid deployment with minimal disruption to ongoing operations.',
                  'Flexible, scalable infrastructure to support growing business needs.',
                  'Integration with existing systems for seamless data flow.'
                ],
                logo: 'Cloud',
                alt: 'SAP Public Cloud'
              },
              {
                title: 'SAP Implementations and Rollouts',
                description: 'Execute tailored SAP deployments with proven Greenfield, Brownfield, or Bluefield strategies.',
                features: [
                  'Full lifecycle management from planning to go-live.',
                  'Customization to match specific business processes and reporting requirements.',
                  'Risk mitigation and quality assurance throughout the deployment.'
                ],
                logo: 'Settings',
                alt: 'SAP Implementations and Rollouts'
              },
              {
                title: 'SAP Document and Reporting Compliance',
                description: 'Simplify e-Invoicing and tax reporting with seamless, compliant SAP solutions.',
                features: [
                  'Automate invoicing and reporting to reduce errors and delays.',
                  'Ensure compliance with local and international regulations.',
                  'Provide audit-ready documentation and reporting capabilities.'
                ],
                logo: 'FileText',
                alt: 'SAP Document and Reporting Compliance'
              },
              {
                title: 'SAP Consulting & Advisory',
                description: 'Unlock strategic value with expert SAP guidance tailored to your business goals.',
                features: [
                  'Process analysis to identify bottlenecks and optimization opportunities.',
                  'Recommendations on system enhancements and best practices.',
                  'Strategic planning for SAP adoption, upgrades, and transformation.'
                ],
                logo: 'Users',
                alt: 'SAP Consulting & Advisory'
              },
              {
                title: 'Data & Migration Services',
                description: 'Ensure smooth, secure data migration for optimized SAP performance.',
                features: [
                  'Data cleansing, validation, and mapping for accuracy.',
                  'Minimized downtime during migration with phased approaches.',
                  'Integration with legacy systems and new SAP modules.'
                ],
                logo: 'Database',
                alt: 'Data & Migration Services'
              },
              {
                title: 'Support & Managed Services',
                description: 'Maintain peak SAP performance with proactive support and management.',
                features: [
                  '24/7 monitoring and issue resolution to avoid disruptions.',
                  'System optimization to maintain efficiency and reliability.',
                  'Regular updates, patches, and preventive maintenance.'
                ],
                logo: 'Headphones',
                alt: 'Support & Managed Services'
              },
              {
                title: 'Training & Change Management',
                description: 'Empower teams with targeted training for seamless SAP adoption.',
                features: [
                  'Customized training sessions for different user roles.',
                  'Support for change adoption and process standardization.',
                  'Documentation and resources to ensure long-term proficiency.'
                ],
                logo: 'GraduationCap',
                alt: 'Training & Change Management'
              },
              {
                title: 'SAP Project Management & Governance',
                description: 'Drive project success with expert oversight and disciplined governance.',
                features: [
                  'Clear project planning, timelines, and milestone tracking.',
                  'Risk management and mitigation throughout the project lifecycle.',
                  'Stakeholder communication and reporting for transparency and accountability.'
                ],
                logo: 'Clipboard',
                alt: 'SAP Project Management & Governance'
              }
            ].map((service, index) => (
              <article key={index} className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-[10px] p-6 hover:shadow-md transition">
                <div className="flex items-start gap-4">
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

      {/* Technology Stack Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="technology">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="technology" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Technology Stack
          </h2>
          <p className="mt-2 text-slate-700/80">
            We work with the latest SAP technologies and complementary solutions to deliver comprehensive business value.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'SAP S/4HANA', logo: 'SAP S4HANA.png' },
              { name: 'SAP Fiori', logo: 'SAP Fiori.png' },
              { name: 'SAP Analytics Cloud', logo: 'SAP Analytics Cloud.png' },
              { name: 'SAP Ariba', logo: 'SAP Ariba.png' },
              { name: 'SAP Integration Suite', logo: 'SAP Integration Suite.png' },
              { name: 'SAP Business Technology Platform', logo: 'SAP Business Technology Platform.png' }
            ].map((tech, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition">
                <div className="w-full h-16 mb-3 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg">
                  <img
                    src={`/logos/${tech.logo}`}
                    alt={`${tech.name} logo`}
                    className="max-h-12 max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-slate-600 text-sm font-medium text-center">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Clients Say Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="testimonials-title">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="testimonials-title" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">What Clients Say</h2>
          <div className="mt-5">
            <Carousel speed="very-slow" className="py-4">
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
                        src={`/logos/${testimonial.logoFile}`}
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
