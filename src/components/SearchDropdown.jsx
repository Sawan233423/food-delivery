import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Star, Utensils, Store, Plus, ArrowRight } from 'lucide-react';
import { onImageError } from '../utils/imageFallbacks';

export const SearchDropdown = ({ query, onClose, onSelectRestaurant }) => {
  const { restaurants, addToCart } = useApp();

  if (!query || query.trim().length === 0) return null;

  const q = query.toLowerCase().trim();

  // 1. Find matching dishes across all restaurants
  const matchedDishes = [];
  restaurants.forEach(resto => {
    resto.menu.forEach(dish => {
      const matchName = dish.name.toLowerCase().includes(q);
      const matchCat = dish.category.toLowerCase().includes(q);
      const matchDesc = dish.description.toLowerCase().includes(q);

      if (matchName || matchCat || matchDesc) {
        matchedDishes.push({
          ...dish,
          restaurantId: resto.id,
          restaurantName: resto.name,
          restaurantCoords: resto.coords,
          restaurant
        });
      }
    });
  });

  // 2. Find matching restaurants
  const matchedRestaurants = restaurants.filter(resto => {
    const matchName = resto.name.toLowerCase().includes(q);
    const matchCuisine = resto.cuisine.some(c => c.toLowerCase().includes(q));
    return matchName || matchCuisine;
  });

  const totalResults = matchedDishes.length + matchedRestaurants.length;

  return (
    <div 
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-slide-up max-h-[480px] flex flex-col"
    >
      {/* Header bar */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
        <span className="font-extrabold text-slate-700">
          Search Results for "<span className="text-orange-600">{query}</span>"
        </span>
        <span className="font-bold text-slate-400">
          {totalResults} {totalResults === 1 ? 'result' : 'results'} found
        </span>
      </div>

      <div className="overflow-y-auto flex-1 divide-y divide-slate-100 p-2">
        {totalResults === 0 ? (
          <div className="py-8 px-4 text-center">
            <span className="text-3xl block mb-2">🍽️</span>
            <p className="font-extrabold text-sm text-slate-800">No dishes or restaurants found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try searching for popular foods: <span className="font-semibold text-orange-600">Biryani, Pizza, Burger, Rolls, Noodles</span>
            </p>
          </div>
        ) : (
          <>
            {/* MATCHING DISHES */}
            {matchedDishes.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                  <Utensils className="w-3.5 h-3.5 text-orange-500" />
                  <span>Matching Dishes ({matchedDishes.length})</span>
                </div>

                <div className="space-y-2.5">
                  {matchedDishes.slice(0, 6).map((dish) => (
                    <div
                      key={dish.id}
                      className="p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            onError={(e) => onImageError(e, 'food')}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={dish.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                            <h4 className="font-extrabold text-xs text-slate-900 truncate">
                              {dish.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            From <span className="text-orange-600 font-bold">{dish.restaurantName}</span> • ₹{dish.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(dish, dish.restaurant);
                            onClose();
                          }}
                          className="bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white font-extrabold text-xs px-3 py-1.5 rounded-xl border border-orange-200 hover:border-orange-600 transition-all flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                          <span>ADD</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MATCHING RESTAURANTS */}
            {matchedRestaurants.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                  <Store className="w-3.5 h-3.5 text-blue-500" />
                  <span>Matching Restaurants ({matchedRestaurants.length})</span>
                </div>

                <div className="space-y-2">
                  {matchedRestaurants.map((resto) => (
                    <div
                      key={resto.id}
                      onClick={() => {
                        onSelectRestaurant(resto);
                        onClose();
                      }}
                      className="p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={resto.banner}
                          alt={resto.name}
                          onError={(e) => onImageError(e, 'restaurant')}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-extrabold text-xs text-slate-900 group-hover:text-orange-600 transition-colors">
                            {resto.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {resto.cuisine.slice(0, 3).join(', ')} • {resto.deliveryTimeMin} mins
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                          {resto.rating} <Star className="w-3 h-3 fill-current" />
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-5 py-2.5 bg-slate-50/80 border-t border-slate-100 text-center text-[11px] text-slate-400 font-medium">
        Press <span className="font-mono bg-white px-1 py-0.2 rounded border border-slate-200">Esc</span> or click outside to close results
      </div>
    </div>
  );
};
