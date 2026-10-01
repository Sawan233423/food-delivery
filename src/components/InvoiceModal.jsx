import React, { useEffect } from 'react';
import { X, Printer, ArrowLeft } from 'lucide-react';

export const InvoiceModal = ({ isOpen, onClose, order }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `FP-${order.id ? order.id.replace('ORD-', '') : '410267'}-2026`;
  const orderDate = order.date || 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in print:p-0 print:bg-white print:static"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 animate-slide-up relative flex flex-col max-h-[88vh] overflow-hidden print:max-h-none print:shadow-none print:border-none print:overflow-visible">
        
        {/* Sticky Header with prominent Back & Close Buttons (Always visible, never cut off) */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>Back</span>
            </button>
            <div className="hidden sm:block">
              <span className="font-mono text-xs font-bold text-slate-500">#{invoiceNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-orange-200"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4 text-orange-600" />
              <span>Print</span>
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 flex items-center justify-center transition-colors border border-slate-200"
              title="Cancel / Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Content */}
        <div className="overflow-y-auto px-5 sm:px-7 py-5 space-y-5 flex-1 font-sans text-slate-800">
          
          {/* Brand & FSSAI Details */}
          <div className="flex justify-between items-start">
            <div>
              <span className="font-black text-2xl text-slate-900 font-display">
                Food<span className="text-orange-500">Pulse</span>
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">FoodPulse Technologies Pvt. Ltd.</p>
              <p className="text-[10px] text-slate-400 font-mono">GSTIN: 07AAACF8921R1Z8</p>
              <p className="text-[10px] text-slate-400 font-mono">FSSAI Lic: 10021011000842</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full inline-block">
                PAID IN FULL
              </span>
              <p className="text-[11px] text-slate-500 mt-1">{orderDate}</p>
              <p className="text-[11px] font-mono font-bold text-slate-900">Order ID: {order.id}</p>
            </div>
          </div>

          {/* Restaurant & Customer Box */}
          <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Ordered From
              </span>
              <p className="font-bold text-slate-900">{order.restaurant?.name || 'Restaurant Partner'}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Plot 42, Food Street Zone</p>
              <p className="text-[10px] text-slate-400 font-mono">FSSAI: 13320004000912</p>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To
              </span>
              <p className="font-bold text-slate-900">Customer Doorstep</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {order.deliveryAddress?.text || 'Flat 402, Lotus Greens, Sector 18'}
              </p>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">Delivery PIN: {order.deliveryPin || '9665'}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider grid grid-cols-6">
              <span className="col-span-4">Item</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Amount</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-medium">
              {order.items?.map((it) => (
                <div key={it.id} className="px-4 py-3 grid grid-cols-6 items-center">
                  <div className="col-span-4 pr-2">
                    <p className="font-bold text-slate-900">{it.name}</p>
                    <p className="text-[10px] text-slate-400">₹{it.price} per unit</p>
                  </div>
                  <span className="text-center font-bold text-slate-700">{it.qty}</span>
                  <span className="text-right font-bold text-slate-900 font-mono">₹{it.price * it.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1.5 text-xs border-t border-dashed border-slate-200 pt-3">
            <div className="flex justify-between text-slate-600">
              <span>Item Total</span>
              <span className="font-mono">₹{order.bill?.itemTotal || order.totalPaid}</span>
            </div>

            {order.bill?.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coupon Savings</span>
                <span className="font-mono">- ₹{order.bill.discount}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Delivery Partner Fee</span>
              <span className="font-mono">{order.bill?.deliveryFee === 0 ? 'FREE' : `₹${order.bill?.deliveryFee || 25}`}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Taxes & GST (5%)</span>
              <span className="font-mono">₹{order.bill?.taxes || Math.round(order.totalPaid * 0.05)}</span>
            </div>

            {order.bill?.tip > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Rider Tip (100% to Driver)</span>
                <span className="font-mono">₹{order.bill.tip}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-300">
              <span>Grand Total</span>
              <span className="font-mono text-orange-600">₹{order.bill?.totalToPay || order.totalPaid}</span>
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              Paid via: <span className="font-bold text-slate-700">{order.paymentMethod || 'COD'}</span>
            </p>
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-50 rounded-xl text-center text-[10px] text-slate-400 space-y-0.5">
            <p>This is a computer generated digital invoice and does not require a physical signature.</p>
            <p className="text-slate-500 font-medium">Thank you for ordering with FoodPulse!</p>
          </div>

        </div>

        {/* Sticky Bottom Close / Back Button (Never gets lost) */}
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md p-4 border-t border-slate-200 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Close Invoice & Return to App</span>
          </button>
        </div>

      </div>
    </div>
  );
};
