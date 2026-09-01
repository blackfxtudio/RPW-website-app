import React from 'react';
import { Users, CheckCircle2, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export const IntroDifference: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 md:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Title Area */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2.5 text-[#66fcf1] text-xs font-extrabold uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-[1px] bg-[#66fcf1]" />
              <span>THE RPW DIFFERENCE</span>
            </div>
            <h2 className="font-heading text-white text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] leading-[0.95] mb-6">
              More artists. <br />
              <span className="text-[#66fcf1]">One standard.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#b6c1c8] leading-relaxed max-w-xl">
              You don't need another vendor to manage. You need production bandwidth that behaves like an
              extension of your own team. RPW connects specialised artists and partner studios through one
              unified production workflow — giving you scale, accountability and a single point of contact.
            </p>
          </div>

          {/* Right Flow Architecture Box */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#66fcf1]/20 bg-[#08111a]/80 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#66fcf1]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="text-[10px] font-mono text-[#66fcf1] tracking-widest uppercase mb-6 flex items-center justify-between border-b border-white/10 pb-3">
                <span>UNIFIED PIPELINE PROTOCOL</span>
                <span>V2.4</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-[#66fcf1]/10 text-[#66fcf1] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-heading font-bold text-sm">Single Client Point of Contact</h4>
                    <p className="text-xs text-[#9daab4] mt-0.5">No chasing 10 different freelancers across time zones.</p>
                  </div>
                </div>

                <div className="flex items-center justify-center text-[#66fcf1]/40">
                  <span className="text-xs font-mono">↓ ISO-CALIBRATED DISPATCH ↓</span>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-[#66fcf1]/[0.06] border border-[#66fcf1]/30">
                  <div className="w-8 h-8 rounded-lg bg-[#66fcf1] text-[#05070b] flex items-center justify-center shrink-0 font-bold font-mono">
                    RPW
                  </div>
                  <div>
                    <h4 className="text-[#66fcf1] font-heading font-bold text-sm">Centralized QC & Standard Gate</h4>
                    <p className="text-xs text-[#9daab4] mt-0.5">Dual-pass supervisory check on pixel fidelity & alpha edge.</p>
                  </div>
                </div>

                <div className="flex items-center justify-center text-[#66fcf1]/40">
                  <span className="text-xs font-mono">↓ INTEGRATED DELIVERABLE ↓</span>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-[#45a29e]/20 text-[#45a29e] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#66fcf1]" />
                  </div>
                  <div>
                    <h4 className="text-white font-heading font-bold text-sm">Studio-Ready Nuke Scripts & EXRs</h4>
                    <p className="text-xs text-[#9daab4] mt-0.5">Drop directly into your master comp without manual re-linking.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
