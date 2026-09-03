import React from 'react';
import { ArrowUpRight, Zap, MessageSquare } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface FinalCTAProps {
  onOpenTestShotModal: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenTestShotModal }) => {
  const { config } = useSiteConfig();
  const whatsappLink = config.whatsappUrl || 'https://wa.me/919876543210?text=Hello%20Roto%20Paint%20Wala%20Team%2C%20I%20would%20like%20to%20discuss%20a%20VFX%20Project';

  return (
    <section id="contact" className="py-24 sm:py-36 md:py-40 px-4 sm:px-8 md:px-12 relative z-10 text-center overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#66fcf1]/10 blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center justify-center gap-2.5 text-[#66fcf1] text-xs font-extrabold uppercase tracking-[0.25em] mb-6">
          <span className="w-6 h-[1px] bg-[#66fcf1]" />
          <span>READY WHEN YOU ARE</span>
          <span className="w-6 h-[1px] bg-[#66fcf1]" />
        </div>

        <h2 className="font-heading text-white text-5xl sm:text-7xl md:text-9xl lg:text-[130px] font-black tracking-[-0.05em] leading-[0.9] sm:leading-[0.85] mb-6 sm:mb-8">
          GOT <br />
          <span className="text-[#66fcf1]">FRAMES?</span>
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-[#b6c1c8] leading-relaxed max-w-lg mx-auto mb-8 sm:mb-10 px-2">
          {config.finalCtaDescription || "Bring us the difficult shots. We'll bring the artists, technical QC, and production bandwidth to make them work."}
        </p>

        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          {/* RPW Connect Portal Button */}
          <a
            href={config.connectPortalUrl || "https://app.rotopaintwala.com/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#66fcf1] text-[#05070b] text-xs sm:text-sm font-extrabold tracking-wider uppercase hover:shadow-[0_0_40px_rgba(102,252,241,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <span>{config.finalCtaPrimaryText || 'START WITH RPW CONNECT'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          {/* WhatsApp Direct Dispatch Button */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-all duration-300"
          >
            {/* WhatsApp Official SVG */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>CHAT ON WHATSAPP</span>
          </a>

          {/* Test Shot Brief Button */}
          <button
            onClick={onOpenTestShotModal}
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-white/[0.04] text-white border border-white/20 hover:border-[#66fcf1] hover:text-[#66fcf1] text-xs sm:text-sm font-bold tracking-wider uppercase backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <Zap className="w-4 h-4 text-[#66fcf1]" />
            <span>{config.finalCtaSecondaryText || 'SUBMIT TEST SHOT BRIEF'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
