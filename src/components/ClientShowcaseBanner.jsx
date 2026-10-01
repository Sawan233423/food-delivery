import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Smartphone } from 'lucide-react';

export const ClientShowcaseBanner = ({ onOpenGetApp }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-indigo-900/60 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl space-y-3 text-center lg:text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Turnkey Food Tech Development</span>
          </span>

          <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
            Loved this Food Delivery experience? <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              Get an app like this built for your business!
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
            We build custom, white-label food delivery websites and mobile apps (iOS & Android) with real-time GPS tracking, kitchen display tablets, rider dispatch, and instant UPI payments.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              100% Source Code Ownership
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              Custom Branding & Logo
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Ready to Launch in 7-14 Days
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <button
            onClick={onOpenGetApp}
            className="w-full sm:w-auto btn-primary py-4 px-8 text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Get a Free Quote & Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="https://wa.me/919876543210?text=Hi!%20I%20saw%20your%20FoodPulse%20platform%20and%20want%20to%20build%20a%20similar%20app%20for%20my%20food%20business."
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
