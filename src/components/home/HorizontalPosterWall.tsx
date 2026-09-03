import React, { useState } from 'react';
import { MOVIE_POSTERS_DATA, MoviePosterItem } from '../../data/moviePostersData';
import { Zap, Play, Pause, Edit3, Sparkles } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface HorizontalPosterWallProps {
  onOpenTestShotModal: (shotType?: string) => void;
  onNavigateToPortfolio?: () => void;
}

export const HorizontalPosterWall: React.FC<HorizontalPosterWallProps> = ({
  onOpenTestShotModal,
}) => {
  const { config, isEditorOpen, setEditorMode, setActiveTab } = useSiteConfig();
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  // Divide posters dynamically from live site config or default data into 2 rows
  const allPosters = config.moviePosters && config.moviePosters.length > 0 ? config.moviePosters : MOVIE_POSTERS_DATA;
  const half = Math.ceil(allPosters.length / 2);
  const rawRow1 = allPosters.slice(0, half);
  const rawRow2 = allPosters.slice(half);

  // Duplicate for seamless infinite marquee scrolling
  const row1 = [...rawRow1, ...rawRow1, ...rawRow1];
  const row2 = [...rawRow2, ...rawRow2, ...rawRow2];

  return (
    <section id="work" className="w-full relative z-10 bg-[#03060a] overflow-hidden py-10 sm:py-16 group/wall">
      {/* In-Place edit button when Admin mode is on */}
      {isEditorOpen && (
        <div className="absolute top-4 right-6 z-40">
          <button
            onClick={() => {
              setActiveTab('home-posters');
              setEditorMode('dashboard');
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00df81] text-[#05070b] text-xs font-black shadow-[0_0_20px_rgba(0,223,129,0.5)] hover:scale-105 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Home Movie Posters Wall</span>
          </button>
        </div>
      )}
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
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Floating Minimal Callout (Clean, Integrated with Backing Shadow) */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[48%] bg-gradient-to-l from-[#03060a] via-[#03060a]/90 to-transparent flex items-center justify-end p-6 sm:p-12 md:p-16 z-30 pointer-events-none">
          <div className="max-w-lg text-right space-y-3 sm:space-y-4 pointer-events-auto backdrop-blur-md p-6 sm:p-8 rounded-3xl bg-black/60 border border-[#00df81]/25 shadow-[0_0_60px_rgba(0,0,0,0.95)] relative group/card">
            {isEditorOpen && (
              <button
                onClick={() => {
                  setActiveTab('home-posters');
                  setEditorMode('dashboard');
                }}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-[#00df81]/20 hover:bg-[#00df81] text-[#00df81] hover:text-[#05070b] transition-all text-xs flex items-center gap-1 font-mono font-bold"
                title="Edit Card Content in Dashboard"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="text-[10px]">EDIT CARD</span>
              </button>
            )}

            {/* 3-Line Dynamic Stacked Headline */}
            <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight uppercase drop-shadow-lg flex flex-col items-end">
              {config.homePostersHeadlineLine1 || config.homePostersHeadlineLine2 || config.homePostersHeadlineLine3 ? (
                <>
                  {config.homePostersHeadlineLine1 && <span>{config.homePostersHeadlineLine1}</span>}
                  {config.homePostersHeadlineLine2 && <span>{config.homePostersHeadlineLine2}</span>}
                  {config.homePostersHeadlineLine3 && <span>{config.homePostersHeadlineLine3}</span>}
                </>
              ) : (
                (config.homePostersHeadline || 'THE ART BEHIND THE BLOCKBUSTERS')
                  .split('\n')
                  .map((line, idx) => (
                    <span key={idx}>{line}</span>
                  ))
              )}
            </h3>

            <div className="space-y-1.5">
              <p className="text-[#00df81] font-heading font-bold italic text-base sm:text-lg md:text-xl tracking-tight">
                {config.homePostersSubheadline || 'Sub-Pixel Rotoscopy & Digital Paint'}
              </p>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                {config.homePostersDescription || 'These floating posters showcase the high-precision visual effects built by our collaborative team.'}
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
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#00df81] hover:bg-[#00c974] text-[#05070b] font-heading font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(0,223,129,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{config.homePostersCtaText || 'REQUEST PILOT SHOT'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface Poster9x16CardProps {
  poster: MoviePosterItem;
}

const Poster9x16Card: React.FC<Poster9x16CardProps> = ({ poster }) => {
  return (
    <div
      className="group relative w-[140px] sm:w-[170px] md:w-[200px] aspect-[9/16] overflow-hidden bg-[#08111a] transition-all duration-300 shadow-[0_6px_25px_rgba(0,0,0,0.85)] hover:scale-105 hover:z-30 shrink-0 select-none"
      style={{
        outline: '1px solid rgba(0,223,129,0.4)',
        outlineOffset: '0px'
      }}
    >
      {/* 9:16 Movie Poster Image in Original Rectangular Shape */}
      <img
        src={poster.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'}
        alt={poster.title}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
        }}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Outer hover border highlight */}
      <div className="absolute inset-0 pointer-events-none group-hover:outline group-hover:outline-2 group-hover:outline-[#00df81] group-hover:shadow-[0_0_20px_rgba(0,223,129,0.5)] transition-all" />

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
