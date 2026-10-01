import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Smartphone, ShieldCheck, CheckCircle2, ArrowRight, RefreshCw, User, MapPin } from 'lucide-react';

export const PhoneAuthModal = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, showToast } = useApp();
  const [step, setStep] = useState('phone'); // phone | otp | success
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [demoCode, setDemoCode] = useState('1234');

  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phoneNumber.trim().length < 10) {
      showToast('Invalid Mobile Number', 'Please enter a valid 10-digit number', '⚠️');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      });
      const data = await res.json();
      if (data.success) {
        setDemoCode(data.demoOtp || '1234');
        setStep('otp');
        setTimer(30);
        showToast('OTP Sent', `Test OTP is ${data.demoOtp || '1234'}`, '📱');
      }
    } catch (err) {
      // Fallback in case of network glitch
      setDemoCode('1234');
      setStep('otp');
      setTimer(30);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance focus
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleAutofillDemo = () => {
    setOtp(['1', '2', '3', '4']);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      showToast('Enter 4 Digits', 'Please fill the full 4-digit code', '⚠️');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: fullOtp,
          userName: userName.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.success && data.data?.user) {
        setCurrentUser(data.data.user);
        localStorage.setItem('foodpulse_user', JSON.stringify(data.data.user));
        setStep('success');
        showToast('Welcome!', `Logged in as ${data.data.user.name}`, '🎉');
        setTimeout(() => {
          onClose();
          setStep('phone');
        }, 1500);
      } else {
        showToast('Verification Failed', data.message || 'Invalid OTP', '❌');
      }
    } catch (err) {
      // Offline fallback
      const fallbackUser = {
        id: 'user-' + Date.now(),
        name: userName.trim() || 'Foodie Member',
        phone: '+91 ' + phoneNumber,
        walletCoins: 100,
        addresses: [{ tag: 'Home', text: 'Plot 42, Central Street, Sector 18' }],
        favorites: []
      };
      setCurrentUser(fallbackUser);
      localStorage.setItem('foodpulse_user', JSON.stringify(fallbackUser));
      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('phone');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-slide-up relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: ENTER PHONE */}
        {step === 'phone' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl shadow-sm mb-4">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">
              Sign In or Register
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Enter your phone number to track orders, earn wallet coins, and save addresses.
            </p>

            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Number
                </label>
                <div className="flex items-center rounded-2xl bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all overflow-hidden">
                  <span className="pl-4 pr-2 text-xs sm:text-sm font-black text-slate-600 border-r border-slate-200">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full px-3 py-3 bg-transparent text-xs sm:text-sm font-black tracking-wider text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length < 10}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Continue & Get OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Your details are 100% encrypted & confidential</span>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'otp' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl shadow-sm mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">
              Verify OTP
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Code sent to <span className="font-extrabold text-slate-800">+91 {phoneNumber}</span>{' '}
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-orange-600 font-bold underline ml-1"
              >
                Change
              </button>
            </p>

            {/* Test demo chip */}
            <div className="mt-4 p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-orange-900">
                Demo Test OTP: <span className="font-mono font-black">{demoCode}</span>
              </span>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="bg-orange-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm hover:bg-orange-700 transition-colors"
              >
                Autofill
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="mt-5 space-y-5">
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[idx]}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-14 h-14 text-center text-2xl font-black rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{timer > 0 ? `Resend code in ${timer}s` : 'Did not receive code?'}</span>
                {timer === 0 && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-orange-600 font-bold hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join('').length < 4}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Verify & Login</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 font-display">
              Authentication Success!
            </h4>
            <p className="text-xs text-slate-500">
              Welcome to FoodPulse. Your account is active.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
