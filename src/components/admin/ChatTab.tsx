/**
 * ChatTab - Configuración del asistente de IA
 */

import React, { useState } from 'react';
import { SiteContent } from '../../types';
import { Bot, Lock, Eye, EyeOff } from 'lucide-react';

interface ChatTabProps {
  content: SiteContent;
  onChange: (section: keyof SiteContent, key: string, value: any) => void;
}

const ChatTab: React.FC<ChatTabProps> = ({ content, onChange }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  
  const inputStyles = "w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl mb-6">
        <h3 className="font-bold text-emerald-800 text-lg flex items-center gap-2">
          <Bot size={20} /> Configuración del Asistente Virtual
        </h3>
        <p className="text-emerald-700 text-sm mt-1">
          Personaliza el nombre, el saludo y la clave de acceso de tu Inteligencia Artificial.
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Bot</label>
        <input
          type="text"
          value={content.chatConfig.botName}
          onChange={(e) => onChange('chatConfig', 'botName', e.target.value)}
          className={inputStyles}
          placeholder="Ej: TerraBot"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Mensaje de Bienvenida</label>
        <textarea
          rows={2}
          value={content.chatConfig.welcomeMessage}
          onChange={(e) => onChange('chatConfig', 'welcomeMessage', e.target.value)}
          className={inputStyles}
          placeholder="Ej: Hola, ¿en qué puedo ayudarte hoy?"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Instrucciones del Sistema (Prompt)</label>
        <p className="text-xs text-slate-500 mb-2">Define cómo debe comportarse el bot y qué información de la empresa debe saber.</p>
        <textarea
          rows={6}
          value={content.chatConfig.systemInstruction}
          onChange={(e) => onChange('chatConfig', 'systemInstruction', e.target.value)}
          className={`${inputStyles} font-mono text-sm`}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
          <span>Gemini API Key</span>
          <span className="text-xs font-normal text-amber-600 flex items-center gap-1"><Lock size={12} /> Encriptado</span>
        </label>
        <div className="relative">
          <input
            type={showApiKey ? "text" : "password"}
            value={content.chatConfig.apiKey}
            onChange={(e) => onChange('chatConfig', 'apiKey', e.target.value)}
            className={`${inputStyles} pr-12 font-mono`}
            placeholder="AIzaSy..."
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
          >
            {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">La clave se guarda localmente en el navegador del administrador.</p>
      </div>
    </div>
  );
};

export default ChatTab;
