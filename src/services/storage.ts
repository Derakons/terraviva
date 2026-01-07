/**
 * Storage Service v2 - Supabase como fuente principal
 * Con cache local para rendimiento
 */

import { Project, SiteContent, ThemeConfig } from "../types";
import {
  isSupabaseConfigured,
  fetchContent,
  saveContentToSupabase,
  fetchProjects,
  saveProjectsToSupabase,
  fetchGallery,
  saveGalleryToSupabase,
  saveGalleryImage,
  deleteGalleryImage as deleteGalleryFromDB,
  fetchTestimonials,
  saveTestimonialsToSupabase,
  fetchThemes,
  logPageView,
  logSectionView,
  logContact,
  GalleryImage,
  Testimonial
} from "./supabase";

// Cache keys
const CACHE_CONTENT = 'terraviva_content_cache';
const CACHE_PROJECTS = 'terraviva_projects_cache';
const CACHE_GALLERY = 'terraviva_gallery_cache';
const CACHE_TESTIMONIALS = 'terraviva_testimonials_cache';
const CACHE_THEMES = 'terraviva_themes_cache';
const CACHE_TIMESTAMP = 'terraviva_cache_time';

// Cache duration: 5 minutos
const CACHE_DURATION = 5 * 60 * 1000;

// ==================== UTILIDADES DE CACHE ====================

const isCacheValid = (): boolean => {
  try {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP);
    if (!timestamp) return false;
    return Date.now() - parseInt(timestamp) < CACHE_DURATION;
  } catch {
    return false;
  }
};

const updateCacheTimestamp = () => {
  try {
    localStorage.setItem(CACHE_TIMESTAMP, Date.now().toString());
  } catch {}
};

const getFromCache = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const saveToCache = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
};

// ==================== API PRINCIPAL ====================

