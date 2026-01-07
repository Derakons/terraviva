/**
 * GeneralTab - Configuración general del sitio
 */

import React from 'react';
import { SiteContent } from '../../types';

interface GeneralTabProps {
  content: SiteContent;
  onChange: (section: keyof SiteContent, key: string, value: any) => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ content, onChange }) => {
  const inputStyles = "w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";
  
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-blue-800">⚙️ Configuración General</h3>
        <p className="text-sm text-blue-600">Información básica de tu empresa.</p>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Empresa</label>
        <input
          type="text"
          value={content.companyName}
          onChange={(e) => onChange('companyName', '', e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">URL del Logo (Imagen)</label>
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <input
              type="text"
              value={content.logoUrl || ''}
              onChange={(e) => onChange('logoUrl', '', e.target.value)}
              className={inputStyles}
              placeholder="https://..."
            />
            <p className="text-xs text-slate-500 mt-2">Si se deja vacío, se mostrará el texto del logo.</p>
          </div>
          {content.logoUrl && (
            <div className="w-16 h-16 border-2 border-slate-200 rounded-lg overflow-hidden bg-white shrink-0 shadow-sm">
              <img src={content.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Texto del Logo (Alternativo)</label>
        <input
          type="text"
          value={content.logoText}
          onChange={(e) => onChange('logoText', '', e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono Principal</label>
        <input
          type="text"
          value={content.contact.phone}
          onChange={(e) => onChange('contact', 'phone', e.target.value)}
          className={inputStyles}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
        <input
          type="text"
          value={content.contact.email}
          onChange={(e) => onChange('contact', 'email', e.target.value)}
          className={inputStyles}
        />
      </div>
    </div>
  );
};

export default GeneralTab;
