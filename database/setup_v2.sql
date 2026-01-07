-- ============================================
-- SETUP DE BASE DE DATOS SUPABASE v2
-- Para Terra Viva Grupo Inmobiliario SAC
-- ============================================
-- ACTUALIZACIÓN COMPLETA - Ejecutar en SQL Editor
-- ============================================

-- ============================
-- TABLA: Contenido del Sitio (JSONB completo)
-- ============================
DROP TABLE IF EXISTS site_content CASCADE;
CREATE TABLE site_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- ============================
-- TABLA: Configuración de Temas
-- ============================
DROP TABLE IF EXISTS themes CASCADE;
CREATE TABLE themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  colors JSONB NOT NULL DEFAULT '{}',
  is_festive BOOLEAN DEFAULT FALSE,
  festive_date TEXT, -- 'MM-DD' para activación automática
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- TABLA: Propiedades/Proyectos
-- ============================
DROP TABLE IF EXISTS projects CASCADE;
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image TEXT,
  type TEXT DEFAULT 'venta' CHECK (type IN ('venta', 'alquiler', 'airbnb', 'compra', 'terreno')),
  status TEXT DEFAULT 'En Venta' CHECK (status IN ('En Venta', 'En Alquiler', 'Alquiler Temporal', 'En Construcción', 'Entregado', 'Vendido')),
  price TEXT,
  price_usd TEXT,
  price_per_night TEXT,
  area TEXT,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  parking_spots INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  floor_plan_image TEXT,
  google_maps_embed_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- TABLA: Galería de Imágenes
-- ============================
DROP TABLE IF EXISTS gallery CASCADE;
CREATE TABLE gallery (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Otros',
  delete_url TEXT, -- Para ImgBB
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- TABLA: Testimonios/Reseñas
-- ============================
DROP TABLE IF EXISTS testimonials CASCADE;
CREATE TABLE testimonials (
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
-- TABLA: Contactos (Leads)
-- ============================
DROP TABLE IF EXISTS contacts CASCADE;
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT,
  interest TEXT,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'website',
  is_read BOOLEAN DEFAULT FALSE,
  is_converted BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- TABLA: Analytics
-- ============================
DROP TABLE IF EXISTS analytics CASCADE;
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'contact_form', 'project_view', 'whatsapp_click', 'call_click', 'email_click', 'search', 'filter', 'section_view', 'section_click')),
  page TEXT,
  section_id TEXT,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  search_query TEXT,
  filter_type TEXT,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- TABLA: Configuración de Secciones
-- ============================
DROP TABLE IF EXISTS section_config CASCADE;
CREATE TABLE section_config (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  background_image TEXT,
  background_color TEXT,
  text_color TEXT,
  cta_text TEXT,
  cta_link TEXT,
  layout TEXT DEFAULT 'default',
  show_divider BOOLEAN DEFAULT TRUE,
  custom_css TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
CREATE INDEX IF NOT EXISTS idx_analytics_section_id ON analytics(section_id);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contacts(is_read);

CREATE INDEX IF NOT EXISTS idx_testimonials_is_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);

-- ============================
-- FUNCIONES de utilidad
-- ============================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_section_config_updated_at ON section_config;
CREATE TRIGGER update_section_config_updated_at
  BEFORE UPDATE ON section_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para incrementar vistas
