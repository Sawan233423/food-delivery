import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Tag, Plus, Minus, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { AVAILABLE_COUPONS } from '../data/mockData';

export const CartDrawer = ({ onProceedCheckout }) => {
  const { 
    cart, 
    updateCartQty, 
    clearCart, 
    appliedCoupon, 
    applyCouponCode, 
    removeCoupon, 
    deliveryTip, 
    setDeliveryTip, 
    calculateBill, 
    isCartOpen, 
    setIsCartOpen 
  } = useApp();

  const [inputCode, setInputCode] = useState('');

  // Close Cart on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const bill = calculateBill();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCode) return;
    if (applyCouponCode(inputCode)) {
      setInputCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-up">
          
          {/* Cart Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-800 font-extrabold text-xs border border-slate-200 transition-colors shadow-sm"
                title="Continue Shopping"
              >
                <span>← Back</span>
              </button>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 font-display leading-tight">
                  Your Order Bag 🛍️
                </h3>
                {cart.length > 0 && (
                  <p className="text-[11px] text-slate-500 font-semibold truncate max-w-[170px]">
                    From <span className="text-orange-600 font-bold">{cart[0].restaurantName}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  title="Clear entire cart"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center text-4xl mb-4 shadow-inner">
                🍽️
              </div>
              <h4 className="font-bold text-lg text-slate-900">Your bag is empty!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore delicious dishes from our top restaurants and add them to your cart.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 btn-primary text-xs"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5 space-y-6 divide-y divide-slate-100">
              
              {/* Item cards */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500 font-semibold">
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 flex-shrink-0">
                      <button
                        onClick={() => updateCartQty(item.id, -1)}
                        className="hover:text-orange-600 p-0.5"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-extrabold text-xs text-slate-900 w-4 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.id, 1)}
                        className="hover:text-orange-600 p-0.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-14 text-right font-extrabold text-sm text-slate-900">
                      ₹{item.price * item.qty}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupons & Promo Codes */}
              <div className="pt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <Tag className="w-4 h-4 text-orange-500" />
                  <span>Coupons & Offers</span>
                </div>

                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800">
                    <div>
                      <p className="font-extrabold uppercase font-mono tracking-wider">{appliedCoupon.code} APPLIED</p>
                      <p className="text-[11px] text-emerald-600 font-medium">{appliedCoupon.label}</p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="font-bold text-red-600 hover:text-red-800 p-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Enter coupon (e.g. STEAL60)"
                        className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg"
                      >
                        Apply
                      </button>
                    </form>

                    {/* Quick suggestion chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {AVAILABLE_COUPONS.slice(0, 3).map((cp) => (
                        <button
                          key={cp.code}
                          type="button"
                          onClick={() => applyCouponCode(cp.code)}
                          className="text-[10px] font-bold font-mono bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded transition-colors"
                        >
                          {cp.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Partner Tip */}
              <div className="pt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <HeartHandshake className="w-4 h-4 text-rose-500" />
                  <span>Tip your Delivery Partner (100% goes to rider)</span>
                </div>
                <div className="flex items-center gap-2">
                  {[0, 20, 30, 50].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDeliveryTip(amount)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold border transition-all ${
                        deliveryTip === amount
                          ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {amount === 0 ? 'No Tip' : `₹${amount}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Details */}
              <div className="pt-4 space-y-2 text-xs text-slate-600 font-semibold">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="text-slate-900 font-bold">₹{bill.itemTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span>{bill.deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${bill.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{bill.platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Govt Taxes & Restaurant GST (5%)</span>
                  <span>₹{bill.taxes}</span>
                </div>
                {deliveryTip > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Delivery Partner Tip</span>
                    <span>₹{deliveryTip}</span>
                  </div>
                )}
                {bill.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Savings</span>
                    <span>-₹{bill.discount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Amount to Pay</span>
                  <span className="text-orange-600 text-base">₹{bill.totalToPay}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero cancellation fee within 60s of placing order.</span>
              </div>
            </div>
          )}

          {/* Checkout Footer Button */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-white">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedCheckout();
                }}
                className="w-full btn-primary py-3.5 text-sm flex items-center justify-between"
              >
                <div className="text-left">
                  <span className="block text-[11px] font-normal opacity-90">Total Payable</span>
                  <span className="font-extrabold text-lg">₹{bill.totalToPay}</span>
                </div>
                <div className="flex items-center gap-1 font-bold">
                  <span>Proceed to Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
