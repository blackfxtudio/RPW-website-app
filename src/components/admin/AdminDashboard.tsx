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
  Search
} from 'lucide-react';
import { MediaUploaderModal } from './MediaUploaderModal';
import { SocialIconsGroup } from '../SocialIconsGroup';
import { PartnerStudio, WorkShot, ServiceItem, FAQItem, SocialLinkItem } from '../../types';

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
    resetToDefaults,
    exportConfigJson,
    importConfigJson,
  } = useSiteConfig();

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTargetKey, setMediaTargetKey] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaTitle, setMediaTitle] = useState<string>('Select Media');

  if (!isEditorOpen || editorMode !== 'dashboard') return null;

  const openMediaModal = (targetKey: string, type: 'image' | 'video', title: string) => {
    setMediaTargetKey(targetKey);
    setMediaType(type);
    setMediaTitle(title);
    setMediaModalOpen(true);
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
    } else {
      updateConfig({ [mediaTargetKey]: url } as any);
    }
    notifySaved();
  };

  // Helper for partner list
  const handleAddPartner = () => {
    const newPartner: PartnerStudio = {
      studioName: 'New Partner Studio',
      email: 'tom@blackfx.net',
      website: 'https://rotopaintwala.com',
      logo: 'https://static.wixstatic.com/media/7ffb5e_bebd8db90704414a9140cfbf0e8fe1e1~mv2.png/v1/fill/w_180,h_180,al_c,q_85,enc_avif,quality_auto/RPW.png',
      region: 'Global Hub',
      speciality: 'Rotoscopy & Digital Paint Work',
      artistCount: 30,
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

  // Helper for FAQ
  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      question: 'New Question regarding production workflow',
      answer: 'Detailed explanation regarding our turnaround times, QC standards, and secure pipeline hand-off.',
      category: 'General',
    };
    updateConfig({ faqs: [...config.faqs, newFaq] });
    notifySaved();
  };

  const handleDeleteFaq = (index: number) => {
    const updated = config.faqs.filter((_, idx) => idx !== index);
    updateConfig({ faqs: updated });
    notifySaved();
  };

  // Helper for Social Channels
  const handleUpdateSocial = (index: number, updates: Partial<SocialLinkItem>) => {
    const currentList = config.socialLinks || [];
    const updated = [...currentList];
    if (updated[index]) {
      updated[index] = { ...updated[index], ...updates };
      updateConfig({ socialLinks: updated });
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

  const handleFormatPlatformUrl = (index: number, handleOrUrl: string, platform: string) => {
    const clean = handleOrUrl.trim().replace(/^@/, '');
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      handleUpdateSocial(index, { url: clean });
      return;
    }

    let formattedUrl = clean;
    switch (platform) {
      case 'facebook':
        formattedUrl = `https://www.facebook.com/${clean}`;
        break;
      case 'x':
        formattedUrl = `https://x.com/${clean}`;
        break;
      case 'instagram':
        formattedUrl = `https://www.instagram.com/${clean}`;
        break;
      case 'youtube':
        formattedUrl = clean.startsWith('@') ? `https://www.youtube.com/${clean}` : `https://www.youtube.com/@${clean}`;
        break;
      case 'linkedin':
        formattedUrl = `https://www.linkedin.com/company/${clean}`;
        break;
      case 'reddit':
        formattedUrl = clean.startsWith('r/') ? `https://www.reddit.com/${clean}` : `https://www.reddit.com/r/${clean}`;
        break;
      case 'discord':
        formattedUrl = clean.startsWith('gg/') ? `https://discord.${clean}` : `https://discord.gg/${clean}`;
        break;
      case 'google':
        formattedUrl = `https://www.google.com/search?q=${encodeURIComponent(clean || 'Roto Paint Wala')}`;
        break;
      default:
        formattedUrl = clean.startsWith('http') ? clean : `https://${clean}`;
        break;
    }
    handleUpdateSocial(index, { url: formattedUrl });
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#05070b]/98 backdrop-blur-2xl text-white flex flex-col animate-in fade-in duration-300">
      {/* Dashboard Top Header */}
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#08111a]/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#66fcf1] text-[#05070b] flex items-center justify-center font-bold font-mono">
            CMS
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <span>ROTO PAINT WALA</span>
              <span className="text-[#66fcf1] font-mono text-xs font-normal">/ Backend Studio Control</span>
            </h2>
            <p className="text-[11px] text-[#9daab4]">
              Visual Content Management, Live Background Video & Media Orchestration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditorMode('in-place')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#66fcf1] bg-[#66fcf1]/10 border border-[#66fcf1]/30 hover:bg-[#66fcf1] hover:text-[#05070b] transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Switch to In-Place Live Preview</span>
          </button>

          <button
            onClick={notifySaved}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold text-[#05070b] bg-[#66fcf1] shadow-[0_0_20px_rgba(102,252,241,0.3)] transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All</span>
          </button>

          <button
            onClick={() => setIsEditorOpen(false)}
            className="p-2 rounded-full text-[#9daab4] hover:text-white hover:bg-white/10 transition-colors"
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Split Layout: Sidebar Navigation + Tab Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Tabs */}
        <aside className="w-64 border-r border-white/10 p-4 flex flex-col gap-1 bg-[#060c13]/50 overflow-y-auto">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 px-3 py-2">
            CMS SECTIONS
          </span>

          {[
            { id: 'branding', label: 'Branding & Tagline', icon: Palette },
            { id: 'hero', label: 'Hero & Video Reel', icon: Film },
            { id: 'social', label: 'Social Channels & Logos', icon: Share2 },
            { id: 'partners', label: 'Partner Collective', icon: Network },
            { id: 'work', label: 'Work Shots & Wipes', icon: Sliders },
            { id: 'services', label: 'Services & Pipeline', icon: Wrench },
            { id: 'telemetry', label: 'Live Telemetry & Stats', icon: Activity },
            { id: 'faqs', label: 'FAQs & Content', icon: HelpCircle },
            { id: 'backup', label: 'JSON Export & Backup', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  isActive
                    ? 'bg-[#66fcf1]/15 text-[#66fcf1] border border-[#66fcf1]/40 font-bold'
                    : 'text-[#9daab4] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="mt-auto pt-4 border-t border-white/10">
            <button
              onClick={resetToDefaults}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All to Defaults</span>
            </button>
          </div>
        </aside>

        {/* Right Content Panel */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto bg-[#05070b]">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* ========================================================================= */}
            {/* TAB 1: BRANDING & TAGLINE                                                */}
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
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-[#66fcf1] font-bold focus:border-[#66fcf1] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                      Primary Tagline (Requested: "Maximum bandwidth At One Place")
                    </label>
                    <input
                      type="text"
                      value={config.primaryTagline}
                      onChange={(e) => updateConfig({ primaryTagline: e.target.value, partnerTagline: e.target.value })}
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:border-[#66fcf1] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                      Tagline Cyan Highlight
                    </label>
                    <input
                      type="text"
                      value={config.primaryTaglineHighlight}
                      onChange={(e) => updateConfig({ primaryTaglineHighlight: e.target.value, partnerTaglineHighlight: e.target.value })}
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-sm text-[#66fcf1] font-bold focus:border-[#66fcf1] focus:outline-none"
                    />
                  </div>

                  {/* Header Logo */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                      Header Brand Logo URL
                    </label>
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-xl bg-black border border-white/20 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={config.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                      </div>
                      <input
                        type="text"
                        value={config.logoUrl}
                        onChange={(e) => updateConfig({ logoUrl: e.target.value })}
                        className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                      />
                      <button
                        onClick={() => openMediaModal('logoUrl', 'image', 'Change Brand Logo')}
                        className="px-4 py-2.5 bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30 hover:bg-[#66fcf1] hover:text-black rounded-xl text-xs font-bold transition-all"
                      >
                        Upload / Browse
                      </button>
                    </div>
                  </div>

                  {/* Typography Font Selector */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                      Primary Heading Font
                    </label>
                    <select
                      value={config.primaryFont}
                      onChange={(e) => updateConfig({ primaryFont: e.target.value as any })}
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                    >
                      <option value="Poppins">Poppins (Bold, Modern Sans)</option>
                      <option value="Space Grotesk">Space Grotesk (Tech/VFX Grotesk)</option>
                      <option value="Inter">Inter (Clean Neutral)</option>
                    </select>
                  </div>

                  {/* Theme Accent Color */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                      Brand Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={config.accentColor}
                        onChange={(e) => updateConfig({ accentColor: e.target.value })}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.accentColor}
                        onChange={(e) => updateConfig({ accentColor: e.target.value })}
                        className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: HERO & VIDEO REEL                                                 */}
            {/* ========================================================================= */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-1">
                    Hero Section & Background Showreel
                  </h3>
                  <p className="text-xs text-[#9daab4]">
                    Configure continuous background video reel, full YouTube playlist playback with shuffle and loop modes, big typography, and action buttons.
                  </p>
                </div>

                <div className="space-y-6 bg-[#08111a] border border-white/10 rounded-2xl p-6">
                  {/* Playback Source Mode Selector */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                      Video Playback Mode
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => updateConfig({ heroBgSourceType: 'single-video' })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          config.heroBgSourceType !== 'playlist'
                            ? 'bg-[#66fcf1]/10 border-[#66fcf1] ring-1 ring-[#66fcf1]'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-[#9daab4]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <PlaySquare className={`w-4 h-4 ${config.heroBgSourceType !== 'playlist' ? 'text-[#66fcf1]' : 'text-white/60'}`} />
                          <span className={`text-xs font-bold ${config.heroBgSourceType !== 'playlist' ? 'text-white' : 'text-white/80'}`}>
                            Single Video Showreel
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9daab4]">
                          Plays a single curated showreel on seamless infinite loop.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateConfig({ heroBgSourceType: 'playlist' })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          config.heroBgSourceType === 'playlist'
                            ? 'bg-[#66fcf1]/10 border-[#66fcf1] ring-1 ring-[#66fcf1]'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-[#9daab4]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <ListMusic className={`w-4 h-4 ${config.heroBgSourceType === 'playlist' ? 'text-[#66fcf1]' : 'text-white/60'}`} />
                          <span className={`text-xs font-bold ${config.heroBgSourceType === 'playlist' ? 'text-white' : 'text-white/80'}`}>
                            Complete YouTube Playlist
                          </span>
                          <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#66fcf1]/20 text-[#66fcf1] font-bold">
                            SHUFFLE & LOOP
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9daab4]">
                          Streams an entire YouTube playlist in shuffle & continuous loop mode.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Mode Specific Inputs */}
                  {config.heroBgSourceType === 'playlist' ? (
                    <div className="space-y-4 p-4 rounded-xl bg-[#05070b]/60 border border-[#66fcf1]/30">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold">
                            YouTube Playlist ID or Full URL
                          </label>
                          <span className="text-[10px] font-mono text-[#9daab4]">
                            Format: PL... or full https://youtube.com/playlist?list=...
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={config.heroBgPlaylistId}
                            onChange={(e) => {
                              const val = e.target.value;
                              const match = val.match(/[?&]list=([^#&?]+)/);
                              updateConfig({ heroBgPlaylistId: match ? match[1] : val.trim() });
                            }}
                            placeholder="e.g. PLrAl6sJc9k_VwW1v4HjD4Lw_zR-wzD5bN"
                            className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Playlist Curated Presets */}
                      <div>
                        <label className="block text-[11px] font-mono text-[#9daab4] mb-2">
                          Quick VFX Playlist Presets:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            { name: 'RPW & VFX Showreels', id: 'PLrAl6sJc9k_VwW1v4HjD4Lw_zR-wzD5bN' },
                            { name: 'Cinematic Comp Reels', id: 'PLVbYVwz9g736K-p6g8l-4H8_J3YmK_u4k' },
                            { name: 'Roto & Clean Plates', id: 'PLpdmVpG-Bex_0iZl_8r_qDk_6p6Y7Jg9r' }
                          ].map((pl) => (
                            <button
                              key={pl.id}
                              type="button"
                              onClick={() => updateConfig({ heroBgPlaylistId: pl.id })}
                              className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                                config.heroBgPlaylistId === pl.id
                                  ? 'bg-[#66fcf1]/15 border-[#66fcf1] text-[#66fcf1]'
                                  : 'bg-white/5 border-white/10 text-[#9daab4] hover:text-white'
                              }`}
                            >
                              <span className="truncate font-medium">{pl.name}</span>
                              {config.heroBgPlaylistId === pl.id && <Check className="w-3 h-3 text-[#66fcf1] shrink-0" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Shuffle & Loop Toggles */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                        <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10 cursor-pointer hover:border-white/20">
                          <input
                            type="checkbox"
                            checked={config.heroBgPlaylistShuffle !== false}
                            onChange={(e) => updateConfig({ heroBgPlaylistShuffle: e.target.checked })}
                            className="w-4 h-4 rounded text-[#66fcf1] focus:ring-0 bg-transparent border-white/30"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                              <Shuffle className="w-3.5 h-3.5 text-[#66fcf1]" />
                              <span>Shuffle Playlist Sequence</span>
                            </div>
                            <p className="text-[10px] text-[#9daab4]">
                              Randomizes the playback order for fresh showreel clips on every visit.
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10 cursor-pointer hover:border-white/20">
                          <input
                            type="checkbox"
                            checked={config.heroBgLoop !== false}
                            onChange={(e) => updateConfig({ heroBgLoop: e.target.checked })}
                            className="w-4 h-4 rounded text-[#66fcf1] focus:ring-0 bg-transparent border-white/30"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                              <Repeat className="w-3.5 h-3.5 text-[#66fcf1]" />
                              <span>Continuous Playlist Loop</span>
                            </div>
                            <p className="text-[10px] text-[#9daab4]">
                              Automatically loops indefinitely when the playlist completes.
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  ) : (
                    /* Single Video URL / YouTube ID */
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                        Hero Background Video (YouTube ID or Embed)
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={config.heroBgVideoYouTubeId}
                          onChange={(e) => updateConfig({ heroBgVideoYouTubeId: e.target.value })}
                          placeholder="e.g. P5vvOZRO9JU"
                          className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                        />
                        <button
                          onClick={() => openMediaModal('heroBgVideoYouTubeId', 'video', 'Change Hero Showreel Video')}
                          className="px-4 py-2.5 bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30 hover:bg-[#66fcf1] hover:text-black rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <Film className="w-3.5 h-3.5" />
                          <span>Browse Reels</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-[#9daab4]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1]" />
                        <span>Continuous Infinite Loop is always active (restarts seamlessly without interruption).</span>
                      </div>
                    </div>
                  )}

                  {/* Fallback Image */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#66fcf1] font-bold mb-2">
                      Fallback Background Poster Image
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={config.heroBgImageFallback}
                        onChange={(e) => updateConfig({ heroBgImageFallback: e.target.value })}
                        className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#66fcf1] focus:outline-none"
                      />
                      <button
                        onClick={() => openMediaModal('heroBgImageFallback', 'image', 'Change Hero Poster Image')}
                        className="px-4 py-2.5 bg-white/10 text-white rounded-xl text-xs hover:bg-white/20"
                      >
                        Pick
                      </button>
                    </div>
                  </div>

                  {/* Typography & Copy */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-mono text-[#9daab4] mb-1">Headline Line 1</label>
                      <input
                        type="text"
                        value={config.heroHeadlineLine1}
                        onChange={(e) => updateConfig({ heroHeadlineLine1: e.target.value })}
                        className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#66fcf1] mb-1">Gradient Centerpiece</label>
                      <input
                        type="text"
                        value={config.heroHeadlineGradient}
                        onChange={(e) => updateConfig({ heroHeadlineGradient: e.target.value })}
                        className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-[#66fcf1] font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#9daab4] mb-1">Headline Line 3</label>
                      <input
                        type="text"
                        value={config.heroHeadlineLine3}
                        onChange={(e) => updateConfig({ heroHeadlineLine3: e.target.value })}
                        className="w-full bg-[#05070b] border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9daab4] mb-1">
                      Hero Paragraph Description
                    </label>
                    <textarea
                      rows={3}
                      value={config.heroDescription}
                      onChange={(e) => updateConfig({ heroDescription: e.target.value })}
                      className="w-full bg-[#05070b] border border-white/20 rounded-xl p-3 text-xs text-white leading-relaxed focus:border-[#66fcf1] focus:outline-none"
                    />
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

                {/* Live Preview Box */}
                <div className="p-6 rounded-2xl bg-[#08111a] border border-[#66fcf1]/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#66fcf1] uppercase tracking-wider">
                      Live Circular Brand Badges Preview
                    </span>
                    <span className="text-[10px] text-[#9daab4] font-mono">
                      (Reflects in website footer & connect modules)
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between flex-wrap gap-4">
                    <SocialIconsGroup size="lg" />
                  </div>
                </div>

                {/* Social Channel Items List */}
                <div className="space-y-3">
                  {(config.socialLinks || []).map((item, index) => (
                    <div
                      key={item.id || index}
                      className={`p-4 rounded-2xl border transition-all ${
                        item.enabled !== false
                          ? 'bg-[#08111a] border-white/15'
                          : 'bg-[#08111a]/40 border-white/5 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.enabled !== false}
                              onChange={(e) => handleUpdateSocial(index, { enabled: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#66fcf1]"></div>
                          </label>

                          <select
                            value={item.platform}
                            onChange={(e) =>
                              handleUpdateSocial(index, {
                                platform: e.target.value as any,
                                label: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
                              })
                            }
                            className="bg-[#05070b] border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold text-white uppercase font-mono focus:border-[#66fcf1] focus:outline-none"
                          >
                            <option value="facebook">Facebook</option>
                            <option value="x">X (Twitter)</option>
                            <option value="instagram">Instagram</option>
                            <option value="youtube">YouTube</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="reddit">Reddit</option>
                            <option value="discord">Discord</option>
                            <option value="google">Google / Business</option>
                            <option value="custom">Custom URL</option>
                          </select>

                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => handleUpdateSocial(index, { label: e.target.value })}
                            placeholder="Channel Label"
                            className="bg-[#05070b] border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none max-w-[140px]"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/5 hover:bg-[#66fcf1]/20 text-[#9daab4] hover:text-[#66fcf1] transition-colors"
                            title="Test Link in new tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteSocial(index)}
                            className="p-2 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove Channel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* URL Input & Quick Format Helper */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={item.url}
                            onChange={(e) => handleUpdateSocial(index, { url: e.target.value })}
                            placeholder={`https://${item.platform}.com/...`}
                            className="flex-1 bg-[#05070b] border border-white/20 rounded-xl px-4 py-2 text-xs font-mono text-white focus:border-[#66fcf1] focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const handle = prompt(
                                `Enter ${item.label} username / handle or query (e.g. rotopaintwala):`,
                                'rotopaintwala'
                              );
                              if (handle) {
                                handleFormatPlatformUrl(index, handle, item.platform);
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-mono text-[#66fcf1] border border-white/10 hover:border-[#66fcf1]/40 transition-all flex items-center gap-1.5"
                          >
                            <Search className="w-3 h-3" />
                            <span>Quick Set Handle</span>
                          </button>

                          {item.platform === 'google' && (
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdateSocial(index, {
                                  url: 'https://www.google.com/search?q=Roto+Paint+Wala+VFX',
                                });
                              }}
                              className="px-3 py-2 rounded-xl bg-[#4285F4]/15 hover:bg-[#4285F4]/30 text-[11px] font-mono text-[#4285F4] border border-[#4285F4]/30 transition-all flex items-center gap-1.5"
                            >
                              <span>Google Search Preset</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: PARTNER COLLECTIVE                                                */}
            {/* ========================================================================= */}
            {activeTab === 'partners' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-1">
                      Partner Collective Network
                    </h3>
                    <p className="text-xs text-[#9daab4]">
                      Add, edit, or remove partner studios orbiting the central Roto Paint Wala hub.
                    </p>
                  </div>
                  <button
                    onClick={handleAddPartner}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#66fcf1] text-[#05070b] text-xs font-extrabold hover:shadow-[0_0_20px_rgba(102,252,241,0.3)] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Partner Node</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {config.partners.map((partner, index) => (
                    <div
                      key={index}
                      className="bg-[#08111a] border border-white/10 rounded-xl p-4 flex flex-col justify-between gap-3 relative group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-12 h-12 rounded-lg bg-black border border-white/10 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={partner.logo} alt={partner.studioName} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={partner.studioName}
                            onChange={(e) => {
                              const updated = [...config.partners];
                              updated[index].studioName = e.target.value;
                              updateConfig({ partners: updated });
                            }}
                            className="w-full bg-transparent border-b border-transparent focus:border-[#66fcf1] text-xs font-bold text-white focus:outline-none truncate"
                          />
                          <input
                            type="text"
                            value={partner.speciality || ''}
                            onChange={(e) => {
                              const updated = [...config.partners];
                              updated[index].speciality = e.target.value;
                              updateConfig({ partners: updated });
                            }}
                            placeholder="Speciality"
                            className="w-full bg-transparent border-b border-transparent focus:border-[#66fcf1] text-[11px] text-[#9daab4] focus:outline-none truncate"
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

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-[11px]">
                        <button
                          onClick={() => openMediaModal(`partner-logo-${index}`, 'image', `Change ${partner.studioName} Logo`)}
                          className="text-[10px] font-mono text-[#66fcf1] hover:underline"
                        >
                          Change Logo URL
                        </button>
                        <span className="text-white/20">•</span>
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
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: WORK SHOWCASE & WIPES                                             */}
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
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/30 text-[10px] font-mono text-[#66fcf1] font-bold">
                            SHOT #{index + 1} ({shot.category})
                          </span>
                        </div>
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

                        {/* Raw Plate */}
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

                        {/* Processed Matte */}
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
            {/* TAB 5: SERVICES & PIPELINE                                               */}
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
            {/* TAB 6: FAQS                                                              */}
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
            {/* TAB 7: JSON BACKUP & EXPORT                                              */}
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
    </div>
  );
};
