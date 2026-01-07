import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, HardHat, Phone } from 'lucide-react';
import { NavSection, ViewState } from '../types';
import DarkModeToggle from './DarkModeToggle';

interface HeaderProps {
  activeSection: NavSection;
  scrollToSection: (section: NavSection) => void;
  logoText: string;
  logoUrl?: string;
  onNavigate?: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({
  activeSection,
  scrollToSection,
  logoText,
  logoUrl,
  onNavigate
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Optimizar scroll listener con throttle
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Verificar scroll inicial
    setIsScrolled(window.scrollY > 50);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: NavSection.HOME, label: 'Inicio' },
    { id: NavSection.PROJECTS, label: 'Propiedades' },
    { id: NavSection.SERVICES, label: 'Empleos' },
    { id: NavSection.ABOUT, label: 'Nosotros' },
    { id: NavSection.CONTACT, label: 'Contacto' },
  ];

  // Bloquear scroll cuando menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = useCallback((section: NavSection) => {
    if (onNavigate) {
      onNavigate('website');
    }
    setTimeout(() => {
      scrollToSection(section);
    }, 50);
    setIsMobileMenuOpen(false);
  }, [onNavigate, scrollToSection]);

  return (
    <>
      {/* Header Principal - Sincronizado con tema */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'header-scrolled py-2'
          : 'bg-gradient-to-b from-black/60 via-black/30 to-transparent py-4 md:py-5'
          }`}
        style={isScrolled ? { 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.15)'
        } : undefined}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center">

            {/* Logo - Solo visible cuando hay scroll */}
            <button
              className={`flex items-center gap-2 z-50 relative group transition-all duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              onClick={() => handleNavClick(NavSection.HOME)}
              aria-label="Ir al inicio"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={logoText}
                  className="h-10 md:h-12 object-contain brightness-0 invert"
                />
              ) : (
                <>
                  <div className="p-2 rounded-xl bg-white/20 text-white shadow-md">
                    <HardHat size={22} />
                  </div>
                  <span className="text-lg md:text-xl font-bold tracking-tight text-white">
                    {logoText}
                  </span>
                </>
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${activeSection === link.id
                    ? isScrolled
                      ? 'bg-white/20 text-white shadow-md backdrop-blur-sm'
                      : 'bg-white text-[var(--primary)] shadow-lg'
                    : isScrolled
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-white hover:bg-white/20 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]'
                    }`}
                >
                  {link.label}
                </button>
              ))}

              {/* CTA Button - Desktop */}
              <a
                href="tel:+51913328866"
                className="ml-3 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                style={{ 
                  background: 'var(--accent)',
                  color: 'white'
                }}
              >
                <Phone size={16} />
                <span className="hidden xl:inline">913 328 866</span>
              </a>

              {/* Dark Mode Toggle */}
              <div className="ml-3">
                <DarkModeToggle />
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2.5 rounded-xl z-50 relative transition-all ${isMobileMenuOpen
                ? 'bg-slate-100 text-slate-900'
                : 'text-white bg-white/10 backdrop-blur-sm hover:bg-white/20'
                }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Sincronizado con tema */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-out ${isMobileMenuOpen
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-full pointer-events-none'
          }`}
        style={{ background: 'linear-gradient(180deg, var(--primary), var(--secondary))' }}
      >
        <div className="flex flex-col h-full pt-24 px-6 pb-8">
          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col gap-1">
            {navLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left font-semibold text-xl py-4 px-4 rounded-xl transition-all duration-200 ${activeSection === link.id
                  ? 'text-white bg-white/20'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Mobile CTAs */}
          <div className="space-y-3 pt-6 border-t border-white/20">
            <a
              href="tel:+51913328866"
              className="w-full py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-lg"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              <Phone size={20} />
              Llamar: 913 328 866
            </a>
            <a
              href="https://wa.me/51913328866"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Footer info */}
          <div className="mt-6 text-center text-white/50 text-sm">
            <p>© {new Date().getFullYear()} Terra Viva</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;