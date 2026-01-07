/**
 * SectionsEditor - Editor visual de secciones del sitio
 * Diseño moderno con drag & drop visual y edición inline
 */

import React, { useState } from 'react';
import { SectionConfig, SectionType } from '../types';
import { 
  GripVertical, ChevronUp,
  Image, Type, Palette, Layout, Eye, EyeOff, Settings, 
  ArrowUp, ArrowDown, Sparkles, Home, Building2, Wrench, MessageSquare, Phone
} from 'lucide-react';
import { db } from '../services/storage';

interface SectionsEditorProps {
  sections: SectionConfig[];
  onUpdate: (sections: SectionConfig[]) => void;
}

const LAYOUT_OPTIONS = [
  { id: 'default', name: 'Estándar', icon: '▣' },
  { id: 'centered', name: 'Centrado', icon: '◉' },
  { id: 'left', name: 'Izquierda', icon: '◧' },
  { id: 'right', name: 'Derecha', icon: '◨' },
  { id: 'full-width', name: 'Full', icon: '▬' },
];

const SECTION_CONFIG: Record<SectionType, { icon: React.ReactNode; color: string; gradient: string; label: string }> = {
  hero: { 
    icon: <Home size={20} />, 
    color: 'text-amber-400', 
    gradient: 'from-amber-500 to-orange-500',
    label: 'Portada Principal'
  },
  projects: { 
    icon: <Building2 size={20} />, 
    color: 'text-blue-400', 
    gradient: 'from-blue-500 to-indigo-500',
    label: 'Catálogo de Proyectos'
  },
  services: { 
    icon: <Wrench size={20} />, 
    color: 'text-emerald-400', 
    gradient: 'from-emerald-500 to-teal-500',
    label: 'Nuestros Servicios'
  },
  testimonials: { 
    icon: <MessageSquare size={20} />, 
    color: 'text-purple-400', 
    gradient: 'from-purple-500 to-pink-500',
    label: 'Testimonios de Clientes'
  },
  contact: { 
    icon: <Phone size={20} />, 
    color: 'text-rose-400', 
    gradient: 'from-rose-500 to-red-500',
    label: 'Formulario de Contacto'
  },
};

