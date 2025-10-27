import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-blue-300 bg-dark-blue mt-12" role="contentinfo" aria-label="Footer">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Company Info */}
          <div className="md:col-span-6">
            <div className="mb-4">
              <span className="text-xl font-bold text-white">ASMI Technology Consulting B.V.</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-white mb-3">Head Office – Netherlands</h3>
                <address className="not-italic text-sm text-white/80 leading-relaxed break-words">
                  Asmi Technology Consulting B.V<br />
                  #10, Boudewijn Buchstraat<br />
                  3544HJ Utrecht<br />
                  Ph No: +31-622098973<br />
                  <a href="mailto:info@asmitechconsulting.com" className="text-blue-400 hover:text-blue-300 transition break-all">info@asmitechconsulting.com</a>
                </address>
              </div>

              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-white mb-3">India Office</h3>
                <address className="not-italic text-sm text-white/80 leading-relaxed break-words">
                  Asmi Technology Consulting Pvt. Ltd.<br />
                  #136, Meenakshi Layout,<br />
                  Kalena Agrahara, Bannerghatta Main Road,<br />
                  Bengaluru - 560076<br />
                  Ph No: +91 98862 00035<br />
                  <a href="mailto:info@asmitechconsulting.com" className="text-blue-400 hover:text-blue-300 transition break-all">info@asmitechconsulting.com</a>
                </address>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-3 ml-0 md:ml-12">
            <h3 className="text-base font-bold text-white mb-3">Quick links</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/" className="block hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/about" className="block hover:text-blue-400 transition">About Us</Link></li>
              <li><Link to="/services" className="block hover:text-blue-400 transition">Services</Link></li>
              <li><Link to="/industries" className="block hover:text-blue-400 transition">Industries</Link></li>
              <li>
                <Link to="/resources" className="sr-only focus:not-sr-only block hover:text-blue-400 transition">Resources</Link>
              </li>
              <li><Link to="/careers" className="block hover:text-blue-400 transition">Careers</Link></li>
              <li><Link to="/contact" className="block hover:text-blue-400 transition">Contact</Link></li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div className="md:col-span-3">
            <h3 className="text-base font-bold text-white mb-3">Connect with Us</h3>
            <div className="space-y-3">
              <a
                href="https://www.linkedin.com/company/asmi-technology-consulting-bv/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white/80 hover:text-blue-300 transition"
                aria-label="Visit our LinkedIn profile (opens in a new tab)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                LinkedIn
              </a>
              <a
                href="mailto:info@asmitechconsulting.com"
                className="flex items-start gap-3 text-sm text-white/80 hover:text-blue-300 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0 mt-0.5">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <span className="break-all">info@asmitechconsulting.com</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10 text-sm text-white/60 text-center">
          © 2025 Asmi Technology Consulting B.V.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
