/**
 * TestimonialsManager - Gestión de testimonios en el admin
 * CRUD completo para aprobar/rechazar/editar testimonios
 */

import React, { useState, useEffect } from 'react';
import {
    Star, Check, X, Trash2, Edit2, MessageSquare,
    User, MapPin, Calendar, Filter, RefreshCw
} from 'lucide-react';
import { db } from '../services/storage';
import { Testimonial, INITIAL_TESTIMONIALS } from '../data/initialData';

const TestimonialsManager: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Testimonial>>({});

    // Cargar testimonios
    useEffect(() => {
        const stored = db.getTestimonials(INITIAL_TESTIMONIALS);
        setTestimonials(stored);
    }, []);

    // Guardar cambios
    const saveTestimonials = (newTestimonials: Testimonial[]) => {
        setTestimonials(newTestimonials);
        db.saveTestimonials(newTestimonials);
    };

    // Aprobar testimonio
    const handleApprove = (id: number) => {
        saveTestimonials(testimonials.map(t =>
            t.id === id ? { ...t, isApproved: true } : t
        ));
    };

    // Rechazar testimonio
    const handleReject = (id: number) => {
        saveTestimonials(testimonials.map(t =>
            t.id === id ? { ...t, isApproved: false } : t
        ));
    };

    // Eliminar testimonio
    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este testimonio permanentemente?')) {
            saveTestimonials(testimonials.filter(t => t.id !== id));
        }
    };

    // Iniciar edición
    const startEdit = (testimonial: Testimonial) => {
        setEditingId(testimonial.id);
        setEditForm(testimonial);
    };

    // Guardar edición
    const handleSaveEdit = () => {
        if (editingId && editForm) {
            saveTestimonials(testimonials.map(t =>
                t.id === editingId ? { ...t, ...editForm } as Testimonial : t
            ));
            setEditingId(null);
            setEditForm({});
        }
    };

    // Cancelar edición
    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    // Filtrar testimonios
    const filteredTestimonials = testimonials.filter(t => {
        if (filter === 'approved') return t.isApproved;
        if (filter === 'pending') return !t.isApproved;
        return true;
    });

    // Stats
    const approvedCount = testimonials.filter(t => t.isApproved).length;
    const pendingCount = testimonials.filter(t => !t.isApproved).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex items-center gap-2">
                    <MessageSquare className="text-blue-500" size={24} />
                    <h3 className="text-xl font-bold text-slate-800">Gestión de Testimonios</h3>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        ✓ {approvedCount} aprobados
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                        ⏳ {pendingCount} pendientes
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    Todos ({testimonials.length})
                </button>
                <button
                    onClick={() => setFilter('approved')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'approved'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                >
                    Aprobados ({approvedCount})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'pending'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                >
                    Pendientes ({pendingCount})
                </button>
            </div>

            {/* Testimonials List */}
            {filteredTestimonials.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <MessageSquare className="mx-auto mb-4 text-slate-300" size={48} />
                    <p>No hay testimonios en esta categoría</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredTestimonials.map(testimonial => (
                        <div
                            key={testimonial.id}
                            className={`p-5 rounded-xl border-2 transition-all ${testimonial.isApproved
                                ? 'bg-white border-green-200'
                                : 'bg-amber-50 border-amber-200'
                                }`}
                        >
                            {editingId === testimonial.id ? (
                                /* Edit Mode */
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
                                            <input
                                                type="text"
                                                value={editForm.name || ''}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Ubicación</label>
                                            <input
                                                type="text"
                                                value={editForm.location || ''}
                                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Propiedad</label>
                                            <input
                                                type="text"
                                                value={editForm.propertyType || ''}
                                                onChange={(e) => setEditForm({ ...editForm, propertyType: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Calificación</label>
                                            <select
                                                value={editForm.rating || 5}
                                                onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            >
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <option key={n} value={n}>{n} estrellas</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Comentario</label>
                                            <textarea
                                                value={editForm.comment || ''}
                                                onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={cancelEdit}
                                            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                        >
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* View Mode */
                                <div className="flex gap-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shrink-0">
                                        {testimonial.avatarUrl ? (
                                            <img src={testimonial.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <User className="text-slate-500" size={24} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                                <MapPin size={12} />
                                                {testimonial.location}
                                            </span>
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                                                {testimonial.propertyType}
                                            </span>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex gap-0.5 mb-2">
                                            {[1, 2, 3, 4, 5].map(n => (
                                                <Star
                                                    key={n}
                                                    size={14}
                                                    className={n <= testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                                                />
                                            ))}
                                        </div>

                                        {/* Comment */}
                                        <p className="text-slate-600 text-sm leading-relaxed">"{testimonial.comment}"</p>

                                        {/* Meta */}
                                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                                            <Calendar size={12} />
                                            {new Date(testimonial.createdAt).toLocaleDateString('es-PE')}
                                            {testimonial.isApproved ? (
                                                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full">✓ Aprobado</span>
                                            ) : (
                                                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">⏳ Pendiente</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 shrink-0">
                                        {!testimonial.isApproved && (
                                            <button
                                                onClick={() => handleApprove(testimonial.id)}
                                                className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                title="Aprobar"
                                            >
                                                <Check size={18} />
                                            </button>
                                        )}
                                        {testimonial.isApproved && (
                                            <button
                                                onClick={() => handleReject(testimonial.id)}
                                                className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                                                title="Despublicar"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => startEdit(testimonial)}
                                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(testimonial.id)}
                                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">📋 Información:</p>
                <p>Los testimonios aprobados se mostrarán en la página principal. Los pendientes requieren tu aprobación antes de ser visibles.</p>
            </div>
        </div>
    );
};

export default TestimonialsManager;
