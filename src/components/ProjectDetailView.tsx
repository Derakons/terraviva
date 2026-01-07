/**
 * ProjectDetailView - Vista de Detalle de Propiedad
 * Diseño vibrante y profesional con gradientes y animaciones
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Ruler,
  CheckCircle,
  Phone,
  Image as ImageIcon,
  Bed,
  Bath,
  Car,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Mail,
  MessageCircle,
  Home,
  Shield,
  Calendar,
  X
} from 'lucide-react';
import { Project } from '../types';
import DevBadge from './DevBadge';

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onContact: () => void;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, onBack, onContact }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const allImages = [project.image, ...(project.gallery || [])].filter(Boolean);
  const imageCount = allImages.length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageCount);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola, me interesa la propiedad:\n\n` +
      `📍 ${project.title}\n` +
      `📌 ${project.location}\n` +
      `💰 S/. ${project.price}\n\n` +
      `Quisiera más información.`
    );
    window.open(`https://wa.me/51913328866?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+51913328866';
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Consulta: ${project.title}`);
    const body = encodeURIComponent(
      `Hola,\n\nMe interesa la propiedad: ${project.title}\n` +
      `Ubicación: ${project.location}\n` +
      `Precio: S/. ${project.price}\n\nGracias.`
    );
    window.location.href = `mailto:terravivasuport@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DevBadge name="ProjectDetailView" description="Vista de detalle de propiedad" />

      {/* ===== HERO CON GALERÍA ===== */}
      <div className="relative h-[50vh] md:h-[70vh] bg-slate-900">
        {/* Imagen principal */}
        <img
          src={allImages[currentImageIndex]}
          alt={project.title}
          className="w-full h-full object-cover"
        />

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

        {/* Navegación superior */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full font-medium transition-all"
          >
            <ArrowLeft size={20} />
            <span className="hidden md:inline">Volver</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-white'
                }`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => navigator.share?.({ title: project.title, url: window.location.href })}
              className="w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Navegación del carrusel */}
        {imageCount > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all z-10"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all z-10"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        {/* Contador y ver galería */}
        <button
          onClick={() => setShowGalleryModal(true)}
          className="absolute bottom-24 right-4 md:right-8 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md hover:bg-black/70 text-white rounded-full text-sm transition-all"
        >
          <ImageIcon size={16} />
          <span>{currentImageIndex + 1} / {imageCount}</span>
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
          {allImages.slice(0, 6).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                }`}
            />
          ))}
        </div>

        {/* Información principal */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-orange-500 to-red-500 uppercase">
                {project.status}
              </span>
              {project.type && (
                <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-md uppercase">
                  {project.type}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-2 drop-shadow-lg">
              {project.title}
            </h1>

            <div className="flex items-center gap-2 text-white/80 text-sm md:text-base">
              <MapPin size={18} className="text-orange-400" />
              <span>{project.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="container mx-auto max-w-6xl px-4 md:px-8 -mt-8 relative z-10">

        {/* Tarjeta de precios flotante */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Precio en Soles */}
          <div className="text-center md:text-left p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50">
            <span className="text-xs text-slate-500 font-medium block">Precio (S/.)</span>
            <span className="text-2xl md:text-3xl font-black text-slate-900">{project.price}</span>
          </div>

          {/* Precio en USD */}
          {project.priceUSD && (
            <div className="text-center md:text-left p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <span className="text-xs text-slate-500 font-medium block">Precio (USD)</span>
              <span className="text-2xl md:text-3xl font-black text-slate-900">{project.priceUSD}</span>
            </div>
          )}

          {/* Área */}
          <div className="text-center md:text-left p-4 rounded-xl bg-slate-50">
            <span className="text-xs text-slate-500 font-medium block">Área</span>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Ruler size={20} className="text-orange-500" />
              <span className="text-xl font-bold text-slate-900">{project.area}</span>
            </div>
          </div>

          {/* Características rápidas */}
          <div className="text-center md:text-left p-4 rounded-xl bg-slate-50">
            <span className="text-xs text-slate-500 font-medium block mb-2">Características</span>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              {project.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed size={18} className="text-orange-500" />
                  <span className="font-bold text-slate-900">{project.bedrooms}</span>
                </div>
              )}
              {project.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath size={18} className="text-orange-500" />
                  <span className="font-bold text-slate-900">{project.bathrooms}</span>
                </div>
              )}
              {project.parkingSpots && (
                <div className="flex items-center gap-1">
                  <Car size={18} className="text-orange-500" />
                  <span className="font-bold text-slate-900">{project.parkingSpots}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* ===== COLUMNA IZQUIERDA ===== */}
          <div className="lg:col-span-2 space-y-8">

            {/* Descripción */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Home size={22} className="text-orange-500" />
                Descripción
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {project.description}
              </p>
            </div>

            {/* Características */}
            {project.features && project.features.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <CheckCircle size={22} className="text-orange-500" />
                  Características y Servicios
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Galería */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <ImageIcon size={22} className="text-orange-500" />
                  Galería de Fotos
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allImages.map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => { setCurrentImageIndex(index); setShowGalleryModal(true); }}
                      className="aspect-square rounded-xl overflow-hidden group relative"
                    >
                      <img
                        src={imgUrl}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ImageIcon size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mapa */}
            {project.googleMapsEmbedUrl && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg overflow-hidden">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <MapPin size={22} className="text-orange-500" />
                  Ubicación
                </h2>
                <a
                  href={project.googleMapsEmbedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  <MapPin size={20} />
                  Ver ubicación en Google Maps
                </a>
              </div>
            )}
          </div>

          {/* ===== COLUMNA DERECHA - CONTACTO ===== */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* Tarjeta de contacto */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold mb-2">¿Te interesa esta propiedad?</h3>
                <p className="text-slate-300 text-sm mb-6">
                  Contáctanos ahora y agenda una visita sin compromiso.
                </p>

                {/* Botón WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 mb-3 shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle size={22} />
                  WhatsApp
                </button>

                {/* Botón Llamar */}
                <button
                  onClick={handleCall}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 mb-3 shadow-lg hover:shadow-xl transition-all"
                >
                  <Phone size={22} />
                  Llamar: 913 328 866
                </button>

                {/* Botón Email */}
                <button
                  onClick={handleEmail}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all"
                >
                  <Mail size={20} />
                  Enviar Correo
                </button>
              </div>

              {/* Garantías */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Shield size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Documentación Saneada</h4>
                    <p className="text-sm text-slate-500">Inscrita en SUNARP</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Asesoría Incluida</h4>
                    <p className="text-sm text-slate-500">Legal y notarial</p>
                  </div>
                </div>
              </div>

              {/* Plano si existe */}
              {project.floorPlanImage && (
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Plano de Distribución</h3>
                  <div className="rounded-xl overflow-hidden bg-slate-50 p-2">
                    <img
                      src={project.floorPlanImage}
                      alt="Plano"
                      className="w-full h-auto object-contain cursor-zoom-in hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL DE GALERÍA ===== */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowGalleryModal(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"
          >
            <X size={24} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/30 text-white rounded-full flex items-center justify-center"
          >
            <ChevronLeft size={28} />
          </button>

          <img
            src={allImages[currentImageIndex]}
            alt={`Foto ${currentImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />

          <button
            onClick={nextImage}
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/30 text-white rounded-full flex items-center justify-center"
          >
            <ChevronRight size={28} />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentImageIndex + 1} / {imageCount}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailView;