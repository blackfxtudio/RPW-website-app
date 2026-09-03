import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { PORTFOLIO_REELS } from '../../data/portfolioData';
import { PortfolioShowreelItem } from '../../types';
import { extractYouTubeId, getYouTubeEmbedUrl, isDirectVideoUrl } from '../../utils/mediaUtils';
import { Play, Pause, SkipForward, SkipBack, Maximize2, Sparkles, Volume2, VolumeX, Layers, Zap, Clock, ShieldCheck, Film } from 'lucide-react';

interface ContinuousLiveReelPlayerProps {
  onSelectReel: (reel: PortfolioShowreelItem) => void;
  onOpenTestShotModal: (shotName?: string) => void;
}

export const ContinuousLiveReelPlayer: React.FC<ContinuousLiveReelPlayerProps> = ({
  onSelectReel,
  onOpenTestShotModal,
}) => {
  const { config } = useSiteConfig();

  // Combine custom reels from site config and defaults
  const allReels = useMemo(() => {
    const customReels = config.portfolioReels && config.portfolioReels.length > 0 ? config.portfolioReels : [];
    const baseReels = PORTFOLIO_REELS;

    const list: PortfolioShowreelItem[] = [...customReels];
    baseReels.forEach((br) => {
      if (!list.some((r) => r.id === br.id || r.title.toLowerCase() === br.title.toLowerCase())) {
        list.push(br);
      }
    });

    // Ensure items with valid video are prioritized
    return list.filter((r) => !!r.videoUrl || !!r.beforeImage);
  }, [config.portfolioReels]);

  // Playlist of items with valid video / demo
  const playableList = useMemo(() => {
    return allReels.filter((r) => !!r.videoUrl && (extractYouTubeId(r.videoUrl) || isDirectVideoUrl(r.videoUrl)));
  }, [allReels]);

  const activeReels = playableList.length > 0 ? playableList : allReels;

  // Active playing index & playback duration per clip (default 20 seconds)
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [durationPerClip, setDurationPerClip] = useState<number>(20); // 20 seconds loop as requested
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const currentReel = activeReels[currentIndex] || activeReels[0];

  // Auto-advance loop timer every 1 second
  useEffect(() => {
    if (!isPlaying || activeReels.length === 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Advance to next video in continuous loop
          setCurrentIndex((idx) => (idx + 1) % activeReels.length);
          return durationPerClip;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, activeReels.length, durationPerClip]);

  // Reset seconds remaining when user manually changes track
  const handleSelectTrack = (index: number) => {
    setCurrentIndex(index);
    setSecondsRemaining(durationPerClip);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeReels.length);
    setSecondsRemaining(durationPerClip);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeReels.length) % activeReels.length);
    setSecondsRemaining(durationPerClip);
  };

  // Compute progress percentage of the current 20-second window
  const progressPercent = Math.round(((durationPerClip - secondsRemaining) / durationPerClip) * 100);

  if (!currentReel) return null;

  const hasVideo = !!(currentReel.videoUrl && (extractYouTubeId(currentReel.videoUrl) || isDirectVideoUrl(currentReel.videoUrl)));
  const isDirect = isDirectVideoUrl(currentReel.videoUrl);
  
  // Embed for continuous live stream player
  const embedUrl = hasVideo && !isDirect
    ? getYouTubeEmbedUrl(currentReel.videoUrl, {
        autoplay: true,
        mute: isMuted,
        loop: true,
        controls: false,
      })
    : null;

  return (
    <div className="w-full relative z-20 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pt-8 pb-12">
      {/* Live Stream Stage Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#08111a] border border-[#66fcf1]/40 shadow-[0_0_80px_rgba(102,252,241,0.18)] overflow-hidden">
        
        {/* Top Header Live Status Bar */}
        <div className="p-3.5 sm:p-4 bg-[#05070b]/90 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-mono font-black tracking-wider uppercase shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              LIVE SHOWREEL STREAM
            </span>
            <span className="text-xs font-mono text-[#66fcf1] hidden sm:inline-block font-bold">
              [CONTINUOUS AUTOPLAY LOOP • {durationPerClip}S CADENCE]
            </span>
          </div>

          {/* Quick Playlist Switcher info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-[11px] font-mono text-[#87949c]">NOW PLAYING SHOT {currentIndex + 1} OF {activeReels.length}</p>
              <p className="text-xs font-heading font-black text-white truncate max-w-[260px]">{currentReel.title}</p>
            </div>

            {/* Click to open full video button */}
            <button
              onClick={() => onSelectReel(currentReel)}
              className="px-3.5 py-1.5 rounded-full bg-[#66fcf1] text-[#05070b] font-heading font-black text-xs uppercase tracking-wider shadow-[0_0_20px_#66fcf1] hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>WATCH FULL VIDEO</span>
            </button>
          </div>
        </div>

        {/* 16:9 Video Canvas Screen */}
        <div className="relative aspect-video w-full bg-black overflow-hidden group/stage">
          {hasVideo ? (
            isDirect ? (
              <video
                key={currentReel.videoUrl}
                src={currentReel.videoUrl || undefined}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            ) : embedUrl ? (
              <iframe
                key={currentReel.videoUrl}
                src={embedUrl}
                title={currentReel.title}
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full border-0 pointer-events-none scale-105"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <img
                src={currentReel.beforeImage || currentReel.thumbnail || undefined}
                alt={currentReel.title}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <img
              src={currentReel.beforeImage || currentReel.thumbnail || undefined}
              alt={currentReel.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Cinematic Overlay Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08111a] via-transparent to-black/40 pointer-events-none" />

          {/* Top Left Tags & Resolution */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-20 pointer-events-none">
            <span className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#66fcf1]/50 text-[#66fcf1] font-mono text-xs font-black uppercase tracking-wider">
              {currentReel.category}
            </span>
            <span className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold hidden sm:inline-block">
              {currentReel.resolution}
            </span>
            <span className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-[#00df81] font-mono text-xs font-bold hidden md:inline-block">
              ⏱ {currentReel.turnaroundTime}
            </span>
          </div>

          {/* Center Fullscreen Overlay Click Trigger */}
          <div
            onClick={() => onSelectReel(currentReel)}
            className="absolute inset-0 cursor-pointer flex items-center justify-center z-10"
          >
            <div className="opacity-0 group-hover/stage:opacity-100 transition-opacity bg-black/70 backdrop-blur-md border border-[#66fcf1] rounded-2xl px-5 py-3 flex items-center gap-2 text-white shadow-[0_0_30px_rgba(102,252,241,0.5)]">
              <Film className="w-4 h-4 text-[#66fcf1]" />
              <span className="text-xs font-mono font-bold tracking-wider">CLICK TO EXPAND FULL 4K CINEMA MASTER</span>
            </div>
          </div>

          {/* Bottom Video Progress & Control Bar */}
          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 z-20 flex flex-col gap-3 pointer-events-auto">
            {/* 20-Second Progress Line */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#66fcf1] to-[#00df81] transition-all duration-1000 ease-linear shadow-[0_0_10px_#66fcf1]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Video Controls and Shot Metadata */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-black/80 border border-white/20 text-white hover:border-[#66fcf1] hover:text-[#66fcf1] transition-all"
                  title="Previous Shot"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 font-mono text-xs font-bold uppercase transition-all ${
                    isPlaying
                      ? 'bg-[#66fcf1] text-[#05070b] border-[#66fcf1] shadow-[0_0_15px_#66fcf1]'
                      : 'bg-black/80 text-white border-white/20 hover:bg-white/10'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span className="hidden sm:inline">{isPlaying ? 'PAUSE LOOP' : 'PLAY LOOP'}</span>
                </button>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-black/80 border border-white/20 text-white hover:border-[#66fcf1] hover:text-[#66fcf1] transition-all"
                  title="Next Shot"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-white/20 text-[#66fcf1] text-xs font-mono font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>NEXT SHOT IN {secondsRemaining}S</span>
                </div>
              </div>

              {/* Shot Title & Test brief request */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenTestShotModal(currentReel.title)}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00df81] text-[#05070b] font-heading font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,223,129,0.4)] hover:scale-105 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>REQUEST TEST BRIEF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Carousel Strip for Quick Navigation */}
        <div className="p-3 sm:p-4 bg-[#05070b] border-t border-white/10 overflow-x-auto scrollbar-none flex items-center gap-3">
          {activeReels.map((reel, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={reel.id || idx}
                onClick={() => handleSelectTrack(idx)}
                className={`relative shrink-0 w-36 sm:w-48 aspect-video rounded-xl overflow-hidden border-2 text-left transition-all duration-300 ${
                  isActive
                    ? 'border-[#66fcf1] shadow-[0_0_20px_rgba(102,252,241,0.6)] scale-102 z-10'
                    : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/40'
                }`}
              >
                <img
                  src={reel.beforeImage || reel.afterImage || reel.thumbnail || undefined}
                  alt={reel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-1.5 left-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-[#66fcf1] uppercase">
                    {reel.category}
                  </span>
                </div>
                <div className="absolute bottom-1.5 left-1.5 right-1.5">
                  <p className="text-[10px] font-heading font-bold text-white truncate">
                    {reel.title}
                  </p>
                </div>
                {isActive && isPlaying && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-[#66fcf1] shadow-[0_0_8px_#66fcf1]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
