import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, MessageCircle, Home, Key, Calendar, Tag } from 'lucide-react';
import { PromotionConfig } from '../types';

interface PromotionModalProps {
  config: PromotionConfig;
  onClose: () => void;
  phoneNumber?: string;
}

// Iconos y colores por tipo de promoción
const PROMOTION_STYLES: Record<string, { icon: any; gradient: string; badge: string }> = {
  descuento: { icon: Tag, gradient: 'from-amber-500 to-orange-600', badge: 'Oferta Limitada' },
  alquiler: { icon: Key, gradient: 'from-blue-500 to-cyan-600', badge: 'Disponible Ahora' },
  venta: { icon: Home, gradient: 'from-emerald-500 to-green-600', badge: 'Oportunidad Única' },
  evento: { icon: Calendar, gradient: 'from-purple-500 to-indigo-600', badge: 'Evento Especial' },
  otro: { icon: Sparkles, gradient: 'from-rose-500 to-pink-600', badge: 'Novedad' },
};

const PromotionModal: React.FC<PromotionModalProps> = ({ config, onClose, phoneNumber = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (config.isActive) {
      timer = setTimeout(() => setIsVisible(true), 1500);
    } else {
      setIsVisible(false);
    }
    return () => clearTimeout(timer);
  }, [config.isActive]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const handleWhatsApp = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      config.whatsappMessage || `Hola, vi la promoción "${config.title}" y me gustaría más información.`
    );
    window.open(`https://wa.me/51${cleanPhone}?text=${message}`, '_blank');
    handleClose();
  };

  if (!config.isActive || !isVisible) return null;

  const style = PROMOTION_STYLES[config.promotionType || 'descuento'];
  const Icon = style.icon;
  const badgeText = config.badgeText || style.badge;
  const ctaText = config.ctaText || 'Solicitar Información';
  const showDiscount = config.showDiscount !== false && config.discount;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 animate-in fade-in"
        onClick={handleClose}
      />

      {/* Modal Content - Forzar modo claro */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 scale-100 flex flex-col md:flex-row animate-in slide-in-from-bottom-10 fade-in zoom-in-95 light" style={{ colorScheme: 'light' }}>
        
        {/* Image Side */}
        <div className="w-full md:w-1/2 relative h-64 md:h-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
          <img 
            src={config.imageUrl} 
            alt={config.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className={`absolute top-6 left-6 z-20 bg-gradient-to-r ${style.gradient} text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg`}>
            {badgeText}
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-gradient-to-br from-white to-slate-50">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <Icon size={20} className={`bg-gradient-to-r ${style.gradient} text-white p-1 rounded`} />
            <span className={`font-bold uppercase tracking-wider text-sm bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent`}>
              {config.promotionType === 'alquiler' ? 'Alquiler Disponible' :
               config.promotionType === 'venta' ? 'Propiedad en Venta' :
               config.promotionType === 'evento' ? 'Evento Especial' :
               config.promotionType === 'descuento' ? 'Promoción Exclusiva' : 'Información'}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 leading-tight">
            {config.title}
          </h2>
          
          <p className="text-lg text-slate-600 font-light mb-6">
            {config.subtitle}
          </p>

          {/* Mostrar descuento solo si está habilitado */}
          {showDiscount && (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                {config.discount}
              </span>
              <span className="text-slate-600 font-medium ml-2">de descuento</span>
            </div>
          )}

          {/* Botón principal con WhatsApp */}
          <button 
            onClick={handleWhatsApp}
            className={`group w-full py-4 bg-gradient-to-r ${style.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-3 overflow-hidden relative`}
          >
            <MessageCircle size={20} />
            <span className="relative z-10">{ctaText}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </button>

          <p className="text-center text-xs text-slate-500 mt-3">
            Te responderemos por WhatsApp en minutos
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;