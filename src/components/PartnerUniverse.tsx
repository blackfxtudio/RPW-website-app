import React, { useState, useEffect } from 'react';
import { PartnerStudio } from '../types';
import { 
  ShieldCheck, 
  Mail, 
  Globe, 
  Search, 
  Sparkles, 
  Building2, 
  Network, 
  LayoutGrid, 
  Radio,
  Paintbrush,
  Eraser,
  Scissors,
  MousePointer2,
  ZoomIn,
  Pipette,
  PenTool,
  Layers,
  Crop,
  Sliders,
  Crosshair,
  Wand2,
  Edit3
} from 'lucide-react';
import { InfographicNetwork } from './InfographicNetwork';
import { useSiteConfig } from '../context/SiteConfigContext';

interface PartnerUniverseProps {
  onShowToast: (message: string) => void;
  onUpdatePartnerCount: (count: number) => void;
}

const RPW_API = 'https://script.google.com/macros/s/AKfycbw-x93k8hVJYRNg8AsBILa9s7xSHb-egJ6-ilxK9iXEV4LkvtqMH7u1N0xVWeQv0DjO/exec';

export const PartnerUniverse: React.FC<PartnerUniverseProps> = ({ onShowToast, onUpdatePartnerCount }) => {
  const { config, isEditorOpen, setActiveEditTarget } = useSiteConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'infographic' | 'grid'>('infographic');

  const partners = config.partners;

  useEffect(() => {
    onUpdatePartnerCount(partners.length);
  }, [partners.length, onUpdatePartnerCount]);

  const notifyPartnerClick = async (partner: PartnerStudio) => {
    try {
      fetch(RPW_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          studioName: partner.studioName || '',
          email: partner.email || '',
          website: partner.website || '',
        }),
      }).catch((err) => console.log('Partner beacon notice:', err));
    } catch (err) {
      console.log('Notification beacon err:', err);
    }
  };

  const handlePartnerClick = (partner: PartnerStudio) => {
    notifyPartnerClick(partner);

    if (!partner.email || partner.email === 'tom@blackfx.net') {
      onShowToast(`Dispatching inquiry to RPW Network Central Dispatch for ${partner.studioName}`);
      window.open(
        `mailto:tom@blackfx.net?subject=${encodeURIComponent(
          `RPW Network Allocation — ${partner.studioName}`
        )}&body=${encodeURIComponent(
          `Hi RPW Dispatch,\n\nI would like to allocate VFX shots with ${partner.studioName} through the Roto Paint Wala production pipeline.\n\nProject Brief:\n- Target Shot Count:\n- Service: Rotoscopy / Digital Paint / Cleanup\n- Delivery Deadline:\n\nBest Regards,`
        )}`,
        '_blank'
      );
      return;
    }

    const studioName = partner.studioName || 'Partner Studio';
    const subject = encodeURIComponent(`Roto Paint Wala Network — Collaboration with ${studioName}`);
    const body = encodeURIComponent(
      `Hi ${studioName},\n\nI came across your studio through the Roto Paint Wala collective network and would like to discuss an active production collaboration.\n\nProject Details:\n- Shot Volume:\n- Resolution:\n- Target Delivery Date:\n\nBest,\n`
    );

    window.open(`mailto:${encodeURIComponent(partner.email)}?subject=${subject}&body=${body}`, '_blank');
    onShowToast(`Dispatching collaboration email to ${studioName}`);
  };

  const filteredPartners = partners.filter(
    (p) =>
      p.studioName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.speciality && p.speciality.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.region && p.region.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section id="partners" className="py-20 sm:py-28 px-4 sm:px-8 md:px-12 relative z-10 overflow-hidden">
      {/* ========================================================================= */}
      {/* FLOATING VFX INDUSTRY BACKGROUND ICONS (10% - 20% Opacity)                 */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Paint tool (Top Left) */}
        <div className="absolute top-[8%] left-[4%] opacity-15 text-[#66fcf1] animate-float-slow">
          <Paintbrush className="w-12 h-12 md:w-16 md:h-16 stroke-[1.2]" />
        </div>

        {/* Eraser tool (Top Right) */}
        <div className="absolute top-[12%] right-[6%] opacity-15 text-[#66fcf1] animate-float-reverse">
          <Eraser className="w-11 h-11 md:w-14 md:h-14 stroke-[1.2]" />
        </div>

        {/* Scissors tool (Mid-Upper Left) */}
        <div className="absolute top-[35%] left-[2%] opacity-15 text-white animate-float-gentle">
          <Scissors className="w-10 h-10 md:w-12 md:h-12 stroke-[1.2] rotate-12" />
        </div>

        {/* Arrow Selection tool (Mid-Upper Right) */}
        <div className="absolute top-[38%] right-[3%] opacity-20 text-[#66fcf1] animate-float-slow">
          <MousePointer2 className="w-12 h-12 md:w-14 md:h-14 stroke-[1.2] -rotate-12" />
        </div>

        {/* Magnifying Glass Zoom tool (Mid-Lower Left) */}
        <div className="absolute top-[65%] left-[5%] opacity-15 text-[#66fcf1] animate-float-reverse">
          <ZoomIn className="w-12 h-12 md:w-16 md:h-16 stroke-[1.2]" />
        </div>

        {/* Pen / Bezier Spline Tool (Mid-Lower Right) */}
        <div className="absolute top-[68%] right-[5%] opacity-20 text-white animate-float-gentle">
          <PenTool className="w-11 h-11 md:w-14 md:h-14 stroke-[1.2] -rotate-45" />
        </div>

        {/* Eyedropper / Pipette Tool (Bottom Left) */}
        <div className="absolute bottom-[6%] left-[8%] opacity-15 text-[#66fcf1] animate-float-slow">
          <Pipette className="w-10 h-10 md:w-12 md:h-12 stroke-[1.2] rotate-45" />
        </div>

        {/* Multi-Layer Comping Tool (Bottom Right) */}
        <div className="absolute bottom-[8%] right-[8%] opacity-15 text-[#66fcf1] animate-float-reverse">
          <Layers className="w-11 h-11 md:w-14 md:h-14 stroke-[1.2]" />
        </div>

        {/* Crop Frame Tool (Top Center-Left) */}
        <div className="absolute top-[4%] left-[28%] opacity-10 text-white animate-float-gentle">
          <Crop className="w-9 h-9 md:w-11 md:h-11 stroke-[1.2]" />
        </div>

        {/* Magic Wand Tool (Top Center-Right) */}
        <div className="absolute top-[6%] right-[25%] opacity-15 text-[#66fcf1] animate-float-slow">
          <Wand2 className="w-10 h-10 md:w-12 md:h-12 stroke-[1.2] rotate-45" />
        </div>

        {/* VFX Crosshair Target (Bottom Center) */}
        <div className="absolute bottom-[4%] left-[48%] opacity-10 text-[#66fcf1] animate-float-gentle">
          <Crosshair className="w-10 h-10 stroke-[1.2]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading with Poppins Bold & updated Tagline */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14 relative">
          {/* In-place edit button */}
          {isEditorOpen && (
            <div className="absolute top-0 right-0">
              <button
                onClick={() => setActiveEditTarget('partners')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#66fcf1] text-[#05070b] text-xs font-bold shadow-[0_0_15px_rgba(102,252,241,0.4)]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Network</span>
              </button>
            </div>
          )}

          <div className="inline-flex items-center justify-center gap-2.5 text-[#66fcf1] text-xs font-extrabold uppercase tracking-[0.2em] mb-3">
            <span className="w-5 h-[1px] bg-[#66fcf1]" />
            <span>{config.partnerEyebrow}</span>
            <span className="w-5 h-[1px] bg-[#66fcf1]" />
          </div>
          
          {/* TAGLINE in Poppins Bold */}
          <h2 className="font-poppins text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            <span>{config.partnerTagline.replace(config.partnerTaglineHighlight, '').trim()}</span>{' '}
            <br className="hidden sm:inline" />
            <span className="text-[#66fcf1]">{config.partnerTaglineHighlight}</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#9daab4] leading-relaxed max-w-xl mx-auto font-sans">
            {config.partnerDescription}
          </p>

          {/* Controls Bar: Search + View Mode Switcher */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            {/* Search input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter studios by discipline, region..."
                className="w-full bg-[#08111a] border border-[#66fcf1]/20 rounded-full pl-11 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#66fcf1] focus:ring-1 focus:ring-[#66fcf1] transition-all"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex items-center p-1 bg-[#08111a] border border-[#66fcf1]/20 rounded-full shrink-0">
              <button
                onClick={() => setViewMode('infographic')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  viewMode === 'infographic'
                    ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_15px_rgba(102,252,241,0.35)]'
                    : 'text-[#9daab4] hover:text-white'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Network Map</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_15px_rgba(102,252,241,0.35)]'
                    : 'text-[#9daab4] hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Matrix Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* View 1: Infographic Network View */}
        {viewMode === 'infographic' ? (
          <div className="animate-in fade-in duration-500">
            <InfographicNetwork
              partners={filteredPartners.length > 0 ? filteredPartners : partners}
              onPartnerClick={handlePartnerClick}
            />
          </div>
        ) : (
          /* View 2: Matrix Grid Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
            {(filteredPartners.length > 0 ? filteredPartners : partners).map((partner, index) => (
              <div
                key={`${partner.studioName}-${index}`}
                onClick={() => handlePartnerClick(partner)}
                className="group relative bg-[#08111a]/80 border border-[#66fcf1]/20 hover:border-[#66fcf1] rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(102,252,241,0.15)] cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    {partner.logo ? (
                      <div className="w-12 h-12 rounded-lg bg-black border border-white/10 p-2 flex items-center justify-center overflow-hidden">
                        <img
                          src={partner.logo}
                          alt={partner.studioName}
                          className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLElement).parentElement;
                            if (parent) parent.innerHTML = '<span class="text-xs font-bold text-[#66fcf1]">RPW</span>';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-black border border-white/10 flex items-center justify-center text-[#66fcf1]">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/30 text-[10px] font-mono text-[#66fcf1] uppercase font-bold tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1] animate-pulse" />
                      NODE #{String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="font-heading text-white text-base font-bold group-hover:text-[#66fcf1] transition-colors leading-snug">
                    {partner.studioName}
                  </h3>

                  <p className="text-xs text-[#9daab4] mt-1 line-clamp-2">
                    {partner.speciality || 'Rotoscopy & Digital Paint Work'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#66fcf1]">
                  <span>{partner.region || 'Global Hub'}</span>
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                    CONNECT &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
