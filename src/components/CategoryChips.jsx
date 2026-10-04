import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { onImageError } from '../utils/imageFallbacks';

export const CategoryChips = () => {
  const { selectedCategory, setSelectedCategory } = useApp();

  return (
    <div className="py-3.5 sm:py-6 border-b border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight font-display">
            What's on your mind? 🍕
          </h2>
          <div className="flex items-center gap-2">
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="text-[11px] sm:text-xs font-bold text-orange-600 bg-orange-100 hover:bg-orange-200 px-2.5 sm:px-3 py-1 rounded-full transition-colors flex items-center gap-1"
              >
                <span>✕ Clear</span>
              </button>
            )}
            <span className="hidden sm:inline-block text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
              Fast Delivery • 20-30 Mins
            </span>
          </div>
        </div>

        {/* Scrollable Categories List */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                title={isSelected ? 'Click to unselect' : `Filter by ${cat.name}`}
                className={`flex flex-col items-center gap-1.5 sm:gap-2 group flex-shrink-0 transition-all ${
                  isSelected ? 'scale-105' : 'hover:scale-105 active:scale-95'
                }`}
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center p-1 transition-all overflow-hidden ${
                    isSelected
                      ? 'ring-3 sm:ring-4 ring-orange-500 ring-offset-2 shadow-lg shadow-orange-500/20'
                      : 'border-2 border-slate-100 group-hover:border-orange-300 shadow-xs'
                  }`}
                >
                  {cat.img ? (
                    <img
                      src={cat.img}
                      alt={cat.name}
                      onError={(e) => onImageError(e, 'category')}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl">
                      {cat.icon}
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs font-bold transition-colors ${
                    isSelected ? 'text-orange-600' : 'text-slate-700 group-hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
