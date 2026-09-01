import React, { useState, useEffect } from 'react';
import { INITIAL_LIVE_SHOTS } from '../data/mockData';
import { ProductionLiveShot } from '../types';
import { ArrowUpRight, Activity, Radio, RefreshCw, Layers, CheckCircle2, Clock } from 'lucide-react';

interface RPWConnectPreviewProps {
  onOpenTestShotModal: () => void;
}

export const RPWConnectPreview: React.FC<RPWConnectPreviewProps> = ({ onOpenTestShotModal }) => {
  const [shots, setShots] = useState<ProductionLiveShot[]>(INITIAL_LIVE_SHOTS);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  // Simulated live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setShots((prev) =>
        prev.map((shot) => {
          if (shot.status === 'WIP') {
            const nextProgress = Math.min(100, shot.progress + Math.floor(Math.random() * 8 + 3));
            return {
              ...shot,
              progress: nextProgress,
              status: nextProgress >= 100 ? 'QC' : 'WIP',
            };
          } else if (shot.status === 'QC' && Math.random() > 0.6) {
            return { ...shot, status: 'DONE', progress: 100 };
          }
          return shot;
        })
      );
      setLastUpdated(new Date().toLocaleTimeString());
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 md:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="relative min-h-[560px] rounded-3xl border border-[#66fcf1]/30 overflow-hidden bg-[radial-gradient(circle_at_80%_30%,rgba(102,252,241,0.12),transparent_40%)] bg-[#071017] p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 relative z-10">
              <div className="inline-flex items-center gap-2 text-[#66fcf1] text-xs font-extrabold uppercase tracking-[0.2em] mb-4">
                <Radio className="w-3.5 h-3.5 animate-pulse text-[#66fcf1]" />
                <span>RPW CONNECT</span>
              </div>
              <h2 className="font-heading text-white text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
                Your project. <br />
                <span className="text-[#66fcf1]">Under control.</span>
              </h2>
              <p className="text-[#b6c1c8] text-sm sm:text-base leading-relaxed max-w-lg mb-8">
                Centralise communication, frame tracking, production updates, and deliverable handoffs through
                the RPW workflow portal. Less chasing across emails. More creating on screen.
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href="https://app.rotopaintwala.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#66fcf1] text-[#05070b] text-xs font-extrabold tracking-wider uppercase hover:shadow-[0_0_30px_rgba(102,252,241,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span>OPEN RPW CONNECT</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <a
                  href="#about"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-xs font-bold text-[#00df81] border border-[#00df81]/40 hover:bg-[#00df81]/10 transition-all"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Explore 3D Exploding Mobile UI</span>
                </a>

                <button
                  onClick={onOpenTestShotModal}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-xs font-bold text-white border border-white/20 hover:border-[#66fcf1] hover:text-[#66fcf1] bg-white/5 transition-all"
                >
                  <span>Request Turnaround Estimate</span>
                </button>
              </div>
            </div>

            {/* Right Live 3D Perspective Dashboard */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div
                className="w-full max-w-lg rounded-2xl border border-[#66fcf1]/30 bg-[#04090d]/90 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(102,252,241,0.1)] backdrop-blur-2xl transition-transform duration-500"
                style={{
                  transform: 'perspective(1200px) rotateY(-8deg) rotateX(4deg)',
                }}
              >
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-[10px] font-mono tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#66fcf1] animate-ping" />
                    <span className="text-white font-bold">RPW / PRODUCTION RADAR</span>
                  </div>
                  <span className="text-[#66fcf1] font-bold">● LIVE TELEMETRY</span>
                </div>

                {/* Sub status */}
                <div className="flex items-center justify-between text-[9px] font-mono text-[#7e8c94] mb-3">
                  <span>ACTIVE PIPELINE QUEUE</span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    UPDATED: {lastUpdated}
                  </span>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 text-[9px] font-mono text-white/40 uppercase tracking-wider pb-2 border-b border-white/5">
                  <div className="col-span-4">Shot ID</div>
                  <div className="col-span-3">Service</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-2 text-right">Prog</div>
                </div>

                {/* Shot Rows */}
                <div className="divide-y divide-white/5 font-mono text-xs">
                  {shots.slice(0, 5).map((shot) => (
                    <div key={shot.id} className="grid grid-cols-12 py-2.5 items-center">
                      <div className="col-span-4 font-bold text-white flex items-center gap-1.5">
                        <span className="text-[11px]">{shot.shotCode}</span>
                      </div>
                      <div className="col-span-3 text-[10px] text-[#9daab4]">{shot.service}</div>
                      <div className="col-span-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold ${
                            shot.status === 'DONE'
                              ? 'bg-[#66fcf1]/20 text-[#66fcf1] border border-[#66fcf1]/30'
                              : shot.status === 'QC'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-white/10 text-white/80'
                          }`}
                        >
                          {shot.status}
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-[10px] text-[#66fcf1] font-bold">
                        {shot.progress}%
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer status summary */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#9daab4]">
                  <span>5 OF 24 SHOTS STREAMING</span>
                  <span className="text-[#66fcf1]">ENCRYPTED TLS 1.3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
