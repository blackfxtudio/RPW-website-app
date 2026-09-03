import React, { useState } from 'react';
import { PORTFOLIO_REELS, VFX_BREAKDOWNS } from '../data/portfolioData';
import { PortfolioShowreelItem, VfxBreakdownItem } from '../types';
import { CollageReelWall } from '../components/portfolio/CollageReelWall';
import { ReelCinemaModal } from '../components/portfolio/ReelCinemaModal';
import { VfxBreakdownModal } from '../components/portfolio/VfxBreakdownModal';
import { Sliders, Zap, Search, ArrowUpRight, CheckCircle2, ShieldCheck, Eye, Layers } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface PortfolioPageProps {
  onOpenTestShotModal: (serviceName?: string) => void;
  isActive?: boolean;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onOpenTestShotModal, isActive = true }) => {
  const { config } = useSiteConfig();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [selectedReelModal, setSelectedReelModal] = useState<PortfolioShowreelItem | null>(null);
  const [selectedBreakdownModal, setSelectedBreakdownModal] = useState<VfxBreakdownItem | null>(null);

  const categories = [
    'All',
    'Roto',
    'Digital Paint',
    'Wire Removal',
    'Beauty & De-Aging',
    'Stereo 3D',
    'Full Comp',
  ];

  // 1. Video Showreels for 3D Wall
  const allReels = config.portfolioReels && config.portfolioReels.length > 0 ? config.portfolioReels : PORTFOLIO_REELS;

  // 2. VFX Breakdown Images (A/B Plate Comparisons)
  const allBreakdowns = config.vfxBreakdowns && config.vfxBreakdowns.length > 0 ? config.vfxBreakdowns : VFX_BREAKDOWNS;

  const filteredBreakdowns = allBreakdowns.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTileSelectFromCollage = (tileOrReel: any) => {
    if (tileOrReel.title && (tileOrReel.beforeImage || tileOrReel.videoUrl)) {
      setSelectedReelModal(tileOrReel);
      return;
    }
    const matchingReel = allReels.find((r) => r.title.toLowerCase().includes(tileOrReel.title?.toLowerCase())) || {
      id: tileOrReel.id || 'reel-custom',
      title: tileOrReel.title || 'Production Breakdown',
      category: (tileOrReel.category?.includes('Roto') ? 'Roto' : tileOrReel.category?.includes('Clean') ? 'Digital Paint' : 'Wire Removal') as any,
      tag: tileOrReel.badge || 'MASTER COMP',
      thumbnail: tileOrReel.image,
      videoUrl: tileOrReel.videoUrl || '',
      duration: '1:00',
      clientTier: 'Feature Film',
      resolution: '4K DCI Master',
      turnaroundTime: '24 Hours',
      software: ['Silhouette FX', 'Nuke', 'Mocha Pro'],
      description: `High precision pipeline shot delivered with sub-pixel edge preservation, matte fidelity, and matched organic plate grain.`,
      beforeImage: tileOrReel.image,
      afterImage: tileOrReel.image,
    };
    setSelectedReelModal(matchingReel);
  };

  return (
    <div className="min-h-screen bg-[#05070b] text-[#9daab4] selection:bg-[#66fcf1] selection:text-[#05070b]">
      {/* 1. Top Section: 3D Dynamic Collage Reel Wall (Videos Play Continuously in Live 20s Matrix) */}
      <CollageReelWall
        isActive={isActive}
        onSelectReel={handleTileSelectFromCollage}
        onOpenTestShotModal={() => onOpenTestShotModal()}
      />

      {/* 2. Featured VFX Production Breakdown Images (4 Curated Shots) */}
      <section className="py-20 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/30 text-[#66fcf1] text-[11px] font-['Poppins',sans-serif] font-semibold tracking-[0.22em] uppercase mb-3 shadow-[0_0_20px_rgba(102,252,241,0.15)]">
            <Layers className="w-3.5 h-3.5 text-[#66fcf1]" />
            <span>PRODUCTION BREAKDOWNS [{allBreakdowns.slice(0, 4).length} SHOTS]</span>
          </div>
          <h2 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
            VFX Breakdown <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#66fcf1] to-[#bbf3f0]">Images</span>
          </h2>
          <p className="font-['Poppins',sans-serif] text-sm sm:text-base text-slate-300 mt-3 max-w-xl mx-auto leading-relaxed">
            Interactive sub-pixel A/B swipe plates comparing Raw Camera Ingest Plates against Clean Plates & Delivered Roto Mattes. Drag slider or click to inspect.
          </p>
        </div>

        {/* 4 Clean VFX Breakdown Image Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allBreakdowns.slice(0, 4).map((item) => (
            <BreakdownImageCard
              key={item.id}
              item={item}
              onOpenModal={() => setSelectedBreakdownModal(item)}
            />
          ))}
        </div>
      </section>

      {/* 4. Production Delivery & Deliverable Pipeline Standards */}
      <section className="py-20 px-4 sm:px-8 md:px-12 bg-[#03060a] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-[#66fcf1] text-xs font-mono font-bold uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>PIPELINE COMPATIBILITY</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Supported Deliverables & File Formats
            </h2>
            <p className="text-xs sm:text-sm text-[#9daab4] font-mono mt-2">
              We integrate seamlessly into your studio workflow. Scripts, splines, and project files are returned clean, organized, and production-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Rotoscopy Mattes',
                formats: ['.nk (Nuke Splines & RotoPaint)', '.sfx (Silhouette Projects)', 'ProRes 4444XQ with Alpha', '32-Bit Linear EXR Sequence'],
                badge: 'ALPHA EXTRACTION',
              },
              {
                title: 'Clean Prep Plates',
                formats: ['Clean Plates with matched grain', 'Original Resolution ACEScg EXR', '3D Projection Camera Setup', 'Frequency Separation Layers'],
                badge: 'DIGITAL PAINT',
              },
              {
                title: 'Tracking Data',
                formats: ['Mocha Pro Planar Shapes', '3DEqualizer Camera Solve', 'Nuke Tracker & CornerPins', 'Maya Locator & Alembic Camera'],
                badge: 'CAMERA TRACK',
              },
              {
                title: 'Security & Cloud Ingest',
                formats: ['Frame.io Enterprise Integration', 'High-Speed Aspera Faspex / Fasp', 'Encrypted S3 & GCS Buckets', 'Watermarked Proxy Review'],
                badge: 'TPN COMPLIANT',
              },
            ].map((box, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#08111a] border border-white/10 hover:border-[#66fcf1]/40 transition-all space-y-4"
              >
                <span className="px-2.5 py-1 rounded bg-[#66fcf1]/10 text-[#66fcf1] text-[10px] font-mono font-bold uppercase tracking-wider">
                  {box.badge}
                </span>
                <h3 className="font-heading text-lg font-bold text-white">{box.title}</h3>
                <ul className="space-y-2">
                  {box.formats.map((fmt, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-mono text-[#9daab4]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#66fcf1] shrink-0 mt-0.5" />
                      <span>{fmt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bottom Test Shot CTA */}
      <section className="py-20 px-4 sm:px-8 md:px-12 bg-gradient-to-b from-[#03060a] to-[#05070b] border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#08111a] border border-[#66fcf1]/30 shadow-[0_0_60px_rgba(102,252,241,0.15)] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-[#66fcf1]/20 blur-[80px] rounded-full pointer-events-none" />
          
          <span className="text-xs font-mono font-bold text-[#66fcf1] uppercase tracking-widest">
            ZERO RISK PILOT SHOT
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white mt-2 mb-4 tracking-tight">
            Have a complex shot? Test our speed & quality.
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#9daab4] mb-8 font-mono">
            Send us 10-25 frames of your most challenging hair roto, marker prep, or wire removal. We will deliver a finished matte with full Nuke scripts within 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenTestShotModal()}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#66fcf1] text-[#05070b] font-heading font-black text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(102,252,241,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>SUBMIT FREE TEST SHOT BRIEF</span>
            </button>

            <a
              href={config.connectPortalUrl || 'https://app.rotopaintwala.com/'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/20 hover:border-white text-white font-heading font-bold text-xs sm:text-sm tracking-widest uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <span>RPW CONNECT PORTAL</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Cinema Video Modal (for 3D Showreel Wall) */}
      <ReelCinemaModal
        reel={selectedReelModal}
        onClose={() => setSelectedReelModal(null)}
        onOpenTestShotModal={onOpenTestShotModal}
      />

      {/* High-Resolution VFX Breakdown Image Inspection Modal */}
      <VfxBreakdownModal
        breakdown={selectedBreakdownModal}
        onClose={() => setSelectedBreakdownModal(null)}
        onOpenTestShotModal={onOpenTestShotModal}
      />
    </div>
  );
};

interface BreakdownImageCardProps {
  item: VfxBreakdownItem;
  onOpenModal: () => void;
}

const BreakdownImageCard: React.FC<BreakdownImageCardProps> = ({ item, onOpenModal }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = Math.round((x / rect.width) * 100);
    setSliderPos(pct);
  };

  return (
    <div className="group relative rounded-2xl bg-[#08111a] border border-white/10 hover:border-[#66fcf1]/60 transition-all duration-500 overflow-hidden shadow-2xl flex flex-col">
      {/* Visual Area: Interactive A/B Wipe Comparison */}
      <div className="relative aspect-video w-full bg-black select-none overflow-hidden">
        <div
          className="relative w-full h-full cursor-ew-resize select-none overflow-hidden"
          onMouseMove={handleSliderMove}
          onTouchMove={handleSliderMove}
          onClick={onOpenModal}
        >
          {/* Before: Raw Ingest Plate */}
          <img
            src={item.beforeImage || undefined}
            alt={`${item.title} Raw Plate`}
            className="absolute inset-0 w-full h-full object-cover select-none"
          />

          {/* After: Clean Plate / Matte with Clip */}
          {item.afterImage && (
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none select-none"
              style={{
                clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
              }}
            >
              <img
                src={item.afterImage || undefined}
                alt={`${item.title} Processed Comp`}
                className="absolute inset-0 w-full h-full object-cover select-none filter contrast-115"
              />
              <div className="absolute inset-0 bg-[#66fcf1]/15 mix-blend-color-dodge" />
            </div>
          )}

          {/* Wipe Slider Line */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#66fcf1] shadow-[0_0_12px_#66fcf1] pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#66fcf1] text-[#05070b] flex items-center justify-center font-bold text-[10px] shadow-md">
              ↔
            </div>
          </div>

          {/* Position Indicator Badge */}
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#66fcf1]/40 text-[9px] font-mono text-[#66fcf1] uppercase">
              {sliderPos < 50 ? 'RAW PLATE' : 'CLEAN MATTE'} [{sliderPos}%]
            </span>
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-[#66fcf1]/40 text-[10px] font-['Poppins',sans-serif] font-semibold text-[#66fcf1] uppercase tracking-wider">
            {item.category}
          </span>
          {item.tag && (
            <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[9px] font-['Poppins',sans-serif] text-slate-200">
              {item.tag}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-['Poppins',sans-serif] font-bold text-base text-white tracking-wide group-hover:text-[#66fcf1] transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="font-['Poppins',sans-serif] text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-['Poppins',sans-serif] text-[#66fcf1]/80 font-medium">
            A/B Interactive Plate
          </span>

          <button
            onClick={onOpenModal}
            className="text-xs font-['Poppins',sans-serif] font-semibold text-[#66fcf1] hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Inspect Matte</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
