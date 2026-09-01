import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 px-4 sm:px-8 md:px-12 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2.5 text-[#66fcf1] text-xs font-extrabold uppercase tracking-[0.2em] mb-3">
            <span className="w-5 h-[1px] bg-[#66fcf1]" />
            <span>QUESTIONS</span>
            <span className="w-5 h-[1px] bg-[#66fcf1]" />
          </div>
          <h2 className="font-heading text-white text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight">
            Things people <br />
            <span className="text-[#66fcf1]">ask us.</span>
          </h2>
        </div>

        {/* FAQ Items List */}
        <div className="border-t border-white/10 divide-y divide-white/10">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="transition-colors duration-200">
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full py-6 flex items-center justify-between gap-4 text-left font-heading text-lg sm:text-2xl font-bold text-white hover:text-[#66fcf1] transition-colors focus:outline-none select-none"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 pr-4">{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#66fcf1] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-45 bg-[#66fcf1]/10 border-[#66fcf1]' : ''
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pb-6 animate-in slide-in-from-top-1 duration-200">
                    <p className="text-sm sm:text-base text-[#94a1aa] leading-relaxed max-w-3xl">
                      {faq.answer}
                    </p>
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
