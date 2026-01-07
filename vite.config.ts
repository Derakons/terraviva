import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';

// Configuración del sitio para SEO
const SITE_URL = 'https://terravivaperu.vercel.app';
const SITE_NAME = 'Terra Viva Grupo Inmobiliario';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProduction = mode === 'production';

  return {
    // Root del código fuente
    root: '.',

    // Configuración del servidor de desarrollo
    server: {
      port: 3000,
      host: '0.0.0.0',
      open: true,
    },

    // Plugins con SEO optimizado
    plugins: [
      react(),
      
      // Compresión Gzip para mejor TTFB
      viteCompression({
        verbose: true,
        disable: !isProduction,
        threshold: 10240, // Solo archivos > 10KB
        algorithm: 'gzip',
        ext: '.gz'
      }),
      
      // Compresión Brotli (mejor que gzip)
      viteCompression({
        verbose: true,
        disable: !isProduction,
        threshold: 10240,
        algorithm: 'brotliCompress',
        ext: '.br'
      }),
      
      // Inyección de HTML optimizada para SEO
      createHtmlPlugin({
        minify: isProduction,
        inject: {
          data: {
            title: SITE_NAME,
            description: 'Inmobiliaria líder en Cusco. Venta y alquiler de propiedades con documentos saneados.',
            injectScript: isProduction ? `
              <!-- Google Tag Manager -->
              <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXX');</script>
            ` : ''
          }
        }
      })
    ],

    // Variables de entorno expuestas al cliente
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    },

    // Resolución de alias
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@services': path.resolve(__dirname, './src/services'),
      }
    },

    // Configuración de build optimizada para SEO y Performance
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: false,
      outDir: 'dist',
      cssMinify: true,
      cssCodeSplit: true,
      // Mejora el caché del navegador
      assetsInlineLimit: 4096, // Archivos < 4KB se convierten en base64
      rollupOptions: {
        output: {
          // Chunking avanzado para mejor caché
          manualChunks(id) {
            // React core - cambia raramente
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            // Supabase - backend SDK
            if (id.includes('node_modules/@supabase')) {
              return 'supabase-vendor';
            }
            // Iconos - librería pesada
            if (id.includes('node_modules/lucide-react')) {
              return 'icons-vendor';
            }
            // SEO y Helmet
            if (id.includes('node_modules/react-helmet-async')) {
              return 'seo-vendor';
            }
            // Google AI
            if (id.includes('node_modules/@google')) {
              return 'google-vendor';
            }
            // Otros vendors
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          // Nombres de archivo con hash para cache-busting
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(ext)) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            if (/css/i.test(ext)) {
              return 'assets/css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          }
        }
      },
      chunkSizeWarningLimit: 500,
      // Reportar tamaños comprimidos
      reportCompressedSize: true
    },

    // Optimizaciones de dependencias
    optimizeDeps: {
      include: ['react', 'react-dom', '@supabase/supabase-js', 'lucide-react', 'react-helmet-async']
    },

    // Headers de preview para SEO testing
    preview: {
      port: 4173,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block'
      }
    }
  };
});
