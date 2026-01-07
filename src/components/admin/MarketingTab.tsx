/**
 * MarketingTab - Temas, colores y promociones
 */

import React, { useState } from 'react';
import { SiteContent, ThemeConfig } from '../../types';
import { Palette, Sparkles, FileText, Eye, X, ArrowRight, MessageCircle, Home, Key, Calendar, Tag } from 'lucide-react';

// Estilos por tipo de promoción (igual que PromotionModal)
const PROMOTION_STYLES: Record<string, { icon: any; gradient: string; badge: string }> = {
  descuento: { icon: Tag, gradient: 'from-amber-500 to-orange-600', badge: 'Oferta Limitada' },
  alquiler: { icon: Key, gradient: 'from-blue-500 to-cyan-600', badge: 'Disponible Ahora' },
  venta: { icon: Home, gradient: 'from-emerald-500 to-green-600', badge: 'Oportunidad Única' },
  evento: { icon: Calendar, gradient: 'from-purple-500 to-indigo-600', badge: 'Evento Especial' },
  otro: { icon: Sparkles, gradient: 'from-rose-500 to-pink-600', badge: 'Novedad' },
};

interface MarketingTabProps {
  content: SiteContent;
  themes: ThemeConfig[];
  onChange: (section: keyof SiteContent, key: string, value: any) => void;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

const MarketingTab: React.FC<MarketingTabProps> = ({ content, themes, onChange, setContent }) => {
  const [showPreview, setShowPreview] = useState(false);
  const baseTheme = themes.find(t => t.id === content.themeId) || themes[0];
  const inputStyles = "w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors";
  
  // Datos de la promoción para vista previa
  const promoStyle = PROMOTION_STYLES[content.promotion.promotionType || 'descuento'];
  const PromoIcon = promoStyle.icon;
  
  const getCurrentColors = () => ({
    primary: (content as any).customColors?.primary || baseTheme.colors.primary,
    secondary: (content as any).customColors?.secondary || baseTheme.colors.secondary,
    accent: (content as any).customColors?.accent || baseTheme.colors.accent,
    background: (content as any).customColors?.background || baseTheme.colors.background,
    text: (content as any).customColors?.text || baseTheme.colors.text,
  });

  const currentColors = getCurrentColors();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
        <h3 className="font-semibold text-purple-800 mb-1">🎨 Personalización Visual</h3>
        <p className="text-sm text-purple-700">Configura los colores, tema y promociones de tu sitio web.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* COLUMNA 1: Temas y Colores */}
        <div className="space-y-6">
          {/* Temas Institucionales */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              <Palette className="text-purple-600" />
              <h3 className="text-lg font-bold text-slate-800">Temas Institucionales</h3>
            </div>
            <div className="space-y-3">
              {themes.filter(t => t.id.startsWith('terra')).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onChange('themeId', '', theme.id)}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                    content.themeId === theme.id
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: theme.colors.primary }} />
                      <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: theme.colors.secondary }} />
                      <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: theme.colors.accent }} />
                    </div>
                    <span className="font-bold text-slate-700">{theme.name}</span>
                  </div>
                  {content.themeId === theme.id && (
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">Activo</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Temas Festivos */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              <span className="text-xl">🇵🇪</span>
              <h3 className="text-lg font-bold text-slate-800">Temas Festivos</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {themes.filter(t => !t.id.startsWith('terra')).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onChange('themeId', '', theme.id)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center transition-all ${
                    content.themeId === theme.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-6 h-6 rounded shadow-sm" style={{ backgroundColor: theme.colors.primary }} />
                    <div className="w-6 h-6 rounded shadow-sm" style={{ backgroundColor: theme.colors.accent }} />
                  </div>
                  <span className="font-medium text-slate-700 text-sm text-center">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vista Previa */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              <Eye className="text-blue-600" />
              <h3 className="text-lg font-bold text-slate-800">Vista Previa</h3>
            </div>
            <div className="rounded-xl overflow-hidden border shadow-lg" style={{ backgroundColor: currentColors.background }}>
              <div className="p-4 flex items-center justify-between" style={{ backgroundColor: currentColors.primary }}>
                <span className="font-bold text-white text-sm">🏠 Terra Viva</span>
              </div>
              <div className="p-6 text-center" style={{ background: `linear-gradient(135deg, ${currentColors.primary}15 0%, ${currentColors.accent}10 100%)` }}>
                <h4 className="text-xl font-bold mb-2" style={{ color: currentColors.text }}>Tu Hogar Ideal</h4>
                <button className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: currentColors.accent }}>
                  Ver Propiedades
                </button>
              </div>
              <div className="p-3 text-center" style={{ backgroundColor: currentColors.secondary }}>
                <span className="text-xs text-white/70">© Terra Viva 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: Promoción y Tagline */}
        <div className="space-y-6">
          {/* Popup Promocional */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-500" />
                <h3 className="text-lg font-bold text-slate-800">Popup Promocional</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Eye size={16} />
                  Vista Previa
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.promotion.isActive}
                    onChange={(e) => onChange('promotion', 'isActive', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {/* Tipo de Promoción */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Campaña</label>
                <select
                  value={content.promotion.promotionType || 'descuento'}
                  onChange={(e) => onChange('promotion', 'promotionType', e.target.value)}
                  className={inputStyles}
                >
                  <option value="descuento">🏷️ Descuento / Oferta</option>
                  <option value="alquiler">🔑 Alquiler de Local</option>
                  <option value="venta">🏠 Venta de Propiedad</option>
                  <option value="evento">📅 Evento / Open House</option>
                  <option value="otro">✨ Otro / General</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={content.promotion.title}
                    onChange={(e) => onChange('promotion', 'title', e.target.value)}
                    className={inputStyles}
                    placeholder="Ej: Local en Alquiler Centro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Texto del Badge</label>
                  <input
                    type="text"
                    value={content.promotion.badgeText || ''}
                    onChange={(e) => onChange('promotion', 'badgeText', e.target.value)}
                    className={inputStyles}
                    placeholder="Ej: Disponible Ahora"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subtítulo / Descripción</label>
                <textarea
                  value={content.promotion.subtitle}
                  onChange={(e) => onChange('promotion', 'subtitle', e.target.value)}
                  className={`${inputStyles} resize-none`}
                  rows={2}
                  placeholder="Describe brevemente la promoción..."
                />
              </div>

              {/* Descuento con toggle */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-amber-800">¿Mostrar Descuento?</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.promotion.showDiscount !== false}
                      onChange={(e) => onChange('promotion', 'showDiscount', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                  </label>
                </div>
                {content.promotion.showDiscount !== false && (
                  <input
                    type="text"
                    value={content.promotion.discount}
                    onChange={(e) => onChange('promotion', 'discount', e.target.value)}
                    className={`${inputStyles} text-2xl font-bold text-center bg-white`}
                    placeholder="Ej: 20% OFF"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Texto del Botón</label>
                  <input
                    type="text"
                    value={content.promotion.ctaText || ''}
                    onChange={(e) => onChange('promotion', 'ctaText', e.target.value)}
                    className={inputStyles}
                    placeholder="Ej: Ver Detalles"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Imagen</label>
                  <input
                    type="text"
                    value={content.promotion.imageUrl}
                    onChange={(e) => onChange('promotion', 'imageUrl', e.target.value)}
                    className={inputStyles}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Mensaje de WhatsApp */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <label className="block text-sm font-bold text-green-800 mb-2">
                  📱 Mensaje de WhatsApp (al hacer clic)
                </label>
                <textarea
                  value={content.promotion.whatsappMessage || ''}
                  onChange={(e) => onChange('promotion', 'whatsappMessage', e.target.value)}
                  className={`${inputStyles} resize-none bg-white`}
                  rows={2}
                  placeholder="Hola, vi la promoción y me interesa..."
                />
                <p className="text-xs text-green-600 mt-2">
                  Este mensaje se enviará al número de contacto de la empresa cuando el usuario haga clic en el botón.
                </p>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              <FileText className="text-blue-600" />
              <h3 className="text-lg font-bold text-slate-800">Eslogan</h3>
            </div>
            <input
              type="text"
              value={content.tagline || ''}
              onChange={(e) => onChange('tagline', '', e.target.value)}
              className={inputStyles}
              placeholder="Tu frase principal..."
            />
          </div>

          {/* Calendario */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📅</span>
              <h3 className="text-lg font-bold text-amber-800">Calendario de Temas</h3>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { emoji: '❤️', name: 'San Valentín', date: '14 Feb' },
                { emoji: '💐', name: 'Día de la Madre', date: 'Mayo' },
                { emoji: '☀️', name: 'Inti Raymi', date: '24 Jun' },
                { emoji: '🇵🇪', name: 'Fiestas Patrias', date: '28 Jul' },
                { emoji: '🎄', name: 'Navidad', date: '25 Dic' },
                { emoji: '🎆', name: 'Año Nuevo', date: '1 Ene' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                  <span>{item.emoji} {item.name}</span>
                  <span className="text-amber-700 font-medium">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Vista Previa del Popup */}
      {showPreview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 light" style={{ colorScheme: 'light' }}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          />

          {/* Indicador de Vista Previa */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[210] px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
            <Eye size={16} />
            Vista Previa del Modal
            <button
              onClick={() => setShowPreview(false)}
              className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Modal Content - Réplica exacta del PromotionModal */}
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom-10 fade-in zoom-in-95">
            
            {/* Image Side */}
            <div className="w-full md:w-1/2 relative h-64 md:h-auto overflow-hidden min-h-[300px]">
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
              {content.promotion.imageUrl ? (
                <img 
                  src={content.promotion.imageUrl} 
                  alt={content.promotion.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <span className="text-slate-400">Sin imagen</span>
                </div>
              )}
              <div className={`absolute top-6 left-6 z-20 bg-gradient-to-r ${promoStyle.gradient} text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg`}>
                {content.promotion.badgeText || promoStyle.badge}
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-gradient-to-br from-white to-slate-50">
              <button 
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <PromoIcon size={20} className="text-slate-600" />
                <span className="font-bold uppercase tracking-wider text-sm text-slate-600">
                  {content.promotion.promotionType === 'alquiler' ? 'Alquiler Disponible' :
                   content.promotion.promotionType === 'venta' ? 'Propiedad en Venta' :
                   content.promotion.promotionType === 'evento' ? 'Evento Especial' :
                   content.promotion.promotionType === 'descuento' ? 'Promoción Exclusiva' : 'Información'}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 leading-tight">
                {content.promotion.title || 'Título de la Promoción'}
              </h2>
              
              <p className="text-lg text-slate-500 font-light mb-6">
                {content.promotion.subtitle || 'Subtítulo o descripción del popup'}
              </p>

              {/* Mostrar descuento solo si está habilitado */}
              {content.promotion.showDiscount !== false && content.promotion.discount && (
                <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                    {content.promotion.discount}
                  </span>
                  <span className="text-slate-500 font-medium ml-2">de descuento</span>
                </div>
              )}

              {/* Botón principal con WhatsApp */}
              <button 
                className={`group w-full py-4 bg-gradient-to-r ${promoStyle.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-3 overflow-hidden relative`}
              >
                <MessageCircle size={20} />
                <span className="relative z-10">{content.promotion.ctaText || 'Solicitar Información'}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-xs text-slate-400 mt-3">
                Te responderemos por WhatsApp en minutos
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingTab;
