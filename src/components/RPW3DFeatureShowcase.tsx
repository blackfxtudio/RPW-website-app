import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  FolderGit2,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { RPW_FEATURES, FeatureCardItem } from '../data/rpwFeaturesData';
import { RPWAppModal } from './RPWAppModal';

export { RPW_FEATURES };
export type { FeatureCardItem };

interface RPW3DFeatureShowcaseProps {
  onOpenTestShotModal?: () => void;
}

export const RPW3DFeatureShowcase: React.FC<RPW3DFeatureShowcaseProps> = ({
  onOpenTestShotModal
}) => {
  const {
    config,
    isEditorOpen,
    setIsEditorOpen,
    setEditorMode,
    setActiveTab
  } = useSiteConfig();

  const totalFeatures = RPW_FEATURES.length;
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [speedInterval, setSpeedInterval] = useState<number>(
    config.rpwShowcaseRotateInterval || 3.5
  );
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  // Fullscreen preview modal
  const [previewFeature, setPreviewFeature] = useState<FeatureCardItem | null>(null);
  // App Download / Install Modal
  const [appModalOpen, setAppModalOpen] = useState<boolean>(false);

  // Responsive window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Synchronize speed interval from config
  useEffect(() => {
    if (config.rpwShowcaseRotateInterval) {
      setSpeedInterval(config.rpwShowcaseRotateInterval);
    }
  }, [config.rpwShowcaseRotateInterval]);

  // Next and Previous navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalFeatures);
  }, [totalFeatures]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalFeatures) % totalFeatures);
  }, [totalFeatures]);

  // Auto-play loop timer
  useEffect(() => {
    if (!isPlaying || isHovered || isDragging) return;

    const intervalMs = Math.max(1200, speedInterval * 1000);
    const timer = setInterval(() => {
      handleNext();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, isDragging, speedInterval, handleNext]);

  // Resolve feature details (Title, 1-2 line desc, Image) with Admin backend overrides
  const getResolvedFeature = useCallback(
    (feature: FeatureCardItem) => {
      const overrides = config.rpwFeatureOverrides?.[feature.id];
      const customImg = config.rpwFeatureImages?.[feature.id];

      return {
        ...feature,
        title: overrides?.title?.trim() ? overrides.title : feature.title,
        shortDesc: overrides?.shortDesc?.trim() ? overrides.shortDesc : feature.shortDesc,
        category: overrides?.category?.trim() ? overrides.category : feature.category,
        imageSrc: customImg || overrides?.imageSrc || feature.imageSrc,
        badgeText: overrides?.badgeText || feature.uiMockup.badgeText
      };
    },
    [config.rpwFeatureOverrides, config.rpwFeatureImages]
  );

  const activeFeatureResolved = useMemo(() => {
    return getResolvedFeature(RPW_FEATURES[activeIndex]);
  }, [activeIndex, getResolvedFeature]);

  // Touch & Mouse Drag handlers for smooth scrub
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    if (dragOffset < -35) {
      handleNext();
    } else if (dragOffset > 35) {
      handlePrev();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept keyboard shortcuts if the user is typing in an input, textarea, select, or contenteditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // UI Aspect Ratio 1310 : 1080 (1.21296)
  const cardAspectRatio = 1310 / 1080;

  // Dynamic Full-Width 3D perspective stretching all the way across the entire screen
  const getCardTransform = (index: number) => {
    let offset = (index - activeIndex) % totalFeatures;
    if (offset > totalFeatures / 2) offset -= totalFeatures;
    if (offset < -totalFeatures / 2) offset += totalFeatures;

    const absOffset = Math.abs(offset);
    const sign = Math.sign(offset);

    const isMobile = windowWidth < 640;
    const isTablet = windowWidth >= 640 && windowWidth < 1024;

    // Show up to 4 flanking cards on wide screens to fully span the viewport boundaries
    const maxVisibleOffset = isMobile ? 1 : isTablet ? 2 : 4;
    const isVisible = absOffset <= maxVisibleOffset;
    if (!isVisible) {
      return {
        style: { display: 'none' },
        zIndex: 0,
        opacity: 0,
        isCenter: false
      };
    }

    let translateX = 0;
    let translateY = 0;
    let translateZ = 0;
    let rotateY = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 30 - absOffset * 5;

    // Approximate card width based on screen size
    const baseCardHeight = isMobile ? 210 : isTablet ? 290 : 370;
    const baseCardWidth = baseCardHeight * cardAspectRatio;

    if (isMobile) {
      // Mobile View: Compact, no clipping
      if (offset === 0) {
        translateX = 0;
        translateY = 0;
        translateZ = 60;
        rotateY = 0;
        scale = 1.0;
        opacity = 1;
        zIndex = 50;
      } else if (absOffset === 1) {
        translateX = sign * Math.min(windowWidth * 0.44, 150);
        translateY = 4;
        translateZ = -30;
        rotateY = -sign * 18;
        scale = 0.82;
        opacity = 0.55;
        zIndex = 30;
      }
    } else if (isTablet) {
      // Tablet View: Spans smoothly
      if (offset === 0) {
        translateX = 0;
        translateY = 0;
        translateZ = 80;
        rotateY = 0;
        scale = 1.0;
        opacity = 1;
        zIndex = 50;
      } else if (absOffset === 1) {
        translateX = sign * (windowWidth * 0.32);
        translateY = 8;
        translateZ = -40;
        rotateY = -sign * 22;
        scale = 0.84;
        opacity = 0.78;
        zIndex = 40;
      } else if (absOffset === 2) {
        translateX = sign * (windowWidth * 0.58);
        translateY = 16;
        translateZ = -100;
        rotateY = -sign * 35;
        scale = 0.68;
        opacity = 0.45;
        zIndex = 30;
      }
    } else {
      // Desktop / Widescreen Full-Width Fit: Stretches right to the left and right screen borders
      if (offset === 0) {
        translateX = 0;
        translateY = 0;
        translateZ = 100;
        rotateY = 0;
        scale = 1.0;
        opacity = 1;
        zIndex = 50;
      } else if (absOffset === 1) {
        // Step 1: Flank 1
        translateX = sign * Math.max(baseCardWidth * 0.70, windowWidth * 0.25);
        translateY = 8;
        translateZ = -40;
        rotateY = -sign * 24;
        scale = 0.85;
        opacity = 0.88;
        zIndex = 40;
      } else if (absOffset === 2) {
        // Step 2: Flank 2
        translateX = sign * Math.max(baseCardWidth * 1.35, windowWidth * 0.48);
        translateY = 18;
        translateZ = -120;
        rotateY = -sign * 38;
        scale = 0.70;
        opacity = 0.65;
        zIndex = 30;
      } else if (absOffset === 3) {
        // Step 3: Flank 3
        translateX = sign * Math.max(baseCardWidth * 1.95, windowWidth * 0.70);
        translateY = 28;
        translateZ = -200;
        rotateY = -sign * 48;
        scale = 0.56;
        opacity = 0.42;
        zIndex = 20;
      } else if (absOffset === 4) {
        // Step 4: Reaching outer viewport boundary (Left & Right yellow margins fully eliminated)
        translateX = sign * Math.max(baseCardWidth * 2.50, windowWidth * 0.88);
        translateY = 38;
        translateZ = -280;
        rotateY = -sign * 56;
        scale = 0.46;
        opacity = 0.25;
        zIndex = 10;
      }
    }

    return {
      style: {
        transform: `perspective(1300px) translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        zIndex,
        opacity,
        transition: isDragging
          ? 'none'
          : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease-out'
      },
      isCenter: offset === 0,
      offset
    };
  };

  return (
    <section
      id="rpw-connect-space-section"
      className="relative w-full py-6 sm:py-8 md:py-10 bg-[#03060a] overflow-hidden select-none border-t border-b border-white/10 font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      {/* Dynamic Atmospheric Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#00df81]/12 blur-[260px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[320px] rounded-full bg-[#66fcf1]/10 blur-[220px] pointer-events-none" />
      <div className="absolute bottom-4 right-1/4 w-[450px] h-[260px] rounded-full bg-[#3b82f6]/10 blur-[200px] pointer-events-none" />

      {/* Cyber Grid Matrix */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293714_1px,transparent_1px),linear-gradient(to_bottom,#1f293714_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_90%_80%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Main Content Container - Fit to Full Width */}
      <div className="w-full relative z-10 flex flex-col items-center space-y-4 sm:space-y-6 px-0">
        
        {/* Header Title Section with comfortable breathing room */}
        <div className="text-center space-y-1.5 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#00df81]/10 border border-[#00df81]/30 text-[#00df81] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RPW-CONNECT CLOUD PIPELINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-sans">
            PRODUCTION MATRIX & TOOLS
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-white/70 font-medium max-w-2xl mx-auto leading-relaxed">
            Experience our high-security studio platform built for multi-facility roto, paint, and VFX dispatching.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* FIT-TO-WIDTH 3D STAGE - RATIO 1310 x 1080 PX EXACT BOUNDARY MATCH        */}
        {/* ========================================================================= */}
        <div
          className="relative w-full h-[230px] sm:h-[310px] md:h-[380px] lg:h-[420px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing touch-none px-0"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Responsive 3D Carousel Stage - Positioned at true center, sized by 1310:1080 aspect ratio */}
          <div className="relative w-full h-full flex items-center justify-center [perspective:1300px]">
            {RPW_FEATURES.map((rawFeature, idx) => {
              const feature = getResolvedFeature(rawFeature);
              const { style, isCenter } = getCardTransform(idx);

              return (
                <div
                  key={feature.id}
                  onClick={() => {
                    if (isCenter) {
                      setPreviewFeature(feature);
                    } else {
                      setActiveIndex(idx);
                    }
                  }}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[210px] sm:h-[290px] md:h-[350px] lg:h-[390px] aspect-[1310/1080] rounded-[14px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden cursor-pointer transition-shadow duration-300 ${
                    isCenter ? 'ring-1 ring-white/40' : ''
                  }`}
                  style={{
                    ...style,
                    boxShadow: isCenter
                      ? `0 20px 60px rgba(0,0,0,0.95), 0 0 35px ${feature.glowColor}`
                      : '0 12px 35px rgba(0,0,0,0.85)'
                  }}
                >
                  {/* Outer Glossy Translucent Container matching 1310:1080 App Frame */}
                  <div className="relative w-full h-full bg-[#050b12]/95 backdrop-blur-2xl border border-white/25 rounded-[14px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden p-1 sm:p-1.5 flex flex-col justify-center">
                    
                    {/* Inner 1310 x 1080 Pixel-Perfect App Frame */}
                    <div className="relative w-full h-full rounded-[11px] sm:rounded-[17px] md:rounded-[21px] overflow-hidden bg-[#020509] flex items-center justify-center border border-white/15">
                      <img
                        src={feature.imageSrc || undefined}
                        alt={feature.title}
                        className="w-full h-full object-fill sm:object-cover object-center transition-transform duration-500 hover:scale-[1.01]"
                        loading="lazy"
                        draggable={false}
                      />

                      {/* Glossy Top Edge Specular Reflection */}
                      <div className="absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />

                      {/* Admin In-Place Quick Edit Trigger */}
                      {isEditorOpen && isCenter && (
                        <div className="absolute top-2.5 right-2.5 z-30">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab('rpw-connect');
                              setEditorMode('dashboard');
                              setIsEditorOpen(true);
                            }}
                            className="px-2 py-1 rounded-lg bg-[#00df81] text-black font-mono font-bold text-[9px] sm:text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xl hover:bg-white transition-all"
                          >
                            <FolderGit2 className="w-3 h-3" />
                            <span>Edit in CMS</span>
                          </button>
                        </div>
                      )}

                      {/* Fullscreen Magnify Hint for Center Card */}
                      {isCenter && (
                        <div className="absolute bottom-2 right-2 z-20">
                          <div className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white/70 hover:text-white shadow-lg">
                            <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ULTRA-GLOSSY TRANSLUCENT CAPSULE PLAYER WITH PROMINENT APP ICON LAUNCHER  */}
        {/* ========================================================================= */}
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4">
          <div className="relative rounded-2xl sm:rounded-full backdrop-blur-2xl bg-black/75 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2.5 sm:px-5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
            
            {/* Left: Transport Controls (Prev, Play/Pause, Next) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <button
                onClick={handlePrev}
                aria-label="Previous Feature"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white/80 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <SkipBack className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pause Auto-Scroll' : 'Play Auto-Scroll'}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-black font-black transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{
                  backgroundColor: '#00df81',
                  boxShadow: '0 0 20px rgba(0, 223, 129, 0.55)'
                }}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                aria-label="Next Feature"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white/80 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <SkipForward className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Center: Title & 2-Line Description of Active Feature */}
            <div className="flex-1 min-w-0 bg-white/[0.04] border border-white/15 rounded-xl sm:rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 w-full flex items-center gap-2.5 sm:gap-3">
              {/* Mini Thumbnail */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden bg-black shrink-0 border border-white/20 aspect-[1310/1080]">
                <img
                  src={activeFeatureResolved.imageSrc || undefined}
                  alt={activeFeatureResolved.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & 2-line Description */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate font-sans">
                    {activeFeatureResolved.title}
                  </h4>
                  <span className="text-[10px] font-mono text-[#00df81] font-bold shrink-0">
                    {String(activeIndex + 1).padStart(2, '0')}/{String(totalFeatures).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-white/65 font-sans line-clamp-2 leading-tight">
                  {activeFeatureResolved.shortDesc}
                </p>
              </div>
            </div>

            {/* Right: Scrubber Slider + Loop + PROMINENT GLOSSY APP ICON LAUNCHER */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
              
              {/* Feature Scrubber Slider */}
              <div className="flex items-center gap-1.5 flex-1 sm:w-32">
                <input
                  type="range"
                  min="0"
                  max={totalFeatures - 1}
                  step="1"
                  value={activeIndex}
                  onChange={(e) => {
                    setActiveIndex(parseInt(e.target.value, 10));
                  }}
                  aria-label="Feature Stack Slider"
                  className="w-full accent-[#00df81] cursor-pointer h-1.5 bg-white/20 rounded-lg"
                />
              </div>

              {/* Loop / Repeat Toggle */}
              <button
                onClick={() => setIsLooping((l) => !l)}
                title={isLooping ? 'Continuous Loop Active' : 'Loop Disabled'}
                className={`p-1.5 sm:p-2 rounded-full border transition-all ${
                  isLooping
                    ? 'bg-[#00df81]/15 text-[#00df81] border-[#00df81]/40 shadow-[0_0_12px_rgba(0,223,129,0.3)]'
                    : 'bg-white/5 text-white/40 border-white/10'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>

              {/* ANDROID & APPLE APP ICONS (DIRECT FROM USER SPECIFICATION) */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Android App Button */}
                <button
                  onClick={() => setAppModalOpen(true)}
                  title="RPW Connect Android App"
                  aria-label="RPW Connect Android App"
                  className="group relative flex items-center justify-center shrink-0"
                >
                  {/* Glowing Android Aura */}
                  <div className="absolute -inset-0.5 bg-[#87c538] rounded-full blur-[6px] opacity-60 group-hover:opacity-100 transition duration-200 group-hover:scale-110" />

                  {/* Android Circular Icon Container */}
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#97d840] to-[#74af28] border-2 border-[#b5ef66] flex items-center justify-center shadow-[0_0_15px_rgba(135,197,56,0.6),inset_0_1px_2px_rgba(255,255,255,0.6)] overflow-hidden transition-transform duration-200 group-hover:scale-105 active:scale-95">
                    <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24">
                      <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h4v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v6c0 .83.67 1.5 1.5 1.5S5 16.33 5 15.5v-6C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.68 1.23 12.87 1 12 1s-1.68.23-2.64.63L7.88.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3C6.42 3.32 5 5.51 5 8h14c0-2.49-1.42-4.68-3.47-5.84zM9 5.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                    </svg>
                    {/* Glossy Reflection Overlay */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none rounded-t-full" />
                  </div>
                </button>

                {/* Apple iOS App Button */}
                <button
                  onClick={() => setAppModalOpen(true)}
                  title="RPW Connect Apple iOS App"
                  aria-label="RPW Connect Apple iOS App"
                  className="group relative flex items-center justify-center shrink-0"
                >
                  {/* Glowing Apple Aura */}
                  <div className="absolute -inset-0.5 bg-[#a3abb5] rounded-full blur-[6px] opacity-60 group-hover:opacity-100 transition duration-200 group-hover:scale-110" />

                  {/* Apple Circular Icon Container */}
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#99a2ab] to-[#6d757e] border-2 border-[#cbd3dc] flex items-center justify-center shadow-[0_0_15px_rgba(163,171,181,0.6),inset_0_1px_2px_rgba(255,255,255,0.7)] overflow-hidden transition-transform duration-200 group-hover:scale-105 active:scale-95">
                    <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.74c.61-.75 1.04-1.8 0.92-2.84-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.73-.93 2.74 1.01.08 2.03-.5 2.64-1.25z" />
                    </svg>
                    {/* Glossy Reflection Overlay */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/45 via-white/10 to-transparent pointer-events-none rounded-t-full" />
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Pagination Dot Strip */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {RPW_FEATURES.map((f, pIdx) => (
            <button
              key={f.id}
              onClick={() => setActiveIndex(pIdx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                pIdx === activeIndex
                  ? 'w-6 bg-[#00df81] shadow-[0_0_10px_#00df81]'
                  : 'w-1.5 bg-white/20 hover:bg-white/50'
              }`}
              title={f.title}
            />
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FULLSCREEN PREVIEW MODAL (ON CLICKING ACTIVE CARD)                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {previewFeature && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setPreviewFeature(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#050b12] border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 shadow-[0_25px_80px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span
                    className="text-xs font-mono font-bold uppercase tracking-wider"
                    style={{ color: previewFeature.themeColor }}
                  >
                    {previewFeature.category}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-white font-sans">
                    {previewFeature.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewFeature(null)}
                  className="p-1.5 sm:p-2 text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/15 transition-all text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="aspect-[1310/1080] w-full max-h-[65vh] rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/15 flex items-center justify-center">
                <img
                  src={previewFeature.imageSrc || undefined}
                  alt={previewFeature.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <p className="text-xs sm:text-sm text-white/70 font-sans max-w-xl">
                  {previewFeature.shortDesc}
                </p>
                <a
                  href={config.connectPortalUrl || 'https://app.rotopaintwala.com/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00df81] to-[#66fcf1] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,223,129,0.4)]"
                >
                  <img
                    src={config.logoUrl || 'https://static.wixstatic.com/media/7ffb5e_bebd8db90704414a9140cfbf0e8fe1e1~mv2.png/v1/fill/w_400,h_400,al_c,q_90,enc_avif,quality_auto/RPW.png'}
                    alt="RPW Connect"
                    className="w-5 h-5 object-contain"
                  />
                  <span>OPEN IN RPW CONNECT</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RPW App Installation & Cross-Platform Download Modal */}
      <RPWAppModal
        isOpen={appModalOpen}
        onClose={() => setAppModalOpen(false)}
        onOpenTestShotModal={onOpenTestShotModal}
      />
    </section>
  );
};
