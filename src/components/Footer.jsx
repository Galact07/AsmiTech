import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white mt-12" role="contentinfo" aria-label="Footer">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white text-sm font-medium tracking-tight">
                AT
              </span>
              <span className="text-base font-light">Asmi Technology Consulting BV</span>
            </div>
            <address className="not-italic mt-4 text-base text-slate-700/70">
              Leidseveer 2-10, 3511 SB Utrecht, Netherlands<br />
              Email: <a href="mailto:hello@asmi.consulting" className="text-primary hover:text-secondary">
                hello@asmi.consulting
              </a><br />
              Phone: <a href="tel:+31301234567" className="text-primary hover:text-secondary">
                +31 (0)30 123 4567
              </a>
            </address>
            <div className="mt-4 grid grid-cols-2 gap-2 max-w-xs">
              <div className="flex items-center justify-center h-10 rounded-md border border-slate-200 bg-white">
                <span className="text-slate-600 text-sm">SAP Partner</span>
              </div>
              <div className="flex items-center justify-center h-10 rounded-md border border-slate-200 bg-white">
                <span className="text-slate-600 text-sm">ISO/IEC 27001</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-light">Quick links</h3>
            <ul className="mt-3 text-base text-slate-700/70 space-y-2">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/services" className="hover:text-primary">Services</Link></li>
              <li><Link to="/industries" className="hover:text-primary">Industries</Link></li>
              <li><Link to="/resources" className="hover:text-primary">Resources</Link></li>
              <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-light">Connect</h3>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-primary hover:text-secondary"
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              LinkedIn
            </a>
            <p className="mt-4 text-base text-slate-700/70">SAP Partner aligned • GDPR compliant</p>
          </div>
        </div>
        <div className="mt-8 text-base text-slate-500">© 2025 Asmi Technology Consulting BV</div>
      </div>
    </footer>
  );
};

export default Footer;
