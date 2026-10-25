import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, Eye, EyeOff, X, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  settings: StoreSettings;
  showToast: (msg: string) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  settings,
  showToast,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  if (!isOpen) return null;

  const expectedPin = settings.adminPin || '8899';

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (pin.trim() === expectedPin.trim()) {
      showToast('🔓 Owner Access Verified! Welcome Himesh Ji.');
      setPin('');
      setErrorMsg('');
      onSuccess();
    } else {
      setIsShaking(true);
      setErrorMsg('Galat PIN! Sirf Mateshwari Industries ke Owner hi access kar sakte hain.');
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleKeyPress = (digit: string) => {
    if (pin.length < 8) {
      setPin((prev) => prev + digit);
      setErrorMsg('');
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-300 overflow-hidden transform transition-all ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        {/* Top Header with Amber-Green Gradient */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-emerald-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-stone-950 flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6 text-stone-950" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[10px] font-extrabold uppercase tracking-wider">
                Restricted • Owner Only
              </span>
              <h2 className="text-xl font-black text-white">Seller Admin Login</h2>
            </div>
          </div>
          <p className="text-xs text-amber-100/90 leading-snug">
            Yeh panel sirf <strong>{settings.storeName}</strong> ke owner ke liye hai. Naye products dalne, catalog delete karne aur WhatsApp badalne ke liye apna secret PIN enter karein.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Enter Secret Admin PIN / Password</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPin ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  placeholder="Enter 4-digit PIN"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setErrorMsg('');
                  }}
                  autoFocus
                  className="w-full text-center tracking-[0.3em] font-mono text-2xl font-black py-3 px-4 rounded-2xl border-2 border-slate-300 focus:border-amber-600 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all"
                  maxLength={8}
                />
              </div>

              {errorMsg ? (
                <div className="mt-2 text-xs text-rose-600 font-bold flex items-center gap-1.5 animate-in fade-in">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              ) : (
                <div className="mt-2 p-2 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Confidential Owner Access • PIN is strictly private</span>
                </div>
              )}
            </div>

            {/* Quick Digital Keypad for Touch / Mobile */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeyPress(digit)}
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-amber-100/70 text-slate-800 font-bold text-lg border border-slate-200 active:scale-95 transition-all"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs border border-slate-200 active:scale-95 transition-all"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-amber-100/70 text-slate-800 font-bold text-lg border border-slate-200 active:scale-95 transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-rose-100/70 text-slate-600 hover:text-rose-700 font-bold text-xs border border-slate-200 active:scale-95 transition-all"
              >
                ⌫ Back
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:via-amber-800 hover:to-emerald-800 text-white font-black text-sm shadow-lg shadow-amber-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-amber-200" />
              <span>Unlock Seller Admin Panel</span>
              <ArrowRight className="w-4 h-4 text-amber-200" />
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Mateshwari Industries Protected Seller Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
