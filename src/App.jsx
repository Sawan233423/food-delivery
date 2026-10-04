import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CategoryChips } from './components/CategoryChips';
import { CategoryVarietyShowcase } from './components/CategoryVarietyShowcase';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PhoneAuthModal } from './components/PhoneAuthModal';
import { InvoiceModal } from './components/InvoiceModal';
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
import { AVAILABLE_COUPONS, CATEGORIES } from './data/mockData';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileStickyCartStrip } from './components/MobileStickyCartStrip';

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
    setActiveRole,
    isPhoneAuthOpen,
    setIsPhoneAuthOpen,
    invoiceOrder,
    setInvoiceOrder
  } = useApp();

  const [selectedResto, setSelectedResto] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('relevance'); // relevance | rating | deliveryTime | cost
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const [isTrackerCollapsed, setIsTrackerCollapsed] = useState(false);

  // Close Offers Modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOffersModalOpen(false);
    };
    if (isOffersModalOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOffersModalOpen]);

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
      const matchCat = resto.menu.some(d => 
        d.category === selectedCategory ||
        (selectedCategory === 'burger' && (d.category === 'burger' || d.name.toLowerCase().includes('burger'))) ||
        (selectedCategory === 'pizza' && (d.category === 'pizza' || d.name.toLowerCase().includes('pizza'))) ||
        (selectedCategory === 'biryani' && (d.category === 'biryani' || d.name.toLowerCase().includes('biryani'))) ||
        (selectedCategory === 'dessert' && (d.category === 'dessert' || d.name.toLowerCase().includes('cake') || d.name.toLowerCase().includes('waffle') || d.name.toLowerCase().includes('dessert'))) ||
        (selectedCategory === 'beverages' && (d.category === 'beverages' || d.name.toLowerCase().includes('shake') || d.name.toLowerCase().includes('coffee'))) ||
        (selectedCategory === 'rolls' && (d.category === 'rolls' || d.name.toLowerCase().includes('roll') || d.name.toLowerCase().includes('wrap'))) ||
        (selectedCategory === 'chinese' && (d.category === 'chinese' || d.name.toLowerCase().includes('noodles') || d.name.toLowerCase().includes('dimsum'))) ||
        (selectedCategory === 'healthy' && (d.category === 'healthy' || d.name.toLowerCase().includes('salad') || d.name.toLowerCase().includes('bowl')))
      );
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
        onSelectRestaurant={(r) => setSelectedResto(r)}
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

            {/* Rich Category Dishes Variety Showcase (When a craving is active) */}
            {selectedCategory !== 'all' ? (
              <CategoryVarietyShowcase 
                onSelectRestaurant={(r) => setSelectedResto(r)} 
              />
            ) : (
              /* Consumer Hero Banner (When all cravings) */
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mobile App Promo Card (md:hidden) */}
                <div className="md:hidden bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 rounded-2xl p-4 text-white shadow-md shadow-orange-500/15 relative overflow-hidden flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                      <Sparkles className="w-3 h-3 text-amber-200" />
                      <span>Flat 60% OFF</span>
                    </div>
                    <h3 className="text-sm font-black font-display tracking-tight mt-1 text-white leading-tight truncate">
                      Hot meals delivered in minutes
                    </h3>
                    <p className="text-[11px] text-white/90 font-medium mt-0.5">
                      Use code <span className="font-mono bg-white text-orange-600 px-1.5 py-0.5 rounded font-black">STEAL60</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOffersModalOpen(true)}
                    className="bg-white text-orange-600 font-extrabold text-xs px-3 py-2 rounded-xl shadow-sm flex items-center gap-1 flex-shrink-0 transition-transform active:scale-95"
                  >
                    <span>Offers</span>
                    <Percent className="w-3 h-3" />
                  </button>
                </div>

                {/* Desktop Glorious Hero Banner (hidden md:flex) */}
                <div className="hidden md:flex bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 rounded-3xl p-8 lg:p-10 text-white shadow-xl shadow-orange-500/15 relative overflow-hidden items-center justify-between gap-6">
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

                  <div className="relative z-10 flex items-center gap-3">
                    <button
                      onClick={() => setIsOffersModalOpen(true)}
                      className="bg-white hover:bg-orange-50 text-orange-600 font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <Percent className="w-4 h-4" />
                      <span>View Today's Offers</span>
                    </button>
                  </div>

                  <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
                </div>
              </div>
            )}

            {/* Restaurants Directory Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4">
              
              {/* Filter & Sorting Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-200">
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-display tracking-tight">
                    {selectedCategory !== 'all'
                      ? `Restaurants Serving ${CATEGORIES.find(c => c.id === selectedCategory)?.name || 'This Dish'}`
                      : 'Top Restaurants Near You'}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">
                    {filteredRestaurants.length} curated food spots with fast live delivery
                  </p>
                </div>

                {/* Sort Chips - Horizontal Scrollable Row */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                  <span className="hidden sm:flex text-xs font-bold text-slate-400 items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Sort:</span>
                  </span>
                  {[
                    { id: 'relevance', label: 'Relevance' },
                    { id: 'rating', label: '⭐ Rating 4.0+' },
                    { id: 'deliveryTime', label: '⚡ Fastest' },
                    { id: 'cost', label: '₹ Low to High' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSortBy(s.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap flex-shrink-0 ${
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
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsOffersModalOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 animate-slide-up max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsOffersModalOpen(false)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors"
                >
                  <span>← Back</span>
                </button>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-orange-500" />
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
                    Available Offers & Deals
                  </h3>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsOffersModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors border border-slate-200"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Coupons */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
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

            {/* Bottom Close Button */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setIsOffersModalOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
              >
                Close Offers
              </button>
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

      <PhoneAuthModal
        isOpen={isPhoneAuthOpen}
        onClose={() => setIsPhoneAuthOpen(false)}
      />

      <InvoiceModal
        isOpen={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
        order={invoiceOrder}
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

      {/* Mobile Sticky Floating Cart Strip (Swiggy / Zomato style) */}
      <MobileStickyCartStrip />


      {/* Mobile Bottom App Navigation Bar (Swiggy / Zomato style) */}
      <MobileBottomNav
        onOpenOffers={() => setIsOffersModalOpen(true)}
        onFocusSearch={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const inputs = document.querySelectorAll('input[type="text"]');
          if (inputs.length > 0) inputs[0].focus();
        }}
      />

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
