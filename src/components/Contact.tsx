/**
 * Contact - Formulario de Contacto
 * Diseño vibrante con gradientes naranjas
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle2, Loader2, Clock, Shield, Star } from 'lucide-react';
import { SiteContent, SectionConfig } from '../types';
import { db } from '../services/storage';
import DevBadge from './DevBadge';

interface ContactProps {
  content: SiteContent;
  sectionConfig?: SectionConfig;
}

const Contact: React.FC<ContactProps> = ({ content, sectionConfig }) => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Comprar Propiedad',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      await db.trackContact(formData.name, formData.email, formData.phone, formData.message);

      const whatsappMessage = encodeURIComponent(
        `¡Hola! Soy ${formData.name}.\n\n` +
        `📧 Email: ${formData.email}\n` +
        `📱 Teléfono: ${formData.phone}\n` +
        `🏠 Interés: ${formData.interest}\n\n` +
        `💬 Mensaje:\n${formData.message}`
      );

      const phoneNumber = content.contact.phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/51${phoneNumber}?text=${whatsappMessage}`;

      setFormStatus('success');

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);

    } catch (error) {
      console.error('Error al enviar:', error);
      setFormStatus('error');
    }
  };

  const resetForm = () => {
    setFormStatus('idle');
    setFormData({
      name: '',
      email: '',
      phone: '',
      interest: 'Comprar Propiedad',
      message: ''
    });
  };

  return (
    <section id="contacto" className="contact-section py-20 relative overflow-hidden">
      <DevBadge name="Contact" description="Formulario de contacto" />
      {/* Elementos decorativos */}
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'color-mix(in srgb, var(--accent) 5%, transparent)' }} />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span 
            className="inline-block px-4 py-2 text-sm font-bold rounded-full mb-4"
            style={{ 
              background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
              color: 'var(--accent)'
            }}
          >
            {sectionConfig?.subtitle || 'Contáctanos'}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            {sectionConfig?.title || '¡Encuentra tu propiedad ideal!'}
          </h2>
          <p className="text-slate-600 text-lg">
            {sectionConfig?.description || 'Déjanos tus datos y un asesor especializado te contactará en menos de 24 horas.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto">

          {/* Información de contacto */}
          <div className="w-full lg:w-5/12 space-y-6">

            {/* Tarjeta principal */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-2xl">
              <h4 className="text-2xl font-bold mb-6">Información de Contacto</h4>

              <div className="space-y-4">
                <a
                  href={`tel:${content.contact.phone}`}
                  className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: 'var(--accent)' }}
                  >
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Llámanos</p>
                    <p className="font-bold text-lg">{content.contact.phone}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${content.contact.email}`}
                  className="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Escríbenos</p>
                    <p className="font-semibold">{content.contact.email}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Ubicación</p>
                    <p className="font-semibold">{content.contact.address}</p>
                  </div>
                </div>
              </div>

              {/* Horario */}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                <Clock size={18} className="text-orange-400" />
                <div className="text-sm text-white/80">
                  <span className="font-semibold">Horario:</span> Lun-Vie 9AM-6PM, Sáb 9AM-1PM
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/51${content.contact.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold text-lg group"
            >
              <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
              Escríbenos por WhatsApp
            </a>

            {/* Garantías */}
            <div className="contact-card p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Shield size={22} className="text-orange-500" />
                <span className="font-bold text-slate-800">¿Por qué elegirnos?</span>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-orange-500" />
                  <span>+500 clientes satisfechos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-orange-500" />
                  <span>Documentación 100% saneada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-orange-500" />
                  <span>Asesoría legal incluida</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="w-full lg:w-7/12">
            {formStatus === 'success' ? (
              <div className="contact-card p-8 md:p-12 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 text-center h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={48} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Mensaje Enviado!</h3>
                <p className="text-slate-600 mb-6">
                  Serás redirigido a WhatsApp para continuar la conversación.
                </p>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-card p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
                <h4 className="text-2xl font-bold text-slate-900 mb-6">Solicita información</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      required
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-slate-50 hover:bg-white"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-slate-50 hover:bg-white"
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-slate-50 hover:bg-white"
                      placeholder="987 654 321"
                    />
                  </div>
                  <div>
                    <label htmlFor="interest" className="block text-sm font-bold text-slate-700 mb-2">
                      ¿Qué te interesa?
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-slate-50 hover:bg-white"
                    >
                      <option>Comprar Propiedad</option>
                      <option>Comprar Departamento</option>
                      <option>Comprar Casa</option>
                      <option>Comprar Terreno</option>
                      <option>Inversión</option>
                      <option>Otros</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    required
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none bg-slate-50 hover:bg-white"
                    placeholder="Hola, estoy interesado en conocer más sobre sus propiedades..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all flex justify-center items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:brightness-110
                    ${formStatus === 'submitting' ? 'bg-slate-400 cursor-not-allowed' : ''}`}
                  style={{ background: formStatus === 'submitting' ? undefined : 'var(--accent)' }}
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Mensaje
                    </>
                  )}
                </button>

                <p className="text-center text-slate-500 text-xs mt-4">
                  Al enviar, serás redirigido a WhatsApp para confirmar tu mensaje.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;