import React, { useState } from 'react';
import { X, Play, Sliders, Layers, CheckCircle2, Zap, ExternalLink, Film, Clock, Sparkles } from 'lucide-react';
import { PortfolioShowreelItem } from '../../types';

interface ReelCinemaModalProps {
  reel: PortfolioShowreelItem | null;
  onClose: () => void;
  onOpenTestShotModal: (serviceName?: string) => void;
}

export const ReelCinemaModal: React.FC<ReelCinemaModalProps> = ({ reel, onClose, onOpenTestShotModal }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'wipe' | 'specs'>('video');
  const [sliderPos, setSliderPos] = useState<number>(50);

  if (!reel) return null;

  // Extract YouTube ID if valid
  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
      : null;
  };

  const embedUrl = getYouTubeEmbedUrl(reel.videoUrl);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos(Math.round((x / rect.width) * 100));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-[#050a10] border border-[#66fcf1]/40 rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(102,252,241,0.2)] overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-[#08111a]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#66fcf1]/15 text-[#66fcf1] border border-[#66fcf1]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                {reel.category}
              </span>
              <span className="text-xs font-mono text-[#9daab4]">{reel.resolution}</span>
            </div>
            <h3 className="font-heading font-black text-lg sm:text-2xl text-white mt-1">
              {reel.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Tabs */}
            <div className="hidden sm:flex items-center bg-[#05070b] border border-white/15 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'video'
                    ? 'bg-[#66fcf1] text-[#05070b]'
                    : 'text-[#9daab4] hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Showreel</span>
              </button>
              {reel.beforeImage && (
                <button
                  onClick={() => setActiveTab('wipe')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'wipe'
                      ? 'bg-[#66fcf1] text-[#05070b]'
                      : 'text-[#9daab4] hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>A/B Wipe</span>
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/15 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Main Visual Screen */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            {activeTab === 'video' ? (
              embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={reel.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              /* A/B Wipe Mode */
              <div
                className="relative w-full h-full cursor-ew-resize select-none overflow-hidden"
                onMouseMove={handleSliderMove}
                onTouchMove={handleSliderMove}
              >
                {/* Before Image */}
                <img
                  src={reel.beforeImage || reel.thumbnail}
                  alt="Original Plate"
                  className="absolute inset-0 w-full h-full object-cover select-none"
                />
                {/* After Image Clipped */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none select-none"
                  style={{
                    clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                  }}
                >
                  <img
                    src={reel.afterImage || reel.matteImage || reel.thumbnail}
                    alt="Processed Plate"
                    className="absolute inset-0 w-full h-full object-cover select-none filter contrast-125"
                  />
                  <div className="absolute inset-0 bg-[#66fcf1]/20 mix-blend-color-dodge" />
                </div>
                {/* Divider */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-[#66fcf1] shadow-[0_0_15px_#66fcf1]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#66fcf1] text-[#05070b] flex items-center justify-center font-bold text-xs shadow-lg">
                    ↔
                  </div>
                </div>
                {/* Labels */}
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded bg-black/80 text-[11px] font-mono text-[#66fcf1] border border-[#66fcf1]/40">
                  MATTE / CLEAN [{sliderPos}%]
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded bg-black/80 text-[11px] font-mono text-white/80 border border-white/20">
                  RAW PLATE
                </div>
              </div>
            )}
          </div>

          {/* Details & Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-[#66fcf1] tracking-wider">
                Production Breakdown & Method
              </h4>
              <p className="text-sm text-[#9daab4] leading-relaxed">
                {reel.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {reel.software.map((sw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white"
                  >
                    ⚡ {sw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#08111a] border border-white/10 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                Shot Metrics
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-[#87949c]">Turnaround:</span>
                  <span className="text-[#66fcf1] font-bold">{reel.turnaroundTime}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-[#87949c]">Client Tier:</span>
                  <span className="text-white">{reel.clientTier}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-[#87949c]">Resolution:</span>
                  <span className="text-white">{reel.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#87949c]">Delivery:</span>
                  <span className="text-emerald-400">100% Passed QC</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenTestShotModal(reel.category);
                }}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#66fcf1] text-[#05070b] font-heading font-black text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(102,252,241,0.5)] transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Test This Pipeline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
