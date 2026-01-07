/**
 * ProjectsTab - Gestión de proyectos inmobiliarios
 */

import React from 'react';
import { Project } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface ProjectsTabProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects, onUpdate }) => {
  const inputStyles = "w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";
  const labelStyles = "text-xs text-slate-600 font-bold uppercase tracking-wide";
  
  const handleChange = (id: number, key: keyof Project, value: any) => {
    onUpdate(projects.map(p => p.id === id ? { ...p, [key]: value } : p));
  };

  const handleAdd = () => {
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    onUpdate([
      ...projects,
      {
        id: newId,
        title: "Nueva Propiedad",
        location: "Cusco, Perú",
        description: "Descripción de la propiedad...",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        status: "En Venta",
        type: "venta",
        price: '150,000',
        priceUSD: '40,000',
        area: '100 m²',
        bedrooms: 3,
        bathrooms: 2,
        parkingSpots: 1,
        features: ['Inscrito en SUNARP', 'Servicios Independientes'],
        floorPlanImage: '',
        googleMapsEmbedUrl: '',
        gallery: []
      }
    ]);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      onUpdate(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-blue-800">🏠 Gestión de Proyectos</h3>
        <p className="text-sm text-blue-600">Añade, edita y organiza tus propiedades inmobiliarias.</p>
      </div>
      
      <button
        onClick={handleAdd}
        className="mb-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2 font-bold transition-all hover:scale-[1.02]"
      >
        <Plus size={18} /> Añadir Nuevo Proyecto
      </button>

      <div className="grid gap-6">
        {projects.map((project) => (
          <div key={project.id} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-6 relative group hover:shadow-lg hover:border-slate-300 transition-all">

            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                  <img src={project.image} alt="preview" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{project.title}</h3>
                  <p className="text-sm text-slate-500">{project.location}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded-full ${
                    project.status === 'En Venta' ? 'bg-emerald-100 text-emerald-700' :
                    project.status === 'En Alquiler' ? 'bg-blue-100 text-blue-700' :
                    project.status === 'Vendido' ? 'bg-slate-100 text-slate-600' :
                    'bg-amber-100 text-amber-700'
                  }`}>{project.status}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
              <div>
                <label className={labelStyles}>Título</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleChange(project.id, 'title', e.target.value)}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Estado</label>
                <select
                  value={project.status}
                  onChange={(e) => handleChange(project.id, 'status', e.target.value)}
                  className={inputStyles}
                >
                  <option value="En Venta">En Venta</option>
                  <option value="En Alquiler">En Alquiler</option>
                  <option value="Alquiler Temporal">Alquiler Temporal (Airbnb)</option>
                  <option value="Vendido">Vendido</option>
                  <option value="Reservado">Reservado</option>
                </select>
              </div>
              <div>
                <label className={labelStyles}>Tipo</label>
                <select
                  value={project.type || 'venta'}
                  onChange={(e) => handleChange(project.id, 'type', e.target.value)}
                  className={inputStyles}
                >
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                  <option value="airbnb">Airbnb</option>
                  <option value="compra">Compra</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelStyles}>Ubicación</label>
                <input
                  type="text"
                  value={project.location}
                  onChange={(e) => handleChange(project.id, 'location', e.target.value)}
                  className={inputStyles}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyles}>Descripción Corta</label>
                <textarea
                  value={project.description}
                  onChange={(e) => handleChange(project.id, 'description', e.target.value)}
                  className={inputStyles}
                  rows={2}
                />
              </div>

              <div>
                <label className={labelStyles}>Precio S/.</label>
                <input
                  type="text"
                  value={project.price}
                  onChange={(e) => handleChange(project.id, 'price', e.target.value)}
                  className={inputStyles}
                  placeholder="150,000"
                />
              </div>
              <div>
                <label className={labelStyles}>Precio USD</label>
                <input
                  type="text"
                  value={project.priceUSD || ''}
                  onChange={(e) => handleChange(project.id, 'priceUSD', e.target.value)}
                  className={inputStyles}
                  placeholder="40,000"
                />
              </div>
              <div>
                <label className={labelStyles}>Área (m²)</label>
                <input
                  type="text"
                  value={project.area}
                  onChange={(e) => handleChange(project.id, 'area', e.target.value)}
                  className={inputStyles}
                  placeholder="100 m²"
                />
              </div>
              <div>
                <label className={labelStyles}>Habitaciones</label>
                <input
                  type="number"
                  min="0"
                  value={project.bedrooms || 0}
                  onChange={(e) => handleChange(project.id, 'bedrooms', parseInt(e.target.value) || 0)}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Baños</label>
                <input
                  type="number"
                  min="0"
                  value={project.bathrooms || 0}
                  onChange={(e) => handleChange(project.id, 'bathrooms', parseInt(e.target.value) || 0)}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Estacionamientos</label>
                <input
                  type="number"
                  min="0"
                  value={project.parkingSpots || 0}
                  onChange={(e) => handleChange(project.id, 'parkingSpots', parseInt(e.target.value) || 0)}
                  className={inputStyles}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyles}>Características (Una por línea)</label>
                <textarea
                  value={project.features ? project.features.join('\n') : ''}
                  onChange={(e) => handleChange(project.id, 'features', e.target.value.split('\n'))}
                  className={inputStyles}
                  rows={3}
                  placeholder="Piscina&#10;Quincho&#10;Gimnasio"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelStyles}>URL Imagen Principal</label>
                <input
                  type="text"
                  value={project.image}
                  onChange={(e) => handleChange(project.id, 'image', e.target.value)}
                  className={inputStyles}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyles}>Galería de Fotos (URLs una por línea)</label>
                <textarea
                  value={project.gallery ? project.gallery.join('\n') : ''}
                  onChange={(e) => handleChange(project.id, 'gallery', e.target.value.split('\n'))}
                  className={`${inputStyles} font-mono text-xs`}
                  rows={4}
                  placeholder="https://...&#10;https://..."
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyles}>URL Imagen Plano (Planta)</label>
                <input
                  type="text"
                  value={project.floorPlanImage}
                  onChange={(e) => handleChange(project.id, 'floorPlanImage', e.target.value)}
                  className={inputStyles}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyles}>URL Google Maps Embed</label>
                <input
                  type="text"
                  value={project.googleMapsEmbedUrl}
                  onChange={(e) => handleChange(project.id, 'googleMapsEmbedUrl', e.target.value)}
                  className={`${inputStyles} font-mono text-xs`}
                  placeholder="https://www.google.com/maps/embed?..."
                />
                <p className="text-[10px] text-slate-500 mt-1">Copia el enlace 'src' del código de inserción de Google Maps.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;