const SectionsEditor: React.FC<SectionsEditorProps> = ({ sections, onUpdate }) => {
  const [expandedSection, setExpandedSection] = useState<SectionType | null>(null);
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const updateSection = (id: SectionType, updates: Partial<SectionConfig>) => {
    const newSections = sections.map(s => 
      s.id === id ? { ...s, ...updates } : s
    );
    onUpdate(newSections);
  };

  const moveSection = (id: SectionType, direction: 'up' | 'down') => {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const currentIndex = sorted.findIndex(s => s.id === id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= sorted.length) return;
    
    const current = sorted[currentIndex];
    const target = sorted[targetIndex];
    
    const newSections = sections.map(s => {
      if (s.id === current.id) return { ...s, order: target.order };
      if (s.id === target.id) return { ...s, order: current.order };
      return s;
    });
    
    onUpdate(newSections);
  };

  const toggleSection = (id: SectionType) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Gestor de Secciones</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Arrastra, ordena y personaliza cada sección de tu sitio</p>
            </div>
          </div>
          
          {/* Stats rápidos */}
          <div className="flex gap-4 mt-4">
            <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
              <span className="text-green-600 dark:text-green-400 font-semibold">{sections.filter(s => s.enabled).length}</span>
              <span className="text-green-600/70 dark:text-green-400/70 text-sm ml-1">activas</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">{sections.filter(s => !s.enabled).length}</span>
              <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">ocultas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de secciones */}
      <div className="space-y-3">
        {sortedSections.map((section, index) => {
          const config = SECTION_CONFIG[section.id];
          const analytics = db.getSectionAnalytics()[section.id] || { views: 0, clicks: 0, timeSpent: 0 };
          const isExpanded = expandedSection === section.id;

          return (
            <div
              key={section.id}
              className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                section.enabled 
                  ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600' 
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-80'
              } ${isExpanded ? 'ring-2 ring-orange-500/50' : ''}`}
            >
              {/* Barra de color superior */}
              <div className={`h-1 bg-gradient-to-r ${config.gradient} ${!section.enabled ? 'opacity-30' : ''}`} />
              
              {/* Header de sección */}
              <div className="flex items-center gap-4 p-4">
                {/* Drag handle + Orden */}
                <div className="flex items-center gap-2">
                  <div className="cursor-move text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                    <GripVertical size={18} />
                  </div>
                  <div className={`w-7 h-7 bg-gradient-to-br ${config.gradient} text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-lg`}>
                    {section.order}
                  </div>
                </div>

                {/* Icono y nombre */}
                <div 
                  className="flex-1 cursor-pointer flex items-center gap-3"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-700/50 ${config.color}`}>
                    {config.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      {section.name}
                      {!section.enabled && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded uppercase">
                          Oculta
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{config.label}</p>
                  </div>
                </div>

                {/* Analytics mini */}
                <div className="hidden sm:flex items-center gap-3 text-xs">
                  <div className="text-center px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/30">
                    <div className="font-bold text-blue-500 dark:text-blue-400">{analytics.views}</div>
                    <div className="text-slate-400 dark:text-slate-500 text-[10px]">vistas</div>
                  </div>
                  <div className="text-center px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/30">
                    <div className="font-bold text-green-500 dark:text-green-400">{analytics.clicks}</div>
                    <div className="text-slate-400 dark:text-slate-500 text-[10px]">clicks</div>
                  </div>
                </div>

                {/* Controles */}
                <div className="flex items-center gap-1">
                  {/* Mover */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                      title="Subir"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={index === sortedSections.length - 1}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                      title="Bajar"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Toggle visibilidad */}
                  <button
                    onClick={() => updateSection(section.id, { enabled: !section.enabled })}
                    className={`p-2 rounded-lg transition-all ${
                      section.enabled 
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/30' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
                    }`}
                    title={section.enabled ? 'Visible' : 'Oculta'}
                  >
                    {section.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>

                  {/* Expandir/Colapsar */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`p-2 rounded-lg transition-all ${
                      isExpanded 
                        ? 'bg-orange-500/20 text-orange-500 dark:text-orange-400' 
                        : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white'
                    }`}
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <Settings size={18} />}
                  </button>
                </div>
              </div>

              {/* Panel expandido - Editor */}
              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50">
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Columna 1: Contenido */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium mb-3">
                          <Type size={16} className="text-blue-500 dark:text-blue-400" />
                          <span>Contenido</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                              Título
                            </label>
                            <input
                              type="text"
                              value={section.title || ''}
                              onChange={(e) => updateSection(section.id, { title: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all"
                              placeholder="Título de la sección"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                              Subtítulo
                            </label>
                            <input
                              type="text"
                              value={section.subtitle || ''}
                              onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all"
                              placeholder="Subtítulo descriptivo"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                              Descripción
                            </label>
                            <textarea
                              value={section.description || ''}
                              onChange={(e) => updateSection(section.id, { description: e.target.value })}
                              rows={3}
                              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all resize-none"
                              placeholder="Descripción de la sección..."
                            />
                          </div>

                          {/* CTA solo para hero */}
                          {section.id === 'hero' && (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                                  Texto del botón
                                </label>
                                <input
                                  type="text"
                                  value={section.ctaText || ''}
                                  onChange={(e) => updateSection(section.id, { ctaText: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all"
                                  placeholder="Ver Proyectos"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                                  Enlace
                                </label>
                                <input
                                  type="text"
                                  value={section.ctaLink || ''}
                                  onChange={(e) => updateSection(section.id, { ctaLink: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all"
                                  placeholder="#proyectos"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Columna 2: Estilos */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium mb-3">
                          <Palette size={16} className="text-purple-500 dark:text-purple-400" />
                          <span>Estilos</span>
                        </div>

                        <div className="space-y-3">
                          {/* Imagen de fondo */}
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                              <Image size={12} className="inline mr-1" /> Imagen de fondo
                            </label>
                            <input
                              type="text"
                              value={section.backgroundImage || ''}
                              onChange={(e) => updateSection(section.id, { backgroundImage: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all"
                              placeholder="https://..."
                            />
                            {section.backgroundImage && (
                              <div className="mt-2 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                <img 
                                  src={section.backgroundImage} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                />
                              </div>
                            )}
                          </div>

                          {/* Colores */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                                Color fondo
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={section.backgroundColor || '#ffffff'}
                                  onChange={(e) => updateSection(section.id, { backgroundColor: e.target.value })}
                                  className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                />
                                <input
                                  type="text"
                                  value={section.backgroundColor || ''}
                                  onChange={(e) => updateSection(section.id, { backgroundColor: e.target.value })}
                                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                                Color texto
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={section.textColor || '#1e293b'}
                                  onChange={(e) => updateSection(section.id, { textColor: e.target.value })}
                                  className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                />
                                <input
                                  type="text"
                                  value={section.textColor || ''}
                                  onChange={(e) => updateSection(section.id, { textColor: e.target.value })}
                                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                  placeholder="#1e293b"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Layout */}
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                              <Layout size={12} className="inline mr-1" /> Diseño
                            </label>
                            <div className="flex gap-1.5">
                              {LAYOUT_OPTIONS.map(layout => (
                                <button
                                  key={layout.id}
                                  onClick={() => updateSection(section.id, { layout: layout.id as any })}
                                  className={`flex-1 p-2 rounded-lg text-xs font-medium transition-all ${
                                    (section.layout || 'default') === layout.id
                                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                                      : 'bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white'
                                  }`}
                                  title={layout.name}
                                >
                                  <span className="text-base">{layout.icon}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Separador */}
                          <label className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                            <input
                              type="checkbox"
                              checked={section.showDivider || false}
                              onChange={(e) => updateSection(section.id, { showDivider: e.target.checked })}
                              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-orange-500 focus:ring-orange-500/50"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">Mostrar separador inferior</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Vista previa mini */}
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium mb-3">
                        <Eye size={16} className="text-green-500 dark:text-green-400" />
                        <span>Vista previa</span>
                      </div>
                      <div 
                        className="rounded-xl p-6 text-center overflow-hidden"
                        style={{
                          backgroundColor: section.backgroundColor || '#f8fafc',
                          color: section.textColor || '#1e293b',
                          backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className={section.backgroundImage ? 'bg-black/50 backdrop-blur-sm p-4 rounded-lg inline-block' : ''}>
                          <h3 
                            className="text-xl font-bold mb-1" 
                            style={{ color: section.textColor || (section.backgroundImage ? '#fff' : '#1e293b') }}
                          >
                            {section.title || 'Sin título'}
                          </h3>
                          <p 
                            className="text-sm opacity-80" 
                            style={{ color: section.textColor || (section.backgroundImage ? '#fff' : '#64748b') }}
                          >
                            {section.subtitle || 'Sin subtítulo'}
                          </p>
                          {section.ctaText && (
                            <button className="mt-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium shadow-lg">
                              {section.ctaText}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tip */}
      <div className="flex items-start gap-3 p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl">
        <div className="p-1.5 bg-blue-500/10 rounded-lg">
          <Sparkles size={16} className="text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="text-blue-600 dark:text-blue-400 font-medium">Tip:</span> Los cambios se reflejan en el sitio después de guardar. 
            El Header y Footer se configuran en la pestaña "General".
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionsEditor;
