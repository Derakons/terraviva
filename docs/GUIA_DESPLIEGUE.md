# 🚀 Guía de Despliegue - Terra Viva Grupo Inmobiliario SAC

## 📋 Resumen del Proyecto
- **Tecnología:** React + Vite + TypeScript
- **Base de datos:** Supabase (PostgreSQL gratuito)
- **Tipo:** Aplicación web SPA
- **Hosting recomendado:** Vercel (gratis)

---

## 🔧 Paso 1: Configurar Base de Datos (Supabase)

### 1.1 Crear cuenta en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto (elige una región cercana, ej: São Paulo)
3. Espera 2-3 minutos mientras se crea

### 1.2 Crear las tablas
1. Ve al **SQL Editor** en tu proyecto de Supabase
2. Copia y pega el contenido de `database/setup.sql`
3. Haz clic en **Run** para ejecutar
4. ✅ Verás "Base de datos configurada correctamente"

### 1.3 Obtener credenciales
1. Ve a **Settings** → **API**
2. Copia estos valores:
   - **Project URL** (ej: `https://abc123.supabase.co`)
   - **anon/public** key (empieza con `eyJhbG...`)

---

## 🌐 Paso 2: Desplegar en Vercel (Recomendado)

### 2.1 Preparar el proyecto
```bash
# Instalar dependencias
npm install

# Verificar que compile sin errores
npm run build
```

### 2.2 Subir a Vercel
**Opción A - CLI (más rápido):**
```bash
npm install -g vercel
vercel
```
Sigue las instrucciones en pantalla.

**Opción B - Dashboard:**
1. Ve a [vercel.com](https://vercel.com) y conecta tu GitHub
2. Importa el repositorio
3. Vercel detectará Vite automáticamente

### 2.3 Configurar Variables de Entorno
En Vercel dashboard → Tu proyecto → **Settings** → **Environment Variables**

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://tuproyecto.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1...` |
| `VITE_GEMINI_API_KEY` | Tu API key de Gemini (opcional) |

⚠️ **IMPORTANTE:** Después de agregar variables, haz un **redeploy** para que tomen efecto.

---

## 📊 Paso 3: Verificar el Dashboard

1. Accede a tu sitio desplegado
2. Ve al panel de administración (Footer → ícono de admin)
3. Credenciales por defecto: admin / admin123 
4. El Dashboard de Analytics mostrará estadísticas una vez configurado Supabase

---

## 🔐 Seguridad Post-Despliegue

### Certificado SSL (prod-ca-2021)
Supabase utiliza el certificado `prod-ca-2021` para todas las conexiones seguras a PostgreSQL.

**Características de seguridad incluidas:**
- ✅ Todas las conexiones son cifradas con TLS 1.2+
- ✅ El cliente JavaScript usa HTTPS automáticamente
- ✅ El certificado está incluido en `certificates/prod-ca-2021.crt`
- ✅ Row Level Security (RLS) habilitado en todas las tablas

**Para conexiones directas a PostgreSQL (psql, DBeaver, etc.):**
```bash
# Descargar el certificado desde Supabase Dashboard
# Settings → Database → SSL Configuration → Download Certificate

# Conectar con SSL verificado
psql "sslmode=verify-full sslrootcert=./prod-ca-2021.crt host=db.tuproyecto.supabase.co"
```

### Habilitar Enforcement de SSL en Supabase
1. Ve a **Settings** → **Database** → **SSL Configuration**
2. Activa **Enforce SSL on incoming connections**
3. Los clientes sin SSL serán rechazados

### Cambiar credenciales de admin
En el componente `Login.tsx`, cambia las credenciales hardcodeadas por validación contra Supabase Auth.

### Habilitar autenticación en Supabase (opcional)
1. Ve a **Authentication** → **Providers**
2. Habilita Email/Password
3. Actualiza el componente Login para usar Supabase Auth

---

## 📁 Estructura de Archivos Clave

```
terra-viva-grupo-inmobiliario-sac/
├── components/
│   ├── AdminDashboard.tsx    # Panel de administración
│   ├── AnalyticsDashboard.tsx # Dashboard de estadísticas
│   └── ...
├── services/
│   ├── storage.ts            # Servicio híbrido (local/cloud)
│   └── supabase.ts           # Cliente de Supabase
├── database/
│   └── setup.sql             # Script para crear tablas
├── .env.example              # Variables de entorno de ejemplo
└── vite.config.ts            # Configuración de Vite
```

---

## 🆘 Solución de Problemas

### "Base de datos no configurada"
- Verifica que las variables de entorno estén correctas
- Asegúrate de haber hecho redeploy después de agregarlas

### "Error al cargar estadísticas"
- Verifica que ejecutaste el SQL de setup
- Revisa las políticas RLS en Supabase

### Página en blanco
- Abre la consola del navegador (F12)
- Revisa si hay errores de CORS o API

### Las imágenes no cargan
- Usa URLs de imágenes públicas (Unsplash, etc.)
- Evita URLs locales o bloqueadas

---

## � Costos

| Servicio | Plan Gratis | Límites |
|----------|-------------|---------|
| **Vercel** | Hobby (gratis) | 100GB bandwidth/mes |
| **Supabase** | Free tier | 500MB database, 2GB storage |
| **Gemini API** | Gratis con límites | 60 requests/min |

✅ **Costo total para empezar: $0**

---

## 📞 Soporte

Si necesitas ayuda adicional, contacta al desarrollador o revisa la documentación oficial de:
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/docs)
- [Vercel](https://vercel.com/docs)

---

**¡Listo para producción!** 🎉
