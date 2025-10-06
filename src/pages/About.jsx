import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Shield, Award, Factory, ShoppingCart, Banknote, HeartPulse } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-16 max-w-7xl mr-auto ml-auto pt-10 pr-5 pl-5" aria-labelledby="about-title">
        <div className="rounded-3xl bg-white/70 backdrop-blur-[10px] border border-slate-200 shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] overflow-hidden transition duration-500 ease-in">
          <div className="sm:p-8 md:p-12 pt-6 pr-6 pb-6 pl-6">
            <div className="flex items-start md:items-center gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-light text-slate-500 tracking-[0.18em]">
                  About Asmi Technology Consulting BV
                </p>
                <h1 id="about-title" className="sm:text-5xl md:text-6xl text-4xl font-light text-slate-900 tracking-tight mt-2">
                  Your trusted SAP transformation partner.
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                  We are a boutique SAP consulting firm based in Utrecht, Netherlands, specializing in mid-market enterprise transformations. Our team combines deep SAP expertise with industry knowledge to deliver measurable business outcomes.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:shadow-[0_0_0_5px_rgba(212,160,23,0.25)] hover:brightness-105 transition text-sm font-medium text-slate-50 bg-primary border-slate-200 border rounded-full px-5 py-3"
                  >
                    Get in Touch
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition"
                  >
                    Our Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {/* Team Image */}
              <div className="w-full md:w-[440px] shrink-0 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=60&auto=format&fit=crop"
                  alt="Asmi team collaboration"
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

      {/* Our Story Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="our-story">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="our-story" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Our Story
          </h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-700/80">
                Founded in 2020, Asmi Technology Consulting BV emerged from a simple observation: mid-market enterprises were being underserved by traditional SAP consulting approaches. We saw an opportunity to bridge the gap between enterprise-scale solutions and the unique needs of growing businesses.
              </p>
              <p className="mt-4 text-slate-700/80">
                Our founders, with over 20 years of combined SAP experience, recognized that successful transformations require more than technical expertise—they demand deep understanding of business processes, industry challenges, and the human side of change management.
              </p>
            </div>
            <div>
              <p className="text-slate-700/80">
                Today, we're proud to be a trusted partner for mid-market leaders across manufacturing, retail, finance, and healthcare sectors. Our boutique approach allows us to provide personalized attention and flexible solutions that scale with our clients' growth.
              </p>
              <p className="mt-4 text-slate-700/80">
                Based in Utrecht, we serve clients across the Netherlands and beyond, bringing global SAP expertise with local market understanding and regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="values">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="values" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Our Values
          </h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Client-Centric',
                description: 'We prioritize our clients\' success above all else, ensuring every solution is tailored to their unique needs and constraints.',
                icon: '🎯'
              },
              {
                title: 'Excellence',
                description: 'We maintain the highest standards in everything we do, from technical implementation to project management and client communication.',
                icon: '⭐'
              },
              {
                title: 'Innovation',
                description: 'We stay at the forefront of SAP technology and best practices, bringing fresh perspectives to solve complex business challenges.',
                icon: '🚀'
              },
              {
                title: 'Integrity',
                description: 'We build trust through transparency, honest communication, and ethical business practices in all our interactions.',
                icon: '🤝'
              },
              {
                title: 'Collaboration',
                description: 'We work as an extension of our clients\' teams, fostering strong partnerships that drive mutual success.',
                icon: '🤝'
              },
              {
                title: 'Continuous Learning',
                description: 'We invest in our team\'s growth and stay current with evolving technologies to deliver cutting-edge solutions.',
                icon: '📚'
              }
            ].map((value, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-2xl mb-3">{value.icon}</div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-700/80 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="team">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="team" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Meet Our Team
          </h2>
          <p className="mt-2 text-slate-700/80">
            Our diverse team brings together deep SAP expertise, industry knowledge, and a passion for delivering exceptional results.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah van der Berg',
                role: 'Founder & Managing Director',
                bio: '20+ years SAP experience, former SAP SE consultant. Specializes in S/4HANA transformations and change management.',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80&auto=format&fit=crop'
              },
              {
                name: 'Michael Chen',
                role: 'Technical Director',
                bio: 'SAP certified architect with expertise in cloud migrations, integration, and DevOps. Former Accenture senior manager.',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop'
              },
              {
                name: 'Elena Rodriguez',
                role: 'Industry Solutions Lead',
                bio: 'Manufacturing and retail specialist with deep process knowledge. 15+ years implementing SAP in mid-market companies.',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop'
              }
            ].map((member, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-white p-5">
                <img
                  src={member.image}
                  alt={`${member.name} headshot`}
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
                <h3 className="text-lg font-medium text-slate-900">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                <p className="text-slate-700/80 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="certifications">
        <div className="rounded-2xl bg-white/60 backdrop-blur-[10px] border border-slate-200 p-6 md:p-8 transition duration-500 ease-in">
          <h2 id="certifications" className="text-xl md:text-2xl tracking-tight font-light text-slate-900">
            Certifications & Partnerships
          </h2>
          <p className="mt-2 text-slate-700/80">
            We maintain the highest standards of professional certification and strategic partnerships.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'SAP Partner',
              'ISO/IEC 27001',
              'GDPR Certified',
              'NEN 7510',
              'ISAE 3402',
              'EuroCloud',
              'DSAG Member',
              'SAP Certified'
            ].map((cert, index) => (
              <div key={index} className="flex items-center justify-center h-16 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition">
                <span className="text-slate-600 text-sm font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
