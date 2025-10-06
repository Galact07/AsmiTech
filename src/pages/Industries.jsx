import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Factory, ShoppingCart, Banknote, HeartPulse, CheckCircle } from 'lucide-react';

const Industries = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-16 max-w-7xl mr-auto ml-auto pt-10 pr-5 pl-5" aria-labelledby="industries-title">
        <div className="rounded-3xl bg-white/70 backdrop-blur-[10px] border border-slate-200 shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] overflow-hidden transition duration-500 ease-in">
          <div className="sm:p-8 md:p-12 pt-6 pr-6 pb-6 pl-6">
            <div className="flex items-start md:items-center gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-light text-slate-500 tracking-[0.18em]">
                  Industry Solutions
                </p>
                <h1 id="industries-title" className="sm:text-5xl md:text-6xl text-4xl font-light text-slate-900 tracking-tight mt-2">
                  Tailored SAP solutions for your industry.
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  We understand the unique challenges and opportunities in each industry. Our solutions are designed to address specific sector requirements while delivering measurable business value.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:shadow-[0_0_0_5px_rgba(212,160,23,0.25)] hover:brightness-105 transition text-sm font-medium text-slate-50 bg-primary border-slate-200 border rounded-full px-5 py-3"
                  >
                    Discuss Your Industry Needs
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition"
                  >
                    View All Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* Industry Illustration */}
              <div className="w-full md:w-[440px] shrink-0 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=900&q=60&auto=format&fit=crop"
                  alt="Industry solutions overview"
                  loading="lazy"
                  className="backdrop-blur-[10px] bg-white/70 w-full border-slate-200 border rounded-2xl pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="industries">
        <div className="backdrop-blur-[10px] md:p-8 transition duration-500 ease-in bg-white/60 border-slate-200 border rounded-2xl pt-6 pr-6 pb-6 pl-6">
          <h2 className="md:text-2xl text-xl font-light text-slate-900 tracking-tight" id="industries">
            Industries We Serve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 gap-x-6 gap-y-6">
            {[
              {
                icon: Factory,
                title: 'Manufacturing',
                description: 'From plan‑to‑produce to EWM, we optimize production and logistics with real‑time visibility.',
                features: [
                  'MES & IoT telemetry for predictive maintenance',
                  'Advanced ATP and supply planning',
                  'Quality management automation',
                  'Production scheduling optimization',
                  'Inventory management and tracking'
                ],
                image: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80',
                alt: 'Manufacturing floor with SAP integration'
              },
              {
                icon: ShoppingCart,
                title: 'Retail',
                description: 'Unify channels and inventory while improving forecast accuracy and margin.',
                features: [
                  'Omni‑channel stock and fulfillment',
                  'Demand sensing and promotions',
                  'Loyalty and customer insights',
                  'Point of sale integration',
                  'Supply chain visibility'
                ],
                image: 'https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=1080&q=80',
                alt: 'Retail analytics dashboard'
              },
              {
                icon: Banknote,
                title: 'Finance',
                description: 'Shorten time‑to‑close, increase transparency, and ensure regulatory compliance.',
                features: [
                  'Blackline‑style reconciliations',
                  'Profitability and cost analytics',
                  'IFRS and local GAAP reporting',
                  'Risk management and compliance',
                  'Financial planning and analysis'
                ],
                image: 'https://images.unsplash.com/photo-1635151227785-429f420c6b9d?w=1080&q=80',
                alt: 'Financial dashboards and reporting'
              },
              {
                icon: HeartPulse,
                title: 'Healthcare',
                description: 'Protect patient data and streamline clinical supply while meeting regulations.',
                features: [
                  'Patient data governance and interoperability',
                  'Procurement and device tracking',
                  'Costing and reimbursement management',
                  'Clinical trial management',
                  'Regulatory compliance automation'
                ],
                image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1600&q=80',
                alt: 'Healthcare system interface'
              }
            ].map((industry, index) => (
              <article key={index} className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition">
                <div className="flex text-sm text-slate-700/80 gap-x-2 gap-y-2 items-center mb-4">
                  <industry.icon className="h-6 w-6 text-primary" />
                  <span className="font-medium">{industry.title}</span>
                </div>
                <h3 className="text-xl tracking-tight font-light text-slate-900 mb-3">
                  {industry.title}
                </h3>
                <p className="text-slate-700/90 mb-4">{industry.description}</p>
                <ul className="space-y-2 mb-4">
                  {industry.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm text-slate-700/80">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <img
                  src={industry.image}
                  alt={industry.alt}
                  loading="lazy"
                  className="w-full rounded-lg border border-slate-200"
                />
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-slate-700/80">
              Need a tailored blueprint? We assemble composable modules to fit your constraints.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-primary bg-white border border-secondary hover:bg-slate-50"
            >
              Request a blueprint
            </Link>
          </div>
        </div>
      </section>

      {/* Industry Expertise Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="expertise">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="expertise" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Industry Expertise
          </h2>
          <p className="mt-2 text-slate-700/80">
            Our team brings deep industry knowledge and SAP expertise to deliver solutions that address your specific business challenges.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Regulatory Compliance',
                description: 'We ensure your SAP implementation meets industry-specific regulations and standards.',
                icon: '🛡️'
              },
              {
                title: 'Best Practices',
                description: 'We apply industry best practices and proven methodologies to every project.',
                icon: '⭐'
              },
              {
                title: 'Scalable Solutions',
                description: 'Our solutions grow with your business and adapt to changing industry requirements.',
                icon: '📈'
              }
            ].map((expertise, index) => (
              <div key={index} className="text-center p-6 rounded-xl border border-slate-200 bg-white">
                <div className="text-3xl mb-4">{expertise.icon}</div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">{expertise.title}</h3>
                <p className="text-slate-700/80 text-sm">{expertise.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="cta">
        <div className="rounded-2xl bg-primary text-white p-8 md:p-12 text-center">
          <h2 id="cta" className="text-2xl md:text-3xl font-light tracking-tight">
            Ready to transform your industry with SAP?
          </h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Let's discuss how our industry expertise can help you achieve your business goals and stay ahead of the competition.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary hover:bg-slate-50 transition px-6 py-3 rounded-full font-medium"
            >
              Start Your Industry Transformation
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

export default Industries;
