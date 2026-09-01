import React from 'react';

interface StatsCounterProps {
  partnerCount: number;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({ partnerCount }) => {
  const stats = [
    { value: '100+', label: 'Artists / Network' },
    { value: String(partnerCount).padStart(2, '0'), label: 'Partner Studios' },
    { value: '12H', label: 'Production Cycle' },
    { value: '01', label: 'Unified Workflow' },
  ];

  return (
    <section className="border-y border-[#66fcf1]/20 bg-[#66fcf1]/[0.015] relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#66fcf1]/20">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-8 sm:p-12 text-center md:text-left">
              <strong className="block font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#66fcf1] tracking-[-0.04em]">
                {stat.value}
              </strong>
              <span className="block mt-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#8d9aa3]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
