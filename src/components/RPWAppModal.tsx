import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  QrCode, 
  ArrowUpRight, 
  CheckCircle2, 
  Layers, 
  Radio, 
  Zap, 
  ShieldCheck, 
  Activity,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface RPWAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTestShotModal?: () => void;
}

export const RPWAppModal: React.FC<RPWAppModalProps> = ({
  isOpen,
  onClose,
  onOpenTestShotModal,
}) => {
  const { config } = useSiteConfig();
  const [activeOsTab, setActiveOsTab] = useState<'ios' | 'android' | 'web'>('ios');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(config.connectPortalUrl || 'https://app.rotopaintwala.com');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#060c14] border border-[#66fcf1]/40 rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(102,252,241,0.15)] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#081726] via-[#05111c] to-[#060c14] border-b border-white/10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* App Icon Glow Box */}
            <div className="w-14 h-14 rounded-2xl bg-[#05070b] border-2 border-[#66fcf1] p-1.5 flex items-center justify-center shadow-[0_0_25px_rgba(102,252,241,0.4)] relative overflow-hidden group">
              <img 
                src={config.logoUrl || 'https://static.wixstatic.com/media/7ffb5e_bebd8db90704414a9140cfbf0e8fe1e1~mv2.png/v1/fill/w_400,h_400,al_c,q_90,enc_avif,quality_auto/RPW.png'} 
                alt="RPW App Logo" 
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-[#66fcf1]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/30 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1] animate-ping" />
                  RPW Mobile & Tablet App
                </span>
                <span className="text-[10px] font-mono text-[#87949c]">v2.4.0 Live</span>
              </div>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
                <span>RPW Connect</span>
                <span className="text-xs font-mono font-normal text-[#9daab4]">(iOS & Android)</span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#9daab4] hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* OS Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-[#03060a] border border-white/10 rounded-2xl">
            <button
              onClick={() => setActiveOsTab('ios')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeOsTab === 'ios'
                  ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_15px_rgba(102,252,241,0.3)] font-black'
                  : 'text-[#9daab4] hover:text-white'
              }`}
            >
              {/* Apple SVG */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.74c.61-.75 1.04-1.8 0.92-2.84-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.73-.93 2.74 1.01.08 2.03-.5 2.64-1.25z" />
              </svg>
              <span>Apple iOS</span>
            </button>

            <button
              onClick={() => setActiveOsTab('android')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeOsTab === 'android'
                  ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_15px_rgba(102,252,241,0.3)] font-black'
                  : 'text-[#9daab4] hover:text-white'
              }`}
            >
              {/* Android SVG */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4114 13.8533 8.1 12 8.1c-1.8533 0-3.5902.3114-5.1368.8497L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
              </svg>
              <span>Android</span>
            </button>

            <button
              onClick={() => setActiveOsTab('web')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeOsTab === 'web'
                  ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_15px_rgba(102,252,241,0.3)] font-black'
                  : 'text-[#9daab4] hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Web PWA</span>
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="p-5 sm:p-6 bg-[#04080e] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
            {/* QR Code Graphic */}
            <div className="w-32 h-32 bg-white rounded-2xl p-2.5 flex items-center justify-center shadow-lg shrink-0 border-2 border-[#66fcf1]">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fapp.rotopaintwala.com%2F" 
                alt="RPW App QR Code" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Quick Actions & OS Direct Links */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h4 className="font-heading font-bold text-base text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>
                    {activeOsTab === 'ios' && 'Scan to install on Apple iPhone & iPad'}
                    {activeOsTab === 'android' && 'Scan to install on Android Phones & Tablets'}
                    {activeOsTab === 'web' && 'Launch Instant Browser Client & PWA'}
                  </span>
                </h4>
                <p className="text-xs text-[#9daab4] mt-0.5">
                  Point your mobile phone camera at the QR code to open directly or tap the action button below.
                </p>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap pt-1">
                <a
                  href={config.connectPortalUrl || 'https://app.rotopaintwala.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#66fcf1] text-[#05070b] text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:shadow-[0_0_20px_rgba(102,252,241,0.4)] transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {activeOsTab === 'ios' && 'Open Apple App Portal'}
                    {activeOsTab === 'android' && 'Open Android App Portal'}
                    {activeOsTab === 'web' && 'Launch Web App'}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white hover:text-[#66fcf1] hover:border-[#66fcf1]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                  title="Copy App URL"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#00df81]" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* App Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-[#08111a] border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-[#66fcf1] text-xs font-bold font-mono">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Shot Radar</span>
              </div>
              <p className="text-[11px] text-[#9daab4]">
                Track real-time frame turnover, QC status, and artist dispatch push alerts on your phone.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08111a] border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-[#66fcf1] text-xs font-bold font-mono">
                <Zap className="w-3.5 h-3.5" />
                <span>Instant 4K Approvals</span>
              </div>
              <p className="text-[11px] text-[#9daab4]">
                Swipe through high-res before/after alpha mattes with pinch-to-zoom right on mobile.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08111a] border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-[#66fcf1] text-xs font-bold font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Direct Studio Chat</span>
              </div>
              <p className="text-[11px] text-[#9daab4]">
                Encrypted studio-to-supervisor direct line with 24/7 supervisor coverage.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#03070c] border-t border-white/10 flex items-center justify-between text-xs text-[#87949c]">
          <span className="font-mono text-[11px]">
            Enterprise Studio SSO & Custom Pipeline Connectors Available
          </span>
          <button
            onClick={() => {
              onClose();
              if (onOpenTestShotModal) onOpenTestShotModal();
            }}
            className="text-[#66fcf1] hover:underline font-bold font-mono text-[11px]"
          >
            Request 4K Sample Test Shot →
          </button>
        </div>
      </div>
    </div>
  );
};
