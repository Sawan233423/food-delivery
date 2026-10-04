import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Search, 
  Tag, 
  ShoppingBag, 
  Clock, 
  User 
} from 'lucide-react';

export const MobileBottomNav = ({ 
  onOpenOffers, 
  onOpenLocation, 
  onFocusSearch 
}) => {
  const { 
    cart, 
    setIsCartOpen, 
    activeOrder, 
    setSelectedCategory, 
    setSearchQuery,
    setIsPhoneAuthOpen 
  } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleHomeClick = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="mobile-bottom-nav">
      {/* Tab 1: Home / Food */}
      <button
        type="button"
        onClick={handleHomeClick}
        className="flex flex-col items-center justify-center flex-1 py-1 text-slate-600 hover:text-orange-600 transition-colors"
      >
        <Home className="w-5 h-5 text-orange-500" />
        <span className="text-[10px] font-bold mt-0.5 text-slate-800">Explore</span>
      </button>

      {/* Tab 2: Search */}
      <button
        type="button"
        onClick={onFocusSearch}
        className="flex flex-col items-center justify-center flex-1 py-1 text-slate-600 hover:text-orange-600 transition-colors"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-0.5 text-slate-600">Search</span>
      </button>

      {/* Tab 3: Deals / Offers */}
      <button
        type="button"
        onClick={onOpenOffers}
        className="flex flex-col items-center justify-center flex-1 py-1 text-slate-600 hover:text-orange-600 transition-colors relative"
      >
        <Tag className="w-5 h-5 text-amber-500" />
        <span className="text-[10px] font-bold mt-0.5 text-slate-600">Offers</span>
        <span className="absolute top-0 right-5 w-2 h-2 bg-orange-500 rounded-full animate-ping" />
      </button>

      {/* Tab 4: Cart with Counter Badge */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center flex-1 py-1 text-slate-600 hover:text-orange-600 transition-colors relative"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-slate-700" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-orange-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-sm">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold mt-0.5 text-slate-600">Cart</span>
      </button>
    </nav>
  );
};
