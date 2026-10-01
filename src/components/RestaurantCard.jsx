import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Clock, MapPin, Tag, Heart } from 'lucide-react';
import { onImageError } from '../utils/imageFallbacks';

export const RestaurantCard = ({ restaurant, onSelect }) => {
  const { favorites, toggleFavorite } = useApp();
  const isFav = favorites.includes(restaurant.id);

  return (
    <div
      onClick={() => onSelect(restaurant)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 cursor-pointer flex flex-col relative"
    >
      {/* Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.banner}
          alt={restaurant.name}
          onError={(e) => onImageError(e, 'restaurant')}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(restaurant.id);
          }}
          className={`absolute top-3 left-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
            isFav 
              ? 'bg-rose-500 text-white shadow-md scale-110' 
              : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white'
          }`}
          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-white' : ''}`} />
        </button>

        {/* Offer Tag Badge */}
        {restaurant.offer && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-md flex items-center gap-1.5 uppercase tracking-wide">
            <Tag className="w-3.5 h-3.5" />
            <span>{restaurant.offer}</span>
          </div>
        )}

        {/* Promoted / Veg Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {restaurant.pureVeg && (
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm">
              Pure Veg
            </span>
          )}
          {restaurant.promoted && (
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              Promoted
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-md flex-shrink-0 shadow-sm">
              <span>{restaurant.rating}</span>
              <Star className="w-3 h-3 fill-current" />
            </div>
          </div>

          {/* Cuisines */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">
            {restaurant.cuisine.join(', ')}
          </p>
        </div>

        {/* Footer info: Delivery time, distance, cost */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
          <div className="flex items-center gap-1 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>{restaurant.deliveryTimeMin} mins</span>
          </div>
          <div className="flex items-center gap-1 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{restaurant.distanceKm} km</span>
          </div>
          <div className="text-slate-800 font-bold">
            ₹{restaurant.costForTwo} for two
          </div>
        </div>
      </div>
    </div>
  );
};
