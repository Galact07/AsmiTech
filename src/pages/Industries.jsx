import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ShoppingCart, Flame, Pill, FlaskConical, Landmark, Truck, CheckCircle } from 'lucide-react';
import Carousel from '../components/ui/carousel';

const Industries = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-10 max-w-7xl mr-auto ml-auto pt-6 pr-5 pl-5" aria-labelledby="industries-title">
        <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
          <div className="sm:p-8 md:p-12 pt-6 pr-6 pb-6 pl-6">
            <div className="flex items-start md:items-center gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em]">
                  Industry Solutions
                </p>
                <h1 id="industries-title" className="sm:text-4xl md:text-5xl text-3xl font-bold text-slate-700 tracking-tight mt-2">
                  SAP Solutions That Fit Your Industry Needs
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  We understand the unique challenges and opportunities in each industry. Our solutions are designed to address specific sector requirements while delivering measurable business value.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3 focus:outline-none"
                  >
                    Discuss Your Industry Needs
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-none px-5 py-3 text-sm font-bold text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition"
                  >
                    View All Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* Industry Illustration */}
              <div className="w-full md:w-[440px] shrink-0 space-y-3">
                <img
                  src="https://images.pexels.com/photos/7433827/pexels-photo-7433827.jpeg?_gl=1*1xxunhd*_ga*MTU5Njc0NzgwOS4xNzU5ODE5NDIw*_ga_8JE65Q40S6*czE3NjEwNTc3MDYkbzMkZzEkdDE3NjEwNTkwMzIkajMxJGwwJGgw"
                  alt="Industry solutions overview"
                  loading="lazy"
                  className="w-full rounded-none pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="industries">
        <div className="bg-dark-blue p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 className="md:text-2xl text-xl font-bold text-white tracking-tight" id="industries">
            Industries We Serve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 gap-x-6 gap-y-6">
            {[
              {
                icon: ShoppingCart,
                title: 'Retail & Consumer Goods',
                description: 'Integrate sales, inventory, and customer insights to make smarter decisions and deliver a seamless shopping experience across all channels.',
                features: [
                  'Cut inventory waste and stockouts with smarter SAP planning.',
                  'Accelerate supply chain processes to get products to customers faster.',
                  'Use real-time data to improve sales decisions and customer satisfaction.'
                ],
                image: 'https://i.pinimg.com/736x/ec/be/ba/ecbeba29212ecb314faf2760a9b200a3.jpg',
                alt: 'Retail & Consumer Goods'
              },
              {
                icon: Flame,
                title: 'Oil, Gas & Energy',
                description: 'Connect operations, maintenance, and compliance systems to improve efficiency, reduce downtime, and maintain the highest safety standards.',
                features: [
                  'Keep critical equipment running longer with predictive maintenance.',
                  'Stay fully compliant with safety and environmental regulations.',
                  'Turn operational data into cost-saving, actionable insights.'
                ],
                image: 'https://i.pinimg.com/736x/56/c4/ec/56c4ec50629e9b8c7082b86bd1fe5332.jpg',
                alt: 'Oil, Gas & Energy'
              },
              {
                icon: Pill,
                title: 'Pharmaceuticals & Life Sciences',
                description: 'Link research, production, and regulatory processes to ensure product quality, accelerate delivery, and stay fully compliant.',
                features: [
                  'Speed up manufacturing without compromising quality or compliance.',
                  'Track every batch to ensure regulatory standards are met.',
                  'Coordinate distribution to meet demand efficiently and reliably.'
                ],
                image: 'https://i.pinimg.com/1200x/b7/56/19/b7561971cb6257a1e6b99b1c1fdf795d.jpg',
                alt: 'Pharmaceuticals & Life Sciences'
              },
              {
                icon: FlaskConical,
                title: 'Chemicals & Petrochemicals',
                description: 'Coordinate production, safety, and supply chain operations to boost efficiency, minimize risks, and respond quickly to market demands.',
                features: [
                  'Optimize production to reduce waste and energy usage.',
                  'Simplify compliance reporting with automated SAP processes.',
                  'Respond quickly to supply chain disruptions or market changes.'
                ],
                image: 'https://images.unsplash.com/photo-1757912666361-8c226b7279b9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870',
                alt: 'Chemicals & Petrochemicals'
              },
              {
                icon: Landmark,
                title: 'Public Sector & Government',
                description: 'Streamline financial, operational, and citizen services to improve transparency, accountability, and service delivery across departments.',
                features: [
                  'Automate budgeting and fund management for clarity and control.',
                  'Increase transparency across departments and operations.',
                  'Deliver citizen services more efficiently using real-time insights.'
                ],
                image: 'https://images.pexels.com/photos/20432166/pexels-photo-20432166.jpeg?_gl=1*ydoi7k*_ga*MTU5Njc0NzgwOS4xNzU5ODE5NDIw*_ga_8JE65Q40S6*czE3NjEwNTc3MDYkbzMkZzEkdDE3NjEwNTgyNzEkajQzJGwwJGgw',
                alt: 'Public Sector & Government'
              },
              {
                icon: Truck,
                title: 'Logistics & Supply Chain',
                description: 'Unify procurement, warehousing, and distribution with real-time insights to ensure faster, more reliable, and cost-effective operations.',
                features: [
                  'Streamline warehousing, shipping, and inventory tracking.',
                  'Get full visibility across suppliers and deliveries.',
                  'Resolve bottlenecks quickly to maintain smooth operations.'
                ],
                image: 'https://i.pinimg.com/736x/94/b0/ed/94b0ed2a49f4452f0b4930f7c9ef09c1.jpg',
                alt: 'Logistics & Supply Chain'
              }
            ].map((industry, index) => (
              <article key={index} className="bg-blue-50 p-6 hover:shadow-md transition rounded-none">
                <div className="flex text-sm text-slate-700/80 gap-x-2 gap-y-2 items-center mb-4">
                  <industry.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl tracking-tight font-bold text-slate-700 mb-3">
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
                  className="w-full rounded-none"
                />
              </article>
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
                Ready to transform your industry with SAP?
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl">
                Let's discuss how our industry expertise can help you achieve your business goals and stay ahead of the competition.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
                >
                  Start Your Industry Transformation
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white transition px-6 py-3 rounded-none font-bold"
                >
                  Explore Our Services
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

export default Industries;
