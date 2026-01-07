/**
 * Testimonials - Sección de comentarios y reseñas de clientes
 * Sincronizado con Supabase
 */

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, User, MapPin, Send, CheckCircle } from 'lucide-react';
import { db } from '../services/storage';
import { Testimonial, INITIAL_TESTIMONIALS } from '../data/initialData';
import { SectionConfig } from '../types';

interface TestimonialsProps {
    onSubmitTestimonial?: (testimonial: Omit<Testimonial, 'id' | 'isApproved' | 'createdAt'>) => Promise<boolean>;
    sectionConfig?: SectionConfig;
}

const Testimonials: React.FC<TestimonialsProps> = ({ sectionConfig }) => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Cargar testimonios aprobados
    useEffect(() => {
        const allTestimonials = db.getTestimonials(INITIAL_TESTIMONIALS);
        const approved = allTestimonials.filter(t => t.isApproved);
        setTestimonials(approved);
    }, []);

    // Formulario
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        rating: 5,
        comment: '',
        propertyType: 'Casa'
    });

    // Auto-slide cada 5 segundos
    useEffect(() => {
        if (testimonials.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [testimonials.length]);

    const handlePrev = () => {
        setCurrentIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev + 1) % testimonials.length);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.comment) return;

        setIsSubmitting(true);

        try {
            // Guardar nuevo testimonio
            const newTestimonial: Testimonial = {
                id: Date.now(),
                ...formData,
                isApproved: false, // Por defecto pendiente
                createdAt: new Date().toISOString()
            };

            const current = db.getTestimonials(INITIAL_TESTIMONIALS);
            db.saveTestimonials([...current, newTestimonial]);

            setSubmitSuccess(true);
            setFormData({ name: '', location: '', rating: 5, comment: '', propertyType: 'Casa' });

            setTimeout(() => {
                setSubmitSuccess(false);
                setShowForm(false);
            }, 3000);
        } catch (error) {
            console.error('Error submitting testimonial:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onChange?.(star)}
                        className={`transition-all ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                    >
                        <Star
                            size={interactive ? 28 : 18}
                            className={`${star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 text-slate-200'
                                }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="testimonials-section py-20 relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 text-sm font-bold rounded-full mb-4">
                        {sectionConfig?.subtitle || 'Testimonios'}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        {sectionConfig?.title || 'Lo Que Dicen Nuestros Clientes'}
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Más de 100 familias ya encontraron su hogar ideal con nosotros
                    </p>
                </div>

                {/* Carrusel de testimonios */}
                <div className="max-w-4xl mx-auto">
                    <div className="testimonial-card relative rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 dark:border-slate-700">
                        {/* Icono de comilla */}
                        <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Quote className="text-white" size={24} />
                        </div>

                        {/* Contenido del testimonio */}
                        <div className="pt-4">
                            {/* Estrellas */}
                            <div className="mb-6">
                                {renderStars(currentTestimonial?.rating || 5)}
                            </div>

                            {/* Comentario */}
                            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8 font-medium italic">
                                "{currentTestimonial?.comment}"
                            </p>

                            {/* Info del cliente */}
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center shadow-inner">
                                    {currentTestimonial?.avatarUrl ? (
                                        <img
                                            src={currentTestimonial.avatarUrl}
                                            alt={currentTestimonial.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="text-slate-500" size={28} />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">
                                        {currentTestimonial?.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <MapPin size={14} />
                                        <span>{currentTestimonial?.location}</span>
                                        <span className="mx-1">•</span>
                                        <span className="text-orange-500 font-medium">
                                            {currentTestimonial?.propertyType}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controles de navegación */}
                        {testimonials.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-orange-300 transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-orange-300 transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}

                        {/* Indicadores */}
                        <div className="flex justify-center gap-2 mt-8">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
                                        ? 'w-8 bg-gradient-to-r from-orange-500 to-red-500'
                                        : 'bg-slate-300 hover:bg-slate-400'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Botón para dejar comentario */}
                <div className="text-center mt-12">
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Star size={20} />
                            Deja tu Opinión
                        </button>
                    ) : (
                        <div className="max-w-xl mx-auto testimonial-card rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
                            {submitSuccess ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="text-green-500" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">¡Gracias por tu comentario!</h3>
                                    <p className="text-slate-600">Tu opinión será revisada y publicada pronto.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900 text-center mb-6">
                                        Comparte tu Experiencia
                                    </h3>

                                    {/* Rating */}
                                    <div className="text-center">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            ¿Cómo calificarías nuestro servicio?
                                        </label>
                                        {renderStars(formData.rating, true, (r) => setFormData(prev => ({ ...prev, rating: r })))}
                                    </div>

                                    {/* Nombre y ubicación */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                                placeholder="Tu nombre"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                                placeholder="Ej: Wanchaq, Cusco"
                                            />
                                        </div>
                                    </div>

                                    {/* Tipo de propiedad */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Propiedad</label>
                                        <select
                                            value={formData.propertyType}
                                            onChange={e => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                        >
                                            <option value="Casa">Casa</option>
                                            <option value="Departamento">Departamento</option>
                                            <option value="Terreno">Terreno</option>
                                            <option value="Local Comercial">Local Comercial</option>
                                        </select>
                                    </div>

                                    {/* Comentario */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Tu Comentario *</label>
                                        <textarea
                                            value={formData.comment}
                                            onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                            placeholder="Cuéntanos tu experiencia..."
                                            required
                                        />
                                    </div>

                                    {/* Botones */}
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <span>Enviando...</span>
                                            ) : (
                                                <>
                                                    <Send size={18} />
                                                    Enviar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;
