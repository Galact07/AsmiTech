import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import asmiLogo from '../assets/logos/asmi logo.png';
import { supabase } from '@/integrations/supabase/client';
import { SimpleLanguageSwitcher } from './SimpleLanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const { t } = useTranslation();
  const { language, tDb } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [dropdownTimer, setDropdownTimer] = useState(null);
  const [services, setServices] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Fallback services if database table doesn't exist yet
    const fallbackServices = [
      { name: 'SAP Public Cloud', href: '/services/sap-public-cloud', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop' },
      { name: 'SAP Implementations and Rollouts', href: '/services/sap-implementations-and-rollouts', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop' },
      { name: 'SAP Document and Reporting Compliance', href: '/services/sap-document-and-reporting-compliance', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop' },
      { name: 'SAP Consulting & Advisory', href: '/services/sap-consulting-advisory', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop' },
      { name: 'Data & Migration Services', href: '/services/data-migration-services', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop' },
      { name: 'Support & Managed Services', href: '/services/support-managed-services', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop' },
      { name: 'Training & Change Management', href: '/services/training-change-management', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop' },
      { name: 'SAP Project Management & Governance', href: '/services/sap-project-management-governance', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop' },
    ];

    // Fetch dynamic services from database
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('service_pages')
          .select('slug, title, hero_image_url, content_nl')
          .eq('status', 'published')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          setServices(data.map(service => ({
            name: service.title,
            name_nl: service.content_nl?.hero_headline || service.content_nl?.title || service.title,
            href: `/services/${service.slug}`,
            image: service.hero_image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop'
          })));
        } else {
          // Use fallback if table doesn't exist or is empty
          setServices(fallbackServices);
        }
      } catch (err) {
        console.warn('Service pages table not found. Using hardcoded services.', err);
        setServices(fallbackServices);
      }
    };

    fetchServices();

    // Set up realtime subscription
    const channel = supabase
      .channel('service-pages-header')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_pages' }, fetchServices)
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  const handleDropdownEnter = () => {
    if (dropdownTimer) clearTimeout(dropdownTimer);
    setShowServicesDropdown(true);
  };

  const handleDropdownLeave = () => {
    const timer = setTimeout(() => setShowServicesDropdown(false), 200);
    setDropdownTimer(timer);
  };

  const navigation = [
    { name: t('header.nav.home'), href: '/' },
    { name: t('header.nav.about'), href: '/about' },
    { name: t('header.nav.services'), href: '/services', hasDropdown: true },
    { name: t('header.nav.industries'), href: '/industries' },
    { name: t('header.nav.careers'), href: '/careers' },
    { name: t('header.nav.contact'), href: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-blue-100 transition-colors shadow-lg">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-2">
        <div className="flex gap-4 items-center">
          {/* Brand */}
          <Link to="/" className="inline-flex items-center gap-3" aria-label="Asmi Home">
            <div className="flex items-center justify-center h-12 w-32 rounded-none bg-transparent px-2">
              <img 
                src={asmiLogo}
                alt="ASMI Technology Consulting logo"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-auto" aria-label="Main navigation">
            {navigation.map((item) => (
              item.hasDropdown ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to={item.href}
                    className={`px-3 py-2 text-base font-normal transition-all duration-200 border-b-[3px] flex items-center gap-1 ${
                      isActive(item.href) || (location.pathname.startsWith('/services/'))
                        ? 'text-primary border-primary'
                        : 'text-slate-600 border-transparent hover:text-primary hover:border-primary'
                    }`}
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                  </Link>
                  {showServicesDropdown && (
                    <div 
                      className="absolute top-full left-0 mt-2 w-[600px] max-w-[calc(100vw-2rem)] bg-slate-100 backdrop-blur-[10px] shadow-2xl rounded-none border border-slate-200 overflow-hidden"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                      style={{ marginTop: '0.5rem' }}
                    >
                      {/* Services Grid */}
                      <div className="p-4 grid grid-cols-2 gap-2">
                        {services.map((service, index) => {
                          return (
                            <Link
                              key={index}
                              to={service.href}
                              className="group relative px-4 py-3.5 rounded-none bg-slate-50 hover:bg-primary hover:shadow-md transition-all duration-200 border border-slate-200 hover:border-primary flex items-start gap-3"
                              onClick={() => setShowServicesDropdown(false)}
                            >
                              <div className="flex-shrink-0 w-12 h-12 rounded-none overflow-hidden">
                                <img 
                                  src={service.image} 
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-sm font-medium text-slate-700 group-hover:text-white leading-snug">
                                {service.name_nl ? tDb(service.name, service.name_nl) : service.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                      
                      {/* Footer */}
                      <div className="border-t border-slate-200 bg-slate-50 px-6 py-3">
                        <Link 
                          to="/services" 
                          className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                          onClick={() => setShowServicesDropdown(false)}
                        >
                          {t('header.viewAllServices')}
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-base font-normal transition-all duration-200 border-b-[3px] ${
                    isActive(item.href)
                      ? 'text-primary border-primary'
                      : 'text-slate-600 border-transparent hover:text-primary hover:border-primary'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* Language Switcher - Desktop */}
          <div className="hidden md:flex items-center ml-4">
            <SimpleLanguageSwitcher />
          </div>

          {/* CTA */}
          <a
            href="tel:+31622098973"
            className="hidden items-center gap-3 transition-all focus:outline-none sm:inline-flex bg-blue-100 hover:bg-primary active:bg-primary font-bold rounded-none ml-4 px-4 py-2 group"
          >
            <Phone className="h-5 w-5 text-primary group-hover:text-white group-active:text-white transition-colors" />
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900 group-hover:text-white group-active:text-white transition-colors">{t('header.getInTouch')}</span>
              <span className="text-sm font-bold text-primary group-hover:text-white group-active:text-white transition-colors">+31-622098973</span>
            </div>
          </a>

          {/* Language Switcher - Mobile */}
          <div className="md:hidden ml-auto mr-2">
            <SimpleLanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-controls="mobileMenu"
            aria-expanded={isMobileMenuOpen}
            aria-label="Open menu"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-none border border-primary/20 text-primary hover:text-primary transition-all duration-200 font-bold"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-primary/20 bg-blue-100">
          {/* Mobile Get in Touch */}
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-3 border-b border-slate-200">
            <a
              href="tel:+31622098973"
              className="flex items-center gap-3 hover:bg-slate-50 transition-all px-3 py-2"
            >
              <Phone className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">{t('header.getInTouch')}</span>
                <span className="text-sm font-bold text-primary">+31-622098973</span>
              </div>
            </a>
          </div>
          
          <nav className="max-w-7xl mx-auto px-5 md:px-8 py-3 grid grid-cols-1 gap-1" aria-label="Mobile navigation">
            {navigation.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.name} className="border-b border-slate-200 pb-1">
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-3 py-2 text-base font-normal transition-all duration-200 flex-1 inline-block ${
                          isActive(item.href) || location.pathname.startsWith('/services/')
                            ? 'text-primary'
                            : 'text-slate-600'
                        }`}
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                        className="px-3 py-2 text-base font-normal transition-all duration-200"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${showServicesDropdown ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {showServicesDropdown && (
                      <div className="mt-2 space-y-2 pl-4 max-h-64 overflow-y-auto">
                        {services.map((service, index) => (
                          <Link
                            key={index}
                            to={service.href}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setShowServicesDropdown(false);
                            }}
                          className="block px-3 py-2 text-base text-slate-600 hover:text-primary hover:bg-slate-50 rounded-none break-words"
                        >
                          {service.name_nl ? tDb(service.name, service.name_nl) : service.name}
                        </Link>
                        ))}
                        <Link
                          to="/services"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setShowServicesDropdown(false);
                          }}
                          className="block px-3 py-2 text-sm font-bold text-primary hover:bg-slate-50 rounded-none"
                        >
                          {t('header.viewAllServices')} →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 text-base font-normal inline-block ${
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-slate-600'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
