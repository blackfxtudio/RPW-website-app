import React from 'react';

export const Ticker: React.FC = () => {
  const items = [
    'KEYING',
    'VFX SUPPORT',
    'ROTOSCOPY',
    'DIGITAL PAINT',
    'CLEANUP',
    'MATCHMOVE',
    'WIRE REMOVAL',
    'HAIR MATTES',
  ];

  return (
    <div className="w-full border-y border-[#66fcf1]/20 bg-[#66fcf1]/[0.03] overflow-hidden whitespace-nowrap py-4 sm:py-5 select-none relative z-10">
      <div className="w-max flex animate-ticker">
        {/* Track 1 */}
        <div className="flex items-center gap-8 sm:gap-12 px-6">
          {items.map((item, idx) => (
            <div
              key={`t1-${idx}`}
              className="flex items-center gap-8 sm:gap-12 font-heading font-bold text-xs sm:text-sm tracking-[0.2em] text-white"
            >
              <span>{item}</span>
              <span className="text-[#66fcf1] font-mono text-sm sm:text-base">✦</span>
            </div>
          ))}
        </div>

        {/* Track 2 duplicate for infinite seamless loop */}
        <div className="flex items-center gap-8 sm:gap-12 px-6">
          {items.map((item, idx) => (
            <div
              key={`t2-${idx}`}
              className="flex items-center gap-8 sm:gap-12 font-heading font-bold text-xs sm:text-sm tracking-[0.2em] text-white"
            >
              <span>{item}</span>
              <span className="text-[#66fcf1] font-mono text-sm sm:text-base">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
