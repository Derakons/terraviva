/**
 * About - Sobre Nosotros
 * Experiencia y Confianza Inmobiliaria
 */

import React from 'react';
import { ShieldCheck, Users, TrendingUp, Award, Clock, MapPin } from 'lucide-react';
import { SiteContent } from '../types';
import DevBadge from './DevBadge';

interface AboutProps {
  content: SiteContent;
}

const About: React.FC<AboutProps> = ({ content }) => {
  return (
    <section id="nosotros" className="py-20 bg-white relative overflow-hidden">
      <DevBadge name="About" description="Sobre Nosotros" />

      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* Título de sección */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-600 text-sm font-bold rounded-full mb-4">
            Sobre Nosotros
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Experiencia y Confianza Inmobiliaria
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Ayudamos a familias a encontrar su hogar ideal con total transparencia y seguridad jurídica.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* Imagen */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img
                src={content.about.imageUrl}
                alt="Equipo Terra Viva"
                className="rounded-2xl shadow-2xl z-10 relative w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl -z-0" />
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-slate-100 rounded-2xl -z-0" />

            </div>
          </div>

          {/* Contenido */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{content.about.title}</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              {content.about.description}
            </p>

            {/* Características */}
            <div className="space-y-6">
              <div className="flex gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">Documentación Saneada</h4>
                  <p className="text-slate-600">Todas nuestras propiedades están inscritas en SUNARP con títulos verificados.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">Asesoría Legal</h4>
                  <p className="text-slate-600">Acompañamiento jurídico completo desde la cotización hasta la escritura.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">+50 Clientes Satisfechos</h4>
                  <p className="text-slate-600">Familias que confiaron en nosotros para encontrar su hogar.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-16 pt-16 border-t border-slate-100">
          <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100">
            <p className="text-4xl font-black text-orange-500 mb-2">+10</p>
            <p className="text-slate-600 font-medium">Propiedades</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100">
            <p className="text-4xl font-black text-orange-500 mb-2">100%</p>
            <p className="text-slate-600 font-medium">Saneadas</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100">
            <p className="text-4xl font-black text-orange-500 mb-2">+30</p>
            <p className="text-slate-600 font-medium">Clientes</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;