import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CategoryChips } from './components/CategoryChips';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveOrderTracker } from './components/LiveOrderTracker';
import { KitchenDashboard } from './components/KitchenDashboard';
import { RiderDashboard } from './components/RiderDashboard';
import { 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  Percent, 
  X, 
  Check, 
  Smartphone, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { AVAILABLE_COUPONS } from './data/mockData';

const MainContent = () => {
  const { 
    restaurants, 
    activeRole, 
    activeOrder, 
    searchQuery, 
    vegOnlyFilter, 
    selectedCategory, 
    toastMessage,
    applyCouponCode,
    setActiveRole 
  } = useApp();

  const [selectedResto, setSelectedResto] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('relevance'); // relevance | rating | deliveryTime | cost
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const [isTrackerCollapsed, setIsTrackerCollapsed] = useState(false);

  // Filter restaurants
  const filteredRestaurants = restaurants.filter((resto) => {
    // Search query matching restaurant name, cuisines, or dishes
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = resto.name.toLowerCase().includes(q);
      const matchCuisine = resto.cuisine.some(c => c.toLowerCase().includes(q));
      const matchDish = resto.menu.some(d => d.name.toLowerCase().includes(q));
      if (!matchName && !matchCuisine && !matchDish) return false;
    }

    // Veg Only Filter
    if (vegOnlyFilter && !resto.pureVeg && !resto.menu.some(d => d.isVeg)) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const matchCat = resto.menu.some(d => d.category === selectedCategory);
      if (!matchCat) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'deliveryTime') return a.deliveryTimeMin - b.deliveryTimeMin;
    if (sortBy === 'cost') return a.costForTwo - b.costForTwo;
    return 0;
  });

  const handleCopyCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    applyCouponCode(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70">
      
      {/* Navigation Bar */}
      <Navbar 
        onOpenOffers={() => setIsOffersModalOpen(true)} 
      />

      {/* Main Body based on selected Role */}
      <main className="flex-1 pb-16">
        
        {/* CUSTOMER ROLE */}
        {activeRole === 'customer' && (
          <div className="space-y-6">
            
            {/* If there is an active order, show Live Tracker */}
            {activeOrder && !isTrackerCollapsed && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setIsTrackerCollapsed(true)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <span>Minimize Map to Bottom Bar</span>
                    <span>↓</span>
                  </button>
                </div>
                <LiveOrderTracker />
              </div>
            )}

            {/* Food Categories Carousel */}
            <CategoryChips />

            {/* Consumer Hero Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-orange-500/15 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="relative z-10 max-w-xl">
                  <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Special Welcome Deal</span>
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight mt-3 text-white leading-tight">
                    Hot meals delivered straight to your door
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base mt-2 font-medium">
                    Order from top verified chefs, artisan kitchens, and bakeries. Use coupon <span className="font-mono bg-white text-orange-600 px-2.5 py-1 rounded-lg font-extrabold shadow-sm">STEAL60</span> for 60% OFF.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => setIsOffersModalOpen(true)}
                    className="bg-white hover:bg-orange-50 text-orange-600 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Percent className="w-4 h-4" />
                    <span>View Today's Offers</span>
                  </button>
                </div>

                <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
              </div>
            </div>

            {/* Restaurants Directory Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              
              {/* Filter & Sorting Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight">
                    Top Restaurants Near You
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Showing {filteredRestaurants.length} curated food spots with fast live delivery
                  </p>
                </div>

                {/* Sort Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Sort:</span>
                  </span>
                  {[
                    { id: 'relevance', label: 'Relevance' },
                    { id: 'rating', label: 'Rating 4.0+' },
                    { id: 'deliveryTime', label: 'Fastest Delivery' },
                    { id: 'cost', label: 'Price: Low to High' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSortBy(s.id)}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                        sortBy === s.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Restaurants */}
              {filteredRestaurants.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="font-bold text-lg text-slate-800">No restaurants match your search</h3>
                  <p className="text-xs text-slate-500 mt-1">Try clearing your filters or search keywords.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  {filteredRestaurants.map((resto) => (
                    <RestaurantCard
                      key={resto.id}
                      restaurant={resto}
                      onSelect={(r) => setSelectedResto(r)}
                    />
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

        {/* KITCHEN PORTAL ROLE (Accessed from footer) */}
        {activeRole === 'kitchen' && <KitchenDashboard />}

        {/* RIDER APP ROLE (Accessed from footer) */}
        {activeRole === 'rider' && <RiderDashboard />}

      </main>

      {/* Offers & Discounts Modal */}
      {isOffersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-xl text-slate-900 font-display">Available Offers & Deals</h3>
              </div>
              <button 
                onClick={() => setIsOffersModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {AVAILABLE_COUPONS.map((cp) => (
                <div
                  key={cp.code}
                  className="p-4 rounded-2xl border border-dashed border-orange-300 bg-orange-50/50 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-orange-600 bg-white px-2.5 py-0.5 rounded-lg border border-orange-200 shadow-sm">
                        {cp.code}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1.5">{cp.label}</p>
                    <p className="text-[11px] text-slate-500">Min. order ₹{cp.minCart}</p>
                  </div>

                  <button
                    onClick={() => handleCopyCoupon(cp.code)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1"
                  >
                    {copiedCoupon === cp.code ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied!</span>
                      </>
                    ) : (
                      <span>Apply</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Modals & Drawers */}
      <RestaurantDetailModal
        restaurant={selectedResto}
        onClose={() => setSelectedResto(null)}
      />

      <CartDrawer
        onProceedCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="toast-banner">
          <span className="text-xl">{toastMessage.icon}</span>
          <div>
            <p className="font-extrabold text-xs text-white">{toastMessage.title}</p>
            <p className="text-[11px] text-slate-300">{toastMessage.message}</p>
          </div>
        </div>
      )}

      {/* Clean, Commercial Consumer Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
            
            {/* Col 1: Brand & Tagline */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white text-xl shadow-md">
                  🍔
                </div>
                <span className="font-black text-2xl text-white font-display">
                  Food<span className="text-orange-500">Pulse</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Superfast food delivery from your favorite neighborhood restaurants, curated cloud kitchens, and gourmet dining spots. Delivered fresh in under 30 minutes.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700 text-xs font-semibold cursor-pointer">
                  🍏 App Store
                </div>
                <div className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700 text-xs font-semibold cursor-pointer">
                  ▶ Google Play
                </div>
              </div>
            </div>

            {/* Col 2: Company */}
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 mb-4">
                Company
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-white cursor-pointer transition-colors">FoodPulse Blog</li>
                <li className="hover:text-white cursor-pointer transition-colors">FoodPulse One</li>
              </ul>
            </div>

            {/* Col 3: Contact & Support */}
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 mb-4">
                Help & Support
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-white cursor-pointer transition-colors">Refund & Cancellation</li>
              </ul>
            </div>

            {/* Col 4: Partner Portals (Cleanly located for management) */}
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 mb-4">
                Partner Portals
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li 
                  onClick={() => setActiveRole('kitchen')}
                  className="hover:text-orange-400 cursor-pointer transition-colors flex items-center gap-1 font-semibold text-orange-400/90"
                >
                  <span>Restaurant Kitchen Login</span>
                  <ChevronRight className="w-3 h-3" />
                </li>
                <li 
                  onClick={() => setActiveRole('rider')}
                  className="hover:text-orange-400 cursor-pointer transition-colors flex items-center gap-1 font-semibold text-orange-400/90"
                >
                  <span>Delivery Fleet Login</span>
                  <ChevronRight className="w-3 h-3" />
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">Partner With Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Drive With Us</li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <p>© 2026 FoodPulse Technologies Pvt. Ltd. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Security: 256-Bit SSL Encrypted</span>
              <span>100% Contactless Delivery</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Bottom Bar when Order is active & minimized */}
      {activeOrder && isTrackerCollapsed && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl animate-slide-up">
          <div 
            onClick={() => setIsTrackerCollapsed(false)}
            className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">🛵</span>
              <div>
                <p className="font-extrabold text-sm text-white">Order {activeOrder.id} • {activeOrder.status}</p>
                <p className="text-xs text-orange-400 font-bold">Rider on the way • {activeOrder.etaMin} mins remaining</p>
              </div>
            </div>
            <button className="bg-orange-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-sm">
              View Live Map ➔
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
