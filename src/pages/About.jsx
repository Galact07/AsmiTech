import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Linkedin } from 'lucide-react';
import Carousel from '../components/ui/carousel';
import { useTranslation } from '@/hooks/useTranslation';

const About = () => {
  const { t, tArray } = useTranslation();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="md:px-8 md:pt-20 max-w-7xl mr-auto ml-auto pt-14 pr-5 pl-5" aria-labelledby="about-title">
        <div className="bg-white/70 backdrop-blur-[10px] shadow-[0_30px_80px_-40px_rgba(2,6,23,0.15)] transition duration-500 ease-in">
          <div className="pt-0 pr-6 pb-6 pl-6 md:pr-12 md:pb-12 md:pl-12">
            <div className="flex items-stretch gap-6 md:gap-10 flex-col md:flex-row min-h-[240px] md:min-h-[280px]">
              <div className="flex-1 w-full">
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-[0.18em] mt-0 pt-2">
                {t('about.hero.tagline')}
                </p>
                <h1 id="about-title" className="sm:text-4xl md:text-5xl text-3xl font-bold text-slate-700 tracking-tight mt-2">
                {t('about.hero.title')}
                </h1>
                <p className="mt-4 max-w-2xl text-slate-700/80 sm:text-lg break-words">
                {t('about.hero.description')}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center justify-center gap-2 hover:brightness-110 transition text-sm font-bold text-slate-50 bg-primary border-slate-200 border rounded-none px-5 py-3 focus:outline-none flex-shrink-0"
                  >
                    {t('buttons.contactUs')}
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-black/5">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <a
                    href="#our-story"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById('our-story');
                      if (element) {
                        const headerOffset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-none px-5 py-3 text-sm font-bold text-primary bg-white border border-secondary hover:bg-slate-50 hover:border-primary transition flex-shrink-0 cursor-pointer"
                  >
                    {t('buttons.ourStory')}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
              {/* Team Image */}
              <div className="w-full md:w-[280px] shrink-0 space-y-3">
                <img
                  src="https://i.pinimg.com/1200x/b1/4c/c1/b14cc161cce4383a47cfaebca0af04cb.jpg"
                  alt="Asmi team collaboration"
                  loading="lazy"
                  className="w-full rounded-none pt-2 pr-2 pb-2 pl-2"
                />
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="our-story">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-start">
            <div className="max-w-2xl">
              <h2 id="our-story" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700 mb-5">
                {t('about.story.title')}
              </h2>
              <p className="text-slate-700/80">
                {t('about.story.paragraph1')}
              </p>
              <p className="mt-4 text-slate-700/80">
                {t('about.story.paragraph2')}
              </p>
            </div>
            <div className="flex items-start justify-end md:ml-auto">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop&auto=format"
                alt="Business partnership and collaborative growth representing ASMI's story"
                loading="lazy"
                className="object-cover rounded-none w-full aspect-[4/3]"
                style={{ maxWidth: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="md:px-8 md:pt-8 max-w-7xl mr-auto ml-auto pt-6 pr-5 pl-5" aria-labelledby="vision-title">
        <div className="bg-blue-100 p-4 md:p-6 transition duration-500 ease-in rounded-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="order-2 md:order-1 h-full flex items-start">
              <img
                src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=1200&h=800&fit=crop&auto=format"
                alt="Future vision and innovative growth representing ASMI's vision"
                loading="lazy"
                className="object-cover rounded-none max-w-md w-full h-full"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 id="vision-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700 mb-3">{t('about.vision.title')}</h2>
              <p className="text-slate-700/80">
                {t('about.vision.paragraph1')}
              </p>
              <p className="mt-4 text-slate-700/80">
                {t('about.vision.paragraph2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="md:px-8 md:pt-8 max-w-7xl mr-auto ml-auto pt-6 pr-5 pl-5" aria-labelledby="mission-title">
        <div className="bg-slate-100 p-4 md:p-6 transition duration-500 ease-in rounded-none">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 items-start">
            <div className="order-2 md:order-1 max-w-2xl">
              <h2 id="mission-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700 mb-3">{t('about.mission.title')}</h2>
              <p className="text-slate-700/80">
                {t('about.mission.paragraph1')}
              </p>
              <p className="mt-4 text-slate-700/80">
                {t('about.mission.paragraph2')}
              </p>
            </div>
            <div className="order-1 md:order-2 h-full flex items-start justify-end md:ml-auto">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80&auto=format&fit=crop"
                alt="Our Mission - SAP Solutions"
                loading="lazy"
                className="object-cover rounded-none max-w-md w-full h-full"
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
                {t('about.team.title')}
              </h2>
              <p className="mt-4 text-white/80">
                {t('about.team.description')}
              </p>
            </div>
            
            {/* Right side - Team Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
              {[
                {
                  name: t('about.team.members.basavaraj.name'),
                  role: t('about.team.members.basavaraj.role'),
                  bio: t('about.team.members.basavaraj.bio'),
                  image: '/logos/Basavaraj.png',
                  initials: 'BK',
                  linkedin: 'https://www.linkedin.com/in/basavaraj-km-192b9813/'
                },
                {
                  name: t('about.team.members.asha.name'),
                  role: t('about.team.members.asha.role'),
                  bio: t('about.team.members.asha.bio'),
                  image: '/logos/Asha.png',
                  initials: 'AM',
                  linkedin: 'https://www.linkedin.com/in/asha-mathada-42a522370/'
                }
              ].map((member, index) => (
                <div key={index} className="bg-slate-100 p-6 text-center rounded-none">
                  <div className="relative inline-block mb-4">
                    <img
                      src={member.image}
                      alt={`${member.name} headshot`}
                      className="w-36 h-36 rounded-full object-cover mx-auto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="w-36 h-36 rounded-full bg-primary text-white flex items-center justify-center mx-auto text-xl font-semibold"
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

      {/* What Clients Say Section */}
      <section className="md:px-8 md:pt-12 max-w-7xl mr-auto ml-auto pt-8 pr-5 pl-5" aria-labelledby="testimonials-title">
        <div className="bg-slate-100 p-6 md:p-8 transition duration-500 ease-in rounded-none">
          <h2 id="testimonials-title" className="text-3xl md:text-4xl tracking-tight font-bold text-slate-700">{t('home.testimonials.title')}</h2>
          <div className="mt-5">
            <Carousel speed="very-slow" className="py-4">
              {[
                { quote: tArray('home.testimonials.list')[0], logoFile: 'cargill logo.jpg' },
                { quote: tArray('home.testimonials.list')[1], logoFile: 'hitachi logo.png' },
                { quote: tArray('home.testimonials.list')[2], logoFile: 'sucafina logo.svg' },
                { quote: tArray('home.testimonials.list')[3], logoFile: 'johnson and johnson logo.png' }
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
          <div className="flex justify-center">
            <div className="text-center max-w-2xl">
              <h2 id="cta-title" className="text-3xl md:text-4xl font-bold tracking-tight">
                {t('about.finalCTA.title')}
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl">
                {t('about.finalCTA.description')}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition px-6 py-3 rounded-none font-bold"
                >
                  {t('buttons.getInTouch')}
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

export default About;
