/**
 * PostSaleView - Vista de Servicio Post-Venta
 * Diseño vibrante y profesional
 */

import React, { useEffect } from 'react';
import { ArrowLeft, Wrench, PhoneCall, Clock, BookOpen, AlertCircle, HeadphonesIcon, FileText, CheckCircle } from 'lucide-react';
import { PostSaleContent } from '../types';
import DevBadge from './DevBadge';

interface PostSaleViewProps {
  content: PostSaleContent;
  onBack: () => void;
}

const PostSaleView: React.FC<PostSaleViewProps> = ({ content, onBack }) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <DevBadge name="PostSaleView" description="Post-Venta" />

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 pt-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Wrench size={400} className="absolute -right-20 -bottom-20 transform rotate-12" />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Volver al Inicio</span>
          </button>

          <h1 className="text-4xl md:text-5xl font-black mb-4">{content.title}</h1>
          <p className="text-xl text-slate-300 max-w-2xl">{content.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-5xl -mt-8 relative z-10">

        {/* Tarjetas de contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* Emergencias */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-red-500 hover:shadow-2xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Emergencias 24/7</h3>
                <p className="text-slate-500 text-sm">Fugas, fallas eléctricas o problemas estructurales</p>
              </div>
            </div>
            <a
              href={`tel:${content.emergencyPhone}`}
              className="flex items-center gap-3 text-2xl font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              <PhoneCall size={28} />
              {content.emergencyPhone}
            </a>
          </div>

          {/* Horario */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-blue-500 hover:shadow-2xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Horario de Atención</h3>
                <p className="text-slate-500 text-sm">Atención administrativa y técnica</p>
              </div>
            </div>
            <p className="text-xl font-bold text-slate-700">{content.schedule}</p>
          </div>
        </div>

        {/* Manual del propietario */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-20">
            <BookOpen size={200} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl font-bold mb-4">Manual de Propietario</h3>
              <p className="text-white/80 text-lg max-w-xl">
                Descarga el manual completo con garantías, recomendaciones y cuidados básicos de tu vivienda.
              </p>
            </div>
            <a
              href={content.manualUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-slate-100 transition-colors shadow-lg flex-shrink-0"
            >
              <FileText size={22} />
              Descargar PDF
            </a>
          </div>
        </div>

        {/* Nuestros servicios */}
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <HeadphonesIcon size={28} className="text-orange-500" />
            Nuestros Servicios Post-Venta
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Reparaciones', desc: 'Atención de desperfectos cubiertos por garantía' },
              { title: 'Mantención', desc: 'Guías y tips para el cuidado de tu vivienda' },
              { title: 'Asesoría', desc: 'Consultas técnicas y recomendaciones' }
            ].map((service, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle size={20} className="text-white" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{service.title}</h4>
                <p className="text-sm text-slate-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Solicitud de Post-Venta</h3>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Proyecto / Condominio</label>
              <input
                type="text"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Ej: Altos del Parque"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nº Unidad / Depto</label>
              <input
                type="text"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Ej: 402-B"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Descripción del Problema</label>
              <textarea
                rows={4}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Describa el requerimiento..."
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="button"
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Enviar Solicitud
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default PostSaleView;