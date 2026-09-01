import React, { useState, useRef, useEffect } from 'react';
import { 
  motion, 
  useScroll, 
  useSpring,
  AnimatePresence 
} from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  ShieldCheck, 
  ExternalLink, 
  Radio, 
  Sparkles, 
  Zap, 
  UploadCloud, 
  PenTool, 
  PhoneCall, 
  Bell, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Maximize2,
  Volume2,
  VolumeX,
  FastForward,
  Upload,
  FileVideo,
  Layers
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

// Key chapter milestones matching the actual WhatsApp recording
interface Chapter {
  id: string;
  timeRange: [number, number]; // normalized 0.0 - 1.0
  timestampLabel: string;
  title: string;
  subtitle: string;
  category: string;
  color: string;
  badge: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 'overview',
    timeRange: [0.0, 0.20],
    timestampLabel: '00:00 - 00:25',
    title: 'Multi-Studio Chat & 84% Shot Tracker',
    subtitle: 'Track production frame milestones live (1398/1650 frames) with zero vendor leak.',
    category: 'STUDIO PIPELINE',
    color: '#00df81',
    badge: '1398/1650 FRAMES'
  },
  {
    id: 'vault',
    timeRange: [0.20, 0.45],
    timestampLabel: '00:26 - 01:05',
    title: '10GB Air-Gapped File Vault',
    subtitle: 'Transfer large EXR/MOV files (1shot.mov) with automated 3-day file shredding.',
    category: 'AIR-GAPPED STORAGE',
    color: '#a855f7',
    badge: 'AUTO-SHRED: 2D 19H'
  },
  {
    id: 'annotation',
    timeRange: [0.45, 0.68],
    timestampLabel: '01:06 - 01:25',
    title: 'Frame Annotation & Review Canvas',
    subtitle: 'Draw vector doodles directly on frames ("light change karo"), request clean copies.',
    category: 'QC & REVIEW',
    color: '#3b82f6',
    badge: 'FRAME 104 • 2 STROKES'
  },
  {
    id: 'calls',
    timeRange: [0.68, 0.88],
    timestampLabel: '01:26 - 01:45',
    title: 'Encrypted P2P Voice & Video Call',
    subtitle: 'Direct studio-to-vendor voice sync without exposing personal WhatsApp or numbers.',
    category: 'COMMUNICATION',
    color: '#00df81',
    badge: 'SECURE P2P • OPUS'
  },
  {
    id: 'portal',
    timeRange: [0.88, 1.0],
    timestampLabel: '01:46 - 02:00',
    title: 'Notification Center & Web App Portal',
    subtitle: 'Instant offline push alerts and instant handoff to desktop/mobile app.rotopaintwala.com.',
    category: 'RPW ECOSYSTEM',
    color: '#f59e0b',
    badge: 'APP.ROTOPAINTWALA.COM'
  }
];

