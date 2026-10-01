import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CreditCard, Smartphone, Banknote, Shield, CheckCircle2, Loader2, MapPin } from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { placeOrder, calculateBill, selectedAddress } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('upi'); // upi | card | cod
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const bill = calculateBill();

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate real payment gateway authorization (Razorpay / Stripe)
    setTimeout(() => {
      setIsProcessing(false);
      placeOrder(selectedMethod.toUpperCase());
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-slide-up relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 font-display">
              Payment & Checkout 💳
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Secure 256-bit encrypted transaction
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
        <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-start gap-3 text-xs">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Delivering to {selectedAddress.tag}</p>
            <p className="text-slate-500 mt-0.5">{selectedAddress.text}</p>
          </div>
        </div>

        {/* Payment Options */}
        <div className="mt-5 space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Select Payment Method
          </p>

          {/* UPI */}
          <div
            onClick={() => setSelectedMethod('upi')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              selectedMethod === 'upi'
                ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">UPI / QR Code</p>
                <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm</p>
              </div>
            </div>
            {selectedMethod === 'upi' && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
          </div>

          {/* Cards */}
          <div
            onClick={() => setSelectedMethod('card')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              selectedMethod === 'card'
                ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Credit or Debit Card</p>
                <p className="text-xs text-slate-500">Visa, Mastercard, Rupay, Amex</p>
              </div>
            </div>
            {selectedMethod === 'card' && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
          </div>

          {/* COD */}
          <div
            onClick={() => setSelectedMethod('cod')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              selectedMethod === 'cod'
                ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">Cash on Delivery</p>
                <p className="text-xs text-slate-500">Pay cash or UPI to rider at doorstep</p>
              </div>
            </div>
            {selectedMethod === 'cod' && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>PCI-DSS Level 1 Compliant Escrow Protection</span>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full btn-primary py-4 text-base font-extrabold flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <span>Pay ₹{bill.totalToPay} & Place Order</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
