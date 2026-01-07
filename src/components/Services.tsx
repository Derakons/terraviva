/**
 * Services - Servicios Inmobiliarios
 * Soluciones Integrales
 */

import React from 'react';
import { Home, Key, Building2, FileCheck, Scale, Handshake } from 'lucide-react';
import { SectionConfig } from '../types';
import DevBadge from './DevBadge';

interface ServicesProps {
  sectionConfig?: SectionConfig;
}

const Services: React.FC<ServicesProps> = ({ sectionConfig }) => {
  const services = [
    {
      icon: <Home size={32} />,
      title: 'Venta de Propiedades',
      desc: 'Casas, departamentos y terrenos con documentación saneada y precios de oportunidad.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Key size={32} />,
      title: 'Alquiler Tradicional',
      desc: 'Propiedades en alquiler con contratos seguros y asesoría legal incluida.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <Building2 size={32} />,
      title: 'Alquiler Temporal (Airbnb)',
      desc: 'Propiedades ideales para rentas cortas con alta rentabilidad.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: <Handshake size={32} />,
      title: 'Te Compramos',
      desc: 'Compramos tu propiedad al mejor precio del mercado con pago inmediato.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <FileCheck size={32} />,
      title: 'Saneamiento Legal',
      desc: 'Regularización de documentos e inscripción en SUNARP.',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: <Scale size={32} />,
      title: 'Asesoría Notarial',
      desc: 'Acompañamiento completo en minuta, escritura y trámites registrales.',
      color: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <section id="servicios" className="py-24 text-white relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, var(--primary), var(--secondary), var(--primary))' }}>
      <DevBadge name="Services" description="Nuestros Servicios" />

      {/* Decoración */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* Título */}
        <div className="text-center mb-16">
          <span 
            className="inline-block px-4 py-2 bg-white/10 text-sm font-bold rounded-full mb-4 backdrop-blur-sm"
            style={{ color: 'var(--accent)' }}
          >
            {sectionConfig?.subtitle || 'Soluciones inmobiliarias integrales'}
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            {sectionConfig?.title || 'Nuestros Servicios'} <span style={{ color: 'var(--accent)' }}>Inmobiliarias</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            {sectionConfig?.description || 'Ofrecemos asesoría completa en compra, venta, alquiler y saneamiento legal de propiedades.'}
          </p>
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/30 hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h4 className="text-xl font-bold mb-3 text-white transition-colors" style={{ '--hover-color': 'var(--accent)' } as React.CSSProperties}>
                <span className="group-hover:[color:var(--accent)]">{service.title}</span>
              </h4>
              <p className="text-slate-400 leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="#contacto"
            className="inline-flex items-center gap-3 px-8 py-4 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:brightness-110"
            style={{ background: 'var(--accent)' }}
          >
            Solicitar Información
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;