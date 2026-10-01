import React from 'react';
import { useApp } from '../context/AppContext';
import { Bike, Navigation, Star, CheckCircle2, ArrowLeft } from 'lucide-react';
import { RIDERS_POOL } from '../data/mockData';

export const RiderDashboard = () => {
  const { activeOrder, riderPickupOrder, setActiveRole } = useApp();
  const rider = RIDERS_POOL[0]; // Rahul Sharma

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      
      {/* Mobile Shell */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
        
        {/* Rider Profile Card */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <img
              src={rider.photo}
              alt={rider.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl text-white font-display">
                  {rider.name}
                </h3>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-bold">
                  On Duty
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {rider.vehicle} • {rider.completedOrders} deliveries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Rating</span>
              <span className="text-emerald-400 font-extrabold text-base flex items-center justify-center gap-1">
                {rider.rating} <Star className="w-3.5 h-3.5 fill-current" />
              </span>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Today's Payout</span>
              <span className="text-amber-400 font-extrabold text-base">₹1,450</span>
            </div>
            <button
              onClick={() => setActiveRole('customer')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-2xl border border-slate-700 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-orange-400" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Current Active Trip Card */}
        {activeOrder && ['RIDER_ASSIGNED', 'OUT_FOR_DELIVERY'].includes(activeOrder.status) ? (
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full">
                Active Delivery Trip
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {activeOrder.id}
              </span>
            </div>

            {/* Trip timeline */}
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  🍳
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Pickup: {activeOrder.restaurant.name}</p>
                  <p className="text-slate-400">{activeOrder.restaurant.address}</p>
                </div>
              </div>

              <div className="w-0.5 h-6 bg-slate-700 ml-3" />

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  🏠
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Drop: {activeOrder.customerAddress.tag}</p>
                  <p className="text-slate-400">{activeOrder.customerAddress.text}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons for Rider */}
            <div className="pt-2 flex flex-wrap gap-3">
              {activeOrder.status === 'RIDER_ASSIGNED' && (
                <button
                  onClick={() => riderPickupOrder(activeOrder.id)}
                  className="flex-1 btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Pickup & Start Navigation</span>
                </button>
              )}

              {activeOrder.status === 'OUT_FOR_DELIVERY' && (
                <div className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-sky-400 font-mono">
                    <Navigation className="w-4 h-4 animate-spin" />
                    <span>GPS Navigating to Customer ({Math.round(activeOrder.riderProgressPct || 0)}%)</span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">
                    ETA: {activeOrder.etaMin} mins
                  </span>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="bg-slate-800/40 rounded-2xl p-10 border border-slate-800 text-center">
            <Bike className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="font-bold text-base text-slate-300 mt-3">Partner Standby Mode</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You are currently online. Incoming delivery orders will pop up here with route and payout details.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
