// ==================== TIPOS DE PROPIEDADES ====================

export type PropertyType = 'venta' | 'alquiler' | 'airbnb' | 'compra' | 'terreno';
export type PropertyStatus = 'En Venta' | 'En Alquiler' | 'Alquiler Temporal' | 'En Construcción' | 'Entregado';

export interface Project {
  id: number;
  title: string;
  location: string;
  description: string;
  image: string;
  status: PropertyStatus;
  type: PropertyType;
  // Precios
  price: string;
  priceUSD?: string; // Precio en dólares (opcional)
  pricePerNight?: string; // Para AirBnB
  // Características físicas
  area: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  // Extras
  features: string[];
  floorPlanImage: string;
  googleMapsEmbedUrl: string;
  gallery: string[];
}

// ==================== SERVICIOS ====================

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

// ==================== CHAT ====================

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// ==================== CONFIGURACIÓN ====================

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  tiktok?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export interface PromotionConfig {
  isActive: boolean;
  title: string;
  subtitle: string;
  discount: string;
  imageUrl: string;
  // Nuevos campos para mayor personalización
  promotionType: 'descuento' | 'alquiler' | 'venta' | 'evento' | 'otro';
  badgeText: string;
  ctaText: string;
  whatsappMessage: string;
  showDiscount: boolean;
}

export interface LegalContent {
  termsAndConditions: string;
  privacyPolicy: string;
  whistleblowing: string;
}

export interface PostSaleContent {
  title: string;
  description: string;
  emergencyPhone: string;
  schedule: string;
  manualUrl: string;
}

export interface ChatConfig {
  botName: string;
  welcomeMessage: string;
  systemInstruction: string;
  apiKey: string;
}

// ==================== SECCIONES DEL SITIO ====================

export type SectionType = 'hero' | 'projects' | 'services' | 'testimonials' | 'contact';

export interface SectionConfig {
  id: SectionType;
  name: string;
  enabled: boolean;
  order: number;
  // Contenido editable
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  ctaText?: string;
  ctaLink?: string;
  layout?: 'default' | 'centered' | 'left' | 'right' | 'full-width';
  showDivider?: boolean;
  customCss?: string;
}

export interface SectionAnalytics {
  sectionId: SectionType;
  views: number;
  clicks: number;
  timeSpent: number; // segundos promedio
  lastUpdated: string;
}

// ==================== CONTENIDO DEL SITIO ====================

export interface SiteContent {
  companyName: string;
  logoText: string;
  logoUrl?: string;
  themeId: string;
  tagline?: string; // Propuesta de valor: "Precios de ocasión..."
  promotion: PromotionConfig;
  hero: {
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
  };
  about: {
    title: string;
    description: string;
    imageUrl: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  socials: SocialLinks;
  legal: LegalContent;
  postSale: PostSaleContent;
  chatConfig: ChatConfig;
  sections: SectionConfig[];
}

// ==================== NAVEGACIÓN ====================

export enum NavSection {
  HOME = 'home',
  PROJECTS = 'projects',
  ABOUT = 'about',
  SERVICES = 'services',
  CONTACT = 'contact'
}

export type ViewState = 'website' | 'login' | 'admin' | 'terms' | 'privacy' | 'denuncias' | 'postsale' | 'project-detail';

// ==================== FILTROS DE BÚSQUEDA ====================

export interface PropertyFilters {
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  location?: string;
}