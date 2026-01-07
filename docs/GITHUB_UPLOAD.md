# 🚀 GUÍA RÁPIDA PARA SUBIR A GITHUB

## Terra Viva Grupo Inmobiliario SAC

---

## ✅ VERIFICACIÓN PRE-SUBIDA

El proyecto está listo con:

- [x] Build de producción exitoso
- [x] Estructura organizada (`src/`, `docs/`, `database/`)
- [x] `.gitignore` configurado
- [x] Variables sensibles protegidas (`.env.local` NO se sube)
- [x] Documentación completa

---

## 📂 ESTRUCTURA FINAL

```
terra-viva-grupo-inmobiliario-sac/
├── src/                    # Código fuente (28 archivos)
│   ├── components/         # 20 componentes React
│   └── services/           # 3 servicios
├── database/               # Scripts SQL
├── docs/                   # Documentación
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

**Root limpio:** Solo 9 archivos + 4 carpetas

---

## 📋 COMANDOS PARA GITHUB

### Paso 1: Instalar Git
https://git-scm.com/download/windows

### Paso 2: Configurar Git
```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Paso 3: Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre: `terra-viva-grupo-inmobiliario-sac`
3. NO marcar "Add README"
4. Crear repositorio

### Paso 4: Subir proyecto
```powershell
cd "C:\Users\LENOVO\Desktop\terra-viva-grupo-inmobiliario-sac"

git init
git add .
git commit -m "🚀 Initial commit - Terra Viva v1.0.0"
git remote add origin https://github.com/TU_USUARIO/terra-viva-grupo-inmobiliario-sac.git
git branch -M main
git push -u origin main
```

---

## ⚠️ ARCHIVOS EXCLUIDOS (en .gitignore)

- `node_modules/` - Se instalan con `npm install`
- `.env.local` - Claves secretas
- `dist/` - Build de producción

---

## 🔗 DESPUÉS DE SUBIR

1. **Vercel:** https://vercel.com/new → Importar repo
2. **Variables de entorno:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`  
   - `VITE_GEMINI_API_KEY`

---

**Versión 1.0.0 | Diciembre 2025**
