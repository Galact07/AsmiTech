import { Link } from 'react-router-dom';
import { ArrowUpRight, Database, CheckCircle } from 'lucide-react';

const DataMigrationServices = () => {
  return (
    <div className="min-h-screen">
      <section className="md:px-8 md:pt-5 max-w-7xl mr-auto ml-auto pt-4 pr-5 pl-5" aria-labelledby="service-title">
        <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
          <div className="pt-0 pr-6 pb-6 pl-6 md:pr-12 md:pb-12 md:pl-12">
            <div className="flex items-start gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em] mt-0 pt-2">
                  Our Services
                </p>
                <h1 id="service-title" className="sm:text-4xl md:text-5xl text-3xl font-bold text-slate-700 tracking-tight mt-2">
                  Data & Migration Services
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  Ensure smooth, secure data migration for optimized SAP performance.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3 focus:outline-none"
                  >
                    Get Started
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-[440px] shrink-0 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop"
                  alt="Data & Migration Services"
                  loading="lazy"
                  className="w-full rounded-none pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>
      </section>

      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="service-details">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-primary/10 w-16 h-16 rounded-none flex items-center justify-center mb-6">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h2 id="service-details" className="text-4xl font-bold text-slate-700 mb-4">What We Offer</h2>
              <p className="text-slate-700/80 mb-4">
                Our Data & Migration Services ensure that your data transitions smoothly to SAP, with minimal disruption 
                and maximum data integrity. We handle complex migrations with precision and care.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-700 mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700/80">Data cleansing, validation, and mapping for accuracy</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700/80">Minimized downtime during migration with phased approaches</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700/80">Integration with legacy systems and new SAP modules</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700/80">Comprehensive testing and validation before go-live</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700/80">Data quality assurance and reconciliation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="cta">
        <div className="rounded-none bg-blue-100 text-slate-700 p-8 md:p-12">
          <div className="flex justify-center">
            <div className="text-center max-w-2xl">
              <h2 id="cta" className="text-3xl md:text-4xl font-bold tracking-tight">
                Planning a data migration?
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl">
                Let's ensure your data migrates smoothly and securely to SAP.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
                >
                  Contact Us Today
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

export default DataMigrationServices;