export const RPWConnectScrollVideoScrubber: React.FC = () => {
  const { config } = useSiteConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default sample video or uploaded WhatsApp video
  const [videoSrc, setVideoSrc] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  );
  const [customVideoName, setCustomVideoName] = useState<string | null>(null);

  // Scroll Progress across the 400vh pinned stage
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Responsive 1.5x scroll spring with damping for buttery 60fps scrub
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    restDelta: 0.001
  });

  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.5);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [manualScrub, setManualScrub] = useState<number | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(120);

  // Sync scroll or manual scrub to video currentTime
  useEffect(() => {
    const updateTime = (progress: number) => {
      // Apply 1.5x pacing multiplier to progress
      const clamped = Math.max(0, Math.min(1, progress));
      setCurrentProgress(clamped);

      if (videoRef.current && videoRef.current.duration) {
        const targetTime = clamped * videoRef.current.duration;
        if (Math.abs(videoRef.current.currentTime - targetTime) > 0.04) {
          videoRef.current.currentTime = targetTime;
        }
      }
    };

    if (manualScrub !== null) {
      updateTime(manualScrub);
    } else {
      const unsubscribe = smoothProgress.on('change', (val) => {
        updateTime(val);
      });
      return () => unsubscribe();
    }
  }, [manualScrub, smoothProgress]);

  // Autoplay simulation at 1.5x rate
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setManualScrub((prev) => {
          const current = prev ?? 0;
          if (current >= 1) return 0;
          return Number((current + 0.006 * playbackSpeed).toFixed(4));
        });
      }, 25);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // File upload handler for custom WhatsApp video
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setCustomVideoName(file.name);
      setIsPlaying(false);
      setManualScrub(0);
    }
  };

  // Current active chapter
  const currentChapter = CHAPTERS.find(
    (ch) => currentProgress >= ch.timeRange[0] && currentProgress <= ch.timeRange[1]
  ) || CHAPTERS[0];

  const portalUrl = config.connectPortalUrl || 'https://app.rotopaintwala.com/';

  // Format progress as timestamp
  const formatTime = (progress: number) => {
    const totalSecs = Math.floor(progress * videoDuration);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const jumpToChapter = (chapter: Chapter) => {
    setIsPlaying(false);
    setManualScrub(chapter.timeRange[0]);
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[380vh] sm:min-h-[440vh] w-full bg-[#030206] text-white selection:bg-[#00df81] selection:text-black"
    >
      {/* Invisible container - Pinned Sticky Stage (Apple Mac Studio style) */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-3 sm:px-8 py-4 sm:py-6 z-20">
        
        {/* Apple-style Fluid Cosmic Gradient Backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#7928ca]/30 via-[#4338ca]/20 to-transparent blur-[140px]" />
          <div className="absolute -bottom-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-[#00df81]/25 via-[#00c6ff]/20 to-transparent blur-[160px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#1a082e]/25 blur-[180px]" />
        </div>

        {/* Top Header & Controller HUD */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 max-w-6xl mx-auto w-full pt-1">
          {/* Left Title & Status */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00df81] shadow-[0_0_10px_#00df81] animate-ping" />
              <span className="text-[10px] sm:text-xs font-mono font-black text-[#00df81] uppercase tracking-widest">
                RPW-CONNECT • APPLE-STYLE SCROLL SCRUBBER ({playbackSpeed}X SPEED)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-heading font-black text-white uppercase tracking-tight">
              <span>{currentChapter.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#a78bfa]">
                {currentChapter.badge}
              </span>
            </div>
          </div>

          {/* Interactive Scrubbing & Playback Controller */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#0d071a]/90 backdrop-blur-2xl border border-white/15 px-3 sm:px-4 py-1.5 rounded-2xl shadow-2xl">
            
            {/* Custom Video Upload Trigger */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase transition-all"
              title="Load custom screen recording MP4"
            >
              <Upload className="w-3 h-3 text-[#00df81]" />
              <span className="hidden sm:inline">{customVideoName ? 'CUSTOM VIDEO' : 'LOAD VIDEO'}</span>
            </button>

            {/* Play/Pause Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00df81] hover:bg-[#00c974] text-[#05070b] font-mono text-xs font-black uppercase transition-all shadow-[0_0_15px_rgba(0,223,129,0.4)]"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span className="hidden sm:inline">{isPlaying ? 'PAUSE' : 'AUTO-PLAY'}</span>
            </button>

            {/* Speed Selector (1.5x default) */}
            <button
              onClick={() => setPlaybackSpeed(playbackSpeed === 1.5 ? 2.0 : playbackSpeed === 2.0 ? 1.0 : 1.5)}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[10px] font-mono font-bold text-[#00df81]"
              title="Toggle Scrub Speed"
            >
              {playbackSpeed}x SPEED
            </button>

            {/* Scrub Slider */}
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#87949c]" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.002"
                value={currentProgress}
                onChange={(e) => {
                  setIsPlaying(false);
                  setManualScrub(parseFloat(e.target.value));
                }}
                className="w-20 sm:w-32 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00df81]"
              />
              <span className="text-[10px] font-mono text-[#00df81] font-bold w-12 text-right">
                {formatTime(currentProgress)}
              </span>
            </div>

            {manualScrub !== null && (
              <button
                onClick={() => {
                  setManualScrub(null);
                  setIsPlaying(false);
                }}
                title="Sync back to page scroll"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#87949c] hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Central Stage: Apple-style Mobile Device Showcase with Synchronized Dynamic Cards */}
        <div className="relative z-20 flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 w-full max-w-6xl mx-auto my-auto">
          
          {/* Left Context Card (Chapter Details & Capabilities) */}
          <div className="hidden md:flex flex-col justify-center space-y-4 max-w-xs w-full text-left font-mono">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00df81]">
                {currentChapter.category}
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-black text-white uppercase leading-tight">
                {currentChapter.title}
              </h3>
              <p className="text-xs text-[#9daab4] leading-relaxed pt-1">
                {currentChapter.subtitle}
              </p>
            </div>

            {/* Quick Chapter Selector Pills */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[9px] text-[#87949c] font-bold uppercase">DEMO CHAPTERS:</span>
              <div className="flex flex-col gap-1.5">
                {CHAPTERS.map((ch, idx) => {
                  const isActive = currentChapter.id === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => jumpToChapter(ch)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[10px] text-left transition-all border ${
                        isActive 
                          ? 'bg-[#00df81]/15 border-[#00df81] text-white font-bold shadow-[0_0_15px_rgba(0,223,129,0.2)]' 
                          : 'bg-white/5 border-white/5 text-[#87949c] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="truncate">{idx + 1}. {ch.title.split('&')[0]}</span>
                      <span className="text-[9px] font-mono opacity-60 ml-2">{ch.timestampLabel.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center Mobile UI Device Frame Overlay */}
          <div className="relative">
            {/* Ambient chassis neon aura */}
            <div className="absolute -inset-4 rounded-[60px] bg-gradient-to-b from-[#7928ca]/30 via-[#00df81]/20 to-transparent blur-2xl pointer-events-none" />

            {/* Mobile Chassis Mockup (iPhone Pro Bezel Design) */}
            <div className="relative w-[280px] sm:w-[310px] md:w-[330px] h-[560px] sm:h-[600px] md:h-[630px] rounded-[50px] p-3 bg-gradient-to-b from-[#241738] via-[#0f0919] to-[#040208] border-[3px] border-[#442866]/80 shadow-[0_30px_100px_rgba(0,0,0,0.95),0_0_50px_rgba(121,40,202,0.25)] flex flex-col justify-between overflow-hidden">
              
              {/* Dynamic Island / Top Camera Bezel */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-5 rounded-full bg-black border border-white/10 z-50 flex items-center justify-between px-3">
                <span className="w-2 h-2 rounded-full bg-[#181818] border border-white/20" />
                <span className="w-2 h-2 rounded-full bg-[#00df81] shadow-[0_0_6px_#00df81] animate-pulse" />
              </div>

              {/* Side Physical Buttons Accent */}
              <div className="absolute -left-[4px] top-28 w-[3px] h-9 rounded-l bg-purple-400/40" />
              <div className="absolute -left-[4px] top-40 w-[3px] h-12 rounded-l bg-purple-400/40" />
              <div className="absolute -right-[4px] top-32 w-[3px] h-14 rounded-r bg-purple-400/40" />

              {/* Screen Canvas / Video Container */}
              <div className="relative w-full h-full rounded-[40px] bg-black overflow-hidden border border-white/10 flex flex-col justify-between">
                
                {/* Embedded Video Element driven by scroll */}
                <video
                  ref={videoRef}
                  playsInline
                  muted={isMuted}
                  preload="auto"
                  onLoadedMetadata={(e) => {
                    setVideoDuration(e.currentTarget.duration || 120);
                  }}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  src={videoSrc}
                >
                  Your browser does not support the video tag.
                </video>

                {/* Simulated Screen Overlays matching user's app video screenshots */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3.5 pt-7 pb-3 bg-gradient-to-b from-black/40 via-transparent to-black/60">
                  
                  {/* Top Live Security Watermark Stamp */}
                  <div className="flex items-center justify-between text-[8px] font-mono text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <span className="text-[#00df81] font-bold">RPW-SECURE v2.4</span>
                    <span>IP: 192.168.1.104</span>
                  </div>

                  {/* Dynamic Floating HUD based on video time */}
                  <div className="space-y-2">
                    {currentProgress < 0.25 && (
                      <div className="p-2 rounded-xl bg-black/80 backdrop-blur-md border border-[#00df81]/40 text-left font-mono text-[9px] animate-in fade-in slide-in-from-bottom-2">
                        <div className="text-white font-bold flex items-center justify-between">
                          <span>RPW Demo</span>
                          <span className="text-[#00df81]">84% Progress</span>
                        </div>
                        <div className="text-[#87949c]">Shankar Paikra downloaded clean copy</div>
                      </div>
                    )}

                    {currentProgress >= 0.25 && currentProgress < 0.50 && (
                      <div className="p-2 rounded-xl bg-black/80 backdrop-blur-md border border-purple-500/40 text-left font-mono text-[9px] animate-in fade-in slide-in-from-bottom-2">
                        <div className="text-purple-300 font-bold flex items-center justify-between">
                          <span>10GB File Vault</span>
                          <span className="text-[#00df81]">Auto-Shred Active</span>
                        </div>
                        <div className="text-[#87949c]">1shot.mov (23.9 MB) • 2D 19H left</div>
                      </div>
                    )}

                    {currentProgress >= 0.50 && currentProgress < 0.75 && (
                      <div className="p-2 rounded-xl bg-black/80 backdrop-blur-md border border-blue-500/40 text-left font-mono text-[9px] animate-in fade-in slide-in-from-bottom-2">
                        <div className="text-blue-300 font-bold flex items-center justify-between">
                          <span>In-App Frame Review</span>
                          <span className="text-[#00df81]">Frame 104</span>
                        </div>
                        <div className="text-[#87949c]">Doodle (2 strokes) • light change karo</div>
                      </div>
                    )}

                    {currentProgress >= 0.75 && currentProgress < 0.90 && (
                      <div className="p-2 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-500/40 text-left font-mono text-[9px] animate-in fade-in slide-in-from-bottom-2">
                        <div className="text-emerald-300 font-bold flex items-center justify-between">
                          <span>Encrypted P2P Voice</span>
                          <span className="text-[#00df81]">Connected</span>
                        </div>
                        <div className="text-[#87949c]">Session token bound to database ID</div>
                      </div>
                    )}

                    {currentProgress >= 0.90 && (
                      <div className="p-2.5 rounded-2xl bg-black/90 backdrop-blur-md border-2 border-[#00df81] text-center font-mono text-[9px] space-y-2 animate-in zoom-in-95 pointer-events-auto">
                        <div className="text-white font-bold uppercase">RPW-Connect Live Portal</div>
                        <a
                          href={portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-2 rounded-xl bg-[#00df81] text-black font-black uppercase text-[10px] hover:bg-[#00c974]"
                        >
                          OPEN APP.ROTOPAINTWALA.COM ↗
                        </a>
                      </div>
                    )}

                    {/* Mini Timeline Scrub Progress on device */}
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#00df81] to-[#66fcf1]"
                        style={{ width: `${currentProgress * 100}%` }}
                      />
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* Right Live Security & Pipeline Badges */}
          <div className="hidden lg:flex flex-col justify-center space-y-3.5 max-w-xs w-full text-left font-mono">
            
            {/* Metric 1 */}
            <div className="p-3.5 rounded-2xl bg-[#0f081c]/90 backdrop-blur-xl border border-white/10 space-y-1 shadow-lg">
              <div className="flex items-center gap-2 text-[#00df81] text-xs font-bold uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Leak Guarantee</span>
              </div>
              <p className="text-[11px] text-[#9daab4]">
                Forensic watermarking embeds downloader name, IP, and timestamp on every frame.
              </p>
            </div>

            {/* Metric 2 */}
            <div className="p-3.5 rounded-2xl bg-[#0f081c]/90 backdrop-blur-xl border border-white/10 space-y-1 shadow-lg">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase">
                <UploadCloud className="w-4 h-4" />
                <span>10 GB Large File Vault</span>
              </div>
              <p className="text-[11px] text-[#9daab4]">
                Air-gapped server transfers with automated 3-day file shredding.
              </p>
            </div>

            {/* Direct Portal CTA Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00df81]/15 via-black to-[#7928ca]/20 border border-[#00df81]/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
                <span>Direct Web App</span>
                <span className="text-[#00df81]">PWA READY</span>
              </div>
              <p className="text-[11px] text-[#87949c]">
                Launch directly in your desktop or mobile browser.
              </p>
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-[#00df81] hover:bg-[#00c974] text-[#05070b] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_0_20px_rgba(0,223,129,0.4)]"
              >
                <span>OPEN RPW-CONNECT</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Interactive Scrubbing Timeline Track */}
        <div className="relative z-30 max-w-6xl mx-auto w-full pt-3 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#87949c]">
            
            {/* Scroll Instruction */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00df81] animate-ping" />
              <span>
                Scroll down to scrub video at <strong className="text-white">{playbackSpeed}x pacing</strong> — stage releases to normal scroll once video finishes
              </span>
            </div>

            {/* Quick Progress Indicator */}
            <div className="flex items-center gap-3">
              <span>PROGRESS: <strong className="text-[#00df81]">{Math.round(currentProgress * 100)}%</strong></span>
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#00df81] flex items-center gap-1 font-bold underline"
              >
                <span>app.rotopaintwala.com</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
