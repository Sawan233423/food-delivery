import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Shield, 
  CheckCircle2, 
  Loader2, 
  MapPin, 
  QrCode, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { placeOrder, calculateBill, selectedAddress, currentUser, showToast } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('upi'); // upi | card | cod
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrDetails, setQrDetails] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const bill = calculateBill();

  // Fetch dynamic payment intent on open or amount change
  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: bill.totalToPay,
        orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000)
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setQrDetails(data.data);
        }
      })
      .catch(() => {
        // Fallback QR
        const upi = `upi://pay?pa=foodpulse.pay@okaxis&pn=FoodPulse%20Order&am=${bill.totalToPay}&cu=INR`;
        setQrDetails({
          amount: bill.totalToPay,
          upiString: upi,
          qrDataUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upi)}`
        });
      });
  }, [isOpen, bill.totalToPay]);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText('foodpulse.pay@okaxis');
    setCopiedUpi(true);
    showToast('UPI ID Copied', 'foodpulse.pay@okaxis copied to clipboard', '📋');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePayment = (methodName = null) => {
    setIsProcessing(true);
    const finalMethod = (methodName || selectedMethod).toUpperCase();

    setTimeout(() => {
      setIsProcessing(false);
      placeOrder(finalMethod);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-slide-up relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 font-display">
              Payment & Checkout 💳
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Instant 256-bit encrypted checkout
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Delivery Address Review */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-start gap-3 text-xs">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900">Delivering to {selectedAddress.tag}</p>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                25-30 Mins
              </span>
            </div>
            <p className="text-slate-500 mt-0.5 truncate">{selectedAddress.text}</p>
          </div>
        </div>

        {/* Payment Options Selector */}
        <div className="mt-5 space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Choose Payment Method
          </p>

          <div className="grid grid-cols-3 gap-2">
            {/* UPI Tab */}
            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                selectedMethod === 'upi'
                  ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-slate-900">UPI / QR</span>
              <span className="text-[10px] text-emerald-600 font-bold">Instant</span>
            </button>

            {/* Card Tab */}
            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                selectedMethod === 'card'
                  ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-slate-900">Cards</span>
              <span className="text-[10px] text-slate-400">Debit / Credit</span>
            </button>

            {/* COD Tab */}
            <button
              type="button"
              onClick={() => setSelectedMethod('cod')}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                selectedMethod === 'cod'
                  ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Banknote className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-slate-900">Cash (COD)</span>
              <span className="text-[10px] text-slate-400">At Doorstep</span>
            </button>
          </div>
        </div>

        {/* TAB CONTENT: UPI Interactive View */}
        {selectedMethod === 'upi' && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-orange-500" />
                <span className="font-extrabold text-xs text-slate-900">Scan Dynamic UPI QR</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
                ₹{bill.totalToPay}
              </span>
            </div>

            {/* QR Code and App list */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative group">
                <img
                  src={qrDetails?.qrDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=foodpulse.pay@okaxis`}
                  alt="Dynamic Payment QR"
                  className="w-32 h-32 rounded-xl object-contain border border-slate-100 p-1"
                />
                <div className="absolute inset-0 bg-slate-900/10 rounded-xl pointer-events-none" />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <p className="text-xs font-bold text-slate-800">
                  Scan with any UPI App:
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded-lg border border-blue-100">
                    Google Pay
                  </span>
                  <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-1 rounded-lg border border-purple-100">
                    PhonePe
                  </span>
                  <span className="text-[10px] bg-sky-50 text-sky-700 font-bold px-2 py-1 rounded-lg border border-sky-100">
                    Paytm
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded-lg border border-slate-200">
                    BHIM
                  </span>
                </div>

                <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-mono text-slate-600">foodpulse.pay@okaxis</span>
                  <button
                    onClick={handleCopyUpi}
                    className="text-slate-400 hover:text-orange-600 p-1 transition-colors"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Instant Test Approve Button */}
            <button
              type="button"
              onClick={() => handlePayment('UPI (GPay / PhonePe)')}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Instant Scan & Approve (Test)</span>
            </button>
          </div>
        )}

        {/* TAB CONTENT: Card View */}
        {selectedMethod === 'card' && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white space-y-4 shadow-lg animate-fade-in">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold tracking-widest text-slate-400 uppercase">FoodPulse FastPay</span>
              <span className="font-black text-amber-400 text-sm">VISA</span>
            </div>

            <div className="py-2">
              <p className="font-mono text-lg tracking-widest font-black text-slate-100">
                4532 •••• •••• 8912
              </p>
            </div>

            <div className="flex justify-between items-end text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cardholder</span>
                <span className="font-bold text-white tracking-wide">{currentUser?.name || 'Rahul Sharma'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Expires</span>
                <span className="font-mono font-bold text-white">08/29</span>
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/30">
                ✓ Verified
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: Cash on Delivery View */}
        {selectedMethod === 'cod' && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-slate-800 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-amber-600" />
              <p className="font-extrabold text-sm text-slate-900">Cash on Delivery Available</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Please keep exact change of <span className="font-bold text-slate-900">₹{bill.totalToPay}</span> ready at your doorstep, or you can scan the delivery partner's QR code on arrival.
            </p>
          </div>
        )}

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>PCI-DSS Level 1 Escrow Protection</span>
        </div>

        {/* Primary Checkout Button */}
        <div className="mt-5">
          <button
            onClick={() => handlePayment()}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3.5 text-sm sm:text-base font-extrabold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authorizing Order Payment...</span>
              </>
            ) : (
              <>
                <span>Pay ₹{bill.totalToPay} & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
