import React from 'react';
import { X, Film, Zap } from 'lucide-react';
import { PortfolioShowreelItem } from '../../types';
import { getYouTubeEmbedUrl, extractYouTubeId, isDirectVideoUrl } from '../../utils/mediaUtils';

interface ReelCinemaModalProps {
  reel: PortfolioShowreelItem | null;
  onClose: () => void;
  onOpenTestShotModal: (serviceName?: string) => void;
}

export const ReelCinemaModal: React.FC<ReelCinemaModalProps> = ({ reel, onClose, onOpenTestShotModal }) => {
  if (!reel) return null;

  const hasVideo = !!(reel.videoUrl && (extractYouTubeId(reel.videoUrl) || isDirectVideoUrl(reel.videoUrl)));
  const embedUrl = hasVideo ? getYouTubeEmbedUrl(reel.videoUrl, { autoplay: true, mute: false, loop: true, controls: true }) : null;
  const isDirect = isDirectVideoUrl(reel.videoUrl);

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

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#05070b] border border-white/10 text-xs font-mono text-[#66fcf1]">
              <Film className="w-3.5 h-3.5" />
              <span>Cinema Master</span>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-400 border border-white/15 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Main Visual Screen */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            {isDirect ? (
              <video
                src={reel.videoUrl || undefined}
                autoPlay
                controls
                loop
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            ) : embedUrl ? (
              <iframe
                src={embedUrl}
                title={reel.title}
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={reel.beforeImage || reel.afterImage || reel.thumbnail || undefined}
                alt={reel.title}
                className="w-full h-full object-cover"
              />
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
