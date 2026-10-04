import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { onImageError } from '../utils/imageFallbacks';
import { getDishGallery } from '../utils/dishGallery';
import confetti from 'canvas-confetti';
import { 
  X, 
  Star, 
  Plus, 
  Minus, 
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Store,
  Check
} from 'lucide-react';

export const DishDetail3DModal = ({ dish, restaurant, onClose, onSelectRestaurant }) => {
  const { addToCart, showToast } = useApp();
  
  const [qty, setQty] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (dish) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dish, onClose]);

  // Reset state when dish changes
  useEffect(() => {
    if (dish) {
      setQty(1);
      setActiveSlide(0);
    }
  }, [dish]);

  if (!dish) return null;

  const gallery = getDishGallery(dish);
  const currentPhoto = gallery[activeSlide] || gallery[0] || { url: dish.image, title: dish.name };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const totalPrice = dish.price * qty;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(dish, restaurant || dish.restaurant?.fullResto || { id: 'resto-1', name: 'Kitchen', coords: { x: 440, y: 390 } });
    }

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    showToast('Added to Cart', `${qty}x ${dish.name} added to your order`, '🛍️');
    onClose();
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in mobile-bottom-sheet"
    >
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden relative">
        
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={dish.isVeg ? 'veg-badge' : 'non-veg-badge'} />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              {dish.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
            {dish.isBestseller && (
              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                ★ Bestseller
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors border border-slate-200"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          
          {/* Multi-Angle Photo Sliding Showcase */}
          <div className="relative w-full h-64 sm:h-72 bg-slate-900 overflow-hidden select-none">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              onError={(e) => onImageError(e, 'food')}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Slider Navigation Arrows */}
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-md active:scale-95"
                  title="Previous Angle"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-md active:scale-95"
                  title="Next Angle"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Slide Info & Counter Overlay */}
            <div className="absolute bottom-3 left-4 right-4 text-white flex items-end justify-between gap-3 pointer-events-none">
              <div>
                <p className="text-xs font-bold text-white drop-shadow-md">
                  {currentPhoto.title}
                </p>
                {currentPhoto.subtitle && (
                  <p className="text-[11px] text-slate-300 font-medium drop-shadow-sm line-clamp-1">
                    {currentPhoto.subtitle}
                  </p>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                  {activeSlide + 1} / {gallery.length}
                </div>
              )}
            </div>
          </div>

          {/* Sliding Thumbnail Strip */}
          {gallery.length > 1 && (
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {gallery.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`w-14 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeSlide === idx 
                      ? 'border-orange-500 shadow-md scale-105' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    onError={(e) => onImageError(e, 'food')}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              <span className="text-[11px] text-slate-400 font-semibold pl-1">
                Slide to view angles & variety
              </span>
            </div>
          )}

          {/* Dish Details */}
          <div className="p-5 sm:p-6 space-y-4">
            
            {/* Title, Price, and Restaurant */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight leading-snug">
                  {dish.name}
                </h2>
                <span className="text-xl font-black text-slate-900 font-mono whitespace-nowrap">
                  ₹{dish.price}
                </span>
              </div>

              {/* Restaurant tag */}
              {(restaurant || dish.restaurant) && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-600 font-bold">
                  <Store className="w-3.5 h-3.5 text-orange-500" />
                  <span>By {restaurant?.name || dish.restaurant?.name}</span>
                </div>
              )}

              {/* Rating */}
              {dish.rating && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-emerald-800 font-extrabold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                    <span>{dish.rating}</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    ({dish.ratingCount || '500+'} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {dish.description}
            </p>

            {/* Practical Food Specs (Portion, Time) */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Users className="w-4 h-4 text-orange-500" />
                <span>Portion: <strong>Serves 1-2</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Prep: <strong>15-20 mins</strong></span>
              </div>
            </div>

            {/* Quality & Freshness Guarantee */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Fresh Ingredients</span>
              </span>
              <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hygienic Packaging</span>
              </span>
            </div>

          </div>

        </div>

        {/* Sticky Bottom Bar */}
        <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-4 shadow-sm">
          
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-8 h-8 rounded-xl bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center font-black shadow-xs transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-black text-sm text-slate-900">{qty}</span>
            <button
              type="button"
              onClick={() => setQty(qty + 1)}
              className="w-8 h-8 rounded-xl bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center font-black shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-between transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </span>
            <span className="font-mono text-sm sm:text-base font-black bg-white/20 px-2.5 py-0.5 rounded-lg">
              ₹{totalPrice}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
