import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  KeyRound, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  X,
  Send,
  ShieldCheck
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface AdminOtpAuthModalProps {
  onSuccess?: () => void;
}

const AUTHORIZED_EMAILS = [
  'rotopaintwala@gmail.com',
  'tom@blackfx.net'
];

export const AdminOtpAuthModal: React.FC<AdminOtpAuthModalProps> = ({ onSuccess }) => {
  const { 
    showOtpModal, 
    setShowOtpModal, 
    setIsAdminAuthenticated, 
    setIsEditorOpen, 
    setEditorMode,
    setAdminToast
  } = useSiteConfig();

  const [selectedEmail, setSelectedEmail] = useState<string>('rotopaintwala@gmail.com');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [canResend, setCanResend] = useState<boolean>(true);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Expiry countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setErrorMsg('OTP expired. Please request a new verification code.');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendCooldown]);

  if (!showOtpModal) return null;

  // Real server-side OTP dispatch
  const handleSendOtp = async (targetEmail: string) => {
    setErrorMsg(null);
    setIsLoading(true);
    setOtpDigits(['', '', '', '', '', '']);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch verification OTP.');
      }

      setIsLoading(false);
      setStep('otp');
      setTimeLeft(data.expiresInSeconds || 300);
      setTimerActive(true);
      setCanResend(false);
      setResendCooldown(30);

      // Focus first input box
      setTimeout(() => {
        digitInputRefs.current[0]?.focus();
      }, 150);

    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Error communicating with security auth server.');
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg(null);
    const cleaned = value.replace(/\D/g, '');

    // Handle full 6-digit paste into any box
    if (cleaned.length >= 6) {
      const pasteArray = cleaned.slice(0, 6).split('');
      setOtpDigits(pasteArray);
      digitInputRefs.current[5]?.focus();
      handleVerifyCode(cleaned.slice(0, 6));
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned.slice(-1);
    setOtpDigits(newDigits);

    // Auto advance to next box
    if (cleaned && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      handleVerifyCode(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pasteData.length; i++) {
        newDigits[i] = pasteData[i];
      }
      setOtpDigits(newDigits);
      if (pasteData.length === 6) {
        handleVerifyCode(pasteData);
      } else {
        digitInputRefs.current[Math.min(pasteData.length, 5)]?.focus();
      }
    }
  };

  // Real server-side OTP verification
  const handleVerifyCode = async (codeToVerify: string) => {
    if (!codeToVerify || codeToVerify.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedEmail,
          otp: codeToVerify,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setIsLoading(false);
        setErrorMsg(data.error || 'Incorrect OTP code. Please check your email.');
        return;
      }

      // Success: authenticated server session created
      setIsLoading(false);
      if (data.token) {
        try {
          sessionStorage.setItem('rpw_admin_token', data.token);
        } catch (e) {
          console.error(e);
        }
      }

      setIsAdminAuthenticated(true);
      setShowOtpModal(false);
      setIsEditorOpen(true);
      setEditorMode('dashboard');
      setAdminToast(`🔓 Identity Verified (${selectedEmail}). Studio CMS Unlocked!`);
      if (onSuccess) onSuccess();

    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Failed to verify OTP with server.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#66fcf1]/10 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="relative w-full max-w-md bg-[#05090f] border border-[#66fcf1]/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Top cyan neon gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#66fcf1] to-transparent" />

        {/* Close button */}
        <button
          onClick={() => setShowOtpModal(false)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Studio Security Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#66fcf1]/10 border border-[#66fcf1]/40 text-[#66fcf1] shadow-[0_0_25px_rgba(102,252,241,0.25)] mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00df81] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#00df81] uppercase">
              RPW STUDIO PIPELINE • SECURITY CHECKPOINT
            </span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            ADMIN CMS AUTHENTICATION
          </h3>
          <p className="text-xs text-[#9daab4] font-mono">
            Verify authorized studio identity via One-Time Password (OTP).
          </p>
        </div>

        {/* Step 1: Select Email & Request OTP */}
        {step === 'email' && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold text-[#87949c] uppercase tracking-wider block">
                Select Authorized Studio Email:
              </label>
              
              <div className="space-y-2">
                {AUTHORIZED_EMAILS.map((email) => {
                  const isSelected = selectedEmail === email;
                  return (
                    <button
                      key={email}
                      type="button"
                      onClick={() => setSelectedEmail(email)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#66fcf1]/10 border-[#66fcf1] text-white shadow-[0_0_15px_rgba(102,252,241,0.15)]'
                          : 'bg-white/[0.02] border-white/10 text-[#9daab4] hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Mail className={`w-4 h-4 ${isSelected ? 'text-[#66fcf1]' : 'text-white/40'}`} />
                        <span className="font-mono text-xs sm:text-sm font-semibold">{email}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#66fcf1]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#ff4444] bg-[#ff4444]/10 border border-[#ff4444]/30 p-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={() => handleSendOtp(selectedEmail)}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#66fcf1] hover:bg-[#52ebd9] text-[#05090f] font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_25px_rgba(102,252,241,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>DISPATCHING OTP TO INBOX...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>SEND OTP CODE TO {selectedEmail.split('@')[0].toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Enter 6-Digit OTP (Matches reference UI perfectly) */}
        {step === 'otp' && (
          <div className="space-y-5">
            
            {/* Delivery Status Banner */}
            <div className="p-3.5 rounded-xl bg-[#00df81]/10 border border-[#00df81]/30 flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#00df81] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                OTP DISPATCHED
              </span>
              <span className="text-white/70">{selectedEmail}</span>
            </div>

            {/* 6 Digit Input Fields */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold text-[#87949c] uppercase tracking-wider block text-center">
                ENTER 6-DIGIT VERIFICATION CODE:
              </label>

              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (digitInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono font-black text-xl sm:text-2xl text-white bg-[#08121d] border border-white/20 focus:border-[#66fcf1] focus:ring-2 focus:ring-[#66fcf1]/30 rounded-xl outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#ff4444] bg-[#ff4444]/10 border border-[#ff4444]/30 p-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Resend & Expiry Timer */}
            <div className="flex items-center justify-between text-xs font-mono text-[#87949c] pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#66fcf1]" />
                <span>Expires in {formatTime(timeLeft)}</span>
              </div>

              {canResend ? (
                <button
                  type="button"
                  onClick={() => handleSendOtp(selectedEmail)}
                  className="text-[#66fcf1] hover:underline font-bold cursor-pointer"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-white/40">Resend in {resendCooldown}s</span>
              )}
            </div>

            {/* Verify CTA */}
            <button
              onClick={() => handleVerifyCode(otpDigits.join(''))}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#66fcf1] hover:bg-[#52ebd9] text-[#05090f] font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_25px_rgba(102,252,241,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>VERIFYING CODE...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>VERIFY & UNLOCK DASHBOARD</span>
                </>
              )}
            </button>

            {/* Switch email link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setErrorMsg(null);
                }}
                className="text-[11px] font-mono text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                ← Switch recipient email
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
