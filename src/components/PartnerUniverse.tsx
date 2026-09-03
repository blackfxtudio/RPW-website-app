import React, { useEffect, useState } from 'react';
import { PartnerStudio } from '../types';
import { 
  Paintbrush, 
  Eraser, 
  Scissors, 
  MousePointer2, 
  ZoomIn, 
  Pipette, 
  PenTool, 
  Layers, 
  Crop, 
  Wand2, 
  Crosshair,
  Edit3,
  CheckCircle2,
  X,
  Sparkles,
  Send
} from 'lucide-react';
import { InfographicNetwork } from './InfographicNetwork';
import { useSiteConfig } from '../context/SiteConfigContext';

interface PartnerUniverseProps {
  onShowToast: (message: string) => void;
  onUpdatePartnerCount: (count: number) => void;
}

export const PartnerUniverse: React.FC<PartnerUniverseProps> = ({ onShowToast, onUpdatePartnerCount }) => {
  const { config, isEditorOpen, setActiveEditTarget } = useSiteConfig();
  const [popupNotice, setPopupNotice] = useState<{
    open: boolean;
    studioName: string;
    logo?: string;
  } | null>(null);

  const partners = config.partners;

  useEffect(() => {
    onUpdatePartnerCount(partners.length);
  }, [partners.length, onUpdatePartnerCount]);

  // Auto-dismiss popup after 4.5 seconds
  useEffect(() => {
    if (!popupNotice?.open) return;
    const timer = setTimeout(() => {
      setPopupNotice(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [popupNotice]);

  const handlePartnerClick = async (partner: PartnerStudio) => {
    const studioName = partner.studioName || 'Partner Studio';

    // 1. Immediately display the requested popup message
    setPopupNotice({
      open: true,
      studioName,
      logo: partner.logo,
    });
    onShowToast('Thankyou for your interest we will notify our partnered studio');

    // 2. Dispatch secure server-side email notifications
    try {
      fetch('/api/partner/notify-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studioName: partner.studioName || '',
          partnerEmail: partner.email || '',
          website: partner.website || '',
          region: partner.region || '',
          speciality: partner.speciality || '',
        }),
      }).catch((err) => {
        console.warn('[RPW-NETWORK] Notice dispatch caught:', err);
      });
    } catch (err) {
      console.warn('[RPW-NETWORK] Failed to notify backend:', err);
    }
  };

  return (
    <section id="partners" className="py-20 sm:py-28 px-4 sm:px-8 md:px-12 relative z-10 overflow-hidden">
      {/* ========================================================================= */}
      {/* POPUP MODAL: "THANK YOU FOR YOUR INTEREST WE WILL NOTIFY OUR PARTNERED STUDIO" */}
      {/* ========================================================================= */}
      {popupNotice?.open && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPopupNotice(null)}
        >
          <div 
            className="relative w-full max-w-md bg-[#08111a] border-2 border-[#66fcf1] rounded-2xl p-6 sm:p-7 shadow-[0_0_50px_rgba(102,252,241,0.35)] text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setPopupNotice(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon & Studio Logo Header */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-[#66fcf1]/10 border-2 border-[#66fcf1] flex items-center justify-center shadow-[0_0_20px_rgba(102,252,241,0.4)]">
                {popupNotice.logo ? (
                  <img src={popupNotice.logo} alt={popupNotice.studioName} className="w-9 h-9 object-contain" />
                ) : (
                  <CheckCircle2 className="w-7 h-7 text-[#66fcf1]" />
                )}
              </div>
            </div>

            {/* Studio Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/30 text-[#66fcf1] text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#66fcf1]" />
              <span>{popupNotice.studioName}</span>
            </div>

            {/* The exact requested popup message */}
            <h3 className="font-heading text-lg sm:text-xl font-bold text-white leading-snug mb-2">
              Thankyou for your interest we will notify our partnered studio
            </h3>

            <p className="text-xs sm:text-sm text-[#9daab4] leading-relaxed mb-6 font-sans">
              An automated notification has been dispatched to the studio production desk and RPW Network Dispatch (<code className="text-[#66fcf1]">rotopaintwala@gmail.com</code>).
            </p>

            {/* Action button */}
            <button
              onClick={() => setPopupNotice(null)}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#66fcf1] to-[#45a29e] text-[#05070b] font-heading font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(102,252,241,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Got it, Thank You</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING VFX INDUSTRY BACKGROUND ICONS (Subtle 10-15% Opacity)              */}
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
        {/* In-place edit button for admin */}
        {isEditorOpen && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setActiveEditTarget('partners')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#66fcf1] text-[#05070b] text-xs font-bold shadow-[0_0_15px_rgba(102,252,241,0.4)] cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Network</span>
            </button>
          </div>
        )}

        {/* Unified Side-by-Side Section: Left Tagline/Content, Right Interactive Web */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: TAGLINE & 2-LINE DESCRIPTION ONLY                            */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center text-left space-y-6">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-[#66fcf1] text-xs font-extrabold uppercase tracking-[0.2em]">
              <span className="w-5 h-[2px] bg-[#66fcf1]" />
              <span>{config.partnerEyebrow}</span>
            </div>

            {/* Main Section Heading: Maximum bandwidth At One Place */}
            <h2 className="font-poppins text-white text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08]">
              <span>Maximum bandwidth</span>{' '}
              <br />
              <span className="text-[#66fcf1]">At One Place</span>
            </h2>

            {/* 2-Line Subtitle Description */}
            <p className="text-sm sm:text-base text-[#9daab4] leading-relaxed font-sans max-w-lg">
              {config.partnerDescription}
            </p>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: CLEAR INTERACTIVE NETWORK WEB (NO CARD / NO CONTAINER)       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 xl:col-span-7 w-full animate-in fade-in duration-500">
            <InfographicNetwork
              partners={partners}
              onPartnerClick={handlePartnerClick}
            />
          </div>

        </div>
      </div>
    </section>
  );
};
