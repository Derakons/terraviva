/**
 * PropertyCard - Tarjeta de Propiedad Vibrante
 * Diseño moderno con gradientes, animaciones y efectos dinámicos
 */

import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Bed,
    Bath,
    Maximize,
    Phone,
    Mail,
    Camera,
    Heart,
    Share2,
    ExternalLink
} from 'lucide-react';
import { Project } from '../types';

interface PropertyCardProps {
    property: Project;
    onViewDetails: (property: Project) => void;
    contactPhone?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    property,
    onViewDetails,
    contactPhone = '913 328 866'
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [imageError, setImageError] = useState(false);

    const allImages = [property.image, ...(property.gallery || [])].filter(Boolean);
    const imageCount = allImages.length;

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % imageCount);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        const message = encodeURIComponent(
            `Hola, me interesa la propiedad: ${property.title}\n` +
            `Ubicación: ${property.location}\n` +
            `Precio: S/. ${property.price}`
        );
        window.open(`https://wa.me/51${contactPhone.replace(/\D/g, '')}?text=${message}`, '_blank');
    };

    const handleEmail = (e: React.MouseEvent) => {
        e.stopPropagation();
        const subject = encodeURIComponent(`Consulta: ${property.title}`);
        const body = encodeURIComponent(
            `Hola,\n\nMe interesa la propiedad: ${property.title}\n` +
            `Ubicación: ${property.location}\n` +
            `Precio: S/. ${property.price}\n\nGracias.`
        );
        window.location.href = `mailto:terravivasuport@gmail.com?subject=${subject}&body=${body}`;
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: property.title,
                text: `${property.title} - ${property.location}`,
                url: window.location.href
            });
        }
    };

    return (
        <article
            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-2"
            onClick={() => onViewDetails(property)}
        >
            {/* ===== IMAGEN CON CARRUSEL ===== */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={imageError ? 'https://via.placeholder.com/600x400?text=Sin+Imagen' : allImages[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() => setImageError(true)}
                    loading="lazy"
                />

                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge de estado */}
                <div className="absolute top-4 left-4">
                    <span 
                        className="px-4 py-2 text-xs font-bold rounded-full text-white shadow-lg"
                        style={{ background: 'var(--accent)' }}
                    >
                        {property.status}
                    </span>
                </div>

                {/* Tipo de propiedad */}
                {property.type && (
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white/90 text-slate-700 shadow-md uppercase">
                            {property.type}
                        </span>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={handleLike}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-600 hover:bg-red-500 hover:text-white'
                            }`}
                    >
                        <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-10 h-10 bg-white/90 hover:bg-blue-500 hover:text-white rounded-full flex items-center justify-center shadow-lg text-slate-600 transition-all"
                    >
                        <Share2 size={18} />
                    </button>
                </div>

                {/* Navegación del carrusel */}
                {imageCount > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={22} className="text-slate-700" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={22} className="text-slate-700" />
                        </button>
                    </>
                )}

                {/* Contador de fotos */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/70 rounded-full text-white text-xs font-medium">
                    <Camera size={14} />
                    <span>{currentImageIndex + 1} / {imageCount}</span>
                </div>

                {/* Indicadores de imagen */}
                {imageCount > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {allImages.slice(0, 5).map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ===== CONTENIDO ===== */}
            <div className="p-5">
                {/* Precios */}
                <div className="flex items-baseline gap-4 mb-3">
                    <div>
                        <span className="text-xs text-slate-500 font-medium">S/.</span>
                        <span className="text-2xl font-black text-slate-900 ml-1">{property.price}</span>
                    </div>
                    {property.priceUSD && (
                        <div className="text-sm text-slate-500">
                            <span>USD </span>
                            <span className="font-bold">{property.priceUSD}</span>
                        </div>
                    )}
                </div>

                {/* Título */}
                <h3 
                    className="text-lg font-bold text-slate-800 mb-2 line-clamp-1 transition-colors"
                    style={{ '--hover-color': 'var(--accent)' } as React.CSSProperties}
                >
                    <span className="group-hover:[color:var(--accent)]">{property.title}</span>
                </h3>

                {/* Ubicación */}
                <div className="flex items-center gap-2 text-slate-500 mb-4">
                    <MapPin size={16} className="flex-shrink-0" style={{ color: 'var(--accent)' }} />
                    <span className="text-sm truncate">{property.location}</span>
                </div>

                {/* Características */}
                <div className="flex flex-wrap gap-4 py-3 border-t border-slate-100">
                    {property.area && (
                        <div className="flex items-center gap-2">
                            <Maximize size={16} style={{ color: 'var(--accent)' }} />
                            <span className="text-sm font-medium text-slate-700">{property.area}</span>
                        </div>
                    )}
                    {property.bedrooms && (
                        <div className="flex items-center gap-2">
                            <Bed size={16} style={{ color: 'var(--accent)' }} />
                            <span className="text-sm font-medium text-slate-700">{property.bedrooms} Dorm.</span>
                        </div>
                    )}
                    {property.bathrooms && (
                        <div className="flex items-center gap-2">
                            <Bath size={16} style={{ color: 'var(--accent)' }} />
                            <span className="text-sm font-medium text-slate-700">{property.bathrooms} Baños</span>
                        </div>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                        onClick={handleEmail}
                        className="flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
                    >
                        <Mail size={18} />
                        <span>Correo</span>
                    </button>
                    <button
                        onClick={handleWhatsApp}
                        className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>WhatsApp</span>
                    </button>
                </div>

                {/* Ver más */}
                <button
                    onClick={(e) => { e.stopPropagation(); onViewDetails(property); }}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-3 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg hover:brightness-110"
                    style={{ background: 'var(--accent)' }}
                >
                    <ExternalLink size={16} />
                    Ver Detalles
                </button>
            </div>
        </article>
    );
};

export default PropertyCard;
