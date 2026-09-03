import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PartnerStudio } from '../types';
import { RotoLogo } from './RotoLogo';
import { 
  Building2, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Radio,
  Paintbrush,
  Eraser,
  Scissors,
  MousePointer2,
  ZoomIn,
  PenTool,
  Pipette,
  Layers,
  Wand2
} from 'lucide-react';

interface InfographicNetworkProps {
  partners: PartnerStudio[];
  onPartnerClick: (partner: PartnerStudio) => void;
  onOpenTestShotModal?: () => void;
}

interface NodeData {
  id: number;
  partner: PartnerStudio;
  side: 'left' | 'right';
  indexOnSide: number;
  // Coordinate percentage
  posX: number;
  posY: number;
}

export const InfographicNetwork: React.FC<InfographicNetworkProps> = ({
  partners,
  onPartnerClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1100, height: 720 });
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);

  // All Verified partner studios dynamically
  const displayPartners = useMemo(() => (partners && partners.length > 0 ? partners : []), [partners]);

  // Update container dimensions on window resize & partner count
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const w = Math.max(rect.width, 320);
        const maxNodesOnSide = Math.max(1, Math.ceil(displayPartners.length / 2));
        
        // Adaptive height for responsive screens and dynamic studio counts in side-by-side or full view
        const baseH = maxNodesOnSide <= 4 
          ? (window.innerWidth < 640 ? 660 : Math.max(560, Math.min(rect.width * 0.82, 640)))
          : Math.max(600, maxNodesOnSide * (window.innerWidth < 640 ? 125 : 95));

        setDimensions({ width: w, height: baseH });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [displayPartners.length]);

  // Node Positions (Percentage based, perfectly matching screenshot layout)
  // Dynamic Left & Right distribution for any number of studios (2, 4, 8, 10, 12, 16+)
  const nodes: NodeData[] = useMemo(() => {
    const isMobile = dimensions.width < 640;
    const total = displayPartners.length;
    if (total === 0) return [];

    const leftCount = Math.ceil(total / 2);
    const rightCount = total - leftCount;

    return displayPartners.map((partner, idx) => {
      const isLeft = idx < leftCount;
      const indexOnSide = isLeft ? idx : idx - leftCount;
      const countOnSide = isLeft ? leftCount : rightCount;

      let posY = 50;
      if (countOnSide === 1) {
        posY = 50;
      } else if (countOnSide === 2) {
        posY = indexOnSide === 0 ? 28 : 72;
      } else if (countOnSide === 3) {
        posY = indexOnSide === 0 ? 18 : indexOnSide === 1 ? 50 : 82;
      } else if (countOnSide === 4) {
        // Standard 4-node layout: 12%, 37%, 63%, 88%
        const yPercentages = [12, 37, 63, 88];
        posY = yPercentages[indexOnSide] ?? 50;
      } else {
        // Dynamic even distribution from 10% to 90%
        posY = 10 + (indexOnSide / (countOnSide - 1)) * 80;
      }

      // Horizontal placement with adequate margin from center hub
      const posX = isLeft 
        ? (isMobile ? 14 : 14) 
        : (isMobile ? 86 : 86);

      return {
        id: idx,
        partner,
        side: isLeft ? 'left' : 'right',
        indexOnSide,
        posX,
        posY,
      };
    });
  }, [displayPartners, dimensions.width]);

  // Central Hub Coordinates
  const centerPos = useMemo(() => ({
    x: dimensions.width * 0.5,
    y: dimensions.height * 0.5,
  }), [dimensions]);

  // Calculate Nuke/Fusion-style node cables
  const cablePaths = useMemo(() => {
    const cx = centerPos.x;
    const cy = centerPos.y;
    const isMobile = dimensions.width < 640;
    const isTablet = dimensions.width >= 640 && dimensions.width < 1024;
    
    // Hub radius matched to the reduced central circle (w-32=128px on mobile -> r=64, w-48=192px on sm/md -> r=96, w-60=240px on lg -> r=120)
    const hubRadius = isMobile ? 64 : isTablet ? 96 : 120;

    return nodes.map((node) => {
      const nx = (node.posX / 100) * dimensions.width;
      const ny = (node.posY / 100) * dimensions.height;

      // Connection point at the edge of the circular node (w-16=64px on mobile -> r=32, w-20=80px on sm/md -> r=40, w-24=96px on lg -> r=48)
      const nodeRadius = isMobile ? 32 : isTablet ? 40 : 48;
      const targetPinX = node.side === 'left' ? nx + nodeRadius : nx - nodeRadius;
      const targetPinY = ny;

      // Calculate angle from center to node to find exit point on center hub
      const angle = Math.atan2(ny - cy, nx - cx);
      const hubPinX = cx + Math.cos(angle) * hubRadius;
      const hubPinY = cy + Math.sin(angle) * hubRadius;

      // Nuke / Fusion style cubic bezier horizontal tangents
      // Tangent handles push outward horizontally from the hub and pin
      const dx = targetPinX - hubPinX;
      const tension = Math.abs(dx) * 0.52;

      const cp1x = hubPinX + (node.side === 'left' ? -tension : tension);
      const cp1y = hubPinY;

      const cp2x = targetPinX + (node.side === 'left' ? tension * 0.7 : -tension * 0.7);
      const cp2y = targetPinY;

      // Smooth Nuke spline curve
      const pathData = `M ${hubPinX} ${hubPinY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetPinX} ${targetPinY}`;

      return {
        id: node.id,
        path: pathData,
        hubPinX,
        hubPinY,
        targetPinX,
        targetPinY,
        isHovered: hoveredNodeId === node.id,
      };
    });
  }, [nodes, centerPos, dimensions, hoveredNodeId]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${dimensions.height}px` }}
      className="relative w-full max-w-7xl mx-auto select-none overflow-visible"
    >
      {/* ========================================================================= */}
      {/* BACKGROUND AMBIENCE & COMPOSITING DOT GRID                                */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft central cyan glow */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full bg-[#66fcf1]/[0.07] blur-[120px]"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Nuke / Fusion dot matrix grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#66fcf1_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />

        {/* Subtle Ambient VFX industry floating tool marks (10% - 18% opacity) */}
        <div className="absolute top-[8%] left-[24%] opacity-15 text-[#66fcf1] animate-float-slow">
          <Paintbrush className="w-8 h-8 stroke-[1.2]" />
        </div>
        <div className="absolute top-[12%] right-[24%] opacity-15 text-white animate-float-reverse">
          <Eraser className="w-7 h-7 stroke-[1.2]" />
        </div>
        <div className="absolute bottom-[20%] left-[22%] opacity-15 text-white animate-float-gentle">
          <Scissors className="w-7 h-7 stroke-[1.2] rotate-45" />
        </div>
        <div className="absolute bottom-[22%] right-[22%] opacity-18 text-[#66fcf1] animate-float-slow">
          <MousePointer2 className="w-8 h-8 stroke-[1.2] -rotate-12" />
        </div>
        <div className="absolute top-[48%] left-[32%] opacity-12 text-[#66fcf1] animate-float-reverse">
          <ZoomIn className="w-7 h-7 stroke-[1.2]" />
        </div>
        <div className="absolute top-[50%] right-[32%] opacity-15 text-[#66fcf1] animate-float-gentle">
          <PenTool className="w-7 h-7 stroke-[1.2] -rotate-45" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SVG NUKE / FUSION STYLE NODE CABLES                                       */}
      {/* ========================================================================= */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Intense Neon Glow for Active Node Cable */}
          <filter id="nukeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="nukeActiveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#66fcf1" stopOpacity="1" />
            <stop offset="100%" stopColor="#45a29e" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="nukeIdleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#66fcf1" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#66fcf1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1a3b5c" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Render Each Nuke / Fusion Node Cable */}
        {cablePaths.map((cable) => (
          <g key={`cable-group-${cable.id}`}>
            {/* 1. Base dark cable sheath pipe */}
            <path
              d={cable.path}
              stroke="#020509"
              strokeWidth={cable.isHovered ? 6 : 4}
              strokeLinecap="round"
              fill="none"
              opacity={0.9}
            />

            {/* 2. Primary colored node connection cable */}
            <path
              d={cable.path}
              stroke={cable.isHovered ? 'url(#nukeActiveGrad)' : 'url(#nukeIdleGrad)'}
              strokeWidth={cable.isHovered ? 3 : 1.8}
              strokeLinecap="round"
              fill="none"
              filter={cable.isHovered ? 'url(#nukeGlow)' : undefined}
              className="transition-all duration-300"
            />

            {/* 3. Real-time animated data transmission pulses */}
            <path
              d={cable.path}
              stroke="#ffffff"
              strokeWidth={cable.isHovered ? 3 : 1.5}
              strokeLinecap="round"
              fill="none"
              className="animate-cable-pulse"
              opacity={cable.isHovered ? 0.95 : 0.35}
            />

            {/* 4. Nuke Node In/Out Terminal Pins */}
            {/* Hub Exit Pin */}
            <circle
              cx={cable.hubPinX}
              cy={cable.hubPinY}
              r={cable.isHovered ? 4 : 2.5}
              fill="#66fcf1"
              stroke="#04080e"
              strokeWidth={1.5}
              filter={cable.isHovered ? 'url(#nukeGlow)' : undefined}
            />

            {/* Node Input Pin (Nuke-style circular socket connector) */}
            <circle
              cx={cable.targetPinX}
              cy={cable.targetPinY}
              r={cable.isHovered ? 5 : 3.5}
              fill="#060d17"
              stroke="#66fcf1"
              strokeWidth={1.8}
              filter={cable.isHovered ? 'url(#nukeGlow)' : undefined}
            />
            <circle
              cx={cable.targetPinX}
              cy={cable.targetPinY}
              r={cable.isHovered ? 2 : 1.2}
              fill="#66fcf1"
            />
          </g>
        ))}
      </svg>

      {/* ========================================================================= */}
      {/* CENTRAL BRAND HUB: PROPERLY PROPORTIONED CENTRAL CIRCLE & LOGO            */}
      {/* ========================================================================= */}
      <div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
        style={{
          left: `${centerPos.x}px`,
          top: `${centerPos.y}px`,
        }}
      >
        {/* Central Circle Container (Diameter: 128px on mobile, 180px on tablet, 240px on desktop) */}
        <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-60 lg:h-60 flex items-center justify-center">
          {/* Subtle Ambient Backglow strictly hugging the hub */}
          <div className="absolute inset-0 rounded-full bg-[#66fcf1]/20 blur-xl pointer-events-none animate-pulse" />

          {/* Central Hub Circle with Pure Black Backdrop & Cyan Border */}
          <div className="relative w-full h-full rounded-full bg-[#000000] border-2 border-[#66fcf1] p-2.5 sm:p-4 md:p-5 lg:p-6 flex items-center justify-center text-center shadow-[0_0_30px_rgba(102,252,241,0.45)] group cursor-default overflow-hidden">
            {/* Pure black background disc */}
            <div className="absolute inset-0 rounded-full bg-[#000000]" />

            {/* Specular Curved Top Glass Sheen */}
            <div className="absolute top-0 left-2 right-2 h-1/2 rounded-t-full bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none opacity-60" />

            {/* BIG Roto Paint Wala Logo prominently centered */}
            <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <RotoLogo size="hero" className="w-full h-full max-w-[85%] max-h-[85%]" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PARTNER NODES: CLEANLY ALIGNED SATELLITE HUBS (ZERO OVERLAP)             */}
      {/* ========================================================================= */}
      {nodes.map((node) => {
        const isHovered = hoveredNodeId === node.id;
        const px = (node.posX / 100) * dimensions.width;
        const py = (node.posY / 100) * dimensions.height;

        return (
          <div
            key={`studio-node-${node.id}`}
            onMouseEnter={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
            onClick={() => onPartnerClick(node.partner)}
            style={{
              left: `${px}px`,
              top: `${py}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute cursor-pointer pointer-events-auto group focus:outline-none transition-all duration-300 ${
              isHovered ? 'z-40' : 'z-30'
            }`}
          >
            {/* Outer Cyan Glow on Hover */}
            <div
              className={`absolute -inset-4 rounded-full transition-all duration-300 pointer-events-none ${
                isHovered
                  ? 'bg-[#66fcf1]/35 blur-xl scale-125 opacity-100'
                  : 'bg-[#66fcf1]/5 blur-md opacity-25 group-hover:opacity-75'
              }`}
            />

            {/* Node ID Badge Pill (e.g. NODE #01) */}
            <div 
              className={`absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-extrabold tracking-wider uppercase border transition-all duration-300 shadow-lg whitespace-nowrap z-30 ${
                isHovered
                  ? 'bg-[#66fcf1] text-[#04080e] border-[#66fcf1] shadow-[0_0_12px_rgba(102,252,241,0.6)] -translate-y-1.5'
                  : 'bg-[#060e18]/90 text-[#66fcf1] border-[#66fcf1]/30 group-hover:border-[#66fcf1]'
              }`}
            >
              NODE #{String(node.id + 1).padStart(2, '0')}
            </div>

            {/* THE ENTIRE CIRCULAR CONTAINER WITH PURE BLACK BACKDROP & LOGO */}
            <div
              className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center p-2 sm:p-2.5 md:p-3 border-2 transition-all duration-300 ease-out overflow-hidden shadow-2xl origin-center ${
                isHovered
                  ? 'scale-[1.5] sm:scale-[1.8] md:scale-[2.0] border-[#66fcf1] bg-black shadow-[0_0_35px_rgba(102,252,241,0.65)] ring-2 ring-[#66fcf1]/50'
                  : 'scale-100 border-[#66fcf1]/35 bg-black hover:border-[#66fcf1]/80 shadow-[0_0_20px_rgba(0,0,0,0.8)]'
              }`}
            >
              {/* Solid Pure Black Internal Backdrop so logos look crisp and vivid */}
              <div className="absolute inset-0 rounded-full bg-[#000000]" />

              {/* Specular Curved Top Glass Sheen */}
              <div className="absolute top-0 left-2 right-2 h-1/2 rounded-t-full bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none opacity-70" />

              {/* LIGHT SWEEP GLOSSY EFFECT BEAM */}
              <div className="absolute -inset-full w-[300%] h-[300%] pointer-events-none overflow-hidden">
                <div
                  className={`w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transform -rotate-45 transition-transform duration-700 ${
                    isHovered
                      ? 'translate-x-full opacity-100'
                      : 'animate-light-sweep opacity-30'
                  }`}
                />
              </div>

              {/* BRAND LOGO (Scales smoothly along with circular container) */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                {node.partner.logo ? (
                  <img
                    src={node.partner.logo}
                    alt={node.partner.studioName}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all duration-300 group-hover:brightness-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-xs sm:text-sm font-bold text-[#66fcf1] font-heading text-center leading-tight tracking-wider">${node.partner.studioName.slice(0, 7)}</span>`;
                      }
                    }}
                  />
                ) : (
                  <Building2 className="w-9 h-9 text-[#66fcf1]" />
                )}
              </div>
            </div>

            {/* Contextual Hover Tooltip HUD */}
            {isHovered && (
              <div
                className={`absolute z-50 pointer-events-none transition-all duration-200 ease-out top-1/2 -translate-y-1/2 ${
                  node.side === 'left' 
                    ? 'left-full ml-14' 
                    : 'right-full mr-14'
                }`}
              >
                <div className="relative px-3.5 py-2.5 rounded-xl bg-[#03070d]/95 border border-[#66fcf1] text-white shadow-[0_0_25px_rgba(102,252,241,0.45)] backdrop-blur-xl min-w-[170px] max-w-[220px] text-center animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-[#66fcf1] uppercase tracking-wider mb-0.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1] animate-pulse" />
                    <span>NODE #{String(node.id + 1).padStart(2, '0')} • ACTIVE</span>
                  </div>

                  <h5 className="font-heading font-bold text-xs sm:text-sm text-white leading-tight truncate">
                    {node.partner.studioName}
                  </h5>

                  <p className="text-[10px] text-[#9daab4] truncate mt-0.5">
                    {node.partner.speciality || 'VFX Support & Rotoscopy'}
                  </p>

                  <div className="mt-1.5 pt-1 border-t border-white/10 flex items-center justify-center gap-1 text-[9px] font-mono text-[#66fcf1] font-bold">
                    <span>CONNECT VIA RPW</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ========================================================================= */}
      {/* BOTTOM UNIFIED PIPELINE TELEMETRY BAR                                    */}
      {/* ========================================================================= */}
      <div className="absolute -bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none z-20 text-[10px] sm:text-[11px] font-mono text-[#71818b]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#66fcf1] animate-pulse" />
          <span className="text-white/80 font-bold">UNIFIED PIPELINE STANDARD</span>
          <span className="hidden sm:inline text-white/40">• {displayPartners.length} Verified Production Nodes Synchronized</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-[#66fcf1] font-bold">~12H SLA</span>
          <span className="text-white/50 hidden sm:inline">100% QC APPROVED</span>
        </div>
      </div>
    </div>
  );
};
