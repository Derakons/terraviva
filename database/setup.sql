-- ============================================
-- SETUP DE BASE DE DATOS SUPABASE
-- Para Terra Viva Grupo Inmobiliario SAC
-- ============================================
-- Instrucciones:
-- 1. Ve a tu proyecto en Supabase (https://supabase.com)
-- 2. Ve a SQL Editor
-- 3. Copia y pega todo este código
-- 4. Ejecuta (Run)
-- ============================================

-- ============================
-- TABLA: Contenido del Sitio
-- ============================
CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- ============================
-- TABLA: Propiedades/Proyectos
-- ============================
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  -- Información básica
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image TEXT,
  
  -- Tipo y Estado
  type TEXT DEFAULT 'venta' CHECK (type IN ('venta', 'alquiler', 'airbnb', 'compra')),
  status TEXT DEFAULT 'En Venta' CHECK (status IN ('En Venta', 'En Alquiler', 'Alquiler Temporal', 'En Construcción', 'Entregado', 'Vendido')),
  
  -- Precios
  price TEXT, -- Precio en Soles
  price_usd TEXT, -- Precio en Dólares
  price_per_night TEXT, -- Para AirBnB
  
  -- Características físicas
  area TEXT,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  parking_spots INTEGER DEFAULT 0,
  
  -- Extras
  features TEXT[] DEFAULT '{}',
  floor_plan_image TEXT,
  google_maps_embed_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  
  -- Metadatos
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- TABLA: Contactos (Leads)
-- ============================
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT,
  interest TEXT, -- Tipo de interés (Comprar, Alquilar, etc.)
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'website',
  is_read BOOLEAN DEFAULT FALSE,
  is_converted BOOLEAN DEFAULT FALSE, -- Si el lead se convirtió en venta
  notes TEXT, -- Notas internas del administrador
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- TABLA: Analytics
-- ============================
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'contact_form', 'project_view', 'whatsapp_click', 'call_click', 'email_click', 'search', 'filter')),
  page TEXT,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  search_query TEXT, -- Para búsquedas
  filter_type TEXT, -- Para filtros aplicados
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- TABLA: Testimonios/Reseñas
-- ============================
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  property_type TEXT DEFAULT 'Casa',
  avatar_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- ÍNDICES para rendimiento
-- ============================
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_location ON projects(location);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_project_id ON analytics(project_id);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contacts(is_read);
CREATE INDEX IF NOT EXISTS idx_contacts_project_id ON contacts(project_id);

CREATE INDEX IF NOT EXISTS idx_testimonials_is_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at);

