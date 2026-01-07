/**
 * DevTools - Panel de Herramientas de Desarrollo
 * Controla DevMode, exporta datos, limpia caché, etc.
 */

import React, { useState, useEffect } from 'react';
import {
    Wrench,
    ToggleLeft,
    ToggleRight,
    Download,
    Upload,
    Trash2,
    RefreshCw,
    Database,
    HardDrive,
    Code,
    Eye,
    EyeOff,
    AlertTriangle,
    CheckCircle,
    Copy,
    ExternalLink
} from 'lucide-react';
import { isDevModeEnabled, setDevMode } from './DevBadge';
import { Project, SiteContent } from '../types';

interface DevToolsProps {
    projects: Project[];
    content: SiteContent;
    onImportData?: (data: { projects?: Project[], content?: SiteContent }) => void;
}

const DevTools: React.FC<DevToolsProps> = ({ projects, content, onImportData }) => {
    const [devMode, setDevModeState] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importText, setImportText] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [storageInfo, setStorageInfo] = useState({ used: 0, projects: 0 });

    useEffect(() => {
        setDevModeState(isDevModeEnabled());
        updateStorageInfo();
    }, []);

    const updateStorageInfo = () => {
        const used = JSON.stringify(localStorage).length;
        const projectsData = localStorage.getItem('terraviva_projects');
        const projectsCount = projectsData ? JSON.parse(projectsData).length : 0;
        setStorageInfo({ used, projects: projectsCount });
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleToggleDevMode = () => {
        const newValue = !devMode;
        setDevMode(newValue);
        setDevModeState(newValue);
        showNotification('success', `Modo Desarrollo ${newValue ? 'ACTIVADO' : 'DESACTIVADO'}`);
    };

    const handleExportData = () => {
        const exportData = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            projects,
            content
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `terraviva_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showNotification('success', 'Datos exportados correctamente');
    };

    const handleImportData = () => {
        try {
            const data = JSON.parse(importText);
            if (data.projects || data.content) {
                if (onImportData) {
                    onImportData(data);
                }
                setShowImportModal(false);
                setImportText('');
                showNotification('success', 'Datos importados correctamente');
            } else {
                showNotification('error', 'Formato de datos inválido');
            }
        } catch {
            showNotification('error', 'Error al parsear JSON');
        }
    };

    const handleClearCache = () => {
        if (confirm('¿Estás seguro? Esto eliminará todos los datos guardados localmente.')) {
            const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith('terraviva_'));
            keysToRemove.forEach(key => localStorage.removeItem(key));
            updateStorageInfo();
            showNotification('success', `${keysToRemove.length} items eliminados del caché`);
        }
    };

    const handleCopyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        showNotification('success', 'Copiado al portapapeles');
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <div className="space-y-8">
            {/* Notificación */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right ${notification.type === 'success'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <Wrench size={28} />
                    <h2 className="text-2xl font-bold">Herramientas de Desarrollo</h2>
                </div>
                <p className="text-purple-200">Panel de control para desarrolladores y administradores avanzados.</p>
            </div>

            {/* Dev Mode Toggle */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${devMode ? 'bg-purple-100' : 'bg-slate-100'}`}>
                            {devMode ? <Eye className="text-purple-600" size={24} /> : <EyeOff className="text-slate-400" size={24} />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Modo Desarrollo</h3>
                            <p className="text-slate-500 text-sm">Muestra badges con nombres de componentes encima de cada sección</p>
                        </div>
                    </div>
                    <button
                        onClick={handleToggleDevMode}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${devMode
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                    >
                        {devMode ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        {devMode ? 'Activado' : 'Desactivado'}
                    </button>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Export */}
                <button
                    onClick={handleExportData}
                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-left group"
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Download className="text-blue-600" size={24} />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1">Exportar Datos</h4>
                    <p className="text-slate-500 text-sm">Descargar backup JSON</p>
                </button>

                {/* Import */}
                <button
                    onClick={() => setShowImportModal(true)}
                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-green-300 hover:shadow-md transition-all text-left group"
                >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="text-green-600" size={24} />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1">Importar Datos</h4>
                    <p className="text-slate-500 text-sm">Restaurar desde backup</p>
                </button>

                {/* Clear Cache */}
                <button
                    onClick={handleClearCache}
                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all text-left group"
                >
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Trash2 className="text-red-600" size={24} />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1">Limpiar Caché</h4>
                    <p className="text-slate-500 text-sm">Borrar datos locales</p>
                </button>

                {/* Refresh */}
                <button
                    onClick={() => window.location.reload()}
                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all text-left group"
                >
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <RefreshCw className="text-orange-600" size={24} />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1">Recargar App</h4>
                    <p className="text-slate-500 text-sm">Refrescar página</p>
                </button>
            </div>

            {/* Storage Info */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Database size={20} className="text-indigo-600" />
                    Información del Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                            <HardDrive size={16} />
                            LocalStorage Usado
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{formatBytes(storageInfo.used)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                            <Database size={16} />
                            Propiedades
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{projects.length}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                            <Code size={16} />
                            Versión
                        </div>
                        <p className="text-2xl font-bold text-slate-800">1.0.0</p>
                    </div>
                </div>
            </div>

            {/* Links útiles */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ExternalLink size={20} className="text-blue-600" />
                    Enlaces Útiles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                        href="https://vercel.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">▲</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Vercel Dashboard</p>
                            <p className="text-slate-500 text-sm">Gestionar despliegues</p>
                        </div>
                    </a>
                    <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">S</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Supabase Dashboard</p>
                            <p className="text-slate-500 text-sm">Base de datos</p>
                        </div>
                    </a>
                    <button
                        onClick={() => handleCopyToClipboard(window.location.origin)}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left"
                    >
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Copy className="text-white" size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Copiar URL del Sitio</p>
                            <p className="text-slate-500 text-sm truncate max-w-[200px]">{window.location.origin}</p>
                        </div>
                    </button>
                    <a
                        href="https://analytics.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">G</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Google Analytics</p>
                            <p className="text-slate-500 text-sm">Métricas de visitas</p>
                        </div>
                    </a>
                </div>
            </div>

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Importar Datos</h3>
                        <p className="text-slate-500 text-sm mb-4">Pega el contenido del archivo JSON exportado:</p>
                        <textarea
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            className="w-full h-48 p-4 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder='{"projects": [...], "content": {...}}'
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleImportData}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                Importar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevTools;
