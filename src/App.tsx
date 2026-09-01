import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HorizontalPosterWall } from './components/home/HorizontalPosterWall';
import { Ticker } from './components/Ticker';
import { ServicesSection } from './components/ServicesSection';
import { PartnerUniverse } from './components/PartnerUniverse';
import { WhyRPW } from './components/WhyRPW';
import { RPWConnectPreview } from './components/RPWConnectPreview';
import { StatsCounter } from './components/StatsCounter';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { TestShotModal } from './components/TestShotModal';
import { EmailToast } from './components/EmailToast';
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext';
import { AdminHUD } from './components/admin/AdminHUD';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { InPlaceEditorPopover } from './components/admin/InPlaceEditorPopover';
import { PortfolioPage } from './pages/PortfolioPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { AppPage } from './types';

function MainAppContent() {
  const [activePage, setActivePage] = useState<AppPage>('home');
  const [partnerCount, setPartnerCount] = useState<number>(8);
  const [testShotModalOpen, setTestShotModalOpen] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<string | undefined>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { isEditorOpen, activeEditTarget, setActiveEditTarget } = useSiteConfig();

  // Sync with URL Hash on Mount & Changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'portfolio') {
        setActivePage('portfolio');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'about' || hash === 'about-us') {
        setActivePage('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'home' || hash === '') {
        setActivePage('home');
      } else {
        // Section on home page
        setActivePage('home');
        setTimeout(() => {
          const elem = document.getElementById(hash);
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: AppPage, targetSectionId?: string) => {
    setActivePage(page);
    window.location.hash = targetSectionId ? `#${targetSectionId}` : `#${page}`;

    if (page === 'home' && targetSectionId) {
      setTimeout(() => {
        const elem = document.getElementById(targetSectionId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Wix Auto-Resize Integration
  const notifyWixHeight = useCallback(() => {
    if (window.parent) {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: 'resize-iframe', height }, '*');
    }
  }, []);

  useEffect(() => {
    notifyWixHeight();
    window.addEventListener('resize', notifyWixHeight);
    return () => window.removeEventListener('resize', notifyWixHeight);
  }, [notifyWixHeight, activePage]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 4500);
  };

  const handleOpenTestShotModal = (serviceName?: string) => {
    setSelectedServiceForModal(serviceName);
    setTestShotModalOpen(true);
  };

  const handleExploreWork = () => {
    handleNavigate('portfolio');
  };

  return (
    <div className="relative min-h-screen bg-[#05070b] text-[#9daab4] selection:bg-[#66fcf1] selection:text-[#05070b] overflow-x-hidden">
      {/* Top Floating Admin HUD (Visible when Backend Editor is activated) */}
      <AdminHUD />

      {/* Full Backend Studio CMS Dashboard Modal (When in dashboard mode) */}
      <AdminDashboard />

      {/* In-Place Live Inspector Popover (When an element is clicked to edit live on page) */}
      {isEditorOpen && activeEditTarget && (
        <InPlaceEditorPopover onClose={() => setActiveEditTarget(null)} />
      )}

      {/* Subtle Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[60] opacity-3 noise-overlay" />

      {/* Global Ambient Glow Blobs */}
      <div className="fixed top-[10%] -left-48 w-[500px] h-[500px] rounded-full bg-[#66fcf1] blur-[150px] opacity-10 pointer-events-none" />
      <div className="fixed top-[55%] -right-48 w-[600px] h-[600px] rounded-full bg-[#17465a] blur-[160px] opacity-15 pointer-events-none" />

      {/* Main Navigation with Prominent Logo and 5-Click Admin Easter Egg */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenTestShotModal={() => handleOpenTestShotModal()}
      />

      {/* Conditional Page Rendering with Smooth Transitions */}
      {activePage === 'portfolio' && (
        <PortfolioPage onOpenTestShotModal={handleOpenTestShotModal} />
      )}

      {activePage === 'about' && (
        <AboutUsPage
          onOpenTestShotModal={() => handleOpenTestShotModal()}
          onNavigateToPortfolio={() => handleNavigate('portfolio')}
        />
      )}

      {activePage === 'home' && (
        <main>
          {/* Hero Section */}
          <Hero
            onExploreWork={handleExploreWork}
            onNavigateToPortfolio={() => handleNavigate('portfolio')}
            onOpenTestShotModal={() => handleOpenTestShotModal()}
          />

          {/* Showcase / Movie Posters Horizontal Scrolling Matrix Wall */}
          <HorizontalPosterWall
            onOpenTestShotModal={handleOpenTestShotModal}
            onNavigateToPortfolio={() => handleNavigate('portfolio')}
          />

          {/* Seamless Continuous Loop Ticker */}
          <Ticker />

          {/* Partner Collective Infographic Network & Universe (Moved below Hero Reel) */}
          <PartnerUniverse
            onShowToast={showToast}
            onUpdatePartnerCount={(count) => setPartnerCount(count)}
          />

          {/* Services List */}
          <ServicesSection onOpenTestShotModal={handleOpenTestShotModal} />

          {/* Why RPW */}
          <WhyRPW />

          {/* RPW Connect Portal Live Telemetry */}
          <RPWConnectPreview onOpenTestShotModal={() => handleOpenTestShotModal()} />

          {/* Stats Counter */}
          <StatsCounter partnerCount={partnerCount} />

          {/* FAQ Accordion */}
          <FAQSection />

          {/* Final Call to Action */}
          <FinalCTA onOpenTestShotModal={() => handleOpenTestShotModal()} />
        </main>
      )}

      {/* Footer across all pages */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Modal */}
      <TestShotModal
        isOpen={testShotModalOpen}
        onClose={() => setTestShotModalOpen(false)}
        defaultService={selectedServiceForModal}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      <EmailToast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </div>
  );
}

export default function App() {
  return (
    <SiteConfigProvider>
      <MainAppContent />
    </SiteConfigProvider>
  );
}

