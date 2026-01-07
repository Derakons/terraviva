/**
 * HERO – Versión Negro Terciopelado Premium
 * Fondo oscuro elegante con efectos de luz sutiles y diseño sofisticado
 */

import React from 'react';
import { NavSection, SiteContent, SectionConfig } from '../types';
import {
  Home,
  Key,
  Building2,
  Search,
  Phone,
  Mail,
  ChevronDown,
  Shield,
  Award,
  Star,
} from 'lucide-react';
import DevBadge from './DevBadge';
import FestiveBanner from './FestiveBanner';

interface HeroProps {
  scrollToSection: (section: NavSection) => void;
  content: SiteContent;
  sectionConfig?: SectionConfig;
  onServiceFilter?: (serviceId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToSection, content, sectionConfig, onServiceFilter }) => {
  const services = [
    { id: 'venta', label: 'VENTA', icon: Home, color: 'from-orange-500 to-amber-600' },
    { id: 'alquiler', label: 'ALQUILER', icon: Key, color: 'from-blue-500 to-cyan-500' },
    { id: 'airbnb', label: 'AIRBNB', icon: Building2, color: 'from-rose-500 to-pink-600' },
    { id: 'compra', label: 'COMPRA', icon: Search, color: 'from-emerald-500 to-green-500' },
  ];

  // Usar configuración de sección o valores por defecto
  const title = sectionConfig?.title || 'Tu Hogar Ideal en Cusco';
  const subtitle = sectionConfig?.subtitle || 'Propiedades saneadas e inscritas en SUNARP';
  const description = sectionConfig?.description || 'Compra, vende o alquila con total seguridad y respaldo legal.';
  const ctaText = sectionConfig?.ctaText || 'Ver Propiedades';
  const backgroundImage = sectionConfig?.backgroundImage;
  const backgroundColor = sectionConfig?.backgroundColor || '#0a0a0f';

  const handlePhoneClick = () => {
    window.location.href = `tel:+51${content.contact.phone.replace(/\D/g, '')}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${content.contact.email}`;
  };

  return (
    <section className="hero-velvet relative overflow-hidden">
      <DevBadge name="Hero" description="Negro Terciopelado" />
      
      {/* Banner Festivo */}
      <FestiveBanner companyName={content.logoText || 'Terra Viva'} />

      {/* FONDO NEGRO TERCIOPELADO */}
      <div 
        className="relative min-h-[80vh]"
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        {/* Imagen de fondo con mejor ajuste */}
        {backgroundImage && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Overlay oscuro sobre la imagen */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
          </div>
        )}
        
        {/* Capa de textura terciopelo */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 30%, rgba(30, 30, 50, 0.8) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(20, 20, 35, 0.9) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(15, 15, 25, 1) 0%, transparent 70%)
            `
          }}
        />

        {/* Efecto de luz ambiental sutil */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full blur-[150px] animate-pulse" style={{ background: 'color-mix(in srgb, var(--accent) 8%, transparent)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/6 rounded-full blur-[130px]" />

        {/* Efecto de brillo central */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 50%)'
          }}
        />

        {/* Patrón de ruido sutil para textura terciopelo */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />

        {/* CONTENIDO */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          {/* Logo con efecto de brillo */}
          {content.logoUrl && (
            <div className="mb-10 flex justify-center">
              <div className="relative">
                {/* Aura detrás del logo */}
                <div className="absolute inset-0 blur-3xl scale-150 opacity-60" style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--accent) 20%, transparent), transparent)' }} />
                <img
                  src={content.logoUrl}
                  alt={content.logoText}
                  className="relative h-40 md:h-52 lg:h-60 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          )}

          {/* TITULAR ELEGANTE */}
          <h1 className="max-w-4xl mx-auto text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
            <span style={{ color: 'var(--accent)' }}>
              {title}
            </span>
          </h1>

          {subtitle && (
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/90 mb-4 font-semibold">
              {subtitle}
            </p>
          )}

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300/90 mb-12 font-light tracking-wide">
            {description}
          </p>

          {/* CTA CONTACTO - Estilo sofisticado */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-14">
            <button
              onClick={handlePhoneClick}
              className="group relative px-10 py-4 rounded-full font-bold text-lg text-white overflow-hidden shadow-2xl"
              style={{ boxShadow: '0 25px 50px -12px color-mix(in srgb, var(--accent) 30%, transparent)' }}
            >
              {/* Fondo con efecto de brillo */}
              <span className="absolute inset-0" style={{ background: 'var(--accent)' }} />
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center gap-3">
                <Phone className="group-hover:animate-pulse" size={22} />
                {content.contact.phone}
              </span>
            </button>

            <button
              onClick={handleEmailClick}
              className="px-10 py-4 rounded-full border-2 border-white/20 text-white font-semibold backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                <Mail size={22} />
                {content.contact.email}
              </span>
            </button>
          </div>

          {/* BADGES - Estilo premium */}
          <div className="flex flex-wrap justify-center gap-8 text-sm mb-14">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Shield className="text-emerald-400 drop-shadow-lg" size={18} />
              <span className="text-slate-200 font-medium">100% Saneadas</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Award className="drop-shadow-lg" size={18} style={{ color: 'var(--accent)' }} />
              <span className="text-slate-200 font-medium">SUNARP</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Star className="text-amber-400 drop-shadow-lg" size={18} />
              <span className="text-slate-200 font-medium">+Garantía</span>
            </div>
          </div>

          {/* SERVICIOS – Tarjetas elegantes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => onServiceFilter ? onServiceFilter(s.id) : scrollToSection(NavSection.PROJECTS)}
                className="group relative rounded-2xl p-6 bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:border-white/20 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50"
              >
                {/* Gradiente al hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.02] to-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex flex-col items-center">
                  <s.icon
                    size={36}
                    className="mb-3 text-white/90 group-hover:text-white group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
                  />
                  <span className="font-black text-white/90 group-hover:text-white tracking-wider text-sm">
                    {s.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* SCROLL INDICATOR */}
          <div className="mt-16">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-xs text-white/40 uppercase tracking-widest">Explorar</span>
              <ChevronDown size={28} className="text-white/50" />
            </div>
          </div>
        </div>

        {/* Transición suave hacia la siguiente sección */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-main)] to-transparent" />
      </div>
    </section>
  );
};

export default Hero;

