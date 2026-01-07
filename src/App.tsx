/**
 * App.tsx - Componente Principal de Terra Viva
 * Versión compacta con modales para About y Empleos
 */

import React, { useRef, useState, useCallback, useEffect, lazy, Suspense } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import AboutModal from './components/AboutModal';
import CareersModal from './components/CareersModal';
import Login from './components/Login';
import PromotionModal from './components/PromotionModal';
import LegalView from './components/LegalView';
import PostSaleView from './components/PostSaleView';
import ProjectDetailView from './components/ProjectDetailView';
import { SEO, OrganizationSchema, WebsiteSchema, LocalBusinessSchema, FAQSchema, PropertySchema, BreadcrumbSchema } from './components/SEO';
import { NavSection, Project, SiteContent, ViewState, SectionType } from './types';
import { db } from './services/storage';
import { submitTestimonial, isSupabaseConfigured } from './services/supabase';
import { THEMES, INITIAL_PROJECTS, INITIAL_CONTENT } from './data/initialData';

// Lazy load de componentes pesados
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

// Loading fallback para lazy components
const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-600 font-medium">Cargando panel...</p>
    </div>
  </div>
);

// ==================== COMPONENTE PRINCIPAL ====================
const App: React.FC = () => {
  // Estados principales
  const [view, setView] = useState<ViewState>('website');
  const [activeSection, setActiveSection] = useState<NavSection>(NavSection.HOME);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showPromotion, setShowPromotion] = useState(true);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showCareersModal, setShowCareersModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [heroServiceFilter, setHeroServiceFilter] = useState<string>('');

  // Estados de datos - inicializar con cache/fallback
  const [content, setContent] = useState<SiteContent>(() => db.getContent(INITIAL_CONTENT));
  const [projects, setProjects] = useState<Project[]>(() => {
    const loaded = db.getProjects(INITIAL_PROJECTS);
    return loaded.map(p => ({
      ...p,
      price: p.price || 'Consultar',
      area: p.area || 'Consultar',
      features: p.features || [],
      floorPlanImage: p.floorPlanImage || '',
      googleMapsEmbedUrl: p.googleMapsEmbedUrl || '',
      gallery: p.gallery || []
    }));
  });

  // Cargar datos desde Supabase al montar
  useEffect(() => {
    const loadData = async () => {
      if (!isSupabaseConfigured()) {
        console.log('📦 Supabase no configurado - usando datos locales');
        setIsLoading(false);
        return;
      }

      try {
        console.log('☁️ Cargando datos desde Supabase...');
        const [cloudContent, cloudProjects] = await Promise.all([
          db.getContentAsync(INITIAL_CONTENT),
          db.getProjectsAsync(INITIAL_PROJECTS)
        ]);

        setContent(cloudContent);
        setProjects(cloudProjects.map(p => ({
          ...p,
          price: p.price || 'Consultar',
          area: p.area || 'Consultar',
          features: p.features || [],
          floorPlanImage: p.floorPlanImage || '',
          googleMapsEmbedUrl: p.googleMapsEmbedUrl || '',
          gallery: p.gallery || []
        })));
        console.log('✅ Datos cargados desde Supabase');
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Tema actual
  const currentTheme = THEMES.find(t => t.id === content.themeId) || THEMES[0];

  // Refs para scroll
  const sectionRefs = {
    [NavSection.HOME]: useRef<HTMLDivElement>(null),
    [NavSection.PROJECTS]: useRef<HTMLDivElement>(null),
    [NavSection.SERVICES]: useRef<HTMLDivElement>(null),
    [NavSection.ABOUT]: useRef<HTMLDivElement>(null),
    [NavSection.CONTACT]: useRef<HTMLDivElement>(null),
  };

  // ==================== HANDLERS ====================

  const updateContent = useCallback((newContent: SiteContent) => {
    setContent(newContent);
    db.saveContent(newContent);
  }, []);

  const updateProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
    db.saveProjects(newProjects);
  }, []);

  const scrollToSection = useCallback((section: NavSection) => {
    // About y Empleos abren modales
    if (section === NavSection.ABOUT) {
      setShowAboutModal(true);
      return;
    }
    if (section === NavSection.SERVICES) {
      setShowCareersModal(true);
      return;
    }

    setActiveSection(section);
    const ref = sectionRefs[section];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Handler para filtrar proyectos por servicio desde el Hero
  const handleServiceFilter = useCallback((serviceId: string) => {
    setHeroServiceFilter(serviceId);
    // Hacer scroll a proyectos
    const ref = sectionRefs[NavSection.PROJECTS];
    if (ref?.current) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const handleNavigate = useCallback((newView: ViewState) => {
    setView(newView);
    if (newView !== 'project-detail') {
      setSelectedProject(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToSite = useCallback(() => {
    setView('website');
    setSelectedProject(null);
    window.scrollTo({ top: 0 });
  }, []);

  const handleViewProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setView('project-detail');
    window.scrollTo({ top: 0 });
  }, []);

  const handleSubmitTestimonial = async (testimonial: {
    name: string;
    location: string;
    rating: number;
    comment: string;
    propertyType: string;
  }) => {
    return await submitTestimonial(testimonial);
  };

  // Trackear vista de sección cuando es visible
  const trackSectionView = useCallback((sectionId: SectionType) => {
    db.trackSectionView(sectionId);
  }, []);

  // Obtener secciones ordenadas y habilitadas
  const enabledSections = (content.sections || [])
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  // Renderizar sección por ID
  const renderSection = (sectionId: SectionType) => {
    const sectionConfig = (content.sections || []).find(s => s.id === sectionId);
    
    switch (sectionId) {
      case 'hero':
        return (
          <div 
            key="hero" 
            ref={sectionRefs[NavSection.HOME]}
            onMouseEnter={() => trackSectionView('hero')}
            onClick={() => db.trackSectionClick('hero')}
          >
            <Hero 
              scrollToSection={scrollToSection} 
              content={content} 
              sectionConfig={sectionConfig}
              onServiceFilter={handleServiceFilter}
            />
          </div>
        );
      case 'projects':
        return (
          <div 
            key="projects" 
            ref={sectionRefs[NavSection.PROJECTS]}
            onMouseEnter={() => trackSectionView('projects')}
            onClick={() => db.trackSectionClick('projects')}
          >
            <Projects 
              projects={projects} 
              onViewProject={handleViewProject} 
              sectionConfig={sectionConfig}
              externalFilter={heroServiceFilter}
              onClearExternalFilter={() => setHeroServiceFilter('')}
            />
          </div>
        );
      case 'services':
        return (
          <div 
            key="services"
            onMouseEnter={() => trackSectionView('services')}
            onClick={() => db.trackSectionClick('services')}
          >
            <Services sectionConfig={sectionConfig} />
          </div>
        );
      case 'testimonials':
        return (
          <div 
            key="testimonials"
            onMouseEnter={() => trackSectionView('testimonials')}
            onClick={() => db.trackSectionClick('testimonials')}
          >
            <Testimonials onSubmitTestimonial={handleSubmitTestimonial} sectionConfig={sectionConfig} />
          </div>
        );
      case 'contact':
        return (
          <div 
            key="contact" 
            ref={sectionRefs[NavSection.CONTACT]}
            onMouseEnter={() => trackSectionView('contact')}
            onClick={() => db.trackSectionClick('contact')}
          >
            <Contact content={content} sectionConfig={sectionConfig} />
          </div>
        );
      default:
        return null;
    }
  };

  // ==================== VISTAS ESPECIALES ====================

  if (view === 'admin') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AdminDashboard
          content={content}
          projects={projects}
          onUpdateContent={updateContent}
          onUpdateProjects={updateProjects}
          onLogout={handleBackToSite}
          themes={THEMES}
        />
      </Suspense>
    );
  }

  if (view === 'login') {
    return (
      <Layout
        content={content}
        currentTheme={currentTheme}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        onNavigate={handleNavigate}
        showHeader={true}
        showFooter={true}
        showChat={false}
        withTopPadding={true}
      >
        <Login onLogin={() => setView('admin')} onBack={handleBackToSite} />
      </Layout>
    );
  }

  if (view === 'terms' || view === 'privacy' || view === 'denuncias') {
    const legalContent = {
      terms: { title: 'Términos y Condiciones', content: content.legal.termsAndConditions },
      privacy: { title: 'Política de Privacidad', content: content.legal.privacyPolicy },
      denuncias: { title: 'Canal de Denuncias', content: content.legal.whistleblowing }
    };
    const current = legalContent[view];

    return (
      <>
        <SEO 
          title={current.title}
          description={`${current.title} de Terra Viva Grupo Inmobiliario SAC`}
          url={`https://terravivaperu.vercel.app/legal/${view}`}
          noindex={view === 'denuncias'}
        />
        <Layout
          content={content}
          currentTheme={currentTheme}
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          onNavigate={handleNavigate}
          withTopPadding={true}
        >
          <LegalView
            type={view}
            title={current.title}
            content={current.content}
            onBack={handleBackToSite}
          />
        </Layout>
      </>
    );
  }

  if (view === 'postsale') {
    return (
      <Layout
        content={content}
        currentTheme={currentTheme}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        onNavigate={handleNavigate}
        withTopPadding={true}
      >
        <PostSaleView content={content.postSale} onBack={handleBackToSite} />
      </Layout>
    );
  }

  if (view === 'project-detail' && selectedProject) {
    return (
      <>
        {/* SEO para proyecto individual */}
        <SEO 
          title={`${selectedProject.title} - ${selectedProject.type} en ${selectedProject.location}`}
          description={selectedProject.description.slice(0, 160)}
          keywords={[selectedProject.type.toLowerCase(), selectedProject.location.toLowerCase(), 'propiedad cusco']}
          image={selectedProject.image}
          url={`https://terravivaperu.vercel.app/proyecto/${selectedProject.id}`}
          type="product"
          product={{
            price: selectedProject.price ? parseFloat(selectedProject.price.replace(/[^0-9.]/g, '')) : undefined,
            currency: 'PEN',
            availability: 'InStock'
          }}
        />
        <BreadcrumbSchema items={[
          { name: 'Inicio', url: 'https://terravivaperu.vercel.app/' },
          { name: 'Proyectos', url: 'https://terravivaperu.vercel.app/#proyectos' },
          { name: selectedProject.title, url: `https://terravivaperu.vercel.app/proyecto/${selectedProject.id}` }
        ]} />
        <PropertySchema 
          name={selectedProject.title}
          description={selectedProject.description}
          price={selectedProject.price ? parseFloat(selectedProject.price.replace(/[^0-9.]/g, '')) : 0}
          currency="PEN"
          image={[selectedProject.image, ...(selectedProject.gallery || [])]}
          address={selectedProject.location}
          propertyType={selectedProject.type === 'Casa' ? 'House' : selectedProject.type === 'Departamento' ? 'Apartment' : 'Land'}
          bedrooms={selectedProject.bedrooms}
          bathrooms={selectedProject.bathrooms}
          floorSize={selectedProject.area ? parseFloat(selectedProject.area.replace(/[^0-9.]/g, '')) : undefined}
          url={`https://terravivaperu.vercel.app/proyecto/${selectedProject.id}`}
        />
        <Layout
          content={content}
          currentTheme={currentTheme}
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          onNavigate={handleNavigate}
          withTopPadding={true}
        >
          <ProjectDetailView
            project={selectedProject}
            onBack={() => {
              setView('website');
              setTimeout(() => scrollToSection(NavSection.PROJECTS), 100);
            }}
            onContact={() => {
              setView('website');
              setTimeout(() => scrollToSection(NavSection.CONTACT), 100);
            }}
          />
        </Layout>
      </>
    );
  }

  // ==================== VISTA PRINCIPAL ====================

  // Preguntas frecuentes para Schema.org
  const faqData = [
    { question: '¿Qué tipos de propiedades ofrecen?', answer: 'Ofrecemos casas, departamentos, terrenos y locales comerciales en venta y alquiler en Cusco.' },
    { question: '¿Las propiedades tienen documentos saneados?', answer: 'Sí, todas nuestras propiedades cuentan con documentos registrados en SUNARP y asesoría legal incluida.' },
    { question: '¿Ofrecen financiamiento?', answer: 'Trabajamos con los principales bancos para ofrecer opciones de financiamiento a nuestros clientes.' },
    { question: '¿Dónde están ubicados?', answer: 'Atendemos toda la región de Cusco, con oficinas centrales en la ciudad de Cusco.' }
  ];

  return (
    <>
      {/* SEO Global */}
      <SEO />
      <OrganizationSchema />
      <WebsiteSchema />
      <LocalBusinessSchema />
      <FAQSchema questions={faqData} />
      <BreadcrumbSchema items={[
        { name: 'Inicio', url: 'https://terravivaperu.vercel.app/' },
        { name: 'Proyectos', url: 'https://terravivaperu.vercel.app/#proyectos' },
        { name: 'Contacto', url: 'https://terravivaperu.vercel.app/#contacto' }
      ]} />

      <Layout
        content={content}
        currentTheme={currentTheme}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        onNavigate={handleNavigate}
      >
      {/* Modales */}
      {showPromotion && content.promotion.isActive && (
        <PromotionModal
          config={content.promotion}
          onClose={() => setShowPromotion(false)}
          phoneNumber={content.contact.phone}
        />
      )}

      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        content={content}
      />

      <CareersModal
        isOpen={showCareersModal}
        onClose={() => setShowCareersModal(false)}
      />

      {/* Renderizar secciones dinámicamente */}
      {enabledSections.map(section => renderSection(section.id))}
    </Layout>
    </>
  );
};

export default App;