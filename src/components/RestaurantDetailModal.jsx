import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, Clock, MapPin, Tag, Plus, Minus, ArrowLeft, Search, Sparkles, ZoomIn } from 'lucide-react';
import { onImageError } from '../utils/imageFallbacks';
import { DishDetail3DModal } from './DishDetail3DModal';

export const RestaurantDetailModal = ({ restaurant, onClose }) => {
  const { cart, addToCart, updateCartQty, selectedCategory } = useApp();
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedDishFor3D, setSelectedDishFor3D] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedDishFor3D) {
          setSelectedDishFor3D(null);
        } else {
          onClose();
        }
      }
    };
    if (restaurant) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [restaurant, selectedDishFor3D, onClose]);

  // Set initial category tab if matches current craving
  useEffect(() => {
    if (restaurant && selectedCategory && selectedCategory !== 'all') {
      const hasMatchingCategory = restaurant.menu.some(d => d.category === selectedCategory);
      if (hasMatchingCategory) {
        setActiveTab(selectedCategory);
      }
    }
  }, [restaurant, selectedCategory]);

  // Extract unique categories available in this restaurant
  const availableCategories = useMemo(() => {
    if (!restaurant) return [];
    const cats = new Set();
    restaurant.menu.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [restaurant]);

  if (!restaurant) return null;

  // Filter items
  const menuItems = restaurant.menu.filter(item => {
    if (filterVegOnly && !item.isVeg) return false;
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    if (activeTab === 'all') return true;
    if (activeTab === 'bestseller') return item.isBestseller;
    return item.category === activeTab;
  });

  const categoryLabels = {
    burger: 'Burgers 🍔',
    pizza: 'Pizzas 🍕',
    biryani: 'Biryani 🍚',
    chinese: 'Asian & Bowls 🍜',
    healthy: 'Healthy & Salads 🥗',
    dessert: 'Desserts & Cakes 🍰',
    rolls: 'Rolls & Wraps 🌯',
    beverages: 'Beverages & Shakes 🥤',
    starters: 'Sides & Starters 🍟',
    pasta: 'Pastas 🍝'
  };

  return (
    <>
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fade-in p-0 sm:p-5 flex justify-center items-end sm:items-center mobile-bottom-sheet"
      >
        <div className="bg-white w-full max-w-3xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-slide-up max-h-[92vh] sm:max-h-[88vh] flex flex-col relative my-0 sm:my-auto">
          
          {/* Sticky Top Header Bar */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between shadow-sm">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
              <span>Back to Restaurants</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="font-extrabold text-xs text-slate-800 truncate max-w-[140px] sm:max-w-xs">
                {restaurant.name}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 flex items-center justify-center transition-colors border border-slate-200 shadow-sm"
                title="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Container (Banner + Dishes) */}
          <div className="overflow-y-auto flex-1">
            
            {/* Restaurant Banner Image & Details */}
            <div className="relative h-44 sm:h-56 w-full flex-shrink-0 bg-slate-900">
              <img
                src={restaurant.banner}
                alt={restaurant.name}
                onError={(e) => onImageError(e, 'restaurant')}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Restaurant details over banner */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <h2 className="text-xl sm:text-3xl font-black font-display tracking-tight text-white drop-shadow-md truncate">
                    {restaurant.name}
                  </h2>
                  <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md flex-shrink-0">
                    <span>{restaurant.rating}</span>
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium truncate">
                  {restaurant.cuisine.join(' • ')}
                </p>

                <div className="flex items-center gap-3 mt-2 text-xs text-slate-300 font-semibold flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>{restaurant.deliveryTimeMin} mins</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[180px] sm:max-w-none">{restaurant.address}</span>
                  </div>
                  <span>•</span>
                  <span>₹{restaurant.costForTwo} for two</span>
                </div>
              </div>
            </div>

            {/* Promo strip */}
            <div className="px-4 sm:px-6 py-2.5 bg-orange-50 border-b border-orange-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-800">
                <Tag className="w-4 h-4 text-orange-600" />
                <span>Offer: {restaurant.offer} • Use code: <span className="font-mono bg-white px-2 py-0.5 rounded border border-orange-200 text-orange-600 font-extrabold">{restaurant.couponCode}</span></span>
              </div>
            </div>

            {/* Search inside Menu & Veg Only Filter */}
            <div className="px-4 sm:px-6 py-3 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sticky top-0 z-20 shadow-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder={`Search in ${restaurant.name} menu...`}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-xs font-semibold rounded-xl border border-transparent focus:border-orange-500 focus:outline-none transition-colors"
                />
                {menuSearch && (
                  <button
                    type="button"
                    onClick={() => setMenuSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setFilterVegOnly(!filterVegOnly)}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex-shrink-0 ${
                  filterVegOnly
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                <span className={filterVegOnly ? 'w-2 h-2 rounded-full bg-white' : 'veg-badge'} />
                <span>Veg Only</span>
              </button>
            </div>

            {/* Category Tabs inside Restaurant */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                All Items ({restaurant.menu.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bestseller')}
                className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1 ${
                  activeTab === 'bestseller'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Bestsellers</span>
              </button>

              {availableCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveTab(cat)}
                  className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                    activeTab === cat
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {categoryLabels[cat] || cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Menu Items List - Swiggy / Zomato Signature Standard */}
            <div className="p-4 sm:p-6 space-y-5 divide-y divide-slate-100">
              <div className="flex items-center justify-between pb-1">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
                  {activeTab === 'all' ? 'All Dishes' : (categoryLabels[activeTab] || activeTab)} ({menuItems.length})
                </h4>
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  Tip: Click dish for 3D zoom & ingredients
                </span>
              </div>

              {menuItems.map((dish) => {
                const inCart = cart.find(c => c.id === dish.id);

                return (
                  <div 
                    key={dish.id} 
                    className="pt-5 first:pt-0 flex items-start justify-between gap-4 group/dish cursor-pointer hover:bg-slate-50/60 p-2 sm:p-3 -mx-2 sm:-mx-3 rounded-2xl transition-all"
                    onClick={() => setSelectedDishFor3D(dish)}
                  >
                    {/* Left Column: Dish details */}
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className={dish.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                        {dish.isBestseller && (
                          <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            <span>Bestseller</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1.5 group-hover/dish:text-orange-600 transition-colors leading-snug">
                        {dish.name}
                      </h4>

                      <div className="flex items-center gap-2.5 mt-1">
                        <span className="font-black text-sm sm:text-base text-slate-900 font-mono">
                          ₹{dish.price}
                        </span>
                        {dish.rating && (
                          <span className="text-xs text-emerald-700 font-extrabold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                            <span>{dish.rating} ({dish.ratingCount})</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-orange-600 font-bold opacity-80 group-hover/dish:opacity-100 transition-opacity">
                        <span>📸 View Angles & Varieties</span>
                      </div>
                    </div>

                    {/* Right Column: Dish Image + Overlapping ADD Button */}
                    <div 
                      className="relative flex flex-col items-center flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div 
                        onClick={() => setSelectedDishFor3D(dish)}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80 cursor-pointer group-hover/dish:shadow-md transition-all relative"
                        title="Click to view photo angles & variety"
                      >
                        <img
                          src={dish.image}
                          alt={dish.name}
                          onError={(e) => onImageError(e, 'food')}
                          className="w-full h-full object-cover group-hover/dish:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                          Photos
                        </span>
                      </div>

                      {/* ADD Button cleanly centered at the bottom edge */}
                      {dish.isOutOfStock ? (
                        <div className="absolute -bottom-2 bg-slate-200 text-slate-500 text-[11px] font-bold px-3 py-1 rounded-xl shadow-sm border border-slate-300">
                          Sold Out
                        </div>
                      ) : inCart ? (
                        <div className="absolute -bottom-2 bg-white text-orange-600 font-black text-xs px-2 py-1 rounded-xl shadow-md border border-orange-200 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateCartQty(dish.id, -1)}
                            className="hover:bg-orange-50 p-1 rounded transition-colors text-orange-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1 text-slate-900 font-bold">{inCart.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(dish.id, 1)}
                            className="hover:bg-orange-50 p-1 rounded transition-colors text-orange-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(dish, restaurant)}
                          className="absolute -bottom-2 bg-white hover:bg-orange-500 text-orange-600 hover:text-white font-black text-xs px-5 py-1.5 rounded-xl shadow-md border border-orange-200 transition-all hover:scale-105 active:scale-95"
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

          {/* Sticky Bottom Bar with Return / Close Button */}
          <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between shadow-sm">
            <span className="text-xs font-semibold text-slate-500">
              {menuItems.length} dishes in menu
            </span>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Restaurants</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3D Zoom Dish Modal */}
      {selectedDishFor3D && (
        <DishDetail3DModal
          dish={selectedDishFor3D}
          restaurant={restaurant}
          onClose={() => setSelectedDishFor3D(null)}
        />
      )}
    </>
  );
};
