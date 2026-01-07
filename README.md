# 🏠 TERRA VIVA GRUPO INMOBILIARIO SAC
## Ecosistema Digital Inmobiliario

![Terra Viva Logo](https://i.ibb.co/ccxRGx7m/logo2.png)

---

## 📋 RESUMEN EJECUTIVO

**Proyecto:** Plataforma Web Inmobiliaria de Alto Rendimiento  
**Cliente:** Terra Viva Grupo Inmobiliario SAC  
**Representante:** Sr. Percy Washington Human Vargas  
**Ubicación:** Wanchaq, Cusco, Perú  
**Fecha de Entrega:** Diciembre 2025  

**Equipo de Desarrollo:**
- **Yamilet Diana Zanabria Huaman** - Diseño Multimedia y Gestión de Contenidos
- **Robert Dante Prado Quispe** - Desarrollo Tecnológico y Estrategia SEM

---

## 🌐 ENLACES DE PRODUCCIÓN

| Entorno | URL |
|---------|-----|
| **Producción** | [terra-viva-grupo-inmobiliario-sac.vercel.app](https://terra-viva-grupo-inmobiliario-sac.vercel.app) |
| **Preview** | [terra-viva-grupo-inmobiliario-8j2sou7sc.vercel.app](https://terra-viva-grupo-inmobiliario-8j2sou7sc.vercel.app) |
| **Vercel Dashboard** | [vercel.com/dantes-projects](https://vercel.com/dantes-projects-3c04c53e/terra-viva-grupo-inmobiliario-s) |

---

## 🚀 CARACTERÍSTICAS PRINCIPALES

### 1. Catálogo de Propiedades Dinámico
- ✅ Galería de imágenes con carrusel interactivo
- ✅ Filtros por tipo (Casa, Terreno, Departamento) y estado (Venta, Alquiler)
- ✅ Buscador por nombre y ubicación
- ✅ Vista en Grid y Lista
- ✅ Detalle de propiedad con precios en S/. y USD
- ✅ Integración con Google Maps

### 2. Sistema de Contacto Multicanal
- ✅ Formulario de contacto con validación
- ✅ Integración con WhatsApp API (click-to-chat)
- ✅ Click-to-call para llamadas directas
- ✅ Envío de correo electrónico

### 3. Panel de Administración
- ✅ Gestión de propiedades (CRUD completo)
- ✅ Editor de contenido enriquecido (WYSIWYG)
- ✅ Configuración de temas visuales
- ✅ Gestión de documentos legales
- ✅ Dashboard de analíticas
- ✅ **Biblioteca de imágenes con CRUD**
- ✅ **Gestión de testimonios (aprobar/editar/eliminar)**
- ✅ **Sincronización híbrida (Supabase + LocalStorage)**

### 4. Chatbot con Inteligencia Artificial
- ✅ Asistente virtual con Google Gemini AI
- ✅ Respuestas personalizadas sobre propiedades
- ✅ Atención 24/7 automatizada

### 5. Diseño Premium
- ✅ Interfaz moderna con gradientes vibrantes
- ✅ Animaciones fluidas y microinteracciones
- ✅ 100% responsivo (móvil, tablet, desktop)
- ✅ **Modo oscuro/claro con toggle**
- ✅ Optimizado para SEO

---

## 🛠️ STACK TECNOLÓGICO

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| **Frontend** | React.js | 19.1.0 |
| **Bundler** | Vite | 6.4.1 |
| **Lenguaje** | TypeScript | 5.8.3 |
| **Estilos** | Tailwind CSS | 4.1.10 |
| **Iconos** | Lucide React | 0.513.0 |
| **Base de Datos** | Supabase | 2.49.4 |
| **AI/Chatbot** | Google Gemini AI | 0.14.1 |
| **Hosting** | Vercel | - |
| **SSL** | Let's Encrypt (Automático) | - |

---

## 📁 ESTRUCTURA DEL PROYECTO

```
terra-viva-grupo-inmobiliario-sac/
├── 📂 src/                        # Código fuente
│   ├── 📂 components/             # Componentes React (26)
│   │   ├── About.tsx
│   │   ├── AboutModal.tsx          # Modal de información
│   │   ├── AdminDashboard.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── CareersModal.tsx        # Modal de empleos
│   │   ├── ChatAssistant.tsx
│   │   ├── Contact.tsx
│   │   ├── DarkModeToggle.tsx      # Toggle modo oscuro
│   │   ├── DevBadge.tsx
│   │   ├── DevTools.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── ImageGallery.tsx        # CRUD de imágenes
│   │   ├── Layout.tsx
│   │   ├── LegalView.tsx
│   │   ├── Login.tsx
│   │   ├── PostSaleView.tsx
│   │   ├── ProjectDetailView.tsx
│   │   ├── Projects.tsx
│   │   ├── PromotionModal.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── Testimonials.tsx
│   │   ├── TestimonialsManager.tsx # CRUD de testimonios
│   │   └── Services.tsx
│   ├── 📂 services/               # Lógica de negocio
│   │   ├── geminiService.ts
│   │   ├── storage.ts
│   │   └── supabase.ts
│   ├── App.tsx                    # Componente principal
│   ├── index.tsx                  # Entry point
│   ├── index.css                  # Estilos globales
│   ├── types.ts                   # Tipos TypeScript
│   └── vite-env.d.ts              # Tipos de Vite
│
├── 📂 database/                   # Scripts SQL
│   └── setup.sql
│
├── 📂 docs/                       # Documentación
│   ├── MANUAL_USUARIO.md
│   ├── GUIA_DESPLIEGUE.md
│   └── GITHUB_UPLOAD.md
│
├── index.html                     # HTML base con SEO
├── vite.config.ts                 # Configuración Vite
├── tsconfig.json                  # Configuración TypeScript
├── package.json                   # Dependencias
├── .env.example                   # Template de variables
├── .gitignore                     # Archivos ignorados
└── README.md                      # Este archivo
```

---

## 🔧 CONFIGURACIÓN E INSTALACIÓN

### Requisitos Previos
- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase (opcional, para base de datos)
- API Key de Google Gemini (opcional, para chatbot)

### Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/terra-viva-grupo-inmobiliario-sac.git
cd terra-viva-grupo-inmobiliario-sac

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir en navegador
# http://localhost:3000
```

### Variables de Entorno

```env
# Base de datos (Supabase)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Chatbot IA (Google Gemini)
VITE_GEMINI_API_KEY=tu-api-key

# Modo desarrollo
VITE_DEV_MODE=true
```

---

## 🚀 DESPLIEGUE EN PRODUCCIÓN

### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar a preview
vercel

# Desplegar a producción
vercel --prod
```

### Opción 2: Build Manual

```bash
# Generar build de producción
npm run build

# Los archivos estarán en /dist
# Subir a cualquier servidor estático (Netlify, AWS S3, etc.)
```

---

## 📊 FUNCIONALIDADES DETALLADAS

### 🏠 Gestión de Propiedades

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | Identificador único |
| `title` | string | Nombre de la propiedad |
| `location` | string | Ubicación (ej: Wanchaq, Cusco) |
| `price` | string | Precio en Soles |
| `priceUSD` | string | Precio en Dólares |
| `area` | string | Área total (m²) |
| `type` | string | Tipo (Casa/Terreno/Departamento) |
| `status` | string | Estado (En Venta/Alquiler) |
| `bedrooms` | number | Número de habitaciones |
| `bathrooms` | number | Número de baños |
| `parkingSpots` | number | Estacionamientos |
| `image` | string | URL imagen principal |
| `gallery` | string[] | URLs galería de fotos |
| `features` | string[] | Características |
| `googleMapsEmbedUrl` | string | URL de mapa embebido |

### 🔍 Sistema de Búsqueda

- Búsqueda por texto (nombre, ubicación, descripción)
- Filtro por tipo de propiedad
- Filtro por estado (Venta/Alquiler)
- Cambio de vista (Grid/Lista)
- Contador de resultados en tiempo real

### 💬 Chatbot Inteligente

- Modelo: Google Gemini AI
- Contexto: Información de todas las propiedades
- Funciones:
  - Responder consultas sobre propiedades
  - Recomendar opciones según preferencias
  - Proporcionar información de contacto
  - Asistencia 24/7

---

## 🎨 GUÍA DE ESTILOS

### Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Azul Acero | `#1e3a5f` | Color primario, header |
| Naranja Vibrante | `#f97316` | CTAs, acentos |
| Rojo | `#ef4444` | Gradientes con naranja |
| Verde WhatsApp | `#22c55e` | Botón WhatsApp |
| Slate 900 | `#0f172a` | Fondos oscuros |
| White | `#ffffff` | Fondos claros |

### Tipografía

- **Font Family:** Inter, system-ui, sans-serif
- **Títulos:** font-black (900)
- **Subtítulos:** font-bold (700)
- **Cuerpo:** font-normal (400)

### Componentes UI

```css
/* Botón Primario */
.btn-primary {
  background: linear-gradient(135deg, #f97316, #ef4444);
  color: white;
  border-radius: 12px;
  padding: 16px 32px;
  font-weight: bold;
}

/* Tarjeta de Propiedad */
.property-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}
```

---

## 📈 MÉTRICAS DE RENDIMIENTO

### Lighthouse Scores (Estimados)

| Métrica | Score |
|---------|-------|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 100 |
| SEO | 95+ |

### Tiempos de Carga

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3s

---

## 🔒 SEGURIDAD

- ✅ HTTPS/SSL obligatorio (Let's Encrypt)
- ✅ Sanitización de inputs
- ✅ Variables de entorno para claves sensibles
- ✅ Row Level Security (RLS) en Supabase
- ✅ Sin exposición de credenciales en código

---

## 📞 INFORMACIÓN DE CONTACTO

| Canal | Detalle |
|-------|---------|
| **Teléfono** | 913 328 866 |
| **Email** | contacto@terravivagrupo.com |
| **WhatsApp** | [+51 913 328 866](https://wa.me/51913328866) |
| **Ubicación** | Wanchaq, Cusco, Perú |
| **Horario** | Lun-Vie 9AM-6PM, Sáb 9AM-1PM |

---

## 📄 LICENCIA Y PROPIEDAD

**© 2025 Terra Viva Grupo Inmobiliario SAC**

Este proyecto es propiedad exclusiva de Terra Viva Grupo Inmobiliario SAC. 
El código fuente, diseño y contenido están protegidos por derechos de autor.

---

## 🛠️ SOPORTE TÉCNICO

### Clasificación de Incidencias

| Tipo | Descripción | Tiempo de Respuesta |
|------|-------------|---------------------|
| **CRÍTICO** | Web caída, fallo de seguridad | 2 horas (24/7) |
| **REGULAR** | Cambios de texto, fotos | 24-48 horas hábiles |

### Mantenimiento Incluido

- ✅ Monitoreo de uptime del servidor
- ✅ Renovación de certificados SSL
- ✅ 1 actualización mensual de contenido
- ✅ Backups automáticos

---

## 📚 DOCUMENTACIÓN ADICIONAL

- [Guía de Despliegue](./GUIA_DESPLIEGUE.md)
- [Manual de Usuario](./MANUAL_USUARIO.md)
- [Configuración de Base de Datos](./database/setup.sql)

---

**Desarrollado con ❤️ para Terra Viva Grupo Inmobiliario SAC**

*Versión 2.0.0 - Diciembre 2024*
