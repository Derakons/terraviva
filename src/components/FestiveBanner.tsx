/**
 * FestiveBanner - Notificación elegante con mensajes festivos
 * Incluye easter eggs para los desarrolladores
 */

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Cake, Heart } from 'lucide-react';

interface FestiveBannerProps {
    companyName?: string;
}

interface FestiveMessage {
    title: string;
    subtitle: string;
    emoji: string;
    gradient: string;
    isEasterEgg?: boolean;
    developerName?: string;
}

// Obtener mensaje festivo según la fecha
const getFestiveMessage = (companyName: string): FestiveMessage | null => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // 🎂 EASTER EGGS - Cumpleaños de desarrolladores
    // 1 de Enero - Robert Dante Prado Quispe
    if (month === 1 && day === 1) {
        return {
            title: `¡${companyName} te desea Feliz Año Nuevo! 🎆`,
            subtitle: '🎂 Y hoy celebramos el cumpleaños de nuestro desarrollador Robert Dante Prado Quispe. ¡Felicidades! 🎉',
            emoji: '🎂',
            gradient: 'from-amber-500 via-orange-500 to-red-500',
            isEasterEgg: true,
            developerName: 'Robert Dante Prado Quispe'
        };
    }

    // 27 de Septiembre - Yamilet Diana Zanabria Huaman
    if (month === 9 && day === 27) {
        return {
            title: `¡Hoy es un día especial! 🌟`,
            subtitle: '🎂 Celebramos el cumpleaños de nuestra desarrolladora Yamilet Diana Zanabria Huaman. ¡Felicidades! 💐',
            emoji: '🎂',
            gradient: 'from-pink-500 via-rose-500 to-purple-500',
            isEasterEgg: true,
            developerName: 'Yamilet Diana Zanabria Huaman'
        };
    }

    // 🎆 Año Nuevo (2-5 enero)
    if (month === 1 && day >= 2 && day <= 5) {
        return {
            title: `¡${companyName} te desea Feliz Año Nuevo!`,
            subtitle: 'Que este nuevo año esté lleno de logros y el hogar de tus sueños 🏠✨',
            emoji: '🎆',
            gradient: 'from-indigo-600 via-purple-600 to-pink-500'
        };
    }

    // 🎄 Navidad (20-31 diciembre)
    if (month === 12 && day >= 20) {
        return {
            title: `¡${companyName} te desea Feliz Navidad!`,
            subtitle: 'Que la magia de estas fiestas llene tu hogar de amor y alegría 🎄❤️',
            emoji: '🎄',
            gradient: 'from-green-600 via-green-500 to-red-500'
        };
    }

    // ❤️ San Valentín (12-14 febrero)
    if (month === 2 && day >= 12 && day <= 14) {
        return {
            title: `¡${companyName} celebra el amor!`,
            subtitle: 'Encuentra el hogar perfecto para compartir con quien amas 💕🏠',
            emoji: '❤️',
            gradient: 'from-red-500 via-pink-500 to-rose-400'
        };
    }

    // 💐 Día de la Madre (2do domingo de mayo, aprox 8-14)
    if (month === 5 && day >= 8 && day <= 14) {
        return {
            title: `¡${companyName} celebra a las madres!`,
            subtitle: 'Feliz Día de la Madre. El hogar es donde está mamá 💐❤️',
            emoji: '💐',
            gradient: 'from-pink-500 via-rose-400 to-fuchsia-500'
        };
    }

    // 👔 Día del Padre (3er domingo de junio, aprox 15-21)
    if (month === 6 && day >= 15 && day <= 21) {
        return {
            title: `¡${companyName} celebra a los padres!`,
            subtitle: 'Feliz Día del Padre. Construyendo hogares para familias felices 🏠👔',
            emoji: '👔',
            gradient: 'from-blue-600 via-blue-500 to-cyan-500'
        };
    }

    // ☀️ Inti Raymi (24 junio)
    if (month === 6 && day >= 22 && day <= 24) {
        return {
            title: `¡${companyName} celebra el Inti Raymi!`,
            subtitle: 'Honramos nuestras raíces ancestrales en la Fiesta del Sol ☀️🏔️',
            emoji: '☀️',
            gradient: 'from-yellow-500 via-orange-500 to-amber-600'
        };
    }

    // 🇵🇪 Fiestas Patrias (27-29 julio)
    if (month === 7 && day >= 27 && day <= 29) {
        return {
            title: `¡${companyName} celebra las Fiestas Patrias!`,
            subtitle: '¡Viva el Perú! Construyendo el sueño de la casa propia 🇵🇪🏠',
            emoji: '🇵🇪',
            gradient: 'from-red-600 via-white to-red-600'
        };
    }

    // 🎃 Halloween (30-31 octubre)
    if (month === 10 && day >= 30) {
        return {
            title: `¡${companyName} te desea Happy Halloween!`,
            subtitle: 'Encuentra tu próximo hogar... si te atreves 🎃👻',
            emoji: '🎃',
            gradient: 'from-orange-500 via-orange-600 to-purple-700'
        };
    }

    return null;
};

const FestiveBanner: React.FC<FestiveBannerProps> = ({ companyName = 'Terra Viva' }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [message, setMessage] = useState<FestiveMessage | null>(null);

    useEffect(() => {
        const festiveMessage = getFestiveMessage(companyName);
        setMessage(festiveMessage);

        // Verificar si ya se cerró hoy
        const closedToday = localStorage.getItem('festiveBannerClosed');
        if (closedToday) {
            const closedDate = new Date(closedToday);
            const today = new Date();
            if (closedDate.toDateString() === today.toDateString()) {
                setIsVisible(false);
            }
        }
    }, [companyName]);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('festiveBannerClosed', new Date().toISOString());
    };

    if (!message || !isVisible) return null;

    return (
        <div className="fixed top-24 right-4 z-50 max-w-sm animate-slide-in">
            <style>{`
                @keyframes slide-in {
                    0% { 
                        opacity: 0; 
                        transform: translateX(100px); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateX(0); 
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.4s ease-out forwards;
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                }
                .pulse-emoji {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
            `}</style>

            <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10 relative overflow-hidden">
                {/* Acento de color */}
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${message.gradient}`} />
                
                {/* Botón cerrar */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    aria-label="Cerrar"
                >
                    <X size={14} />
                </button>

                {/* Contenido */}
                <div className="flex items-center gap-3 pl-2">
                    <span className="pulse-emoji text-2xl">{message.emoji}</span>
                    <div className="flex-1 pr-4">
                        <p className="text-white font-semibold text-sm leading-tight">
                            {message.title}
                        </p>
                        <p className="text-white/60 text-xs mt-0.5 leading-snug">
                            {message.subtitle.length > 60 ? message.subtitle.slice(0, 60) + '...' : message.subtitle}
                        </p>
                        {message.isEasterEgg && (
                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 rounded-full">
                                <Cake size={10} className="text-amber-400" />
                                <span className="text-[10px] font-medium text-amber-300">
                                    🎂 {message.developerName?.split(' ')[0]}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FestiveBanner;
