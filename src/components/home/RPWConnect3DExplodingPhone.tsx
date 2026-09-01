import React, { useState, useRef, useEffect } from 'react';
import { 
  motion, 
  useScroll, 
  useSpring,
  AnimatePresence 
} from 'motion/react';
import { 
  Lock, 
  Eye, 
  Clock, 
  Video, 
  UploadCloud, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Radio, 
  ArrowUpRight,
  Download,
  AlertTriangle,
  PenTool,
  RotateCcw,
  Play,
  Pause,
  Sliders,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Layers,
  Activity,
  BarChart3,
  Flame,
  FileCheck
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { RotoLogo } from '../RotoLogo';

export const RPWConnect3DExplodingPhone: React.FC = () => {
  const { config } = useSiteConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress within this 3D viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Ultra-smooth spring physics for fluid 60fps 3D motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001
  });

  // Manual interactive scrub & autoplay controls
  const [manualProgress, setManualProgress] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  // Auto-play demo loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setManualProgress((prev) => {
          const current = prev ?? 0;
          if (current >= 1) return 0;
          return Number((current + 0.006).toFixed(4));
        });
      }, 25);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync scroll or manual scrub to currentProgress state
  useEffect(() => {
    if (manualProgress !== null) {
      setCurrentProgress(manualProgress);
    } else {
      const unsubscribe = smoothProgress.on('change', (v) => {
        setCurrentProgress(v);
      });
      return () => unsubscribe();
    }
  }, [manualProgress, smoothProgress]);

  // 3-Phase Logic:
  // Phase 1 (0.00 - 0.15): Single Master Mobile (Intact)
  // Phase 2 (0.15 - 0.78): 3D Explosive expansion of all UI feature cards
  // Phase 3 (0.78 - 1.00): Implode back into single phone -> Reveals glowing RPW Logo & Explore Portal Link
  
  // Parabolic explode factor peaking around 0.50
  const explodeFactor = Math.sin(Math.min(Math.max((currentProgress - 0.12) / 0.66, 0), 1) * Math.PI);
  const isImplodedEnd = currentProgress > 0.82;

  // Staggered pop factors for each card
  const getCardPop = (delay: number) => {
    const raw = (currentProgress - delay) / 0.55;
    const clamped = Math.min(Math.max(raw, 0), 1);
    return Math.sin(clamped * Math.PI);
  };

  const popCard1 = getCardPop(0.14); // Review / Annotation (Top Left)
  const popCard2 = getCardPop(0.18); // Shot Tracker Bars (Top Right)
  const popCard3 = getCardPop(0.22); // 10GB Vault (Bottom Left)
  const popCard4 = getCardPop(0.26); // Live Bidding (Bottom Right)
  const popCard5 = getCardPop(0.20); // Forensic Watermark (Top Center)

  const portalUrl = config.connectPortalUrl || 'https://app.rotopaintwala.com/';

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[300vh] sm:min-h-[360vh] w-full bg-[#05030a] text-white selection:bg-[#00df81] selection:text-black overflow-clip"
    >
      {/* Pinned 3D Stage Screen */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-3 sm:px-8 py-5 z-10">
        
        {/* Organic Nebula Ambient Lighting (Matching user's reference image 16685596_5781528.jpg) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Top-Left Deep Violet Blob */}
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#7928ca]/35 via-[#4338ca]/25 to-transparent blur-[130px]" />
          
          {/* Top-Right Glowing Purple Sphere Orb */}
          <div className="absolute top-12 -right-20 w-[380px] h-[380px] rounded-full bg-gradient-to-bl from-[#d946ef]/40 via-[#8b5cf6]/25 to-transparent blur-[100px] opacity-80" />
          
          {/* Bottom-Right Cyan/Emerald Ambient Wave */}
          <div className="absolute -bottom-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-[#00df81]/25 via-[#06b6d4]/20 to-transparent blur-[140px]" />
          
          {/* Bottom-Left Midnight Indigo Base */}
          <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-[#1e1b4b]/40 blur-[150px]" />
          
          {/* Organic Floating Spheres (Directly matching reference image geometry) */}
          <div className="hidden lg:block absolute top-24 right-32 w-28 h-28 rounded-full bg-gradient-to-b from-[#c084fc] to-[#6366f1] opacity-70 shadow-[0_0_50px_rgba(192,132,252,0.4)] pointer-events-none" />
          <div className="hidden lg:block absolute bottom-28 left-20 w-20 h-20 rounded-full bg-gradient-to-tr from-[#00df81] to-[#38bdf8] opacity-60 shadow-[0_0_40px_rgba(0,223,129,0.3)] pointer-events-none" />
          <div className="hidden sm:block absolute top-1/2 left-10 w-12 h-12 rounded-full bg-[#ec4899]/50 blur-[2px]" />
          
          {/* Subtle micro cosmic stars */}
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-white/60 blur-[0.5px]" />
          <div className="absolute top-3/4 left-1/3 w-2 h-2 rounded-full bg-[#00df81]/70 blur-[0.5px]" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-cyan-300/80 blur-[0.5px]" />
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-purple-300/60 blur-[0.5px]" />
        </div>

        {/* Top Control Bar & Live Phase Indicator */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 max-w-6xl mx-auto w-full pt-1">
          {/* Left Title & Status */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00df81] shadow-[0_0_8px_#00df81] animate-ping" />
              <span className="text-[10px] sm:text-xs font-mono font-black text-[#00df81] uppercase tracking-widest">
                RPW-CONNECT • 3D EXPLODING PIPELINE
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-mono text-white/90 font-bold">
              {currentProgress < 0.15 && '1. MASTER MOBILE UI (IN-APP OVERVIEW)'}
              {currentProgress >= 0.15 && currentProgress < 0.45 && '2. 3D EXPLODING: ANNOTATION & LIVE BIDDING'}
              {currentProgress >= 0.45 && currentProgress < 0.78 && '3. 3D EXPLODING: 10GB VAULT & SHOT TRACKER'}
              {currentProgress >= 0.78 && '4. COLLAPSED: EXPLORE RPW-CONNECT APP'}
            </p>
          </div>

          {/* Interactive Scrubbing & Auto-Play Controller */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#0f0a1c]/90 backdrop-blur-xl border border-purple-500/20 px-3.5 py-1.5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#00df81] hover:bg-[#00c974] text-[#05070b] font-mono text-[11px] font-black uppercase transition-all shadow-[0_0_15px_rgba(0,223,129,0.4)]"
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'AUTO-DEMO'}</span>
            </button>

            {/* Visual Scrubber Slider */}
            <div className="flex items-center gap-2">
              <Sliders className="w-3 h-3 text-[#a78bfa]" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.005"
                value={currentProgress}
                onChange={(e) => {
                  setIsPlaying(false);
                  setManualProgress(parseFloat(e.target.value));
                }}
                className="w-20 sm:w-32 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00df81]"
              />
              <span className="text-[10px] font-mono text-[#00df81] font-bold w-8 text-right">
                {Math.round(currentProgress * 100)}%
              </span>
            </div>

            {manualProgress !== null && (
              <button
                onClick={() => {
                  setManualProgress(null);
                  setIsPlaying(false);
                }}
                title="Sync back to page scroll"
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#87949c] hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* 3D PERSPECTIVE ENVIRONMENT STAGE */}
        <div 
          className="relative z-20 flex-1 flex items-center justify-center w-full max-w-6xl mx-auto my-auto"
          style={{ perspective: '1500px' }}
        >
          {/* CENTRAL 3D MOBILE PHONE */}
          <motion.div
            className="relative z-30 transition-all duration-150 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: `
                rotateY(${explodeFactor * -14}deg) 
                rotateX(${explodeFactor * 8}deg) 
                scale(${isImplodedEnd ? 1.06 : 1 + explodeFactor * 0.04})
              `,
            }}
          >
            {/* Phone Outer Chassis (Sleek dark finish with subtle purple neon rim matching reference image) */}
            <div className="w-[270px] sm:w-[310px] md:w-[330px] h-[540px] sm:h-[590px] md:h-[620px] rounded-[48px] p-3.5 bg-gradient-to-b from-[#1f1533] via-[#0e081c] to-[#06040d] border-[2.5px] border-[#582b8c]/60 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(138,43,226,0.25)] relative overflow-hidden flex flex-col">
              
              {/* Dynamic Island / Speaker */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4.5 rounded-full bg-black border border-white/10 z-50 flex items-center justify-between px-3">
                <span className="w-2 h-2 rounded-full bg-[#151515] border border-white/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00df81] shadow-[0_0_5px_#00df81]" />
              </div>

              {/* Chassis side button accents */}
              <div className="absolute -left-[4px] top-28 w-[3px] h-9 rounded-l bg-purple-400/40" />
              <div className="absolute -left-[4px] top-40 w-[3px] h-11 rounded-l bg-purple-400/40" />
              <div className="absolute -right-[4px] top-32 w-[3px] h-14 rounded-r bg-purple-400/40" />

              {/* Phone Inner Screen Glass */}
              <div className="w-full h-full rounded-[38px] bg-[#090514] overflow-hidden relative flex flex-col justify-between border border-white/10 pt-7 pb-3.5 px-3">
                
                {/* STATE A: MASTER PHONE UI (During initial and exploding phases) */}
                {!isImplodedEnd ? (
                  <div className="flex-1 flex flex-col justify-between space-y-2 text-left font-mono">
                    
                    {/* User Profile & Vendor Bar (From screenshot) */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7928ca] to-[#00df81] p-[1.5px] flex items-center justify-center">
                          <div className="w-full h-full bg-[#0c0817] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                            TF
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-white leading-none">tom</div>
                          <div className="text-[8px] text-[#00df81] font-bold">VENDOR • @TOM</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[8px] font-bold">
                          🔔 2
                        </span>
                      </div>
                    </div>

                    {/* Featured Reel Card (From screenshot) */}
                    <div className="relative rounded-xl overflow-hidden bg-black border border-white/15 aspect-[16/9] shadow-md group">
                      <img
                        src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop"
                        alt="Reel 2"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-2">
                        <div className="flex items-center justify-between text-[9px] text-white font-bold">
                          <span>Reel 2 • Nail Paint Black Fxtudio</span>
                          <span className="text-[#87949c]">1/2</span>
                        </div>
                        <div className="flex items-center gap-1 pt-0.5">
                          <span className="px-2 py-0.5 rounded bg-[#3b82f6] text-[8px] text-white font-bold">
                            VISIT
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[7px] text-[#9daab4]">
                            AD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Active Project Groups List (From screenshot) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[8px] text-[#87949c] font-bold uppercase tracking-wider">
                        <span>ACTIVE GROUPS</span>
                        <span className="text-[#00df81]">3 PROJECTS • 55%</span>
                      </div>

                      {/* Item 1: Bidding Hub LIVE */}
                      <div className="p-2 rounded-xl bg-purple-950/30 border border-[#00df81]/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#00df81]/20 text-[#00df81] text-[9px] font-bold flex items-center justify-center">
                            BH
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-white flex items-center gap-1">
                              <span>Bidding Hub</span>
                              <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-[#00df81] text-[7px]">LIVE</span>
                            </div>
                            <div className="text-[8px] text-[#87949c] truncate w-28">tom: Accepted bid • 15 artists</div>
                          </div>
                        </div>
                        <span className="text-[8px] text-[#00df81]">11:54 AM</span>
                      </div>

                      {/* Item 2: RPW Demo */}
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-[9px] font-bold flex items-center justify-center">
                            RD
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-white">RPW Demo</div>
                            <div className="text-[8px] text-[#87949c]">84% Progress</div>
                          </div>
                        </div>
                        <span className="text-[8px] text-[#87949c]">12:07 PM</span>
                      </div>

                      {/* Item 3: TEST for Vendor */}
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 text-[9px] font-bold flex items-center justify-center">
                            TF
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-white">TEST for Vendor</div>
                            <div className="text-[8px] text-[#87949c]">43% Progress</div>
                          </div>
                        </div>
                        <span className="text-[8px] text-[#87949c]">12:02 PM</span>
                      </div>
                    </div>

                    {/* Bottom Mobile Tab Bar (Matching screenshot) */}
                    <div className="pt-1.5 border-t border-white/10 flex items-center justify-between px-1 text-[7px] text-[#87949c] font-bold">
                      <div className="flex flex-col items-center">
                        <span>👤</span>
                        <span>PROFILE</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span>📞</span>
                        <span>CALL</span>
                      </div>
                      <div className="flex flex-col items-center text-[#00df81]">
                        <span>🗂️</span>
                        <span>PROJECTS</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span>💳</span>
                        <span>WALLET</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span>❓</span>
                        <span>HELP</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* STATE B: FINAL IMPLODED RPW PORTAL LAUNCH CARD */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-2 space-y-3 animate-in fade-in zoom-in-95 duration-500">
                    {/* Glowing RPW Logo */}
                    <div className="relative">
                      <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-3xl bg-[#00df81]/15 border-2 border-[#00df81] flex items-center justify-center shadow-[0_0_40px_rgba(0,223,129,0.6)]">
                        <RotoLogo size="lg" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00df81] animate-ping" />
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="font-heading font-black text-lg sm:text-xl text-white tracking-tight uppercase">
                        RPW-CONNECT
                      </h4>
                      <p className="text-[9px] font-mono text-[#00df81] font-bold tracking-widest uppercase">
                        NEXT-GEN VFX PIPELINE
                      </p>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-black/60 border border-white/10 text-[8.5px] font-mono text-[#9daab4] space-y-1 text-left w-full">
                      <div className="flex items-center gap-1.5 text-white">
                        <CheckCircle2 className="w-3 h-3 text-[#00df81] shrink-0" />
                        <span>Air-Gapped File Vault (10 GB)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white">
                        <CheckCircle2 className="w-3 h-3 text-[#00df81] shrink-0" />
                        <span>Dynamic Forensic Watermarking</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white">
                        <CheckCircle2 className="w-3 h-3 text-[#00df81] shrink-0" />
                        <span>Multi-Studio Live Bandwidth</span>
                      </div>
                    </div>

                    {/* Master Direct Link */}
                    <a
                      href={portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-[#00df81] to-[#00b86b] hover:from-[#00c974] hover:to-[#00df81] text-[#05070b] font-heading font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(0,223,129,0.7)] hover:scale-105 transition-all flex items-center justify-center gap-1.5 group"
                    >
                      <span>EXPLORE RPW-CONNECT APP</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    <button
                      onClick={() => setManualProgress(0.45)}
                      className="text-[8.5px] font-mono text-[#87949c] hover:text-white underline pt-0.5"
                    >
                      ↺ Replay 3D Explosion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* 3D FLOATING EXPLODING CARDS (Popping out seamlessly around the phone) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            
            {/* CARD 1: TOP-LEFT • IN-APP ANNOTATION & REVIEW (Directly from Review page.png) */}
            <motion.div
              className="absolute z-40 transition-all duration-200"
              style={{
                pointerEvents: popCard1 > 0.25 ? 'auto' : 'none',
                opacity: popCard1,
                transform: `
                  translateX(${popCard1 * -310}px) 
                  translateY(${popCard1 * -165}px) 
                  translateZ(${popCard1 * 130}px) 
                  rotateZ(${popCard1 * -6}deg) 
                  rotateY(${popCard1 * 18}deg)
                  scale(${0.75 + popCard1 * 0.25})
                `,
              }}
            >
              <div className="w-[250px] sm:w-[310px] rounded-3xl p-3.5 bg-[#0f091f]/95 backdrop-blur-2xl border-2 border-[#00df81]/60 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(0,223,129,0.25)] space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-[#00df81]" />
                    <span className="text-xs font-mono font-bold text-white uppercase">In-App Review</span>
                  </div>
                  <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-[#00df81]/20 text-[#00df81] font-bold">
                    FRAME 104
                  </span>
                </div>

                {/* Doodle Snapshot */}
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-white/15">
                  <img
                    src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=600&auto=format&fit=crop"
                    alt="Review Annotation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-[#00df81] text-[#00df81] text-[8px] font-mono font-bold">
                    ✏️ SHIFT KARDO (2 strokes)
                  </div>
                </div>

                <div className="space-y-1 text-[9px] font-mono text-[#9daab4]">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">5 Frame Comments</span>
                    <span className="text-[#00df81]">Frame-Accurate</span>
                  </div>
                  <div className="flex items-center gap-1 pt-0.5">
                    <span className="px-2 py-1 rounded bg-[#3b82f6] text-white text-[8px] font-bold">
                      DOWNLOAD (WM)
                    </span>
                    <span className="px-2 py-1 rounded bg-white/10 text-white text-[8px]">
                      CLEAN COPY
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARD 2: TOP-RIGHT • INLINE SHOT TRACKER & BANDWIDTH (Matching graphic bar cards in reference image) */}
            <motion.div
              className="absolute z-40 transition-all duration-200"
              style={{
                pointerEvents: popCard2 > 0.25 ? 'auto' : 'none',
                opacity: popCard2,
                transform: `
                  translateX(${popCard2 * 310}px) 
                  translateY(${popCard2 * -155}px) 
                  translateZ(${popCard2 * 110}px) 
                  rotateZ(${popCard2 * 5}deg) 
                  rotateY(${popCard2 * -16}deg)
                  scale(${0.75 + popCard2 * 0.25})
                `,
              }}
            >
              <div className="w-[250px] sm:w-[310px] rounded-3xl p-3.5 bg-[#0f091f]/95 backdrop-blur-2xl border-2 border-[#3b82f6]/60 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(59,130,246,0.25)] space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-[#3b82f6]" />
                    <span className="text-xs font-mono font-bold text-white uppercase">Live Shot Tracker</span>
                  </div>
                  <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-[#00df81]/20 text-[#00df81] font-bold animate-pulse">
                    32 ARTISTS ACTIVE
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[8.5px] font-mono">
                    <span className="text-[#87949c]">1700 / 4000 FRAMES</span>
                    <span className="text-[#3b82f6] font-bold">43%</span>
                  </div>
                  <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#3b82f6] to-[#00df81] w-[43%]" />
                  </div>
                </div>

                {/* Vertical Visual Bars matching reference image chart */}
                <div className="flex items-end justify-between h-14 bg-black/50 rounded-xl px-4 py-2 border border-white/5">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-8 bg-gradient-to-t from-purple-600 to-pink-500 rounded-full" />
                    <span className="text-[7px] text-[#87949c]">Shot 1</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-10 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-full" />
                    <span className="text-[7px] text-[#87949c]">Shot 2</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-5 bg-gradient-to-t from-emerald-600 to-[#00df81] rounded-full" />
                    <span className="text-[7px] text-[#87949c]">Shot 3</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-9 bg-gradient-to-t from-yellow-500 to-amber-300 rounded-full" />
                    <span className="text-[7px] text-[#87949c]">QC</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARD 3: BOTTOM-LEFT • 10GB LARGE FILE VAULT (Matching video player card in reference image) */}
            <motion.div
              className="absolute z-40 transition-all duration-200"
              style={{
                pointerEvents: popCard3 > 0.25 ? 'auto' : 'none',
                opacity: popCard3,
                transform: `
                  translateX(${popCard3 * -310}px) 
                  translateY(${popCard3 * 165}px) 
                  translateZ(${popCard3 * 100}px) 
                  rotateZ(${popCard3 * 4}deg) 
                  rotateY(${popCard3 * 15}deg)
                  scale(${0.75 + popCard3 * 0.25})
                `,
              }}
            >
              <div className="w-[250px] sm:w-[310px] rounded-3xl p-3.5 bg-[#0f091f]/95 backdrop-blur-2xl border-2 border-purple-500/50 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(168,85,247,0.25)] space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase">10GB File Vault</span>
                  </div>
                  <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                    3-DAY AUTO SHRED
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-black/60 border border-purple-500/30 space-y-1">
                  <div className="flex justify-between text-[9.5px] font-mono font-bold">
                    <span className="text-white">For vfx.mp4</span>
                    <span className="text-[#00df81] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2D 23H LEFT
                    </span>
                  </div>
                  <p className="text-[8.5px] font-mono text-[#87949c]">46.0 MB • MOV / EXR / RAW</p>
                </div>

                <p className="text-[8.5px] font-mono text-[#9daab4] leading-tight">
                  🔒 Zero residual cloud leak. Files permanently shredded after 3 days.
                </p>
              </div>
            </motion.div>

            {/* CARD 4: BOTTOM-RIGHT • LIVE BIDDING HUB & STATUS (Matching STATUS card with ribbon in reference image) */}
            <motion.div
              className="absolute z-40 transition-all duration-200"
              style={{
                pointerEvents: popCard4 > 0.25 ? 'auto' : 'none',
                opacity: popCard4,
                transform: `
                  translateX(${popCard4 * 310}px) 
                  translateY(${popCard4 * 165}px) 
                  translateZ(${popCard4 * 120}px) 
                  rotateZ(${popCard4 * -4}deg) 
                  rotateY(${popCard4 * -15}deg)
                  scale(${0.75 + popCard4 * 0.25})
                `,
              }}
            >
              <div className="w-[250px] sm:w-[310px] rounded-3xl p-3.5 bg-[#0f091f]/95 backdrop-blur-2xl border-2 border-[#00df81]/60 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(0,223,129,0.25)] space-y-2.5 relative overflow-hidden">
                
                {/* Decorative Bookmark Ribbon (Directly inspired by reference image) */}
                <div className="absolute top-0 right-5 w-6 h-8 bg-gradient-to-b from-[#38bdf8] to-[#818cf8] rounded-b-md shadow-md flex items-end justify-center pb-1">
                  <span className="w-2 h-2 rounded-full bg-white/80" />
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 pr-8">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#00df81]" />
                    <span className="text-xs font-mono font-bold text-white uppercase">STATUS: LIVE BID</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-black/60 border border-[#00df81]/30 space-y-1">
                  <div className="text-[9.5px] font-mono font-bold text-white">
                    New work for Cleanup
                  </div>
                  <div className="flex items-center justify-between text-[8.5px] font-mono">
                    <span className="text-yellow-400 font-bold">Budget: ₹ 200,000</span>
                    <span className="text-[#00df81] font-bold">15 Artists • 12hr</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[8.5px] font-mono text-[#00df81]">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Rapid artist allocation across studio collective</span>
                </div>
              </div>
            </motion.div>

            {/* CARD 5: TOP-CENTER • FORENSIC WATERMARK IDENTITY TAG */}
            <motion.div
              className="absolute z-40 transition-all duration-200"
              style={{
                pointerEvents: popCard5 > 0.25 ? 'auto' : 'none',
                opacity: popCard5,
                transform: `
                  translateY(${popCard5 * -270}px) 
                  translateZ(${popCard5 * 80}px) 
                  scale(${0.8 + popCard5 * 0.2})
                `,
              }}
            >
              <div className="px-4 py-2 rounded-full bg-[#120a24]/95 backdrop-blur-xl border-2 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.35)] flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span className="text-[9.5px] sm:text-xs font-mono font-bold text-white uppercase">
                  FORENSIC WATERMARK: <strong className="text-[#00df81]">tom@blackfx.net</strong> • IP: 192.168.1.104
                </span>
                <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                  [REDACTED-EMAIL]
                </span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom Helper Bar with Portal Link */}
        <div className="relative z-30 flex items-center justify-between max-w-6xl mx-auto w-full pt-2 border-t border-white/10 text-[11px] font-mono text-[#87949c]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#00df81] animate-bounce">↓</span>
            <span>Scroll or drag the slider to explode / collapse 3D features</span>
          </div>

          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-[#00df81] hover:underline flex items-center gap-1 font-bold"
          >
            <span>app.rotopaintwala.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};

