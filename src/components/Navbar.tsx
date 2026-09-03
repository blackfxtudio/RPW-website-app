import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  Zap, 
  Edit3, 
  Sparkles, 
  Home, 
  Film, 
  Info, 
  Layers, 
  Share2, 
  HelpCircle,
  Smartphone,
  Radio
} from 'lucide-react';
import { RotoLogo } from './RotoLogo';
import { SocialIconsGroup } from './SocialIconsGroup';
import { RPWAppModal } from './RPWAppModal';
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
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [appModalOpen, setAppModalOpen] = useState(false);
  
  // 5-click easter egg counter for backend edit page
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    config, 
    isEditorOpen, 
    setIsEditorOpen, 
    setEditorMode, 
    setActiveEditTarget,
    setAdminToast,
    isAdminAuthenticated,
    setShowOtpModal
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
      if (isAdminAuthenticated) {
        setIsEditorOpen(true);
        setEditorMode('dashboard');
        setAdminToast('🔓 RPW Studio CMS Unlocked');
        setTimeout(() => setAdminToast(null), 3000);
      } else {
        // Open OTP security verification checkpoint
        setShowOtpModal(true);
      }
    } else {
      // Keep completely silent with NO counts showing
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2500);
    }
  };

  const handleNavClick = (page: AppPage, targetSectionId?: string) => {
    onNavigate(page, targetSectionId);
    setMobileMenuOpen(false);
  };

  const desktopNavItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => handleNavClick('home'),
      active: activePage === 'home',
    },
    {
      id: 'portfolio',
      label: 'Portfolio & Showreels',
      icon: Film,
      action: () => handleNavClick('portfolio'),
      active: activePage === 'portfolio',
      badge: 'REEL',
    },
    {
      id: 'about',
      label: 'About Roto Paint Wala',
      icon: Info,
      action: () => handleNavClick('about'),
      active: activePage === 'about',
    },
    {
      id: 'services',
      label: 'Services & Pipeline',
      icon: Layers,
      action: () => handleNavClick('home', 'services'),
      active: false,
    },
    {
      id: 'network',
      label: 'Studio Partner Collective',
      icon: Share2,
      action: () => handleNavClick('home', 'partners'),
      active: false,
    },
    {
      id: 'faq',
      label: 'Frequently Asked Questions',
      icon: HelpCircle,
      action: () => handleNavClick('home', 'faq'),
      active: false,
    },
  ];

  const mobileNavItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => handleNavClick('home'),
      active: activePage === 'home',
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: Film,
      action: () => handleNavClick('portfolio'),
      active: activePage === 'portfolio',
      badge: 'REEL',
    },
    {
      id: 'services',
      label: 'Services',
      icon: Layers,
      action: () => handleNavClick('home', 'services'),
      active: false,
    },
    {
      id: 'network',
      label: 'Network',
      icon: Share2,
      action: () => handleNavClick('home', 'partners'),
      active: false,
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      action: () => handleNavClick('about'),
      active: activePage === 'about',
    },
    {
      id: 'test-shot',
      label: 'Test Shot',
      icon: Zap,
      action: onOpenTestShotModal,
      active: false,
      highlight: true,
    },
  ];

  return (
    <>
      {/* RPW Mobile App Modal (iOS & Android) */}
      <RPWAppModal 
        isOpen={appModalOpen} 
        onClose={() => setAppModalOpen(false)} 
        onOpenTestShotModal={onOpenTestShotModal}
      />

      {/* ===================================================================== */}
      {/* TOP HEADER BAR (Logo ONLY on Small Screens, Pure Icons on Desktop)    */}
      {/* ===================================================================== */}
      <header
        id="rpw-nav"
        className={`fixed top-0 left-0 w-full h-[62px] sm:h-[72px] z-50 transition-all duration-300 flex items-center justify-between px-3 sm:px-8 md:px-12 ${
          isEditorOpen ? 'mt-11 ' : ''
        }${
          scrolled
            ? 'bg-[#05070b]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'bg-[#05070b]/80 backdrop-blur-md border-b border-white/5'
        }`}
      >
        {/* Brand: Pure Logo on Small Screens, Brand Name strictly on Desktop (lg+) */}
        <div className="flex items-center gap-2 sm:gap-3 relative group">
          <button
            onClick={(e) => {
              handleLogoClick(e);
              handleNavClick('home');
            }}
            className="flex items-center gap-2.5 sm:gap-3.5 focus:outline-none text-left select-none transition-transform active:scale-95 cursor-pointer"
            aria-label={`${config.brandName} ${config.brandHighlight}`}
          >
            {/* Logo Image */}
            <div className="relative flex items-center justify-center">
              <RotoLogo size="header" src={config.logoUrl} />
            </div>

            {/* Bold Brand Typography - Strictly Hidden on smaller screens, shown ONLY on lg+ */}
            <div className="hidden lg:flex flex-col">
              <div className="font-heading font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span>{config.brandName}</span>
                <span className="text-[#66fcf1]">{config.brandHighlight}</span>
                <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1] animate-ping" />
                  {config.headerLiveBadgeText}
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-[#87949c] uppercase mt-0.5">
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

        {/* Center Navigation Links: ONLY ICONS (No Text Labels, Clean Tooltips) */}
        <nav className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isHovered = hoveredNav === `desktop-${item.id}`;
            return (
              <div key={item.id} className="relative flex items-center justify-center group">
                {/* Floating Tooltip with Name on Hover */}
                {isHovered && (
                  <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[#05070b] border border-[#66fcf1]/50 text-[#66fcf1] text-[11px] font-poppins font-semibold shadow-[0_0_20px_rgba(102,252,241,0.35)] whitespace-nowrap pointer-events-none animate-in fade-in duration-150 z-50">
                    {item.label}
                  </div>
                )}

                <button
                  onClick={item.action}
                  onMouseEnter={() => setHoveredNav(`desktop-${item.id}`)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className={`relative p-2.5 rounded-xl transition-all duration-200 ease-out hover:scale-125 ${
                    item.active
                      ? 'text-[#05070b] bg-[#66fcf1] shadow-[0_0_15px_rgba(102,252,241,0.4)] scale-110'
                      : 'text-[#9daab4] hover:text-white hover:bg-white/10'
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="w-4 h-4" />
                  {item.badge && !item.active && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#66fcf1] animate-ping" />
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Right Action Icons: Pure Sleek Icons (No Text Shrinking, No Border Line Containers) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Request Test Shot CTA Icon Button */}
          <div className="relative group">
            {hoveredNav === 'header-testshot' && (
              <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[#05070b] border border-[#66fcf1]/50 text-[#66fcf1] text-[11px] font-poppins font-semibold shadow-[0_0_20px_rgba(102,252,241,0.35)] whitespace-nowrap pointer-events-none animate-in fade-in duration-150 z-50">
                Request Test Shot
              </div>
            )}
            <button
              onClick={onOpenTestShotModal}
              onMouseEnter={() => setHoveredNav('header-testshot')}
              onMouseLeave={() => setHoveredNav(null)}
              className="p-2 rounded-xl text-[#66fcf1] hover:text-white hover:bg-white/10 hover:scale-125 transition-all duration-200 ease-out flex items-center justify-center relative"
              aria-label="Request 4K Sample Test Shot"
              title="Request 4K Sample Test Shot"
            >
              <Zap className="w-5 h-5 text-[#66fcf1]" />
            </button>
          </div>

          {/* Apple iOS Icon - Noticeably Bigger with Hover Zoom */}
          <div className="relative group">
            {hoveredNav === 'header-apple' && (
              <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[#05070b] border border-[#66fcf1]/50 text-[#66fcf1] text-[11px] font-poppins font-semibold shadow-[0_0_20px_rgba(102,252,241,0.35)] whitespace-nowrap pointer-events-none animate-in fade-in duration-150 z-50">
                RPW iOS App
              </div>
            )}
            <button
              onClick={() => setAppModalOpen(true)}
              onMouseEnter={() => setHoveredNav('header-apple')}
              onMouseLeave={() => setHoveredNav(null)}
              className="p-2 rounded-xl text-[#b6c5d1] hover:text-[#66fcf1] hover:bg-white/10 hover:scale-125 transition-all duration-200 ease-out flex items-center justify-center"
              aria-label="RPW iOS App"
              title="RPW iOS App"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.74c.61-.75 1.04-1.8 0.92-2.84-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.73-.93 2.74 1.01.08 2.03-.5 2.64-1.25z" />
              </svg>
            </button>
          </div>

          {/* Android Icon - Noticeably Bigger with Hover Zoom */}
          <div className="relative group">
            {hoveredNav === 'header-android' && (
              <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[#05070b] border border-[#66fcf1]/50 text-[#66fcf1] text-[11px] font-poppins font-semibold shadow-[0_0_20px_rgba(102,252,241,0.35)] whitespace-nowrap pointer-events-none animate-in fade-in duration-150 z-50">
                RPW Android App
              </div>
            )}
            <button
              onClick={() => setAppModalOpen(true)}
              onMouseEnter={() => setHoveredNav('header-android')}
              onMouseLeave={() => setHoveredNav(null)}
              className="p-2 rounded-xl text-[#b6c5d1] hover:text-[#66fcf1] hover:bg-white/10 hover:scale-125 transition-all duration-200 ease-out flex items-center justify-center"
              aria-label="RPW Android App"
              title="RPW Android App"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4114 13.8533 8.1 12 8.1c-1.8533 0-3.5902.3114-5.1368.8497L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
              </svg>
            </button>
          </div>

          {/* Mobile Full Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-white hover:text-[#66fcf1] hover:bg-white/5 transition-colors"
            aria-label="Toggle Full Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Expanded Menu Modal */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-[62px] sm:top-[72px] left-0 w-full bg-[#05070b]/98 backdrop-blur-2xl border-b border-[#66fcf1]/20 p-5 flex flex-col gap-2.5 shadow-2xl animate-in slide-in-from-top-2 z-50">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-between transition-all ${
                activePage === 'home' ? 'bg-[#66fcf1]/10 text-[#66fcf1]' : 'text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </span>
              <span className="text-[10px] text-[#87949c]">01</span>
            </button>

            <button
              onClick={() => handleNavClick('portfolio')}
              className={`text-xs font-black uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-between transition-all ${
                activePage === 'portfolio'
                  ? 'bg-[#66fcf1] text-[#05070b] shadow-md'
                  : 'bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30'
              }`}
            >
              <span className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                <span>Full Portfolio & Showreels</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40 text-[#66fcf1]">REELS</span>
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-between transition-all ${
                activePage === 'about' ? 'bg-[#66fcf1]/10 text-[#66fcf1]' : 'text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>About Us & Pipeline</span>
              </span>
              <span className="text-[10px] text-[#87949c]">03</span>
            </button>

            <button
              onClick={() => handleNavClick('home', 'services')}
              className="text-xs font-semibold uppercase tracking-wider text-[#aeb9c1] hover:text-[#66fcf1] py-2 border-b border-white/5 flex items-center justify-between text-left"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Services & Pipeline</span>
              </span>
              <span className="text-[10px] text-[#87949c]">04</span>
            </button>

            <button
              onClick={() => handleNavClick('home', 'partners')}
              className="text-xs font-semibold uppercase tracking-wider text-[#aeb9c1] hover:text-[#66fcf1] py-2 border-b border-white/5 flex items-center justify-between text-left"
            >
              <span className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span>Partner Collective</span>
              </span>
              <span className="text-[10px] text-[#87949c]">05</span>
            </button>

            <button
              onClick={() => handleNavClick('home', 'faq')}
              className="text-xs font-semibold uppercase tracking-wider text-[#aeb9c1] hover:text-[#66fcf1] py-2 border-b border-white/5 flex items-center justify-between text-left"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span>FAQ</span>
              </span>
              <span className="text-[10px] text-[#87949c]">06</span>
            </button>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAppModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-mono font-bold text-center text-[#66fcf1] border border-[#66fcf1]/40 bg-[#66fcf1]/10 flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>RPW APP (iOS & ANDROID)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTestShotModal();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-center text-white border border-white/20 bg-white/5 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-[#66fcf1]" />
                <span>REQUEST SAMPLE TEST SHOT</span>
              </button>
              <div className="pt-2 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-mono text-[#87949c] uppercase tracking-wider">
                  Follow Roto Paint Wala:
                </span>
                <SocialIconsGroup size="sm" />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===================================================================== */}
      {/* MOBILE & TABLET BOTTOM PINNED NAVIGATION DOCK (App Style Navigation Rail) */}
      {/* ===================================================================== */}
      <nav
        id="rpw-mobile-dock"
        aria-label="Mobile & Tablet Navigation Bar"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#05070b]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] px-2 py-1.5 safe-area-inset-bottom"
      >
        <div className="flex items-center justify-around max-w-xl mx-auto">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isHovered = hoveredNav === item.id;
            return (
              <div key={item.id} className="relative flex flex-col items-center group">
                {/* Floating Tooltip with Name on Hover */}
                {isHovered && (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#05070b] border border-[#66fcf1]/50 text-[#66fcf1] text-[10px] font-poppins font-semibold shadow-[0_0_15px_rgba(102,252,241,0.4)] whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150 z-50">
                    {item.label}
                  </div>
                )}

                <button
                  onClick={item.action}
                  onMouseEnter={() => setHoveredNav(item.id)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className={`relative flex flex-col items-center justify-center py-1 px-2.5 sm:px-4 rounded-xl transition-all duration-200 ease-out group ${
                    item.highlight
                      ? 'text-[#66fcf1] hover:scale-115'
                      : item.active
                      ? 'text-[#66fcf1] bg-[#66fcf1]/10 scale-105'
                      : 'text-[#87949c] hover:text-white hover:bg-white/5 hover:scale-110'
                  }`}
                  aria-label={item.label}
                >
                  {/* Glowing Active Indicator */}
                  {item.active && (
                    <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#66fcf1] shadow-[0_0_8px_#66fcf1]" />
                  )}

                  {/* Icon with optional badge */}
                  <div className={`relative p-1 rounded-lg transition-transform duration-200 ease-out group-hover:scale-125 ${
                    item.highlight ? 'bg-[#66fcf1]/15 border border-[#66fcf1]/40 shadow-[0_0_12px_rgba(102,252,241,0.3)]' : ''
                  }`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.highlight ? 'text-[#66fcf1]' : ''}`} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1.5 px-1 py-0.2 text-[7px] font-poppins font-extrabold bg-[#66fcf1] text-[#05070b] rounded-full leading-tight">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Micro label */}
                  <span className={`text-[9px] sm:text-[10px] font-poppins tracking-tight mt-0.5 ${
                    item.active ? 'font-bold text-[#66fcf1]' : 'text-[#87949c]'
                  }`}>
                    {item.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
};
