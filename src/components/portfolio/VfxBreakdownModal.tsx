import React, { useState } from 'react';
import { VfxBreakdownItem } from '../../types';
import { X, Sliders, Zap, CheckCircle2, Eye, ShieldCheck, Download, Sparkles, Layers, Maximize2 } from 'lucide-react';

interface VfxBreakdownModalProps {
  breakdown: VfxBreakdownItem | null;
  onClose: () => void;
  onOpenTestShotModal: (serviceName?: string) => void;
}

export const VfxBreakdownModal: React.FC<VfxBreakdownModalProps> = ({
  breakdown,
  onClose,
  onOpenTestShotModal,
}) => {
  if (!breakdown) return null;

  const [sliderPos, setSliderPos] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'difference' | 'alpha'>('slider');
  const [zoomLevel, setZoomLevel] = useState<'fit' | '100%' | '200%'>('fit');

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = Math.round((x / rect.width) * 100);
    setSliderPos(pct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[95vh] rounded-3xl bg-[#08111a] border border-[#66fcf1]/40 shadow-[0_0_80px_rgba(102,252,241,0.2)] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#05070b]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/30 text-[#66fcf1] text-[11px] font-mono font-bold uppercase tracking-wider">
              {breakdown.category}
            </span>
            <div>
              <h3 className="font-heading font-black text-lg sm:text-xl text-white tracking-wide truncate max-w-md sm:max-w-xl">
                {breakdown.title}
              </h3>
              <div className="flex items-center gap-3 text-xs font-mono text-[#87949c] mt-0.5">
                <span>{breakdown.tag}</span>
                <span>•</span>
                <span className="text-[#66fcf1] font-bold">{breakdown.resolution}</span>
                <span>•</span>
                <span>⏱ {breakdown.turnaroundTime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switchers */}
            <div className="hidden sm:flex items-center bg-black/70 rounded-full border border-white/15 p-1">
              <button
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                  viewMode === 'slider'
                    ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_10px_#66fcf1]'
                    : 'text-[#9daab4] hover:text-white'
                }`}
              >
                A/B WIPE
              </button>
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                  viewMode === 'side-by-side'
                    ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_10px_#66fcf1]'
                    : 'text-[#9daab4] hover:text-white'
                }`}
              >
                SPLIT
              </button>
              <button
                onClick={() => setViewMode('difference')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                  viewMode === 'difference'
                    ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_10px_#66fcf1]'
                    : 'text-[#9daab4] hover:text-white'
                }`}
              >
                DIFF
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/15 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
              title="Close inspection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area (Visual Plate Comparison + Pipeline Details) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Interactive Inspection Canvas */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 select-none shadow-2xl">
            {viewMode === 'slider' && (
              <div
                className="relative w-full h-full cursor-ew-resize overflow-hidden"
                onMouseMove={handleSliderMove}
                onTouchMove={handleSliderMove}
              >
                {/* Before: Raw Ingest Plate */}
                <img
                  src={breakdown.beforeImage || undefined}
                  alt={`${breakdown.title} Raw Plate`}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                />

                {/* After: Clean Plate / Matte with Clip */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none select-none"
                  style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                >
                  <img
                    src={breakdown.afterImage || undefined}
                    alt={`${breakdown.title} Clean Comp`}
                    className="absolute inset-0 w-full h-full object-cover select-none filter contrast-110"
                  />
                  <div className="absolute inset-0 bg-[#66fcf1]/10 mix-blend-screen" />
                </div>

                {/* Wipe Line */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-[#66fcf1] shadow-[0_0_15px_#66fcf1] pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#66fcf1] text-[#05070b] flex items-center justify-center font-bold text-xs shadow-lg">
                    ↔
                  </div>
                </div>

                {/* Overlays */}
                <div className="absolute top-4 left-4 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#66fcf1]/40 text-xs font-mono text-[#66fcf1] font-bold">
                    LEFT: DELIVERED MATTE / CLEAN [{sliderPos}%]
                  </span>
                </div>
                <div className="absolute top-4 right-4 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono text-white/90">
                    RIGHT: RAW CAMERA PLATE
                  </span>
                </div>
              </div>
            )}

            {viewMode === 'side-by-side' && (
              <div className="grid grid-cols-2 w-full h-full">
                <div className="relative border-r border-white/10 h-full overflow-hidden">
                  <img src={breakdown.beforeImage || undefined} alt="Raw Plate" className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-black/80 border border-white/20 text-xs font-mono text-white">
                    RAW PLATE (BEFORE)
                  </span>
                </div>
                <div className="relative h-full overflow-hidden">
                  <img src={breakdown.afterImage || undefined} alt="Processed Matte" className="w-full h-full object-cover filter contrast-110" />
                  <span className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-black/80 border border-[#66fcf1]/40 text-xs font-mono text-[#66fcf1]">
                    CLEAN MATTE (AFTER)
                  </span>
                </div>
              </div>
            )}

            {viewMode === 'difference' && (
              <div className="relative w-full h-full overflow-hidden">
                <img src={breakdown.beforeImage || undefined} alt="Raw" className="absolute inset-0 w-full h-full object-cover" />
                <img
                  src={breakdown.afterImage || undefined}
                  alt="After Diff"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-difference filter contrast-200"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-black/90 border border-rose-500/50 text-xs font-mono text-rose-400">
                  SUB-PIXEL DIFFERENCE HEATMAP (ISOLATED EDGES & RIGS)
                </span>
              </div>
            )}
          </div>

          {/* Technical Specs & Pipeline Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-mono uppercase text-[#66fcf1] font-bold tracking-widest">
                PIPELINE SPECIFICATIONS & DELIVERY AUDIT
              </h4>
              <p className="text-sm text-[#9daab4] leading-relaxed">
                {breakdown.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono text-[#87949c] uppercase block">RESOLUTION</span>
                  <span className="text-xs font-mono font-bold text-white mt-1 block">{breakdown.resolution}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono text-[#87949c] uppercase block">TURNAROUND</span>
                  <span className="text-xs font-mono font-bold text-[#66fcf1] mt-1 block">{breakdown.turnaroundTime}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono text-[#87949c] uppercase block">QC LEVEL</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 mt-1 block">Tier-1 Studio Lead</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#87949c] uppercase block mb-1.5">SOFTWARE & SCRIPTS INCLUDED</span>
                <div className="flex flex-wrap gap-2">
                  {breakdown.software.map((sw, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-[#05070b] border border-[#66fcf1]/30 text-xs font-mono text-white">
                      {sw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Action Callout */}
            <div className="p-6 rounded-2xl bg-[#05070b] border border-[#66fcf1]/30 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#66fcf1] font-bold uppercase tracking-widest block">
                  READY FOR PRODUCTION
                </span>
                <h4 className="font-heading font-bold text-base text-white mt-1">
                  Have shots like this in your pipeline?
                </h4>
                <p className="text-xs text-[#9daab4] mt-2 leading-relaxed">
                  Submit 10-25 frames of your most challenging sequence. We will return full alpha mattes, clean plates, and Nuke scripts in 24 hours.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenTestShotModal(breakdown.category);
                  }}
                  className="w-full py-3 rounded-full bg-[#66fcf1] text-[#05070b] font-heading font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(102,252,241,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>REQUEST TEST BRIEF FOR {breakdown.category.toUpperCase()}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
