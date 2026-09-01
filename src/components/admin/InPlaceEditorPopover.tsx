import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { 
  X, 
  Check, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Film, 
  Type, 
  Sparkles, 
  Maximize2,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { MediaUploaderModal } from './MediaUploaderModal';

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
      updateConfig({ [mediaTargetField]: url } as any);
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
                <label className="block text-[11px] text-[#9daab4] mb-1">Playback Source Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateConfig({ heroBgSourceType: 'single-video' })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                      config.heroBgSourceType !== 'playlist'
                        ? 'bg-[#66fcf1]/20 border-[#66fcf1] text-[#66fcf1]'
                        : 'bg-white/5 border-white/10 text-[#9daab4]'
                    }`}
                  >
                    Single Reel
                  </button>
                  <button
                    type="button"
                    onClick={() => updateConfig({ heroBgSourceType: 'playlist' })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                      config.heroBgSourceType === 'playlist'
                        ? 'bg-[#66fcf1]/20 border-[#66fcf1] text-[#66fcf1]'
                        : 'bg-white/5 border-white/10 text-[#9daab4]'
                    }`}
                  >
                    YT Playlist (Shuffle)
                  </button>
                </div>
              </div>

              {config.heroBgSourceType === 'playlist' ? (
                <div>
                  <label className="block text-[11px] text-[#66fcf1] font-bold mb-1">YouTube Playlist ID / URL</label>
                  <input
                    type="text"
                    value={config.heroBgPlaylistId}
                    onChange={(e) => {
                      const val = e.target.value;
                      const match = val.match(/[?&]list=([^#&?]+)/);
                      updateConfig({ heroBgPlaylistId: match ? match[1] : val.trim() });
                    }}
                    placeholder="PLrAl6sJc9k_..."
                    className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-mono"
                  />
                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#9daab4]">
                    <span>Shuffle Mode: Active</span>
                    <span>Loop Mode: Active</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] text-[#9daab4] mb-1">Background YouTube Showreel ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={config.heroBgVideoYouTubeId}
                      onChange={(e) => updateConfig({ heroBgVideoYouTubeId: e.target.value })}
                      className="flex-1 bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-mono"
                    />
                    <button
                      onClick={() => openMediaPicker('heroBgVideoYouTubeId', 'video', 'Change Hero Video Showreel')}
                      className="px-3 py-2 bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30 rounded-lg text-xs hover:bg-[#66fcf1] hover:text-black font-bold flex items-center gap-1"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Reel</span>
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Hero Eyebrow</label>
                <input
                  type="text"
                  value={config.heroEyebrow}
                  onChange={(e) => updateConfig({ heroEyebrow: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Headline Line 1</label>
                <input
                  type="text"
                  value={config.heroHeadlineLine1}
                  onChange={(e) => updateConfig({ heroHeadlineLine1: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Headline Gradient Focus</label>
                <input
                  type="text"
                  value={config.heroHeadlineGradient}
                  onChange={(e) => updateConfig({ heroHeadlineGradient: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-[#66fcf1] focus:border-[#66fcf1] focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9daab4] mb-1">Headline Line 3</label>
                <input
                  type="text"
                  value={config.heroHeadlineLine3}
                  onChange={(e) => updateConfig({ heroHeadlineLine3: e.target.value })}
                  className="w-full bg-[#05070b] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#66fcf1] focus:outline-none font-bold"
                />
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

          {/* Target 6: Generic Fallback */}
          {!['brand-logo', 'hero', 'partners', 'work', 'social'].includes(activeEditTarget) && (
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
