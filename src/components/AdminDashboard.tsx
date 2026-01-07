/**
 * AdminDashboard - Panel de administración optimizado
 * Código modularizado en componentes separados
 * Con detección de cambios no guardados y advertencia al salir
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SiteContent, Project, ThemeConfig } from '../types';
import { 
  Save, LogOut, ArrowLeft, Layout, Sparkles, Palette, FileText, Bot, 
  BarChart3, Wrench, FolderOpen, MessageSquare, Edit2,
  Cloud, CloudOff, RefreshCw, ChevronLeft, ChevronRight, Menu, X,
  AlertTriangle
} from 'lucide-react';
import AnalyticsDashboard from './AnalyticsDashboard';
import DevBadge from './DevBadge';
import DevTools from './DevTools';
import ImageGallery from './ImageGallery';
import TestimonialsManager from './TestimonialsManager';
import SectionsEditor from './SectionsEditor';
import { GeneralTab, ChatTab, ProjectsTab, LegalTab, MarketingTab } from './admin';
import { db } from '../services/storage';
import { isSupabaseConfigured, testConnection } from '../services/supabase';

type TabId = 'analytics' | 'sections' | 'general' | 'marketing' | 'projects' | 'gallery' | 'testimonials' | 'legal' | 'chat' | 'devtools';

interface AdminDashboardProps {
  content: SiteContent;
  projects: Project[];
  onUpdateContent: (newContent: SiteContent) => void;
  onUpdateProjects: (newProjects: Project[]) => void;
  onLogout: () => void;
  themes: ThemeConfig[];
}

// Configuración de navegación
const NAV_ITEMS = [
  { id: 'analytics' as TabId, icon: BarChart3, label: 'Dashboard', color: 'from-blue-600 to-purple-600' },
  { id: 'sections' as TabId, icon: Layout, label: 'Secciones', color: 'from-orange-500 to-red-500' },
  { id: 'general' as TabId, icon: Palette, label: 'General', color: 'bg-blue-600' },
  { id: 'marketing' as TabId, icon: Sparkles, label: 'Marketing', color: 'bg-purple-600' },
  { id: 'chat' as TabId, icon: Bot, label: 'Chat IA', color: 'bg-emerald-600' },
  { id: 'projects' as TabId, icon: Edit2, label: 'Proyectos', color: 'bg-blue-600' },
  { id: 'gallery' as TabId, icon: FolderOpen, label: 'Galería', color: 'bg-amber-600' },
  { id: 'testimonials' as TabId, icon: MessageSquare, label: 'Testimonios', color: 'bg-cyan-600' },
  { id: 'legal' as TabId, icon: FileText, label: 'Legales', color: 'bg-blue-600' },
];

const TAB_TITLES: Record<TabId, string> = {
  analytics: '📊 Dashboard',
  sections: '🧩 Secciones',
  general: '⚙️ General',
  marketing: '✨ Marketing',
  chat: '🤖 Chat IA',
  projects: '🏠 Proyectos',
  gallery: '🖼️ Galería',
  testimonials: '💬 Testimonios',
  legal: '📋 Legales',
  devtools: '🛠️ DevTools',
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  content,
  projects,
  onUpdateContent,
  onUpdateProjects,
  onLogout,
  themes
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('analytics');
  const [localContent, setLocalContent] = useState<SiteContent>(content);
  const [localProjects, setLocalProjects] = useState<Project[]>(projects);
  const [isSaved, setIsSaved] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Estado para cambios no guardados y modal de confirmación
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const initialContentRef = useRef<string>(JSON.stringify(content));
  const initialProjectsRef = useRef<string>(JSON.stringify(projects));

  // Detectar cambios no guardados
  useEffect(() => {
    const currentContent = JSON.stringify(localContent);
    const currentProjects = JSON.stringify(localProjects);
    const hasChanges = currentContent !== initialContentRef.current || 
                       currentProjects !== initialProjectsRef.current;
    setHasUnsavedChanges(hasChanges);
  }, [localContent, localProjects]);

  // Prevenir cierre accidental del navegador con cambios pendientes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Manejador de logout con verificación de cambios
  const handleLogoutClick = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowExitModal(true);
    } else {
      onLogout();
    }
  }, [hasUnsavedChanges, onLogout]);

  // Guardar y salir
  const handleSaveAndExit = async () => {
    await handleSave();
    setShowExitModal(false);
    onLogout();
  };

  // Salir sin guardar
  const handleExitWithoutSave = () => {
    setShowExitModal(false);
    onLogout();
  };

  // Verificar conexión a Supabase
  useEffect(() => {
    const checkConnection = async () => {
      if (!isSupabaseConfigured()) {
        setCloudStatus('disconnected');
        return;
      }
      const result = await testConnection();
      setCloudStatus(result.connected ? 'connected' : 'error');
    };
    checkConnection();
  }, []);

  // Sincronizar desde la nube
  const handleForceSync = async () => {
    setCloudStatus('checking');
    try {
      await db.refreshFromCloud();
      const newContent = await db.getContentAsync(content);
      const newProjects = await db.getProjectsAsync(projects);
      setLocalContent(newContent);
      setLocalProjects(newProjects);
      onUpdateContent(newContent);
      onUpdateProjects(newProjects);
      setCloudStatus('connected');
      alert('✅ Datos sincronizados desde Supabase');
    } catch {
      setCloudStatus('error');
    }
  };

  // Manejador de cambios de contenido
  const handleContentChange = (section: keyof SiteContent, key: string, value: any) => {
    if (['hero', 'about', 'contact', 'socials', 'promotion', 'legal', 'postSale', 'chatConfig', 'customColors'].includes(section)) {
      setLocalContent(prev => ({
        ...prev,
        [section]: { ...(prev[section] as any), [key]: value }
      }));
    } else {
      setLocalContent(prev => ({ ...prev, [section]: value }));
    }
    setIsSaved(false);
  };

  // Manejador de proyectos
  const handleProjectsUpdate = (newProjects: Project[]) => {
    setLocalProjects(newProjects);
    setIsSaved(false);
  };

  // Guardar cambios
  const handleSave = async () => {
    const cleanedProjects = localProjects.map(p => ({
      ...p,
      gallery: p.gallery?.filter(url => url.trim() !== '') || []
    }));
    
    setLocalProjects(cleanedProjects);
    await db.saveContent(localContent);
    await db.saveProjects(cleanedProjects);
    
    onUpdateContent(localContent);
    onUpdateProjects(cleanedProjects);

    // Actualizar referencias iniciales después de guardar
    initialContentRef.current = JSON.stringify(localContent);
    initialProjectsRef.current = JSON.stringify(cleanedProjects);
    setHasUnsavedChanges(false);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Renderizar contenido del tab activo
  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard projects={localProjects} />;
      
      case 'sections':
        return (
          <SectionsEditor 
            sections={localContent.sections || []}
            onUpdate={(sections) => {
              setLocalContent({ ...localContent, sections });
              setIsSaved(false);
            }}
          />
        );
      
      case 'general':
        return <GeneralTab content={localContent} onChange={handleContentChange} />;
      
      case 'chat':
        return <ChatTab content={localContent} onChange={handleContentChange} />;
      
      case 'marketing':
        return (
          <MarketingTab 
            content={localContent} 
            themes={themes} 
            onChange={handleContentChange}
            setContent={setLocalContent}
          />
        );
      
      case 'projects':
        return <ProjectsTab projects={localProjects} onUpdate={handleProjectsUpdate} />;
      
      case 'legal':
        return <LegalTab content={localContent} onChange={handleContentChange} />;
      
      case 'gallery':
        return <ImageGallery />;
      
      case 'testimonials':
        return <TestimonialsManager />;
      
      case 'devtools':
        return (
          <DevTools
            projects={localProjects}
            content={localContent}
            onImportData={(data) => {
              if (data.projects) {
                setLocalProjects(data.projects);
                setIsSaved(false);
              }
              if (data.content) {
                setLocalContent(data.content);
                setIsSaved(false);
              }
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans relative light" style={{ colorScheme: 'light' }}>
      {/* Modal de Advertencia al Salir */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Cambios sin guardar</h3>
                <p className="text-sm text-slate-500">Tienes modificaciones pendientes</p>
              </div>
            </div>
            
            <p className="text-slate-600 mb-6">
              Has realizado cambios que no se han guardado. ¿Qué deseas hacer?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveAndExit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Save size={18} />
                Guardar y Salir
              </button>
              <button
                onClick={handleExitWithoutSave}
                className="flex-1 px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-semibold hover:bg-red-100 transition-all"
              >
                Salir sin Guardar
              </button>
            </div>
            
            <button
              onClick={() => setShowExitModal(false)}
              className="w-full mt-3 px-4 py-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarCollapsed ? 'w-20' : 'w-64'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-slate-900 text-white flex flex-col fixed h-full z-40 
        transition-all duration-300 ease-in-out overflow-hidden
      `}>
        {/* Header */}
        <div className={`p-4 border-b border-slate-800 ${sidebarCollapsed ? 'px-2' : 'p-6'}`}>
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Terra Viva
                </h2>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
          
          {/* Cloud Status */}
          {!sidebarCollapsed ? (
            <div className={`mt-3 flex items-center justify-between gap-2 text-xs px-2 py-1.5 rounded ${
              cloudStatus === 'connected' ? 'bg-green-900/50 text-green-400' :
              cloudStatus === 'checking' ? 'bg-yellow-900/50 text-yellow-400' :
              cloudStatus === 'error' ? 'bg-red-900/50 text-red-400' :
              'bg-slate-700 text-slate-400'
            }`}>
              <span className="flex items-center gap-1">
                {cloudStatus === 'connected' && <><Cloud size={14} /> Supabase</>}
                {cloudStatus === 'checking' && <><RefreshCw size={14} className="animate-spin" /> Verificando</>}
                {cloudStatus === 'error' && <><CloudOff size={14} /> Error</>}
                {cloudStatus === 'disconnected' && <><CloudOff size={14} /> Local</>}
              </span>
              {cloudStatus === 'connected' && (
                <button onClick={handleForceSync} className="hover:bg-green-800 p-1 rounded">
                  <RefreshCw size={12} />
                </button>
              )}
            </div>
          ) : (
            <div className={`mt-2 flex justify-center p-1.5 rounded ${
              cloudStatus === 'connected' ? 'text-green-400' : 'text-slate-400'
            }`}>
              {cloudStatus === 'connected' ? <Cloud size={18} /> : <CloudOff size={18} />}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${
                activeTab === item.id 
                  ? `${item.color.includes('from-') ? 'bg-gradient-to-r ' + item.color : item.color} shadow-lg text-white` 
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon size={18} />
              {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
            </button>
          ))}

          <div className="border-t border-slate-700 my-3" />
          {!sidebarCollapsed && (
            <p className="text-xs text-slate-500 uppercase tracking-wider px-3 mb-2">Avanzado</p>
          )}

          <button
            onClick={() => { setActiveTab('devtools'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${
              activeTab === 'devtools' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg text-white' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
          >
            <Wrench size={18} />
            {!sidebarCollapsed && <span className="text-sm">DevTools</span>}
          </button>
        </nav>

        {/* Footer */}
        <div className={`p-3 border-t border-slate-800 ${sidebarCollapsed ? 'px-2' : 'p-4'}`}>
          <button
            onClick={handleLogoutClick}
            className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 text-red-400 hover:bg-slate-800 transition-colors ${
              sidebarCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span className="text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} flex-1 p-4 lg:p-8 transition-all duration-300 ml-0 pt-16 lg:pt-0`}>
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl shadow-lg border border-slate-700/50">
          <div className="pl-10 lg:pl-0">
            <h1 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
              {TAB_TITLES[activeTab]}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Panel de Administración • Terra Viva
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            {/* Indicador de cambios pendientes */}
            {hasUnsavedChanges && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-medium">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                Sin guardar
              </div>
            )}
            <button
              onClick={handleLogoutClick}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white/10 backdrop-blur text-white border border-white/20 rounded-xl hover:bg-white/20 flex items-center justify-center gap-2 text-sm font-medium transition-all"
            >
              <ArrowLeft size={16} /> Ver Sitio
            </button>
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges && !isSaved}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm ${
                isSaved 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                  : hasUnsavedChanges
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 hover:shadow-xl hover:scale-[1.02]'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 opacity-60 cursor-not-allowed'
              }`}
            >
              <Save size={16} /> {isSaved ? '✓ Guardado' : hasUnsavedChanges ? 'Guardar *' : 'Sin cambios'}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-8 min-h-[500px] relative overflow-x-auto">
          <DevBadge name="AdminDashboard" description={`Tab: ${activeTab}`} />
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
