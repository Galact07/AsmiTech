import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Shield, Award, Factory, ShoppingCart, Banknote, HeartPulse, CheckCircle } from 'lucide-react';
import Carousel from '../components/ui/carousel';

const Services = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-4 max-w-7xl mr-auto ml-auto pt-3 pr-5 pl-5" aria-labelledby="services-title">
        <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
          <div className="sm:p-8 md:p-12 pt-0 pr-6 pb-6 pl-6">
            <div className="flex items-start md:items-center gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em]">
                  Our Services
                </p>
                <h1 id="services-title" className="sm:text-4xl md:text-5xl text-3xl font-bold text-slate-700 tracking-tight mt-2">
                  End-to-end SAP solutions for mid-market success.
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  From strategy to optimization, we deliver comprehensive SAP services that drive measurable business value and sustainable growth.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3 focus:outline-none"
                  >
                    Start Your Project
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    to="/industries"
                    className="inline-flex items-center gap-2 rounded-none px-5 py-3 text-sm font-bold text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition"
                  >
                    Industry Solutions
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* Services Illustration */}
              <div className="w-full md:w-[440px] shrink-0 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop"
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
              Our Services
            </h2>
            <p className="text-white/90 text-lg max-w-4xl">
              Comprehensive SAP solutions tailored to your business needs. From cloud deployment to ongoing support, we deliver end-to-end services that drive efficiency, innovation, and measurable results across all industries.
            </p>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                alt: 'SAP Public Cloud',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop'
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
                alt: 'SAP Implementations and Rollouts',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop'
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
                alt: 'SAP Document and Reporting Compliance',
                image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop'
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
                alt: 'SAP Consulting & Advisory',
                image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop'
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
                alt: 'Data & Migration Services',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop'
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
                alt: 'Support & Managed Services',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop'
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
                alt: 'Training & Change Management',
                image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop'
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
                      Learn more
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
            Technology Stack
          </h2>
          <p className="mt-2 text-slate-700/80">
            We work with the latest SAP technologies and complementary solutions to deliver comprehensive business value.
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
          <h2 id="testimonials-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">What Clients Say</h2>
          <div className="mt-5">
            <Carousel speed="very-slow" className="py-4">
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

      {/* CTA Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="cta">
        <div className="rounded-none bg-blue-100 text-slate-700 p-8 md:p-12">
          <div className="flex justify-center">
            <div className="text-center max-w-2xl">
              <h2 id="cta" className="text-3xl md:text-4xl font-bold tracking-tight">
                Ready to transform your business with SAP?
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl">
                Let's discuss how our SAP expertise can help you achieve your business goals and drive sustainable growth.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
                >
                  Get Started Today
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white transition px-6 py-3 rounded-none font-bold"
                >
                  Learn More About Us
                  <ArrowRight className="h-4 w-4" />
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
