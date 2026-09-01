import React, { useState } from 'react';
import { SERVICES_LIST } from '../data/mockData';
import { ServiceItem } from '../types';
import { ArrowRight, ChevronDown, Check, Wrench, Package } from 'lucide-react';

interface ServicesSectionProps {
  onOpenTestShotModal: (serviceName?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenTestShotModal }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="services" className="py-24 sm:py-32 px-4 sm:px-8 md:px-12 relative z-10 border-t border-[#66fcf1]/15">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[#66fcf1] text-xs font-extrabold uppercase tracking-[0.2em] mb-3">
              <span className="w-5 h-[1px] bg-[#66fcf1]" />
              <span>WHAT WE DO</span>
            </div>
            <h2 className="font-heading text-white text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight">
              The invisible <br />
              <span className="text-[#66fcf1]">craft.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#9daab4] leading-relaxed">
            Precision work built for the shots that cannot afford mistakes. Click any discipline to explore
            deliverable formats and software tooling.
          </p>
        </div>

        {/* Service List */}
        <div className="border-t border-white/10 divide-y divide-white/10">
          {SERVICES_LIST.map((service, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={service.number}
                className={`group transition-all duration-300 ${
                  isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.015]'
                }`}
              >
                {/* Main Row Header */}
                <div
                  onClick={() => toggleExpand(index)}
                  className="py-6 sm:py-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-center gap-6 sm:gap-10">
                    <span className="text-[#66fcf1] font-mono text-sm sm:text-base font-bold tracking-widest">
                      {service.number}
                    </span>
                    <h3 className="font-heading text-white text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight group-hover:text-[#66fcf1] group-hover:translate-x-2 transition-all duration-300">
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pl-12 md:pl-0">
                    <p className="text-xs sm:text-sm text-[#9daab4] max-w-sm md:text-right hidden sm:block">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTestShotModal(service.title);
                        }}
                        className="opacity-0 group-hover:opacity-100 hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-[#66fcf1] bg-[#66fcf1]/10 border border-[#66fcf1]/30 transition-all duration-200"
                      >
                        BOOK THIS
                      </button>
                      <div
                        className={`w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 group-hover:text-[#66fcf1] group-hover:border-[#66fcf1] transition-all duration-300 ${
                          isExpanded ? 'rotate-180 bg-[#66fcf1]/10 text-[#66fcf1] border-[#66fcf1]' : ''
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="pb-8 pt-2 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-[#66fcf1] mb-3">
                        <Package className="w-3.5 h-3.5" />
                        <span>Deliverable Standards</span>
                      </div>
                      <ul className="space-y-2">
                        {service.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-[#9daab4]">
                            <Check className="w-3.5 h-3.5 text-[#66fcf1]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-[#45a29e] mb-3">
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Industry Suite & Tools</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.tools.map((tool, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-white/90"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenTestShotModal(service.title)}
                        className="self-start inline-flex items-center gap-2 text-xs font-bold text-[#66fcf1] hover:underline"
                      >
                        <span>Start {service.title} Project Intake</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
