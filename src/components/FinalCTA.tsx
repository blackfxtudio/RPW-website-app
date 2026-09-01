import React from 'react';
import { ArrowUpRight, Zap, Film } from 'lucide-react';

interface FinalCTAProps {
  onOpenTestShotModal: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenTestShotModal }) => {
  return (
    <section id="contact" className="py-28 sm:py-40 px-4 sm:px-8 md:px-12 relative z-10 text-center overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#66fcf1]/10 blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center justify-center gap-2.5 text-[#66fcf1] text-xs font-extrabold uppercase tracking-[0.25em] mb-6">
          <span className="w-6 h-[1px] bg-[#66fcf1]" />
          <span>READY WHEN YOU ARE</span>
          <span className="w-6 h-[1px] bg-[#66fcf1]" />
        </div>

        <h2 className="font-heading text-white text-6xl sm:text-8xl md:text-9xl lg:text-[130px] font-black tracking-[-0.05em] leading-[0.85] mb-8">
          GOT <br />
          <span className="text-[#66fcf1]">FRAMES?</span>
        </h2>

        <p className="text-base sm:text-lg text-[#b6c1c8] leading-relaxed max-w-lg mx-auto mb-10">
          Bring us the difficult shots. We'll bring the artists, technical QC, and production bandwidth to make them work.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://app.rotopaintwala.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#66fcf1] text-[#05070b] text-xs sm:text-sm font-extrabold tracking-wider uppercase hover:shadow-[0_0_40px_rgba(102,252,241,0.5)] hover:-translate-y-1 transition-all duration-300"
          >
            <span>START WITH RPW CONNECT</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenTestShotModal}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/[0.04] text-white border border-white/20 hover:border-[#66fcf1] hover:text-[#66fcf1] text-xs sm:text-sm font-bold tracking-wider uppercase backdrop-blur-md transition-all duration-300"
          >
            <Zap className="w-4 h-4 text-[#66fcf1]" />
            <span>SUBMIT TEST SHOT BRIEF</span>
          </button>
        </div>
      </div>
    </section>
  );
};
