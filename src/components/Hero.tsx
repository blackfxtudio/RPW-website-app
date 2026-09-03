import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowUpRight, Volume2, VolumeX, Play, Pause, Edit3, Shuffle, SkipForward, Repeat, AlertCircle } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { extractYouTubeId, extractPlaylistId, isDirectVideoUrl, extractMultipleVideoIds } from '../utils/mediaUtils';

interface HeroProps {
  onExploreWork: () => void;
  onNavigateToPortfolio?: () => void;
  onOpenTestShotModal: () => void;
  onOpenAppModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onExploreWork, 
  onNavigateToPortfolio, 
  onOpenTestShotModal,
  onOpenAppModal 
}) => {
  const { config, isEditorOpen, setActiveEditTarget } = useSiteConfig();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isForwarding, setIsForwarding] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLoopingSingle, setIsLoopingSingle] = useState(true);
  const [reelOverride, setReelOverride] = useState<string | null>(null);
  const [shuffleNotice, setShuffleNotice] = useState<string | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const directVideoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Normalize source formats - Strict separation between single-video loop and playlist matrix
  const playlistFromSingle = !isDirectVideoUrl(config.heroBgVideoYouTubeId) ? extractPlaylistId(config.heroBgVideoYouTubeId) : null;
  const playlistFromConfig = extractPlaylistId(config.heroBgPlaylistId) || config.heroBgPlaylistId?.trim() || '';

  const isExplicitPlaylistMode = config.heroBgSourceType === 'playlist' || config.heroBgSourceType === 'youtube-playlist';
  const isPlaylistMode = isExplicitPlaylistMode || Boolean(playlistFromSingle);

  // Playlist Mode: strictly resolves playlist ID
  const cleanPlaylistId = isPlaylistMode
    ? (isExplicitPlaylistMode ? (playlistFromConfig || playlistFromSingle || 'PLeCvIRVv6kwAnlAl3GSafX4qZ8I_5pTEu') : (playlistFromSingle || 'PLeCvIRVv6kwAnlAl3GSafX4qZ8I_5pTEu'))
    : '';

  // Single Reel Mode: strictly resolves from config.heroBgVideoYouTubeId / mp4
  const isDirectVideo = !isPlaylistMode && (isDirectVideoUrl(config.heroBgVideoYouTubeId) || isDirectVideoUrl(config.heroBgVideoMp4Url));
  const directVideoSrc = isDirectVideo ? (isDirectVideoUrl(config.heroBgVideoYouTubeId) ? config.heroBgVideoYouTubeId : (config.heroBgVideoMp4Url || '')) : '';
  const rawVideoId = !isPlaylistMode
    ? (extractYouTubeId(config.heroBgVideoYouTubeId) || (!isDirectVideo && config.heroBgVideoYouTubeId ? config.heroBgVideoYouTubeId.trim() : '') || 'oimtknXFil4')
    : '';
  const activeVideoId = reelOverride || rawVideoId;

  // Reset reel override whenever admin updates the video config
  useEffect(() => {
    setReelOverride(null);
  }, [config.heroBgVideoYouTubeId, config.heroBgPlaylistId, config.heroBgSourceType]);

  // Parallax mouse move effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      gridRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Guarantee video is revealed within 1.2s
  useEffect(() => {
    setVideoLoaded(false);
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeVideoId, directVideoSrc, isDirectVideo, cleanPlaylistId, isPlaylistMode]);

  // Construct high-performance, resilient YouTube embed URL with auto-play, loop, mute
  // Stably created without changing iframe src on next track to ensure zero-buffer skipping
  const ytEmbedUrl = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: '1',
      mute: isMuted ? '1' : '0',
      loop: '1',
      controls: '0',
      showinfo: '0',
      modestbranding: '1',
      rel: '0',
      playsinline: '1',
      enablejsapi: '1',
    });

    if (typeof window !== 'undefined' && window.location?.origin && window.location.origin.startsWith('http')) {
      params.set('origin', window.location.origin);
    }

    // 1. YouTube Playlist Matrix (Direct list ID provided by user)
    if (isPlaylistMode && cleanPlaylistId) {
      params.set('listType', 'playlist');
      params.set('list', cleanPlaylistId);
      return `https://www.youtube-nocookie.com/embed/videoseries?${params.toString()}`;
    }

    // 2. Single Video Loop (Continuously loops this single reel again and again)
    params.set('playlist', activeVideoId);
    return `https://www.youtube-nocookie.com/embed/${activeVideoId}?${params.toString()}`;
  }, [isPlaylistMode, cleanPlaylistId, activeVideoId, isMuted]);

  // Send YouTube postMessage API commands directly to the running player instance
  const sendYTCommand = (func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch (e) {
        console.warn('YT postMessage error:', e);
      }
    }
  };

  // Listen to YouTube player state changes:
  // Automatically advance to the next video when playlist video finishes,
  // or automatically loop the same video when single reel finishes.
  useEffect(() => {
    const handleYTMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            return;
          }
        }
        // YouTube Player State: 0 = ENDED
        if (data?.event === 'onStateChange' && data?.info === 0) {
          if (isPlaylistMode) {
            sendYTCommand('nextVideo');
            sendYTCommand('playVideo');
          } else if (isLoopingSingle) {
            sendYTCommand('seekTo', [0, true]);
            sendYTCommand('playVideo');
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleYTMessage);
    return () => window.removeEventListener('message', handleYTMessage);
  }, [isPlaylistMode, isLoopingSingle]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (isDirectVideo && directVideoRef.current) {
      directVideoRef.current.muted = nextMuted;
    } else {
      sendYTCommand(nextMuted ? 'mute' : 'unMute');
    }
  };

  const togglePlay = () => {
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);

    if (isDirectVideo && directVideoRef.current) {
      if (nextPlaying) {
        directVideoRef.current.play().catch(() => {});
      } else {
        directVideoRef.current.pause();
      }
    } else {
      sendYTCommand(nextPlaying ? 'playVideo' : 'pauseVideo');
    }
  };

  // FORWARD: Available in Playlist mode. Plays the next video in the playlist with ZERO buffering
  const handleForward = () => {
    if (!isPlaylistMode) return;
    setIsForwarding(true);
    sendYTCommand('nextVideo');
    sendYTCommand('playVideo');
    setShuffleNotice('Next Playlist Track');
    setTimeout(() => setShuffleNotice(null), 2000);
    setTimeout(() => setIsForwarding(false), 300);
  };

  // LOOP: Available ONLY in Single Reel mode. Loops the same video continuously
  const handleLoopClick = () => {
    if (isDirectVideo && directVideoRef.current) {
      directVideoRef.current.currentTime = 0;
      directVideoRef.current.play().catch(() => {});
    } else {
      sendYTCommand('seekTo', [0, true]);
      sendYTCommand('playVideo');
    }
    setIsLoopingSingle(true);
    setShuffleNotice('Looping Same Reel');
    setTimeout(() => setShuffleNotice(null), 2000);
  };

  // Playlist Shuffle Handler
  const handleShuffle = () => {
    setIsShuffling(true);
    sendYTCommand('setShuffle', [true]);
    sendYTCommand('nextVideo');
    sendYTCommand('playVideo');
    setShuffleNotice('Shuffling Playlist Videos');
    setTimeout(() => setShuffleNotice(null), 2500);
    setTimeout(() => setIsShuffling(false), 500);
  };

  return (
    <section
      ref={heroRef}
      id="rpw"
      className="relative min-h-[90vh] sm:min-h-screen flex items-center overflow-hidden pt-20 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 lg:px-10 group"
    >
      {/* In-Place Visual Edit Overlay Trigger */}
      {isEditorOpen && (
        <div className="absolute top-20 left-4 sm:left-6 z-40">
          <button
            onClick={() => setActiveEditTarget('hero')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#66fcf1] text-[#05070b] text-xs font-bold shadow-[0_0_20px_rgba(102,252,241,0.5)] hover:scale-105 transition-transform"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Hero Video & Copy</span>
          </button>
        </div>
      )}

      {/* Dynamic Animated Motion Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#05070b] via-[#081622] to-[#002229] animate-gradient-flow opacity-70" />

      {/* Background Video Container */}
      <div
        className={`absolute inset-0 z-[1] overflow-hidden pointer-events-none transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] scale-125 filter contrast-[1.12] saturate-[1.2] brightness-[1.08]">
          {isDirectVideo && directVideoSrc ? (
            <video
              key={`direct-video-${directVideoSrc}`}
              ref={directVideoRef}
              src={directVideoSrc}
              autoPlay
              loop={isLoopingSingle}
              muted={isMuted}
              playsInline
              preload="auto"
              onEnded={() => {
                if (isLoopingSingle && directVideoRef.current) {
                  directVideoRef.current.currentTime = 0;
                  directVideoRef.current.play().catch(() => {});
                }
              }}
              onLoadedData={() => {
                setVideoLoaded(true);
                setIsPlaying(true);
              }}
              onPlay={() => {
                setVideoLoaded(true);
                setIsPlaying(true);
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe
              key={`yt-${rawVideoId}-${cleanPlaylistId}-${isPlaylistMode}`}
              ref={iframeRef}
              src={ytEmbedUrl}
              title="Hero Background Reel"
              onLoad={() => setVideoLoaded(true)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-full border-0 pointer-events-none"
            />
          )}
        </div>

        {/* Ambient VFX Gradients Overlay */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#05070b]/60 via-[#05070b]/35 via-50% to-transparent/10" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#05070b]/60 via-transparent to-[#05070b]/25" />
      </div>

      {/* Fallback Image Poster if Video is loading */}
      {!videoLoaded && config.heroBgImageFallback && (
        <div
          className="absolute inset-0 z-[1] bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${config.heroBgImageFallback})` }}
        />
      )}

      {/* Parallax VFX Grid Pattern */}
      <div
        ref={gridRef}
        className="absolute inset-0 z-[3] opacity-15 hero-grid-pattern pointer-events-none transition-transform duration-100 ease-out"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
        }}
      />

      {/* Ambient Radial Blur Glows */}
      <div className="absolute top-[15%] -left-32 w-96 h-96 rounded-full bg-[#66fcf1] blur-[120px] opacity-15 pointer-events-none" />
      <div className="absolute bottom-[20%] -right-32 w-[450px] h-[450px] rounded-full bg-[#17465a] blur-[130px] opacity-20 pointer-events-none" />

      {/* Main Container Content - Aligned firmly to the Left */}
      <div className="relative z-10 w-full max-w-7xl mr-auto">
        <div className="max-w-4xl text-left">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 text-[#66fcf1] text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-3 sm:mb-6">
            <span className="w-4 sm:w-6 h-[1px] bg-[#66fcf1]" />
            <span>{config.heroEyebrow}</span>
          </div>

          {/* Responsive Typography - Compact on mobile, massive on desktop */}
          <h1 className="font-heading text-white font-black text-3xl sm:text-6xl md:text-7xl lg:text-9xl tracking-tight sm:tracking-[-0.05em] leading-[0.98] sm:leading-[0.88] mb-3 sm:mb-8">
            <span className="block">{config.heroHeadlineLine1}</span>
            <span className="block gradient-text">{config.heroHeadlineGradient}</span>
            <span className="block">{config.heroHeadlineLine3}</span>
          </h1>

          {/* Narrative description */}
          <p className="text-[#b6c1c8] text-xs sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl mb-5 sm:mb-10 line-clamp-3 sm:line-clamp-none">
            {config.heroDescription}
          </p>

          {/* Native App Style Action Row on Mobile, Full on Desktop */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap mb-6 sm:mb-8">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                onExploreWork();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-full bg-[#66fcf1] text-[#05070b] text-xs sm:text-sm font-extrabold tracking-wider uppercase hover:shadow-[0_15px_45px_rgba(102,252,241,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>{config.heroCtaPrimaryText}</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>

            <button
              onClick={() => {
                if (onOpenAppModal) {
                  onOpenAppModal();
                } else {
                  window.open(config.connectPortalUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-full bg-white/[0.06] text-white border border-[#66fcf1]/40 hover:border-[#66fcf1] hover:text-[#66fcf1] text-xs sm:text-sm font-bold tracking-wider uppercase backdrop-blur-md transition-all duration-300"
            >
              <span>{config.heroCtaSecondaryText}</span>
              <span className="text-[#66fcf1]">📱</span>
            </button>

            <button
              onClick={onOpenTestShotModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-semibold text-[#aeb9c1] hover:text-white border border-white/10 hover:border-white/30 bg-black/40 transition-all duration-300"
            >
              <span className="text-[#66fcf1]">⚡</span>
              <span>{config.heroCtaTertiaryText}</span>
            </button>
          </div>

          {/* Mobile Native App Feature Badges */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[10px] sm:text-xs font-mono text-[#9daab4]">
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1]" />
              24h Turnaround
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00df81]" />
              4K/8K Plates
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1]" />
              100% In-House QA
            </span>
          </div>
        </div>
      </div>

      {/* Floating Vertical VFX Pillars (Desktop) */}
      <div className="hidden lg:flex absolute right-12 bottom-24 z-10 flex-col gap-2.5 text-right font-heading text-white/25 text-xs font-bold tracking-[0.3em]">
        <span className="hover:text-[#66fcf1] transition-colors">01 // ROTO</span>
        <span className="hover:text-[#66fcf1] transition-colors">02 // PAINT</span>
        <span className="hover:text-[#66fcf1] transition-colors">03 // CLEANUP</span>
        <span className="hover:text-[#66fcf1] transition-colors">04 // VFX</span>
      </div>

      {/* Video Audio & Playback Controls Floating Toolbar */}
      <div className="absolute top-18 sm:top-24 right-3 sm:right-12 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs text-white/80 shadow-lg select-none">
        {shuffleNotice && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/40 text-[#66fcf1] text-[10px] font-mono animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1] animate-ping" />
            <span>{shuffleNotice}</span>
          </div>
        )}

        {/* Playback Controls strictly conditioned on mode */}
        {isPlaylistMode ? (
          /* PLAYLIST MODE: Forward button skips to next track with zero buffer */
          <>
            <button
              onClick={handleForward}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold transition-all bg-[#66fcf1] text-[#05070b] hover:bg-[#52e5d9] shadow-[0_0_15px_rgba(102,252,241,0.4)] active:scale-95 cursor-pointer ${
                isForwarding ? 'scale-105 ring-2 ring-white/50' : ''
              }`}
              title="Play Next Video in Playlist (No Buffer)"
            >
              <SkipForward className={`w-3.5 h-3.5 ${isForwarding ? 'translate-x-0.5' : ''}`} />
              <span>FORWARD</span>
            </button>

            <button
              onClick={handleShuffle}
              className={`p-1 text-white/70 hover:text-[#66fcf1] transition-colors focus:outline-none ${isShuffling ? 'animate-spin text-[#66fcf1]' : ''}`}
              title="Shuffle Playlist Videos"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          /* SINGLE REEL MODE: Loop button loops the same video continuously */
          <button
            onClick={handleLoopClick}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold transition-all bg-[#66fcf1]/20 border border-[#66fcf1] text-[#66fcf1] hover:bg-[#66fcf1] hover:text-[#05070b] shadow-[0_0_15px_rgba(102,252,241,0.25)] active:scale-95 cursor-pointer"
            title="Loop this single showreel continuously"
          >
            <Repeat className="w-3.5 h-3.5 text-[#66fcf1]" />
            <span>LOOP</span>
          </button>
        )}

        <div className="w-[1px] h-3 bg-white/20" />

        <button
          onClick={togglePlay}
          className="p-1 hover:text-[#66fcf1] transition-colors focus:outline-none"
          title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
        >
          {isPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        </button>

        <div className="w-[1px] h-3 bg-white/20" />
        
        <button
          onClick={toggleMute}
          className="p-1 hover:text-[#66fcf1] transition-colors focus:outline-none flex items-center gap-1"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#66fcf1]" />}
          <span className="text-[9px] sm:text-[10px] font-mono">{isMuted ? 'MUTED' : 'ON'}</span>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="hidden sm:flex absolute bottom-8 left-4 sm:left-12 z-10 items-center gap-3 text-[10px] tracking-[0.25em] text-[#87949d] uppercase font-bold">
        <span className="h-[1px] bg-[#66fcf1] animate-pulse-line" />
        <span>SCROLL TO EXPLORE</span>
      </div>
    </section>
  );
};

