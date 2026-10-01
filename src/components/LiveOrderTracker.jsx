import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star, 
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { InteractiveStreetDeliveryMap } from './InteractiveStreetDeliveryMap';
import { onImageError } from '../utils/imageFallbacks';

export const LiveOrderTracker = () => {
  const { activeOrder, setInvoiceOrder } = useApp();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'rider', text: 'Hi! I have arrived at the restaurant. Will pick up your food soon!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [callRiderOpen, setCallRiderOpen] = useState(false);

  if (!activeOrder) return null;

  const steps = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Sent to restaurant', icon: '📝' },
    { key: 'ACCEPTED', label: 'Confirmed', desc: 'Kitchen accepted', icon: '👨‍🍳' },
    { key: 'PREPARING', label: 'Preparing', desc: 'Chef cooking fresh', icon: '🍳' },
    { key: 'RIDER_ASSIGNED', label: 'Rider Assigned', desc: 'Partner en route', icon: '🛵' },
    { key: 'OUT_FOR_DELIVERY', label: 'On The Way', desc: 'Live GPS navigation', icon: '🚀' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your meal!', icon: '🎉' }
  ];

  const currentIdx = activeOrder.currentStepIndex || 0;

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'customer', text: chatInput }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'rider', text: `Thanks for the update! I am tracking GPS to your location now.` }
      ]);
    }, 1200);
  };

  const riderPos = activeOrder.riderCurrentPos || activeOrder.restaurant.coords;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 animate-slide-up relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-extrabold tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              Live Order Status
            </span>
            <span className="font-mono text-xs text-slate-400 font-bold">{activeOrder.id}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white mt-2">
            {activeOrder.status === 'DELIVERED' 
              ? 'Order Delivered! Enjoy your food 😋' 
              : activeOrder.status === 'OUT_FOR_DELIVERY'
              ? 'Rider is on the way with your food!'
              : activeOrder.status === 'PREPARING'
              ? 'Chef is preparing your fresh meal!'
              : 'Kitchen is confirming your order...'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            From <span className="text-orange-400 font-bold">{activeOrder.restaurant.name}</span> to <span className="text-slate-300 font-bold">{activeOrder.customerAddress.tag}</span>
          </p>
        </div>

        {/* Live ETA Box */}
        <div className="flex items-center gap-3">
          {/* Delivery OTP Badge */}
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-lg">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Delivery PIN</span>
              <span className="text-base font-mono font-extrabold text-white tracking-widest">4821</span>
            </div>
          </div>

          {/* Arrival Timer */}
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Est. Arrival</span>
              <div className="text-xl font-black text-white font-display">
                {activeOrder.etaMin > 0 ? `${activeOrder.etaMin} mins` : 'Arrived!'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Timeline Progress Bar */}
      <div className="py-6 border-b border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] relative">
          {/* Connector line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 -z-0">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${Math.min(100, (currentIdx / (steps.length - 1)) * 100)}%` }}
            />
          </div>

          {steps.map((st, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={st.key} className="flex flex-col items-center relative z-10 flex-1 text-center">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-md ${
                    isDone 
                      ? 'bg-emerald-500 text-white' 
                      : isCurrent 
                      ? 'bg-orange-500 text-white ring-4 ring-orange-500/30 scale-110' 
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : st.icon}
                </div>
                <span className={`text-xs font-bold mt-2 ${isCurrent ? 'text-orange-400' : isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {st.label}
                </span>
                <span className="text-[10px] text-slate-400 max-w-[90px] leading-tight">
                  {st.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Simulated GPS Map + Partner Card */}
      <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real Interactive Leaflet Street Delivery Map */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <InteractiveStreetDeliveryMap 
            restaurant={activeOrder.restaurant}
            customerAddress={activeOrder.customerAddress}
            riderProgressPct={activeOrder.riderProgressPct}
            assignedRider={activeOrder.assignedRider}
          />

          {/* Safety & Contactless Delivery Assurance */}
          <div className="mt-2 bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Contactless delivery enabled • Sanitized thermal delivery bag</span>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
              Need help? 24/7 Support
            </span>
          </div>

        </div>

        {/* Rider & Order Sidebar */}
        <div className="space-y-4">
          
          {/* Rider Card */}
          {activeOrder.assignedRider ? (
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700 shadow-lg">
              <div className="flex items-center gap-3">
                <img
                  src={activeOrder.assignedRider.photo}
                  alt={activeOrder.assignedRider.name}
                  onError={(e) => onImageError(e, 'rider')}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500/50 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-base text-white truncate">
                      {activeOrder.assignedRider.name}
                    </h4>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                      {activeOrder.assignedRider.rating} ★
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {activeOrder.assignedRider.vehicle}
                  </p>
                  <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
                    ✓ Verified Delivery Partner
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => setCallRiderOpen(true)}
                  className="bg-slate-700/80 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl border border-slate-600 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Rider</span>
                </button>
                <button
                  onClick={() => setChatOpen(true)}
                  className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-bold text-xs py-2.5 rounded-xl border border-orange-500/40 flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>In-App Chat</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 text-center">
              <span className="text-3xl block animate-bounce">🍳</span>
              <p className="font-bold text-sm text-white mt-2">Food is being prepared</p>
              <p className="text-xs text-slate-400 mt-1">Assigning the nearest delivery partner for quick pickup...</p>
            </div>
          )}

          {/* Ordered Items Summary */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700">
            <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">
              Order Summary ({activeOrder.items.length} items)
            </h5>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {activeOrder.items.map(item => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="text-slate-300 truncate max-w-[160px]">
                    {item.qty}x {item.name}
                  </span>
                  <span className="text-slate-100 font-bold">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center text-xs font-bold text-white">
              <span>Paid via {activeOrder.paymentMethod}</span>
              <span className="text-orange-400">₹{activeOrder.bill?.totalToPay || activeOrder.totalPaid}</span>
            </div>

            <button
              onClick={() => setInvoiceOrder(activeOrder)}
              className="mt-3 w-full bg-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs py-2 rounded-xl border border-slate-600 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>🧾 View & Print Tax Invoice</span>
            </button>
          </div>

        </div>

      </div>

      {/* Rider Call Simulation Modal */}
      {callRiderOpen && activeOrder.assignedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-6 text-center text-white shadow-2xl animate-slide-up">
            <img
              src={activeOrder.assignedRider.photo}
              alt={activeOrder.assignedRider.name}
              onError={(e) => onImageError(e, 'rider')}
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-emerald-500 shadow-xl"
            />
            <h4 className="font-bold text-lg mt-3">{activeOrder.assignedRider.name}</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{activeOrder.assignedRider.phone}</p>
            <p className="text-xs text-emerald-400 font-semibold mt-2 animate-pulse">
              ● Connected via Masked Secure Call
            </p>

            <button
              onClick={() => setCallRiderOpen(false)}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-2xl shadow-lg transition-all"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* In-App Chat Modal */}
      {chatOpen && activeOrder.assignedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[460px] animate-slide-up">
            <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <img
                  src={activeOrder.assignedRider.photo}
                  alt={activeOrder.assignedRider.name}
                  onError={(e) => onImageError(e, 'rider')}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">{activeOrder.assignedRider.name}</h4>
                  <span className="text-[11px] text-emerald-400">Online • Out for delivery</span>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-xs ${
                      msg.sender === 'customer'
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message to rider..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
