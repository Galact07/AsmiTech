import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const { t } = useTranslation();
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('company_info')
          .select('*')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          throw error;
        }

        if (data) {
          setCompanyInfo(data);
        }
      } catch (error) {
        console.error('Error fetching company info:', error);
        // Silently fail, will use fallback translations
      }
    };

    fetchCompanyInfo();

    // Set up real-time subscription
    const companyInfoChannel = supabase
      .channel('company-info-footer')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'company_info' }, () => {
        fetchCompanyInfo();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(companyInfoChannel);
    };
  }, []);

  // Get icon for social media platform
  const getSocialIcon = (platform) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('twitter') || platformLower.includes('x')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
        </svg>
      );
    } else if (platformLower.includes('facebook')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      );
    } else if (platformLower.includes('instagram')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
        </svg>
      );
    }
    // Default icon for other platforms
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
    );
  };

  const copyrightText = companyInfo?.copyright_text || `© 2025 ${companyInfo?.company_name || t('footer.companyName')} ${t('footer.allRightsReserved')}`;
  
  return (
    <footer className="border-t border-blue-300 bg-dark-blue mt-12" role="contentinfo" aria-label="Footer">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">
        {/* Company name as a full-width row */}
        <div className="mb-4">
          <span className="text-xl font-bold text-white">{companyInfo?.company_name || t('footer.companyName')}</span>
        </div>
        {/* 4 columns with extra space after the first on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 items-start">
          {/* Netherlands Office */}
          <div className="flex flex-col lg:mr-10">
            <h3 className="text-sm font-bold text-white mb-4 tracking-wide">{t('footer.netherlands.title')}</h3>
            <address className="not-italic text-sm text-white/80 leading-relaxed break-words" style={{ whiteSpace: 'pre-line' }}>
              {companyInfo?.netherlands_address || t('footer.netherlands.address')}
            </address>
          </div>

          {/* India Office */}
          <div className="flex flex-col lg:ml-1"> 
            <h3 className="text-sm font-bold text-white mb-4 tracking-wide">{t('footer.india.title')}</h3>
            <address className="not-italic text-sm text-white/80 leading-relaxed break-words" style={{ whiteSpace: 'pre-line' }}>
              {companyInfo?.india_address || t('footer.india.address')}
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
                href={companyInfo?.linkedin_url || "https://www.linkedin.com/company/asmi-technology-consulting-bv/"}
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
                href={`mailto:${companyInfo?.email_address || 'info@asmitechconsulting.com'}`}
                className="flex items-start gap-3 hover:text-blue-300 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0 mt-0.5">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <span className="break-all">{companyInfo?.email_address || t('footer.email')}</span>
              </a>
              {/* Other Social Media Links */}
              {companyInfo?.other_social_links && Array.isArray(companyInfo.other_social_links) && companyInfo.other_social_links.length > 0 && companyInfo.other_social_links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-blue-300 transition"
                  aria-label={`Visit our ${link.platform} profile (opens in a new tab)`}
                >
                  {getSocialIcon(link.platform)}
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10 text-sm text-white/60 text-center">
          {copyrightText}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
