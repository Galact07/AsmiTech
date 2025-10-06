import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Shield, Award, Factory, ShoppingCart, Banknote, HeartPulse } from 'lucide-react';

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
                  Boutique SAP Consulting — Utrecht, Netherlands
                </p>
                <h1 id="home-title" className="sm:text-5xl md:text-6xl text-4xl font-light text-slate-900 tracking-tight mt-2">
                  Empowering SAP transformations for mid‑market leaders.
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  We deliver end‑to‑end SAP advisory, implementation, and optimization to accelerate value, reduce risk, and align technology with measurable outcomes.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:shadow-[0_0_0_5px_rgba(212,160,23,0.25)] hover:brightness-105 transition text-sm font-medium text-slate-50 bg-primary border-slate-200 border rounded-full px-5 py-3"
                  >
                    Start Your SAP Journey
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
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=60&auto=format&fit=crop"
                  alt="SAP workflow visual"
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

      {/* Partners Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-8 md:pt-12" aria-labelledby="partners-title">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <div className="flex items-center justify-between gap-3">
            <h2 id="partners-title" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
              Trusted ecosystem partners
            </h2>
            <p className="text-sm text-slate-700/70">Neutral, brand‑first presentation</p>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {['SAP', 'DSAG', 'EuroCloud', 'NEN7510', 'ISAE 3402', 'ISO/IEC 27001'].map((partner) => (
              <div key={partner} className="flex hover:bg-slate-50 transition bg-white h-16 border-slate-200 border rounded-xl items-center justify-center">
                <span className="text-slate-500 text-sm">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Services Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="services-title">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <div className="flex items-center justify-between">
            <h2 id="services-title" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
              Key services
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
                title: 'SAP Advisory & Strategy',
                description: 'Transformation roadmaps and readiness grounded in value and governance best practice.',
                image: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=480&q=60&auto=format&fit=crop',
                alt: 'Strategy session'
              },
              {
                title: 'Implementation & Migration',
                description: 'S/4HANA and ERP solutions delivered with proven templates and scalable DevOps.',
                image: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80',
                alt: 'Migration planning'
              },
              {
                title: 'Optimization & Support',
                description: 'Performance improvements, cost control, and resilient operations.',
                image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=480&q=60&auto=format&fit=crop',
                alt: 'Performance tuning'
              },
              {
                title: 'Industry Solutions',
                description: 'Composable blueprints for manufacturing, retail, finance, and healthcare.',
                image: 'https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=1080&q=80',
                alt: 'Industry blueprints'
              }
            ].map((service, index) => (
              <article key={index} className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-[10px] p-5 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <img
                    src={service.image}
                    alt={service.alt}
                    loading="lazy"
                    className="bg-white/70 w-28 h-20 object-cover border-slate-200 border rounded-lg pt-1 pr-1 pb-1 pl-1"
                  />
                  <div>
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
            Sectors we serve
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
                  'Quality management automation'
                ],
                image: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80',
                alt: 'Factory floor'
              },
              {
                icon: ShoppingCart,
                title: 'Retail',
                description: 'Unify channels and inventory while improving forecast accuracy and margin.',
                features: [
                  'Omni‑channel stock and fulfillment',
                  'Demand sensing and promotions',
                  'Loyalty and customer insights'
                ],
                image: 'https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=1080&q=80',
                alt: 'Retail analytics'
              },
              {
                icon: Banknote,
                title: 'Finance',
                description: 'Shorten time‑to‑close, increase transparency, and ensure regulatory compliance.',
                features: [
                  'Blackline‑style reconciliations',
                  'Profitability and cost analytics',
                  'IFRS and local GAAP reporting'
                ],
                image: 'https://images.unsplash.com/photo-1635151227785-429f420c6b9d?w=1080&q=80',
                alt: 'Finance dashboards'
              },
              {
                icon: HeartPulse,
                title: 'Healthcare',
                description: 'Protect patient data and streamline clinical supply while meeting regulations.',
                features: [
                  'Patient data governance and interoperability',
                  'Procurement and device tracking',
                  'Costing and reimbursement management'
                ],
                image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1600&q=80',
                alt: 'Healthcare system interface'
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
          <div className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-slate-700/80">
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
    </div>
  );
};

export default Home;
