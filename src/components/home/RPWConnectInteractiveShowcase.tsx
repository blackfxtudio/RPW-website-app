import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Clock, 
  Video, 
  UploadCloud, 
  Users, 
  Sparkles, 
  XCircle, 
  CheckCircle2, 
  Zap, 
  Radio, 
  ArrowUpRight,
  Download,
  AlertTriangle,
  FileCheck,
  EyeOff,
  PenTool,
  Trash2,
  PhoneCall
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

export const RPWConnectInteractiveShowcase: React.FC = () => {
  const { config } = useSiteConfig();
  const [activeTab, setActiveTab] = useState<'review' | 'security' | 'bidding' | 'vault' | 'tracker'>('review');
  const [activeDoodleColor, setActiveDoodleColor] = useState<string>('#00df81');
  const [simulatedIp, setSimulatedIp] = useState<string>('192.168.1.104');
  const [simulatedName, setSimulatedName] = useState<string>('tom@blackfx.net');

  const tabs = [
    { id: 'review', label: '1. In-App Annotation & Review', icon: PenTool, tag: 'FRAME-ACCURATE' },
    { id: 'security', label: '2. Zero-Leak Security & Dynamic WM', icon: Lock, tag: 'LEAK PROOF' },
    { id: 'bidding', label: '3. Live Bidding & Studio Bandwidth', icon: Users, tag: 'MAX BANDWIDTH' },
    { id: 'vault', label: '4. Large File Vault (3-Day Auto Shred)', icon: UploadCloud, tag: '10GB TRANSFERS' },
    { id: 'tracker', label: '5. Inline Shot Tracker & Meet', icon: Radio, tag: 'LIVE SYNC' },
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? 'bg-[#00df81] text-[#05070b] shadow-[0_0_20px_rgba(0,223,129,0.4)] scale-[1.02]'
                  : 'bg-[#08111a] text-[#87949c] border border-white/10 hover:border-[#00df81]/40 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${isActive ? 'bg-black/20 text-black font-black' : 'bg-white/5 text-[#00df81]'}`}>
                {tab.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Interactive Stage Styled Directly From Real RPW-Connect Screenshots */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#00df81]/40 bg-[#04080e] shadow-[0_0_80px_rgba(0,0,0,0.95)]">
        {/* Top Window Bar */}
        <div className="px-5 py-3.5 bg-[#08111a] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#00df81] inline-block" />
            </div>
            <span className="text-xs font-mono font-bold text-white tracking-wider flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#00df81]/20 text-[#00df81] text-[10px]">RPW-CONNECT v2.8</span>
              <span className="text-[#87949c]">/</span>
              <span>{tabs.find(t => t.id === activeTab)?.label}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#00df81]">
            <span className="w-2 h-2 rounded-full bg-[#00df81] animate-ping" />
            <span className="hidden sm:inline">AIR-GAPPED HIGH-SECURITY PIPELINE ACTIVE</span>
          </div>
        </div>

        {/* TAB 1: FRAME ANNOTATION & REVIEW (From Review page.png screenshot) */}
        {activeTab === 'review' && (
          <div className="p-4 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Video / Plate Canvas with Doodle overlay */}
              <div className="lg:col-span-8 space-y-3">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl group">
                  {/* Studio Scene Plate Image (Matching the Universal Studios workspace in screenshot) */}
                  <img
                    src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1600&auto=format&fit=crop"
                    alt="RPW-Connect In-App Review Canvas"
                    className="w-full h-full object-cover"
                  />

                  {/* Dynamic Watermark Stamp Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-10 opacity-60">
                    <div className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
                      CONFIDENTIAL • RPW-CONNECT STUDIO PIPELINE
                    </div>
                    <div className="text-center font-mono text-xs text-white/30 tracking-wider rotate-[-15deg] select-none">
                      {simulatedName} • IP: {simulatedIp} • {new Date().toLocaleDateString()}
                    </div>
                    <div className="text-right text-[10px] font-mono text-[#00df81]/70">
                      SECURE WM HASH: #8F9A-4339-B5AE
                    </div>
                  </div>

                  {/* Simulated Frame Annotations & Doodles */}
                  <div className="absolute inset-0 pointer-events-none z-10">
                    {/* Doodle stroke 1 */}
                    <div className="absolute top-[28%] left-[42%] px-3 py-1 rounded-lg bg-black/80 border border-[#00df81] text-[#00df81] text-[10px] font-mono shadow-lg flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00df81]" />
                      <span>#1 SHIFT KARDO (2 strokes)</span>
                    </div>

                    {/* Doodle stroke 2 */}
                    <div className="absolute bottom-[35%] right-[25%] px-3 py-1 rounded-lg bg-black/80 border border-yellow-400 text-yellow-400 text-[10px] font-mono shadow-lg flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-yellow-400" />
                      <span>#2 CHANGE THE LOGO</span>
                    </div>
                  </div>

                  {/* Top File Title Bar inside preview */}
                  <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between text-xs font-mono text-white z-20">
                    <span className="font-bold">B473A4A7-7AEA-4339-B5AE-E93F8CD6F8EB.png</span>
                    <span className="text-[#87949c]">IMAGE • 1.9 MB • 5 ANNOTATIONS</span>
                  </div>
                </div>

                {/* Bottom In-App Toolbar (Matching Real App Screenshot) */}
                <div className="p-3 bg-[#08111a] rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  {/* Tool Actions */}
                  <div className="flex items-center gap-1.5">
                    <button className="px-3 py-1.5 rounded bg-[#00df81]/20 text-[#00df81] border border-[#00df81]/40 flex items-center gap-1.5 font-bold">
                      <PenTool className="w-3.5 h-3.5" />
                      <span>DOODLE</span>
                    </button>
                    <button className="px-2.5 py-1.5 rounded bg-white/5 text-[#87949c] hover:text-white">
                      ERASE
                    </button>
                    <button className="px-2.5 py-1.5 rounded bg-white/5 text-[#87949c] hover:text-white">
                      CLEAR ALL
                    </button>
                  </div>

                  {/* Color Palette */}
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded-lg border border-white/5">
                    {['#00df81', '#3b82f6', '#ef4444', '#a855f7', '#ffffff'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setActiveDoodleColor(color)}
                        className={`w-5 h-5 rounded-full border transition-transform ${
                          activeDoodleColor === color ? 'scale-125 border-white shadow-[0_0_8px_currentColor]' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Download with Watermark & Clean Copy Request */}
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded bg-white/5 border border-white/15 text-white hover:border-[#00df81] text-xs transition-colors">
                      REQUEST CLEAN COPY
                    </button>
                    <button className="px-4 py-1.5 rounded bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold flex items-center gap-1.5 text-xs shadow-md">
                      <Download className="w-3.5 h-3.5" />
                      <span>DOWNLOAD (WM)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Frame Comments Sidebar (Directly matching Review page.png) */}
              <div className="lg:col-span-4 rounded-2xl bg-[#08111a] border border-white/10 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    FRAME COMMENTS • 5
                  </span>
                  <span className="text-[10px] font-mono text-[#87949c] cursor-pointer hover:text-white">HIDE</span>
                </div>

                {/* Comment Cards */}
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-[#3b82f6] font-bold block uppercase">MASTER ADMIN</span>
                    <p className="text-xs font-heading font-semibold text-white">Looking good</p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-[#00df81]/30 space-y-1">
                    <span className="text-[10px] font-mono text-[#3b82f6] font-bold block uppercase">MASTER ADMIN</span>
                    <p className="text-xs font-heading font-bold text-white">SHIFT KARDO</p>
                    <span className="text-[10px] font-mono text-[#00df81] flex items-center gap-1">
                      <PenTool className="w-2.5 h-2.5" /> Doodle (1 stroke) • click to show
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-[#3b82f6] font-bold block uppercase">MASTER ADMIN</span>
                    <p className="text-xs font-heading font-semibold text-white">replac e</p>
                    <span className="text-[10px] font-mono text-[#87949c] flex items-center gap-1">
                      <PenTool className="w-2.5 h-2.5" /> Doodle (1 stroke) • click to show
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-yellow-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-[#3b82f6] font-bold block uppercase">MASTER ADMIN</span>
                    <p className="text-xs font-heading font-bold text-white">change the logo</p>
                    <span className="text-[10px] font-mono text-yellow-400 flex items-center gap-1">
                      <PenTool className="w-2.5 h-2.5" /> Doodle (1 stroke) • click to show
                    </span>
                  </div>
                </div>

                {/* Add Comment Input */}
                <div className="pt-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Add frame note..."
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white placeholder-[#58666e] focus:outline-none focus:border-[#00df81]"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-[#00df81] text-[#05070b] flex items-center justify-center">
                      ➔
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ZERO-LEAK SECURITY & DYNAMIC WATERMARKING */}
        {activeTab === 'security' && (
          <div className="p-6 sm:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Why We Banned 3rd Party Apps */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>NO WHATSAPP • NO WETRANSFER • NO FRAME.IO</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-4xl font-bold text-white leading-tight uppercase">
                  Air-Gapped Leak Prevention <br />
                  <span className="text-[#00df81]">Built Into Every Pixel</span>
                </h3>

                <div className="space-y-4 text-xs font-mono text-[#9daab4]">
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                    <span className="font-bold text-red-400 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Why Third-Party Apps Are Risky:
                    </span>
                    <p className="leading-relaxed">
                      WhatsApp discloses personal phone numbers and compresses raw footage. WeTransfer links can be forwarded to unauthorized parties without forensic tracking. Frame.io exposes footage to multi-tenant cloud storage.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#00df81]/10 border border-[#00df81]/30 space-y-2">
                    <span className="font-bold text-[#00df81] uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> The RPW-Connect Security Standard:
                    </span>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00df81] shrink-0 mt-0.5" />
                        <span><strong>Zero Contact Disclosure:</strong> Chat directly with supervisors without revealing phone numbers or personal emails ([REDACTED-EMAIL]).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00df81] shrink-0 mt-0.5" />
                        <span><strong>Forensic Dynamic Watermarking:</strong> Every preview or download embeds the downloader's name, timestamp, and IP address.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00df81] shrink-0 mt-0.5" />
                        <span><strong>Prohibited Video Sharing:</strong> Direct file forwarding and screen downloading are locked strictly to authenticated studio tokens.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right: Dynamic Watermark Generator Preview */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 rounded-2xl bg-[#08111a] border border-white/10 space-y-3">
                  <span className="text-[11px] font-mono font-bold text-[#00df81] uppercase">
                    LIVE FORENSIC WATERMARK SIMULATOR
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-[#87949c] uppercase block mb-1">Downloader Name / Email</label>
                      <input
                        type="text"
                        value={simulatedName}
                        onChange={(e) => setSimulatedName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00df81]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[#87949c] uppercase block mb-1">Logged IP Address</label>
                      <input
                        type="text"
                        value={simulatedIp}
                        onChange={(e) => setSimulatedIp(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00df81]"
                      />
                    </div>
                  </div>
                </div>

                {/* Stamped Video Player Card */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-[#00df81]/40 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop"
                    alt="VFX Watermarked Preview"
                    className="w-full h-full object-cover filter brightness-90"
                  />

                  {/* Real-time Dynamic Watermark Pattern */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="p-6 rounded-2xl bg-black/75 border border-[#00df81]/60 backdrop-blur-sm text-center space-y-1.5 shadow-2xl rotate-[-8deg]">
                      <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest block">
                        ⚠️ CONFIDENTIAL VFX ASSET • STRICT NDA
                      </span>
                      <p className="text-sm font-heading font-black text-white">
                        DOWNLOADED BY: <span className="text-[#00df81]">{simulatedName}</span>
                      </p>
                      <p className="text-xs font-mono text-white/80">
                        IP: {simulatedIp} • UID: #RPW-8491-SECURE
                      </p>
                      <span className="text-[9px] font-mono text-[#87949c] block pt-1">
                        UNAUTHORIZED LEAK TRACKABLE TO INDIVIDUAL TERMINAL
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-black/80 border border-white/10 text-[10px] font-mono text-white">
                    PROHIBITED SHARE & DOWNLOAD LOCK: <strong className="text-[#00df81]">ENFORCED</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE BIDDING HUB & STUDIO BANDWIDTH (From PRoject Bid.png & Accept Bid.png) */}
        {activeTab === 'bidding' && (
          <div className="p-4 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Live Bidding Feed */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#00df81] font-bold uppercase tracking-wider">
                      LIVE BIDDING HUB • ROTO PAINT WALA
                    </span>
                    <h4 className="font-heading text-lg font-bold text-white">Active Studio Project Allocations</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#00df81]/20 border border-[#00df81]/40 text-[#00df81] text-xs font-mono font-bold">
                    LIVE BIDDING ACTIVE
                  </span>
                </div>

                {/* Project Card 1: Xyz project (From PRoject Bid.png) */}
                <div className="p-4 rounded-2xl bg-[#08111a] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-heading font-bold text-white text-base">Xyz project</h5>
                      <p className="text-xs font-mono text-[#87949c]">Rotoscope • Budget: ₹ 50,000 fixed total</p>
                    </div>
                    <span className="text-xs font-mono text-[#87949c]">Deadline: Sep 25, 2026</span>
                  </div>

                  {/* Responses */}
                  <div className="space-y-2 pt-2">
                    <div className="p-3 rounded-xl bg-black/40 border border-[#00df81]/30 space-y-1">
                      <span className="text-[10px] font-mono text-[#3b82f6] font-bold uppercase">↩ MASTER ADMIN (Xyz project)</span>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#00df81] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accepted bid • Team: 15 artists • Availability: 24hr</span>
                      </div>
                      <p className="text-[11px] font-mono text-[#9daab4]">Note: I m ready</p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-[#00df81]/30 space-y-1">
                      <span className="text-[10px] font-mono text-[#3b82f6] font-bold uppercase">↩ MASTER ADMIN (Xyz project)</span>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#00df81] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accepted bid • Team: 15 artists • Availability: 12hr</span>
                      </div>
                      <p className="text-[11px] font-mono text-[#9daab4]">Note: Yes we are available</p>
                    </div>
                  </div>
                </div>

                {/* Project Card 2: Urgent Cleanup (From PRoject Bid.png) */}
                <div className="p-4 rounded-2xl bg-[#08111a] border border-[#00df81]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#00df81]/20 text-[#00df81] text-[10px] font-mono font-bold uppercase">
                      OPEN • ACCEPTING BIDS
                    </span>
                    <span className="text-xs font-mono text-[#87949c]">by Master Admin</span>
                  </div>

                  <div>
                    <h5 className="font-heading font-bold text-white text-base">New work for Cleanup</h5>
                    <p className="text-xs font-mono text-yellow-400 font-bold">Urgent need • Budget: ₹ 200,000 fixed total</p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-[#00df81]/30 space-y-1">
                    <span className="text-[10px] font-mono text-[#3b82f6] font-bold uppercase">↩ MASTER ADMIN (New work for Cleanup)</span>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#00df81] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accepted bid • Team: 15 artists • Availability: 12hr</span>
                    </div>
                    <p className="text-[11px] font-mono text-[#9daab4]">Note: availble on time</p>
                  </div>
                </div>
              </div>

              {/* Right: Accept Bid Modal Simulation (From Accept Bid.png) */}
              <div className="lg:col-span-5 rounded-2xl bg-[#08111a] border-2 border-[#00df81]/40 p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono font-bold text-[#00df81] uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> CONFIRM YOUR RESPONSE
                  </span>
                  <span className="text-[10px] font-mono text-[#87949c]">STUDIO DISPATCH</span>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="text-[#87949c] uppercase block mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#00df81]" /> Team bandwidth
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue="15"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-bold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87949c] text-xs">artists</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[#87949c] uppercase block mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#00df81]" /> Availability
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-2 rounded-xl bg-[#00df81] text-[#05070b] font-black uppercase text-xs">
                        12HR
                      </button>
                      <button className="py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold uppercase text-xs hover:border-[#00df81]">
                        24HR
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[#87949c] uppercase block mb-1.5">Optional note to admin</label>
                    <input
                      type="text"
                      defaultValue="Team ready with supervisor QC pass."
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs"
                    />
                  </div>

                  <button className="w-full py-3 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg transition-all">
                    SEND RESPONSE
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#00df81]/10 border border-[#00df81]/30 text-[11px] font-mono text-[#00df81] leading-relaxed">
                  💡 <strong>Maximum Studio Bandwidth:</strong> RPW pools artist capacity across multiple certified studios simultaneously to deliver large-volume films on deadline.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LARGE FILE VAULT (From Large File Tranfer & File attachment.png) */}
        {activeTab === 'vault' && (
          <div className="p-6 sm:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Attachment Capabilities */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00df81]/10 border border-[#00df81]/30 text-[#00df81] text-xs font-mono font-bold uppercase">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>UP TO 10 GB HIGH-SPEED VAULT</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-4xl font-bold text-white uppercase leading-tight">
                  Auto-Expiring VFX File Vault <br />
                  <span className="text-[#00df81]">3-Day Automatic Shredding</span>
                </h3>

                <p className="text-xs sm:text-sm font-mono text-[#9daab4] leading-relaxed">
                  No cluttered drives or forgotten cloud shares. Every heavy raw plate (EXR, MOV, RAW, ProRes) uploaded to RPW-Connect automatically expires and permanently deletes in 3 days.
                </p>

                {/* Attachment Menu UI (From File attachment.png) */}
                <div className="rounded-2xl bg-[#08111a] border border-white/15 p-4 space-y-3 max-w-md">
                  <span className="text-[10px] font-mono text-[#87949c] uppercase tracking-widest block border-b border-white/10 pb-2">
                    ATTACH TO CHAT (RPW-CONNECT)
                  </span>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                      📎
                    </div>
                    <div>
                      <h6 className="font-heading font-bold text-white text-xs">Attach File</h6>
                      <p className="text-[10px] font-mono text-[#87949c]">Photos, MP4, PDF, ZIP • up to 1 GB</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/40 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shadow-lg">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <h6 className="font-heading font-bold text-white text-xs">Large File Transfer</h6>
                      <p className="text-[10px] font-mono text-[#3b82f6]">MOV, EXR, RAW • up to 10 GB • 3-day link</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Active Shared Transfer Drawer (From Large File Tranfer screenshot) */}
              <div className="lg:col-span-6 rounded-2xl bg-[#08111a] border border-[#00df81]/40 p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#3b82f6] text-white flex items-center justify-center">
                      📦
                    </div>
                    <div>
                      <h6 className="font-heading font-bold text-white text-xs">Shared Drawer</h6>
                      <span className="text-[9px] font-mono text-[#87949c] uppercase">TEST FOR VENDOR</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#00df81]">TRANSFERS (1)</span>
                </div>

                {/* Transfer Card with 3-Day Countdown (From Screenshot) */}
                <div className="p-4 rounded-2xl bg-black/60 border border-[#3b82f6]/40 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h6 className="font-heading font-bold text-white text-sm">For vfx.mp4</h6>
                      <p className="text-xs font-mono text-[#87949c]">46.0 MB • by tom</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#00df81]/15 text-[#00df81] text-xs font-mono font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 2D 23H LEFT
                    </span>
                  </div>

                  <p className="text-xs font-mono text-[#9daab4] italic">"Check this"</p>

                  <button className="w-full py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md">
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD (ENCRYPTED WATERMARK)</span>
                  </button>
                </div>

                <div className="text-center py-2 border-t border-white/10">
                  <span className="text-[10px] font-mono text-[#00df81] tracking-wider uppercase">
                    FILES AUTO-DELETE 3 DAYS AFTER UPLOAD • ZERO RESIDUAL LEAK
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: INLINE SHOT TRACKER & GOOGLE MEET (From SHots Update.png & Google Meet inbuilt app.png) */}
        {activeTab === 'tracker' && (
          <div className="p-4 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Real-time Inline Shot Grid Table */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#00df81] font-bold uppercase tracking-wider">
                      PROJECT PROGRESS • 1700 / 4000 FRAMES (43%)
                    </span>
                    <h4 className="font-heading text-lg font-bold text-white">Live Per-Shot Frame Tracking</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#00df81]/20 border border-[#00df81]/40 text-[#00df81] text-xs font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00df81] animate-ping" />
                    <span>32 ARTISTS WORKING</span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#3b82f6] to-[#00df81] w-[43%]" />
                </div>

                {/* Shot Table (From SHots Update.png) */}
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#08111a]">
                  <div className="px-4 py-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-[#87949c]">
                    <span>INLINE SHOT TRACKING (3 SHOTS)</span>
                    <span className="text-[#00df81]">REAL-TIME SYNC</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[#87949c] bg-white/5">
                          <th className="p-3">CODE</th>
                          <th className="p-3">TOTAL</th>
                          <th className="p-3">RENDERED</th>
                          <th className="p-3">%</th>
                          <th className="p-3">ARTISTS</th>
                          <th className="p-3">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-white">
                        <tr className="hover:bg-white/5">
                          <td className="p-3 font-bold text-white">Shot 1</td>
                          <td className="p-3">1000</td>
                          <td className="p-3 text-[#3b82f6]">500</td>
                          <td className="p-3 text-[#3b82f6] font-bold">50%</td>
                          <td className="p-3 text-[#00df81]">12</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px]">in-progress</span></td>
                        </tr>
                        <tr className="hover:bg-white/5">
                          <td className="p-3 font-bold text-white">shot 2</td>
                          <td className="p-3">1500</td>
                          <td className="p-3 text-[#00df81]">1000</td>
                          <td className="p-3 text-[#00df81] font-bold">67%</td>
                          <td className="p-3 text-[#00df81]">20</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px]">in-progress</span></td>
                        </tr>
                        <tr className="hover:bg-white/5">
                          <td className="p-3 font-bold text-white">Shot 3</td>
                          <td className="p-3">1500</td>
                          <td className="p-3 text-yellow-400">200</td>
                          <td className="p-3 text-yellow-400 font-bold">13%</td>
                          <td className="p-3 text-[#87949c]">0</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-[10px]">in-progress</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right: Inbuilt Google Meet Group Video Sync (From Google Meet inbuilt app.png) */}
              <div className="lg:col-span-4 rounded-2xl bg-[#08111a] border border-[#3b82f6]/40 p-5 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shadow-md">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h6 className="font-heading font-bold text-white text-sm">Start a Group Meeting</h6>
                    <span className="text-[10px] font-mono text-[#87949c]">STEP 1 OF 2 • OPEN MEET</span>
                  </div>
                </div>

                <p className="text-xs font-mono text-[#9daab4] leading-relaxed">
                  We open Google Meet in a new browser tab. After Meet starts, copy the URL and RPW-Connect will share it with the whole project group.
                </p>

                <a
                  href="https://meet.google.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>OPEN MEET</span>
                </a>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[10px] font-mono text-[#87949c] text-center">
                  Zero phone calls needed • Instant supervisor screen review
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
