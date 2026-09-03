import React from 'react';
import { 
  Shield, 
  Zap, 
  Users, 
  Lock, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  AlertTriangle,
  UploadCloud,
  FileCheck,
  Video,
  Radio
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { RPW3DFeatureShowcase } from '../components/RPW3DFeatureShowcase';
import { WhyRPW } from '../components/WhyRPW';

interface AboutUsPageProps {
  onOpenTestShotModal: () => void;
  onNavigateToPortfolio?: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onOpenTestShotModal,
  onNavigateToPortfolio,
}) => {
  const { config } = useSiteConfig();

  return (
    <div className="min-h-screen bg-[#03060a] text-[#9daab4] selection:bg-[#00df81] selection:text-[#05070b] pt-24 sm:pt-32 pb-24 px-4 sm:px-8 md:px-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#00df81]/10 blur-[200px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full bg-[#3b82f6]/10 blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 sm:space-y-28 relative z-10">
        
        {/* 1. HERO SECTION: WHO WE ARE (Exact User Brief) */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00df81]/10 border border-[#00df81]/30 text-[#00df81] text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00df81] animate-ping" />
            <span>ABOUT ROTO PAINT WALA • BLACK FXTUDIO</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase leading-[1.05]">
            INDIVIDUAL STUDIO & <br />
            <span className="text-[#00df81] drop-shadow-[0_0_30px_rgba(0,223,129,0.4)]">
              MASSIVE STUDIO COMMUNITY
            </span>
          </h1>

          <div className="space-y-4 max-w-3xl mx-auto">
            <p className="text-base sm:text-xl text-white font-heading font-medium leading-relaxed">
              We are an individual specialized VFX prep studio as well as a community of a large number of industry-leading studios with the maximum bandwidth of artists available to handle high-volume, blockbuster projects on a single go through <strong>RPW</strong>.
            </p>
            <p className="text-xs sm:text-sm text-[#9daab4] font-mono leading-relaxed">
              Our infrastructure is engineered from the ground up to be on the safest side—guaranteeing 100% leak-proof project protection, NDA compliance, and forensic traceability across every single frame.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-white/90">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Users className="w-4 h-4 text-[#00df81]" />
              <span>Massive Multi-Studio Bandwidth</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#00df81]" />
              <span>Zero-Leak Dynamic IP Watermarking</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Lock className="w-4 h-4 text-[#00df81]" />
              <span>No 3rd-Party App Exposures</span>
            </div>
          </div>
        </div>

        {/* 1.5 INTERACTIVE 3D FEATURE SHOWCASE CAROUSEL (Directly Below Hero Section) */}
        <RPW3DFeatureShowcase onOpenTestShotModal={onOpenTestShotModal} />

        {/* 2. THE STRICT ZERO THIRD-PARTY APPS MANIFESTO */}
        <div className="rounded-3xl bg-gradient-to-br from-[#08111a] via-[#050b12] to-[#08111a] border-2 border-red-500/30 p-6 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.9)] space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase">
                <XCircle className="w-3.5 h-3.5" />
                <span>STRICT SECURITY POLICY</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-black text-white uppercase">
                Why We Never Use Third-Party Apps
              </h2>
            </div>
            <div className="text-xs font-mono text-[#87949c] max-w-xs">
              Third-party apps leak contact numbers and lack dynamic forensic watermarking.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* The Banned Third-Party Tools */}
            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-red-400 text-lg uppercase flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Banned from RPW Pipeline:
                </h3>
                <span className="text-[10px] font-mono text-red-400/80 uppercase font-bold px-2 py-0.5 rounded bg-red-500/10">
                  SECURITY RISK
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono text-[#9daab4]">
                <div className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">NO WhatsApp:</strong> Exposes personal phone numbers, lacks encrypted access logs, and compresses precision raw footage.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">NO WeTransfer:</strong> Open unauthenticated download links without downloader identity stamping or automatic access revocation.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">NO Frame.io / Public Cloud:</strong> Multi-tenant exposure risks and lack of isolated custom IP forensic watermarking on raw plates.
                  </div>
                </div>
              </div>
            </div>

            {/* The Solution: RPW-Connect */}
            <div className="p-6 rounded-2xl bg-[#00df81]/10 border border-[#00df81]/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-[#00df81] text-lg uppercase flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Our In-House Solution: RPW-Connect
                </h3>
                <span className="text-[10px] font-mono text-[#00df81] uppercase font-bold px-2 py-0.5 rounded bg-[#00df81]/20">
                  AIR-GAPPED & PROPRIETARY
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono text-[#9daab4]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00df81] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Zero Contact Number Disclosure:</strong> Seamless communication without exposing private phone numbers or personal emails ([REDACTED-EMAIL]).
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00df81] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Dynamic Forensic Watermarking:</strong> Every preview & download is stamped with the downloader's <em>Name, Timestamp, and IP Address</em>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00df81] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Prohibited Video Share & Download:</strong> Direct file forwarding and screen downloading are locked to authenticated project members.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00df81] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">3-Day Auto Shredding File Vault:</strong> Up to 10GB large file transfers (EXR, MOV, RAW) with automatic permanent deletion in 3 days.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2.5 CORE PRODUCTION PILLARS */}
        <WhyRPW />

        {/* 3. CALL TO ACTION & DIRECT ACCESS */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#08111a] via-[#04080e] to-[#08111a] border border-[#00df81]/40 shadow-[0_0_80px_rgba(0,0,0,0.9)] text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="font-heading text-2xl sm:text-4xl font-black text-white uppercase">
              Ready to experience leak-proof VFX dispatch?
            </h3>
            <p className="text-xs sm:text-sm text-[#9daab4] font-mono">
              Send us a test shot with 100% confidential security or access the RPW-Connect portal directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenTestShotModal}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#00df81] hover:bg-[#00c974] text-[#05070b] font-heading font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(0,223,129,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>REQUEST 1-SHOT PILOT (FREE)</span>
            </button>

            {onNavigateToPortfolio && (
              <button
                onClick={onNavigateToPortfolio}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/20 hover:border-[#00df81] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <span>VIEW PORTFOLIO REEL</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}

            <a
              href={config.connectPortalUrl || 'https://app.rotopaintwala.com/'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>LAUNCH RPW-CONNECT</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

