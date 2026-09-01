import React, { useState } from 'react';
import { PORTFOLIO_REELS, COLLAGE_TILES } from '../data/portfolioData';
import { PortfolioShowreelItem } from '../types';
import { CollageReelWall } from '../components/portfolio/CollageReelWall';
import { ReelCinemaModal } from '../components/portfolio/ReelCinemaModal';
import { Play, Sliders, Layers, Zap, Sparkles, Filter, Search, ArrowUpRight, CheckCircle2, Film, ShieldCheck } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface PortfolioPageProps {
  onOpenTestShotModal: (serviceName?: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onOpenTestShotModal }) => {
  const { config } = useSiteConfig();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReelModal, setSelectedReelModal] = useState<PortfolioShowreelItem | null>(null);
  const [sliderPositions, setSliderPositions] = useState<{ [id: string]: number }>({
    'reel-01': 50,
    'reel-02': 50,
    'reel-03': 50,
    'reel-04': 50,
    'reel-05': 50,
    'reel-06': 50,
  });

  const categories = [
    'All',
    'Roto',
    'Digital Paint',
    'Wire Removal',
    'Beauty & De-Aging',
    'Stereo 3D',
    'Full Comp',
  ];

  const filteredReels = PORTFOLIO_REELS.filter((reel) => {
    const matchesCategory = selectedCategory === 'All' || reel.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      reel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reel.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reel.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTileSelectFromCollage = (tile: typeof COLLAGE_TILES[0]) => {
    // Map collage tile to full reel item or create temporary item
    const matchingReel = PORTFOLIO_REELS.find((r) => r.title.toLowerCase().includes(tile.title.toLowerCase())) || {
      id: tile.id,
      title: tile.title,
      category: (tile.category.includes('Roto') ? 'Roto' : tile.category.includes('Clean') ? 'Digital Paint' : 'Wire Removal') as any,
      tag: tile.badge,
      thumbnail: tile.image,
      videoUrl: tile.videoUrl,
      duration: '1:00',
      clientTier: 'Feature Film',
      resolution: '4K DCI Master',
      turnaroundTime: '24 Hours',
      software: ['Silhouette FX', 'Nuke', 'Mocha Pro'],
      description: `High precision ${tile.category} pipeline shot delivered with sub-pixel edge preservation, matte fidelity, and matched organic plate grain.`,
      beforeImage: tile.image,
      afterImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    };
    setSelectedReelModal(matchingReel);
  };

  const handleSliderMove = (id: string, e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = Math.round((x / rect.width) * 100);
    setSliderPositions((prev) => ({ ...prev, [id]: pct }));
  };

  return (
    <div className="min-h-screen bg-[#05070b] text-[#9daab4] selection:bg-[#66fcf1] selection:text-[#05070b]">
      {/* 1. Top Section: 3D Dynamic Collage Reel Wall (Matching user uploaded reference image) */}
      <CollageReelWall
        onSelectReel={handleTileSelectFromCollage}
        onOpenTestShotModal={() => onOpenTestShotModal()}
      />

      {/* 2. Interactive Discipline Filter & Search Toolbar */}
      <section className="sticky top-[78px] z-40 bg-[#05070b]/95 backdrop-blur-xl border-y border-white/10 py-4 px-4 sm:px-8 md:px-12 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_20px_rgba(102,252,241,0.4)]'
                    : 'bg-white/5 text-[#9daab4] border border-white/10 hover:border-[#66fcf1]/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87949c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shots, hair roto, wires..."
              className="w-full bg-[#08111a] border border-white/15 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-[#87949c] focus:outline-none focus:border-[#66fcf1]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#87949c] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Featured Interactive VFX Production Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-[#66fcf1] text-xs font-mono font-bold uppercase tracking-widest mb-2">
              <span className="w-5 h-[1px] bg-[#66fcf1]" />
              <span>PRODUCTION SHOWCASE [{filteredReels.length} SHOTS]</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Verified Production <span className="text-[#66fcf1]">Breakdowns</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-[#87949c] max-w-sm">
            Drag the interactive slider on each card to compare raw film plates against final matte alphas and clean plates.
          </p>
        </div>

        {/* Grid of Work */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredReels.map((reel) => {
            const currentSlider = sliderPositions[reel.id] ?? 50;
            return (
              <div
                key={reel.id}
                className="group relative rounded-2xl bg-[#08111a] border border-white/10 hover:border-[#66fcf1]/60 transition-all duration-500 overflow-hidden shadow-2xl flex flex-col"
              >
                {/* Visual Wipe / Thumbnail Area */}
                <div
                  className="relative aspect-video w-full bg-black cursor-ew-resize select-none overflow-hidden"
                  onMouseMove={(e) => handleSliderMove(reel.id, e)}
                  onTouchMove={(e) => handleSliderMove(reel.id, e)}
                  onClick={() => setSelectedReelModal(reel)}
                >
                  {/* Before Plate */}
                  <img
                    src={reel.beforeImage || reel.thumbnail}
                    alt={reel.title}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                  />

                  {/* After Plate Clipped */}
                  {reel.afterImage && (
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
                      style={{
                        clipPath: `polygon(0 0, ${currentSlider}% 0, ${currentSlider}% 100%, 0 100%)`,
                      }}
                    >
                      <img
                        src={reel.afterImage}
                        alt="Processed Plate"
                        className="absolute inset-0 w-full h-full object-cover select-none filter contrast-125 saturate-110"
                      />
                      <div className="absolute inset-0 bg-[#66fcf1]/15 mix-blend-color-dodge" />
                    </div>
                  )}

                  {/* Wipe Slider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-[#66fcf1] shadow-[0_0_12px_#66fcf1] pointer-events-none"
                    style={{ left: `${currentSlider}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#66fcf1] text-[#05070b] flex items-center justify-center font-bold text-[10px] shadow-md">
                      ↔
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-[#66fcf1]/40 text-[10px] font-mono font-bold text-[#66fcf1] uppercase">
                      {reel.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white/90">
                      {reel.resolution}
                    </span>
                  </div>

                  {/* Bottom Hover Action Cue */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReelModal(reel);
                      }}
                      className="p-2 rounded-full bg-[#66fcf1] text-[#05070b] shadow-[0_0_15px_#66fcf1]"
                      title="Open 4K Breakdown Reel"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Card Content Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#87949c] mb-1">
                      <span>{reel.tag}</span>
                      <span className="text-[#66fcf1] font-bold">⏱ {reel.turnaroundTime}</span>
                    </div>
                    <h3 className="font-heading font-black text-base text-white tracking-wide group-hover:text-[#66fcf1] transition-colors line-clamp-2">
                      {reel.title}
                    </h3>
                    <p className="text-xs text-[#9daab4] mt-2 line-clamp-2 leading-relaxed">
                      {reel.description}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {reel.software.slice(0, 2).map((sw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#87949c]"
                        >
                          {sw}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedReelModal(reel)}
                      className="text-xs font-mono font-bold text-[#66fcf1] hover:underline flex items-center gap-1"
                    >
                      <span>BREAKDOWN</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* Lightbox / Cinema Breakdown Modal */}
      <ReelCinemaModal
        reel={selectedReelModal}
        onClose={() => setSelectedReelModal(null)}
        onOpenTestShotModal={onOpenTestShotModal}
      />
    </div>
  );
};
