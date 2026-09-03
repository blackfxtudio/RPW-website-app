import React, { useState } from 'react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { 
  X, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Film, 
  Image as ImageIcon, 
  Type, 
  Network, 
  Sliders, 
  Wrench, 
  HelpCircle, 
  Activity, 
  Database,
  Plus,
  Trash2,
  Check,
  Eye,
  ExternalLink,
  Sparkles,
  Palette,
  Shuffle,
  Repeat,
  ListMusic,
  PlaySquare,
  Share2,
  Globe,
  Search,
  Layers,
  Info,
  Link,
  Play,
  CheckCircle2,
  Video,
  ChevronDown,
  Menu,
  Lock,
  Mail,
  CloudUpload,
  RefreshCw,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import { MediaUploaderModal } from './MediaUploaderModal';
import { MoviePosterFetcherModal } from './MoviePosterFetcherModal';
import { SocialIconsGroup } from '../SocialIconsGroup';
import { extractYouTubeId, extractPlaylistId, getYouTubeEmbedUrl, isDirectVideoUrl } from '../../utils/mediaUtils';
import { PartnerStudio, WorkShot, ServiceItem, FAQItem, SocialLinkItem, PortfolioShowreelItem, MoviePosterItem, VfxBreakdownItem } from '../../types';
import { PORTFOLIO_REELS, COLLAGE_TILES, VFX_BREAKDOWNS } from '../../data/portfolioData';
import { MOVIE_POSTERS_DATA } from '../../data/moviePostersData';
import { RPW_FEATURES } from '../RPW3DFeatureShowcase';

