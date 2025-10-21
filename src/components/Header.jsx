import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Industries', href: '/industries' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 backdrop-blur-[10px] bg-white/70 supports-[backdrop-filter]:bg-white/60 transition-colors bg-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-4">
        <div className="flex gap-4 items-center">
          {/* Brand */}
          <Link to="/" className="inline-flex items-center gap-3" aria-label="Asmi Home">
            <div className="flex items-center justify-center h-16 w-20 rounded-lg bg-white border border-slate-200">
              <img 
                src="/src/assets/logos/asmi logo.jpeg"
                alt="ASMI Technology Consulting logo"
                className="h-14 w-18 object-contain"
              />
            </div>
            <span className="text-base font-light tracking-tight">
              ASMI Technology Consulting B.V.
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-base transition ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-slate-700/90 hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            to="/contact"
            className="hidden items-center gap-2 hover:brightness-110 transition-all focus:outline-none sm:inline-flex sm:bg-primary sm:text-slate-50 text-base font-medium text-slate-900 bg-accent border-slate-200 border rounded-full ml-auto px-4 py-2 shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.08),0_8px_24px_rgba(2,6,23,0.06)]"
          >
            Contact Our Team
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-controls="mobileMenu"
            aria-expanded={isMobileMenuOpen}
            aria-label="Open menu"
            className="md:hidden ml-auto inline-flex items-center justify-center 15 w-15 rounded-md border border-slate-200 text-slate-700 hover:text-primary hover:bg-slate-50 transition"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/90 backdrop-blur-[10px]">
          <nav className="max-w-7xl mx-auto px-5 md:px-8 py-3 grid grid-cols-1 gap-1" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 text-base transition ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-slate-700/90 hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
