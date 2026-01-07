/**
 * Datos iniciales de la aplicación
 * Estos datos se usan como fallback cuando Supabase no está configurado
 */

import { Project, SiteContent, ThemeConfig } from '../types';

// ==================== CONFIGURACIÓN DE TEMAS ====================
export const THEMES: ThemeConfig[] = [
    // === TEMAS INSTITUCIONALES ===
    {
        id: 'terra-professional',
        name: 'Terra Viva Profesional',
        colors: {
            primary: '#2c3e50',
            secondary: '#1a252f',
            accent: '#c45c26',
            background: '#f8f9fa',
            text: '#2c3e50'
        }
    },
    {
        id: 'terra-classic',
        name: 'Terra Viva Clásico',
        colors: {
            primary: '#8b4513',
            secondary: '#654321',
            accent: '#d2691e',
            background: '#faf8f5',
            text: '#3d2914'
        }
    },
    {
        id: 'terra-modern',
        name: 'Terra Viva Moderno',
        colors: {
            primary: '#1e3a5f',
            secondary: '#0d2137',
            accent: '#e67e22',
            background: '#ffffff',
            text: '#1e3a5f'
        }
    },
    // === TEMAS FESTIVOS PERÚ ===
    {
        id: 'fiestas-patrias',
        name: '🇵🇪 Fiestas Patrias (28 Julio)',
        colors: {
            primary: '#D91023',
            secondary: '#8B0000',
            accent: '#FFFFFF',
            background: '#FFF5F5',
            text: '#8B0000'
        }
    },
    {
        id: 'navidad',
        name: '🎄 Navidad',
        colors: {
            primary: '#165B33',
            secondary: '#0D3B20',
            accent: '#BB2528',
            background: '#F8FFF8',
            text: '#165B33'
        }
    },
    {
        id: 'ano-nuevo',
        name: '🎆 Año Nuevo',
        colors: {
            primary: '#1A1A2E',
            secondary: '#16213E',
            accent: '#FFD700',
            background: '#F5F5FF',
            text: '#1A1A2E'
        }
    },
    {
        id: 'inti-raymi',
        name: '☀️ Inti Raymi (24 Junio)',
        colors: {
            primary: '#FF8C00',
            secondary: '#CD6600',
            accent: '#FFD700',
            background: '#FFFAF0',
            text: '#8B4513'
        }
    },
    {
        id: 'semana-santa',
        name: '✝️ Semana Santa',
        colors: {
            primary: '#4A0E4E',
            secondary: '#2D0A2E',
            accent: '#E8D4A8',
            background: '#FAF5FF',
            text: '#4A0E4E'
        }
    },
    {
        id: 'dia-madre',
        name: '💐 Día de la Madre (May)',
        colors: {
            primary: '#FF69B4',
            secondary: '#DB7093',
            accent: '#FFB6C1',
            background: '#FFF0F5',
            text: '#C71585'
        }
    },
    {
        id: 'halloween',
        name: '🎃 Halloween',
        colors: {
            primary: '#FF6600',
            secondary: '#1A1A1A',
            accent: '#8B00FF',
            background: '#1A1A1A',
            text: '#FF6600'
        }
    },
    {
        id: 'san-valentin',
        name: '❤️ San Valentín',
        colors: {
            primary: '#E31B54',
            secondary: '#9B1B4A',
            accent: '#FF6B8A',
            background: '#FFF5F7',
            text: '#9B1B4A'
        }
    },
    {
        id: 'corpus-christi',
        name: '⛪ Corpus Christi (Cusco)',
        colors: {
            primary: '#8B4513',
            secondary: '#5D2E0C',
            accent: '#FFD700',
            background: '#FFFAF0',
            text: '#5D2E0C'
        }
    },
    {
        id: 'senor-temblores',
        name: '🙏 Señor de los Temblores',
        colors: {
            primary: '#4A0E4E',
            secondary: '#2D0A2E',
            accent: '#B8860B',
            background: '#F5F0FA',
            text: '#4A0E4E'
        }
    }
];

