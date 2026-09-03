import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { SiteConfig, PartnerStudio, WorkShot, ServiceItem, FAQItem, ProductionLiveShot, PortfolioShowreelItem } from '../types';
import { DEFAULT_PARTNERS, WORK_SHOTS, SERVICES_LIST, INITIAL_LIVE_SHOTS, FAQS } from '../data/mockData';
import { PORTFOLIO_REELS, COLLAGE_TILES, VFX_BREAKDOWNS } from '../data/portfolioData';
import { MOVIE_POSTERS_DATA } from '../data/moviePostersData';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  // Branding & Header
  brandName: 'ROTO PAINT',
  brandHighlight: 'WALA',
  logoUrl: 'https://static.wixstatic.com/media/7ffb5e_bebd8db90704414a9140cfbf0e8fe1e1~mv2.png/v1/fill/w_400,h_400,al_c,q_90,enc_avif,quality_auto/RPW.png',
  headerLiveBadgeText: 'LIVE',
  primaryTagline: 'Maximum bandwidth At One Place',
  primaryTaglineHighlight: 'At One Place',
  primaryFont: 'Poppins',
  accentColor: '#66fcf1',
  supportEmail: 'tom@blackfx.net',
  connectPortalUrl: 'https://app.rotopaintwala.com/',
  whatsappNumber: '9372823352',
  whatsappUrl: 'https://wa.me/919372823352?text=Hello%20Roto%20Paint%20Wala%20Team%2C%20I%20would%20like%20to%20discuss%20a%20VFX%20Project',

  // Hero Section
  heroEyebrow: 'Rotoscopy · Paint · VFX Support',
  heroHeadlineLine1: 'MAKE THE',
  heroHeadlineGradient: 'IMPOSSIBLE',
  heroHeadlineLine3: 'INVISIBLE.',
  heroDescription: 'ROTO PAINT WALA is a production-focused roto and paint network built to give filmmakers, agencies and VFX studios the bandwidth to move faster — without losing control over quality.',
  heroBgVideoType: 'youtube',
  heroBgSourceType: 'single-video',
  heroBgVideoYouTubeId: 'P5vvOZRO9JU',
  heroBgPlaylistId: 'PLrAl6sJc9k_VwW1v4HjD4Lw_zR-wzD5bN',
  heroBgPlaylistShuffle: true,
  heroBgLoop: true,
  heroBgVideoMp4Url: '',
  heroBgImageFallback: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1920&q=80',
  heroCtaPrimaryText: 'EXPLORE THE WORK',
  heroCtaSecondaryText: 'ENTER RPW CONNECT',
  heroCtaTertiaryText: 'Need Quick Turnaround?',

  // Partner Universe
  partnerEyebrow: 'RPW COLLECTIVE',
  partnerTagline: 'Maximum bandwidth At One Place',
  partnerTaglineHighlight: 'At One Place',
  partnerDescription: 'A growing network of specialised partner studios working under one unified production standard. Zero vendor sprawl. Full accountability.',
  partners: DEFAULT_PARTNERS,

  // Work Showcase
  workEyebrow: 'THE WORK',
  workHeading: 'Frames in',
  workHeadingHighlight: 'motion.',
  workDescription: 'Production-focused roto, paint and VFX support showcasing precision work built for high-end studio pipelines. Drag over any shot to inspect edge sharpness and clean plate integrity.',
  shots: WORK_SHOTS,

  // Services Section
  servicesEyebrow: 'WHAT WE DO',
  servicesHeading: 'The invisible',
  servicesHeadingHighlight: 'craft.',
  servicesDescription: 'Precision work built for the shots that cannot afford mistakes. Click any discipline to explore deliverable formats and software tooling.',
  services: SERVICES_LIST,

  // Why RPW
  whyEyebrow: 'WHY RPW',
  whyHeading: 'Built for',
  whyHeadingHighlight: 'production pressure.',
  whyPillars: [
    {
      number: '01 / BANDWIDTH',
      title: 'Scale when you need it.',
      description: 'Access a wider verified artist network when the deadline gets tighter and the shot count spikes from 10 to 100+ frames.',
      iconName: 'Users',
    },
    {
      number: '02 / CONTROL',
      title: 'One accountable partner.',
      description: 'You work directly with RPW supervision while we orchestrate artists, partner studios, dual-pass quality checks and delivery.',
      iconName: 'Compass',
    },
    {
      number: '03 / SECURITY',
      title: 'NDA-first workflow.',
      description: 'Project confidentiality, watermarked plate routing, and air-gapped production handling are built into every pipeline step.',
      iconName: 'Lock',
    },
    {
      number: '04 / SPEED',
      title: 'Production cycles built around deadlines.',
      description: 'Our distributed 12-hour shift structure delivers clean passes while your local composite team sleeps, unlocking round-the-clock momentum.',
      iconName: 'Zap',
    },
  ],

  // Telemetry & Stats
  liveShots: INITIAL_LIVE_SHOTS,
  stats: [
    { value: '100+', label: 'Artists / Network' },
    { value: '08', label: 'Partner Studios' },
    { value: '12H', label: 'Production Cycle' },
    { value: '01', label: 'Unified Workflow' },
  ],

  // Ticker
  tickerItems: [
    'KEYING',
    'VFX SUPPORT',
    'ROTOSCOPY',
    'DIGITAL PAINT',
    'CLEANUP',
    'MATCHMOVE',
    'WIRE REMOVAL',
    'HAIR MATTES',
  ],

  // FAQs
  faqEyebrow: 'QUESTIONS',
  faqHeading: 'Things people',
  faqHeadingHighlight: 'ask us.',
  faqs: FAQS,

  // Final CTA & Footer
  finalCtaEyebrow: 'READY WHEN YOU ARE',
  finalCtaHeadline: 'GOT',
  finalCtaHeadlineHighlight: 'FRAMES?',
  finalCtaDescription: "Bring us the difficult shots. We'll bring the artists, technical QC, and production bandwidth to make them work.",
  finalCtaPrimaryText: 'START WITH RPW CONNECT',
  finalCtaSecondaryText: 'SUBMIT TEST SHOT BRIEF',
  footerCopyright: '© 2026 ROTO PAINT WALA. A Division of Black Fxtudio.',
  footerTagline: 'Production-ready Roto, Paint & VFX Support Network.',
  socialLinks: [
    {
      id: 'facebook',
      platform: 'facebook',
      label: 'Facebook',
      url: 'https://www.facebook.com/rotopaintwala',
      enabled: true,
    },
    {
      id: 'x',
      platform: 'x',
      label: 'X (Twitter)',
      url: 'https://x.com/rotopaintwala',
      enabled: true,
    },
    {
      id: 'instagram',
      platform: 'instagram',
      label: 'Instagram',
      url: 'https://www.instagram.com/rotopaintwala',
      enabled: true,
    },
    {
      id: 'youtube',
      platform: 'youtube',
      label: 'YouTube',
      url: 'https://www.youtube.com/@rotopaintwala',
      enabled: true,
    },
    {
      id: 'linkedin',
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/company/roto-paint-wala',
      enabled: true,
    },
    {
      id: 'reddit',
      platform: 'reddit',
      label: 'Reddit',
      url: 'https://www.reddit.com/r/vfx',
      enabled: true,
    },
    {
      id: 'discord',
      platform: 'discord',
      label: 'Discord',
      url: 'https://discord.gg/vfx',
      enabled: true,
    },
    {
      id: 'whatsapp',
      platform: 'whatsapp',
      label: 'WhatsApp Direct Dispatch',
      url: 'https://wa.me/919372823352?text=Hello%20Roto%20Paint%20Wala%20Team%2C%20I%20would%20like%20to%20discuss%20a%20VFX%20Project',
      enabled: true,
    },
    {
      id: 'google',
      platform: 'google',
      label: 'Google Search / Business',
      url: 'https://www.google.com/search?q=Roto+Paint+Wala',
      enabled: true,
    },
  ],
  portfolioReels: PORTFOLIO_REELS,
  collaborationTagline: 'COLLABORATION SHOWCASE',
  collaborationSubDescription: 'A shared celebration of our creative partnerships.',
  vfxBreakdowns: VFX_BREAKDOWNS,
  moviePosters: MOVIE_POSTERS_DATA,
  homePostersHeadline: 'THE ART BEHIND THE BLOCKBUSTERS',
  homePostersHeadlineLine1: 'THE ART BEHIND',
  homePostersHeadlineLine2: 'THE',
  homePostersHeadlineLine3: 'BLOCKBUSTERS',
  homePostersSubheadline: 'Sub-Pixel Rotoscopy & Digital Paint',
  homePostersDescription: 'These floating posters showcase the high-precision visual effects built by our collaborative team.',
  homePostersCtaText: 'REQUEST PILOT SHOT',
  collageTiles: COLLAGE_TILES,
  rpwFeatureImages: {
    'multi-project-matrix': '/uploads/img_rpwFeatureImages_multi-project-matrix_1788364494170.png',
    'shots-live-progress': '/uploads/img_rpwFeatureImages_shots-live-progress_1788364494174.png',
    'chat-file-attachments-1gb': '/uploads/img_rpwFeatureImages_chat-file-attachments-1gb_1788364494178.png',
  },
  rpwFeatureOverrides: {},
  rpwShowcaseAutoRotate: true,
  rpwShowcaseRotateInterval: 3.5,
  rpwShowcaseSpeed: 3.5,
};

