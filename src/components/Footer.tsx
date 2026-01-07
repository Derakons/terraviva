/**
 * Footer - Terra Viva
 * Diseño compacto sincronizado con el tema
 */

import React from 'react';
import {
  HardHat,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Lock,
  MapPin,
  Phone,
  Mail,
  Heart
} from 'lucide-react';
import { NavSection, SiteContent, ViewState } from '../types';

interface FooterProps {
  scrollToSection: (section: NavSection) => void;
  content: SiteContent;
  onAdminClick: () => void;
  onNavigate: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({
  scrollToSection,
  content,
  onAdminClick,
  onNavigate
}) => {

  const handleNavClick = (section: NavSection) => {
    onNavigate('website');
    setTimeout(() => scrollToSection(section), 100);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="text-white relative"
      style={{ background: 'linear-gradient(180deg, var(--primary), var(--secondary))' }}
    >
      {/* Línea superior con acento del tema */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />

      <div className="container mx-auto px-4 md:px-8">
        
        {/* Main Grid - Compacto */}
        <div className="py-10 grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              {content.logoUrl ? (
                <img src={content.logoUrl} alt={content.logoText} className="h-10 object-contain brightness-0 invert" />
              ) : (
                <>
                  <div className="p-2 rounded-lg bg-white/20 text-white">
                    <HardHat size={20} />
                  </div>
                  <span className="text-lg font-bold text-white">{content.logoText}</span>
                </>
              )}
            </div>
            
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Tu socio de confianza en inversiones inmobiliarias. Propiedades saneadas e inscritas en SUNARP.
            </p>

            {/* Social Icons */}
            <div className="flex gap-2">
              {content.socials.facebook && (
                <a href={content.socials.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Facebook">
                  <Facebook size={14} />
                </a>
              )}
              {content.socials.instagram && (
                <a href={content.socials.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Instagram">
                  <Instagram size={14} />
                </a>
              )}
              {content.socials.linkedin && content.socials.linkedin !== '#' && (
                <a href={content.socials.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                  <Linkedin size={14} />
                </a>
              )}
              {content.socials.twitter && content.socials.twitter !== '#' && (
                <a href={content.socials.twitter} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Twitter">
                  <Twitter size={14} />
                </a>
              )}
              {content.socials.tiktok && content.socials.tiktok !== '#' && (
                <a href={content.socials.tiktok} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="TikTok">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-1.5">
              {[
                { label: 'Inicio', section: NavSection.HOME },
                { label: 'Propiedades', section: NavSection.PROJECTS },
                { label: 'Empleos', section: NavSection.SERVICES },
                { label: 'Nosotros', section: NavSection.ABOUT },
                { label: 'Contacto', section: NavSection.CONTACT },
              ].map((item) => (
                <li key={item.section}>
                  <button onClick={() => handleNavClick(item.section)}
                    className="text-white/60 hover:text-white text-xs transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-1.5">
              <li><button onClick={() => onNavigate('terms')} className="text-white/60 hover:text-white text-xs transition-colors">Términos</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="text-white/60 hover:text-white text-xs transition-colors">Privacidad</button></li>
              <li><button onClick={() => onNavigate('denuncias')} className="text-white/60 hover:text-white text-xs transition-colors">Denuncias</button></li>
              <li><button onClick={() => onNavigate('postsale')} style={{ color: 'var(--accent)' }} className="hover:brightness-110 text-xs transition-all font-medium">Post-Venta</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-2">
              <li>
                <a href={`tel:+51${content.contact.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors">
                  <Phone size={12} style={{ color: 'var(--accent)' }} />
                  {content.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${content.contact.email}`}
                  className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors">
                  <Mail size={12} style={{ color: 'var(--accent)' }} />
                  <span className="truncate">{content.contact.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/60 text-xs">
                <MapPin size={12} style={{ color: 'var(--accent)' }} className="shrink-0 mt-0.5" />
                <span>{content.contact.address}</span>
              </li>
            </ul>
            
            {/* WhatsApp mini */}
            <a href={`https://wa.me/51${content.contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-400 text-white rounded-lg text-xs font-medium transition-colors">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-xs">
            © {currentYear} {content.companyName}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-white/50 text-xs flex items-center gap-1">
              Hecho con <Heart size={10} className="text-red-400 fill-red-400" /> en Cusco 🇵🇪
            </span>
            <button onClick={onAdminClick}
              className="text-white/30 hover:text-white/60 transition-colors p-1" title="Admin" aria-label="Admin">
              <Lock size={10} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;