import React, { useRef } from 'react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  X, 
  Sliders, 
  Eye, 
  Check, 
  Layers, 
  Film,
  Network,
  Lock
} from 'lucide-react';

export const AdminHUD: React.FC = () => {
  const { 
    isEditorOpen, 
    setIsEditorOpen, 
    editorMode, 
    setEditorMode, 
    activeTab, 
    setActiveTab, 
    notifySaved, 
    resetToDefaults, 
    exportConfigJson, 
    importConfigJson,
    adminToast,
    config,
    logoutAdmin
  } = useSiteConfig();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isEditorOpen) return null;

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          importConfigJson(text);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      {/* Top Floating VFX Admin HUD Bar */}
      <div className="fixed top-0 left-0 right-0 z-[80] bg-[#05090f]/95 backdrop-blur-xl border-b border-[#66fcf1]/40 px-4 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center justify-between gap-3 text-xs">
        {/* Left: Mode Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/30">
            <span className="w-2 h-2 rounded-full bg-[#66fcf1] animate-ping" />
            <span className="font-mono font-bold text-[#66fcf1] uppercase tracking-wider text-[11px]">
              RPW CMS LIVE
            </span>
          </div>

          {/* Mode Switcher Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#08111a] border border-white/10">
            <button
              onClick={() => setEditorMode('in-place')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                editorMode === 'in-place'
                  ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_12px_rgba(102,252,241,0.35)]'
                  : 'text-[#9daab4] hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>In-Place Visual Mode</span>
            </button>
            <button
              onClick={() => setEditorMode('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                editorMode === 'dashboard'
                  ? 'bg-[#66fcf1] text-[#05070b] shadow-[0_0_12px_rgba(102,252,241,0.35)]'
                  : 'text-[#9daab4] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Full Backend Dashboard</span>
            </button>
          </div>
        </div>

        {/* Center: In-Place Section Jumpers */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-[#9daab4]">
          <span className="text-white/40 mr-1">JUMP:</span>
          <a href="#rpw" className="px-2 py-1 rounded hover:bg-white/5 hover:text-[#66fcf1] transition-colors">
            #Hero
          </a>
          <a href="#work" className="px-2 py-1 rounded hover:bg-white/5 hover:text-[#66fcf1] transition-colors">
            #Work
          </a>
          <a href="#partners" className="px-2 py-1 rounded hover:bg-white/5 hover:text-[#66fcf1] transition-colors">
            #Network
          </a>
          <a href="#services" className="px-2 py-1 rounded hover:bg-white/5 hover:text-[#66fcf1] transition-colors">
            #Services
          </a>
          <a href="#why" className="px-2 py-1 rounded hover:bg-white/5 hover:text-[#66fcf1] transition-colors">
            #Why
          </a>
          <a href="#faq" className="px-2 py-1 rounded hover:bg-white/5 hover:text-[#66fcf1] transition-colors">
            #FAQ
          </a>
        </div>

        {/* Right: Quick Tools & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={notifySaved}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#66fcf1]/15 text-[#66fcf1] border border-[#66fcf1]/40 hover:bg-[#66fcf1] hover:text-[#05070b] font-bold transition-all"
            title="Save changes to browser localStorage"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Live</span>
          </button>

          <button
            onClick={exportConfigJson}
            className="p-1.5 rounded-lg text-[#9daab4] hover:text-white hover:bg-white/10 transition-colors border border-white/10"
            title="Export CMS config as JSON file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg text-[#9daab4] hover:text-white hover:bg-white/10 transition-colors border border-white/10"
            title="Import CMS config from JSON file"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            onClick={resetToDefaults}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors border border-rose-500/20"
            title="Reset to Factory Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-5 bg-white/15 mx-1" />

          {/* Lock Session */}
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium transition-colors"
            title="Lock Admin Session (Require OTP to Re-enter)"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock Session</span>
          </button>

          {/* Close HUD */}
          <button
            onClick={() => setIsEditorOpen(false)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit Editor</span>
          </button>
        </div>
      </div>

      {/* Admin Toast Alert */}
      {adminToast && (
        <div className="fixed top-16 right-6 z-[120] bg-[#08111a] border border-[#66fcf1] text-white px-4 py-2.5 rounded-xl shadow-[0_0_30px_rgba(102,252,241,0.4)] text-xs font-mono flex items-center gap-2 animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-[#66fcf1]" />
          <span>{adminToast}</span>
        </div>
      )}
    </>
  );
};
