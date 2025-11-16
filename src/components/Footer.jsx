import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="border-t border-blue-300 bg-dark-blue mt-12" role="contentinfo" aria-label="Footer">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">
        {/* Company name as a full-width row */}
        <div className="mb-4">
          <span className="text-xl font-bold text-white">{t('footer.companyName')}</span>
        </div>
        {/* 4 columns with extra space after the first on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 items-start">
          {/* Netherlands Office */}
          <div className="flex flex-col lg:mr-10">
            <h3 className="text-sm font-bold text-white mb-4 tracking-wide">{t('footer.netherlands.title')}</h3>
            <address className="not-italic text-sm text-white/80 leading-relaxed break-words" style={{ whiteSpace: 'pre-line' }}>
              {t('footer.netherlands.address')}
            </address>
          </div>

          {/* India Office */}
          <div className="flex flex-col lg:ml-1"> 
            <h3 className="text-sm font-bold text-white mb-4 tracking-wide">{t('footer.india.title')}</h3>
            <address className="not-italic text-sm text-white/80 leading-relaxed break-words" style={{ whiteSpace: 'pre-line' }}>
              {t('footer.india.address')}
            </address>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col lg:ml-6">
            <h3 className="text-sm font-bold text-white mb-4 tracking-wide">{t('footer.quickLinks')}</h3>
            <div className="text-sm text-white/80 leading-relaxed space-y-1">
              <Link to="/" className="block hover:text-blue-400 transition">{t('header.nav.home')}</Link>
              <Link to="/about" className="block hover:text-blue-400 transition">{t('header.nav.about')}</Link>
              <Link to="/services" className="block hover:text-blue-400 transition">{t('header.nav.services')}</Link>
              <Link to="/industries" className="block hover:text-blue-400 transition">{t('header.nav.industries')}</Link>
              <Link to="/resources" className="sr-only focus:not-sr-only block hover:text-blue-400 transition">{t('header.nav.resources')}</Link>
              <Link to="/careers" className="block hover:text-blue-400 transition">{t('header.nav.careers')}</Link>
              <Link to="/contact" className="block hover:text-blue-400 transition">{t('header.nav.contact')}</Link>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-white mb-4 tracking-wide">{t('footer.contact')}</h3>
            <div className="text-sm text-white/80 leading-relaxed space-y-2">
              <a
                href="https://www.linkedin.com/company/asmi-technology-consulting-bv/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-blue-300 transition"
                aria-label="Visit our LinkedIn profile (opens in a new tab)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                {t('footer.linkedin')}
              </a>
              <a
                href="mailto:info@asmitechconsulting.com"
                className="flex items-start gap-3 hover:text-blue-300 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0 mt-0.5">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <span className="break-all">{t('footer.email')}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10 text-sm text-white/60 text-center">
          © 2025 {t('footer.companyName')} {t('footer.allRightsReserved')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
