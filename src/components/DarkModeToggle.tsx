/**
 * DarkModeToggle - Componente para cambiar entre modo claro y oscuro
 */

import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'terraVivaDarkMode';

const DarkModeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(false);

    // Inicializar desde localStorage o preferencia del sistema
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
            setIsDark(saved === 'true');
        } else {
            // Verificar preferencia del sistema
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(prefersDark);
        }
    }, []);

    // Aplicar clase al HTML
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem(STORAGE_KEY, String(isDark));
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className={`
        relative w-14 h-8 rounded-full transition-all duration-300 p-1
        ${isDark
                    ? 'bg-slate-700 shadow-inner'
                    : 'bg-amber-100 shadow-inner'
                }
      `}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
            {/* Track icons */}
            <div className="absolute inset-0 flex items-center justify-between px-2">
                <Sun
                    size={14}
                    className={`transition-opacity ${isDark ? 'opacity-30' : 'opacity-60 text-amber-600'}`}
                />
                <Moon
                    size={14}
                    className={`transition-opacity ${isDark ? 'opacity-60 text-blue-300' : 'opacity-30'}`}
                />
            </div>

            {/* Toggle ball */}
            <div
                className={`
          w-6 h-6 rounded-full shadow-md transition-all duration-300
          flex items-center justify-center
          ${isDark
                        ? 'translate-x-6 bg-slate-900'
                        : 'translate-x-0 bg-white'
                    }
        `}
            >
                {isDark ? (
                    <Moon size={12} className="text-blue-300" />
                ) : (
                    <Sun size={12} className="text-amber-500" />
                )}
            </div>
        </button>
    );
};

export default DarkModeToggle;
