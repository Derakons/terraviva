/**
 * AboutModal - Modal profesional con información de la empresa
 * Diseño premium y completamente responsivo
 */

import React, { useEffect } from 'react';
import { X, Shield, Award, Users, MapPin, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { SiteContent } from '../types';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: SiteContent;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, content }) => {
    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Cerrar con tecla Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const stats = [
        { icon: Building2, value: 'Cusco', label: 'Cobertura Regional' },
        { icon: Users, value: 'Personalizada', label: 'Atención al Cliente' },
    ];

    const values = [
        {
            icon: Shield,
            title: '100% Legal',
            description: 'Todas nuestras propiedades están saneadas e inscritas en SUNARP',
            color: 'from-green-500 to-emerald-600',
            bg: 'bg-green-50'
        },
        {
            icon: Award,
            title: 'Experiencia',
            description: 'Brindamos un servicio inmobiliario profesional y confiable en Cusco',
            color: 'from-orange-500 to-amber-600',
            bg: 'bg-orange-50'
        },
        {
            icon: Users,
            title: 'Confianza',
            description: 'Decenas de familias ya encontraron su hogar ideal con nosotros',
            color: 'from-blue-500 to-indigo-600',
            bg: 'bg-blue-50'
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay con blur */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full h-full sm:h-auto sm:max-w-2xl lg:max-w-3xl sm:mx-4 sm:my-8 overflow-hidden">
                {/* Modal */}
                <div className="h-full sm:h-auto bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:max-h-[90vh] animate-[modalSlideIn_0.3s_ease-out]">

                    {/* Header con gradiente */}
                    <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 overflow-hidden shrink-0">
                        {/* Efectos de fondo */}
                        <div className="absolute inset-0">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                        </div>

                        {/* Botón cerrar */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 w-10 h-10 sm:w-11 sm:h-11 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
                            aria-label="Cerrar modal"
                        >
                            <X size={20} />
                        </button>

                        {/* Contenido header */}
                        <div className="relative z-10 px-6 py-10 sm:py-12 text-center">
                            {/* Logo */}
                            {content.logoUrl && (
                                <img
                                    src={content.logoUrl}
                                    alt={content.companyName}
                                    className="h-16 sm:h-20 object-contain mx-auto mb-4"
                                />
                            )}

                            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                                {content.about.title || 'Sobre Nosotros'}
                            </h2>
                            <p className="text-white/70 text-sm sm:text-base">
                                {content.companyName}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="relative z-10 flex justify-center gap-6 sm:gap-10 pb-8">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                                    <div className="text-xs sm:text-sm text-white/60 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contenido scrolleable */}
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        <div className="p-6 sm:p-8">
                            {/* Descripción */}
                            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 text-center sm:text-left">
                                {content.about.description}
                            </p>

                            {/* Valores */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                {values.map((value, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-5 ${value.bg} rounded-2xl border border-slate-100 text-center sm:text-left hover:shadow-lg transition-shadow duration-300`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto sm:mx-0 mb-3 shadow-lg`}>
                                            <value.icon className="text-white" size={24} />
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-1">{value.title}</h4>
                                        <p className="text-xs sm:text-sm text-slate-600">{value.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Info de contacto */}
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 sm:p-6">
                                <h4 className="font-bold text-slate-900 mb-4 text-center sm:text-left">
                                    Información de Contacto
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { icon: MapPin, text: content.contact.address, color: 'text-red-500' },
                                        { icon: Phone, text: content.contact.phone, color: 'text-green-500' },
                                        { icon: Mail, text: content.contact.email, color: 'text-blue-500' },
                                        { icon: Clock, text: 'Lun - Vie: 9:00 AM - 6:00 PM', color: 'text-orange-500' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-slate-600 justify-center sm:justify-start">
                                            <div className={`w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center ${item.color}`}>
                                                <item.icon size={16} />
                                            </div>
                                            <span className="text-sm">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer fijo */}
                    <div className="shrink-0 p-4 sm:p-6 bg-white border-t border-slate-100">
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>

            {/* Estilos de animación */}
            <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
        </div>
    );
};

export default AboutModal;
