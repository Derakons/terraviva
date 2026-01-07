/**
 * Supabase Client v2 - Base de datos PostgreSQL principal
 * 
 * CONFIGURACIÓN:
 * 1. Crea cuenta gratuita en https://supabase.com
 * 2. Crea un nuevo proyecto
 * 3. Ejecuta database/setup_v2.sql en el SQL Editor
 * 4. Copia las credenciales a .env.local o Vercel
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Project, SiteContent, ThemeConfig, PropertyType } from '../types';

// ==================== CONFIGURACIÓN ====================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        global: {
            headers: { 'X-Client-Info': 'terra-viva-web@2.0.0' }
        }
    });
}

export const isSupabaseConfigured = (): boolean => {
    const configured = !!(SUPABASE_URL && SUPABASE_ANON_KEY && supabase);
    if (configured) {
        console.log('☁️ Supabase configurado:', SUPABASE_URL);
    } else {
        console.log('📦 Supabase NO configurado - usando almacenamiento local');
    }
    return configured;
};

// Verificar conexión y tablas
export const testConnection = async (): Promise<{ connected: boolean; tables: string[]; error?: string }> => {
    if (!supabase) return { connected: false, tables: [], error: 'Cliente no inicializado' };
    
    try {
        // Intentar leer de site_content para verificar que las tablas existen
        const { data, error } = await supabase.from('site_content').select('id').limit(1);
        
        if (error) {
            console.error('❌ Error de conexión:', error.message);
            return { connected: false, tables: [], error: error.message };
        }
        
        console.log('✅ Conexión exitosa a Supabase');
        return { connected: true, tables: ['site_content', 'projects', 'gallery', 'testimonials', 'contacts', 'analytics', 'themes'] };
    } catch (e: any) {
        console.error('❌ Error de conexión:', e.message);
        return { connected: false, tables: [], error: e.message };
    }
};

export const getSupabaseClient = () => supabase;

// ==================== MAPEO DE CAMPOS ====================

const mapProjectFromDB = (db: any): Project => ({
    id: db.id,
    title: db.title || '',
    location: db.location || '',
    description: db.description || '',
    image: db.image || '',
    status: db.status || 'En Venta',
    type: (db.type as PropertyType) || 'venta',
    price: db.price || '',
    priceUSD: db.price_usd || '',
    pricePerNight: db.price_per_night || '',
    area: db.area || '',
    bedrooms: db.bedrooms || 0,
    bathrooms: db.bathrooms || 0,
    parkingSpots: db.parking_spots || 0,
    features: db.features || [],
    floorPlanImage: db.floor_plan_image || '',
    googleMapsEmbedUrl: db.google_maps_embed_url || '',
    gallery: db.gallery || []
});

const mapProjectToDB = (p: Project): any => ({
    id: p.id,
    title: p.title,
    location: p.location,
    description: p.description,
    image: p.image,
    status: p.status,
    type: p.type || 'venta',
    price: p.price,
    price_usd: p.priceUSD,
    price_per_night: p.pricePerNight,
    area: p.area,
    bedrooms: p.bedrooms || 0,
    bathrooms: p.bathrooms || 0,
    parking_spots: p.parkingSpots || 0,
    features: p.features || [],
    floor_plan_image: p.floorPlanImage,
    google_maps_embed_url: p.googleMapsEmbedUrl,
    gallery: p.gallery || []
});

// ==================== CONTENIDO DEL SITIO ====================

export const fetchContent = async (): Promise<SiteContent | null> => {
    if (!supabase) return null;
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('id', 1)
            .single();
        if (error) throw error;
        return data?.content as SiteContent;
    } catch (e) {
        console.error('Error fetching content:', e);
        return null;
    }
};

export const saveContentToSupabase = async (content: SiteContent): Promise<boolean> => {
    if (!supabase) return false;
    try {
        const { error } = await supabase
            .from('site_content')
            .upsert({ id: 1, content, updated_at: new Date().toISOString() });
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Error saving content:', e);
        return false;
    }
};

// ==================== TEMAS ====================

export const fetchThemes = async (): Promise<ThemeConfig[]> => {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from('themes')
            .select('*')
            .order('is_festive', { ascending: true });
        if (error) throw error;
        return (data || []).map((t: any) => ({
            id: t.id,
            name: t.name,
            colors: t.colors
        }));
    } catch (e) {
        console.error('Error fetching themes:', e);
        return [];
    }
};

export const saveTheme = async (theme: ThemeConfig): Promise<boolean> => {
    if (!supabase) return false;
    try {
        const { error } = await supabase.from('themes').upsert({
            id: theme.id,
            name: theme.name,
            colors: theme.colors
        });
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Error saving theme:', e);
        return false;
    }
};

// ==================== PROYECTOS ====================

export const fetchProjects = async (): Promise<Project[]> => {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('is_active', true)
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map(mapProjectFromDB);
    } catch (e) {
        console.error('Error fetching projects:', e);
        return [];
    }
};

export const fetchAllProjects = async (): Promise<Project[]> => {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map(mapProjectFromDB);
    } catch (e) {
        console.error('Error fetching all projects:', e);
        return [];
    }
};

export const fetchProjectsByType = async (type: PropertyType): Promise<Project[]> => {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('type', type)
            .eq('is_active', true)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map(mapProjectFromDB);
    } catch (e) {
        console.error('Error fetching projects by type:', e);
        return [];
    }
};

export const getProjectById = async (id: number): Promise<Project | null> => {
    if (!supabase) return null;
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data ? mapProjectFromDB(data) : null;
    } catch (e) {
        console.error('Error fetching project:', e);
        return null;
    }
};

export const saveProject = async (project: Project): Promise<Project | null> => {
    if (!supabase) return null;
    try {
        const dbProject = mapProjectToDB(project);
        const { id, ...data } = dbProject;
        
        if (id && id > 0) {
            const { error } = await supabase
                .from('projects')
                .update(data)
                .eq('id', id);
            if (error) throw error;
            return project;
        } else {
            const { data: newData, error } = await supabase
                .from('projects')
                .insert(data)
                .select()
                .single();
            if (error) throw error;
            return newData ? mapProjectFromDB(newData) : null;
        }
    } catch (e) {
        console.error('Error saving project:', e);
        return null;
    }
};

export const deleteProject = async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    try {
        const { error } = await supabase
            .from('projects')
            .update({ is_active: false })
            .eq('id', id);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Error deleting project:', e);
        return false;
    }
};

export const saveProjectsToSupabase = async (projects: Project[]): Promise<boolean> => {
    if (!supabase) return false;
    try {
        for (const project of projects) {
            await saveProject(project);
        }
        return true;
    } catch (e) {
        console.error('Error saving projects:', e);
        return false;
    }
};

// ==================== GALERÍA ====================

export interface GalleryImage {
    id: string;
    url: string;
    name: string;
    category: string;
    deleteUrl?: string;
    createdAt: string;
}

export const fetchGallery = async (): Promise<GalleryImage[]> => {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map((g: any) => ({
            id: g.id,
            url: g.url,
            name: g.name,
            category: g.category || 'Otros',
            deleteUrl: g.delete_url,
            createdAt: g.created_at
        }));
    } catch (e) {
        console.error('Error fetching gallery:', e);
        return [];
    }
};

export const saveGalleryImage = async (image: GalleryImage): Promise<boolean> => {
    if (!supabase) return false;
    try {
        const { error } = await supabase.from('gallery').upsert({
            id: image.id,
            url: image.url,
            name: image.name,
            category: image.category,
            delete_url: image.deleteUrl,
            created_at: image.createdAt || new Date().toISOString()
        });
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Error saving gallery image:', e);
        return false;
    }
};

export const deleteGalleryImage = async (id: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Error deleting gallery image:', e);
        return false;
    }
};

export const saveGalleryToSupabase = async (images: GalleryImage[]): Promise<boolean> => {
    if (!supabase) return false;
    try {
        for (const img of images) {
            await saveGalleryImage(img);
        }
        return true;
    } catch (e) {
        console.error('Error syncing gallery:', e);
        return false;
    }
};

// ==================== TESTIMONIOS ====================

export interface Testimonial {
    id: number;
    name: string;
    location: string;
    rating: number;
    comment: string;
    propertyType: string;
    avatarUrl?: string;
    isApproved: boolean;
    createdAt: string;
}

export const fetchTestimonials = async (approvedOnly = true): Promise<Testimonial[]> => {
    if (!supabase) return [];
    try {
        let query = supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (approvedOnly) {
            query = query.eq('is_approved', true);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        
        return (data || []).map((t: any) => ({
            id: t.id,
            name: t.name,
            location: t.location || '',
            rating: t.rating || 5,
            comment: t.comment,
            propertyType: t.property_type || 'Casa',
            avatarUrl: t.avatar_url,
            isApproved: t.is_approved,
            createdAt: t.created_at
        }));
    } catch (e) {
        console.error('Error fetching testimonials:', e);
        return [];
    }
};

export const submitTestimonial = async (testimonial: {
    name: string;
    location: string;
    rating: number;
    comment: string;
    propertyType: string;
}): Promise<boolean> => {
    if (!supabase) return false;
    try {
        const { error } = await supabase.from('testimonials').insert({
            name: testimonial.name,
            location: testimonial.location,
            rating: testimonial.rating,
            comment: testimonial.comment,
            property_type: testimonial.propertyType,
            is_approved: false
        });
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Error submitting testimonial:', e);
        return false;
    }
};

export const approveTestimonial = async (id: number, approved: boolean): Promise<boolean> => {
    if (!supabase) return false;
    try {
        const { error } = await supabase
            .from('testimonials')
            .update({ is_approved: approved })
            .eq('id', id);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Error updating testimonial:', e);
        return false;
    }
};

export const deleteTestimonial = async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Error deleting testimonial:', e);
        return false;
    }
};

export const saveTestimonialsToSupabase = async (testimonials: Testimonial[]): Promise<boolean> => {
    if (!supabase) return false;
    try {
        for (const t of testimonials) {
            await supabase.from('testimonials').upsert({
                id: t.id,
                name: t.name,
                location: t.location,
                rating: t.rating,
                comment: t.comment,
                property_type: t.propertyType,
                avatar_url: t.avatarUrl,
                is_approved: t.isApproved
            });
        }
        return true;
    } catch (e) {
        console.error('Error saving testimonials:', e);
        return false;
    }
};

// ==================== CONTACTOS ====================

export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    interest: string;
    projectId?: number;
    projectTitle?: string;
    isRead: boolean;
    isConverted: boolean;
    notes: string;
    createdAt: string;
}

export const fetchContacts = async (): Promise<Contact[]> => {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from('contacts')
            .select('*, projects(title)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email || '',
            phone: c.phone || '',
            message: c.message || '',
            interest: c.interest || '',
            projectId: c.project_id,
            projectTitle: c.projects?.title,
            isRead: c.is_read,
            isConverted: c.is_converted,
            notes: c.notes || '',
            createdAt: c.created_at
        }));
    } catch (e) {
        console.error('Error fetching contacts:', e);
        return [];
    }
};

export const logContact = async (
    name: string,
    email: string,
    phone: string,
    message: string,
    interest?: string,
    projectId?: number
): Promise<boolean> => {
    if (!supabase) return false;
    try {
        const { error } = await supabase.from('contacts').insert({
            name, email, phone, message, interest,
            project_id: projectId
        });
        if (error) throw error;
        
        await supabase.from('analytics').insert({
            event_type: 'contact_form',
            project_id: projectId
        });
        
        return true;
    } catch (e) {
        console.error('Error saving contact:', e);
        return false;
    }
};

export const markContactRead = async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    try {
        const { error } = await supabase
            .from('contacts')
            .update({ is_read: true })
            .eq('id', id);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Error marking contact read:', e);
        return false;
    }
};

// ==================== ANALYTICS ====================

export const logPageView = async (page: string, projectId?: number): Promise<void> => {
    if (!supabase) return;
    try {
        await supabase.from('analytics').insert({
            event_type: 'page_view',
            page,
            project_id: projectId || null
        });
        if (projectId) {
            await supabase.rpc('increment_project_views', { project_id_param: projectId });
        }
    } catch (e) {
        console.error('Error logging page view:', e);
    }
};

export const logSectionView = async (sectionId: string): Promise<void> => {
    if (!supabase) return;
    try {
        await supabase.from('analytics').insert({
            event_type: 'section_view',
            section_id: sectionId
        });
    } catch (e) {
        console.error('Error logging section view:', e);
    }
};

export const logEvent = async (
    eventType: 'whatsapp_click' | 'call_click' | 'email_click' | 'search' | 'filter',
    metadata?: Record<string, any>
): Promise<void> => {
    if (!supabase) return;
    try {
        await supabase.from('analytics').insert({
            event_type: eventType,
            metadata
        });
    } catch (e) {
        console.error('Error logging event:', e);
    }
};

export interface DashboardStats {
    totalViews: number;
    totalContacts: number;
    totalProjects: number;
    conversionRate: number;
    projectViews: { projectId: number; views: number; title: string }[];
    recentContacts: Contact[];
    dailyViews: { date: string; count: number }[];
    unreadContacts: number;
}

export const getDashboardStats = async (): Promise<DashboardStats | null> => {
    if (!supabase) return null;
    try {
        const { count: totalViews } = await supabase
            .from('analytics')
            .select('*', { count: 'exact', head: true })
            .eq('event_type', 'page_view');

        const { count: totalContacts } = await supabase
            .from('contacts')
            .select('*', { count: 'exact', head: true });

        const { count: unreadContacts } = await supabase
            .from('contacts')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false);

        const { count: totalProjects } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);

        const { data: projectsData } = await supabase
            .from('projects')
            .select('id, title, views_count')
            .eq('is_active', true)
            .order('views_count', { ascending: false })
            .limit(10);

        const contacts = await fetchContacts();
        const recentContacts = contacts.slice(0, 10);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: dailyViewsData } = await supabase
            .from('analytics')
            .select('created_at')
            .eq('event_type', 'page_view')
            .gte('created_at', sevenDaysAgo.toISOString());

        const dailyMap = new Map<string, number>();
        (dailyViewsData || []).forEach((item: any) => {
            const date = item.created_at.split('T')[0];
            dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
        });

        const conversionRate = totalViews && totalViews > 0
            ? ((totalContacts || 0) / totalViews) * 100
            : 0;

        return {
            totalViews: totalViews || 0,
            totalContacts: totalContacts || 0,
            totalProjects: totalProjects || 0,
            unreadContacts: unreadContacts || 0,
            conversionRate: Math.round(conversionRate * 100) / 100,
            projectViews: (projectsData || []).map((p: any) => ({
                projectId: p.id,
                views: p.views_count || 0,
                title: p.title
            })),
            recentContacts,
            dailyViews: Array.from(dailyMap.entries())
                .map(([date, count]) => ({ date, count }))
                .sort((a, b) => a.date.localeCompare(b.date))
        };
    } catch (e) {
        console.error('Error fetching stats:', e);
        return null;
    }
};

export const incrementProjectViews = async (projectId: number): Promise<void> => {
    if (!supabase) return;
    try {
        await supabase.rpc('increment_project_views', { project_id_param: projectId });
    } catch (e) {
        console.error('Error incrementing views:', e);
    }
};

export default supabase;
