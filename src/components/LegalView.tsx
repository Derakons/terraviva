/**
 * LegalView - Vista de Documentos Legales
 * Diseño vibrante y profesional
 */

import React, { useEffect } from 'react';
import { ArrowLeft, ShieldAlert, FileText, Lock, Shield, Scale, AlertTriangle } from 'lucide-react';
import DevBadge from './DevBadge';

interface LegalViewProps {
  type: 'terms' | 'privacy' | 'denuncias';
  title: string;
  content: string;
  onBack: () => void;
}

const LegalView: React.FC<LegalViewProps> = ({ type, title, content, onBack }) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getConfig = () => {
    switch (type) {
      case 'terms':
        return {
          icon: Scale,
          gradient: 'from-blue-500 to-indigo-600',
          bgLight: 'from-blue-50 to-indigo-50'
        };
      case 'privacy':
        return {
          icon: Shield,
          gradient: 'from-green-500 to-emerald-600',
          bgLight: 'from-green-50 to-emerald-50'
        };
      case 'denuncias':
        return {
          icon: AlertTriangle,
          gradient: 'from-orange-500 to-red-500',
          bgLight: 'from-orange-50 to-red-50'
        };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      <DevBadge name="LegalView" description={`Documento legal: ${type}`} />

      {/* Hero */}
      <div className={`bg-gradient-to-br ${config.gradient} text-white py-16 pt-24 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <IconComponent size={300} className="absolute -right-10 -bottom-10" />
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Volver al Inicio</span>
          </button>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <IconComponent size={40} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black">{title}</h1>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 md:px-8 max-w-4xl -mt-8 relative z-10 pb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Fecha de actualización */}
          <div className={`bg-gradient-to-r ${config.bgLight} px-8 py-4 border-b border-slate-100`}>
            <p className="text-sm text-slate-500">
              <strong>Última actualización:</strong> Diciembre 2024
            </p>
          </div>

          {/* Texto legal */}
          <div className="p-8 md:p-12">
            <div
              className="prose prose-slate max-w-none 
                prose-headings:text-slate-900 prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
                prose-ul:list-disc prose-ul:pl-6
                prose-li:text-slate-600 prose-li:mb-2
                prose-strong:text-slate-800"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Footer del documento */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                © 2024 Terra Viva Grupo Inmobiliario SAC. Todos los derechos reservados.
              </p>
              <button
                onClick={onBack}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm hover:from-orange-600 hover:to-red-600 transition-all"
              >
                Volver al Inicio
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LegalView;