-- ============================
-- FUNCIONES de utilidad
-- ============================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para projects
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para site_content
DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para incrementar contador de vistas
CREATE OR REPLACE FUNCTION increment_project_views(project_id_param INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE projects 
  SET views_count = views_count + 1 
  WHERE id = project_id_param;
END;
$$ LANGUAGE plpgsql;

-- ============================
-- SEGURIDAD (RLS)
-- ============================
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para contenido y proyectos activos
DROP POLICY IF EXISTS "Public read for site_content" ON site_content;
CREATE POLICY "Public read for site_content" ON site_content
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for projects" ON projects;
CREATE POLICY "Public read for active projects" ON projects
  FOR SELECT USING (is_active = true);

-- Políticas de escritura para usuarios autenticados
DROP POLICY IF EXISTS "Authenticated write for site_content" ON site_content;
CREATE POLICY "Authenticated write for site_content" ON site_content
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated write for projects" ON projects;
CREATE POLICY "Authenticated write for projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Permitir inserción anónima en contacts y analytics
DROP POLICY IF EXISTS "Public insert for contacts" ON contacts;
CREATE POLICY "Public insert for contacts" ON contacts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert for analytics" ON analytics;
CREATE POLICY "Public insert for analytics" ON analytics
  FOR INSERT WITH CHECK (true);

-- Solo admin puede leer contacts y analytics
DROP POLICY IF EXISTS "Authenticated read for contacts" ON contacts;
CREATE POLICY "Authenticated read for contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated read for analytics" ON analytics;
CREATE POLICY "Authenticated read for analytics" ON analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para testimonios
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved testimonials" ON testimonials;
CREATE POLICY "Public read approved testimonials" ON testimonials
  FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Public insert testimonials" ON testimonials;
CREATE POLICY "Public insert testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage testimonials" ON testimonials;
CREATE POLICY "Authenticated manage testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================
-- DATOS INICIALES
-- ============================

-- Insertar contenido inicial si no existe
INSERT INTO site_content (id, content)
VALUES (1, '{
  "companyName": "Terra Viva Grupo Inmobiliario SAC",
  "logoText": "TERRA VIVA",
  "logoUrl": "https://i.ibb.co/ccxRGx7m/logo2.png",
  "themeId": "terra-red",
  "tagline": "Precios de ocasión en tu propiedad soñada",
  "contact": {
    "phone": "913 328 866",
    "email": "contacto@terravivagrupo.com",
    "address": "Cusco, Perú"
  }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insertar propiedades de ejemplo
INSERT INTO projects (title, location, description, image, type, status, price, price_usd, area, bedrooms, bathrooms, parking_spots, features, gallery, is_featured)
VALUES 
(
  'Departamento Urb. Las Orquídeas',
  'Urb. Las Orquídeas, Cusco',
  'Departamento 100% independizado con Partida Registral en SUNARP. Ubicación estratégica, ideal para vivienda o alquiler Airbnb.',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=80',
  'venta',
  'En Venta',
  '150,000',
  '40,000',
  '70 m²',
  2,
  1,
  1,
  ARRAY['Inscrito en SUNARP', 'Servicios Independientes', 'Cocina Amoblada', 'Roperos Empotrados'],
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
  true
),
(
  'Casa Urb. Magisterio - 200m²',
  'Urb. Magisterio, Cusco',
  'Hermosa casa familiar en la reconocida urbanización Magisterio. Documentación saneada en SUNARP. Perfecta para familia numerosa.',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=2000&q=80',
  'venta',
  'En Venta',
  '320,000',
  '85,000',
  '200 m²',
  3,
  2,
  2,
  ARRAY['Saneado en SUNARP', '3 Dormitorios', '2 Baños', 'Patio Amplio', 'Cochera Doble'],
  ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
  true
),
(
  'Terreno Urb. Santa Mónica',
  'Urb. Santa Mónica (Frente a Real Plaza)',
  'Terreno exclusivo frente al Real Plaza. 14 metros de frentera ideales para proyecto inmobiliario de alto impacto.',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80',
  'venta',
  'En Venta',
  '180,000',
  '48,000',
  '205 m²',
  0,
  0,
  0,
  ARRAY['Frontera de 14m', 'Frente a Real Plaza', 'Zona Residencial', 'Inscrito en RRPP'],
  ARRAY['https://images.unsplash.com/photo-1628744876497-eb30460be9f6?auto=format&fit=crop&w=800&q=80'],
  false
),
(
  'Departamento Alquiler - Wanchaq',
  'Av. La Cultura, Wanchaq',
  'Departamento amoblado listo para habitar. Ubicación céntrica cerca a universidades y hospitales.',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=80',
  'alquiler',
  'En Alquiler',
  '1,200',
  '320',
  '65 m²',
  2,
  1,
  0,
  ARRAY['Amoblado', 'Internet Incluido', 'Agua/Luz Independiente', 'Cerca a Universidades'],
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
  false
),
(
  'Suite AirBnB - Centro Histórico',
  'Centro Histórico de Cusco',
  'Suite ejecutiva para turistas y viajeros de negocios. A minutos de la Plaza de Armas. Totalmente equipada.',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=80',
  'airbnb',
  'Alquiler Temporal',
  '150',
  '40',
  '45 m²',
  1,
  1,
  0,
  ARRAY['WiFi Alta Velocidad', 'Cocina Equipada', 'Netflix Incluido', 'Check-in 24h', 'Vista a la Ciudad'],
  ARRAY['https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=800&q=80'],
  true
)
ON CONFLICT DO NOTHING;

-- ============================
-- VISTAS para reportes
-- ============================

-- Vista de resumen de propiedades
CREATE OR REPLACE VIEW properties_summary AS
SELECT 
  type,
  status,
  COUNT(*) as total,
  SUM(views_count) as total_views
FROM projects
WHERE is_active = true
GROUP BY type, status;

-- Vista de leads recientes
CREATE OR REPLACE VIEW recent_leads AS
SELECT 
  c.id,
  c.name,
  c.email,
  c.phone,
  c.interest,
  c.created_at,
  p.title as project_title
FROM contacts c
LEFT JOIN projects p ON c.project_id = p.id
ORDER BY c.created_at DESC
LIMIT 50;

-- ============================
-- MENSAJE DE ÉXITO
-- ============================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE '✅ BASE DE DATOS CONFIGURADA CORRECTAMENTE';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Tablas creadas:';
  RAISE NOTICE '  - site_content (configuración del sitio)';
  RAISE NOTICE '  - projects (propiedades inmobiliarias)';
  RAISE NOTICE '  - contacts (leads/formularios)';
  RAISE NOTICE '  - analytics (tracking de eventos)';
  RAISE NOTICE '';
  RAISE NOTICE '5 propiedades de ejemplo insertadas.';
  RAISE NOTICE '';
  RAISE NOTICE 'Recuerda copiar tus credenciales:';
  RAISE NOTICE '  - VITE_SUPABASE_URL';
  RAISE NOTICE '  - VITE_SUPABASE_ANON_KEY';
  RAISE NOTICE '============================================';
END $$;
