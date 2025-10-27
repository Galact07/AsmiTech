import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Linkedin } from 'lucide-react';
import Carousel from '../components/ui/carousel';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-16 max-w-7xl mr-auto ml-auto pt-10 pr-5 pl-5" aria-labelledby="about-title">
        <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
          <div className="sm:p-8 md:p-12 pt-6 pr-6 pb-6 pl-6">
            <div className="flex items-start md:items-center gap-6 md:gap-10 flex-col md:flex-row">
              <div className="flex-1">
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em]">
                About ASMI Technology Consulting B.V.
                </p>
                <h1 id="about-title" className="sm:text-5xl md:text-6xl text-4xl font-bold text-slate-700 tracking-tight mt-2">
                Your Trusted SAP Transformation Partner.
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg">
                Discover how ASMI makes SAP transformations simple and effective. We deliver end-to-end solutions that streamline processes, connect systems seamlessly, and generate measurable business results.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3 focus:outline-none"
                  >
                    Get in Touch
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
              {/* Team Image */}
              <div className="w-full md:w-[440px] shrink-0 space-y-3">
                <img
                  src="https://i.pinimg.com/1200x/b1/4c/c1/b14cc161cce4383a47cfaebca0af04cb.jpg"
                  alt="Asmi team collaboration"
                  loading="lazy"
                  className="w-full rounded-none pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="our-story">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
            <h2 id="our-story" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">
            Our Story
          </h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-700/80">
                At ASMI, we help businesses get the most out of SAP. Based in Utrecht, Netherlands, our team combines technical expertise with hands-on experience to simplify complex processes and deliver solutions that truly make a difference. From implementation and integration to process optimization, data migration, training, and ongoing support, we focus on solutions that align technology with your business goals and make daily workflows smoother.
              </p>
              <p className="mt-4 text-slate-700/80">
                What makes us different is our practical, collaborative approach. We value problem-solving, innovation, and doing things right, not just fast. Trusted by organizations like Hitachi, Cargill, and Deloitte, we work closely with our clients to optimize operations and support growth that lasts.
              </p>
            </div>
            <div>
              <img
                src="https://i.pinimg.com/1200x/db/e6/14/dbe61467598a34dc1b363374526dcad8.jpg"
                alt="ASMI team collaboration and SAP consulting"
                loading="lazy"
                className="w-full h-80 object-cover rounded-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="team">
        <div className="bg-dark-blue p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left side - Title and Description */}
            <div className="lg:col-span-1">
              <h2 id="team" className="text-3xl md:text-4xl tracking-tight font-bold text-white">
                Meet Our Team
              </h2>
              <p className="mt-4 text-white/80">
                Our diverse team brings together deep SAP expertise, industry knowledge, and a passion for delivering exceptional results.
              </p>
            </div>
            
            {/* Right side - Team Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
              {[
                {
                  name: 'Basavaraj K M',
                  role: 'Managing Director',
                  bio: 'With 20+ years in SAP consulting, he specializes in S/4HANA Finance, Central Finance, and Group Reporting. He has led multiple global implementations and migrations with proven results. A certified S/4HANA expert, he focuses on delivering practical, high-impact digital transformation solutions.',
                  image: '/logos/Basavaraj.jpg',
                  initials: 'BK',
                  linkedin: 'https://www.linkedin.com/in/basavaraj-km-192b9813/'
                },
                {
                  name: 'Asha M',
                  role: 'Managing Partner',
                  bio: 'As Managing Partner, she leads the firm\'s strategy and operations. She focuses on delivering measurable results and building strong client relationships. Her leadership combines vision, accountability, and a commitment to excellence.',
                  image: '/logos/Asha.jpg',
                  initials: 'AM',
                  linkedin: 'https://www.linkedin.com/in/asha-mathada-42a522370/'
                }
              ].map((member, index) => (
                <div key={index} className="bg-white p-6 text-center rounded-none">
                  <div className="relative inline-block mb-4">
                    <img
                      src={member.image}
                      alt={`${member.name} headshot`}
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center mx-auto text-lg font-semibold"
                      style={{ display: 'none' }}
                    >
                      {member.initials}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 bg-primary rounded-full hover:bg-primary/80 transition mb-4"
                  >
                    <Linkedin className="h-4 w-4 text-white" />
                  </a>
                  <p className="text-slate-700/80 text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="md:px-8 md:pt-8 max-w-7xl mr-auto ml-auto pt-6 pr-5 pl-5" aria-labelledby="mission-title">
        <div className="bg-blue-100 p-4 md:p-6 transition duration-500 ease-in rounded-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="order-2 md:order-1">
              <h2 id="mission-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">Our Mission</h2>
              <p className="mt-3 text-sm text-slate-700/90">
                At ASMI, we create SAP solutions that make a real difference. We simplify complex processes, unlock new opportunities, and deliver results you can measure. Our goal is to help businesses work smarter, innovate faster, and achieve more with every solution we implement.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80&auto=format&fit=crop"
                alt="Our Mission - SAP Solutions"
                loading="lazy"
                className="aspect-square w-full object-cover rounded-none max-h-64"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="md:px-8 md:pt-8 max-w-7xl mr-auto ml-auto pt-6 pr-5 pl-5" aria-labelledby="vision-title">
        <div className="bg-slate-100 p-4 md:p-6 transition duration-500 ease-in rounded-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&auto=format&fit=crop"
                alt="Our Vision - Future of SAP"
                loading="lazy"
                className="aspect-square w-full object-cover rounded-none max-h-64"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 id="vision-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">Our Vision</h2>
              <p className="mt-3 text-sm text-slate-700/90">
                We envision a future where every business can harness the full power of SAP to drive innovation, efficiency, and sustainable growth. Our goal is to be the leading SAP consulting partner globally, recognized for transforming how organizations operate through technology excellence.
              </p>
              <p className="mt-4 text-sm text-slate-700/90">
                We strive to be the catalyst that empowers businesses to unlock their full potential through intelligent SAP solutions, creating lasting competitive advantages and measurable value for our clients worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="core-values">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="core-values" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">
            Our Core Values
          </h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Integrity',
                description: 'We uphold transparency and ethical practices in all our projects, building lasting relationships based on trust.',
                image: 'https://i.pinimg.com/736x/0e/81/16/0e81165b627a9b29bc38498d8313527a.jpg',
                alt: 'Handshake representing integrity and trust'
              },
              {
                title: 'Innovation',
                description: 'We challenge the status quo with curiosity and new ideas, continuously improving our solutions to meet evolving business needs.',
                image: 'https://i.pinimg.com/1200x/4d/1a/60/4d1a60bb13a96a176b8b703d2ebeac1d.jpg',
                alt: 'Innovation and technology advancement'
              },
              {
                title: 'Collaboration',
                description: 'We work closely with our clients and partners, fostering a culture of teamwork to achieve shared success.',
                image: 'https://i.pinimg.com/1200x/db/6d/fc/db6dfc1494fdd8cbae6d8a09feea549f.jpg',
                alt: 'Team collaboration and partnership'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 text-center">
                <img
                  src={value.image}
                  alt={value.alt}
                  loading="lazy"
                  className="w-full h-48 object-cover rounded-none mb-4"
                />
                <h3 className="text-lg font-medium text-slate-700 mb-3">{value.title}</h3>
                <p className="text-slate-700/80 text-sm leading-relaxed">{value.description}</p>
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
            <Carousel speed="slow" className="py-4">
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
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="cta-title">
        <div className="rounded-none bg-blue-100 text-slate-700 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop"
                alt="SAP results"
                loading="lazy"
                className="w-full h-64 object-cover rounded-none"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 id="cta-title" className="text-3xl md:text-4xl font-bold tracking-tight">
                Drive better SAP results with ASMI.
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl">
                Request your consultation today.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
                >
                  Get In Touch
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white transition px-6 py-3 rounded-none font-bold"
                >
                  Our Services
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

export default About;
