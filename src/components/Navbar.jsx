import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  Percent, 
  User, 
  X,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  Mic
} from 'lucide-react';
import { VoiceSearchModal } from './VoiceSearchModal';
import { SearchDropdown } from './SearchDropdown';

export const Navbar = ({ onOpenOffers, onSelectRestaurant }) => {
  const { 
    cart, 
    setIsCartOpen, 
    selectedAddress, 
    setSelectedAddress,
    searchQuery, 
    setSearchQuery, 
    vegOnlyFilter, 
    setVegOnlyFilter,
    activeRole,
    setActiveRole,
    orderHistory,
    reorderPastOrder,
    currentUser,
    setIsPhoneAuthOpen,
    setInvoiceOrder
  } = useApp();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  // Close modals on Escape key or click outside search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsAddressModalOpen(false);
        setIsAuthModalOpen(false);
        setIsVoiceSearchOpen(false);
        setShowSearchDropdown(false);
      }
    };

    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const sampleAddresses = [
    { tag: 'Home', text: 'Flat 402, Lotus Greens, Central Boulevard', coords: { x: 440, y: 390 } },
    { tag: 'Office', text: 'Tower B, Tech Innovation Park, Sector 62', coords: { x: 390, y: 340 } },
    { tag: 'Other', text: 'Villa 12, Palm Meadows, Lake View', coords: { x: 470, y: 310 } }
  ];

  return (
    <>
      {/* Partner View Bar (Only shown if user explicitly clicked Partner portal in footer) */}
      {activeRole !== 'customer' && (
        <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-orange-400">
              {activeRole === 'kitchen' ? '👨‍🍳 Restaurant Kitchen Portal' : '🛵 Delivery Fleet App'}
            </span>
            <span className="text-slate-400">• Partner Management Mode</span>
          </div>
          <button
            onClick={() => setActiveRole('customer')}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg font-bold text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Food Store</span>
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Brand Logo & Location */}
            <div className="flex items-center gap-5 sm:gap-8">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setActiveRole('customer')}
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white text-2xl shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                  🍔
                </div>
                <div>
                  <span className="font-black text-2xl tracking-tight text-slate-900 font-display">
                    Food<span className="text-orange-500">Pulse</span>
                  </span>
                  <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Superfast Delivery</p>
                </div>
              </div>

              {/* Delivery Address Dropdown Pill */}
              <div 
                onClick={() => setIsAddressModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100/90 hover:bg-slate-200/80 cursor-pointer border border-slate-200 text-xs text-slate-700 transition-colors"
                title="Change delivery location"
              >
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <div className="flex items-center gap-1.5 truncate max-w-[130px] sm:max-w-[200px]">
                  <span className="font-extrabold text-slate-900">{selectedAddress.tag}</span>
                  <span className="text-slate-400">•</span>
                  <span className="truncate text-slate-600 font-medium">{selectedAddress.text}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </div>
            </div>

            {/* Center Search Bar with Voice Engine */}
            <div ref={searchContainerRef} className="flex-1 max-w-lg hidden md:flex items-center gap-3 relative">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowSearchDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  placeholder="Search for biryani, pizza, burger, rolls..."
                  className="w-full pl-10 pr-20 py-2.5 bg-slate-100/90 border border-slate-200 rounded-full text-xs sm:text-sm placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all font-medium"
                />
                
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchDropdown(false);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  {/* Voice Search Mic Button */}
                  <button
                    type="button"
                    onClick={() => setIsVoiceSearchOpen(true)}
                    className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
                    title="Voice Search (Speak dish name) 🎙️"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Instant Search Engine Dropdown */}
                {showSearchDropdown && searchQuery.trim() && (
                  <SearchDropdown
                    query={searchQuery}
                    onClose={() => setShowSearchDropdown(false)}
                    onSelectRestaurant={onSelectRestaurant}
                  />
                )}
              </div>

              {/* Veg Only Toggle Button */}
              <button
                onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold whitespace-nowrap transition-all ${
                  vegOnlyFilter 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="veg-badge" />
                <span>Veg</span>
              </button>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Mobile Voice Search Button */}
              <button
                type="button"
                onClick={() => setIsVoiceSearchOpen(true)}
                className="md:hidden p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors flex items-center justify-center"
                title="Search with Voice 🎙️"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Offers Button */}
              <button
                onClick={onOpenOffers}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              >
                <Percent className="w-4 h-4 text-orange-500" />
                <span>Offers</span>
                <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">NEW</span>
              </button>

              {/* User Account / Profile */}
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline font-bold">
                  {currentUser?.name ? currentUser.name.split(' ')[0] : 'SAWAN'}
                </span>
              </button>

              {/* Cart Drawer Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 ? (
                  <span className="bg-white text-orange-600 text-xs px-2 py-0.5 rounded-full font-extrabold shadow-sm">
                    {cartCount}
                  </span>
                ) : (
                  <span className="text-white/80 font-normal hidden sm:inline">• Empty</span>
                )}
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Address Switcher Modal */}
      {isAddressModalOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsAddressModalOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-lg text-slate-900">Choose Delivery Address</h3>
              </div>
              <button 
                onClick={() => setIsAddressModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {sampleAddresses.map((addr) => (
                <div
                  key={addr.tag}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setIsAddressModalOpen(false);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedAddress.tag === addr.tag
                      ? 'border-orange-500 bg-orange-50/50 shadow-sm ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{addr.tag}</span>
                    {selectedAddress.tag === addr.tag && (
                      <span className="text-[11px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">Selected</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{addr.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Profile & Past Orders Modal */}
      {isAuthModalOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsAuthModalOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 animate-slide-up flex flex-col max-h-[85vh]">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold">
                  👤
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                    {currentUser?.name || 'Foodie Member'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {currentUser?.phone || '+91 98765 43210'} • Gold Member
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="overflow-y-auto space-y-4 py-4 flex-1 pr-1">
              
              {/* Phone OTP Switch Button */}
              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setIsPhoneAuthOpen(true);
                }}
                className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs py-2.5 px-3 rounded-2xl border border-orange-200 flex items-center justify-center gap-2 transition-colors"
              >
                <span>📱 Switch / Login with Mobile OTP</span>
              </button>

              {/* Wallet Coins Card */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-100 block">FoodPulse Wallet</span>
                  <span className="text-2xl font-black font-display">₹{currentUser?.walletCoins ?? 240}</span>
                  <span className="text-[11px] text-white/90 block mt-0.5">Instant credit on checkout</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
                  🪙
                </div>
              </div>

              {/* Past Orders Section */}
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Past Orders ({orderHistory?.length || 0})
                </h4>

                <div className="space-y-3">
                  {orderHistory && orderHistory.map((past) => (
                    <div key={past.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-slate-900">{past.restaurant?.name || 'Restaurant'}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{past.date || 'Recent'}</p>
                        </div>
                        <span className="text-xs font-mono font-black text-slate-900">₹{past.totalPaid}</span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1">
                        {past.items?.map(it => `${it.qty}x ${it.name}`).join(', ')}
                      </p>

                      <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          ✓ {past.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setInvoiceOrder(past);
                              setIsAuthModalOpen(false);
                            }}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                          >
                            <span>🧾 Invoice</span>
                          </button>
                          <button
                            onClick={() => {
                              reorderPastOrder(past);
                              setIsAuthModalOpen(false);
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm transition-all"
                          >
                            Reorder
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="mt-2 w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Voice Search Speech Recognition Modal */}
      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onSearch={(query) => {
          setSearchQuery(query);
          setShowSearchDropdown(true);
        }}
      />
    </>
  );
};
