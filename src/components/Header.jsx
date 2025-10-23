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
    <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-primary transition-colors shadow-lg">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-4">
        <div className="flex gap-4 items-center">
          {/* Brand */}
          <Link to="/" className="inline-flex items-center gap-3" aria-label="Asmi Home">
            <div className="flex items-center justify-center h-12 w-18 rounded-lg bg-white border border-white/20 backdrop-blur-sm px-1">
              <img 
                src="/src/assets/logos/asmi logo.png"
                alt="ASMI Technology Consulting logo"
                className="h-16 w-20 object-contain"
              />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              ASMI Technology Consulting B.V.
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-base font-bold transition-all duration-200 hover:bg-white/10 rounded-md ${
                  isActive(item.href)
                    ? 'text-white bg-white/20'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            to="/contact"
            className="hidden items-center gap-2 hover:bg-slate-50 transition-all focus:outline-none sm:inline-flex bg-white text-primary text-base font-bold border border-white/20 rounded-full ml-auto px-4 py-2 shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.1),0_8px_24px_rgba(255,255,255,0.2)]"
          >
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium">Get in Touch</span>
              <span className="text-sm font-bold">+31 6 2209 8973</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-controls="mobileMenu"
            aria-expanded={isMobileMenuOpen}
            aria-label="Open menu"
            className="md:hidden ml-auto inline-flex items-center justify-center 15 w-15 rounded-md border border-white/20 text-white hover:text-white hover:bg-white/10 transition-all duration-200 font-bold"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/20 bg-primary">
          <nav className="max-w-7xl mx-auto px-5 md:px-8 py-3 grid grid-cols-1 gap-1" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 text-base font-bold transition-all duration-200 hover:bg-white/10 rounded-md ${
                  isActive(item.href)
                    ? 'text-white bg-white/20'
                    : 'text-white/90 hover:text-white'
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
