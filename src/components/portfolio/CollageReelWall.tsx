import React, { useState, useEffect, useMemo } from 'react';
import { PORTFOLIO_REELS } from '../../data/portfolioData';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { Play, Pause, Sparkles, Layers, Zap, Maximize2, LayoutGrid } from 'lucide-react';
import { getYouTubeEmbedUrl, extractYouTubeId, isDirectVideoUrl } from '../../utils/mediaUtils';
import { PortfolioShowreelItem } from '../../types';

interface CollageReelWallProps {
  onSelectReel: (reel: PortfolioShowreelItem) => void;
  onOpenTestShotModal: () => void;
  isActive?: boolean;
}

export const CollageReelWall: React.FC<CollageReelWallProps> = ({ 
  onSelectReel, 
  onOpenTestShotModal,
  isActive = true,
}) => {
  const { config } = useSiteConfig();

  // Dynamically build tiles strictly from live portfolioReels (NO fake demo posters)
  const dynamicReels = useMemo(() => {
    const reels = config.portfolioReels && config.portfolioReels.length > 0 ? config.portfolioReels : PORTFOLIO_REELS;
    return reels.map((reel, idx) => ({
      id: reel.id || `reel-${idx + 1}`,
      title: reel.title,
      category: reel.category,
      image: reel.beforeImage || reel.thumbnail || reel.afterImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
      videoUrl: reel.videoUrl || '',
      badge: reel.tag || reel.category,
      glowColor: '#66fcf1',
      reelData: reel,
    }));
  }, [config.portfolioReels]);

  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [hoveredTileId, setHoveredTileId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'3d-wall' | 'cinema-grid'>('3d-wall');

  // Use all dynamic reels directly
  const reelsList = dynamicReels;

  // Create rows for continuous 3D ribbon loop: 2 sets for perfect 50% infinite keyframe marquee
  const rawRow1 = reelsList.slice(0, Math.ceil(reelsList.length / 2));
  const rawRow2 = reelsList.slice(Math.ceil(reelsList.length / 2));
  const safeRow2 = rawRow2.length > 0 ? rawRow2 : rawRow1;

  const row1 = [...rawRow1, ...rawRow1];
  const row2 = [...safeRow2, ...safeRow2];

  return (
    <div className="relative w-full overflow-hidden bg-[#03060a] pt-24 sm:pt-28 pb-16 border-b border-[#66fcf1]/20">
      {/* Background Neon Lasers and Glow Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#66fcf1]/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-[#03060a] to-transparent z-20" />
        <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#03060a] to-transparent z-20" />
        <div className="absolute inset-0 vfx-mesh-pattern opacity-40 z-10" />
      </div>

      {/* Header: Collaboration Showcase with Beautiful Poppins Styling */}
      <div className="relative z-30 max-w-5xl mx-auto px-4 sm:px-8 text-center mb-10">
        {/* Luminous Top Kicker */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/30 text-[#66fcf1] text-[11px] font-semibold tracking-[0.24em] uppercase mb-4 shadow-[0_0_25px_rgba(102,252,241,0.22)] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#66fcf1] animate-pulse" />
          <span>CREATIVE PARTNERSHIPS</span>
        </div>

        {/* Main Tagline Title in Poppins Font */}
        <h1 className="font-['Poppins',sans-serif] text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[0.05em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-[#f0fbff] to-[#a8f5f0] drop-shadow-[0_4px_35px_rgba(102,252,241,0.25)]">
          {config.collaborationTagline || 'COLLABORATION SHOWCASE'}
        </h1>

        {/* Subtle Decorative Accent Line */}
        <div className="flex items-center justify-center gap-3 my-4">
          <span className="w-14 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[#66fcf1]/80" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1] shadow-[0_0_12px_#66fcf1]" />
          <span className="w-14 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[#66fcf1]/80" />
        </div>

        {/* Sub-Description in Poppins Font */}
        <p className="max-w-xl mx-auto font-['Poppins',sans-serif] text-sm sm:text-base text-slate-300 font-normal leading-relaxed tracking-wide">
          {config.collaborationSubDescription || 'A shared celebration of our creative partnerships.'}
        </p>
      </div>

      {/* Main Video Display: 3D Wall OR Multi-Screen Cinema Grid */}
      {viewMode === '3d-wall' ? (
        /* 3D Angled Moving Reel Showcase Wall - ALL REELS PLAYING SIMULTANEOUSLY */
        <div className="relative w-full py-6 transition-all duration-700 select-none perspective-[1200px] scale-[1.03] sm:scale-100 transform-gpu">
          <div
            className="space-y-4 sm:space-y-6 transition-transform duration-700 rotate-x-[12deg] -rotate-y-[2deg] rotate-z-[-2deg]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Row 1: Scrolling Left */}
            <div className="flex gap-4 sm:gap-6 overflow-hidden w-full relative">
              <div
                className="flex gap-4 sm:gap-6 shrink-0"
                style={{
                  animation: `scrollLeft ${45 / speedMultiplier}s linear infinite`,
                  animationPlayState: isPlaying && isActive ? 'running' : 'paused',
                }}
              >
                {row1.map((tile, idx) => (
                  <LiveReelCard
                    key={`r1-${tile.id}-${idx}`}
                    tile={tile}
                    staggerIndex={idx}
                    isHovered={hoveredTileId === `r1-${tile.id}-${idx}`}
                    onMouseEnter={() => setHoveredTileId(`r1-${tile.id}-${idx}`)}
                    onMouseLeave={() => setHoveredTileId(null)}
                    onClick={(customTitle) => onSelectReel({ ...tile.reelData, title: customTitle || tile.reelData.title })}
                  />
                ))}
              </div>
            </div>

            {/* Row 2: Scrolling Right */}
            <div className="flex gap-4 sm:gap-6 overflow-hidden w-full relative">
              <div
                className="flex gap-4 sm:gap-6 shrink-0"
                style={{
                  animation: `scrollRight ${50 / speedMultiplier}s linear infinite`,
                  animationPlayState: isPlaying && isActive ? 'running' : 'paused',
                }}
              >
                {row2.map((tile, idx) => (
                  <LiveReelCard
                    key={`r2-${tile.id}-${idx}`}
                    tile={tile}
                    staggerIndex={idx + 4}
                    isHovered={hoveredTileId === `r2-${tile.id}-${idx}`}
                    onMouseEnter={() => setHoveredTileId(`r2-${tile.id}-${idx}`)}
                    onMouseLeave={() => setHoveredTileId(null)}
                    onClick={(customTitle) => onSelectReel({ ...tile.reelData, title: customTitle || tile.reelData.title })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Multi-Screen Studio Matrix Grid View - All reels playing live in studio grid */
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-6 relative z-30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reelsList.map((tile, idx) => (
              <div key={`grid-${tile.id}-${idx}`} className="w-full">
                <LiveReelCard
                  tile={tile}
                  isGridMode
                  staggerIndex={idx}
                  isHovered={hoveredTileId === `grid-${tile.id}-${idx}`}
                  onMouseEnter={() => setHoveredTileId(`grid-${tile.id}-${idx}`)}
                  onMouseLeave={() => setHoveredTileId(null)}
                  onClick={(customTitle) => onSelectReel({ ...tile.reelData, title: customTitle || tile.reelData.title })}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Center Matrix Controller */}
      <div className="relative z-30 max-w-4xl mx-auto px-4 mt-6">
        <div className="p-4 rounded-2xl bg-[#050a10]/95 backdrop-blur-xl border border-[#66fcf1]/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {viewMode === '3d-wall' && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-mono text-xs font-bold uppercase transition-all ${
                  isPlaying
                    ? 'bg-[#66fcf1] text-[#05070b] border-[#66fcf1] shadow-[0_0_15px_rgba(102,252,241,0.5)]'
                    : 'bg-white/5 text-white border-white/20 hover:bg-white/10'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'PAUSE MOTION' : 'RESUME MOTION'}</span>
              </button>
            )}

            <button
              onClick={() => setViewMode((prev) => (prev === '3d-wall' ? 'cinema-grid' : '3d-wall'))}
              className={`px-3.5 py-2.5 rounded-xl border flex items-center gap-2 font-mono text-xs font-bold uppercase transition-all ${
                viewMode === 'cinema-grid'
                  ? 'bg-[#66fcf1] text-[#05070b] border-[#66fcf1] shadow-[0_0_15px_rgba(102,252,241,0.5)]'
                  : 'bg-white/5 text-white border-white/20 hover:border-[#66fcf1]/50'
              }`}
            >
              {viewMode === '3d-wall' ? (
                <>
                  <LayoutGrid className="w-4 h-4" />
                  <span>STUDIO MATRIX GRID</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4 text-[#66fcf1]" />
                  <span>3D KINETIC WALL</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[11px] font-mono text-[#66fcf1] flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#66fcf1] animate-pulse" />
              <span>{reelsList.length} SHOWREEL FEEDS ACTIVE</span>
            </div>

            <button
              onClick={onOpenTestShotModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#66fcf1] to-[#45b649] text-[#05070b] font-heading font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(102,252,241,0.4)] hover:scale-105 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>REQUEST SHOT BRIEF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LiveReelCardProps {
  tile: {
    id: string;
    title: string;
    category: string;
    image: string;
    videoUrl: string;
    badge: string;
    glowColor?: string;
  };
  isGridMode?: boolean;
  isHovered: boolean;
  staggerIndex?: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (customTitle?: string) => void;
}

const LiveReelCard: React.FC<LiveReelCardProps> = ({
  tile,
  isGridMode = false,
  isHovered,
  staggerIndex = 0,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const hasVideo = !!(tile.videoUrl && (extractYouTubeId(tile.videoUrl) || isDirectVideoUrl(tile.videoUrl)));
  const isDirect = isDirectVideoUrl(tile.videoUrl);
  const ytId = useMemo(() => extractYouTubeId(tile.videoUrl), [tile.videoUrl]);
  const ytThumb = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : null;
  const posterSrc = tile.image || ytThumb || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop';

  const [canMountIframe, setCanMountIframe] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [videoTitle, setVideoTitle] = useState<string>(tile.title);

  // Fetch real YouTube video title cleanly via public oembed
  useEffect(() => {
    let isMounted = true;
    if (ytId) {
      fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data && data.title) {
            setVideoTitle(data.title);
          }
        })
        .catch(() => {});
    } else {
      setVideoTitle(tile.title);
    }
    return () => {
      isMounted = false;
    };
  }, [ytId, tile.title]);

  useEffect(() => {
    if (!hasVideo || isDirect) return;
    // Stagger network requests cleanly across time so YouTube connections don't bottleneck
    const timer = setTimeout(() => {
      setCanMountIframe(true);
    }, Math.min(staggerIndex * 150, 1600));
    return () => clearTimeout(timer);
  }, [hasVideo, isDirect, staggerIndex]);

  // ALL REELS PLAY CONTINUOUSLY WITHOUT HOVERING
  const embedUrl = useMemo(() => {
    if (!hasVideo || isDirect) return null;
    return getYouTubeEmbedUrl(tile.videoUrl, {
      autoplay: true,
      mute: true,
      loop: true,
      controls: false,
      modestbranding: true,
    });
  }, [hasVideo, isDirect, tile.videoUrl]);

  return (
    <div
      onClick={() => onClick(videoTitle)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group/tile relative ${
        isGridMode
          ? 'w-full aspect-video rounded-2xl'
          : 'w-[260px] sm:w-[340px] md:w-[380px] h-[160px] sm:h-[200px] md:h-[220px] rounded-xl shrink-0'
      } overflow-hidden cursor-pointer border-2 transition-all duration-300 transform bg-[#05070b] ${
        isHovered
          ? 'border-[#66fcf1] scale-105 z-30 shadow-[0_0_35px_rgba(102,252,241,0.8)]'
          : 'border-white/20 hover:border-[#66fcf1] shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
      }`}
    >
      {/* 1. Base Layer: Instant High-Res Cinematic Master Poster (Prevents any blank or buffering lag) */}
      <img
        src={posterSrc}
        alt={videoTitle}
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover filter contrast-[1.08] brightness-[0.95]"
      />

      {/* 2. Real Video Playback - Autoplays live continuously without hovering */}
      {hasVideo && (
        isDirect ? (
          <video
            src={tile.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : embedUrl && canMountIframe ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden bg-transparent pointer-events-none">
            <iframe
              src={embedUrl}
              title={videoTitle}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setIsIframeLoaded(true)}
              className={`w-full h-full border-0 scale-125 object-cover transition-opacity duration-700 ${
                isIframeLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : null
      )}

      {/* Transparent Click Overlay to capture user clicks effortlessly */}
      <div className="absolute inset-0 z-20 cursor-pointer" />

      {/* Glass Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-black/20 to-transparent opacity-85 group-hover/tile:opacity-40 transition-opacity pointer-events-none z-10" />

      {/* Neon laser border highlight */}
      <div className="absolute inset-0 border border-[#66fcf1]/30 rounded-xl group-hover/tile:border-[#66fcf1] transition-colors pointer-events-none z-20" />

      {/* Hover Expand Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/tile:opacity-100 transition-all duration-300 pointer-events-none z-20">
        <div className="px-4 py-2 rounded-xl bg-[#66fcf1] text-[#05070b] font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_25px_#66fcf1] transform group-hover/tile:scale-105">
          <Maximize2 className="w-4 h-4" />
          <span>OPEN 4K CINEMA MASTER</span>
        </div>
      </div>

      {/* Bottom Title Info: Displaying ONLY the fetched title of the video */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none z-20">
        <div className="bg-[#05070b]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 shadow-lg">
          <h4 className="font-heading font-bold text-xs sm:text-sm text-white tracking-wide truncate drop-shadow-md">
            {videoTitle}
          </h4>
        </div>
      </div>
    </div>
  );
};
