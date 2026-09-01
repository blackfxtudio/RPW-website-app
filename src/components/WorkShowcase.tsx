import React, { useState } from 'react';
import { WorkShot } from '../types';
import { Play, Sparkles, Layers, Sliders, Maximize2, X, CheckCircle2, Film, Edit3 } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface WorkShowcaseProps {
  onOpenTestShotModal: (shotType?: string) => void;
  onNavigateToPortfolio?: () => void;
}

export const WorkShowcase: React.FC<WorkShowcaseProps> = ({ onOpenTestShotModal, onNavigateToPortfolio }) => {
  const { config, isEditorOpen, setActiveEditTarget } = useSiteConfig();
  const [activeShot, setActiveShot] = useState<WorkShot | null>(null);
  const [sliderPosition, setSliderPosition] = useState<{ [key: string]: number }>({
    'shot-01': 50,
    'shot-02': 50,
    'shot-03': 50,
  });

  const handleSliderMove = (id: string, e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.round((x / rect.width) * 100);
    setSliderPosition((prev) => ({ ...prev, [id]: percentage }));
  };

  const shots = config.shots || [];
  const featuredShot = shots[0];
  const sideShots = shots.slice(1);

  if (!featuredShot) return null;

  return (
    <section id="work" className="py-24 sm:py-32 px-4 sm:px-8 md:px-12 relative z-10 border-t border-white/5 group">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative">
          {/* In-Place edit button */}
          {isEditorOpen && (
            <div className="absolute top-0 right-0">
              <button
                onClick={() => setActiveEditTarget('work')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#66fcf1] text-[#05070b] text-xs font-bold shadow-[0_0_15px_rgba(102,252,241,0.4)]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Work Showcase</span>
              </button>
            </div>
          )}

          <div>
            <div className="inline-flex items-center gap-2.5 text-[#66fcf1] text-xs font-extrabold uppercase tracking-[0.2em] mb-3">
              <span className="w-5 h-[1px] bg-[#66fcf1]" />
              <span>{config.workEyebrow}</span>
            </div>
            <h2 className="font-heading text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              <span>{config.workHeading}</span> <span className="text-[#66fcf1]">{config.workHeadingHighlight}</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#9daab4] leading-relaxed">
            {config.workDescription}
          </p>
        </div>

        {/* Video / Shot Wall Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Featured Shot (Col 1-7) */}
          <div className="lg:col-span-7">
            <div
              className="group relative min-h-[480px] sm:min-h-[540px] rounded-2xl border border-[#66fcf1]/30 bg-[#050a10] overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#66fcf1]/70"
              onMouseMove={(e) => handleSliderMove(featuredShot.id, e)}
              onTouchMove={(e) => handleSliderMove(featuredShot.id, e)}
            >
              {/* Background Ambient Grid Pulse */}
              <div className="absolute inset-0 vfx-mesh-pattern animate-grid-pulse pointer-events-none opacity-60" />

              {/* Base Original Image Plate */}
              <img
                src={featuredShot.originalImage}
                alt="Original Film Plate"
                className="absolute inset-0 w-full h-full object-cover select-none filter contrast-105"
              />

              {/* VFX Processed Matte Image (Clipped by Slider) */}
              <div
                className="absolute inset-0 overflow-hidden select-none pointer-events-none"
                style={{ clipPath: `polygon(0 0, ${sliderPosition[featuredShot.id] ?? 50}% 0, ${sliderPosition[featuredShot.id] ?? 50}% 100%, 0 100%)` }}
              >
                <img
                  src={featuredShot.processedImage}
                  alt="Rotoscoped Matte Channel"
                  className="absolute inset-0 w-full h-full object-cover filter saturate-150 contrast-125 hue-rotate-15"
                />
                {/* Matte Color Overlay simulation */}
                <div className="absolute inset-0 bg-[#66fcf1]/20 mix-blend-color-dodge pointer-events-none" />
              </div>

              {/* Wipe Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-[#66fcf1] pointer-events-none shadow-[0_0_15px_#66fcf1]"
                style={{ left: `${sliderPosition[featuredShot.id] ?? 50}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#05070b] border-2 border-[#66fcf1] flex items-center justify-center text-[#66fcf1] shadow-lg">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Gradient Scrim for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-[#05070b]/30 to-transparent pointer-events-none z-[3]" />

              {/* Top Tags */}
              <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between pointer-events-none">
                <div className="px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-widest bg-[#66fcf1]/15 text-[#66fcf1] border border-[#66fcf1]/40 backdrop-blur-md">
                  {featuredShot.tag}
                </div>
                <div className="px-2.5 py-1 rounded-md text-[9px] font-mono text-white/80 bg-black/60 backdrop-blur-md border border-white/10">
                  WIPE: {sliderPosition[featuredShot.id] ?? 50}% MATTE
                </div>
              </div>

              {/* Bottom Shot Info & Interactive Controls */}
              <div className="absolute bottom-5 left-6 right-6 z-10 flex items-end justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#66fcf1] mb-1">
                    {featuredShot.clientType} · {featuredShot.resolution}
                  </div>
                  <h3 className="font-heading text-white text-2xl sm:text-3xl font-bold tracking-tight">
                    {featuredShot.title}
                  </h3>
                  <p className="text-xs text-[#9daab4] max-w-lg mt-1 line-clamp-2 sm:line-clamp-none">
                    {featuredShot.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveShot(featuredShot);
                    }}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-[#66fcf1] hover:text-[#05070b] text-white border border-white/20 transition-all duration-200"
                    title="Expand Technical Details"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTestShotModal(featuredShot.category);
                    }}
                    className="px-3 py-2 rounded-full bg-[#66fcf1]/20 hover:bg-[#66fcf1] text-[#66fcf1] hover:text-[#05070b] text-xs font-bold border border-[#66fcf1]/40 transition-all duration-200"
                  >
                    BOOK SHOT
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stacked Shots (Col 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {sideShots.map((shot) => (
              <div
                key={shot.id}
                className="group relative min-h-[250px] sm:min-h-[260px] rounded-2xl border border-white/15 bg-[#050a10] overflow-hidden shadow-xl transition-all duration-500 hover:border-[#66fcf1]/60"
                onMouseMove={(e) => handleSliderMove(shot.id, e)}
                onTouchMove={(e) => handleSliderMove(shot.id, e)}
              >
                {/* Visual Mesh */}
                <div className="absolute inset-0 vfx-mesh-pattern pointer-events-none opacity-40" />

                {/* Base Image */}
                <img
                  src={shot.originalImage}
                  alt={shot.title}
                  className="absolute inset-0 w-full h-full object-cover select-none filter contrast-105"
                />

                {/* Processed Clipped Image */}
                <div
                  className="absolute inset-0 overflow-hidden select-none pointer-events-none"
                  style={{ clipPath: `polygon(0 0, ${sliderPosition[shot.id] ?? 50}% 0, ${sliderPosition[shot.id] ?? 50}% 100%, 0 100%)` }}
                >
                  <img
                    src={shot.processedImage}
                    alt={shot.title}
                    className="absolute inset-0 w-full h-full object-cover filter saturate-150 contrast-125"
                  />
                  <div className="absolute inset-0 bg-[#66fcf1]/15 mix-blend-color-dodge pointer-events-none" />
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-[#66fcf1] pointer-events-none shadow-[0_0_10px_#66fcf1]"
                  style={{ left: `${sliderPosition[shot.id] ?? 50}%` }}
                />

                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-[#05070b]/40 to-transparent pointer-events-none z-[3]" />

                {/* Top Tag */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-heading font-bold uppercase tracking-wider bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30 backdrop-blur-md">
                    {shot.tag}
                  </span>
                  <span className="text-[9px] font-mono text-white/70 bg-black/50 px-2 py-0.5 rounded">
                    {shot.resolution}
                  </span>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-4 left-5 right-5 z-10 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#66fcf1] block mb-0.5">
                      {shot.category}
                    </span>
                    <h3 className="font-heading text-white text-lg font-bold tracking-tight">
                      {shot.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveShot(shot)}
                    className="p-2 rounded-full bg-white/10 hover:bg-[#66fcf1] hover:text-[#05070b] text-white border border-white/20 transition-all duration-200"
                    title="View Technical Specs"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Full Dynamic Portfolio & Showreel Wall Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0d1c24]/90 via-[#0a151e]/80 to-[#0d1c24]/90 border border-[#66fcf1]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#66fcf1]/10 border border-[#66fcf1]/30 flex items-center justify-center text-[#66fcf1] shrink-0">
              <Film className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#66fcf1]">
                  DEDICATED PORTFOLIO PAGE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-[#66fcf1]/20 text-[#66fcf1]">
                  DYNAMIC COLLAGE WALL
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white mt-0.5">
                Explore The Complete Multi-Showreel Matrix & A/B Breakdowns
              </h3>
              <p className="text-xs text-[#87949c] font-mono mt-0.5">
                Dynamic 3D perspective showreel collage, interactive wipe split-screen, and category filtering.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onNavigateToPortfolio) {
                onNavigateToPortfolio();
              } else {
                window.location.hash = '#portfolio';
              }
            }}
            className="w-full md:w-auto px-7 py-3.5 rounded-xl bg-[#66fcf1] text-[#05070b] text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-2.5 hover:shadow-[0_0_30px_rgba(102,252,241,0.4)] hover:-translate-y-0.5 transition-all shrink-0"
          >
            <span>LAUNCH PORTFOLIO PAGE</span>
            <Film className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Technical Detail Modal */}
      {activeShot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[#08111a] border border-[#66fcf1]/40 p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveShot(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#9daab4] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-heading font-extrabold tracking-widest uppercase bg-[#66fcf1]/15 text-[#66fcf1] border border-[#66fcf1]/30">
                {activeShot.category}
              </span>
              <span className="text-xs text-[#9daab4] font-mono">{activeShot.frameRange}</span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
              {activeShot.title}
            </h3>
            <p className="text-sm text-[#9daab4] leading-relaxed mb-6">
              {activeShot.description}
            </p>

            {/* Split Comparison Preview in Modal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                <div className="text-[10px] font-mono uppercase bg-black/80 px-3 py-1 text-[#9daab4] border-b border-white/10">
                  Raw Ingest Plate
                </div>
                <img src={activeShot.originalImage} alt="Raw Plate" className="w-full h-48 object-cover" />
              </div>
              <div className="rounded-xl overflow-hidden border border-[#66fcf1]/30 bg-black">
                <div className="text-[10px] font-mono uppercase bg-black/80 px-3 py-1 text-[#66fcf1] border-b border-[#66fcf1]/20 flex justify-between">
                  <span>Isolated Alpha / Cleaned</span>
                  <span>QC PASSED</span>
                </div>
                <img src={activeShot.processedImage} alt="Processed Alpha" className="w-full h-48 object-cover filter saturate-150 contrast-125" />
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-black/40 border border-white/5 mb-6 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#66fcf1] block">Resolution</span>
                <span className="font-bold text-white">{activeShot.resolution}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#66fcf1] block">Complexity</span>
                <span className="font-bold text-white">{activeShot.complexity} Grade</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#66fcf1] block">Industry</span>
                <span className="font-bold text-white">{activeShot.clientType}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveShot(null)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#aeb9c1] hover:text-white border border-white/15 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const cat = activeShot.category;
                  setActiveShot(null);
                  onOpenTestShotModal(cat);
                }}
                className="px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-[#05070b] bg-[#66fcf1] hover:shadow-[0_0_25px_rgba(102,252,241,0.4)] transition-all"
              >
                Submit Similar Shot
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
