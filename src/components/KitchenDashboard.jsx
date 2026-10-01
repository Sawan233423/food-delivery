import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, Clock, ToggleLeft, ToggleRight, Flame, BellRing, ArrowLeft } from 'lucide-react';

export const KitchenDashboard = () => {
  const { 
    restaurants, 
    activeOrder, 
    kitchenAcceptOrder, 
    kitchenFoodReady, 
    toggleItemStock,
    setActiveRole
  } = useApp();

  const primaryResto = restaurants[0]; // Dum Safar Biryani House

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Kitchen Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-3xl">
            👨‍🍳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black font-display text-white">
                Kitchen Display System (KDS)
              </h2>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                Online • Kitchen Terminal #1
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Managing live orders for <span className="text-orange-400 font-bold">{primaryResto.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveRole('customer')}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-2xl border border-slate-700 text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span>Customer App</span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Incoming Orders Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-orange-500" />
              <span>Incoming Order Feed</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              Live Cloud Kitchen Sync
            </span>
          </div>

          {activeOrder && activeOrder.restaurant.id === primaryResto.id ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-orange-400 shadow-xl space-y-6 animate-slide-up">
              
              {/* Order Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md">
                    Order ID: {activeOrder.id}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold ml-3">
                    Placed at {new Date(activeOrder.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    activeOrder.status === 'PLACED' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                    activeOrder.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                    activeOrder.status === 'PREPARING' ? 'bg-purple-100 text-purple-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    Status: {activeOrder.status}
                  </span>
                </div>
              </div>

              {/* Items to Cook */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  Items to Prepare
                </h4>
                <div className="space-y-3">
                  {activeOrder.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center">
                          {item.qty}x
                        </span>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{item.isVeg ? '🌱 Vegetarian' : '🍗 Non-Vegetarian'}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kitchen Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                {activeOrder.status === 'PLACED' && (
                  <button
                    onClick={() => kitchenAcceptOrder(activeOrder.id)}
                    className="flex-1 btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Order (Start 15-Min Prep)</span>
                  </button>
                )}

                {activeOrder.status === 'ACCEPTED' && (
                  <button
                    onClick={() => kitchenFoodReady(activeOrder.id)}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md text-sm flex items-center justify-center gap-2"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Food Ready (Dispatch Delivery Partner)</span>
                  </button>
                )}

                {['PREPARING', 'RIDER_ASSIGNED', 'OUT_FOR_DELIVERY'].includes(activeOrder.status) && (
                  <div className="flex-1 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 text-center">
                    ✓ Handover to Delivery Partner ({activeOrder.assignedRider?.name || 'Partner en route'})
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <span className="text-4xl block mb-2">🍽️</span>
              <h4 className="font-bold text-base text-slate-800">No pending orders</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Orders placed by customers will automatically sound an alert and appear here.
              </p>
            </div>
          )}
        </div>

        {/* Menu Inventory Availability Manager */}
        <div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span>Item Stock Availability</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instantly toggle dishes in or out of stock based on kitchen inventory.
            </p>

            <div className="divide-y divide-slate-100 pt-2">
              {primaryResto.menu.map(dish => (
                <div key={dish.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-900 truncate">{dish.name}</p>
                    <p className="text-[11px] text-slate-500">₹{dish.price}</p>
                  </div>

                  <button
                    onClick={() => toggleItemStock(primaryResto.id, dish.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                      dish.isOutOfStock 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {dish.isOutOfStock ? (
                      <>
                        <ToggleLeft className="w-4 h-4 text-red-500" />
                        <span>Sold Out</span>
                      </>
                    ) : (
                      <>
                        <ToggleRight className="w-4 h-4 text-emerald-500" />
                        <span>In Stock</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
