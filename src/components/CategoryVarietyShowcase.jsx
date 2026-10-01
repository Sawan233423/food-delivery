import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { onImageError } from '../utils/imageFallbacks';
import { Star, Plus, Minus, ArrowRight, X, Sparkles, Store, SlidersHorizontal } from 'lucide-react';

export const CategoryVarietyShowcase = ({ onSelectRestaurant }) => {
  const { restaurants, selectedCategory, setSelectedCategory, cart, addToCart, updateCartQty } = useApp();
  const [subFilter, setSubFilter] = useState('all'); // all | bestseller | veg | nonveg | under250 | toprated
  const [sortBy, setSortBy] = useState('relevance'); // relevance | priceLow | rating

  // Current category info
  const categoryInfo = CATEGORIES.find(c => c.id === selectedCategory) || {
    id: selectedCategory,
    name: selectedCategory.toUpperCase(),
    icon: '🍽️'
  };

  // Collect all dishes matching this category across all restaurants
  const allCategoryDishes = useMemo(() => {
    if (selectedCategory === 'all') return [];

    const list = [];
    restaurants.forEach(resto => {
      resto.menu.forEach(dish => {
        // match category or dish name/cuisine keyword
        const matchesCategory = dish.category === selectedCategory ||
          (selectedCategory === 'burger' && dish.name.toLowerCase().includes('burger')) ||
          (selectedCategory === 'pizza' && dish.name.toLowerCase().includes('pizza')) ||
          (selectedCategory === 'biryani' && dish.name.toLowerCase().includes('biryani')) ||
          (selectedCategory === 'dessert' && (dish.category === 'dessert' || dish.name.toLowerCase().includes('cake') || dish.name.toLowerCase().includes('waffle') || dish.name.toLowerCase().includes('sweet') || dish.name.toLowerCase().includes('pudding') || dish.name.toLowerCase().includes('pastry'))) ||
          (selectedCategory === 'beverages' && (dish.category === 'beverages' || dish.name.toLowerCase().includes('shake') || dish.name.toLowerCase().includes('coffee') || dish.name.toLowerCase().includes('tea') || dish.name.toLowerCase().includes('juice') || dish.name.toLowerCase().includes('cooler'))) ||
          (selectedCategory === 'rolls' && (dish.category === 'rolls' || dish.name.toLowerCase().includes('roll') || dish.name.toLowerCase().includes('wrap'))) ||
          (selectedCategory === 'chinese' && (dish.category === 'chinese' || dish.name.toLowerCase().includes('noodles') || dish.name.toLowerCase().includes('dimsum') || dish.name.toLowerCase().includes('fried rice') || dish.name.toLowerCase().includes('bao'))) ||
          (selectedCategory === 'healthy' && (dish.category === 'healthy' || dish.name.toLowerCase().includes('bowl') || dish.name.toLowerCase().includes('salad')));

        if (matchesCategory) {
          list.push({
            ...dish,
            restaurant: {
              id: resto.id,
              name: resto.name,
              rating: resto.rating,
              deliveryTimeMin: resto.deliveryTimeMin,
              banner: resto.banner,
              fullResto: resto
            }
          });
        }
      });
    });
    return list;
  }, [restaurants, selectedCategory]);

  // Filtered and sorted dishes
  const filteredDishes = useMemo(() => {
    return allCategoryDishes.filter(dish => {
      if (subFilter === 'bestseller' && !dish.isBestseller) return false;
      if (subFilter === 'veg' && !dish.isVeg) return false;
      if (subFilter === 'nonveg' && dish.isVeg) return false;
      if (subFilter === 'under250' && dish.price > 250) return false;
      if (subFilter === 'toprated' && dish.rating < 4.7) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [allCategoryDishes, subFilter, sortBy]);

  if (selectedCategory === 'all') return null;

  const categoryDescriptions = {
    burger: 'Smashed double patties, crispy chicken fillets, and gourmet melts prepared fresh.',
    biryani: 'Slow-cooked handi biryanis layered with fragrant basmati, desi ghee, and royal spices.',
    pizza: 'Woodfired sourdough crusts loaded with fresh mozzarella and premium toppings.',
    chinese: 'Wok-tossed noodles, fried rice bowls, and steamed dimsums with spicy chili oils.',
    healthy: 'Nutrient-rich protein bowls, organic salads, and fresh smoothies.',
    dessert: 'Warm fudge cakes, molten lava cups, crispy waffles, and artisanal sweets.',
    rolls: 'Flaky layered kathi rolls, seekh kebabs, and wraps with house mint chutney.',
    beverages: 'Thick monster shakes, cold brews, and sparkling fruit coolers.'
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Category Hero Header Banner */}
      <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15 relative overflow-hidden mb-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Handpicked Selection</span>
              </span>
              <span className="text-xs font-bold bg-white/25 px-2.5 py-1 rounded-full text-white">
                {allCategoryDishes.length} Dishes
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white flex items-center gap-3">
              <span>{categoryInfo.icon}</span>
              <span>{categoryInfo.name}</span>
            </h2>

            <p className="text-white/90 text-xs sm:text-sm mt-2 max-w-2xl font-medium leading-relaxed">
              {categoryDescriptions[selectedCategory] || `Browse our popular ${categoryInfo.name.toLowerCase()} options from top kitchens nearby.`}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl backdrop-blur-md transition-all flex items-center gap-1.5 border border-white/30 shadow-sm"
            >
              <X className="w-4 h-4" />
              <span>Show All Cravings</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </div>

      {/* Sub-Filters and Sorting Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        
        {/* Variety Sub-Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: `All (${allCategoryDishes.length})` },
            { id: 'bestseller', label: '★ Bestsellers' },
            { id: 'veg', label: '🟢 Veg Only' },
            { id: 'nonveg', label: '🔴 Non-Veg' },
            { id: 'under250', label: '🏷️ Under ₹250' },
            { id: 'toprated', label: '⭐ Top Rated (4.7+)' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSubFilter(f.id)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                subFilter === f.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="relevance">Popularity</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Dishes Variety Grid */}
      {filteredDishes.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm mb-8">
          <div className="text-4xl mb-2">🍽️</div>
          <h3 className="font-extrabold text-slate-800 text-base">No dishes match this filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try selecting "All" to view all available varieties.</p>
          <button
            type="button"
            onClick={() => setSubFilter('all')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-xs hover:bg-orange-600 transition-colors shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
          {filteredDishes.map((dish) => {
            const inCart = cart.find(c => c.id === dish.id);

            return (
              <div
                key={`${dish.restaurant.id}-${dish.id}`}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Dish Image + Badges */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      onError={(e) => onImageError(e, 'food')}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Veg / Non-Veg Indicator */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-md flex items-center gap-1.5">
                      <span className={dish.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                      <span className="text-[10px] font-black text-slate-700 uppercase">
                        {dish.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>

                    {/* Bestseller Badge */}
                    {dish.isBestseller && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-100" />
                        <span>Bestseller</span>
                      </div>
                    )}

                    {/* Rating Pill */}
                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-xs font-extrabold px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                      <span className="text-[10px] text-slate-300 font-medium">({dish.ratingCount})</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4">
                    {/* Restaurant link badge */}
                    <button
                      type="button"
                      onClick={() => onSelectRestaurant(dish.restaurant.fullResto)}
                      className="group/resto flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg transition-colors mb-2 w-fit"
                      title="Open Restaurant Full Menu"
                    >
                      <Store className="w-3 h-3 text-orange-500" />
                      <span className="line-clamp-1">{dish.restaurant.name}</span>
                      <ArrowRight className="w-3 h-3 group-hover/resto:translate-x-0.5 transition-transform" />
                    </button>

                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {dish.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                </div>

                {/* Footer with Price and ADD Button */}
                <div className="p-4 pt-0 flex items-center justify-between mt-2 border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block leading-none">Price</span>
                    <span className="font-black text-slate-900 text-base">₹{dish.price}</span>
                  </div>

                  {inCart ? (
                    <div className="flex items-center gap-2 bg-orange-600 text-white font-extrabold text-xs px-2.5 py-1.5 rounded-xl shadow-md shadow-orange-600/20">
                      <button
                        type="button"
                        onClick={() => updateCartQty(dish.id, inCart.qty - 1)}
                        className="hover:bg-white/20 rounded p-1 transition-colors"
                        title="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-sm w-4 text-center">{inCart.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(dish.id, inCart.qty + 1)}
                        className="hover:bg-white/20 rounded p-1 transition-colors"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart(dish, dish.restaurant.fullResto)}
                      className="bg-white hover:bg-orange-500 text-orange-600 hover:text-white border-2 border-orange-500 font-black text-xs px-4 py-1.5 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Section Divider indicating Restaurants below */}
      <div className="pt-4 border-t border-slate-200 mb-2">
        <h3 className="text-xl font-black text-slate-900 font-display tracking-tight flex items-center gap-2">
          <span>🏪</span>
          <span>Restaurants Famous for {categoryInfo.name}</span>
        </h3>
        <p className="text-xs text-slate-500 font-semibold mt-0.5">
          Order full multi-course menus directly from these specialized kitchens
        </p>
      </div>
    </section>
  );
};
