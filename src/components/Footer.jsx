import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-blue-300 bg-dark-blue mt-12" role="contentinfo" aria-label="Footer">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center h-12 w-16 rounded-lg bg-white p-2">
                <img 
                  src="/logos/asmi logo.png"
                  alt="ASMI Technology Consulting logo"
                  className="h-8 w-12 object-contain"
                />
              </div>
              <span className="text-base font-bold text-white">ASMI Technology Consulting B.V.</span>
            </div>
            <div className="mt-4 text-base text-white/80">
              <h3 className="text-base font-bold text-white">Head Office – Netherlands</h3>
              <address className="not-italic mt-2">
                Asmi Technology Consulting B.V<br />
                #10, Boudewijn Buchstraat<br />
                3544HJ Utrecht<br />
                Email: <a href="mailto:info@asmitechconsulting.com" className="text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40">info@asmitechconsulting.com</a>
              </address>

              <h3 className="text-base font-bold text-white mt-4">Branch Office – India</h3>
              <address className="not-italic mt-2">
                Asmi Technology Consulting Private Limited<br />
                #136, Meenakshi Layout, Kalena Agrahara<br />
                Bannerghatta Main Road, Bengaluru<br />
                PIN – 560076<br />
                Email: <a href="mailto:info@asmitechconsulting.com" className="text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40">info@asmitechconsulting.com</a>
              </address>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-bold text-white">Quick links</h3>
            <ul className="mt-3 text-base text-white/80 space-y-2">
              <li><Link to="/" className="hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40">About Us</Link></li>
              <li><Link to="/services" className="hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40">Services</Link></li>
              <li><Link to="/industries" className="hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40">Industries</Link></li>
              <li>
                <Link to="/resources" className="sr-only focus:not-sr-only hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40">Resources</Link>
              </li>
              <li><Link to="/careers" className="hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-bold text-white">Connect</h3>
            <a
              href="https://www.linkedin.com/company/asmi-technology-consulting-bv/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-white hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
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
        <div className="mt-8 text-base text-white/60">© 2025 Asmi Technology Consulting B.V.</div>
      </div>
    </footer>
  );
};

export default Footer;