// ==================== PROYECTOS DE EJEMPLO ====================
export const INITIAL_PROJECTS: Project[] = [
    {
        id: 1,
        title: "Edificio Comercial de Estreno – Av. Huayruropata",
        location: "Av. Huayruropata, Wanchaq, Cusco",
        description: "Edificio nuevo, moderno y funcional para uso comercial y corporativo. Ideal para empresas, instituciones, clínicas, bancos, academias o franquicias. Tres niveles independientes: Primer nivel con 2 locales comerciales con SSHH propios y pozo a tierra. Segundo y tercer nivel con plantas libres de 230 m² cada una, perfectas para oficinas corporativas, consultorios, coworking o salas de capacitación. Alta visibilidad comercial en zona de mayor tránsito vehicular y peatonal.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
        status: 'En Alquiler',
        type: 'alquiler',
        price: 'Consultar',
        priceUSD: '',
        area: '690 m² (3 niveles)',
        bedrooms: 0,
        bathrooms: 6,
        parkingSpots: 0,
        features: ['Inmueble de Estreno', 'Frontis Amplio', 'Alta Visibilidad', 'Infraestructura Moderna', 'Excelente Conectividad', '3 Niveles Independientes', 'Pozo a Tierra', 'Ideal Uso Comercial/Corporativo'],
        floorPlanImage: '',
        googleMapsEmbedUrl: 'https://maps.app.goo.gl/SgHSK1e4h726FhedA?g_st=ac',
        gallery: []
    },
    {
        id: 2,
        title: "Casa en Venta – Av. La Justicia",
        location: "Asociación San Francisco, Av. La Justicia, Wanchaq, Cusco",
        description: "Casa de 2 pisos con aproximadamente 270 m². Zona residencial consolidada con acceso a servicios, transporte y comercios. Distribución: 6 habitaciones, 3 baños, 2 cocinas y 2 comedores. Ideal para familias numerosas, vivienda + negocio, o inversión para alquiler.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
        status: 'En Venta',
        type: 'venta',
        price: 'Consultar',
        priceUSD: '',
        area: '270 m²',
        bedrooms: 6,
        bathrooms: 3,
        parkingSpots: 0,
        features: ['2 Pisos', '6 Habitaciones', '3 Baños', '2 Cocinas', '2 Comedores', 'Zona Residencial', 'Ideal Familia + Negocio', 'Inversión para Alquiler'],
        floorPlanImage: '',
        googleMapsEmbedUrl: 'https://maps.app.goo.gl/jvX2Hbm6uoUnD9Yf9?g_st=ac',
        gallery: []
    },
    {
        id: 3,
        title: "Departamentos en Venta – Urb. Las Orquídeas",
        location: "Urb. Las Orquídeas, al costado del Aeropuerto, Cusco",
        description: "2 departamentos disponibles en 3er y 4to nivel. Ubicación estratégica al costado del Aeropuerto Internacional Alejandro Velasco Astete, zona con alta proyección y valorización. Cada departamento cuenta con: 2 habitaciones, 2 baños, sala-comedor y cocina. Ideal para vivienda familiar, alquiler tradicional o temporal, e inversión inmobiliaria.",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=80",
        status: 'En Venta',
        type: 'venta',
        price: 'Consultar',
        priceUSD: '',
        area: 'Por definir',
        bedrooms: 2,
        bathrooms: 2,
        parkingSpots: 0,
        features: ['2 Departamentos Disponibles', '3er y 4to Nivel', '2 Habitaciones c/u', '2 Baños c/u', 'Sala-Comedor', 'Cocina', 'Cerca al Aeropuerto', 'Alta Valorización', 'Ideal Inversión'],
        floorPlanImage: '',
        googleMapsEmbedUrl: 'https://maps.app.goo.gl/swEqHHvzV2Rw9H8R7',
        gallery: []
    }
];

