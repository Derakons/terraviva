/**
 * LegalTab - Gestión de contenido legal y post-venta
 */

import React from 'react';
import { SiteContent } from '../../types';
import RichTextEditor from '../RichTextEditor';

interface LegalTabProps {
  content: SiteContent;
  onChange: (section: keyof SiteContent, key: string, value: any) => void;
}

const LegalTab: React.FC<LegalTabProps> = ({ content, onChange }) => {
  const inputStyles = "w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";
  
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-800">📋 Documentos Legales</h3>
        <p className="text-sm text-blue-600">Gestiona la información post-venta y documentos legales.</p>
      </div>
      
      {/* Post-Sales Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Información Post-Venta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Título Página</label>
            <input
              type="text"
              value={content.postSale.title}
              onChange={(e) => onChange('postSale', 'title', e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono Emergencia</label>
            <input
              type="text"
              value={content.postSale.emergencyPhone}
              onChange={(e) => onChange('postSale', 'emergencyPhone', e.target.value)}
              className={inputStyles}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Descripción</label>
            <textarea
              value={content.postSale.description}
              onChange={(e) => onChange('postSale', 'description', e.target.value)}
              className={inputStyles}
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Horario Atención</label>
            <input
              type="text"
              value={content.postSale.schedule}
              onChange={(e) => onChange('postSale', 'schedule', e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">URL Manual Propietario (PDF)</label>
            <input
              type="text"
              value={content.postSale.manualUrl}
              onChange={(e) => onChange('postSale', 'manualUrl', e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>
      </div>

      {/* Legal Texts with Rich Editor */}
      <div className="space-y-8">
        <RichTextEditor
          label="Términos y Condiciones"
          value={content.legal.termsAndConditions}
          onChange={(value) => onChange('legal', 'termsAndConditions', value)}
          placeholder="Escribe los términos y condiciones..."
        />

        <RichTextEditor
          label="Política de Privacidad"
          value={content.legal.privacyPolicy}
          onChange={(value) => onChange('legal', 'privacyPolicy', value)}
          placeholder="Escribe la política de privacidad..."
        />

        <RichTextEditor
          label="Canal de Denuncias"
          value={content.legal.whistleblowing}
          onChange={(value) => onChange('legal', 'whistleblowing', value)}
          placeholder="Escribe la información del canal de denuncias..."
        />
      </div>
    </div>
  );
};

export default LegalTab;
