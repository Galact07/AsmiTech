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
    { name: 'Resources', href: '/resources' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 backdrop-blur-[10px] bg-white/70 supports-[backdrop-filter]:bg-white/60 transition-colors bg-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-4">
        <div className="flex gap-4 items-center">
          {/* Brand */}
          <Link to="/" className="inline-flex items-center gap-2" aria-label="Asmi Home">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white text-sm font-medium tracking-tight">
              AT
            </span>
            <span className="text-base font-light tracking-tight">
              Asmi Technology Consulting BV
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-base rounded-md transition ${
                  isActive(item.href)
                    ? 'text-primary border border-secondary bg-white'
                    : 'text-slate-700/90 hover:text-primary hover:bg-slate-50 border border-transparent hover:border-slate-200'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            to="/contact"
            className="hidden items-center gap-2 hover:shadow-[0_0_0_5px_rgba(212,160,23,0.25)] hover:brightness-105 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/50 sm:inline-flex sm:bg-primary sm:text-slate-50 text-base font-medium text-slate-900 bg-accent border-slate-200 border rounded-full ml-auto px-4 py-2 shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.08),0_8px_24px_rgba(2,6,23,0.06)]"
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
            className="md:hidden ml-auto inline-flex items-center justify-center h-10 w-10 rounded-md border border-slate-200 text-slate-700 hover:text-primary hover:bg-slate-50 transition"
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
                className={`px-3 py-2 rounded-md text-base transition ${
                  isActive(item.href)
                    ? 'text-primary border border-secondary bg-white'
                    : 'text-slate-700/90 hover:text-primary hover:bg-slate-50 border border-transparent hover:border-slate-200'
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
