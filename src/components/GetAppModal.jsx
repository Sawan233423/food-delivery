import React, { useState } from 'react';
import { X, CheckCircle2, MessageCircle, Phone, Sparkles, Send, ShieldCheck, Smartphone, Layers, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GetAppModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    businessType: 'Restaurant Owner',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      // simulate inquiry received
    }, 1000);
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(`Hi! I loved your Food Delivery platform demo. I want to build a similar custom website and mobile app for my food business. Let's discuss!`);
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-slide-up max-h-[92vh] flex flex-col">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white p-6 sm:p-8 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-200" />
            Turnkey Food Tech Solution
          </span>

          <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white mt-2">
            Want a Custom Food Delivery App Like This?
          </h3>
          <p className="text-xs sm:text-sm text-white/90 mt-1 font-medium leading-relaxed">
            We design & develop production-ready food delivery platforms for restaurants, cloud kitchens, and multi-vendor delivery startups.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h4 className="font-extrabold text-xl text-slate-900">Thank you, {formData.name}!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                We have received your requirement. Our lead development architect will call you on <span className="font-bold text-slate-900">{formData.phone}</span> within 2 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="btn-primary text-xs py-3 px-6"
                >
                  Back to Demo Store
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Feature Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="truncate">iOS & Android Apps</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="truncate">Live GPS Tracking</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="truncate">Kitchen & Rider App</span>
                </div>
              </div>

              {/* Inquiry Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-900 font-bold">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 XXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-900 font-bold">I am a...</label>
                    <select
                      value={formData.businessType}
                      onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs bg-white"
                    >
                      <option value="Restaurant Owner">Restaurant Owner</option>
                      <option value="Cloud Kitchen Chain">Cloud Kitchen Chain</option>
                      <option value="Startup Entrepreneur">Startup Entrepreneur</option>
                      <option value="Grocery / Hyperlocal Business">Hyperlocal Delivery Business</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Tell us about your project requirements</label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. Need an app for my 3 restaurant branches with online payment and delivery fleet..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 btn-primary py-3.5 text-xs font-extrabold flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Request Proposal & Pricing</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppRedirect}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant WhatsApp Chat</span>
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>NDA & IP Ownership 100% Transfer Guaranteed</span>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
