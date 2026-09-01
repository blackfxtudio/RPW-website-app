import React from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

interface EmailToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const EmailToast: React.FC<EmailToastProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div
      onClick={onDismiss}
      className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl bg-[#050a0e]/95 border border-[#66fcf1]/50 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(102,252,241,0.2)] backdrop-blur-xl text-white text-xs cursor-pointer animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#66fcf1]/20 text-[#66fcf1] flex items-center justify-center shrink-0">
          <Mail className="w-4 h-4" />
        </div>
        <div>
          <strong className="block text-[#66fcf1] font-mono text-[10px] uppercase tracking-wider mb-1">
            RPW / DISPATCH BEACON
          </strong>
          <p className="text-white/90 leading-relaxed font-sans">{message}</p>
        </div>
      </div>
    </div>
  );
};