export const AdminDashboard: React.FC = () => {
  const {
    config,
    updateConfig,
    isEditorOpen,
    setIsEditorOpen,
    editorMode,
    setEditorMode,
    activeTab,
    setActiveTab,
    notifySaved,
    saveConfigToServer,
    isServerSaving,
    resetToDefaults,
    exportConfigJson,
    importConfigJson,
    logoutAdmin,
  } = useSiteConfig();

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTargetKey, setMediaTargetKey] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaTitle, setMediaTitle] = useState<string>('Select Media');

  // Auto-Fetch Movie Poster Modal State
  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [posterTargetIndex, setPosterTargetIndex] = useState<number | null>(null);
  const [posterTargetType, setPosterTargetType] = useState<'home-poster' | 'reel' | 'collage' | 'breakdown'>('home-poster');
  const [posterInitialQuery, setPosterInitialQuery] = useState<string>('');

  // Mobile Sections Drawer State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const CMS_TABS = [
    { id: 'home-posters', label: 'Home Movie Posters (Films)', icon: Film, badge: 'HOME PAGE' },
    { id: 'reels', label: 'Showreel Video Matrix', icon: Video, badge: 'LIVE VIDEO WALL' },
    { id: 'breakdowns', label: 'VFX Breakdown Images (A/B)', icon: Sliders, badge: 'BEFORE/AFTER' },
    { id: 'rpw-connect', label: 'RPW 3D Features', icon: Layers, badge: '12 MODULES' },
    { id: 'partners', label: 'Maximum Bandwidth', icon: Network },
    { id: 'hero', label: 'Hero & Background Video', icon: Video },
    { id: 'work', label: 'Work Shots & Wipes', icon: Sliders },
    { id: 'services', label: 'Services & Pipeline', icon: Wrench },
    { id: 'about', label: 'About Us Page', icon: Info },
    { id: 'faqs', label: 'FAQs & Content', icon: HelpCircle },
    { id: 'branding', label: 'Branding & Social Channels', icon: Palette },
    { id: 'backup', label: 'JSON Export & Backup', icon: Database },
  ];

  if (!isEditorOpen || editorMode !== 'dashboard') return null;

  const openMediaModal = (targetKey: string, type: 'image' | 'video', title: string) => {
    setMediaTargetKey(targetKey);
    setMediaType(type);
    setMediaTitle(title);
    setMediaModalOpen(true);
  };

  const openPosterFetcher = (index: number, initialMovieName: string, type: 'home-poster' | 'reel' | 'collage' | 'breakdown' = 'home-poster') => {
    setPosterTargetIndex(index);
    setPosterTargetType(type);
    setPosterInitialQuery(initialMovieName || '');
    setPosterModalOpen(true);
  };

  const handlePosterSelected = (posterUrl: string, movieTitle?: string) => {
    if (posterTargetIndex === null) return;

    if (posterTargetType === 'home-poster') {
      const currentPosters = [...(config.moviePosters && config.moviePosters.length > 0 ? config.moviePosters : MOVIE_POSTERS_DATA)];
      if (currentPosters[posterTargetIndex]) {
        currentPosters[posterTargetIndex] = {
          ...currentPosters[posterTargetIndex],
          posterUrl,
          ...(movieTitle ? { title: movieTitle } : {}),
        };
        updateConfig({ moviePosters: currentPosters });
        notifySaved();
      }
    } else if (posterTargetType === 'reel') {
      const currentReels = [...(config.portfolioReels && config.portfolioReels.length > 0 ? config.portfolioReels : PORTFOLIO_REELS)];
      if (currentReels[posterTargetIndex]) {
        currentReels[posterTargetIndex] = {
          ...currentReels[posterTargetIndex],
          thumbnail: posterUrl,
          beforeImage: posterUrl,
          ...(movieTitle && !currentReels[posterTargetIndex].title ? { title: movieTitle } : {}),
        };
        updateConfig({ portfolioReels: currentReels });
        notifySaved();
      }
    } else if (posterTargetType === 'breakdown') {
      const currentBreakdowns = [...(config.vfxBreakdowns && config.vfxBreakdowns.length > 0 ? config.vfxBreakdowns : VFX_BREAKDOWNS)];
      if (currentBreakdowns[posterTargetIndex]) {
        currentBreakdowns[posterTargetIndex] = {
          ...currentBreakdowns[posterTargetIndex],
          beforeImage: posterUrl,
          ...(movieTitle && !currentBreakdowns[posterTargetIndex].title ? { title: movieTitle } : {}),
        };
        updateConfig({ vfxBreakdowns: currentBreakdowns });
        notifySaved();
      }
    } else if (posterTargetType === 'collage') {
      const currentTiles = [...(config.collageTiles && config.collageTiles.length > 0 ? config.collageTiles : COLLAGE_TILES)];
      if (currentTiles[posterTargetIndex]) {
        currentTiles[posterTargetIndex] = {
          ...currentTiles[posterTargetIndex],
          image: posterUrl,
          ...(movieTitle && !currentTiles[posterTargetIndex].title ? { title: movieTitle } : {}),
        };
        updateConfig({ collageTiles: currentTiles });
        notifySaved();
      }
    }
  };

  const handleMediaApplied = (url: string) => {
    if (mediaTargetKey.startsWith('partner-logo-')) {
      const idx = parseInt(mediaTargetKey.replace('partner-logo-', ''), 10);
      const updated = [...config.partners];
      if (updated[idx]) {
        updated[idx].logo = url;
        updateConfig({ partners: updated });
      }
    } else if (mediaTargetKey.startsWith('shot-raw-')) {
      const idx = parseInt(mediaTargetKey.replace('shot-raw-', ''), 10);
      const updated = [...config.shots];
      if (updated[idx]) {
        updated[idx].originalImage = url;
        updateConfig({ shots: updated });
      }
    } else if (mediaTargetKey.startsWith('shot-proc-')) {
      const idx = parseInt(mediaTargetKey.replace('shot-proc-', ''), 10);
      const updated = [...config.shots];
      if (updated[idx]) {
        updated[idx].processedImage = url;
        updateConfig({ shots: updated });
      }
    } else if (mediaTargetKey.startsWith('home-poster-')) {
      const idx = parseInt(mediaTargetKey.replace('home-poster-', ''), 10);
      const currentPosters = [...(config.moviePosters && config.moviePosters.length > 0 ? config.moviePosters : MOVIE_POSTERS_DATA)];
      if (currentPosters[idx]) {
        currentPosters[idx].posterUrl = url;
        updateConfig({ moviePosters: currentPosters });
      }
    } else if (mediaTargetKey.startsWith('reel-thumb-')) {
      const idx = parseInt(mediaTargetKey.replace('reel-thumb-', ''), 10);
      const currentReels = [...(config.portfolioReels && config.portfolioReels.length > 0 ? config.portfolioReels : PORTFOLIO_REELS)];
      if (currentReels[idx]) {
        currentReels[idx].thumbnail = url;
        updateConfig({ portfolioReels: currentReels });
      }
    } else if (mediaTargetKey.startsWith('reel-before-')) {
      const idx = parseInt(mediaTargetKey.replace('reel-before-', ''), 10);
      const currentReels = [...(config.portfolioReels && config.portfolioReels.length > 0 ? config.portfolioReels : PORTFOLIO_REELS)];
      if (currentReels[idx]) {
        currentReels[idx].beforeImage = url;
        updateConfig({ portfolioReels: currentReels });
      }
    } else if (mediaTargetKey.startsWith('reel-after-')) {
      const idx = parseInt(mediaTargetKey.replace('reel-after-', ''), 10);
      const currentReels = [...(config.portfolioReels && config.portfolioReels.length > 0 ? config.portfolioReels : PORTFOLIO_REELS)];
      if (currentReels[idx]) {
        currentReels[idx].afterImage = url;
        updateConfig({ portfolioReels: currentReels });
      }
    } else if (mediaTargetKey.startsWith('breakdown-before-')) {
      const idx = parseInt(mediaTargetKey.replace('breakdown-before-', ''), 10);
      const currentBreakdowns = [...(config.vfxBreakdowns && config.vfxBreakdowns.length > 0 ? config.vfxBreakdowns : VFX_BREAKDOWNS)];
      if (currentBreakdowns[idx]) {
        currentBreakdowns[idx].beforeImage = url;
        updateConfig({ vfxBreakdowns: currentBreakdowns });
      }
    } else if (mediaTargetKey.startsWith('breakdown-after-')) {
      const idx = parseInt(mediaTargetKey.replace('breakdown-after-', ''), 10);
      const currentBreakdowns = [...(config.vfxBreakdowns && config.vfxBreakdowns.length > 0 ? config.vfxBreakdowns : VFX_BREAKDOWNS)];
      if (currentBreakdowns[idx]) {
        currentBreakdowns[idx].afterImage = url;
        updateConfig({ vfxBreakdowns: currentBreakdowns });
      }
    } else if (mediaTargetKey === 'heroBgVideoYouTubeId') {
      const trimmed = url.trim();
      const isDirect = isDirectVideoUrl(trimmed);
      const ytId = !isDirect ? extractYouTubeId(trimmed) : null;
      const finalVal = ytId || trimmed;
      updateConfig({
        heroBgVideoYouTubeId: finalVal,
        ...(isDirect ? { heroBgVideoMp4Url: finalVal } : {}),
      });
    } else if (mediaTargetKey === 'heroBgPlaylistId') {
      const trimmed = url.trim();
      const plId = extractPlaylistId(trimmed) || trimmed;
      updateConfig({
        heroBgPlaylistId: plId,
      });
    } else {
      updateConfig({ [mediaTargetKey]: url } as any);
    }
    notifySaved();
  };

  const handleAddPartner = () => {
    const newPartner: PartnerStudio = {
      studioName: 'New VFX Partner',
      speciality: 'Feature Film Roto & Paint',
      artistCount: 25,
      region: 'Vancouver, Canada',
      logo: 'https://static.wixstatic.com/media/7ffb5e_bebd8db90704414a9140cfbf0e8fe1e1~mv2.png/v1/fill/w_400,h_400,al_c,q_90,enc_avif,quality_auto/RPW.png',
      status: 'ACTIVE',
    };
    updateConfig({ partners: [...config.partners, newPartner] });
    notifySaved();
  };

  const handleDeletePartner = (index: number) => {
    const updated = config.partners.filter((_, idx) => idx !== index);
    updateConfig({ partners: updated });
    notifySaved();
  };

  const handleAddHomePoster = () => {
    const currentPosters = config.moviePosters && config.moviePosters.length > 0 ? config.moviePosters : MOVIE_POSTERS_DATA;
    const newPoster: MoviePosterItem = {
      id: `poster-${Date.now()}`,
      title: 'New Movie / Project Title',
      year: '2025',
      category: 'Feature Film',
      studio: 'Studio Production',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      tag: 'FEATURE FILM',
      vfxWork: ['Sub-Pixel Roto', 'Clean Plate 4K', 'Wire Removal'],
      highlight: 'Production Delivered Shots',
    };
    updateConfig({ moviePosters: [newPoster, ...currentPosters] });
    notifySaved();
  };

  const handleDeleteHomePoster = (index: number) => {
    const currentPosters = config.moviePosters && config.moviePosters.length > 0 ? config.moviePosters : MOVIE_POSTERS_DATA;
    const updated = currentPosters.filter((_, idx) => idx !== index);
    updateConfig({ moviePosters: updated });
    notifySaved();
  };

  const handleAddMovieReel = () => {
    const currentReels = config.portfolioReels && config.portfolioReels.length > 0 ? config.portfolioReels : PORTFOLIO_REELS;
    const newReel: PortfolioShowreelItem = {
      id: `reel-${Date.now()}`,
      title: 'New Feature Film Breakdown',
      category: 'Roto',
      tag: 'FEATURE FILM VFX',
      thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      duration: '1:00',
      clientTier: 'Feature Film',
      resolution: '4K DCI (4096x2160)',
      turnaroundTime: '24 Hours',
      software: ['Silhouette FX', 'Nuke Studio', 'Mocha Pro'],
      description: 'High precision production roto, clean plate reconstruction and matte generation delivered to exacting tier-1 studio pipeline specs.',
      beforeImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
      featured: true,
    };
    updateConfig({ portfolioReels: [newReel, ...currentReels] });
    notifySaved();
  };

  const handleDeleteMovieReel = (index: number) => {
    const currentReels = config.portfolioReels && config.portfolioReels.length > 0 ? config.portfolioReels : PORTFOLIO_REELS;
    const updated = currentReels.filter((_, idx) => idx !== index);
    updateConfig({ portfolioReels: updated });
    notifySaved();
  };

  const handleAddBreakdown = () => {
    const currentBreakdowns = config.vfxBreakdowns && config.vfxBreakdowns.length > 0 ? config.vfxBreakdowns : VFX_BREAKDOWNS;
    const newBreakdown: VfxBreakdownItem = {
      id: `breakdown-${Date.now()}`,
      title: 'New VFX Production Breakdown',
      category: 'Roto',
      tag: 'SUB-PIXEL MATTE / CLEAN PLATE',
      beforeImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
      resolution: '4K DCI (4096x2160)',
      turnaroundTime: '24 Hours',
      software: ['Silhouette FX', 'Nuke Studio', 'Mocha Pro'],
      description: 'High precision production roto, clean plate reconstruction and matte generation delivered to exacting tier-1 studio pipeline specs.',
      featured: true,
    };
    updateConfig({ vfxBreakdowns: [newBreakdown, ...currentBreakdowns] });
    notifySaved();
  };

  const handleDeleteBreakdown = (index: number) => {
    const currentBreakdowns = config.vfxBreakdowns && config.vfxBreakdowns.length > 0 ? config.vfxBreakdowns : VFX_BREAKDOWNS;
    const updated = currentBreakdowns.filter((_, idx) => idx !== index);
    updateConfig({ vfxBreakdowns: updated });
    notifySaved();
  };

  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      question: 'New Question regarding pipeline turnaround?',
      answer: 'We provide 12-hour turnaround passes for urgent shots with dedicated overnight shifts.',
    };
    updateConfig({ faqs: [...config.faqs, newFaq] });
    notifySaved();
  };

  const handleDeleteFaq = (index: number) => {
    const updated = config.faqs.filter((_, idx) => idx !== index);
    updateConfig({ faqs: updated });
    notifySaved();
  };

  const handleUpdateSocial = (index: number, patch: Partial<SocialLinkItem>) => {
    const currentList = [...(config.socialLinks || [])];
    if (currentList[index]) {
      currentList[index] = { ...currentList[index], ...patch };
      updateConfig({ socialLinks: currentList });
      notifySaved();
    }
  };

  const handleAddSocialLink = () => {
    const newLink: SocialLinkItem = {
      id: `social-${Date.now()}`,
      platform: 'linkedin',
      label: 'LinkedIn Channel',
      url: 'https://linkedin.com/company/roto-paint-wala',
      enabled: true,
    };
    updateConfig({ socialLinks: [...(config.socialLinks || []), newLink] });
    notifySaved();
  };

  const handleDeleteSocial = (index: number) => {
    const currentList = config.socialLinks || [];
    const updated = currentList.filter((_, idx) => idx !== index);
    updateConfig({ socialLinks: updated });
    notifySaved();
  };

  const handleFeatureImageUpload = async (featureId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl: base64, filename: file.name }),
          });
          const json = await res.json();
          const targetUrl = json.success && json.url ? json.url : base64;
          updateConfig({
            rpwFeatureImages: {
              ...(config.rpwFeatureImages || {}),
              [featureId]: targetUrl,
            },
          });
        } catch {
          updateConfig({
            rpwFeatureImages: {
              ...(config.rpwFeatureImages || {}),
              [featureId]: base64,
            },
          });
        }
        notifySaved();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFeatureImageUrlChange = (featureId: string, url: string) => {
    updateConfig({
      rpwFeatureImages: {
        ...(config.rpwFeatureImages || {}),
        [featureId]: url,
      },
    });
  };

  const handleResetFeatureImage = (featureId: string) => {
    const updated = { ...(config.rpwFeatureImages || {}) };
    delete updated[featureId];
    updateConfig({ rpwFeatureImages: updated });
    notifySaved();
  };

  const handleFeatureOverrideChange = (
    featureId: string,
    field: 'title' | 'shortDesc' | 'category' | 'badgeText',
    value: string
  ) => {
    updateConfig({
      rpwFeatureOverrides: {
        ...(config.rpwFeatureOverrides || {}),
        [featureId]: {
          ...(config.rpwFeatureOverrides?.[featureId] || {}),
          [field]: value,
        },
      },
    });
  };

  const handleResetFeatureOverride = (featureId: string) => {
    const updatedOverrides = { ...(config.rpwFeatureOverrides || {}) };
    delete updatedOverrides[featureId];
    const updatedImages = { ...(config.rpwFeatureImages || {}) };
    delete updatedImages[featureId];
    updateConfig({
      rpwFeatureOverrides: updatedOverrides,
      rpwFeatureImages: updatedImages,
    });
    notifySaved();
  };

  const handleResetAllFeatureImages = () => {
    updateConfig({
      rpwFeatureImages: {},
      rpwFeatureOverrides: {},
    });
    notifySaved();
  };

  const currentPostersList = config.moviePosters && config.moviePosters.length > 0 ? config.moviePosters : MOVIE_POSTERS_DATA;
  const currentReelsList = config.portfolioReels && config.portfolioReels.length > 0 ? config.portfolioReels : PORTFOLIO_REELS;
  const currentBreakdownsList = config.vfxBreakdowns && config.vfxBreakdowns.length > 0 ? config.vfxBreakdowns : VFX_BREAKDOWNS;
  const currentTilesList = config.collageTiles && config.collageTiles.length > 0 ? config.collageTiles : COLLAGE_TILES;

  const activeTabObj = CMS_TABS.find((t) => t.id === activeTab) || CMS_TABS[0];
  const ActiveTabIcon = activeTabObj.icon;

  return (
    <div className="fixed inset-0 z-[90] bg-[#05070b]/98 backdrop-blur-2xl text-white flex flex-col animate-in fade-in duration-300">
      {/* Dashboard Top Header */}
      <header className="h-14 sm:h-16 border-b border-white/10 px-3.5 sm:px-6 flex items-center justify-between bg-[#08111a]/95 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#66fcf1] text-[#05070b] flex items-center justify-center font-bold font-mono text-xs sm:text-sm shrink-0">
            CMS
          </div>

          {/* Desktop Title */}
          <div className="hidden md:block min-w-0">
            <h2 className="font-heading font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span>ROTO PAINT WALA</span>
              <span className="text-[#66fcf1] font-mono text-xs font-normal">/ Page-Wise Studio Control</span>
            </h2>
            <p className="text-[11px] text-[#9daab4] truncate">
              Visual Content Management, Live Background Video & Film Poster Auto-Fetch
            </p>
          </div>

          {/* Mobile Tab Selector Button */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#66fcf1]/40 text-xs font-bold text-white transition-all max-w-[160px] truncate"
          >
            <ActiveTabIcon className="w-3.5 h-3.5 text-[#66fcf1] shrink-0" />
            <span className="truncate">{activeTabObj.label}</span>
            <ChevronDown className="w-3 h-3 text-[#66fcf1] shrink-0" />
          </button>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Cloud Auto-Sync Active
          </div>

          <button
            onClick={() => setEditorMode('in-place')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-[#66fcf1] bg-[#66fcf1]/10 border border-[#66fcf1]/30 hover:bg-[#66fcf1] hover:text-[#05070b] transition-all"
            title="Switch to In-Place Preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview Mode</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all"
            title="Lock Admin Session (Requires OTP to re-enter)"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock</span>
          </button>

          <button
            onClick={() => saveConfigToServer()}
            disabled={isServerSaving}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-extrabold text-[#05070b] bg-[#66fcf1] shadow-[0_0_20px_rgba(102,252,241,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-75"
            title="Save and Publish Live across all visitor pages"
          >
            {isServerSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#05070b]" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-3.5 h-3.5 text-[#05070b]" />
                <span>Publish Live</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsEditorOpen(false)}
            className="p-1.5 sm:p-2 rounded-full text-[#9daab4] hover:text-white hover:bg-white/10 transition-colors"
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Split Layout: Left Icon Rail for Mobile/Tablet/Desktop + Responsive Content Panel */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar / Vertical Icon Rail (Mobile, Tablet & Desktop) */}
        <aside className="w-14 sm:w-16 lg:w-60 border-r border-white/10 p-2 sm:p-3 lg:p-4 flex flex-col gap-1.5 bg-[#060c13]/90 backdrop-blur-md overflow-y-auto no-scrollbar shrink-0 select-none">
          <span className="hidden lg:block text-[10px] font-poppins font-bold uppercase tracking-wider text-white/40 px-3 py-1.5">
            PAGE & SECTION CMS
          </span>

          <div className="flex flex-col gap-1.5 sm:gap-2">
            {CMS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <div key={tab.id} className="relative group flex items-center justify-center lg:justify-start">
                  {/* Floating Tooltip with Poppins Font on Hover (Mobile, Tablet & Desktop) */}
                  <div className="lg:hidden absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#05070b] border border-[#66fcf1]/50 text-[#66fcf1] text-[11px] font-poppins font-semibold shadow-[0_0_20px_rgba(102,252,241,0.4)] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                    {tab.label}
                    {tab.badge && (
                      <span className="ml-1.5 text-[8px] font-poppins font-bold px-1.5 py-0.5 rounded bg-[#66fcf1] text-[#05070b]">
                        {tab.badge}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-full lg:h-auto flex items-center justify-center lg:justify-between p-2 lg:px-3.5 lg:py-2.5 rounded-xl text-xs font-poppins font-semibold transition-all duration-200 ease-out group-hover:scale-110 ${
                      isActive
                        ? 'bg-[#66fcf1]/20 text-[#66fcf1] border border-[#66fcf1] shadow-[0_0_15px_rgba(102,252,241,0.3)] scale-105 font-bold'
                        : 'text-[#9daab4] hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                    aria-label={tab.label}
                    title={tab.label}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-5 h-5 lg:w-4 lg:h-4 shrink-0 transition-transform duration-200 group-hover:scale-125 ${isActive ? 'text-[#66fcf1]' : ''}`} />
                      <span className="hidden lg:inline truncate text-[13px]">{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className="hidden lg:inline text-[8px] font-poppins font-extrabold px-1.5 py-0.5 rounded bg-[#66fcf1] text-[#05070b]">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-3 sm:pt-4 border-t border-white/10 flex flex-col items-center lg:items-stretch">
            <button
              onClick={resetToDefaults}
              className="w-10 h-10 sm:w-11 sm:h-11 lg:w-full lg:h-auto flex items-center justify-center gap-2 p-2 lg:px-3 lg:py-2 rounded-xl text-xs font-poppins font-semibold text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 hover:scale-110 lg:hover:scale-100 transition-all"
              title="Reset All to Defaults"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline text-xs">Reset to Defaults</span>
            </button>
          </div>
        </aside>

        {/* Right Content Panel - Scaled & Uniform for Mobile + Desktop */}
        <main className="flex-1 w-full min-w-0 p-3 sm:p-6 md:p-8 lg:p-10 overflow-y-auto no-scrollbar bg-[#05070b]">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 min-w-0">
            {/* ========================================================================= */}
            {/* TAB: HOME PAGE MOVIE POSTERS WALL (THE WORK WE DID ON MOVIES)             */}
            {/* ========================================================================= */}
            {activeTab === 'home-posters' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-1 flex items-center gap-2">
                      <span>Home Page: Feature Film Posters Wall</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#00df81]/15 text-[#00df81] border border-[#00df81]/30 text-[10px] font-mono font-bold">
                        WORK ON MOVIES
                      </span>
                    </h3>
                    <p className="text-xs text-[#9daab4]">
                      Manage the 9:16 vertical theatrical film posters displayed on the 3D rotating marquee wall on the Home Page. Use Auto-Fetch to pull official Google/Apple artwork for any Indian or worldwide film.
                    </p>
                  </div>

                  <button
                    onClick={handleAddHomePoster}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00df81] text-[#05070b] text-xs font-extrabold hover:shadow-[0_0_20px_rgba(0,223,129,0.4)] transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Movie Poster</span>
                  </button>
                </div>

                {/* Section Hero Callout Card Settings */}
                <div className="p-6 rounded-2xl bg-[#08111a] border border-[#00df81]/40 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#00df81]/15 text-[#00df81] flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-heading">Floating Poster Wall Callout Card & Typography</h4>
                        <p className="text-[11px] text-[#9daab4]">Customize the floating headline, subheadline, and description on the Home page poster marquee.</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#00df81]/15 text-[#00df81] text-[10px] font-mono font-bold">
                      FLOATING HERO OVERLAY
                    </span>
                  </div>

                  {/* 3-Line Headline Columns */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono text-[#9daab4] font-bold">
                        Headline (3-Line Columns)
                      </label>
                      <span className="text-[10px] font-mono text-[#00df81] font-bold">
                        3-LINE STACKED LAYOUT
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-white/60 mb-1 font-bold">Line 1 (Top)</label>
                        <input
                          type="text"
                          value={config.homePostersHeadlineLine1 ?? 'THE ART BEHIND'}
                          onChange={(e) => updateConfig({ homePostersHeadlineLine1: e.target.value })}
                          placeholder="e.g. THE ART BEHIND"
                          className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3.5 py-2 text-xs font-bold text-white uppercase focus:border-[#00df81] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/60 mb-1 font-bold">Line 2 (Middle)</label>
                        <input
                          type="text"
                          value={config.homePostersHeadlineLine2 ?? 'THE'}
                          onChange={(e) => updateConfig({ homePostersHeadlineLine2: e.target.value })}
                          placeholder="e.g. THE"
                          className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3.5 py-2 text-xs font-bold text-white uppercase focus:border-[#00df81] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/60 mb-1 font-bold">Line 3 (Bottom)</label>
                        <input
                          type="text"
                          value={config.homePostersHeadlineLine3 ?? 'BLOCKBUSTERS'}
                          onChange={(e) => updateConfig({ homePostersHeadlineLine3: e.target.value })}
                          placeholder="e.g. BLOCKBUSTERS"
                          className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3.5 py-2 text-xs font-bold text-white uppercase focus:border-[#00df81] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Subheadline */}
                    <div>
                      <label className="block text-xs font-mono text-[#9daab4] mb-1">
                        Subheadline
                      </label>
                      <input
                        type="text"
                        value={config.homePostersSubheadline ?? 'Sub-Pixel Rotoscopy & Digital Paint'}
                        onChange={(e) => updateConfig({ homePostersSubheadline: e.target.value })}
                        placeholder="Sub-Pixel Rotoscopy & Digital Paint"
                        className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3.5 py-2 text-xs font-bold text-[#00df81] italic focus:border-[#00df81] focus:outline-none"
                      />
                    </div>

                    {/* CTA Button */}
                    <div>
                      <label className="block text-xs font-mono text-[#9daab4] mb-1">
                        CTA Button Label
                      </label>
                      <input
                        type="text"
                        value={config.homePostersCtaText ?? 'REQUEST PILOT SHOT'}
                        onChange={(e) => updateConfig({ homePostersCtaText: e.target.value })}
                        placeholder="REQUEST PILOT SHOT"
                        className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3.5 py-2 text-xs font-bold text-white uppercase focus:border-[#00df81] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-mono text-[#9daab4] mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={config.homePostersDescription ?? 'These floating posters showcase the high-precision visual effects built by our collaborative team.'}
                      onChange={(e) => updateConfig({ homePostersDescription: e.target.value })}
                      placeholder="These floating posters showcase the high-precision visual effects built by our collaborative team."
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl p-3 text-xs text-white leading-relaxed focus:border-[#00df81] focus:outline-none"
                    />
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <p className="text-[11px] text-[#9daab4] font-mono">
                      All changes reflect live on the Home page poster marquee card.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        updateConfig({
                          homePostersHeadline: 'THE ART BEHIND THE BLOCKBUSTERS',
                          homePostersHeadlineLine1: 'THE ART BEHIND',
                          homePostersHeadlineLine2: 'THE',
                          homePostersHeadlineLine3: 'BLOCKBUSTERS',
                          homePostersSubheadline: 'Sub-Pixel Rotoscopy & Digital Paint',
                          homePostersDescription: 'These floating posters showcase the high-precision visual effects built by our collaborative team.',
                          homePostersCtaText: 'REQUEST PILOT SHOT',
                        });
                        notifySaved();
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-mono font-bold transition-colors"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>

                {/* Auto-Fetch Notice Box */}
                <div className="p-4 rounded-2xl bg-[#08111a] border border-[#00df81]/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00df81]/15 border border-[#00df81]/40 flex items-center justify-center text-[#00df81] shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Google & Worldwide Poster Auto-Fetch</h4>
                      <p className="text-[11px] text-[#9daab4]">
                        Type any Indian or international movie name (e.g., <strong>Kalki 2898 AD</strong>, <strong>Pushpa 2</strong>, <strong>RRR</strong>, <strong>Dune 2</strong>, <strong>Avatar</strong>, <strong>Batman</strong>) and click <strong>Auto-Fetch</strong> to pull high-res theatrical posters instantly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Movie Posters List */}
                <div className="space-y-6">
                  {currentPostersList.map((poster, index) => (
                    <div
                      key={poster.id || index}
                      className="bg-[#08111a] border border-white/10 rounded-2xl p-6 space-y-4 relative group"
                    >
                      {/* Top Bar with Number & Delete */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#00df81]/10 border border-[#00df81]/30 text-[10px] font-mono text-[#00df81] font-bold">
                            FILM #{index + 1} • {poster.year}
                          </span>
                          <span className="text-xs text-white/50 font-mono">{poster.studio}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openPosterFetcher(index, poster.title, 'home-poster')}
                            className="px-3 py-1 rounded-lg bg-[#00df81]/15 hover:bg-[#00df81]/30 text-[#00df81] border border-[#00df81]/40 text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Auto-Fetch Poster</span>
                          </button>

                          <button
                            onClick={() => handleDeleteHomePoster(index)}
                            className="p-1.5 text-white/30 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Movie Poster"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Main Edit Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* 9:16 Poster Preview & URL */}
                        <div className="space-y-2">
                          <label className="block text-xs font-mono uppercase text-[#00df81] font-bold">
                            9:16 Theatrical Poster
                          </label>
                          <div className="aspect-[9/16] w-full max-w-[180px] mx-auto md:max-w-none rounded-xl overflow-hidden bg-black border-2 border-[#00df81]/40 relative group/thumb shadow-lg">
                            <img
                              src={poster.posterUrl || undefined}
                              alt={poster.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                              <button
                                type="button"
                                onClick={() => openPosterFetcher(index, poster.title, 'home-poster')}
                                className="w-full py-2 rounded-lg bg-[#00df81] text-[#05070b] font-black text-xs flex items-center justify-center gap-1.5"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Auto-Fetch</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => openMediaModal(`home-poster-${index}`, 'image', `Upload/Browse Poster (${poster.title})`)}
                                className="w-full py-1.5 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20"
                              >
                                Browse Files
                              </button>
                            </div>
                          </div>

                          {/* Direct Poster URL input */}
                          <div className="space-y-1 pt-1">
                            <label className="block text-[10px] font-mono text-[#9daab4]">
                              Poster Image URL:
                            </label>
                            <div className="flex gap-1.5">
                              <input
                                type="url"
                                value={poster.posterUrl || ''}
                                onChange={(e) => {
                                  const updated = [...currentPostersList];
                                  updated[index].posterUrl = e.target.value;
                                  updateConfig({ moviePosters: updated });
                                }}
                                placeholder="https://... image URL"
                                className="flex-1 bg-[#05070b] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-[#00df81] focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => openPosterFetcher(index, poster.title, 'home-poster')}
                                className="px-2 py-1.5 rounded-lg bg-[#00df81]/10 text-[#00df81] border border-[#00df81]/30 hover:bg-[#00df81] hover:text-black transition-all"
                                title="Auto-Fetch Poster"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Middle & Right: Metadata Inputs */}
                        <div className="md:col-span-2 space-y-4">
                          {/* Title & Category */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-mono text-[#9daab4] mb-1">
                                Film / Movie Title
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={poster.title}
                                  onChange={(e) => {
                                    const updated = [...currentPostersList];
                                    updated[index].title = e.target.value;
                                    updateConfig({ moviePosters: updated });
                                  }}
                                  placeholder="e.g. Kalki 2898 AD"
                                  className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-[#00df81] focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => openPosterFetcher(index, poster.title, 'home-poster')}
                                  className="px-2.5 py-2 rounded-xl bg-[#00df81]/10 text-[#00df81] border border-[#00df81]/30 hover:bg-[#00df81] hover:text-[#05070b] text-[11px] font-mono font-bold flex items-center gap-1 transition-all"
                                  title="Search poster for this movie name"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Fetch</span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-mono text-[#9daab4] mb-1">
                                Category / Genre
                              </label>
                              <input
                                type="text"
                                value={poster.category}
                                onChange={(e) => {
                                  const updated = [...currentPostersList];
                                  updated[index].category = e.target.value;
                                  updateConfig({ moviePosters: updated });
                                }}
                                placeholder="e.g. Epic Sci-Fi / Pan-India Blockbuster"
                                className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-[#00df81] focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Year, Studio & Highlight */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-mono text-[#9daab4] mb-1">Release Year</label>
                              <input
                                type="text"
                                value={poster.year}
                                onChange={(e) => {
                                  const updated = [...currentPostersList];
                                  updated[index].year = e.target.value;
                                  updateConfig({ moviePosters: updated });
                                }}
                                className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-[#9daab4] mb-1">Studio / Client</label>
                              <input
                                type="text"
                                value={poster.studio}
                                onChange={(e) => {
                                  const updated = [...currentPostersList];
                                  updated[index].studio = e.target.value;
                                  updateConfig({ moviePosters: updated });
                                }}
                                className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-[#9daab4] mb-1">Work Highlight</label>
                              <input
                                type="text"
                                value={poster.highlight || ''}
                                onChange={(e) => {
                                  const updated = [...currentPostersList];
                                  updated[index].highlight = e.target.value;
                                  updateConfig({ moviePosters: updated });
                                }}
                                placeholder="e.g. 1,800+ Roto & Cleanup Frames"
                                className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-[#00df81] font-mono font-bold"
                              />
                            </div>
                          </div>

                          {/* Delivered VFX Prep Services (comma separated) */}
                          <div>
                            <label className="block text-[10px] font-mono text-[#9daab4] mb-1">
                              Delivered VFX Prep Services (comma separated)
                            </label>
                            <input
                              type="text"
                              value={poster.vfxWork ? poster.vfxWork.join(', ') : ''}
                              onChange={(e) => {
                                const updated = [...currentPostersList];
                                updated[index].vfxWork = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                                updateConfig({ moviePosters: updated });
                              }}
                              placeholder="Sub-pixel Roto, Wire Removal, Clean Plate Extension"
                              className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-[#00df81] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: SHOWREEL VIDEO MATRIX (LIVE VIDEO WALL ON PORTFOLIO)                 */}
            {/* ========================================================================= */}
            {activeTab === 'reels' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-1 flex items-center gap-2">
                      <Video className="w-6 h-6 text-[#66fcf1]" />
                      <span>Portfolio: Showreel Video Matrix</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#66fcf1]/10 text-[#66fcf1] text-[10px] font-mono font-bold">
                        LIVE VIDEO WALL
                      </span>
                    </h3>
                    <p className="text-xs text-[#9daab4]">
                      Manage video showreels streaming continuously across the 3D Reel Wall. Supports YouTube links with autoplay on frontend, Vimeo, and direct MP4 videos.
                    </p>
                  </div>

                  <button
                    onClick={handleAddMovieReel}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#66fcf1] text-[#05070b] text-xs font-extrabold hover:shadow-[0_0_20px_rgba(102,252,241,0.3)] transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Video Reel</span>
                  </button>
                </div>

                {/* Collaboration Showcase Tagline Customizer */}
                <div className="p-5 rounded-2xl bg-[#08111a] border border-[#66fcf1]/30 space-y-4">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#66fcf1]" />
                      <span>Collaboration Showcase Wall Header & Tagline (Poppins Typography)</span>
                    </h4>
                    <p className="text-[11px] text-[#9daab4] mt-0.5">
                      Configure the main headline tagline and sub-description shown on the Portfolio page with Poppins font.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-['Poppins',sans-serif] uppercase text-[#66fcf1] font-bold mb-1.5">
                        Main Tagline (Poppins)
                      </label>
                      <input
                        type="text"
                        value={config.collaborationTagline ?? 'COLLABORATION SHOWCASE'}
                        onChange={(e) => updateConfig({ collaborationTagline: e.target.value })}
                        placeholder="COLLABORATION SHOWCASE"
                        className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white font-['Poppins',sans-serif] font-semibold focus:border-[#66fcf1] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-['Poppins',sans-serif] uppercase text-[#66fcf1] font-bold mb-1.5">
                        Sub-Description (Poppins)
                      </label>
                      <input
                        type="text"
                        value={config.collaborationSubDescription ?? 'A shared celebration of our creative partnerships.'}
                        onChange={(e) => updateConfig({ collaborationSubDescription: e.target.value })}
                        placeholder="A shared celebration of our creative partnerships."
                        className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white font-['Poppins',sans-serif] focus:border-[#66fcf1] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Live Visual Preview */}
                  <div className="p-4 rounded-xl bg-[#03060a] border border-[#66fcf1]/30 text-center">
                    <span className="text-[10px] font-mono text-[#66fcf1]/70 uppercase tracking-widest block mb-2">Live Header Preview</span>
                    <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-[#f0fbff] to-[#a8f5f0]">
                      {config.collaborationTagline || 'COLLABORATION SHOWCASE'}
                    </h2>
                    <p className="font-['Poppins',sans-serif] text-xs text-slate-300 mt-1 max-w-md mx-auto">
                      {config.collaborationSubDescription || 'A shared celebration of our creative partnerships.'}
                    </p>
                  </div>
                </div>

                {/* Info Notice Box */}
                <div className="p-4 rounded-2xl bg-[#08111a] border border-[#66fcf1]/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#66fcf1]/15 border border-[#66fcf1]/40 flex items-center justify-center text-[#66fcf1] shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Continuous Video Loop & Autoplay Support</h4>
                      <p className="text-[11px] text-[#9daab4]">
                        Videos stream live on the portfolio 3D collage wall. When users click any video tile, the cinema master modal launches in high-definition.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Reels List */}
                <div className="space-y-6">
                  {currentReelsList.map((reel, index) => (
                    <div
                      key={reel.id || index}
                      className="bg-[#08111a] border border-white/10 rounded-2xl p-6 space-y-4 relative group"
                    >
                      {/* Top Bar with Number & Delete */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/30 text-[10px] font-mono text-[#66fcf1] font-bold">
                            REEL #{index + 1} ({reel.category})
                          </span>
                          <span className="text-xs text-white/50 font-mono">{reel.resolution}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openPosterFetcher(index, reel.title, 'reel')}
                            className="px-3 py-1 rounded-lg bg-[#66fcf1]/15 hover:bg-[#66fcf1]/30 text-[#66fcf1] border border-[#66fcf1]/40 text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Auto-Fetch Poster</span>
                          </button>

                          <button
                            onClick={() => handleDeleteMovieReel(index)}
                            className="p-1.5 text-white/30 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Video Reel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Main Edit Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Video Preview & Poster Thumbnail */}
                        <div className="space-y-3">
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/20 relative group/thumb">
                            {reel.videoUrl ? (
                              extractYouTubeId(reel.videoUrl) ? (
                                <iframe
                                  src={getYouTubeEmbedUrl(reel.videoUrl, { autoplay: false, mute: true, controls: true }) || undefined}
                                  title="Admin Video Preview"
                                  referrerPolicy="strict-origin-when-cross-origin"
                                  className="w-full h-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              ) : isDirectVideoUrl(reel.videoUrl) ? (
                                <video src={reel.videoUrl || undefined} controls className="w-full h-full object-cover" />
                              ) : (
                                <img
                                  src={reel.thumbnail || reel.beforeImage || undefined}
                                  alt={reel.title}
                                  className="w-full h-full object-cover"
                                />
                              )
                            ) : (
                              <img
                                src={reel.thumbnail || reel.beforeImage || undefined}
                                alt={reel.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-mono uppercase text-[#9daab4] font-bold">
                              Poster / Thumbnail Image URL
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={reel.thumbnail || ''}
                                onChange={(e) => {
                                  const updated = [...currentReelsList];
                                  updated[index].thumbnail = e.target.value;
                                  updateConfig({ portfolioReels: updated });
                                }}
                                placeholder="Thumbnail artwork URL..."
                                className="flex-1 bg-[#05070b] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => openMediaModal(`reel-thumb-${index}`, 'image', `Upload Thumbnail (${reel.title})`)}
                                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs whitespace-nowrap"
                              >
                                Browse Files
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Metadata Inputs */}
                        <div className="space-y-3">
                          {/* Title & Category */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-mono text-[#9daab4] mb-1">
                                Video / Movie Title
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={reel.title}
                                  onChange={(e) => {
                                    const updated = [...currentReelsList];
                                    updated[index].title = e.target.value;
                                    updateConfig({ portfolioReels: updated });
                                  }}
                                  placeholder="e.g. Dune: Part Two"
                                  className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-[#66fcf1] focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => openPosterFetcher(index, reel.title, 'reel')}
                                  className="px-2.5 py-2 rounded-xl bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30 hover:bg-[#66fcf1] hover:text-[#05070b] text-[11px] font-mono font-bold flex items-center gap-1 transition-all"
                                  title="Search poster for this movie name"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Fetch</span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-mono text-[#9daab4] mb-1">
                                Category
                              </label>
                              <select
                                value={reel.category}
                                onChange={(e) => {
                                  const updated = [...currentReelsList];
                                  updated[index].category = e.target.value as any;
                                  updateConfig({ portfolioReels: updated });
                                }}
                                className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-[#66fcf1] focus:outline-none"
                              >
                                <option value="Roto">Roto</option>
                                <option value="Digital Paint">Digital Paint</option>
                                <option value="Wire Removal">Wire Removal</option>
                                <option value="Beauty & De-Aging">Beauty & De-Aging</option>
                                <option value="Stereo 3D">Stereo 3D</option>
                                <option value="Full Comp">Full Comp</option>
                              </select>
                            </div>
                          </div>

                          {/* Video / Breakdown URL */}
                          <div>
                            <label className="block text-xs font-mono text-[#9daab4] mb-1">
                              Showreel Video URL (YouTube, Vimeo, MP4 direct)
                            </label>
                            <input
                              type="text"
                              value={reel.videoUrl}
                              onChange={(e) => {
                                const updated = [...currentReelsList];
                                updated[index].videoUrl = e.target.value;
                                updateConfig({ portfolioReels: updated });
                              }}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-[#66fcf1] focus:outline-none"
                            />
                            {reel.videoUrl && (
                              <div className="mt-2 p-2.5 rounded-xl bg-black/60 border border-[#66fcf1]/30 flex items-center justify-between text-[10px] font-mono text-[#66fcf1]">
                                <span className="flex items-center gap-1 font-bold">
                                  <Sparkles className="w-3 h-3" />
                                  {extractYouTubeId(reel.videoUrl) ? `YouTube Video Detected (ID: ${extractYouTubeId(reel.videoUrl)})` : 'Direct Video Active'}
                                </span>
                                <span className="text-[#9daab4]">Plays live on 3D Collage Wall</span>
                              </div>
                            )}
                          </div>

                          {/* Specs: Resolution, Client Tier, Turnaround */}
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-mono text-[#9daab4] mb-1">Resolution</label>
                              <input
                                type="text"
                                value={reel.resolution}
                                onChange={(e) => {
                                  const updated = [...currentReelsList];
                                  updated[index].resolution = e.target.value;
                                  updateConfig({ portfolioReels: updated });
                                }}
                                className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-[#9daab4] mb-1">Client Tier</label>
                              <input
                                type="text"
                                value={reel.clientTier}
                                onChange={(e) => {
                                  const updated = [...currentReelsList];
                                  updated[index].clientTier = e.target.value;
                                  updateConfig({ portfolioReels: updated });
                                }}
                                className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-[#9daab4] mb-1">Turnaround</label>
                              <input
                                type="text"
                                value={reel.turnaroundTime}
                                onChange={(e) => {
                                  const updated = [...currentReelsList];
                                  updated[index].turnaroundTime = e.target.value;
                                  updateConfig({ portfolioReels: updated });
                                }}
                                className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-[10px] font-mono text-[#9daab4] mb-1">
                              Technical Description & Pipeline Notes
                            </label>
                            <textarea
                              rows={2}
                              value={reel.description}
                              onChange={(e) => {
                                const updated = [...currentReelsList];
                                updated[index].description = e.target.value;
                                updateConfig({ portfolioReels: updated });
                              }}
                              className="w-full bg-[#05070b] border border-white/20 rounded-xl p-2.5 text-xs text-white leading-relaxed focus:border-[#66fcf1] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: VFX BREAKDOWN IMAGES (BEFORE / AFTER COMPARISON SLIDERS)              */}
            {/* ========================================================================= */}
            {(activeTab === 'breakdowns' || activeTab === 'movies') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-1 flex items-center gap-2">
                      <Sliders className="w-6 h-6 text-[#66fcf1]" />
                      <span>Portfolio: 4 VFX Breakdown Images (A/B Plates)</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#66fcf1]/10 text-[#66fcf1] text-[10px] font-['Poppins',sans-serif] font-bold">
                        4 SHOTS
                      </span>
                    </h3>
                    <p className="text-xs text-[#9daab4]">
                      Edit the 4 featured VFX breakdown cards displayed on the Portfolio page. Compare Raw Ingest Plates against Clean Plates & Delivered Roto Mattes with interactive swipe sliders.
                    </p>
                  </div>

                  <button
                    onClick={handleAddBreakdown}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#66fcf1] text-[#05070b] text-xs font-extrabold hover:shadow-[0_0_20px_rgba(102,252,241,0.3)] transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Breakdown Shot</span>
                  </button>
                </div>

                {/* Auto-Fetch Notice Box */}
                <div className="p-4 rounded-2xl bg-[#08111a] border border-[#66fcf1]/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#66fcf1]/15 border border-[#66fcf1]/40 flex items-center justify-center text-[#66fcf1] shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Movie Poster Auto-Fetch & Dual Plate Support</h4>
                      <p className="text-[11px] text-[#9daab4]">
                        Type any movie title (e.g., Dune 2, Avatar, Batman, Oppenheimer) and click <strong>Auto-Fetch Poster</strong> to pull high-res artwork, or upload raw plates and matte files directly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Breakdown Items List */}
                <div className="space-y-6">
                  {currentBreakdownsList.map((breakdown, index) => (
                    <div
                      key={breakdown.id || index}
                      className="bg-[#08111a] border border-white/10 rounded-2xl p-6 space-y-4 relative group"
                    >
                      {/* Top Bar with Number & Delete */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/30 text-[10px] font-mono text-[#66fcf1] font-bold">
                            BREAKDOWN #{index + 1} ({breakdown.category})
                          </span>
                          <span className="text-xs text-white/50 font-mono">{breakdown.resolution}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openPosterFetcher(index, breakdown.title, 'breakdown')}
                            className="px-3 py-1 rounded-lg bg-[#66fcf1]/15 hover:bg-[#66fcf1]/30 text-[#66fcf1] border border-[#66fcf1]/40 text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Auto-Fetch Poster</span>
                          </button>

                          <button
                            onClick={() => handleDeleteBreakdown(index)}
                            className="p-1.5 text-white/30 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Breakdown Shot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Main Edit Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Dual Before / After Image Previews */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Before Image (Raw Plate) */}
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-mono uppercase text-[#9daab4] font-bold">
                              Raw Plate (Before)
                            </label>
                            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-black border border-white/20 relative group/thumb">
                              <img
                                src={breakdown.beforeImage || undefined}
                                alt={`${breakdown.title} Before`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                                <button
                                  type="button"
                                  onClick={() => openMediaModal(`breakdown-before-${index}`, 'image', `Upload Raw Plate (${breakdown.title})`)}
                                  className="w-full py-1.5 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20"
                                >
                                  Browse Files
                                </button>
                              </div>
                            </div>
                            <input
                              type="url"
                              value={breakdown.beforeImage || ''}
                              onChange={(e) => {
                                const updated = [...currentBreakdownsList];
                                updated[index].beforeImage = e.target.value;
                                updateConfig({ vfxBreakdowns: updated });
                              }}
                              placeholder="Raw plate URL..."
                              className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2 py-1 text-[11px] text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                            />
                          </div>

                          {/* After Image (Matte / Clean Plate) */}
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-mono uppercase text-[#66fcf1] font-bold">
                              Matte / Comp (After)
                            </label>
                            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-black border border-[#66fcf1]/40 relative group/thumb">
                              <img
                                src={breakdown.afterImage || undefined}
                                alt={`${breakdown.title} After`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                                <button
                                  type="button"
                                  onClick={() => openMediaModal(`breakdown-after-${index}`, 'image', `Upload Processed Matte (${breakdown.title})`)}
                                  className="w-full py-1.5 rounded-lg bg-[#66fcf1] text-[#05070b] font-bold text-xs"
                                >
                                  Browse Files
                                </button>
                              </div>
                            </div>
                            <input
                              type="url"
                              value={breakdown.afterImage || ''}
                              onChange={(e) => {
                                const updated = [...currentBreakdownsList];
                                updated[index].afterImage = e.target.value;
                                updateConfig({ vfxBreakdowns: updated });
                              }}
                              placeholder="Clean plate URL..."
                              className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2 py-1 text-[11px] text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Metadata Inputs */}
                        <div className="space-y-3">
                          {/* Title & Category */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-mono text-[#9daab4] mb-1">
                                Breakdown Shot Title
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={breakdown.title}
                                  onChange={(e) => {
                                    const updated = [...currentBreakdownsList];
                                    updated[index].title = e.target.value;
                                    updateConfig({ vfxBreakdowns: updated });
                                  }}
                                  placeholder="e.g. Hair Roto Extraction"
                                  className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-[#66fcf1] focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => openPosterFetcher(index, breakdown.title, 'breakdown')}
                                  className="px-2.5 py-2 rounded-xl bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30 hover:bg-[#66fcf1] hover:text-[#05070b] text-[11px] font-mono font-bold flex items-center gap-1 transition-all"
                                  title="Search artwork"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Fetch</span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-mono text-[#9daab4] mb-1">
                                Discipline / Category
                              </label>
                              <select
                                value={breakdown.category}
                                onChange={(e) => {
                                  const updated = [...currentBreakdownsList];
                                  updated[index].category = e.target.value as any;
                                  updateConfig({ vfxBreakdowns: updated });
                                }}
                                className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-[#66fcf1] focus:outline-none"
                              >
                                <option value="Roto">Roto</option>
                                <option value="Digital Paint">Digital Paint</option>
                                <option value="Wire Removal">Wire Removal</option>
                                <option value="Beauty & De-Aging">Beauty & De-Aging</option>
                                <option value="Stereo 3D">Stereo 3D</option>
                                <option value="Full Comp">Full Comp</option>
                              </select>
                            </div>
                          </div>

                          {/* Badge Tag */}
                          <div>
                            <label className="block text-[10px] font-mono text-[#9daab4] mb-1">Badge Tag / Sub-Title</label>
                            <input
                              type="text"
                              value={breakdown.tag}
                              onChange={(e) => {
                                const updated = [...currentBreakdownsList];
                                updated[index].tag = e.target.value;
                                updateConfig({ vfxBreakdowns: updated });
                              }}
                              placeholder="HAIR ALPHA MATTE"
                              className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-[10px] font-mono text-[#9daab4] mb-1">
                              Technical Description & Pipeline Notes
                            </label>
                            <textarea
                              rows={2}
                              value={breakdown.description}
                              onChange={(e) => {
                                const updated = [...currentBreakdownsList];
                                updated[index].description = e.target.value;
                                updateConfig({ vfxBreakdowns: updated });
                              }}
                              className="w-full bg-[#05070b] border border-white/20 rounded-xl p-2.5 text-xs text-white leading-relaxed focus:border-[#66fcf1] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: RPW-CONNECT 3D FEATURES & SCREENSHOT UPLOADER                        */}
            {/* ========================================================================= */}
            {activeTab === 'rpw-connect' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-1 flex items-center gap-2">
                      <span>RPW-Connect 3D Features & UI Images</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#66fcf1]/10 text-[#66fcf1] text-[10px] font-mono font-bold">
                        12 MODULES
                      </span>
                    </h3>
                    <p className="text-xs text-[#9daab4]">
                      Upload your exact software screenshots or paste direct URLs for each feature card. The 3D cards auto-rotate at your chosen speed.
                    </p>
                  </div>

                  <button
                    onClick={handleResetAllFeatureImages}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All 12 Images</span>
                  </button>
                </div>

                {/* 3D Showcase Playback & Auto-Rotation Settings */}
                <div className="bg-[#08111a] border border-[#66fcf1]/30 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#66fcf1]/15 border border-[#66fcf1]/40 flex items-center justify-center text-[#66fcf1]">
                      <Repeat className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        3D Showcase Auto-Rotation Engine
                      </h4>
                      <p className="text-[11px] text-[#9daab4]">
                        Cards automatically rotate through the 12 features in a fraction of time, pausing gracefully on mouse hover or touch.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                    {/* Auto Rotate Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#05070b] border border-white/10">
                      <div>
                        <span className="text-xs font-mono font-bold text-white block">Auto-Rotation Status</span>
                        <span className="text-[10px] text-[#87949c]">Continuous revolving carousel</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const current = config.rpwShowcaseAutoRotate !== false;
                          updateConfig({ rpwShowcaseAutoRotate: !current });
                          notifySaved();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          config.rpwShowcaseAutoRotate !== false
                            ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_15px_rgba(102,252,241,0.3)]'
                            : 'bg-white/10 text-white/50 border border-white/10'
                        }`}
                      >
                        {config.rpwShowcaseAutoRotate !== false ? 'ENABLED' : 'PAUSED'}
                      </button>
                    </div>

                    {/* Rotation Interval Slider */}
                    <div className="p-3 rounded-xl bg-[#05070b] border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-bold">Rotation Speed Interval</span>
                        <span className="text-[#66fcf1] font-bold">
                          {config.rpwShowcaseRotateInterval || 3.5}s per card
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1.5"
                        max="8.0"
                        step="0.5"
                        value={config.rpwShowcaseRotateInterval || 3.5}
                        onChange={(e) => {
                          updateConfig({ rpwShowcaseRotateInterval: parseFloat(e.target.value) });
                        }}
                        onMouseUp={notifySaved}
                        className="w-full accent-[#66fcf1] cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-white/40">
                        <span>Fast (1.5s)</span>
                        <span>Standard (3.5s)</span>
                        <span>Slow (8.0s)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 12 Feature Modules Upload Matrix */}
                <div className="space-y-6">
                  {RPW_FEATURES.map((feature, idx) => {
                    const overrides = config.rpwFeatureOverrides?.[feature.id];
                    const customImage = config.rpwFeatureImages?.[feature.id] || overrides?.imageSrc;
                    const activeTitle = overrides?.title !== undefined ? overrides.title : feature.title;
                    const activeShortDesc = overrides?.shortDesc !== undefined ? overrides.shortDesc : feature.shortDesc;
                    const activeCategory = overrides?.category !== undefined ? overrides.category : feature.category;
                    const activeBadge = overrides?.badgeText !== undefined ? overrides.badgeText : feature.uiMockup.badgeText;
                    const activeImage = customImage || feature.imageSrc;
                    const isCustomized = !!customImage || !!overrides;

                    return (
                      <div
                        key={feature.id}
                        className="bg-[#08111a] border border-white/10 hover:border-white/20 rounded-2xl p-5 sm:p-6 space-y-5 transition-all"
                      >
                        {/* Module Header Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-3">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{
                                backgroundColor: feature.themeColor,
                                boxShadow: `0 0 10px ${feature.themeColor}`,
                              }}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-[#66fcf1]">
                                  {feature.tag}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                                  {activeCategory}
                                </span>
                              </div>
                              <h4 className="text-sm sm:text-base font-heading font-bold text-white">
                                {activeTitle}
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isCustomized ? (
                              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#00df81] bg-[#00df81]/10 border border-[#00df81]/30 px-2.5 py-1 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                Customized
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                                Default Factory Settings
                              </span>
                            )}

                            {isCustomized && (
                              <button
                                type="button"
                                onClick={() => handleResetFeatureOverride(feature.id)}
                                className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
                                title="Reset all changes to factory defaults"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Editable Fields: Title & 1-2 Line Description */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-[#05070b] p-4 rounded-xl border border-white/10">
                          <div className="sm:col-span-8 space-y-1">
                            <label className="block text-[11px] font-mono uppercase text-[#66fcf1] font-bold">
                              Card Title
                            </label>
                            <input
                              type="text"
                              value={activeTitle}
                              onChange={(e) => handleFeatureOverrideChange(feature.id, 'title', e.target.value)}
                              placeholder={feature.title}
                              className="w-full bg-[#08111a] border border-white/20 rounded-lg px-3 py-2 text-xs text-white font-medium focus:border-[#66fcf1] focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-4 space-y-1">
                            <label className="block text-[11px] font-mono uppercase text-[#9daab4] font-bold">
                              Category / Badge
                            </label>
                            <input
                              type="text"
                              value={activeBadge}
                              onChange={(e) => handleFeatureOverrideChange(feature.id, 'badgeText', e.target.value)}
                              placeholder={feature.uiMockup.badgeText}
                              className="w-full bg-[#08111a] border border-white/20 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-12 space-y-1">
                            <label className="block text-[11px] font-mono uppercase text-[#00df81] font-bold">
                              1 to 2 Line Description (Subtitle)
                            </label>
                            <textarea
                              rows={2}
                              value={activeShortDesc}
                              onChange={(e) => handleFeatureOverrideChange(feature.id, 'shortDesc', e.target.value)}
                              placeholder={feature.shortDesc}
                              className="w-full bg-[#08111a] border border-white/20 rounded-lg px-3 py-2 text-xs text-white font-normal leading-relaxed focus:border-[#00df81] focus:outline-none resize-none"
                            />
                          </div>
                        </div>

                        {/* Content Grid: Preview & Upload Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                          
                          {/* Image Preview Box */}
                          <div className="md:col-span-5 space-y-1.5">
                            <label className="block text-[11px] font-mono uppercase text-[#9daab4] font-bold">
                              Screenshot Preview
                            </label>
                            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#020509] border border-white/20 shadow-inner group">
                              <img
                                src={activeImage || undefined}
                                alt={activeTitle}
                                className="w-full h-full object-cover sm:object-contain transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-white/80">
                                <span className="truncate max-w-[150px]">{activeBadge}</span>
                                <span>{isCustomized ? 'CUSTOM' : 'DEFAULT'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Upload Controls & URL Input */}
                          <div className="md:col-span-7 space-y-4">
                            
                            {/* File Upload Selector */}
                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-mono uppercase text-[#66fcf1] font-bold">
                                Upload UI Screenshot from Your Computer
                              </label>
                              <div className="flex items-center gap-3">
                                <label className="flex-1 cursor-pointer">
                                  <div className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-dashed border-white/30 hover:border-[#66fcf1] hover:bg-[#66fcf1]/5 flex items-center justify-center gap-2 text-xs font-mono text-white transition-all">
                                    <Upload className="w-4 h-4 text-[#66fcf1]" />
                                    <span>Choose Image (PNG, JPG, WEBP)...</span>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFeatureImageUpload(feature.id, e)}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                              <p className="text-[10px] text-white/40 font-mono">
                                Directly loads your real software UI screenshot into the 3D rotating showcase.
                              </p>
                            </div>

                            {/* Direct Image URL Input */}
                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-mono uppercase text-[#9daab4] font-bold">
                                Or Paste Direct Image URL / Cloud CDN Link
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={config.rpwFeatureImages?.[feature.id] || ''}
                                  onChange={(e) => handleFeatureImageUrlChange(feature.id, e.target.value)}
                                  placeholder={feature.imageSrc.slice(0, 50) + '...'}
                                  className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                                />
                                {config.rpwFeatureImages?.[feature.id] && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetFeatureImage(feature.id)}
                                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-xs font-mono text-white/60 transition-all"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: BRANDING & TAGLINE                                                  */}
            {/* ========================================================================= */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-1">
                    Branding, Tagline & Typography
                  </h3>
                  <p className="text-xs text-[#9daab4]">
                    Customize the global logo, brand titles, primary taglines, and typography styling.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#08111a] border border-white/10 rounded-2xl p-6">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                      Brand Name Prefix
                    </label>
                    <input
                      type="text"
                      value={config.brandName}
                      onChange={(e) => updateConfig({ brandName: e.target.value })}
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                      Brand Highlight Suffix
                    </label>
                    <input
                      type="text"
                      value={config.brandHighlight}
                      onChange={(e) => updateConfig({ brandHighlight: e.target.value })}
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                      Global Logo URL (Image / PNG / SVG)
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={config.logoUrl}
                        onChange={(e) => updateConfig({ logoUrl: e.target.value })}
                        className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                      />
                      <button
                        onClick={() => openMediaModal('logoUrl', 'image', 'Select Brand Logo')}
                        className="px-4 py-2.5 bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30 hover:bg-[#66fcf1] hover:text-black rounded-xl text-xs font-bold transition-all"
                      >
                        Browse / Upload
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp Direct Connect & Number Update */}
                  <div className="sm:col-span-2 p-4 rounded-2xl bg-[#05070b] border border-[#25D366]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#25D366]">
                        <Share2 className="w-4 h-4" />
                        <span className="text-xs font-poppins font-bold uppercase tracking-wider">
                          WhatsApp Direct Connect & Number
                        </span>
                      </div>
                      <a
                        href={config.whatsappUrl || `https://wa.me/91${config.whatsappNumber || '9372823352'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-[#25D366] hover:underline flex items-center gap-1"
                      >
                        <span>Test WhatsApp Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-[#9daab4] mb-1">
                          WhatsApp Phone Number (e.g. 9372823352)
                        </label>
                        <input
                          type="text"
                          value={config.whatsappNumber || '9372823352'}
                          onChange={(e) => {
                            const newNum = e.target.value;
                            const cleanDigits = newNum.replace(/[^0-9]/g, '');
                            const finalFormattedUrl = cleanDigits.startsWith('91')
                              ? `https://wa.me/${cleanDigits}?text=Hello%20Roto%20Paint%20Wala%20Team%2C%20I%20would%20like%20to%20discuss%20a%20VFX%20project.`
                              : `https://wa.me/91${cleanDigits}?text=Hello%20Roto%20Paint%20Wala%20Team%2C%20I%20would%20like%20to%20discuss%20a%20VFX%20project.`;
                            updateConfig({
                              whatsappNumber: newNum,
                              whatsappUrl: finalFormattedUrl,
                            });
                          }}
                          placeholder="9372823352"
                          className="w-full bg-[#08111a] border border-white/20 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:border-[#25D366] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#9daab4] mb-1">
                          Full WhatsApp Web / Direct URL
                        </label>
                        <input
                          type="text"
                          value={config.whatsappUrl || 'https://wa.me/919372823352?text=Hello%20Roto%20Paint%20Wala%20Team%2C%20I%20would%20like%20to%20discuss%20a%20VFX%20project.'}
                          onChange={(e) => updateConfig({ whatsappUrl: e.target.value })}
                          className="w-full bg-[#08111a] border border-white/20 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:border-[#25D366] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: HERO & BACKGROUND VIDEO REEL                                        */}
            {/* ========================================================================= */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-1">
                      Hero Section & Background Video Player
                    </h3>
                    <p className="text-xs text-[#9daab4]">
                      Configure the hero continuous video, YouTube playlists, headline typography, and action buttons.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        notifySaved();
                      }}
                      disabled={isServerSaving}
                      className="px-5 py-2.5 rounded-xl bg-[#66fcf1] text-[#05070b] text-xs font-bold font-mono tracking-wider uppercase hover:shadow-[0_0_25px_rgba(102,252,241,0.5)] transition-all flex items-center gap-2"
                    >
                      {isServerSaving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{isServerSaving ? 'Publishing Live...' : 'Publish Hero Live'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#08111a] border border-white/10 rounded-2xl p-6 space-y-6">
                  {/* Video Playback Source Mode Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold">
                        Hero Video Showcase Mode
                      </label>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#66fcf1]">
                        Current Live Mode: {config.heroBgSourceType === 'playlist' || config.heroBgSourceType === 'youtube-playlist' ? 'YouTube Playlist Matrix' : 'Single Reel Showcase'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9daab4] mb-3">
                      Select which format to display on the Hero. Both your single reel and your playlist links are preserved independently below so you can paste your links anytime and switch between them with one click.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                      <button
                        type="button"
                        onClick={() => {
                          updateConfig({ heroBgSourceType: 'single-video' });
                          notifySaved();
                        }}
                        className={`p-3.5 rounded-xl text-left border transition-all flex flex-col gap-1 cursor-pointer ${
                          config.heroBgSourceType !== 'playlist' && config.heroBgSourceType !== 'youtube-playlist'
                            ? 'bg-[#66fcf1]/15 border-[#66fcf1] text-white shadow-[0_0_20px_rgba(102,252,241,0.25)] ring-1 ring-[#66fcf1]'
                            : 'bg-[#05070b] border-white/10 text-[#9daab4] hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-xs">
                            <Film className="w-4 h-4 text-[#66fcf1]" />
                            <span>Single Reel Showcase</span>
                          </div>
                          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold transition-all ${
                            config.heroBgSourceType !== 'playlist' && config.heroBgSourceType !== 'youtube-playlist'
                              ? 'bg-[#66fcf1] text-black shadow-[0_0_10px_rgba(102,252,241,0.5)]'
                              : 'bg-white/10 text-[#9daab4]'
                          }`}>
                            {config.heroBgSourceType !== 'playlist' && config.heroBgSourceType !== 'youtube-playlist' ? '✓ ACTIVE' : 'SELECT'}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#9daab4]">
                          Plays a single showreel on continuous loop again and again.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateConfig({ heroBgSourceType: 'playlist' });
                          notifySaved();
                        }}
                        className={`p-3.5 rounded-xl text-left border transition-all flex flex-col gap-1 cursor-pointer ${
                          config.heroBgSourceType === 'playlist' || config.heroBgSourceType === 'youtube-playlist'
                            ? 'bg-[#66fcf1]/15 border-[#66fcf1] text-white shadow-[0_0_20px_rgba(102,252,241,0.25)] ring-1 ring-[#66fcf1]'
                            : 'bg-[#05070b] border-white/10 text-[#9daab4] hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-xs">
                            <ListMusic className="w-4 h-4 text-[#66fcf1]" />
                            <span>YouTube Playlist Matrix</span>
                          </div>
                          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold transition-all ${
                            config.heroBgSourceType === 'playlist' || config.heroBgSourceType === 'youtube-playlist'
                              ? 'bg-[#66fcf1] text-black shadow-[0_0_10px_rgba(102,252,241,0.5)]'
                              : 'bg-white/10 text-[#9daab4]'
                          }`}>
                            {config.heroBgSourceType === 'playlist' || config.heroBgSourceType === 'youtube-playlist' ? '✓ ACTIVE' : 'SELECT'}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#9daab4]">
                          Embeds full playlist with visitor SHUFFLE controls.
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* BOTH LINK CONFIGURATION PANELS ALWAYS VISIBLE & ACCESSIBLE */}
                  <div className="space-y-4">
                    {/* Panel 1: Single Reel Showcase */}
                    <div className={`space-y-3 p-4 rounded-xl transition-all ${
                      config.heroBgSourceType !== 'playlist' && config.heroBgSourceType !== 'youtube-playlist'
                        ? 'bg-[#05070b] border-2 border-[#66fcf1]/50 shadow-[0_0_15px_rgba(102,252,241,0.1)]'
                        : 'bg-[#05070b]/60 border border-white/10'
                    }`}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4 text-[#66fcf1]" />
                          <label className="text-xs font-mono uppercase text-[#66fcf1] font-bold">
                            Single Reel Video Link or ID
                          </label>
                          {config.heroBgSourceType !== 'playlist' && config.heroBgSourceType !== 'youtube-playlist' ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#66fcf1]/20 text-[#66fcf1] font-bold border border-[#66fcf1]/30">
                              CURRENTLY PLAYING ON HERO
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                updateConfig({ heroBgSourceType: 'single-video' });
                                notifySaved();
                              }}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 hover:bg-[#66fcf1]/20 text-[#9daab4] hover:text-[#66fcf1] border border-white/10 transition-colors"
                            >
                              Display This On Hero
                            </button>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[#9daab4]">
                          {isDirectVideoUrl(config.heroBgVideoYouTubeId)
                            ? 'Direct MP4 Stream'
                            : `Video ID: ${extractYouTubeId(config.heroBgVideoYouTubeId) || config.heroBgVideoYouTubeId || 'oimtknXFil4'}`}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={config.heroBgVideoYouTubeId}
                          onChange={(e) => {
                            const val = e.target.value;
                            const plId = extractPlaylistId(val);
                            if (plId && !extractYouTubeId(val)) {
                              updateConfig({ heroBgPlaylistId: plId, heroBgSourceType: 'playlist' });
                            } else if (isDirectVideoUrl(val)) {
                              updateConfig({ heroBgVideoYouTubeId: val.trim(), heroBgVideoMp4Url: val.trim(), heroBgSourceType: 'single-video' });
                            } else {
                              const ytId = extractYouTubeId(val);
                              updateConfig({ heroBgVideoYouTubeId: ytId || val.trim(), heroBgSourceType: 'single-video' });
                            }
                          }}
                          placeholder="Paste single showreel link (e.g. https://www.youtube.com/watch?v=oimtknXFil4 or oimtknXFil4)"
                          className="flex-1 bg-[#08111a] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaModal('heroBgVideoYouTubeId', 'video', 'Change Hero Showreel Video')}
                          className="px-4 py-2.5 bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30 hover:bg-[#66fcf1] hover:text-black rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                        >
                          <Film className="w-3.5 h-3.5" />
                          <span>Browse Reels</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-[#9daab4]">
                        Continuous single-reel loop is active. The hero video controls display the <span className="text-[#66fcf1] font-bold">LOOP</span> button (only available when a single reel is played) to loop this same video indefinitely.
                      </p>
                    </div>

                    {/* Panel 2: YouTube Playlist Matrix */}
                    <div className={`space-y-4 p-4 rounded-xl transition-all ${
                      config.heroBgSourceType === 'playlist' || config.heroBgSourceType === 'youtube-playlist'
                        ? 'bg-[#05070b] border-2 border-[#66fcf1]/50 shadow-[0_0_15px_rgba(102,252,241,0.1)]'
                        : 'bg-[#05070b]/60 border border-white/10'
                    }`}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <ListMusic className="w-4 h-4 text-[#66fcf1]" />
                          <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold">
                            YouTube Playlist Link or Playlist ID
                          </label>
                          {config.heroBgSourceType === 'playlist' || config.heroBgSourceType === 'youtube-playlist' ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#66fcf1]/20 text-[#66fcf1] font-bold border border-[#66fcf1]/30">
                              CURRENTLY PLAYING ON HERO
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                updateConfig({ heroBgSourceType: 'playlist' });
                                notifySaved();
                              }}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 hover:bg-[#66fcf1]/20 text-[#9daab4] hover:text-[#66fcf1] border border-white/10 transition-colors"
                            >
                              Display This On Hero
                            </button>
                          )}
                        </div>
                        {config.heroBgPlaylistId && (
                          <span className="text-[11px] font-mono text-[#00df81]">
                            Playlist ID: {extractPlaylistId(config.heroBgPlaylistId) || config.heroBgPlaylistId}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={config.heroBgPlaylistId}
                          onChange={(e) => {
                            const val = e.target.value;
                            const plId = extractPlaylistId(val) || val.trim();
                            updateConfig({ heroBgPlaylistId: plId, heroBgSourceType: 'playlist' });
                          }}
                          placeholder="Paste your YouTube playlist URL here (e.g. https://www.youtube.com/playlist?list=... or PL...)"
                          className="flex-1 bg-[#08111a] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                        />
                        {config.heroBgSourceType !== 'playlist' && config.heroBgSourceType !== 'youtube-playlist' && (
                          <button
                            type="button"
                            onClick={() => {
                              updateConfig({ heroBgSourceType: 'playlist' });
                              notifySaved();
                            }}
                            className="px-4 py-2.5 bg-[#66fcf1] text-[#05070b] font-bold rounded-xl text-xs hover:bg-[#52e5d9] transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(102,252,241,0.3)]"
                          >
                            <ListMusic className="w-3.5 h-3.5" />
                            <span>Activate Playlist</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-4 pt-1 flex-wrap">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
                          <input
                            type="checkbox"
                            checked={Boolean(config.heroBgPlaylistShuffle)}
                            onChange={(e) => updateConfig({ heroBgPlaylistShuffle: e.target.checked })}
                            className="rounded border-white/30 text-[#66fcf1] focus:ring-[#66fcf1] bg-[#08111a]"
                          />
                          <Shuffle className="w-3.5 h-3.5 text-[#66fcf1]" />
                          <span>Allow Random Playlist Shuffle</span>
                        </label>
                        <span className="text-[11px] text-[#00df81] font-mono flex items-center gap-1">
                          <Repeat className="w-3.5 h-3.5" />
                          <span>Continuous Auto-Next Active</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9daab4]">
                        When in YouTube Playlist Matrix mode, the hero video controls display the <span className="text-[#66fcf1] font-bold">FORWARD</span> button to instantly play the next video in your playlist with zero buffering. The playlist also automatically advances to the next track when each video ends.
                      </p>
                    </div>
                  </div>

                  {/* Fallback Poster Image */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                      Fallback Background Poster Image (Displayed While Video Loads)
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={config.heroBgImageFallback}
                        onChange={(e) => updateConfig({ heroBgImageFallback: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaModal('heroBgImageFallback', 'image', 'Change Hero Poster Image')}
                        className="px-4 py-2.5 bg-white/10 text-white rounded-xl text-xs hover:bg-white/20 font-bold shrink-0"
                      >
                        Pick Image
                      </button>
                    </div>
                    {config.heroBgImageFallback && (
                      <div className="mt-2.5 h-20 w-36 rounded-lg overflow-hidden border border-white/20 bg-black">
                        <img
                          src={config.heroBgImageFallback}
                          alt="Hero Poster Preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Eyebrow */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                      Hero Eyebrow (Category Badge Above Headline)
                    </label>
                    <input
                      type="text"
                      value={config.heroEyebrow}
                      onChange={(e) => updateConfig({ heroEyebrow: e.target.value })}
                      placeholder="e.g. — ROTOSCOPY • PAINT • VFX SUPPORT"
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                    />
                  </div>

                  {/* Headlines */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-mono text-[#9daab4] mb-1 font-bold">
                        Headline Line 1
                      </label>
                      <input
                        type="text"
                        value={config.heroHeadlineLine1}
                        onChange={(e) => updateConfig({ heroHeadlineLine1: e.target.value })}
                        placeholder="MAKE THE"
                        className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:border-[#66fcf1] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#66fcf1] mb-1 font-bold">
                        Gradient Centerpiece (Line 2)
                      </label>
                      <input
                        type="text"
                        value={config.heroHeadlineGradient}
                        onChange={(e) => updateConfig({ heroHeadlineGradient: e.target.value })}
                        placeholder="IMPOSSIBLE"
                        className="w-full bg-[#05070b] border border-[#66fcf1]/40 rounded-xl px-3 py-2.5 text-xs text-[#66fcf1] font-bold focus:border-[#66fcf1] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#9daab4] mb-1 font-bold">
                        Headline Line 3
                      </label>
                      <input
                        type="text"
                        value={config.heroHeadlineLine3}
                        onChange={(e) => updateConfig({ heroHeadlineLine3: e.target.value })}
                        placeholder="INVISIBLE."
                        className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:border-[#66fcf1] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Paragraph Description */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9daab4] mb-1 font-bold">
                      Hero Paragraph Description
                    </label>
                    <textarea
                      rows={3}
                      value={config.heroDescription}
                      onChange={(e) => updateConfig({ heroDescription: e.target.value })}
                      placeholder="Enter the hero narrative description..."
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl p-3 text-xs text-white leading-relaxed focus:border-[#66fcf1] focus:outline-none"
                    />
                  </div>

                  {/* Call-to-Action Buttons */}
                  <div className="space-y-4 pt-2 border-t border-white/10">
                    <h4 className="text-xs font-mono uppercase text-[#66fcf1] font-bold">
                      Call-to-Action Buttons & Portal URL
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-[#9daab4] mb-1">
                          Primary CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={config.heroCtaPrimaryText}
                          onChange={(e) => updateConfig({ heroCtaPrimaryText: e.target.value })}
                          placeholder="EXPLORE THE WORK"
                          className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-[#9daab4] mb-1">
                          Secondary CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={config.heroCtaSecondaryText}
                          onChange={(e) => updateConfig({ heroCtaSecondaryText: e.target.value })}
                          placeholder="ENTER RPW CONNECT"
                          className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-[#9daab4] mb-1">
                          Tertiary CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={config.heroCtaTertiaryText}
                          onChange={(e) => updateConfig({ heroCtaTertiaryText: e.target.value })}
                          placeholder="Need Quick Turnaround?"
                          className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#9daab4] mb-1">
                        RPW Connect Portal URL (Secondary Button Destination)
                      </label>
                      <input
                        type="text"
                        value={config.connectPortalUrl}
                        onChange={(e) => updateConfig({ connectPortalUrl: e.target.value })}
                        placeholder="https://rotopaintwala.blackfx.net"
                        className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Live Mini Preview Box */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#05070b] to-[#0a1824] border border-[#66fcf1]/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-[#66fcf1] uppercase tracking-wider font-bold">
                        Live Typography & Layout Preview
                      </span>
                      <span className="text-[10px] font-mono text-[#00df81]">
                        Auto-updates as you type
                      </span>
                    </div>
                    <div className="text-left space-y-2 py-2">
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#66fcf1]">
                        {config.heroEyebrow || '— ROTOSCOPY • PAINT • VFX SUPPORT'}
                      </div>
                      <div className="text-xl sm:text-2xl font-black font-heading leading-tight text-white">
                        <span>{config.heroHeadlineLine1 || 'MAKE THE'} </span>
                        <span className="text-[#66fcf1]">{config.heroHeadlineGradient || 'IMPOSSIBLE'} </span>
                        <span>{config.heroHeadlineLine3 || 'INVISIBLE.'}</span>
                      </div>
                      <p className="text-xs text-[#b6c1c8] line-clamp-2 max-w-xl">
                        {config.heroDescription}
                      </p>
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-[#66fcf1] text-[#05070b] text-[10px] font-bold uppercase">
                          {config.heroCtaPrimaryText || 'EXPLORE THE WORK'}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase border border-white/20">
                          {config.heroCtaSecondaryText || 'ENTER RPW CONNECT'}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-black/40 text-[#9daab4] text-[10px] font-medium border border-white/10">
                          ⚡ {config.heroCtaTertiaryText || 'Need Quick Turnaround?'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Save & Reset Actions Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        updateConfig({
                          heroBgVideoYouTubeId: 'P5vvOZRO9JU',
                          heroBgSourceType: 'single-video',
                          heroBgPlaylistId: '',
                          heroBgPlaylistShuffle: true,
                          heroBgImageFallback: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1920&q=80',
                          heroHeadlineLine1: 'MAKE THE',
                          heroHeadlineGradient: 'IMPOSSIBLE',
                          heroHeadlineLine3: 'INVISIBLE.',
                          heroDescription: 'ROTO PAINT WALA is a production-focused roto and paint network built to give filmmakers, agencies and VFX studios the bandwidth to move faster — without losing control over quality.',
                          heroEyebrow: '— ROTOSCOPY • PAINT • VFX SUPPORT',
                          heroCtaPrimaryText: 'EXPLORE THE WORK',
                          heroCtaSecondaryText: 'ENTER RPW CONNECT',
                          heroCtaTertiaryText: 'Need Quick Turnaround?',
                          connectPortalUrl: 'https://rotopaintwala.blackfx.net',
                        });
                        notifySaved();
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-mono font-bold transition-colors"
                    >
                      Reset Hero to Defaults
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        notifySaved();
                      }}
                      disabled={isServerSaving}
                      className="px-6 py-2.5 rounded-xl bg-[#66fcf1] text-[#05070b] text-xs font-bold font-mono tracking-wider uppercase hover:shadow-[0_0_25px_rgba(102,252,241,0.5)] transition-all flex items-center gap-2"
                    >
                      {isServerSaving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{isServerSaving ? 'Saving to Server...' : 'Save & Publish Hero Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: SOCIAL CHANNELS & LOGOS                                             */}
            {/* ========================================================================= */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-1">
                      Social Media Channels & Circular Logos
                    </h3>
                    <p className="text-xs text-[#9daab4]">
                      Configure circular brand icons for Facebook, X, Instagram, YouTube, LinkedIn, Reddit, Discord, and Google.
                    </p>
                  </div>
                  <button
                    onClick={handleAddSocialLink}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#66fcf1] text-[#05070b] text-xs font-extrabold hover:shadow-[0_0_20px_rgba(102,252,241,0.3)] transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Channel</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(config.socialLinks || []).map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-4 rounded-2xl bg-[#08111a] border border-white/15"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <select
                            value={item.platform}
                            onChange={(e) =>
                              handleUpdateSocial(index, {
                                platform: e.target.value as any,
                                label: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
                              })
                            }
                            className="bg-[#05070b] border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold text-white uppercase font-mono"
                          >
                            <option value="facebook">Facebook</option>
                            <option value="x">X (Twitter)</option>
                            <option value="instagram">Instagram</option>
                            <option value="youtube">YouTube</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="reddit">Reddit</option>
                            <option value="discord">Discord</option>
                            <option value="google">Google</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="custom">Custom URL</option>
                          </select>

                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => handleUpdateSocial(index, { label: e.target.value })}
                            className="bg-[#05070b] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white max-w-[140px]"
                          />
                        </div>

                        <button
                          onClick={() => handleDeleteSocial(index)}
                          className="p-2 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => handleUpdateSocial(index, { url: e.target.value })}
                        className="w-full bg-[#05070b] border border-white/20 rounded-xl px-4 py-2 text-xs font-mono text-white focus:border-[#66fcf1] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: PARTNER COLLECTIVE (DYNAMIC STUDIO CIRCLES)                          */}
            {/* ========================================================================= */}
            {activeTab === 'partners' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-1 flex items-center gap-2">
                      <span>Partner Collective Network</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#66fcf1]/10 text-[#66fcf1] text-[10px] font-mono font-bold">
                        {config.partners.length} STUDIOS CONNECTED
                      </span>
                    </h3>
                    <p className="text-xs text-[#9daab4]">
                      Add unlimited partner studios. The connected network infographic dynamically renders circles for every studio added.
                    </p>
                  </div>
                  <button
                    onClick={handleAddPartner}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#66fcf1] text-[#05070b] text-xs font-extrabold hover:shadow-[0_0_20px_rgba(102,252,241,0.3)] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Studio Circle</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {config.partners.map((partner, index) => (
                    <div
                      key={partner.id || index}
                      className="bg-[#08111a] border border-white/10 rounded-xl p-4 flex flex-col justify-between gap-3 relative group hover:border-[#66fcf1]/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-lg bg-black border border-white/10 p-1.5 flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
                          <img src={partner.logo || undefined} alt={partner.studioName} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <input
                            type="text"
                            value={partner.studioName}
                            onChange={(e) => {
                              const updated = [...config.partners];
                              updated[index].studioName = e.target.value;
                              updateConfig({ partners: updated });
                            }}
                            placeholder="Studio Name"
                            className="w-full bg-[#05070b] border border-white/10 focus:border-[#66fcf1] rounded px-2 py-1 text-xs font-bold text-white focus:outline-none truncate"
                          />
                          <input
                            type="text"
                            value={partner.speciality || ''}
                            onChange={(e) => {
                              const updated = [...config.partners];
                              updated[index].speciality = e.target.value;
                              updateConfig({ partners: updated });
                            }}
                            placeholder="Speciality (e.g. Feature Film Roto)"
                            className="w-full bg-[#05070b] border border-white/10 focus:border-[#66fcf1] rounded px-2 py-1 text-[11px] text-[#9daab4] focus:outline-none truncate"
                          />
                        </div>
                        <button
                          onClick={() => handleDeletePartner(index)}
                          className="p-1.5 text-white/30 hover:text-rose-400 transition-colors"
                          title="Delete Partner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Studio Email Input Field (Private / Hidden from Visitor UI) */}
                      <div className="pt-2 border-t border-white/10 space-y-1">
                        <label className="block text-[10px] font-mono text-[#66fcf1] uppercase font-bold flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-[#66fcf1]" />
                          <span>Studio Email (Private / Hidden from Public UI)</span>
                        </label>
                        <input
                          type="email"
                          value={partner.email || ''}
                          onChange={(e) => {
                            const updated = [...config.partners];
                            updated[index].email = e.target.value;
                            updateConfig({ partners: updated });
                          }}
                          placeholder="e.g. contact@studio.com"
                          className="w-full bg-[#05070b] border border-white/15 focus:border-[#66fcf1] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none placeholder:text-white/20"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 text-[11px]">
                        <button
                          onClick={() => openMediaModal(`partner-logo-${index}`, 'image', `Change ${partner.studioName} Logo`)}
                          className="text-[10px] font-mono text-[#66fcf1] hover:underline"
                        >
                          Change Logo URL
                        </button>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={partner.artistCount || 20}
                            onChange={(e) => {
                              const updated = [...config.partners];
                              updated[index].artistCount = parseInt(e.target.value, 10) || 0;
                              updateConfig({ partners: updated });
                            }}
                            className="w-16 bg-[#05070b] border border-white/10 rounded px-1.5 py-0.5 text-center text-white"
                          />
                          <span className="text-[10px] text-[#9daab4]">Artists</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: WORK SHOWCASE & WIPES                                               */}
            {/* ========================================================================= */}
            {activeTab === 'work' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-1">
                    Work Showcase & Interactive Wipe Sliders
                  </h3>
                  <p className="text-xs text-[#9daab4]">
                    Set raw film plates, processed alpha matte images, resolution specs, and titles for comparison.
                  </p>
                </div>

                <div className="space-y-6">
                  {config.shots.map((shot, index) => (
                    <div
                      key={shot.id}
                      className="bg-[#08111a] border border-white/10 rounded-2xl p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/30 text-[10px] font-mono text-[#66fcf1] font-bold">
                          SHOT #{index + 1} ({shot.category})
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-[#9daab4] mb-1">Shot Title</label>
                          <input
                            type="text"
                            value={shot.title}
                            onChange={(e) => {
                              const updated = [...config.shots];
                              updated[index].title = e.target.value;
                              updateConfig({ shots: updated });
                            }}
                            className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#9daab4] mb-1">Resolution & Codec</label>
                          <input
                            type="text"
                            value={shot.resolution}
                            onChange={(e) => {
                              const updated = [...config.shots];
                              updated[index].resolution = e.target.value;
                              updateConfig({ shots: updated });
                            }}
                            className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#66fcf1] font-bold mb-1">
                            Raw Ingest Plate Image URL
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={shot.originalImage}
                              onChange={(e) => {
                                const updated = [...config.shots];
                                updated[index].originalImage = e.target.value;
                                updateConfig({ shots: updated });
                              }}
                              className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono"
                            />
                            <button
                              onClick={() => openMediaModal(`shot-raw-${index}`, 'image', `Change Raw Plate (${shot.title})`)}
                              className="px-3 py-2 bg-white/10 text-white rounded-xl text-xs hover:bg-white/20"
                            >
                              Pick
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-[#66fcf1] font-bold mb-1">
                            Alpha Matte Processed Image URL
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={shot.processedImage}
                              onChange={(e) => {
                                const updated = [...config.shots];
                                updated[index].processedImage = e.target.value;
                                updateConfig({ shots: updated });
                              }}
                              className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono"
                            />
                            <button
                              onClick={() => openMediaModal(`shot-proc-${index}`, 'image', `Change Processed Matte (${shot.title})`)}
                              className="px-3 py-2 bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30 rounded-xl text-xs hover:bg-[#66fcf1] hover:text-black font-bold"
                            >
                              Pick
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: SERVICES & PIPELINE                                                 */}
            {/* ========================================================================= */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-1">
                    Services & Pipeline Suite
                  </h3>
                  <p className="text-xs text-[#9daab4]">
                    Edit service titles, deliverable formats (.EXR, .nk, Alembic), and tool stacks.
                  </p>
                </div>

                <div className="space-y-4">
                  {config.services.map((service, index) => (
                    <div
                      key={service.number}
                      className="bg-[#08111a] border border-white/10 rounded-2xl p-5 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#66fcf1]">
                          {service.number}
                        </span>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => {
                            const updated = [...config.services];
                            updated[index].title = e.target.value;
                            updateConfig({ services: updated });
                          }}
                          className="flex-1 bg-[#05070b] border border-white/20 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:border-[#66fcf1] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#9daab4] mb-1">Description</label>
                        <input
                          type="text"
                          value={service.description}
                          onChange={(e) => {
                            const updated = [...config.services];
                            updated[index].description = e.target.value;
                            updateConfig({ services: updated });
                          }}
                          className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-[#9daab4]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: ABOUT US PAGE (PAGE-WISE CMS)                                       */}
            {/* ========================================================================= */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <span>About Us Page CMS</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#66fcf1]/10 text-[#66fcf1] text-[10px] font-mono font-bold">
                      ABOUT US
                    </span>
                  </h3>
                  <p className="text-xs text-[#9daab4]">
                    Edit the About Us page mission statement, primary headline, security guarantees, and support links.
                  </p>
                </div>

                <div className="bg-[#08111a] border border-white/10 rounded-2xl p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-1">
                      Support & Business Contact Email
                    </label>
                    <input
                      type="email"
                      value={config.supportEmail}
                      onChange={(e) => updateConfig({ supportEmail: e.target.value })}
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-1">
                      RPW Connect Dispatch Portal Link
                    </label>
                    <input
                      type="url"
                      value={config.connectPortalUrl}
                      onChange={(e) => updateConfig({ connectPortalUrl: e.target.value })}
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9daab4] mb-1">
                      Mission Statement / Network Description
                    </label>
                    <textarea
                      rows={4}
                      value={config.partnerDescription}
                      onChange={(e) => updateConfig({ partnerDescription: e.target.value })}
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl p-3 text-xs text-white leading-relaxed focus:border-[#66fcf1] focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold">
                      Key Network Stats / Metrics
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {config.stats.map((st, index) => (
                        <div key={index} className="bg-[#05070b] border border-white/10 rounded-xl p-3">
                          <label className="block text-[10px] font-mono text-[#9daab4] mb-1">{st.label}</label>
                          <input
                            type="text"
                            value={st.value}
                            onChange={(e) => {
                              const updated = [...config.stats];
                              updated[index].value = e.target.value;
                              updateConfig({ stats: updated });
                            }}
                            className="w-full bg-[#08111a] border border-white/20 rounded-lg px-2.5 py-1.5 text-base font-bold text-[#66fcf1] font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: FAQS                                                                */}
            {/* ========================================================================= */}
            {activeTab === 'faqs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-1">
                      Frequently Asked Questions
                    </h3>
                    <p className="text-xs text-[#9daab4]">
                      Edit client questions and answers regarding turnaround, NDAs, and capacity.
                    </p>
                  </div>
                  <button
                    onClick={handleAddFaq}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#66fcf1] text-[#05070b] text-xs font-extrabold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {config.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-[#08111a] border border-white/10 rounded-2xl p-5 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...config.faqs];
                            updated[index].question = e.target.value;
                            updateConfig({ faqs: updated });
                          }}
                          className="flex-1 bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs font-bold text-white focus:border-[#66fcf1] focus:outline-none"
                        />
                        <button
                          onClick={() => handleDeleteFaq(index)}
                          className="p-2 text-white/30 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...config.faqs];
                          updated[index].answer = e.target.value;
                          updateConfig({ faqs: updated });
                        }}
                        className="w-full bg-[#05070b] border border-white/20 rounded-lg p-3 text-xs text-[#9daab4] leading-relaxed focus:border-[#66fcf1] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB: JSON BACKUP & EXPORT                                                */}
            {/* ========================================================================= */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-1">
                    JSON Data Backup & Synchronization
                  </h3>
                  <p className="text-xs text-[#9daab4]">
                    Export or import the full site configuration JSON to backup or deploy across environments.
                  </p>
                </div>

                <div className="bg-[#08111a] border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={exportConfigJson}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#66fcf1] text-[#05070b] text-xs font-extrabold hover:shadow-[0_0_20px_rgba(102,252,241,0.3)] transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download JSON Backup</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9daab4] mb-2">
                      Raw Configuration JSON State
                    </label>
                    <textarea
                      readOnly
                      value={JSON.stringify(config, null, 2)}
                      rows={12}
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl p-4 font-mono text-[11px] text-[#66fcf1] focus:outline-none selection:bg-white selection:text-black"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <MediaUploaderModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        title={mediaTitle}
        currentValue=""
        mediaType={mediaType}
        onSelect={handleMediaApplied}
      />

      <MoviePosterFetcherModal
        isOpen={posterModalOpen}
        onClose={() => setPosterModalOpen(false)}
        initialQuery={posterInitialQuery}
        onSelectPoster={handlePosterSelected}
      />
    </div>
  );
};
