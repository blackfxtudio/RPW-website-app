import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { 
  X, 
  Check, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Film, 
  ListMusic,
  Type, 
  Sparkles, 
  Maximize2,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { MediaUploaderModal } from './MediaUploaderModal';
import { extractYouTubeId, extractPlaylistId, isDirectVideoUrl } from '../../utils/mediaUtils';

interface InPlaceEditorPopoverProps {
  onClose: () => void;
}

export const InPlaceEditorPopover: React.FC<InPlaceEditorPopoverProps> = ({ onClose }) => {
  const { config, updateConfig, activeEditTarget, setActiveEditTarget, notifySaved } = useSiteConfig();
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaTitle, setMediaTitle] = useState<string>('Select Media Asset');

  if (!activeEditTarget) return null;

  const openMediaPicker = (field: string, type: 'image' | 'video', title: string) => {
    setMediaTargetField(field);
    setMediaType(type);
    setMediaTitle(title);
    setMediaModalOpen(true);
  };

  const handleMediaSelected = (url: string) => {
    if (mediaTargetField) {
      const finalUrl = url.trim();
      if (mediaTargetField === 'heroBgVideoYouTubeId') {
        const isDirect = isDirectVideoUrl(finalUrl);
        const ytId = !isDirect ? extractYouTubeId(finalUrl) : null;
        const finalVal = ytId || finalUrl;
        updateConfig({
          heroBgVideoYouTubeId: finalVal,
          ...(isDirect ? { heroBgVideoMp4Url: finalVal } : {}),
        });
      } else if (mediaTargetField === 'heroBgPlaylistId') {
        const plId = extractPlaylistId(finalUrl) || finalUrl;
        updateConfig({
          heroBgPlaylistId: plId,
        });
      } else {
        updateConfig({ [mediaTargetField]: finalUrl } as any);
      }
      notifySaved();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[95] w-full max-w-md bg-[#08111a]/95 backdrop-blur-2xl border border-[#66fcf1]/50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 animate-in slide-in-from-bottom-5 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#66fcf1] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase text-[#66fcf1] tracking-wider">
              Live In-Place Inspector
            </span>
          </div>
          <button
            onClick={() => {
              setActiveEditTarget(null);
              onClose();
            }}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content based on activeEditTarget */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Target 1: Brand & Header Logo */}
          {activeEditTarget === 'brand-logo' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono">Brand Logo & Header</h4>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Brand Name Prefix</label>
                <input
                  type="text"
                  value={config.brandName}
                  onChange={(e) => updateConfig({ brandName: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Brand Name Highlight</label>
                <input
                  type="text"
                  value={config.brandHighlight}
                  onChange={(e) => updateConfig({ brandHighlight: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-[#66fcf1] focus:border-[#66fcf1] focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Logo Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.logoUrl}
                    onChange={(e) => updateConfig({ logoUrl: e.target.value })}
                    className="flex-1 bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-mono"
                  />
                  <button
                    onClick={() => openMediaPicker('logoUrl', 'image', 'Change Header Logo')}
                    className="px-3 py-2 bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30 rounded-lg text-xs hover:bg-[#66fcf1] hover:text-black font-bold"
                  >
                    Browse
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Target 2: Hero Section & Video */}
          {activeEditTarget === 'hero' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono">Hero Main Reel & Copy</h4>
              
              {/* Mode Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-[#9daab4]">Playback Showcase Mode</label>
                  <span className="text-[10px] font-mono text-[#66fcf1]">
                    {config.heroBgSourceType === 'playlist' || config.heroBgSourceType === 'youtube-playlist' ? 'Playlist Active' : 'Single Reel Active'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateConfig({ heroBgSourceType: 'single-video' });
                      notifySaved();
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      config.heroBgSourceType !== 'playlist' && config.heroBgSourceType !== 'youtube-playlist'
                        ? 'bg-[#66fcf1]/20 border-[#66fcf1] text-[#66fcf1]'
                        : 'bg-white/5 border-white/10 text-[#9daab4] hover:text-white'
                    }`}
                  >
                    Single Reel Showcase
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateConfig({ heroBgSourceType: 'playlist' });
                      notifySaved();
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      config.heroBgSourceType === 'playlist' || config.heroBgSourceType === 'youtube-playlist'
                        ? 'bg-[#66fcf1]/20 border-[#66fcf1] text-[#66fcf1]'
                        : 'bg-white/5 border-white/10 text-[#9daab4] hover:text-white'
                    }`}
                  >
                    YouTube Playlist Matrix
                  </button>
                </div>
              </div>

              {/* Single Reel Showcase Input */}
              <div className={`p-2.5 rounded-lg border transition-all ${
                config.heroBgSourceType !== 'playlist' && config.heroBgSourceType !== 'youtube-playlist'
                  ? 'bg-black/40 border-[#66fcf1]/40'
                  : 'bg-black/20 border-white/10'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-[#66fcf1] font-bold flex items-center gap-1">
                    <Film className="w-3 h-3" />
                    <span>Single Reel Video (Looping)</span>
                  </label>
                  {config.heroBgSourceType !== 'playlist' && config.heroBgSourceType !== 'youtube-playlist' ? (
                    <span className="text-[9px] font-mono text-[#66fcf1] font-bold">✓ ACTIVE</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        updateConfig({ heroBgSourceType: 'single-video' });
                        notifySaved();
                      }}
                      className="text-[9px] font-mono text-[#9daab4] hover:text-[#66fcf1] underline"
                    >
                      Set Active
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
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
                    placeholder="e.g. oimtknXFil4 or full video link"
                    className="flex-1 bg-[#05070b] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker('heroBgVideoYouTubeId', 'video', 'Change Hero Video Showreel')}
                    className="px-2.5 py-1.5 bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30 rounded-lg text-xs hover:bg-[#66fcf1] hover:text-black font-bold flex items-center gap-1 shrink-0"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Reel</span>
                  </button>
                </div>
                <p className="text-[10px] text-[#9daab4] mt-1">
                  Hero displays the <span className="text-[#66fcf1] font-bold">LOOP</span> button to loop this video continuously.
                </p>
              </div>

              {/* YouTube Playlist Matrix Input */}
              <div className={`p-2.5 rounded-lg border transition-all ${
                config.heroBgSourceType === 'playlist' || config.heroBgSourceType === 'youtube-playlist'
                  ? 'bg-black/40 border-[#66fcf1]/40'
                  : 'bg-black/20 border-white/10'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-[#66fcf1] font-bold flex items-center gap-1">
                    <ListMusic className="w-3 h-3" />
                    <span>YouTube Playlist Link or ID</span>
                  </label>
                  {config.heroBgSourceType === 'playlist' || config.heroBgSourceType === 'youtube-playlist' ? (
                    <span className="text-[9px] font-mono text-[#66fcf1] font-bold">✓ ACTIVE</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        updateConfig({ heroBgSourceType: 'playlist' });
                        notifySaved();
                      }}
                      className="text-[9px] font-mono text-[#9daab4] hover:text-[#66fcf1] underline"
                    >
                      Set Active
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={config.heroBgPlaylistId}
                  onChange={(e) => {
                    const val = e.target.value;
                    const plId = extractPlaylistId(val) || val.trim();
                    updateConfig({ heroBgPlaylistId: plId, heroBgSourceType: 'playlist' });
                  }}
                  placeholder="Paste YouTube playlist URL (e.g. https://www.youtube.com/playlist?list=...)"
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-mono"
                />
                <div className="flex items-center justify-between pt-1 text-[10px] text-[#9daab4]">
                  <span>Hero displays <span className="text-[#66fcf1] font-bold">FORWARD</span> button</span>
                  <span className="text-[#00df81]">Auto-Next: Active</span>
                </div>
              </div>

              {/* Fallback Image */}
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Fallback Poster Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.heroBgImageFallback}
                    onChange={(e) => updateConfig({ heroBgImageFallback: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker('heroBgImageFallback', 'image', 'Change Hero Poster Image')}
                    className="px-3 py-2 bg-white/10 text-white rounded-lg text-xs hover:bg-white/20 font-bold shrink-0"
                  >
                    Pick
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Hero Eyebrow</label>
                <input
                  type="text"
                  value={config.heroEyebrow}
                  onChange={(e) => updateConfig({ heroEyebrow: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-[#9daab4] mb-1">Headline 1</label>
                  <input
                    type="text"
                    value={config.heroHeadlineLine1}
                    onChange={(e) => updateConfig({ heroHeadlineLine1: e.target.value })}
                    className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#66fcf1] mb-1">Gradient Center</label>
                  <input
                    type="text"
                    value={config.heroHeadlineGradient}
                    onChange={(e) => updateConfig({ heroHeadlineGradient: e.target.value })}
                    className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2 py-1.5 text-xs text-[#66fcf1] focus:border-[#66fcf1] focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#9daab4] mb-1">Headline 3</label>
                  <input
                    type="text"
                    value={config.heroHeadlineLine3}
                    onChange={(e) => updateConfig({ heroHeadlineLine3: e.target.value })}
                    className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Narrative Description</label>
                <textarea
                  rows={3}
                  value={config.heroDescription}
                  onChange={(e) => updateConfig({ heroDescription: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:border-[#66fcf1] focus:outline-none leading-relaxed"
                />
              </div>

              {/* CTAs */}
              <div className="pt-1 border-t border-white/10 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#9daab4] mb-1">Primary CTA</label>
                    <input
                      type="text"
                      value={config.heroCtaPrimaryText}
                      onChange={(e) => updateConfig({ heroCtaPrimaryText: e.target.value })}
                      className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#9daab4] mb-1">Secondary CTA</label>
                    <input
                      type="text"
                      value={config.heroCtaSecondaryText}
                      onChange={(e) => updateConfig({ heroCtaSecondaryText: e.target.value })}
                      className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-[#9daab4] mb-1">RPW Connect Portal URL</label>
                  <input
                    type="text"
                    value={config.connectPortalUrl}
                    onChange={(e) => updateConfig({ connectPortalUrl: e.target.value })}
                    className="w-full bg-[#05070b] border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Target 3: Tagline & Partner Universe */}
          {activeEditTarget === 'partners' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono">Tagline & Partner Collective</h4>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Tagline Main</label>
                <input
                  type="text"
                  value={config.partnerTagline}
                  onChange={(e) => updateConfig({ partnerTagline: e.target.value, primaryTagline: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Tagline Cyan Highlight Word</label>
                <input
                  type="text"
                  value={config.partnerTaglineHighlight}
                  onChange={(e) => updateConfig({ partnerTaglineHighlight: e.target.value, primaryTaglineHighlight: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-[#66fcf1] focus:border-[#66fcf1] focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Partner Studios Count ({config.partners.length} Active)</label>
                <p className="text-[11px] text-[#9daab4] mb-2">
                  To manage individual studio logos, links, and positions, open the Full Backend Dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Target 4: Work Showcase */}
          {activeEditTarget === 'work' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono">Work Showcase Comparison Plates</h4>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Section Heading</label>
                <input
                  type="text"
                  value={config.workHeading}
                  onChange={(e) => updateConfig({ workHeading: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Heading Highlight</label>
                <input
                  type="text"
                  value={config.workHeadingHighlight}
                  onChange={(e) => updateConfig({ workHeadingHighlight: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-[#66fcf1] focus:border-[#66fcf1] focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Active Featured Shot #1 Title</label>
                <input
                  type="text"
                  value={config.shots[0]?.title || ''}
                  onChange={(e) => {
                    const updated = [...config.shots];
                    if (updated[0]) updated[0].title = e.target.value;
                    updateConfig({ shots: updated });
                  }}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Shot #1 Raw Image Plate</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.shots[0]?.originalImage || ''}
                    onChange={(e) => {
                      const updated = [...config.shots];
                      if (updated[0]) updated[0].originalImage = e.target.value;
                      updateConfig({ shots: updated });
                    }}
                    className="flex-1 bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                  <button
                    onClick={() => {
                      setMediaTargetField('shot-0-raw');
                      setMediaType('image');
                      setMediaTitle('Change Featured Shot Raw Plate');
                      setMediaModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 bg-white/10 text-white rounded-lg text-xs"
                  >
                    Pick
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Target 5: Social Channels */}
          {activeEditTarget === 'social' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono">Social Channels & Logos</h4>
              <p className="text-[11px] text-[#9daab4]">
                Quickly edit URLs for Facebook, Instagram, LinkedIn, YouTube, X, Reddit, Discord, and Google.
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(config.socialLinks || []).map((item, idx) => (
                  <div key={item.id || idx} className="p-2 rounded-lg bg-black/40 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white uppercase font-mono">{item.label}</span>
                      <label className="text-[10px] text-[#66fcf1] flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.enabled !== false}
                          onChange={(e) => {
                            const updated = [...(config.socialLinks || [])];
                            updated[idx] = { ...updated[idx], enabled: e.target.checked };
                            updateConfig({ socialLinks: updated });
                          }}
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => {
                        const updated = [...(config.socialLinks || [])];
                        updated[idx] = { ...updated[idx], url: e.target.value };
                        updateConfig({ socialLinks: updated });
                      }}
                      className="w-full bg-[#05070b] border border-white/20 rounded px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target: Collaboration Showcase / Reels */}
          {['collaboration', 'reels', 'portfolio'].includes(activeEditTarget) && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono">Showreel Wall Headline & Tagline</h4>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Main Tagline</label>
                <input
                  type="text"
                  value={config.collaborationTagline || 'COLLABORATION SHOWCASE'}
                  onChange={(e) => updateConfig({ collaborationTagline: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Sub-Description</label>
                <input
                  type="text"
                  value={config.collaborationSubDescription || 'A shared celebration of our creative partnerships.'}
                  onChange={(e) => updateConfig({ collaborationSubDescription: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Target 6: Generic Fallback */}
          {!['brand-logo', 'hero', 'partners', 'work', 'social', 'collaboration', 'reels', 'portfolio'].includes(activeEditTarget) && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono">Editing: {activeEditTarget}</h4>
              <p className="text-xs text-[#9daab4]">
                You have selected section: <strong className="text-white font-mono">{activeEditTarget}</strong>. You can fine-tune all specific fields, items, and lists inside the Full Dashboard panel.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              setActiveEditTarget(null);
              onClose();
            }}
            className="text-[11px] font-mono text-[#9daab4] hover:text-white"
          >
            Done Editing
          </button>
          <button
            onClick={() => {
              notifySaved();
              setActiveEditTarget(null);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#66fcf1] text-[#05070b] text-xs font-extrabold shadow-[0_0_15px_rgba(102,252,241,0.3)]"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Now</span>
          </button>
        </div>
      </div>

      <MediaUploaderModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        title={mediaTitle}
        currentValue={
          mediaTargetField === 'shot-0-raw'
            ? config.shots[0]?.originalImage || ''
            : (config as any)[mediaTargetField] || ''
        }
        mediaType={mediaType}
        onSelect={(url) => {
          if (mediaTargetField === 'shot-0-raw') {
            const updated = [...config.shots];
            if (updated[0]) updated[0].originalImage = url;
            updateConfig({ shots: updated });
          } else {
            handleMediaSelected(url);
          }
          notifySaved();
        }}
      />
    </>
  );
};
