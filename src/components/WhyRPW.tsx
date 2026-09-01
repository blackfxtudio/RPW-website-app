import React from 'react';
import { Layers, ShieldCheck, Zap, Lock, Compass, Users } from 'lucide-react';

export const WhyRPW: React.FC = () => {
  const pillars = [
    {
      number: '01 / BANDWIDTH',
      title: 'Scale when you need it.',
      description:
        'Access a wider verified artist network when the deadline gets tighter and the shot count spikes from 10 to 100+ frames.',
      icon: Users,
    },
    {
      number: '02 / CONTROL',
      title: 'One accountable partner.',
      description:
        'You work directly with RPW supervision while we orchestrate artists, partner studios, dual-pass quality checks and delivery.',
      icon: Compass,
    },
    {
      number: '03 / SECURITY',
      title: 'NDA-first workflow.',
      description:
        'Project confidentiality, watermarked plate routing, and air-gapped production handling are built into every pipeline step.',
      icon: Lock,
    },
    {
      number: '04 / SPEED',
      title: 'Production cycles built around deadlines.',
      description:
        'Our distributed 12-hour shift structure delivers clean passes while your local composite team sleeps, unlocking round-the-clock momentum.',
      icon: Zap,
    },
  ];

  return (
    <section id="why" className="py-24 sm:py-32 px-4 sm:px-8 md:px-12 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Intro */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2.5 text-[#66fcf1] text-xs font-extrabold uppercase tracking-[0.2em] mb-3">
            <span className="w-5 h-[1px] bg-[#66fcf1]" />
            <span>WHY RPW</span>
          </div>
          <h2 className="font-heading text-white text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight">
            Built for <br />
            <span className="text-[#66fcf1]">production pressure.</span>
          </h2>
        </div>

        {/* 2x2 Grid with high-contrast borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/10 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <article
                key={idx}
                className="group relative min-h-[280px] p-8 sm:p-10 bg-[#070a0f] hover:bg-[#0a1118] transition-all duration-400 flex flex-col justify-between overflow-hidden"
              >
                {/* Hover ambient light */}
                <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-[#66fcf1] blur-[90px] opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#66fcf1] font-mono text-xs font-extrabold tracking-widest">
                      {pillar.number}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#66fcf1]/60 group-hover:text-[#66fcf1] group-hover:bg-[#66fcf1]/10 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-heading text-white text-2xl sm:text-3xl font-bold tracking-tight mt-10 group-hover:text-[#66fcf1] transition-colors">
                    {pillar.title}
                  </h3>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-[#9daab4] leading-relaxed max-w-md">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
