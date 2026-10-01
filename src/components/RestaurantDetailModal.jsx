import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, Clock, MapPin, Tag, Plus, Minus } from 'lucide-react';

export const RestaurantDetailModal = ({ restaurant, onClose }) => {
  const { cart, addToCart, updateCartQty } = useApp();
  const [filterVegOnly, setFilterVegOnly] = useState(false);

  if (!restaurant) return null;

  // Filter items
  const menuItems = restaurant.menu.filter(item => {
    if (filterVegOnly && !item.isVeg) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-slide-up max-h-[92vh] flex flex-col my-auto">
        
        {/* Modal Header Banner */}
        <div className="relative h-56 w-full flex-shrink-0 bg-slate-900">
          <img
            src={restaurant.banner}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Restaurant details over banner */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white drop-shadow-md">
                {restaurant.name}
              </h2>
              <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                <span>{restaurant.rating}</span>
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
              {restaurant.cuisine.join(' • ')}
            </p>

            <div className="flex items-center gap-4 mt-2 text-xs text-slate-300 font-semibold">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>{restaurant.deliveryTimeMin} mins</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{restaurant.address}</span>
              </div>
              <span>•</span>
              <span>₹{restaurant.costForTwo} for two</span>
            </div>
          </div>
        </div>

        {/* Promo strip & Filters */}
        <div className="px-6 py-3 bg-orange-50 border-b border-orange-100 flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-800">
            <Tag className="w-4 h-4 text-orange-600" />
            <span>Offer: {restaurant.offer} • Use code: <span className="font-mono bg-white px-2 py-0.5 rounded border border-orange-200 text-orange-600">{restaurant.couponCode}</span></span>
          </div>

          <button
            onClick={() => setFilterVegOnly(!filterVegOnly)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              filterVegOnly
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <span className={filterVegOnly ? 'w-2 h-2 rounded-full bg-white' : 'veg-badge'} />
            <span>Veg Only</span>
          </button>
        </div>

        {/* Menu Items List */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-base text-slate-900 tracking-tight uppercase tracking-wider text-xs">
              Recommended Items ({menuItems.length})
            </h4>
          </div>

          {menuItems.map((dish) => {
            const inCart = cart.find(c => c.id === dish.id);

            return (
              <div key={dish.id} className="pt-6 first:pt-0 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={dish.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                    {dish.isBestseller && (
                      <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        ★ Bestseller
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-base text-slate-900 mt-1">
                    {dish.name}
                  </h4>

                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-extrabold text-sm text-slate-900">
                      ₹{dish.price}
                    </span>
                    {dish.rating && (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                        <span>{dish.rating} ({dish.ratingCount})</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                {/* Dish Photo + Add Button */}
                <div className="relative flex flex-col items-center flex-shrink-0">
                  <div className="w-28 h-24 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {dish.isOutOfStock ? (
                    <div className="absolute -bottom-3 bg-slate-200 text-slate-500 text-xs font-bold px-3 py-1 rounded-xl shadow-sm border border-slate-300">
                      Sold Out
                    </div>
                  ) : inCart ? (
                    <div className="absolute -bottom-3 bg-white text-orange-600 font-extrabold text-xs px-2 py-1 rounded-xl shadow-md border border-orange-200 flex items-center gap-2">
                      <button
                        onClick={() => updateCartQty(dish.id, -1)}
                        className="hover:bg-orange-50 p-1 rounded transition-colors text-orange-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-1 text-slate-900">{inCart.qty}</span>
                      <button
                        onClick={() => updateCartQty(dish.id, 1)}
                        className="hover:bg-orange-50 p-1 rounded transition-colors text-orange-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(dish, restaurant)}
                      className="absolute -bottom-3 bg-white hover:bg-orange-500 text-orange-600 hover:text-white font-extrabold text-xs px-5 py-1.5 rounded-xl shadow-md border border-orange-200 transition-all hover:scale-105 active:scale-95"
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
