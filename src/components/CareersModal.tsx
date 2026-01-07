/**
 * CareersModal - Modal profesional para postulaciones de trabajo
 * Diseño premium y completamente responsivo
 */

import React, { useState, useEffect } from 'react';
import { X, Briefcase, Send, CheckCircle, User, Mail, Phone, FileText, Shield, Sparkles } from 'lucide-react';

interface CareersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CareersModal: React.FC<CareersModalProps> = ({ isOpen, onClose }) => {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    // Bloquear scroll del body
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Cerrar con Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) return;

        setIsSubmitting(true);

        // Simular envío
        await new Promise(resolve => setTimeout(resolve, 1200));

        setSubmitted(true);
        setIsSubmitting(false);

        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', phone: '', message: '' });
            onClose();
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full h-full sm:h-auto sm:max-w-lg sm:mx-4 sm:my-8 overflow-hidden">
                {/* Modal */}
                <div className="h-full sm:h-auto bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:max-h-[90vh] animate-[modalSlideIn_0.3s_ease-out]">

                    {/* Header con gradiente */}
                    <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden shrink-0">
                        {/* Efectos de fondo */}
                        <div className="absolute inset-0">
                            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
                            {/* Patrón decorativo */}
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                backgroundSize: '24px 24px'
                            }} />
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
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-4">
                                <Sparkles size={14} />
                                ¡Únete a nuestro equipo!
                            </div>

                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                                <Briefcase className="text-white" size={32} />
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                                Trabaja con Nosotros
                            </h2>
                            <p className="text-white/80 text-sm sm:text-base max-w-xs mx-auto">
                                Déjanos tus datos y nos pondremos en contacto contigo
                            </p>
                        </div>
                    </div>

                    {/* Contenido scrolleable */}
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        <div className="p-6 sm:p-8">
                            {submitted ? (
                                /* Estado de éxito */
                                <div className="text-center py-8 sm:py-12">
                                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl animate-[bounceIn_0.5s_ease-out]">
                                        <CheckCircle className="text-white" size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-3">
                                        ¡Datos Recibidos!
                                    </h3>
                                    <p className="text-slate-600">
                                        Nos pondremos en contacto contigo muy pronto.
                                    </p>
                                </div>
                            ) : (
                                /* Formulario */
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Nombre */}
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Nombre Completo <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-focus-within:bg-blue-100 transition-colors">
                                                <User className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full pl-14 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900"
                                                placeholder="Tu nombre completo"
                                            />
                                        </div>
                                    </div>

                                    {/* Grid de Contacto */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Teléfono */}
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Teléfono <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-focus-within:bg-green-100 transition-colors">
                                                    <Phone className="text-slate-400 group-focus-within:text-green-500 transition-colors" size={16} />
                                                </div>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="w-full pl-14 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-slate-900"
                                                    placeholder="999 999 999"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Email <span className="text-slate-400 text-xs font-normal">(opcional)</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-focus-within:bg-orange-100 transition-colors">
                                                    <Mail className="text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                    className="w-full pl-14 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-slate-900"
                                                    placeholder="tu@email.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mensaje */}
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Mensaje breve <span className="text-slate-400 text-xs font-normal">(opcional)</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-4 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-focus-within:bg-purple-100 transition-colors">
                                                <FileText className="text-slate-400 group-focus-within:text-purple-500 transition-colors" size={16} />
                                            </div>
                                            <textarea
                                                value={formData.message}
                                                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                                rows={3}
                                                className="w-full pl-14 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all resize-none text-slate-900"
                                                placeholder="¿En qué área te gustaría trabajar?"
                                            />
                                        </div>
                                    </div>

                                    {/* Nota de privacidad */}
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0">
                                            <Shield className="text-green-500" size={20} />
                                        </div>
                                        <p className="text-xs sm:text-sm text-slate-600">
                                            Tus datos están <strong className="text-slate-800">100% seguros</strong> y no serán compartidos con terceros.
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Footer fijo */}
                    {!submitted && (
                        <div className="shrink-0 p-4 sm:p-6 bg-white border-t border-slate-100">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3.5 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !formData.name || !formData.phone}
                                    className="flex-1 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Enviar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
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
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default CareersModal;
