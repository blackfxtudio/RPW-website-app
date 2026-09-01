import React, { useState } from 'react';
import { MOVIE_POSTERS_DATA, MoviePosterItem } from '../../data/moviePostersData';
import { Zap, Play, Pause } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface HorizontalPosterWallProps {
  onOpenTestShotModal: (shotType?: string) => void;
  onNavigateToPortfolio?: () => void;
}

export const HorizontalPosterWall: React.FC<HorizontalPosterWallProps> = ({
  onOpenTestShotModal,
}) => {
  const { config } = useSiteConfig();
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [selectedPoster, setSelectedPoster] = useState<MoviePosterItem | null>(null);

  // Divide posters into exactly 2 rows
  const allPosters = MOVIE_POSTERS_DATA;
  const rawRow1 = allPosters.slice(0, 8);
  const rawRow2 = allPosters.slice(8, 16);

  // Duplicate for seamless infinite marquee scrolling
  const row1 = [...rawRow1, ...rawRow1, ...rawRow1];
  const row2 = [...rawRow2, ...rawRow2, ...rawRow2];

  return (
    <section id="work" className="w-full relative z-10 bg-[#03060a] overflow-hidden py-10 sm:py-16">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#00df81]/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#66fcf1]/10 blur-[160px] pointer-events-none" />

      {/* FULL-WIDTH 3D DIAGONAL 2-ROW 9:16 POSTER SLIDE (No Box/Card Container, Edge-to-Edge) */}
      <div className="w-full relative overflow-hidden flex items-center justify-center min-h-[540px] sm:min-h-[640px]">
        {/* Subtle Vignette Overlays on Left/Right Edges for Cinematic Fade */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-36 bg-gradient-to-r from-[#03060a] via-[#03060a]/80 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-20 sm:w-48 bg-gradient-to-l from-[#03060a] via-[#03060a]/80 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#03060a] to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#03060a] to-transparent pointer-events-none z-20" />

        {/* 3D Perspective Stage Container - Extends edge-to-edge */}
        <div
          className="w-full flex items-center justify-center overflow-hidden"
          style={{
            perspective: '1400px',
          }}
        >
          {/* 3D Diagonal Transformed Plane with 2 Horizontal Rows */}
          <div
            className="flex flex-col gap-5 sm:gap-7 transform-gpu transition-transform duration-700 w-[140%] -ml-[10%]"
            style={{
              transform: 'rotateX(13deg) rotateY(-15deg) rotateZ(5deg) scale(1.06)',
            }}
          >
            {/* Row 1: 9:16 Posters Scrolling Left */}
            <div className="flex overflow-hidden">
              <div
                className="flex gap-4 sm:gap-6 shrink-0"
                style={{
                  animation: `scrollLeft ${44 / speedMultiplier}s linear infinite`,
                  animationPlayState: isPlaying ? 'running' : 'paused',
                }}
              >
                {row1.map((poster, idx) => (
                  <Poster9x16Card
                    key={`r1-${poster.id}-${idx}`}
                    poster={poster}
                    onClick={() => setSelectedPoster(poster)}
                  />
                ))}
              </div>
            </div>

            {/* Row 2: 9:16 Posters Scrolling Right (Parallax Flow) */}
            <div className="flex overflow-hidden">
              <div
                className="flex gap-4 sm:gap-6 shrink-0"
                style={{
                  animation: `scrollRight ${48 / speedMultiplier}s linear infinite`,
                  animationPlayState: isPlaying ? 'running' : 'paused',
                }}
              >
                {row2.map((poster, idx) => (
                  <Poster9x16Card
                    key={`r2-${poster.id}-${idx}`}
                    poster={poster}
                    onClick={() => setSelectedPoster(poster)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Floating Minimal Callout (Clean, Integrated with Backing Shadow) */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[45%] bg-gradient-to-l from-[#03060a] via-[#03060a]/90 to-transparent flex items-center justify-end p-6 sm:p-12 md:p-16 z-30 pointer-events-none">
          <div className="max-w-md text-right space-y-3 sm:space-y-4 pointer-events-auto backdrop-blur-sm p-5 sm:p-7 rounded-3xl bg-black/50 border border-[#00df81]/20 shadow-[0_0_60px_rgba(0,0,0,0.9)]">
            <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight uppercase">
              THE ULTIMATE <br />
              <span className="text-white">WAY</span> <br />
              <span className="text-white">TO DELIVER VFX</span>
            </h3>

            <div className="space-y-1">
              <p className="text-[#00df81] font-heading font-bold italic text-base sm:text-xl tracking-tight">
                Sub-Pixel Rotoscopy & Digital Paint
              </p>
              <p className="text-white/80 font-heading font-semibold italic text-xs sm:text-sm tracking-wide">
                + Overnight Studio Dispatch at Zero Turnaround Friction
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-[#00df81] text-white text-xs font-mono transition-all"
                title={isPlaying ? 'Pause Motion' : 'Play Motion'}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-[#00df81]" /> : <Play className="w-4 h-4 text-[#00df81]" />}
              </button>

              <button
                onClick={() => onOpenTestShotModal()}
                className="px-7 py-3.5 rounded-full bg-[#00df81] hover:bg-[#00c974] text-[#05070b] font-heading font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(0,223,129,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>REQUEST PILOT SHOT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Poster Detail Modal */}
      {selectedPoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#08111a] border border-[#00df81]/50 p-6 sm:p-8 shadow-[0_0_90px_rgba(0,0,0,0.95)] space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-[#87949c]">{selectedPoster.year} • {selectedPoster.studio}</span>
              </div>
              <button
                onClick={() => setSelectedPoster(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border-2 border-[#00df81]/40 shadow-2xl bg-black">
                <img
                  src={selectedPoster.posterUrl}
                  alt={selectedPoster.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:col-span-2 space-y-4">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white">
                    {selectedPoster.title}
                  </h3>
                  {selectedPoster.highlight && (
                    <p className="text-xs font-mono text-[#00df81] font-bold mt-1">
                      ★ {selectedPoster.highlight}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-[#87949c] uppercase block">
                    Delivered VFX Prep Services:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPoster.vfxWork.map((work, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#00df81]/10 text-[#00df81] border border-[#00df81]/30 text-xs font-mono"
                      >
                        {work}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs font-mono text-[#9daab4] leading-relaxed">
                  Delivered with sub-pixel alpha splines, organic sensor grain matching, and multi-pass ACEScg clean plate projections.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedPoster(null);
                      onOpenTestShotModal(selectedPoster.title);
                    }}
                    className="w-full px-5 py-3 rounded-xl bg-[#00df81] hover:bg-[#00c974] text-[#05070b] font-heading font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_#00df81] transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>REQUEST PILOT SHOT FOR THIS PROJECT</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

interface Poster9x16CardProps {
  poster: MoviePosterItem;
  onClick: () => void;
}

const Poster9x16Card: React.FC<Poster9x16CardProps> = ({ poster, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative w-[140px] sm:w-[170px] md:w-[200px] aspect-[9/16] rounded-2xl overflow-hidden bg-[#08111a] border-2 border-[#00df81]/40 hover:border-[#00df81] transition-all duration-300 shadow-[0_6px_25px_rgba(0,0,0,0.85)] cursor-pointer hover:scale-105 hover:z-30 shrink-0"
    >
      {/* 9:16 Movie Poster Image */}
      <img
        src={poster.posterUrl}
        alt={poster.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Neon Border Glow Outline */}
      <div className="absolute inset-0 border border-[#00df81]/30 rounded-2xl pointer-events-none group-hover:border-[#00df81] group-hover:shadow-[inset_0_0_20px_rgba(0,223,129,0.5)] transition-all" />

      {/* Dark Vignette Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-75 group-hover:opacity-30 transition-opacity" />

      {/* Clean Bottom Title and Studio Info */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 bg-gradient-to-t from-black via-black/90 to-transparent">
        <h4 className="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-[#00df81] transition-colors truncate">
          {poster.title}
        </h4>
        <p className="text-[10px] font-mono text-[#87949c] truncate">{poster.year} • {poster.studio}</p>
      </div>
    </div>
  );
};