// ==================== CONTENIDO INICIAL DEL SITIO ====================
export const INITIAL_CONTENT: SiteContent = {
    companyName: "Terra Viva Grupo Inmobiliario SAC",
    logoText: "TERRA VIVA",
    logoUrl: "https://i.ibb.co/ccxRGx7m/logo2.png",
    themeId: 'terra-professional',
    tagline: "Precios de ocasión en tu propiedad soñada",
    promotion: {
        isActive: false,
        title: "Oportunidad de Inversión",
        subtitle: "Propiedades con documentos saneados en SUNARP.",
        discount: "Asesoría Jurídica Incluida",
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80",
        promotionType: 'descuento' as const,
        badgeText: "Oferta Especial",
        ctaText: "Más Información",
        whatsappMessage: "Hola, vi la promoción en su página web y me gustaría más información.",
        showDiscount: true
    },
    hero: {
        title: "TERRA VIVA SAC",
        subtitle: "GRUPO INMOBILIARIO",
        description: "Precios de ocasión en tu propiedad soñada. Asesoría jurídica incluida.",
        imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
    },
    about: {
        title: "Tu Nuevo Aliado Inmobiliario en Cusco",
        description: "Somos una empresa cusqueña joven y dinámica, fundada con el propósito de brindar seguridad jurídica y transparencia total. Nos especializamos exclusivamente en propiedades con documentación saneada en SUNARP, garantizando que tu inversión esté protegida desde el primer día.",
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80"
    },
    contact: {
        address: "Cusco, Perú",
        phone: "913 328 866",
        email: "terravivasuport@gmail.com"
    },
    socials: {
        facebook: "https://facebook.com/terraviva",
        instagram: "https://instagram.com/terraviva",
        linkedin: "#",
        twitter: "#",
        tiktok: "https://www.tiktok.com/@terravidag"
    },
    legal: {
        termsAndConditions: "<h2>Términos y Condiciones</h2><p>La información mostrada sobre las propiedades es referencial.</p>",
        privacyPolicy: "<h2>Política de Privacidad</h2><p>Respetamos su privacidad y protegemos sus datos.</p>",
        whistleblowing: "<h2>Canal de Atención</h2><p>Para reclamos o sugerencias contacte al administrador.</p>"
    },
    postSale: {
        title: "Atención al Cliente",
        description: "Acompañamiento continuo después de la compra.",
        emergencyPhone: "913 328 866",
        schedule: "Lun - Vie 09:00 - 18:00",
        manualUrl: "#"
    },
    chatConfig: {
        botName: "TerraBot",
        welcomeMessage: "¡Hola! 👋 Soy tu asesor experto de Terra Viva. ¿Buscas casa, depa o terreno?",
        systemInstruction: "Eres el asistente de ventas de Terra Viva. Sé profesional y conciso.",
        apiKey: ""
    },
    sections: [
        { 
            id: 'hero', 
            name: 'Portada Principal', 
            enabled: true, 
            order: 1,
            title: 'Tu Hogar Ideal en Cusco',
            subtitle: 'Propiedades saneadas e inscritas en SUNARP',
            description: 'Encuentra casas, departamentos y terrenos con documentación al día y precios de oportunidad.',
            backgroundImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80',
            ctaText: 'Ver Propiedades',
            layout: 'centered'
        },
        { 
            id: 'projects', 
            name: 'Proyectos / Propiedades', 
            enabled: true, 
            order: 2,
            title: 'Nuestras Propiedades',
            subtitle: 'Encuentra tu próxima inversión',
            description: 'Explora nuestra selección de propiedades verificadas y con documentación saneada.',
            backgroundColor: '#f8fafc',
            layout: 'default'
        },
        { 
            id: 'services', 
            name: 'Servicios', 
            enabled: true, 
            order: 3,
            title: 'Nuestros Servicios',
            subtitle: 'Soluciones inmobiliarias integrales',
            description: 'Ofrecemos asesoría completa en compra, venta, alquiler y saneamiento legal de propiedades.',
            backgroundColor: '#1e293b',
            textColor: '#ffffff',
            layout: 'default'
        },
        { 
            id: 'testimonials', 
            name: 'Testimonios', 
            enabled: true, 
            order: 4,
            title: 'Lo Que Dicen Nuestros Clientes',
            subtitle: 'Experiencias reales de satisfacción',
            description: 'Conoce las historias de quienes confiaron en nosotros para encontrar su hogar ideal.',
            backgroundColor: '#ffffff',
            layout: 'centered'
        },
        { 
            id: 'contact', 
            name: 'Contacto', 
            enabled: true, 
            order: 5,
            title: 'Contáctanos',
            subtitle: 'Estamos para ayudarte',
            description: 'Déjanos tus datos y un asesor se comunicará contigo en menos de 24 horas.',
            backgroundColor: '#0f172a',
            textColor: '#ffffff',
            layout: 'default'
        }
    ]
};

// ==================== TESTIMONIOS DE EJEMPLO ====================
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

export const INITIAL_TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: "María García",
        location: "Wanchaq, Cusco",
        rating: 5,
        comment: "Excelente servicio. Nos ayudaron a encontrar el departamento perfecto con todos los documentos en orden. El proceso fue rápido y transparente.",
        propertyType: "Departamento",
        isApproved: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: "Carlos Quispe",
        location: "San Sebastián, Cusco",
        rating: 5,
        comment: "Muy profesionales. La asesoría legal incluida nos dio tranquilidad. Recomiendo Terra Viva al 100%.",
        propertyType: "Terreno",
        isApproved: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        name: "Ana López",
        location: "Santiago, Cusco",
        rating: 4,
        comment: "Buena atención y propiedades de calidad. El equipo siempre disponible para resolver dudas.",
        propertyType: "Casa",
        isApproved: true,
        createdAt: new Date().toISOString()
    }
];

// ==================== GALERÍA DE IMÁGENES ====================
export interface GalleryImage {
    id: string;
    url: string;
    name: string;
    category: string;
    createdAt: string;
}

export const INITIAL_GALLERY: GalleryImage[] = [
    {
        id: '1',
        url: "https://i.ibb.co/ccxRGx7m/logo2.png",
        name: "Logo Terra Viva",
        category: "logos",
        createdAt: new Date().toISOString()
    }
];

