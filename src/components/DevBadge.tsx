/**
 * DevBadge - Badge flotante pequeño para identificar componentes
 * Solo visible cuando DevMode está activo desde el Admin
 */

import React, { useEffect, useState } from 'react';

interface DevBadgeProps {
    name: string;
    description?: string;
}

// Función para verificar si el DevMode está activo
// Solo activo en desarrollo local, nunca en producción
export const isDevModeEnabled = (): boolean => {
    if (typeof window === 'undefined') return false;
    // Desactivar en producción automáticamente
    const isProduction = window.location.hostname !== 'localhost' && 
                         !window.location.hostname.includes('127.0.0.1');
    if (isProduction) return false;
    return localStorage.getItem('terraviva_dev_mode') === 'true';
};

// Función para activar/desactivar DevMode
export const setDevMode = (enabled: boolean): void => {
    localStorage.setItem('terraviva_dev_mode', enabled ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('devModeChanged', { detail: enabled }));
};

// Función para obtener configuración de desarrollo
export const getDevConfig = () => {
    return {
        devMode: isDevModeEnabled(),
        lastUpdated: localStorage.getItem('terraviva_last_update') || 'Nunca',
        storageUsed: JSON.stringify(localStorage).length,
        projectsCount: JSON.parse(localStorage.getItem('terraviva_projects') || '[]').length,
    };
};

const DevBadge: React.FC<DevBadgeProps> = ({ name, description }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setIsVisible(isDevModeEnabled());

        const handleDevModeChange = (e: CustomEvent) => {
            setIsVisible(e.detail as boolean);
        };

        window.addEventListener('devModeChanged', handleDevModeChange as EventListener);
        return () => {
            window.removeEventListener('devModeChanged', handleDevModeChange as EventListener);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className="absolute top-2 left-2 z-[100] group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badge pequeño */}
            <div className={`
        flex items-center gap-1.5 px-2 py-1 
        bg-purple-600/90 backdrop-blur-sm
        text-white text-[10px] font-mono font-bold
        rounded-md shadow-lg
        transition-all duration-200
        cursor-default
        ${isHovered ? 'bg-purple-700 scale-105' : ''}
      `}>
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span>{name}</span>
            </div>

            {/* Tooltip con descripción (aparece al hover) */}
            {description && isHovered && (
                <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-md shadow-lg whitespace-nowrap z-[101]">
                    {description}
                </div>
            )}
        </div>
    );
};

export default DevBadge;
