import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white mt-12" role="contentinfo" aria-label="Footer">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div>
              <span className="text-base font-light">ASMI Technology Consulting B.V.</span>
            </div>
            <div className="mt-4 text-base text-slate-700/70">
              <h3 className="text-base font-light">Head Office – Netherlands</h3>
              <address className="not-italic mt-2">
                Asmi Technology Consulting B.V<br />
                #10, Boudewijn Buchstraat<br />
                3544HJ Utrecht<br />
                Email: <a href="mailto:info@asmitechconsulting.com" className="text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40">info@asmitechconsulting.com</a>
              </address>

              <h3 className="text-base font-light mt-4">Branch Office – India</h3>
              <address className="not-italic mt-2">
                Asmi Technology Consulting Private Limited<br />
                #136, Meenakshi Layout, Kalena Agrahara<br />
                Bannerghatta Main Road, Bengaluru<br />
                PIN – 560076<br />
                Email: <a href="mailto:info@asmitechconsulting.com" className="text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40">info@asmitechconsulting.com</a>
              </address>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-light">Quick links</h3>
            <ul className="mt-3 text-base text-slate-700/70 space-y-2">
              <li><Link to="/" className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40">About Us</Link></li>
              <li><Link to="/services" className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40">Services</Link></li>
              <li><Link to="/industries" className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40">Industries</Link></li>
              <li>
                <Link to="/resources" className="sr-only focus:not-sr-only hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40">Resources</Link>
              </li>
              <li><Link to="/careers" className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-light">Connect</h3>
            <a
              href="https://www.linkedin.com/company/asmi-technology-consulting-bv/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40"
              aria-label="Visit our LinkedIn profile (opens in a new tab)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              LinkedIn
            </a>
            
          </div>
        </div>
        <div className="mt-8 text-base text-slate-500">© 2025 Asmi Technology Consulting B.V.</div>
      </div>
    </footer>
  );
};

export default Footer;
