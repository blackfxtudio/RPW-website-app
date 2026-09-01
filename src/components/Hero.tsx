import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Volume2, VolumeX, Play, Pause, Edit3, Shuffle, SkipForward, Repeat } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface HeroProps {
  onExploreWork: () => void;
  onNavigateToPortfolio?: () => void;
  onOpenTestShotModal: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: any }) => void;
            onStateChange?: (event: { data: number; target: any }) => void;
          };
        }
      ) => {
        mute: () => void;
        unMute: () => void;
        playVideo: () => void;
        pauseVideo: () => void;
        seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
        isMuted: () => boolean;
        getPlayerState: () => number;
        loadVideoById: (id: string) => void;
        cueVideoById: (id: string) => void;
        loadPlaylist: (playlist: string | string[] | { list: string; listType?: 'playlist' | 'search' | 'user_uploads'; index?: number; startSeconds?: number }) => void;
        cuePlaylist: (playlist: string | string[] | { list: string; listType?: 'playlist' | 'search' | 'user_uploads'; index?: number; startSeconds?: number }) => void;
        setShuffle: (shuffle: boolean) => void;
        setLoop: (loop: boolean) => void;
        nextVideo: () => void;
        previousVideo: () => void;
        playVideoAt: (index: number) => void;
      };
      PlayerState?: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork, onNavigateToPortfolio, onOpenTestShotModal }) => {
  const { config, isEditorOpen, setActiveEditTarget } = useSiteConfig();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = useRef<any>(null);
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const isPlaylistMode = config.heroBgSourceType === 'playlist' && Boolean(config.heroBgPlaylistId);

  useEffect(() => {
    // Parallax mouse move effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      gridRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update video player if config ID / playlist settings change
  useEffect(() => {
    if (!playerRef.current) return;

    try {
      if (isPlaylistMode) {
        if (typeof playerRef.current.loadPlaylist === 'function') {
          playerRef.current.loadPlaylist({
            list: config.heroBgPlaylistId.trim(),
            listType: 'playlist',
            index: 0,
          });
          if (config.heroBgPlaylistShuffle) {
            playerRef.current.setShuffle(true);
          } else {
            playerRef.current.setShuffle(false);
          }
          playerRef.current.setLoop(true);
          playerRef.current.mute();
          playerRef.current.playVideo();
        }
      } else {
        if (typeof playerRef.current.loadVideoById === 'function') {
          playerRef.current.loadVideoById(config.heroBgVideoYouTubeId || 'P5vvOZRO9JU');
          playerRef.current.mute();
          playerRef.current.playVideo();
        }
      }
    } catch (e) {
      console.warn('Video update error', e);
    }
  }, [config.heroBgSourceType, config.heroBgVideoYouTubeId, config.heroBgPlaylistId, config.heroBgPlaylistShuffle, isPlaylistMode]);

  useEffect(() => {
    // Load YouTube IFrame API
    const loadYT = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };

      if (window.YT && window.YT.Player) {
        initPlayer();
      }
    };

    const initPlayer = () => {
      try {
        const origin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '*';
        const singleVideoId = config.heroBgVideoYouTubeId || 'P5vvOZRO9JU';
        const isPl = config.heroBgSourceType === 'playlist' && Boolean(config.heroBgPlaylistId);

        const playerOptions: any = {
          playerVars: {
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            autohide: 1,
            modestbranding: 1,
            mute: 1,
            loop: 1,
            rel: 0,
            enablejsapi: 1,
            disablekb: 1,
            fs: 0,
            origin: origin,
          },
          events: {
            onReady: (event: any) => {
              try {
                event.target.mute();
                setIsMuted(true);

                if (isPl) {
                  if (config.heroBgPlaylistShuffle) {
                    event.target.setShuffle(true);
                  }
                  event.target.setLoop(true);
                }

                event.target.playVideo();
                setIsPlaying(true);
              } catch (err) {
                console.warn('YT ready error', err);
              }
            },
            onStateChange: (event: any) => {
              if (window.YT?.PlayerState && event.data === window.YT.PlayerState.PLAYING) {
                setVideoLoaded(true);
              }

              // Continuous loop guarantee: when playback ends, loop playlist or replay single video
              if (event.data === 0 || (window.YT?.PlayerState && event.data === window.YT.PlayerState.ENDED)) {
                if (config.heroBgSourceType === 'playlist') {
                  try {
                    event.target.nextVideo();
                    event.target.playVideo();
                  } catch (e) {
                    try {
                      event.target.playVideoAt(0);
                    } catch (err) {}
                  }
                } else {
                  try {
                    event.target.seekTo(0, true);
                    event.target.playVideo();
                  } catch (err) {
                    console.warn('Loop reset error', err);
                  }
                }
              }
            },
          },
        };

        if (isPl) {
          playerOptions.playerVars.listType = 'playlist';
          playerOptions.playerVars.list = config.heroBgPlaylistId.trim();
        } else {
          playerOptions.videoId = singleVideoId;
          playerOptions.playerVars.playlist = singleVideoId;
        }

        playerRef.current = new window.YT!.Player('heroPlayer', playerOptions);
      } catch (err) {
        console.warn('YT init warning', err);
      }
    };

    loadYT();

    const fallbackTimer = setTimeout(() => {
      setVideoLoaded(true);
    }, 2500);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const toggleMute = () => {
    if (playerRef.current) {
      try {
        if (isMuted) {
          playerRef.current.unMute();
          setIsMuted(false);
        } else {
          playerRef.current.mute();
          setIsMuted(true);
        }
      } catch (err) {
        console.warn('Toggle mute error', err);
      }
    }
  };

  const togglePlay = () => {
    if (playerRef.current) {
      try {
        if (isPlaying) {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch (err) {
        console.warn('Toggle play error', err);
      }
    }
  };

  const handleNextVideo = () => {
    if (playerRef.current && typeof playerRef.current.nextVideo === 'function') {
      try {
        playerRef.current.nextVideo();
        playerRef.current.playVideo();
      } catch (e) {
        console.warn('Next video error', e);
      }
    }
  };

  return (
    <section
      ref={heroRef}
      id="rpw"
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16 px-4 sm:px-8 md:px-12 group"
    >
      {/* In-Place Visual Edit Overlay Trigger */}
      {isEditorOpen && (
        <div className="absolute top-24 left-6 z-40">
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
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#05070b] via-[#081622] to-[#002229] animate-gradient-flow" />

      {/* YouTube Background Video Container */}
      <div
        className={`absolute inset-0 z-[1] overflow-hidden pointer-events-none transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] scale-125 filter contrast-[1.08] saturate-[1.15]">
          <div id="heroPlayer" className="w-full h-full" />
        </div>

        {/* Ambient Dark VFX Gradients Overlay */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#05070b] via-[#05070b]/80 via-60% to-transparent" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#05070b] via-transparent to-[#05070b]/60" />
      </div>

      {/* Fallback Image Poster if Video is loading */}
      {!videoLoaded && config.heroBgImageFallback && (
        <div
          className="absolute inset-0 z-[1] bg-cover bg-center opacity-40"
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

      {/* Main Container Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 text-[#66fcf1] text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.25em] mb-6">
            <span className="w-6 h-[1px] bg-[#66fcf1]" />
            <span>{config.heroEyebrow}</span>
          </div>

          {/* Big Typography */}
          <h1 className="font-heading text-white font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[-0.05em] leading-[0.88] mb-8">
            <span className="block">{config.heroHeadlineLine1}</span>
            <span className="block gradient-text">{config.heroHeadlineGradient}</span>
            <span className="block">{config.heroHeadlineLine3}</span>
          </h1>

          {/* Narrative description */}
          <p className="text-[#b6c1c8] text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mb-10">
            {config.heroDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                onExploreWork();
              }}
              className="inline-flex items-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#66fcf1] text-[#05070b] text-xs sm:text-sm font-extrabold tracking-wider uppercase hover:shadow-[0_15px_45px_rgba(102,252,241,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>{config.heroCtaPrimaryText}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={config.connectPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-white/[0.04] text-white border border-white/20 hover:border-[#66fcf1] hover:text-[#66fcf1] text-xs sm:text-sm font-bold tracking-wider uppercase backdrop-blur-md transition-all duration-300"
            >
              <span>{config.heroCtaSecondaryText}</span>
              <span>→</span>
            </a>

            <button
              onClick={onOpenTestShotModal}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-xs font-semibold text-[#aeb9c1] hover:text-white border border-white/10 hover:border-white/30 bg-black/30 transition-all duration-300"
            >
              <span>{config.heroCtaTertiaryText}</span>
            </button>
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
      <div className="absolute top-24 right-4 sm:right-12 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs text-white/70">
        {/* Playlist & Loop Indicator Badge */}
        {isPlaylistMode && (
          <div className="flex items-center gap-1.5 pr-1.5 border-r border-white/15 text-[10px] font-mono text-[#66fcf1]">
            <Shuffle className="w-3 h-3 text-[#66fcf1] animate-pulse" />
            <span className="hidden sm:inline">SHUFFLE PLAYLIST</span>
          </div>
        )}

        <button
          onClick={togglePlay}
          className="p-1 hover:text-[#66fcf1] transition-colors focus:outline-none"
          title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {isPlaylistMode && (
          <button
            onClick={handleNextVideo}
            className="p-1 hover:text-[#66fcf1] transition-colors focus:outline-none"
            title="Skip to Next Playlist Video (Shuffle)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="w-[1px] h-3 bg-white/20" />
        
        <button
          onClick={toggleMute}
          className="p-1 hover:text-[#66fcf1] transition-colors focus:outline-none flex items-center gap-1.5"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#66fcf1]" />}
          <span className="text-[10px] font-mono">{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-4 sm:left-12 z-10 flex items-center gap-3 text-[10px] tracking-[0.25em] text-[#87949d] uppercase font-bold">
        <span className="h-[1px] bg-[#66fcf1] animate-pulse-line" />
        <span>SCROLL TO EXPLORE</span>
      </div>
    </section>
  );
};

