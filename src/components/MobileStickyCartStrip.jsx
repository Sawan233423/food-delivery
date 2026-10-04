import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const MobileStickyCartStrip = () => {
  const { cart, calculateBill, setIsCartOpen } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCount === 0) return null;

  const bill = calculateBill();

  return (
    <div className="mobile-sticky-cart-strip">
      <div 
        onClick={() => setIsCartOpen(true)}
        className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white rounded-2xl p-3.5 shadow-xl shadow-emerald-950/25 flex items-center justify-between cursor-pointer border border-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-sm shadow-sm">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-xs text-emerald-100 uppercase tracking-wider">
              {cartCount} {cartCount === 1 ? 'Item' : 'Items'} Added
            </p>
            <p className="font-mono font-black text-base text-white leading-tight">
              ₹{bill.totalToPay} <span className="text-[10px] text-emerald-200 font-sans font-medium">plus taxes</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          className="bg-white text-emerald-800 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-900/20"
        >
          <span>View Cart</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
