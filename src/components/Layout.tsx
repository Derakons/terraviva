/**
 * Layout Principal - Estructura base para todas las páginas públicas
 * Contiene Header, Footer y estilos del tema
 */

import React, { lazy, Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import FestiveEffects from './FestiveEffects';
import { NavSection, SiteContent, ViewState, ThemeConfig } from '../types';

// Lazy load del ChatAssistant (componente pesado)
const ChatAssistant = lazy(() => import('./ChatAssistant'));

interface LayoutProps {
    children: React.ReactNode;
    content: SiteContent;
    currentTheme: ThemeConfig;
    activeSection: NavSection;
    scrollToSection: (section: NavSection) => void;
    onNavigate: (view: ViewState) => void;
    showHeader?: boolean;
    showFooter?: boolean;
    showChat?: boolean;
    showFestive?: boolean;
    withTopPadding?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    content,
    currentTheme,
    activeSection,
    scrollToSection,
    onNavigate,
    showHeader = true,
    showFooter = true,
    showChat = true,
    showFestive = true,
    withTopPadding = false
}) => {
    const HEADER_HEIGHT = 'pt-20 md:pt-24';

    // Extraer ID del tema para efectos festivos
    const themeId = currentTheme.id;

    return (
        <div
            className="relative min-h-screen flex flex-col transition-colors duration-700"
            style={{
                '--primary': currentTheme.colors.primary,
                '--secondary': currentTheme.colors.secondary,
                '--accent': currentTheme.colors.accent,
                '--background': currentTheme.colors.background,
                '--text': currentTheme.colors.text,
            } as React.CSSProperties}
        >
            {/* Efectos festivos en los costados */}
            {showFestive && <FestiveEffects themeId={themeId} enabled={true} />}

            {showHeader && (
                <Header
                    activeSection={activeSection}
                    scrollToSection={scrollToSection}
                    logoText={content.logoText}
                    logoUrl={content.logoUrl}
                    onNavigate={onNavigate}
                />
            )}

            <main className={`flex-1 ${withTopPadding ? HEADER_HEIGHT : ''}`}>
                {children}
            </main>

            {showFooter && (
                <Footer
                    scrollToSection={scrollToSection}
                    content={content}
                    onAdminClick={() => onNavigate('login')}
                    onNavigate={onNavigate}
                />
            )}

            {showChat && (
                <Suspense fallback={null}>
                    <ChatAssistant config={content.chatConfig} />
                </Suspense>
            )}
        </div>
    );
};

export default Layout;
