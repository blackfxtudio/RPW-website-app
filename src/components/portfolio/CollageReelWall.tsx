import React, { useState, useEffect, useRef } from 'react';
import { COLLAGE_TILES } from '../../data/portfolioData';
import { Play, Pause, FastForward, Sparkles, Sliders, Eye, Maximize2, Zap, Film, Volume2, VolumeX, Layers, CheckCircle2 } from 'lucide-react';

interface CollageReelWallProps {
  onSelectReel: (tile: typeof COLLAGE_TILES[0]) => void;
  onOpenTestShotModal: () => void;
}

export const CollageReelWall: React.FC<CollageReelWallProps> = ({ onSelectReel, onOpenTestShotModal }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [hoveredTile, setHoveredTile] = useState<typeof COLLAGE_TILES[0] | null>(null);
  const [perspectiveMode, setPerspectiveMode] = useState<'3d-tilt' | 'cinematic-flat'>('3d-tilt');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Create duplicated rows for seamless infinite marquee loop
  const rawRow1 = COLLAGE_TILES.slice(0, 6);
  const rawRow2 = COLLAGE_TILES.slice(6, 12);
  const rawRow3 = [...COLLAGE_TILES.slice(3, 9), ...COLLAGE_TILES.slice(0, 3)];

  const row1 = [...rawRow1, ...rawRow1];
  const row2 = [...rawRow2, ...rawRow2];
  const row3 = [...rawRow3, ...rawRow3];

  const getFilteredRow = (rowItems: typeof COLLAGE_TILES) => {
    if (activeCategory === 'all') return rowItems;
    return rowItems.filter(
      (item) =>
        item.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        item.badge.toLowerCase().includes(activeCategory.toLowerCase())
    );
  };

  const categories = [
    { id: 'all', label: 'All Dynamic Reels' },
    { id: 'roto', label: 'Roto & Alpha' },
    { id: 'clean', label: 'Clean Plate & Prep' },
    { id: 'wire', label: 'Wire Removal' },
    { id: 'stereo', label: 'Stereo 3D' },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[#03060a] pt-24 sm:pt-28 pb-16 border-b border-[#66fcf1]/20">
      {/* Background Neon Lasers and Glow Atmosphere matching user reference image */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#66fcf1]/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-[#03060a] to-transparent z-20" />
        <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#03060a] to-transparent z-20" />
        <div className="absolute inset-0 vfx-mesh-pattern opacity-40 z-10" />
      </div>

      {/* Header Overlay & Badge */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/30 text-[#66fcf1] text-xs font-mono font-bold uppercase tracking-widest mb-3 backdrop-blur-md shadow-[0_0_20px_rgba(102,252,241,0.25)]">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Interactive 3D Showreel Collage & Reel Matrix</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase">
          Dynamic Showreel <span className="text-[#66fcf1] drop-shadow-[0_0_25px_rgba(102,252,241,0.5)]">Collage</span> Wall
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#9daab4] mt-2 font-mono">
          Hover any tile to inspect sub-pixel breakdowns. Click to play full 4K cinema master reel with A/B wipe comparison.
        </p>

        {/* Categories Bar */}
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_15px_#66fcf1]'
                  : 'bg-white/5 text-[#9daab4] border border-white/10 hover:border-[#66fcf1]/40 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Angled Moving Reel Showcase Wall (Inspired by User's Reference Collage) */}
      <div
        className={`relative w-full py-4 transition-all duration-700 select-none ${
          perspectiveMode === '3d-tilt'
            ? 'perspective-[1200px] scale-[1.03] sm:scale-100 transform-gpu'
            : 'perspective-none'
        }`}
      >
        <div
          className={`space-y-4 sm:space-y-6 transition-transform duration-700 ${
            perspectiveMode === '3d-tilt'
              ? 'rotate-x-[14deg] -rotate-y-[2deg] rotate-z-[-2deg]'
              : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Row 1: Scrolling Left */}
          <div className="flex gap-4 sm:gap-6 overflow-hidden w-full relative">
            <div
              className="flex gap-4 sm:gap-6 shrink-0"
              style={{
                animation: `scrollLeft ${45 / speedMultiplier}s linear infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              {row1.map((tile, idx) => (
                <div
                  key={`r1-${tile.id}-${idx}`}
                  onClick={() => onSelectReel(tile)}
                  onMouseEnter={() => setHoveredTile(tile)}
                  onMouseLeave={() => setHoveredTile(null)}
                  className="group/tile relative w-[240px] sm:w-[320px] md:w-[360px] h-[150px] sm:h-[190px] md:h-[210px] rounded-xl overflow-hidden cursor-pointer shrink-0 border-2 border-transparent transition-all duration-300 transform hover:scale-108 hover:z-40 hover:shadow-[0_0_30px_rgba(102,252,241,0.6)]"
                  style={{
                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                  }}
                >
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/tile:scale-115"
                  />
                  {/* Neon laser border highlight like the image */}
                  <div className="absolute inset-0 border-2 border-[#66fcf1]/40 rounded-xl group-hover/tile:border-[#66fcf1] transition-colors pointer-events-none" />
                  
                  {/* Glass Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-black/30 to-transparent opacity-85 group-hover/tile:opacity-60 transition-opacity" />

                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#66fcf1]/50 text-[10px] font-mono font-black text-[#66fcf1] tracking-wider uppercase">
                      {tile.badge}
                    </span>
                  </div>

                  {/* Play Hover Action Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/tile:opacity-100 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#66fcf1] text-[#05070b] flex items-center justify-center shadow-[0_0_25px_#66fcf1] transform group-hover/tile:scale-110">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Title Info */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#66fcf1]/90">
                      {tile.category}
                    </p>
                    <h4 className="font-heading font-black text-xs sm:text-sm text-white tracking-wide truncate">
                      {tile.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Scrolling Right */}
          <div className="flex gap-4 sm:gap-6 overflow-hidden w-full relative">
            <div
              className="flex gap-4 sm:gap-6 shrink-0"
              style={{
                animation: `scrollRight ${50 / speedMultiplier}s linear infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              {row2.map((tile, idx) => (
                <div
                  key={`r2-${tile.id}-${idx}`}
                  onClick={() => onSelectReel(tile)}
                  onMouseEnter={() => setHoveredTile(tile)}
                  onMouseLeave={() => setHoveredTile(null)}
                  className="group/tile relative w-[240px] sm:w-[320px] md:w-[360px] h-[150px] sm:h-[190px] md:h-[210px] rounded-xl overflow-hidden cursor-pointer shrink-0 border-2 border-transparent transition-all duration-300 transform hover:scale-108 hover:z-40 hover:shadow-[0_0_30px_rgba(102,252,241,0.6)]"
                >
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/tile:scale-115"
                  />
                  <div className="absolute inset-0 border-2 border-[#66fcf1]/40 rounded-xl group-hover/tile:border-[#66fcf1] transition-colors pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-black/30 to-transparent opacity-85 group-hover/tile:opacity-60 transition-opacity" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#66fcf1]/50 text-[10px] font-mono font-black text-[#66fcf1] tracking-wider uppercase">
                      {tile.badge}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/tile:opacity-100 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#66fcf1] text-[#05070b] flex items-center justify-center shadow-[0_0_25px_#66fcf1] transform group-hover/tile:scale-110">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#66fcf1]/90">
                      {tile.category}
                    </p>
                    <h4 className="font-heading font-black text-xs sm:text-sm text-white tracking-wide truncate">
                      {tile.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Scrolling Left */}
          <div className="flex gap-4 sm:gap-6 overflow-hidden w-full relative">
            <div
              className="flex gap-4 sm:gap-6 shrink-0"
              style={{
                animation: `scrollLeft ${48 / speedMultiplier}s linear infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              {row3.map((tile, idx) => (
                <div
                  key={`r3-${tile.id}-${idx}`}
                  onClick={() => onSelectReel(tile)}
                  onMouseEnter={() => setHoveredTile(tile)}
                  onMouseLeave={() => setHoveredTile(null)}
                  className="group/tile relative w-[240px] sm:w-[320px] md:w-[360px] h-[150px] sm:h-[190px] md:h-[210px] rounded-xl overflow-hidden cursor-pointer shrink-0 border-2 border-transparent transition-all duration-300 transform hover:scale-108 hover:z-40 hover:shadow-[0_0_30px_rgba(102,252,241,0.6)]"
                >
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/tile:scale-115"
                  />
                  <div className="absolute inset-0 border-2 border-[#66fcf1]/40 rounded-xl group-hover/tile:border-[#66fcf1] transition-colors pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-black/30 to-transparent opacity-85 group-hover/tile:opacity-60 transition-opacity" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#66fcf1]/50 text-[10px] font-mono font-black text-[#66fcf1] tracking-wider uppercase">
                      {tile.badge}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/tile:opacity-100 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#66fcf1] text-[#05070b] flex items-center justify-center shadow-[0_0_25px_#66fcf1] transform group-hover/tile:scale-110">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#66fcf1]/90">
                      {tile.category}
                    </p>
                    <h4 className="font-heading font-black text-xs sm:text-sm text-white tracking-wide truncate">
                      {tile.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Center Matrix Controller (matching the game controller aesthetic from the user's reference) */}
      <div className="relative z-30 max-w-4xl mx-auto px-4 mt-6">
        <div className="p-4 rounded-2xl bg-[#050a10]/90 backdrop-blur-xl border border-[#66fcf1]/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2.5 rounded-xl border flex items-center gap-2 font-mono text-xs font-bold uppercase transition-all ${
                isPlaying
                  ? 'bg-[#66fcf1] text-[#05070b] border-[#66fcf1] shadow-[0_0_15px_rgba(102,252,241,0.5)]'
                  : 'bg-white/5 text-white border-white/20 hover:bg-white/10'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE MOTION' : 'PLAY DYNAMIC'}</span>
            </button>

            <button
              onClick={() =>
                setSpeedMultiplier((prev) => (prev === 1 ? 1.75 : prev === 1.75 ? 0.5 : 1))
              }
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono hover:border-[#66fcf1]/50 flex items-center gap-1.5 transition-all"
              title="Change scrolling speed"
            >
              <FastForward className="w-3.5 h-3.5 text-[#66fcf1]" />
              <span>SPEED {speedMultiplier}x</span>
            </button>

            <button
              onClick={() =>
                setPerspectiveMode((prev) => (prev === '3d-tilt' ? 'cinematic-flat' : '3d-tilt'))
              }
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono hover:border-[#66fcf1]/50 flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-[#66fcf1]" />
              <span>{perspectiveMode === '3d-tilt' ? '3D MATRIX' : 'FLAT GRID'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#87949c] hidden md:inline-block">
              {hoveredTile ? (
                <span className="text-[#66fcf1] font-bold">READY TO PLAY: {hoveredTile.title}</span>
              ) : (
                '12+ 4K MASTER SHOWREELS ACTIVE'
              )}
            </span>

            <button
              onClick={onOpenTestShotModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#66fcf1] to-[#45b649] text-[#05070b] font-heading font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(102,252,241,0.4)] hover:scale-105 transition-all flex items-center gap-1.5"
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