const STORAGE_KEY = 'rpw_site_cms_config_v4';
const AUTH_STORAGE_KEY = 'rpw_admin_auth_session_v1';

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (updater: Partial<SiteConfig> | ((prev: SiteConfig) => SiteConfig)) => void;
  resetToDefaults: () => void;
  exportConfigJson: () => void;
  importConfigJson: (jsonString: string) => boolean;
  saveConfigToServer: () => Promise<boolean>;
  isServerSaving: boolean;
  
  // Editor State
  isEditorOpen: boolean;
  setIsEditorOpen: (open: boolean) => void;
  editorMode: 'in-place' | 'dashboard';
  setEditorMode: (mode: 'in-place' | 'dashboard') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // In-place click-to-edit target
  activeEditTarget: string | null;
  setActiveEditTarget: (targetId: string | null) => void;
  
  // Admin OTP Auth State
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  showOtpModal: boolean;
  setShowOtpModal: (show: boolean) => void;
  logoutAdmin: () => void;

  // Toast helper for admin actions
  notifySaved: () => void;
  adminToast: string | null;
  setAdminToast: (msg: string | null) => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | null>(null);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          partners: Array.isArray(parsed.partners) && parsed.partners.length > 0 ? parsed.partners : DEFAULT_SITE_CONFIG.partners,
          portfolioReels: Array.isArray(parsed.portfolioReels) && parsed.portfolioReels.length > 0 ? parsed.portfolioReels : DEFAULT_SITE_CONFIG.portfolioReels,
          collageTiles: Array.isArray(parsed.collageTiles) && parsed.collageTiles.length > 0 ? parsed.collageTiles : DEFAULT_SITE_CONFIG.collageTiles,
          socialLinks: Array.isArray(parsed.socialLinks) && parsed.socialLinks.length > 0 ? parsed.socialLinks : DEFAULT_SITE_CONFIG.socialLinks,
          rpwFeatureImages: parsed.rpwFeatureImages || {},
          rpwFeatureOverrides: parsed.rpwFeatureOverrides || {},
        };
      }
    } catch (e) {
      console.warn('Failed to load stored CMS config from localStorage, using defaults:', e);
    }
    return DEFAULT_SITE_CONFIG;
  });

  const [isServerSaving, setIsServerSaving] = useState<boolean>(false);
  const isServerConfigLoaded = useRef<boolean>(false);
  const hasUserModified = useRef<boolean>(false);

  // Fetch persistent configuration from server on mount
  useEffect(() => {
    let isMounted = true;
    const fetchServerConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.config && isMounted) {
            isServerConfigLoaded.current = true;
            setConfig((prev) => {
              const merged = {
                ...DEFAULT_SITE_CONFIG,
                ...prev,
                ...data.config,
                partners: Array.isArray(data.config.partners) && data.config.partners.length > 0 ? data.config.partners : (prev.partners || DEFAULT_SITE_CONFIG.partners),
                portfolioReels: Array.isArray(data.config.portfolioReels) && data.config.portfolioReels.length > 0 ? data.config.portfolioReels : (prev.portfolioReels || DEFAULT_SITE_CONFIG.portfolioReels),
                moviePosters: Array.isArray(data.config.moviePosters) && data.config.moviePosters.length > 0 ? data.config.moviePosters : (prev.moviePosters || DEFAULT_SITE_CONFIG.moviePosters),
                collageTiles: Array.isArray(data.config.collageTiles) && data.config.collageTiles.length > 0 ? data.config.collageTiles : (prev.collageTiles || DEFAULT_SITE_CONFIG.collageTiles),
                socialLinks: Array.isArray(data.config.socialLinks) && data.config.socialLinks.length > 0 ? data.config.socialLinks : (prev.socialLinks || DEFAULT_SITE_CONFIG.socialLinks),
                rpwFeatureImages: data.config.rpwFeatureImages || prev.rpwFeatureImages || {},
                rpwFeatureOverrides: data.config.rpwFeatureOverrides || prev.rpwFeatureOverrides || {},
              };
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch (err) {
                console.warn('[CMS-CLIENT] LocalStorage cache quota warning:', err);
              }
              return merged;
            });
          } else {
            isServerConfigLoaded.current = true;
          }
        } else {
          isServerConfigLoaded.current = true;
        }
      } catch (err) {
        isServerConfigLoaded.current = true;
        console.warn('[CMS-CLIENT] Note: Server config fetch fallback to local storage:', err);
      }
    };

    fetchServerConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  const [isAdminAuthenticated, setIsAdminAuthenticatedState] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);

  const setIsAdminAuthenticated = useCallback((auth: boolean) => {
    setIsAdminAuthenticatedState(auth);
    try {
      if (auth) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      } else {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    setIsEditorOpen(false);
    setAdminToast('🔒 Admin session locked.');
    setTimeout(() => setAdminToast(null), 3000);
  }, [setIsAdminAuthenticated]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'in-place' | 'dashboard'>('in-place');
  const [activeTab, setActiveTab] = useState('branding');
  const [activeEditTarget, setActiveEditTarget] = useState<string | null>(null);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Synchronous ref to prevent stale closures when rapidly updating settings
  const configRef = useRef<SiteConfig>(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Automatically persist locally and auto-sync to server ONLY when user made edits
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('[CMS-CLIENT] LocalStorage quota limit reached, skipping browser cache:', e);
    }

    // CRITICAL: NEVER overwrite server config unless an authenticated admin or editor explicitly modified content
    // and initial server config has finished loading!
    if (!hasUserModified.current || !isServerConfigLoaded.current || (!isAdminAuthenticated && !isEditorOpen)) {
      return;
    }

    const timer = setTimeout(() => {
      fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: configRef.current }),
      }).catch((err) => {
        console.warn('[CMS-CLIENT] Auto-save to server warning:', err);
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [config, isAdminAuthenticated]);

  // Sync dynamic partner count to stats
  useEffect(() => {
    const pCount = config.partners.length;
    setConfig((prev) => {
      const updatedStats = prev.stats.map((s) =>
        s.label.toLowerCase().includes('partner')
          ? { ...s, value: String(pCount).padStart(2, '0') }
          : s
      );
      return { ...prev, stats: updatedStats };
    });
  }, [config.partners.length]);

  const updateConfig = useCallback((updater: Partial<SiteConfig> | ((prev: SiteConfig) => SiteConfig)) => {
    hasUserModified.current = true;
    setConfig((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      configRef.current = next;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  const saveConfigToServer = useCallback(async (customConfig?: SiteConfig): Promise<boolean> => {
    setIsServerSaving(true);
    hasUserModified.current = true;
    const toSave = customConfig || configRef.current;
    try {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch {}
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: toSave }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.config) {
          setConfig(json.config);
          configRef.current = json.config;
        }
        setAdminToast('🚀 Published live across all visitor & shared pages!');
        setTimeout(() => setAdminToast(null), 4000);
        setIsServerSaving(false);
        return true;
      }
    } catch (e) {
      console.error('Failed to save to server:', e);
    }
    setIsServerSaving(false);
    setAdminToast('💾 Saved locally in browser session.');
    setTimeout(() => setAdminToast(null), 3000);
    return false;
  }, []);

  const resetToDefaults = useCallback(async () => {
    if (window.confirm('Reset all website contents, images, logos, and videos back to original factory defaults?')) {
      setConfig(DEFAULT_SITE_CONFIG);
      localStorage.removeItem(STORAGE_KEY);
      try {
        await fetch('/api/config/reset', { method: 'POST' });
      } catch {}
      setAdminToast('✨ Site content reset to original defaults');
      setTimeout(() => setAdminToast(null), 4000);
    }
  }, []);

  const exportConfigJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rpw-cms-config-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setAdminToast('📥 Exported CMS config JSON');
    setTimeout(() => setAdminToast(null), 3000);
  }, [config]);

  const importConfigJson = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        const merged = { ...DEFAULT_SITE_CONFIG, ...parsed };
        setConfig(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config: merged }),
        }).catch(() => {});
        setAdminToast('✅ Config successfully imported and published live!');
        setTimeout(() => setAdminToast(null), 4000);
        return true;
      }
    } catch (err) {
      alert('Invalid JSON file. Please check file formatting.');
    }
    return false;
  }, []);

  const notifySaved = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configRef.current));
    } catch {}
    setAdminToast('💾 Setting updated');
    setTimeout(() => setAdminToast(null), 2000);
  }, []);

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        updateConfig,
        resetToDefaults,
        exportConfigJson,
        importConfigJson,
        saveConfigToServer,
        isServerSaving,
        isEditorOpen,
        setIsEditorOpen,
        editorMode,
        setEditorMode,
        activeTab,
        setActiveTab,
        activeEditTarget,
        setActiveEditTarget,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        showOtpModal,
        setShowOtpModal,
        logoutAdmin,
        notifySaved,
        adminToast,
        setAdminToast,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
