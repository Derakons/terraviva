/**
 * Projects - Listado de Propiedades con Buscador
 * Incluye filtros y búsqueda
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Project, SectionConfig } from '../types';
import PropertyCard from './PropertyCard';
import DevBadge from './DevBadge';
import { Search, SlidersHorizontal, MapPin, Grid3X3, List, X, Home, Key, Building2, ShoppingCart } from 'lucide-react';

interface ProjectsProps {
  projects: Project[];
  onViewProject?: (project: Project) => void;
  sectionConfig?: SectionConfig;
  externalFilter?: string;
  onClearExternalFilter?: () => void;
}

// Mapeo de servicios del Hero a filtros de proyectos
const SERVICE_FILTERS: Record<string, { label: string; icon: any; statusMatch: string[]; color: string }> = {
  venta: { label: 'Venta', icon: Home, statusMatch: ['Venta', 'En Venta', 'venta'], color: 'from-orange-500 to-amber-600' },
  alquiler: { label: 'Alquiler', icon: Key, statusMatch: ['Alquiler', 'En Alquiler', 'alquiler'], color: 'from-blue-500 to-cyan-500' },
  airbnb: { label: 'Airbnb', icon: Building2, statusMatch: ['Airbnb', 'airbnb', 'Alquiler Temporal'], color: 'from-rose-500 to-pink-600' },
  compra: { label: 'Compra', icon: ShoppingCart, statusMatch: ['Compra', 'compra', 'Buscamos Comprar'], color: 'from-emerald-500 to-green-500' },
};

const Projects: React.FC<ProjectsProps> = ({ projects, onViewProject, sectionConfig, externalFilter, onClearExternalFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Efecto para aplicar filtro externo desde el Hero
  useEffect(() => {
    if (externalFilter && SERVICE_FILTERS[externalFilter]) {
      // Limpiar otros filtros cuando viene uno externo
      setSearchTerm('');
      setFilterType('');
      setFilterStatus('');
    }
  }, [externalFilter]);

  // Obtener info del filtro activo del Hero
  const activeServiceFilter = externalFilter ? SERVICE_FILTERS[externalFilter] : null;

  // Obtener tipos y estados únicos
  const propertyTypes = useMemo(() => {
    const types = projects.map(p => p.type).filter(Boolean);
    return [...new Set(types)];
  }, [projects]);

  const propertyStatuses = useMemo(() => {
    const statuses = projects.map(p => p.status).filter(Boolean);
    return [...new Set(statuses)];
  }, [projects]);

  // Filtrar proyectos
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !filterType || project.type === filterType;
      const matchesStatus = !filterStatus || project.status === filterStatus;
      
      // Filtro externo desde el Hero (por status que coincida con el servicio)
      const matchesExternalFilter = !externalFilter || !SERVICE_FILTERS[externalFilter] || 
        SERVICE_FILTERS[externalFilter].statusMatch.some(s => 
          project.status?.toLowerCase().includes(s.toLowerCase()) ||
          project.type?.toLowerCase().includes(s.toLowerCase())
        );

      return matchesSearch && matchesType && matchesStatus && matchesExternalFilter;
    });
  }, [projects, searchTerm, filterType, filterStatus, externalFilter]);

  const handleViewProject = (project: Project) => {
    if (onViewProject) {
      onViewProject(project);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
    if (onClearExternalFilter) onClearExternalFilter();
  };

  const hasActiveFilters = searchTerm || filterType || filterStatus || externalFilter;

  return (
    <section id="proyectos" className="projects-section pt-24 pb-16 relative">
      {/* Separador decorativo superior */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-900/5 to-transparent dark:from-white/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full" style={{ background: 'var(--accent)' }} />

      <DevBadge name="Projects" description="Listado de propiedades" />
      <div className="container mx-auto px-4 relative z-10">

        {/* Título de sección */}
        <div className="text-center mb-12">
          <span 
            className="inline-block px-4 py-2 text-sm font-bold rounded-full mb-4"
            style={{ 
              background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
              color: 'var(--accent)'
            }}
          >
            {sectionConfig?.subtitle || 'Nuestro Catálogo'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            {sectionConfig?.title || 'Nuestras Propiedades'}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {sectionConfig?.description || `Encuentra tu propiedad ideal entre nuestro catálogo de ${projects.length} propiedades con documentos 100% saneados.`}
          </p>
        </div>

        {/* Banner de filtro activo desde el Hero */}
        {activeServiceFilter && (
          <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-r ${activeServiceFilter.color} text-white flex items-center justify-between shadow-lg`}>
            <div className="flex items-center gap-3">
              <activeServiceFilter.icon size={24} />
              <div>
                <span className="font-bold text-lg">Mostrando: {activeServiceFilter.label}</span>
                <p className="text-sm text-white/80">{filteredProjects.length} propiedades encontradas</p>
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <X size={16} />
              Ver Todas
            </button>
          </div>
        )}

        {/* Barra de búsqueda y filtros */}
        <div className="search-card rounded-2xl shadow-lg p-4 md:p-6 mb-8 border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Campo de búsqueda */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Botón de filtros (móvil) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 transition-colors"
            >
              <SlidersHorizontal size={20} />
              Filtros
              {hasActiveFilters && <span className="w-2 h-2 bg-orange-500 rounded-full" />}
            </button>

            {/* Filtros desktop */}
            <div className="hidden md:flex items-center gap-3">
              {/* Tipo de propiedad */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-orange-500 outline-none transition-all min-w-[150px]"
              >
                <option value="">Tipo</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* Estado */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-orange-500 outline-none transition-all min-w-[150px]"
              >
                <option value="">Estado</option>
                {propertyStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              {/* Modo de vista */}
              <div className="flex bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-orange-500' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-orange-500' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Filtros móvil (expandible) */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
              >
                <option value="">Tipo</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
              >
                <option value="">Estado</option>
                {propertyStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          )}

          {/* Resultados y limpiar filtros */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              <span className="font-bold text-slate-900">{filteredProjects.length}</span> propiedades encontradas
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1"
              >
                <X size={16} />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Grid de propiedades */}
        {filteredProjects.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
            }`}>
            {filteredProjects.map((project) => (
              <PropertyCard
                key={project.id}
                property={project}
                onViewDetails={handleViewProject}
                contactPhone="913 328 866"
              />
            ))}
          </div>
        ) : (
          /* Estado vacío */
          <div className="text-center py-16 search-card rounded-2xl border border-slate-100 dark:border-slate-700 shadow-lg">
            <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No se encontraron propiedades</h3>
            <p className="text-slate-500 mb-4">Intenta ajustar los filtros de búsqueda</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Ver todas las propiedades
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;