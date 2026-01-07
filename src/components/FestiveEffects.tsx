/**
 * FestiveEffects - Animaciones festivas con emojis en los costados
 * No interfiere con el contenido principal de la página
 */

import React, { useEffect, useState, useMemo } from 'react';

interface FestiveEffectsProps {
    themeId?: string;
    enabled?: boolean;
}

// Configuración de emojis por festividad
const FESTIVE_EMOJIS: Record<string, { emojis: string[]; colors: string[] }> = {
    'navidad': {
        emojis: ['🎄', '⭐', '🎅', '🎁', '❄️', '🔔', '🦌', '🌟', '☃️', '🎿'],
        colors: ['#165B33', '#BB2528', '#FFD700']
    },
    'ano-nuevo': {
        emojis: ['🎆', '🎇', '✨', '🥂', '🎉', '🎊', '🌟', '💫', '🪩', '🎶'],
        colors: ['#FFD700', '#C0C0C0', '#1A1A2E']
    },
    'fiestas-patrias': {
        emojis: ['🇵🇪', '🎺', '🎭', '🌺', '🦙', '🏔️', '🌄', '🎊', '💃', '🥁'],
        colors: ['#D91023', '#FFFFFF', '#D91023']
    },
    'inti-raymi': {
        emojis: ['☀️', '🌞', '🌻', '🔥', '🌄', '🏔️', '🦙', '🌽', '🎭', '✨'],
        colors: ['#FFD700', '#FF8C00', '#CD6600']
    },
    'halloween': {
        emojis: ['🎃', '👻', '🦇', '🕷️', '💀', '🕸️', '🌙', '🔮', '🧛', '🧙'],
        colors: ['#FF6600', '#8B00FF', '#1A1A1A']
    },
    'dia-madre': {
        emojis: ['💐', '🌹', '💕', '🌸', '💝', '🌷', '🎀', '💗', '🌺', '✨'],
        colors: ['#FF69B4', '#FFB6C1', '#DB7093']
    },
    'semana-santa': {
        emojis: ['✝️', '🕊️', '🌿', '🌺', '🕯️', '📿', '🌸', '☁️', '🙏', '💜'],
        colors: ['#4A0E4E', '#E8D4A8', '#9370DB']
    },
    'san-valentin': {
        emojis: ['❤️', '💕', '💖', '💝', '💘', '🌹', '💑', '💌', '🥰', '✨'],
        colors: ['#FF1493', '#FF69B4', '#DC143C']
    }
};

// Obtener emojis por defecto según la fecha actual
const getAutoFestivity = (): string | null => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // Año Nuevo (25 dic - 5 ene)
    if ((month === 12 && day >= 25) || (month === 1 && day <= 5)) return 'ano-nuevo';
    // Navidad (15-24 dic)
    if (month === 12 && day >= 15 && day < 25) return 'navidad';
    // San Valentín (10-14 feb)
    if (month === 2 && day >= 10 && day <= 14) return 'san-valentin';
    // Semana Santa (variable, aprox marzo-abril)
    if ((month === 3 && day >= 20) || (month === 4 && day <= 15)) return 'semana-santa';
    // Día de la Madre (primera semana mayo)
    if (month === 5 && day >= 1 && day <= 12) return 'dia-madre';
    // Inti Raymi (21-24 junio)
    if (month === 6 && day >= 21 && day <= 24) return 'inti-raymi';
    // Fiestas Patrias (20 jul - 1 ago)
    if ((month === 7 && day >= 20) || (month === 8 && day === 1)) return 'fiestas-patrias';
    // Halloween (25 oct - 1 nov)
    if ((month === 10 && day >= 25) || (month === 11 && day === 1)) return 'halloween';

    return null;
};

interface FallingEmoji {
    id: number;
    emoji: string;
    left: number;
    delay: number;
    duration: number;
    size: number;
    side: 'left' | 'right';
}

const FestiveEffects: React.FC<FestiveEffectsProps> = ({ themeId, enabled = true }) => {
    const [emojis, setEmojis] = useState<FallingEmoji[]>([]);
    const [opacity, setOpacity] = useState(1);
    const [isVisible, setIsVisible] = useState(true);

    // Determinar qué festividad mostrar
    const festivity = useMemo(() => {
        if (themeId && FESTIVE_EMOJIS[themeId]) return themeId;
        return getAutoFestivity();
    }, [themeId]);

    useEffect(() => {
        if (!enabled || !festivity) return;

        const config = FESTIVE_EMOJIS[festivity];
        if (!config) return;

        // Generar emojis para ambos lados
        const generateEmojis = (): FallingEmoji[] => {
            const result: FallingEmoji[] = [];
            
            // 6 emojis por lado (12 total) - menos para ser más sutil
            for (let i = 0; i < 12; i++) {
                const side: 'left' | 'right' = i < 6 ? 'left' : 'right';
                const baseLeft = side === 'left' ? Math.random() * 10 : 90 + Math.random() * 10;
                
                result.push({
                    id: i,
                    emoji: config.emojis[Math.floor(Math.random() * config.emojis.length)],
                    left: baseLeft,
                    delay: Math.random() * 8,
                    duration: 8 + Math.random() * 6,
                    size: 14 + Math.random() * 10,
                    side
                });
            }
            return result;
        };

        setEmojis(generateEmojis());
        setOpacity(1);
        setIsVisible(true);

        // Fade out gradual después de 15 segundos
        const fadeTimer = setTimeout(() => {
            // Fade gradual de 5 segundos
            const fadeInterval = setInterval(() => {
                setOpacity(prev => {
                    const newOpacity = prev - 0.1;
                    if (newOpacity <= 0) {
                        clearInterval(fadeInterval);
                        setIsVisible(false);
                        return 0;
                    }
                    return newOpacity;
                });
            }, 500); // Cada 500ms reduce 0.1 = 5 segundos total
        }, 15000); // Empieza fade a los 15 segundos

        return () => clearTimeout(fadeTimer);
    }, [festivity, enabled]);

    if (!enabled || !festivity || emojis.length === 0 || !isVisible) return null;

    return (
        <div 
            className="fixed inset-0 pointer-events-none z-40 overflow-hidden transition-opacity duration-500"
            style={{ opacity }}
        >
            {/* Estilo de animación */}
            <style>{`
                @keyframes festive-fall {
                    0% {
                        transform: translateY(-20px) rotate(0deg) scale(1);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.8;
                    }
                    50% {
                        transform: translateY(50vh) rotate(180deg) scale(1.1);
                        opacity: 0.6;
                    }
                    90% {
                        opacity: 0.3;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg) scale(0.8);
                        opacity: 0;
                    }
                }

                @keyframes festive-sway {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(10px); }
                    75% { transform: translateX(-10px); }
                }

                .festive-emoji {
                    position: absolute;
                    animation: festive-fall linear infinite;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
                    user-select: none;
                }

                .festive-emoji::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    animation: festive-sway 3s ease-in-out infinite;
                }
            `}</style>

            {/* Emojis cayendo */}
            {emojis.map((item) => (
                <span
                    key={`${item.id}-${item.emoji}`}
                    className="festive-emoji"
                    style={{
                        left: `${item.left}%`,
                        animationDelay: `${item.delay}s`,
                        animationDuration: `${item.duration}s`,
                        fontSize: `${item.size}px`,
                    }}
                >
                    {item.emoji}
                </span>
            ))}
        </div>
    );
};

export default FestiveEffects;
