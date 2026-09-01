import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck, Zap, Edit3, Settings, Sparkles } from 'lucide-react';
import { RotoLogo } from './RotoLogo';
import { SocialIconsGroup } from './SocialIconsGroup';
import { useSiteConfig } from '../context/SiteConfigContext';
import { AppPage } from '../types';

interface NavbarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage, targetSectionId?: string) => void;
  onOpenTestShotModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate, onOpenTestShotModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 5-click easter egg counter for backend edit page
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    config, 
    isEditorOpen, 
    setIsEditorOpen, 
    setEditorMode, 
    setActiveEditTarget,
    setAdminToast
  } = useSiteConfig();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (newCount >= 5) {
      setClickCount(0);
      setIsEditorOpen(true);
      setEditorMode('dashboard');
      setAdminToast('🔓 RPW Backend Studio CMS Unlocked! (5-Clicks Trigger)');
      setTimeout(() => setAdminToast(null), 4000);
    } else {
      // Provide subtle visual guidance if user is clicking
      if (newCount >= 2) {
        setAdminToast(`⚡ Admin trigger: ${newCount}/5 clicks to open Backend Studio Editor`);
      }
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2500);
    }
  };

  const handleNavClick = (page: AppPage, targetSectionId?: string) => {
    onNavigate(page, targetSectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="rpw-nav"
      className={`fixed top-0 left-0 w-full h-[78px] z-50 transition-all duration-300 flex items-center justify-between px-4 sm:px-8 md:px-12 ${
        isEditorOpen ? 'mt-11 ' : ''
      }${
        scrolled
          ? 'bg-[#05070b]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-[#05070b]/80 backdrop-blur-md border-b border-white/5'
      }`}
    >
      {/* Brand - Prominent, Bold, No Container, Fit to Header Height */}
      <div className="flex items-center gap-3 relative group">
        <button
          onClick={(e) => {
            handleLogoClick(e);
            handleNavClick('home');
          }}
          className="flex items-center gap-3.5 focus:outline-none text-left select-none transition-transform active:scale-95 cursor-pointer"
          title="Click 5 times to open Backend Edit Page"
          aria-label="Roto Paint Wala Logo - 5 clicks open backend editor"
        >
          {/* Prominent Logo - No container box or circular frame */}
          <div className="relative flex items-center justify-center">
            <RotoLogo size="header" src={config.logoUrl} />
            {clickCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#66fcf1] text-[#05070b] text-[10px] font-mono font-black flex items-center justify-center shadow-[0_0_10px_#66fcf1] animate-bounce">
                {clickCount}
              </span>
            )}
          </div>

          {/* Bold Brand Typography */}
          <div className="flex flex-col">
            <div className="font-heading font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5 leading-none">
              <span>{config.brandName}</span>
              <span className="text-[#66fcf1]">{config.brandHighlight}</span>
              <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1] animate-ping" />
                {config.headerLiveBadgeText}
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#87949c] uppercase mt-0.5 hidden sm:block">
              VFX NETWORK & DISPATCH
            </span>
          </div>
        </button>

        {/* In-Place Edit Trigger when editor is active */}
        {isEditorOpen && (
          <button
            onClick={() => setActiveEditTarget('brand-logo')}
            className="p-1 rounded-md bg-[#66fcf1]/20 text-[#66fcf1] border border-[#66fcf1]/50 hover:bg-[#66fcf1] hover:text-black transition-all"
            title="Edit Brand Logo & Name"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Desktop Navigation Links (Connected Pages & Sections) */}
      <nav className="hidden lg:flex items-center gap-1.5">
        <button
          onClick={() => handleNavClick('home')}
          className={`text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all ${
            activePage === 'home'
              ? 'text-white bg-white/10 shadow-sm border border-white/15'
              : 'text-[#9daab4] hover:text-white hover:bg-white/5'
          }`}
        >
          Home
        </button>

        <button
          onClick={() => handleNavClick('portfolio')}
          className={`relative text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activePage === 'portfolio'
              ? 'text-[#05070b] bg-[#66fcf1] shadow-[0_0_15px_rgba(102,252,241,0.5)] font-extrabold'
              : 'text-[#66fcf1] hover:text-white hover:bg-[#66fcf1]/10 border border-[#66fcf1]/30'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Portfolio</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1] animate-ping" />
        </button>

        <button
          onClick={() => handleNavClick('about')}
          className={`text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all ${
            activePage === 'about'
              ? 'text-white bg-white/10 shadow-sm border border-white/15'
              : 'text-[#9daab4] hover:text-white hover:bg-white/5'
          }`}
        >
          About Us
        </button>

        <button
          onClick={() => handleNavClick('home', 'services')}
          className="text-xs font-semibold uppercase tracking-wider text-[#9daab4] hover:text-white px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
        >
          Services
        </button>

        <button
          onClick={() => handleNavClick('home', 'partners')}
          className="text-xs font-semibold uppercase tracking-wider text-[#9daab4] hover:text-white px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
        >
          Network
        </button>

        <button
          onClick={() => handleNavClick('home', 'why')}
          className="text-xs font-semibold uppercase tracking-wider text-[#9daab4] hover:text-white px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
        >
          Why RPW
        </button>

        <button
          onClick={() => handleNavClick('home', 'faq')}
          className="text-xs font-semibold uppercase tracking-wider text-[#9daab4] hover:text-white px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
        >
          FAQ
        </button>
      </nav>

      {/* Right CTAs */}
      <div className="flex items-center gap-3">
        {/* Quick Backend CMS Trigger Button for convenience */}
        <button
          onClick={() => {
            setIsEditorOpen(!isEditorOpen);
            if (!isEditorOpen) setEditorMode('in-place');
          }}
          className={`p-2 rounded-full border transition-all ${
            isEditorOpen
              ? 'bg-[#66fcf1] text-[#05070b] border-[#66fcf1] shadow-[0_0_15px_#66fcf1]'
              : 'bg-white/5 text-[#9daab4] border-white/10 hover:text-white hover:border-white/30'
          }`}
          title="Toggle CMS In-Place Editor (or click logo 5 times)"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenTestShotModal}
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-bold text-white border border-white/20 hover:border-[#66fcf1] hover:text-[#66fcf1] bg-white/[0.03] transition-all duration-300"
        >
          <Zap className="w-3.5 h-3.5 text-[#66fcf1]" />
          <span>REQUEST TEST SHOT</span>
        </button>

        <a
          href={config.connectPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[#66fcf1] bg-[#66fcf1]/10 border border-[#66fcf1]/40 hover:bg-[#66fcf1] hover:text-[#05070b] hover:shadow-[0_0_30px_rgba(102,252,241,0.35)] transition-all duration-300"
        >
          <span>RPW CONNECT</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-md text-white hover:text-[#66fcf1] hover:bg-white/5 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[78px] left-0 w-full bg-[#05070b]/98 backdrop-blur-2xl border-b border-[#66fcf1]/20 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`text-sm font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-between transition-all ${
              activePage === 'home' ? 'bg-[#66fcf1]/10 text-[#66fcf1]' : 'text-white'
            }`}
          >
            <span>Home</span>
            <span className="text-[10px] text-[#87949c]">01</span>
          </button>

          <button
            onClick={() => handleNavClick('portfolio')}
            className={`text-sm font-black uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-between transition-all ${
              activePage === 'portfolio'
                ? 'bg-[#66fcf1] text-[#05070b] shadow-md'
                : 'bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Portfolio & Showreels</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40 text-[#66fcf1]">NEW</span>
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`text-sm font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-between transition-all ${
              activePage === 'about' ? 'bg-[#66fcf1]/10 text-[#66fcf1]' : 'text-white'
            }`}
          >
            <span>About Us & Pipeline</span>
            <span className="text-[10px] text-[#87949c]">03</span>
          </button>

          <button
            onClick={() => handleNavClick('home', 'services')}
            className="text-sm font-semibold uppercase tracking-wider text-[#aeb9c1] hover:text-[#66fcf1] py-2 border-b border-white/5 flex items-center justify-between text-left"
          >
            <span>Services & Pipeline</span>
            <span className="text-[10px] text-[#87949c]">04</span>
          </button>

          <button
            onClick={() => handleNavClick('home', 'partners')}
            className="text-sm font-semibold uppercase tracking-wider text-[#aeb9c1] hover:text-[#66fcf1] py-2 border-b border-white/5 flex items-center justify-between text-left"
          >
            <span>Partner Collective</span>
            <span className="text-[10px] text-[#87949c]">05</span>
          </button>

          <button
            onClick={() => handleNavClick('home', 'why')}
            className="text-sm font-semibold uppercase tracking-wider text-[#aeb9c1] hover:text-[#66fcf1] py-2 border-b border-white/5 flex items-center justify-between text-left"
          >
            <span>Why RPW</span>
            <span className="text-[10px] text-[#87949c]">06</span>
          </button>

          <button
            onClick={() => handleNavClick('home', 'faq')}
            className="text-sm font-semibold uppercase tracking-wider text-[#aeb9c1] hover:text-[#66fcf1] py-2 border-b border-white/5 flex items-center justify-between text-left"
          >
            <span>FAQ</span>
            <span className="text-[10px] text-[#87949c]">07</span>
          </button>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsEditorOpen(true);
                setEditorMode('dashboard');
              }}
              className="w-full py-2.5 rounded-xl text-xs font-mono font-bold text-center text-[#66fcf1] border border-[#66fcf1]/40 bg-[#66fcf1]/10 flex items-center justify-center gap-2"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>OPEN CMS BACKEND EDIT PAGE</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTestShotModal();
              }}
              className="w-full py-3 rounded-xl text-xs font-bold text-center text-white border border-white/20 bg-white/5 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-[#66fcf1]" />
              <span>REQUEST SAMPLE TEST SHOT</span>
            </button>
            <a
              href={config.connectPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl text-xs font-extrabold text-center text-[#05070b] bg-[#66fcf1] flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(102,252,241,0.3)]"
            >
              <span>ENTER RPW CONNECT PORTAL</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <div className="pt-2 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono text-[#87949c] uppercase tracking-wider">
                Follow Roto Paint Wala:
              </span>
              <SocialIconsGroup size="sm" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
