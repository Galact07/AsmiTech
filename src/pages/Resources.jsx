import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Download, ExternalLink, Calendar, User } from 'lucide-react';

const Resources = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-4 max-w-7xl mr-auto ml-auto pt-3 pr-5 pl-5" aria-labelledby="resources-title">
        <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
          <div className="pt-0 pr-6 pb-6 pl-6 md:pr-12 md:pb-12 md:pl-12">
            <div className="flex items-start gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em] mt-0 pt-2">
                  Resources & Insights
                </p>
                <h1 id="resources-title" className="sm:text-5xl md:text-6xl text-4xl font-bold text-slate-700 tracking-tight mt-2">
                  Knowledge hub for SAP excellence.
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  Access our library of whitepapers, case studies, webinars, and best practices to accelerate your SAP journey and stay ahead of industry trends.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3 focus:outline-none"
                  >
                    Subscribe to Updates
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-none px-5 py-3 text-sm font-bold text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition"
                  >
                    Our Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* Resources Illustration */}
              <div className="w-full md:w-[440px] shrink-0 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=60&auto=format&fit=crop"
                  alt="Knowledge and resources"
                  loading="lazy"
                  className="backdrop-blur-[10px] bg-white/70 w-full border-slate-200 border rounded-none pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="featured">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="featured" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">
            Featured Resources
          </h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'S/4HANA Migration Guide for Mid-Market',
                description: 'A comprehensive guide to planning and executing your S/4HANA migration with minimal business disruption.',
                type: 'Whitepaper',
                image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80&auto=format&fit=crop',
                alt: 'S/4HANA migration process'
              },
              {
                title: 'Manufacturing Excellence with SAP',
                description: 'How leading manufacturers are using SAP to optimize production, reduce costs, and improve quality.',
                type: 'Case Study',
                image: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=400&q=80&auto=format&fit=crop',
                alt: 'Manufacturing optimization'
              },
              {
                title: 'Digital Transformation in Retail',
                description: 'Best practices for implementing omni-channel retail solutions with SAP Commerce and ERP integration.',
                type: 'Webinar',
                image: 'https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=400&q=80&auto=format&fit=crop',
                alt: 'Retail digital transformation'
              },
              {
                title: 'SAP Security Best Practices',
                description: 'Essential security measures to protect your SAP landscape and ensure compliance with industry standards.',
                type: 'Guide',
                image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80&auto=format&fit=crop',
                alt: 'SAP security dashboard'
              },
              {
                title: 'Cloud Migration Strategies',
                description: 'Planning and executing your move to SAP Cloud with minimal risk and maximum business value.',
                type: 'Whitepaper',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80&auto=format&fit=crop',
                alt: 'Cloud migration planning'
              },
              {
                title: 'SAP Analytics for Business Intelligence',
                description: 'Leveraging SAP Analytics Cloud to transform data into actionable business insights.',
                type: 'Case Study',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&auto=format&fit=crop',
                alt: 'Business intelligence dashboard'
              }
            ].map((resource, index) => (
              <article key={index} className="rounded-none border border-slate-200 bg-white p-5 hover:shadow-md transition">
                <img
                  src={resource.image}
                  alt={resource.alt}
                  className="w-full h-32 object-cover rounded-none mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-none">
                    {resource.type}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">{resource.title}</h3>
                <p className="text-slate-700/80 text-sm mb-4">{resource.description}</p>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 text-sm font-medium">
                    <ExternalLink className="h-4 w-4" />
                    View Online
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Webinars Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="webinars">
        <div className="bg-dark-blue p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="webinars" className="text-3xl md:text-4xl tracking-tight font-bold text-white">
            Upcoming Webinars
          </h2>
          <p className="mt-2 text-white/80">
            Join our experts for live sessions on the latest SAP trends, best practices, and industry insights.
          </p>
          <div className="mt-6 space-y-4">
            {[
              {
                title: 'S/4HANA 2024: What\'s New for Mid-Market',
                date: 'March 15, 2024',
                time: '2:00 PM CET',
                speaker: 'Sarah van der Berg',
                description: 'Discover the latest S/4HANA features and how they can benefit your mid-market business.',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80&auto=format&fit=crop'
              },
              {
                title: 'AI and Machine Learning in SAP',
                date: 'March 22, 2024',
                time: '2:00 PM CET',
                speaker: 'Michael Chen',
                description: 'Explore how AI and ML capabilities in SAP can transform your business processes.',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop'
              },
              {
                title: 'Manufacturing 4.0 with SAP',
                date: 'March 29, 2024',
                time: '2:00 PM CET',
                speaker: 'Elena Rodriguez',
                description: 'Learn how to implement Industry 4.0 solutions using SAP\'s manufacturing suite.',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop'
              }
            ].map((webinar, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-none border border-slate-200 bg-white hover:shadow-md transition">
                <img
                  src={webinar.image}
                  alt={`${webinar.speaker} headshot`}
                  className="w-16 h-16 rounded-none object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-700 mb-1">{webinar.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {webinar.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {webinar.speaker}
                    </div>
                  </div>
                  <p className="text-slate-700/80 text-sm mb-3">{webinar.description}</p>
                  <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium">
                    Register Now
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="newsletter">
        <div className="rounded-none bg-primary text-white p-8 md:p-12 text-center">
          <h2 id="newsletter" className="text-2xl md:text-3xl font-light tracking-tight">
            Stay Updated with SAP Insights
          </h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Get the latest SAP news, best practices, and industry insights delivered to your inbox monthly.
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-none text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button className="px-6 py-3 bg-white text-primary rounded-none font-medium hover:bg-slate-50 transition">
                Subscribe
              </button>
            </div>
            <p className="mt-3 text-white/60 text-sm">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