export const db = {
  // Estado de conexión
  isCloudEnabled: isSupabaseConfigured,

  // ==================== CONTENIDO ====================
  
  getContent: (initial: SiteContent): SiteContent => {
    // Retorna cache inmediatamente para render rápido
    return getFromCache(CACHE_CONTENT, initial);
  },

  getContentAsync: async (initial: SiteContent): Promise<SiteContent> => {
    if (isSupabaseConfigured()) {
      try {
        console.log('🔄 Solicitando contenido de Supabase...');
        const cloudContent = await fetchContent();
        console.log('📦 Contenido recibido de Supabase:', cloudContent ? 'SÍ' : 'NO');
        if (cloudContent) {
          console.log('✅ Usando contenido de Supabase:', cloudContent.companyName);
          saveToCache(CACHE_CONTENT, cloudContent);
          updateCacheTimestamp();
          return cloudContent;
        } else {
          console.log('⚠️ Supabase retornó null, usando datos locales');
        }
      } catch (e) {
        console.error('❌ Error fetching content from cloud:', e);
      }
    } else {
      console.log('📴 Supabase no configurado');
    }
    return getFromCache(CACHE_CONTENT, initial);
  },

  saveContent: async (content: SiteContent): Promise<boolean> => {
    // Guardar en cache inmediatamente
    saveToCache(CACHE_CONTENT, content);
    console.log('💾 Contenido guardado en cache local');
    
    // Sincronizar con cloud
    if (isSupabaseConfigured()) {
      console.log('☁️ Sincronizando contenido con Supabase...');
      const success = await saveContentToSupabase(content);
      if (success) {
        console.log('✅ Contenido sincronizado con Supabase');
        updateCacheTimestamp();
      } else {
        console.error('❌ Error al sincronizar con Supabase');
      }
      return success;
    }
    return true;
  },

  // ==================== PROYECTOS ====================

  getProjects: (initial: Project[]): Project[] => {
    return getFromCache(CACHE_PROJECTS, initial);
  },

  getProjectsAsync: async (initial: Project[]): Promise<Project[]> => {
    if (isSupabaseConfigured()) {
      try {
        console.log('🔄 Solicitando proyectos de Supabase...');
        const cloudProjects = await fetchProjects();
        console.log('📦 Proyectos recibidos:', cloudProjects.length);
        if (cloudProjects.length > 0) {
          console.log('✅ Usando proyectos de Supabase');
          saveToCache(CACHE_PROJECTS, cloudProjects);
          updateCacheTimestamp();
          return cloudProjects;
        } else {
          console.log('⚠️ Supabase retornó 0 proyectos, usando datos locales');
        }
      } catch (e) {
        console.error('❌ Error fetching projects from cloud:', e);
      }
    }
    return getFromCache(CACHE_PROJECTS, initial);
  },

  saveProjects: async (projects: Project[]): Promise<boolean> => {
    saveToCache(CACHE_PROJECTS, projects);
    console.log('💾 Proyectos guardados en cache local:', projects.length);
    
    if (isSupabaseConfigured()) {
      console.log('☁️ Sincronizando proyectos con Supabase...');
      const success = await saveProjectsToSupabase(projects);
      if (success) {
        console.log('✅ Proyectos sincronizados con Supabase');
        updateCacheTimestamp();
      } else {
        console.error('❌ Error al sincronizar proyectos con Supabase');
      }
      return success;
    }
    return true;
  },

  // ==================== GALERÍA ====================

  getGallery: (initial: GalleryImage[]): GalleryImage[] => {
    const cached = getFromCache<GalleryImage[]>(CACHE_GALLERY, initial);
    // Sanitizar datos
    return cached.map(img => ({
      id: String(img.id || Date.now() + Math.random()),
      url: img.url || '',
      name: img.name || 'Sin nombre',
      category: img.category || 'Otros',
      deleteUrl: img.deleteUrl,
      createdAt: img.createdAt || new Date().toISOString()
    })).filter(img => img.url);
  },

  getGalleryAsync: async (initial: GalleryImage[]): Promise<GalleryImage[]> => {
    if (isSupabaseConfigured()) {
      try {
        const cloudGallery = await fetchGallery();
        if (cloudGallery.length > 0) {
          saveToCache(CACHE_GALLERY, cloudGallery);
          updateCacheTimestamp();
          return cloudGallery;
        }
      } catch (e) {
        console.error('Error fetching gallery from cloud:', e);
      }
    }
    return db.getGallery(initial);
  },

  saveGallery: async (images: GalleryImage[]): Promise<boolean> => {
    saveToCache(CACHE_GALLERY, images);
    
    if (isSupabaseConfigured()) {
      const success = await saveGalleryToSupabase(images);
      if (success) updateCacheTimestamp();
      return success;
    }
    return true;
  },

  addGalleryImage: async (image: GalleryImage): Promise<boolean> => {
    const current = db.getGallery([]);
    const updated = [image, ...current];
    saveToCache(CACHE_GALLERY, updated);
    
    if (isSupabaseConfigured()) {
      return await saveGalleryImage(image);
    }
    return true;
  },

  deleteGalleryImage: async (id: string): Promise<boolean> => {
    const current = db.getGallery([]);
    const updated = current.filter(img => img.id !== id);
    saveToCache(CACHE_GALLERY, updated);
    
    if (isSupabaseConfigured()) {
      return await deleteGalleryFromDB(id);
    }
    return true;
  },

  // ==================== TESTIMONIOS ====================

  getTestimonials: (initial: Testimonial[]): Testimonial[] => {
    return getFromCache(CACHE_TESTIMONIALS, initial);
  },

  getTestimonialsAsync: async (initial: Testimonial[], approvedOnly = true): Promise<Testimonial[]> => {
    if (isSupabaseConfigured()) {
      try {
        const cloudTestimonials = await fetchTestimonials(approvedOnly);
        if (cloudTestimonials.length > 0) {
          saveToCache(CACHE_TESTIMONIALS, cloudTestimonials);
          updateCacheTimestamp();
          return cloudTestimonials;
        }
      } catch (e) {
        console.error('Error fetching testimonials from cloud:', e);
      }
    }
    return getFromCache(CACHE_TESTIMONIALS, initial);
  },

  saveTestimonials: async (testimonials: Testimonial[]): Promise<boolean> => {
    saveToCache(CACHE_TESTIMONIALS, testimonials);
    
    if (isSupabaseConfigured()) {
      const success = await saveTestimonialsToSupabase(testimonials);
      if (success) updateCacheTimestamp();
      return success;
    }
    return true;
  },

  // ==================== TEMAS ====================

  getThemes: (initial: ThemeConfig[]): ThemeConfig[] => {
    return getFromCache(CACHE_THEMES, initial);
  },

  getThemesAsync: async (initial: ThemeConfig[]): Promise<ThemeConfig[]> => {
    if (isSupabaseConfigured()) {
      try {
        const cloudThemes = await fetchThemes();
        if (cloudThemes.length > 0) {
          saveToCache(CACHE_THEMES, cloudThemes);
          updateCacheTimestamp();
          return cloudThemes;
        }
      } catch (e) {
        console.error('Error fetching themes from cloud:', e);
      }
    }
    return getFromCache(CACHE_THEMES, initial);
  },

  // ==================== ANALYTICS ====================

  trackPageView: (page: string, projectId?: number): void => {
    if (isSupabaseConfigured()) {
      logPageView(page, projectId);
    }
  },

  trackSectionView: (sectionId: string): void => {
    if (isSupabaseConfigured()) {
      logSectionView(sectionId);
    }
  },

  trackContact: async (
    name: string,
    email: string,
    phone: string,
    message: string,
    interest?: string,
    projectId?: number
  ): Promise<boolean> => {
    if (isSupabaseConfigured()) {
      return await logContact(name, email, phone, message, interest, projectId);
    }
    return true;
  },

  // ==================== ANALYTICS LOCALES (secciones) ====================
  
  getSectionAnalytics: (): Record<string, { views: number; clicks: number; timeSpent: number }> => {
    try {
      const stored = localStorage.getItem('terraviva_section_analytics');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  trackSectionClick: (sectionId: string): void => {
    try {
      const analytics = db.getSectionAnalytics();
      if (!analytics[sectionId]) {
        analytics[sectionId] = { views: 0, clicks: 0, timeSpent: 0 };
      }
      analytics[sectionId].clicks++;
      localStorage.setItem('terraviva_section_analytics', JSON.stringify(analytics));
    } catch {}
  },

  trackSectionTime: (sectionId: string, seconds: number): void => {
    try {
      const analytics = db.getSectionAnalytics();
      if (!analytics[sectionId]) {
        analytics[sectionId] = { views: 0, clicks: 0, timeSpent: 0 };
      }
      analytics[sectionId].timeSpent += seconds;
      localStorage.setItem('terraviva_section_analytics', JSON.stringify(analytics));
    } catch {}
  },

  // ==================== UTILIDADES ====================

  clearCache: (): void => {
    try {
      localStorage.removeItem(CACHE_CONTENT);
      localStorage.removeItem(CACHE_PROJECTS);
      localStorage.removeItem(CACHE_GALLERY);
      localStorage.removeItem(CACHE_TESTIMONIALS);
      localStorage.removeItem(CACHE_THEMES);
      localStorage.removeItem(CACHE_TIMESTAMP);
    } catch {}
  },

  refreshFromCloud: async (): Promise<void> => {
    if (!isSupabaseConfigured()) return;
    
    try {
      // Refrescar todo desde Supabase
      const [content, projects, gallery, testimonials, themes] = await Promise.all([
        fetchContent(),
        fetchProjects(),
        fetchGallery(),
        fetchTestimonials(true),
        fetchThemes()
      ]);

      if (content) saveToCache(CACHE_CONTENT, content);
      if (projects.length) saveToCache(CACHE_PROJECTS, projects);
      if (gallery.length) saveToCache(CACHE_GALLERY, gallery);
      if (testimonials.length) saveToCache(CACHE_TESTIMONIALS, testimonials);
      if (themes.length) saveToCache(CACHE_THEMES, themes);
      
      updateCacheTimestamp();
    } catch (e) {
      console.error('Error refreshing from cloud:', e);
    }
  }
};

export default db;
