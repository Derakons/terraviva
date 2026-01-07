import React from 'react';
import { Helmet } from 'react-helmet-async';

// Configuración base del sitio
const SITE_CONFIG = {
  name: 'Terra Viva Grupo Inmobiliario',
  tagline: 'Tu hogar ideal en Cusco',
  description: 'Inmobiliaria líder en Cusco, Perú. Venta y alquiler de casas, departamentos y terrenos con documentos saneados en SUNARP. Asesoría legal incluida.',
  url: 'https://terravivaperu.vercel.app',
  image: 'https://i.ibb.co/ccxRGx7m/logo2.png',
  ogImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=630&fit=crop',
  phone: '+51913328866',
  email: 'terravivasuport@gmail.com',
  address: {
    street: '',
    city: 'Cusco',
    region: 'Cusco',
    country: 'PE',
    postalCode: '08000'
  },
  social: {
    facebook: 'https://facebook.com/terravivagrupo',
    instagram: 'https://instagram.com/terravivagrupo',
    whatsapp: 'https://wa.me/51913328866'
  }
};

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'place';
  noindex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
  };
  product?: {
    price?: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
}

// Componente principal SEO
export const SEO: React.FC<SEOProps> = ({
  title,
  description = SITE_CONFIG.description,
  keywords = [],
  image = SITE_CONFIG.ogImage,
  url = SITE_CONFIG.url,
  type = 'website',
  noindex = false,
  article,
  product,
  breadcrumbs
}) => {
  // Título optimizado con marca
  const fullTitle = title 
    ? `${title} | ${SITE_CONFIG.name}` 
    : `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`;
  
  // Palabras clave por defecto + personalizadas
  const defaultKeywords = [
    'inmobiliaria cusco',
    'venta casas cusco',
    'departamentos cusco',
    'terrenos cusco',
    'alquiler cusco',
    'airbnb cusco',
    'propiedades cusco',
    'bienes raíces cusco',
    'terra viva',
    'inmobiliaria peru',
    'comprar casa cusco',
    'invertir en cusco'
  ];
  
  const allKeywords = [...new Set([...defaultKeywords, ...keywords])].join(', ');
  
  // URL canónica limpia (sin parámetros de tracking)
  const canonicalUrl = url.split('?')[0].split('#')[0];

  return (
    <Helmet>
      {/* Meta básicos */}
      <html lang="es" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={SITE_CONFIG.name} />
      
      {/* Control de indexación */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      
      {/* URL Canónica */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Geo Tags para SEO Local */}
      <meta name="geo.region" content="PE-CUS" />
      <meta name="geo.placename" content="Cusco" />
      <meta name="geo.position" content="-13.531950;-71.967463" />
      <meta name="ICBM" content="-13.531950, -71.967463" />
      
      {/* Idioma y región */}
      <meta name="language" content="Spanish" />
      <meta name="content-language" content="es-PE" />
      <link rel="alternate" hrefLang="es-pe" href={canonicalUrl} />
      <link rel="alternate" hrefLang="es" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content="es_PE" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />
      
      {/* Artículo específico */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
        </>
      )}
      
      {/* Producto específico */}
      {product && (
        <>
          <meta property="product:price:amount" content={product.price?.toString()} />
          <meta property="product:price:currency" content={product.currency || 'PEN'} />
          <meta property="product:availability" content={product.availability || 'InStock'} />
        </>
      )}
      
      {/* Performance hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* PWA / Mobile */}
      <meta name="theme-color" content="#7C3AED" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={SITE_CONFIG.name} />
      <meta name="application-name" content={SITE_CONFIG.name} />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" href={SITE_CONFIG.image} />
      <link rel="apple-touch-icon" href={SITE_CONFIG.image} />
    </Helmet>
  );
};

// Schema.org JSON-LD para Organización
export const OrganizationSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    alternateName: 'Terra Viva Inmobiliaria',
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: SITE_CONFIG.image,
      width: 200,
      height: 200
    },
    image: SITE_CONFIG.ogImage,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.region,
      addressCountry: SITE_CONFIG.address.country,
      postalCode: SITE_CONFIG.address.postalCode
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -13.531950,
      longitude: -71.967463
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Cusco',
        '@id': 'https://www.wikidata.org/wiki/Q190736'
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Región Cusco'
      }
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: -13.531950,
        longitude: -71.967463
      },
      geoRadius: '100000'
    },
    priceRange: '$$',
    currenciesAccepted: 'PEN, USD',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00'
      }
    ],
    sameAs: [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.whatsapp
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Propiedades en Cusco',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Casas en Venta'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Departamentos en Venta'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Terrenos en Venta'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Propiedades en Alquiler'
        }
      ]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Schema.org para Website con SearchAction
export const WebsiteSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    publisher: {
      '@id': `${SITE_CONFIG.url}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/buscar?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'es-PE'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Schema.org para Breadcrumbs
interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Schema.org para Propiedad Individual
interface PropertySchemaProps {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image: string[];
  address: string;
  propertyType: 'House' | 'Apartment' | 'Land';
  bedrooms?: number;
  bathrooms?: number;
  floorSize?: number;
  url: string;
}

export const PropertySchema: React.FC<PropertySchemaProps> = ({
  name,
  description,
  price,
  currency = 'PEN',
  image,
  address,
  propertyType,
  bedrooms,
  bathrooms,
  floorSize,
  url
}) => {
  const schemaType = propertyType === 'Land' ? 'LandForSale' : 'RealEstateListing';
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name,
    description,
    url,
    image,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      seller: {
        '@id': `${SITE_CONFIG.url}/#organization`
      }
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'Cusco',
      addressRegion: 'Cusco',
      addressCountry: 'PE'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -13.531950,
      longitude: -71.967463
    },
    ...(propertyType !== 'Land' && {
      numberOfRooms: bedrooms,
      numberOfBathroomsTotal: bathrooms,
      floorSize: floorSize ? {
        '@type': 'QuantitativeValue',
        value: floorSize,
        unitCode: 'MTK'
      } : undefined
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Schema.org para FAQ
interface FAQSchemaProps {
  questions: Array<{ question: string; answer: string }>;
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ questions }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Schema.org para Servicios Locales
export const LocalBusinessSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_CONFIG.url}/#localbusiness`,
    name: SITE_CONFIG.name,
    image: SITE_CONFIG.image,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    url: SITE_CONFIG.url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cusco',
      addressRegion: 'Cusco',
      addressCountry: 'PE'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -13.531950,
      longitude: -71.967463
    },
    priceRange: '$$',
    areaServed: 'Cusco, Perú'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Hook para generar SEO de páginas de proyectos
export const useProjectSEO = (project: {
  name: string;
  description: string;
  type: string;
  price?: string;
  images: string[];
  location: string;
}) => {
  const keywords = [
    project.type.toLowerCase(),
    `${project.type.toLowerCase()} cusco`,
    `comprar ${project.type.toLowerCase()}`,
    project.location.toLowerCase(),
    `propiedades ${project.location.toLowerCase()}`
  ];

  return {
    title: project.name,
    description: project.description.slice(0, 160),
    keywords,
    image: project.images[0],
    type: 'product' as const,
    product: {
      price: project.price ? parseFloat(project.price.replace(/[^0-9.]/g, '')) : undefined,
      currency: 'PEN',
      availability: 'InStock' as const
    }
  };
};

export { SITE_CONFIG };
