import React, { useState } from 'react';
import { X, Zap, CheckCircle2, ShieldCheck, Film, Calculator, Send } from 'lucide-react';

interface TestShotModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  onShowToast: (msg: string) => void;
}

export const TestShotModal: React.FC<TestShotModalProps> = ({
  isOpen,
  onClose,
  defaultService,
  onShowToast,
}) => {
  const [service, setService] = useState(defaultService || 'Rotoscopy');
  const [shotCount, setShotCount] = useState<number>(1);
  const [frameCount, setFrameCount] = useState<number>(120);
  const [resolution, setResolution] = useState('4K DCI (4096x2160)');
  const [urgency, setUrgency] = useState<'Standard (24-48h)' | 'Rush (12h)' | 'Immediate Pipeline'>('Rush (12h)');
  const [studioName, setStudioName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`RPW Test Shot Request — ${service} [${studioName || 'Studio'}]`);
    const body = encodeURIComponent(
      `Hi RPW Production Dispatch,\n\nI would like to schedule a test shot / production intake with the following specs:\n\n- Service Discipline: ${service}\n- Shot Volume: ${shotCount} shot(s)\n- Total Frames: ~${frameCount} frames\n- Target Resolution: ${resolution}\n- Required Turnaround: ${urgency}\n- Studio/Production: ${studioName || 'N/A'}\n- Contact Email: ${contactEmail || 'N/A'}\n\nProject Scope & Notes:\n${notes || 'Standard calibration test shot.'}\n\nBest regards,\n${studioName || 'Production Supervisor'}`
    );

    window.open(`mailto:tom@blackfx.net?subject=${subject}&body=${body}`, '_blank');
    onShowToast(`Opening test shot dispatch for ${studioName || 'your project'}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#08111a] border border-[#66fcf1]/40 p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#9daab4] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 text-[#66fcf1] text-xs font-mono font-bold tracking-widest uppercase mb-2">
          <Zap className="w-4 h-4" />
          <span>PRODUCTION INTAKE & TEST SHOT</span>
        </div>

        <h3 className="font-heading text-white text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Test Shot / Pipeline Calibration
        </h3>
        <p className="text-xs sm:text-sm text-[#9daab4] leading-relaxed mb-6">
          Submit your shot parameters to schedule a sample calibration frame and lock in production specs under strict NDA.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Discipline Selection */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-1.5">
              Service Discipline
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Rotoscopy', 'Digital Paint', 'Cleanup', 'Keying', 'Matchmove', 'VFX Support'].map((svc) => (
                <button
                  type="button"
                  key={svc}
                  onClick={() => setService(svc)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold text-left transition-all border ${
                    service === svc
                      ? 'bg-[#66fcf1]/15 text-[#66fcf1] border-[#66fcf1]'
                      : 'bg-black/40 text-white/70 border-white/10 hover:border-white/25'
                  }`}
                >
                  {svc}
                </button>
              ))}
            </div>
          </div>

          {/* Counts & Resolution */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-1">
                Shot Count
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={shotCount}
                onChange={(e) => setShotCount(parseInt(e.target.value) || 1)}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#66fcf1]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-1">
                Estimated Frames
              </label>
              <input
                type="number"
                min="1"
                max="50000"
                value={frameCount}
                onChange={(e) => setFrameCount(parseInt(e.target.value) || 24)}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#66fcf1]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-1">
                Resolution
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-[#05070b] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#66fcf1]"
              >
                <option value="4K DCI (4096x2160)">4K DCI</option>
                <option value="4K UHD (3840x2160)">4K UHD</option>
                <option value="2K DCI (2048x1080)">2K DCI</option>
                <option value="HD 1080p">HD 1080p</option>
                <option value="6K / 8K RAW Plate">6K / 8K RAW</option>
              </select>
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-1.5">
              Turnaround Target
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Rush (12h)', 'Standard (24-48h)', 'Immediate Pipeline'] as const).map((urg) => (
                <button
                  type="button"
                  key={urg}
                  onClick={() => setUrgency(urg)}
                  className={`py-2 px-2 text-center rounded-xl text-[11px] font-mono font-bold transition-all border ${
                    urgency === urg
                      ? 'bg-[#66fcf1]/15 text-[#66fcf1] border-[#66fcf1]'
                      : 'bg-black/40 text-white/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  {urg}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-1">
                Studio / Production Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex VFX / Studio 9"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#66fcf1]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-1">
                Supervisor / Producer Email
              </label>
              <input
                type="email"
                required
                placeholder="vfx@yourstudio.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#66fcf1]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-1">
              Plate Notes / Deliverable Specifics (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Fine hair detail on actor foreground, Nuke 15.0 script delivery, anamorphic squeeze factor 2.0"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#66fcf1]"
            />
          </div>

          {/* Security Banner */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#66fcf1] bg-[#66fcf1]/[0.06] border border-[#66fcf1]/20 p-2.5 rounded-xl">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Strict NDA Protocol & Encrypted Plate Handling Guaranteed.</span>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#aeb9c1] hover:text-white border border-white/15 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider text-[#05070b] bg-[#66fcf1] hover:shadow-[0_0_30px_rgba(102,252,241,0.4)] transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>DISPATCH INTAKE REQUEST</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