CREATE OR REPLACE FUNCTION increment_project_views(project_id_param INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE projects SET views_count = views_count + 1 WHERE id = project_id_param;
END;
$$ LANGUAGE plpgsql;

-- ============================
-- SEGURIDAD (RLS)
-- ============================
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_config ENABLE ROW LEVEL SECURITY;

-- Políticas de LECTURA pública
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read themes" ON themes FOR SELECT USING (true);
CREATE POLICY "Public read active projects" ON projects FOR SELECT USING (is_active = true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read approved testimonials" ON testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read section_config" ON section_config FOR SELECT USING (true);

-- Políticas de INSERCIÓN pública (forms)
CREATE POLICY "Public insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert analytics" ON analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert testimonials" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert gallery" ON gallery FOR INSERT WITH CHECK (true);

-- Políticas de ESCRITURA para anon (temporalmente para admin sin auth)
-- NOTA: En producción, cambiar a auth.role() = 'authenticated'
CREATE POLICY "Anon write site_content" ON site_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write themes" ON themes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write section_config" ON section_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon read contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Anon update contacts" ON contacts FOR UPDATE USING (true) WITH CHECK (true);

-- ============================
-- DATOS INICIALES: Temas
-- ============================
INSERT INTO themes (id, name, colors, is_festive, festive_date) VALUES
  ('terra-professional', 'Terra Viva Profesional', '{"primary":"#2c3e50","secondary":"#1a252f","accent":"#c45c26","background":"#f8f9fa","text":"#2c3e50"}', false, null),
  ('terra-classic', 'Terra Viva Clásico', '{"primary":"#8b4513","secondary":"#654321","accent":"#d2691e","background":"#faf8f5","text":"#3d2914"}', false, null),
  ('terra-modern', 'Terra Viva Moderno', '{"primary":"#1e3a5f","secondary":"#0d2137","accent":"#e67e22","background":"#ffffff","text":"#1e3a5f"}', false, null),
  ('fiestas-patrias', '🇵🇪 Fiestas Patrias', '{"primary":"#D91023","secondary":"#8B0000","accent":"#FFFFFF","background":"#FEF3F3","text":"#1a1a1a"}', true, '07-28'),
  ('navidad', '🎄 Navidad', '{"primary":"#165B33","secondary":"#0D3B1F","accent":"#BB2528","background":"#F8FFF8","text":"#1a1a1a"}', true, '12-25'),
  ('ano-nuevo', '🎆 Año Nuevo', '{"primary":"#1a1a2e","secondary":"#16213e","accent":"#FFD700","background":"#0f0f23","text":"#ffffff"}', true, '01-01'),
  ('inti-raymi', '☀️ Inti Raymi', '{"primary":"#B8860B","secondary":"#8B6914","accent":"#FF4500","background":"#FFFAF0","text":"#3d2914"}', true, '06-24'),
  ('semana-santa', '✝️ Semana Santa', '{"primary":"#4B0082","secondary":"#2E0854","accent":"#DAA520","background":"#F5F0FF","text":"#2d2d2d"}', true, '04-01'),
  ('dia-madre', '💐 Día de la Madre', '{"primary":"#C71585","secondary":"#8B0A50","accent":"#FF69B4","background":"#FFF0F5","text":"#2d2d2d"}', true, '05-12'),
  ('halloween', '🎃 Halloween', '{"primary":"#FF6600","secondary":"#CC5200","accent":"#1a1a1a","background":"#1a1a1a","text":"#FF6600"}', true, '10-31'),
  ('san-valentin', '💕 San Valentín', '{"primary":"#DC143C","secondary":"#B22222","accent":"#FFB6C1","background":"#FFF0F5","text":"#8B0000"}', true, '02-14')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  colors = EXCLUDED.colors,
  is_festive = EXCLUDED.is_festive,
  festive_date = EXCLUDED.festive_date;

-- ============================
-- DATOS INICIALES: Contenido del Sitio
-- ============================
INSERT INTO site_content (id, content) VALUES (1, '{
  "companyName": "Terra Viva Grupo Inmobiliario SAC",
  "logoText": "TERRA VIVA",
  "logoUrl": "https://i.ibb.co/ccxRGx7m/logo2.png",
  "themeId": "terra-professional",
  "tagline": "Precios de ocasión en tu propiedad soñada",
  "promotion": {
    "isActive": false,
    "title": "Oferta Especial",
    "subtitle": "Solo por tiempo limitado",
    "discount": "10%",
    "imageUrl": ""
  },
  "hero": {
    "title": "Tu Hogar Soñado Te Espera",
    "subtitle": "Encuentra la propiedad perfecta en Cusco",
    "description": "Más de 15 años de experiencia en el mercado inmobiliario cusqueño",
    "imageUrl": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
  },
  "about": {
    "title": "Sobre Nosotros",
    "description": "Terra Viva Grupo Inmobiliario SAC es una empresa líder en el sector inmobiliario de Cusco, dedicada a hacer realidad el sueño de tener un hogar propio.",
    "imageUrl": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
  },
  "contact": {
    "address": "Cusco, Perú",
    "phone": "913 328 866",
    "email": "contacto@terravivagrupo.com"
  },
  "socials": {
    "facebook": "https://facebook.com/terravivagrupo",
    "instagram": "https://instagram.com/terravivagrupo",
    "linkedin": "",
    "twitter": ""
  },
  "legal": {
    "termsAndConditions": "Términos y condiciones de Terra Viva...",
    "privacyPolicy": "Política de privacidad...",
    "whistleblowing": "Canal de denuncias..."
  },
  "postSale": {
    "title": "Servicio Post Venta",
    "description": "Estamos contigo después de la compra",
    "emergencyPhone": "913 328 866",
    "schedule": "Lunes a Viernes: 9:00 - 18:00",
    "manualUrl": ""
  },
  "chatConfig": {
    "botName": "Terra Asistente",
    "welcomeMessage": "¡Hola! Soy el asistente virtual de Terra Viva. ¿En qué puedo ayudarte?",
    "systemInstruction": "Eres un asistente amable de la inmobiliaria Terra Viva en Cusco, Perú.",
    "apiKey": ""
  },
  "sections": [
    {"id": "hero", "name": "Inicio", "enabled": true, "order": 1},
    {"id": "projects", "name": "Proyectos", "enabled": true, "order": 2},
    {"id": "services", "name": "Servicios", "enabled": true, "order": 3},
    {"id": "testimonials", "name": "Testimonios", "enabled": true, "order": 4},
    {"id": "contact", "name": "Contacto", "enabled": true, "order": 5}
  ]
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ============================
-- DATOS INICIALES: Secciones
-- ============================
INSERT INTO section_config (id, name, enabled, order_index) VALUES
  ('hero', 'Inicio', true, 1),
  ('projects', 'Proyectos', true, 2),
  ('services', 'Servicios', true, 3),
  ('testimonials', 'Testimonios', true, 4),
  ('contact', 'Contacto', true, 5)
ON CONFLICT (id) DO NOTHING;

-- ============================
-- DATOS INICIALES: Proyectos
-- ============================
INSERT INTO projects (title, location, description, image, type, status, price, price_usd, area, bedrooms, bathrooms, parking_spots, features, gallery, is_featured) VALUES 
(
  'Departamento Urb. Las Orquídeas',
  'Urb. Las Orquídeas, Cusco',
  'Departamento 100% independizado con Partida Registral en SUNARP. Ubicación estratégica, ideal para vivienda o alquiler Airbnb.',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=80',
  'venta', 'En Venta', '150,000', '40,000', '70 m²', 2, 1, 1,
  ARRAY['Inscrito en SUNARP', 'Servicios Independientes', 'Cocina Amoblada', 'Roperos Empotrados'],
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
  true
),
(
  'Casa Urb. Magisterio - 200m²',
  'Urb. Magisterio, Cusco',
  'Hermosa casa familiar en la reconocida urbanización Magisterio. Documentación saneada en SUNARP.',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=2000&q=80',
  'venta', 'En Venta', '320,000', '85,000', '200 m²', 3, 2, 2,
  ARRAY['Saneado en SUNARP', '3 Dormitorios', '2 Baños', 'Patio Amplio', 'Cochera Doble'],
  ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
  true
),
(
  'Terreno Urb. Santa Mónica',
  'Urb. Santa Mónica (Frente a Real Plaza)',
  'Terreno exclusivo frente al Real Plaza. 14 metros de frentera ideales para proyecto inmobiliario.',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80',
  'terreno', 'En Venta', '180,000', '48,000', '205 m²', 0, 0, 0,
  ARRAY['Frontera de 14m', 'Frente a Real Plaza', 'Zona Residencial', 'Inscrito en RRPP'],
  ARRAY['https://images.unsplash.com/photo-1628744876497-eb30460be9f6?auto=format&fit=crop&w=800&q=80'],
  false
),
(
  'Departamento Alquiler - Wanchaq',
  'Av. La Cultura, Wanchaq',
  'Departamento amoblado listo para habitar. Ubicación céntrica cerca a universidades.',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=80',
  'alquiler', 'En Alquiler', '1,200', '320', '65 m²', 2, 1, 0,
  ARRAY['Amoblado', 'Internet Incluido', 'Agua/Luz Independiente', 'Cerca a Universidades'],
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
  false
),
(
  'Suite AirBnB - Centro Histórico',
  'Centro Histórico de Cusco',
  'Suite ejecutiva para turistas y viajeros de negocios. A minutos de la Plaza de Armas.',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=80',
  'airbnb', 'Alquiler Temporal', '150', '40', '45 m²', 1, 1, 0,
  ARRAY['WiFi Alta Velocidad', 'Cocina Equipada', 'Netflix Incluido', 'Check-in 24h', 'Vista a la Ciudad'],
  ARRAY['https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=800&q=80'],
  true
)
ON CONFLICT DO NOTHING;

-- ============================
-- DATOS INICIALES: Galería
-- ============================
INSERT INTO gallery (id, url, name, category) VALUES
  ('1', 'https://i.ibb.co/ccxRGx7m/logo2.png', 'Logo Terra Viva', 'Logos')
ON CONFLICT (id) DO NOTHING;

-- ============================
-- DATOS INICIALES: Testimonios
-- ============================
INSERT INTO testimonials (name, location, rating, comment, property_type, is_approved) VALUES
  ('María Fernanda López', 'San Sebastián, Cusco', 5, 'Excelente servicio. Encontré mi casa ideal gracias a Terra Viva.', 'Casa', true),
  ('Carlos Rodríguez', 'Wanchaq, Cusco', 5, 'Proceso de compra muy transparente y profesional.', 'Departamento', true),
  ('Ana Patricia Quispe', 'Urb. Magisterio, Cusco', 4, 'Muy recomendado. La atención fue personalizada y eficiente.', 'Terreno', true)
ON CONFLICT DO NOTHING;

-- ============================
-- VISTAS para reportes
-- ============================
CREATE OR REPLACE VIEW properties_summary AS
SELECT type, status, COUNT(*) as total, SUM(views_count) as total_views
FROM projects WHERE is_active = true
GROUP BY type, status;

CREATE OR REPLACE VIEW recent_leads AS
SELECT c.id, c.name, c.email, c.phone, c.interest, c.created_at, p.title as project_title
FROM contacts c LEFT JOIN projects p ON c.project_id = p.id
ORDER BY c.created_at DESC LIMIT 50;

-- ============================
-- MENSAJE DE ÉXITO
-- ============================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE '✅ BASE DE DATOS v2 CONFIGURADA CORRECTAMENTE';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Tablas creadas:';
  RAISE NOTICE '  - site_content (configuración JSONB)';
  RAISE NOTICE '  - themes (temas de colores)';
  RAISE NOTICE '  - projects (propiedades)';
  RAISE NOTICE '  - gallery (imágenes)';
  RAISE NOTICE '  - testimonials (reseñas)';
  RAISE NOTICE '  - contacts (leads)';
  RAISE NOTICE '  - analytics (tracking)';
  RAISE NOTICE '  - section_config (secciones)';
  RAISE NOTICE '';
  RAISE NOTICE 'Datos iniciales insertados.';
  RAISE NOTICE '============================================';
END $$;
