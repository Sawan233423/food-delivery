import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Bike, 
  Store, 
  Plus, 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  X,
  Sparkles
} from 'lucide-react';

export const SuperAdminDashboard = () => {
  const { 
    restaurants, 
    activeOrder, 
    setActiveRole,
    setRestaurants 
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // overview | restaurants | live_orders
  const [isAddRestoModalOpen, setIsAddRestoModalOpen] = useState(false);
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [selectedRestoForDish, setSelectedRestoForDish] = useState(restaurants[0]);

  // Form states for adding new restaurant
  const [newRestoName, setNewRestoName] = useState('');
  const [newRestoCuisines, setNewRestoCuisines] = useState('');
  const [newRestoPrice, setNewRestoPrice] = useState('350');
  const [newRestoTime, setNewRestoTime] = useState('25');
  const [newRestoBanner, setNewRestoBanner] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80');

  // Form states for adding new dish
  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState('199');
  const [dishCategory, setDishCategory] = useState('biryani');
  const [dishIsVeg, setDishIsVeg] = useState(true);
  const [dishDesc, setDishDesc] = useState('');
  const [dishImage, setDishImage] = useState('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80');

  // Realistic mock analytics
  const kpiStats = [
    { title: 'Gross Merchandise Value (GMV)', value: '₹4,82,650', change: '+18.4% vs last week', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Net Platform Commission (20%)', value: '₹96,530', change: '+22.1% net profit', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { title: 'Total Orders Delivered', value: '1,428', change: 'Avg basket: ₹338', icon: ShoppingBag, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'Active Delivery Fleet Online', value: '42 Riders', change: 'Avg speed: 21 mins', icon: Bike, color: 'text-sky-400', bg: 'bg-sky-500/10' }
  ];

  const handleCreateRestaurant = (e) => {
    e.preventDefault();
    if (!newRestoName.trim()) return;

    const newResto = {
      id: 'resto-' + (restaurants.length + 1),
      name: newRestoName,
      cuisine: newRestoCuisines.split(',').map(c => c.trim()),
      rating: 4.8,
      reviewsCount: '100+',
      deliveryTimeMin: parseInt(newRestoTime) || 25,
      distanceKm: 1.5,
      costForTwo: parseInt(newRestoPrice) || 350,
      offer: '20% OFF Welcome Deal',
      couponCode: 'WELCOME20',
      pureVeg: false,
      promoted: true,
      banner: newRestoBanner,
      address: 'Main Commercial Hub, City Center',
      coords: { x: 280, y: 220 },
      gps: { lat: 28.5750, lng: 77.3250 },
      menu: [
        {
          id: 'dish-custom-1',
          name: 'Signature Chef Special Delight',
          category: 'main',
          price: 249,
          isVeg: true,
          isBestseller: true,
          rating: 4.9,
          ratingCount: 88,
          description: 'Crafted with premium authentic farm fresh ingredients and house spices.',
          image: newRestoBanner
        }
      ]
    };

    setRestaurants(prev => [newResto, ...prev]);
    setIsAddRestoModalOpen(false);
    setNewRestoName('');
    setNewRestoCuisines('');
  };

  const handleAddDish = (e) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    const newDish = {
      id: 'dish-' + Math.random().toString(36).substring(2, 7),
      name: dishName,
      price: parseInt(dishPrice) || 199,
      category: dishCategory,
      isVeg: dishIsVeg,
      isBestseller: true,
      rating: 4.8,
      ratingCount: 1,
      description: dishDesc || 'Freshly made to order.',
      image: dishImage
    };

    setRestaurants(prev => {
      return prev.map(r => {
        if (r.id === selectedRestoForDish.id) {
          return {
            ...r,
            menu: [newDish, ...r.menu]
          };
        }
        return r;
      });
    });

    setIsAddDishModalOpen(false);
    setDishName('');
    setDishDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full">
              Platform Master Console
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Super Admin</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white mt-2">
            FoodPulse Business Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Monitor real-time GMV, revenue commissions, active orders, and restaurant fleet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddRestoModalOpen(true)}
            className="btn-primary text-xs py-3 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Restaurant</span>
          </button>

          <button
            onClick={() => setActiveRole('customer')}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-3 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span>Customer App</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {kpiStats.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-black text-slate-900 font-display">{kpi.value}</span>
                <span className="block text-[11px] font-bold text-emerald-600 mt-1">{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub Tabs */}
      <div className="mt-8 flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Restaurants & Revenue ({restaurants.length})
        </button>
        <button
          onClick={() => setActiveTab('live_orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'live_orders'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Live Orders Dispatch Stream
        </button>
      </div>

      {/* TAB 1: RESTAURANTS DIRECTORY & FINANCIALS */}
      {activeTab === 'overview' && (
        <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-slide-up">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Partner Restaurants Management</h3>
              <p className="text-xs text-slate-500 mt-0.5">Automated 20% platform commission deductions on orders</p>
            </div>
            <button
              onClick={() => {
                setSelectedRestoForDish(restaurants[0]);
                setIsAddDishModalOpen(true);
              }}
              className="bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dish to Menu</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Restaurant</th>
                  <th className="py-4 px-6">Cuisines</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Avg Cost</th>
                  <th className="py-4 px-6">Commission Rate</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {restaurants.map(resto => (
                  <tr key={resto.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={resto.banner} alt={resto.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{resto.name}</p>
                          <p className="text-[11px] text-slate-400">{resto.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-600">
                      {resto.cuisine.slice(0, 2).join(', ')}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-emerald-700">
                      {resto.rating} ★
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      ₹{resto.costForTwo} for 2
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                        20% Platform Fee
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedRestoForDish(resto);
                          setIsAddDishModalOpen(true);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        + Add Dish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE ORDERS DISPATCH STREAM */}
      {activeTab === 'live_orders' && (
        <div className="mt-6 space-y-4 animate-slide-up">
          {activeOrder ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-orange-400 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md">
                    Order ID: {activeOrder.id}
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md font-bold">
                    Stage: {activeOrder.status}
                  </span>
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  {activeOrder.restaurant.name} ➔ {activeOrder.customerAddress.tag}
                </h4>
                <p className="text-xs text-slate-500">
                  Customer: Rahul • Rider: {activeOrder.assignedRider?.name || 'Searching nearby...'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-semibold">Total Order Value</span>
                <span className="text-2xl font-black text-slate-900 font-display">₹{activeOrder.bill.totalToPay}</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                  Platform Commission: ₹{Math.round(activeOrder.bill.totalToPay * 0.2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <span className="text-4xl block mb-2">📦</span>
              <h4 className="font-bold text-base text-slate-800">No active customer orders right now</h4>
              <p className="text-xs text-slate-500 mt-1">Place an order in the Customer App to view it streaming here.</p>
            </div>
          )}
        </div>
      )}

      {/* Onboard Restaurant Modal */}
      {isAddRestoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-xl text-slate-900 font-display">Onboard New Restaurant</h3>
              </div>
              <button 
                onClick={() => setIsAddRestoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} className="mt-5 space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-900 font-bold">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={newRestoName}
                  onChange={e => setNewRestoName(e.target.value)}
                  placeholder="e.g. Royal Punjab Dhaba"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-900 font-bold">Cuisines (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={newRestoCuisines}
                  onChange={e => setNewRestoCuisines(e.target.value)}
                  placeholder="North Indian, Tandoor, Mughlai"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Cost for Two (₹)</label>
                  <input
                    type="number"
                    value={newRestoPrice}
                    onChange={e => setNewRestoPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Delivery Time (Mins)</label>
                  <input
                    type="number"
                    value={newRestoTime}
                    onChange={e => setNewRestoTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-900 font-bold">Banner Photo URL</label>
                <input
                  type="url"
                  value={newRestoBanner}
                  onChange={e => setNewRestoBanner(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3.5 text-sm font-bold mt-2"
              >
                Approve & Launch Restaurant
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Dish Modal */}
      {isAddDishModalOpen && selectedRestoForDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 font-display">Add Dish to Menu</h3>
                <p className="text-xs text-orange-600 font-bold mt-0.5">{selectedRestoForDish.name}</p>
              </div>
              <button 
                onClick={() => setIsAddDishModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDish} className="mt-5 space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-900 font-bold">Dish Name</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={e => setDishName(e.target.value)}
                  placeholder="e.g. Butter Garlic Naan"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={dishPrice}
                    onChange={e => setDishPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Category</label>
                  <select
                    value={dishCategory}
                    onChange={e => setDishCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="biryani">Biryani</option>
                    <option value="pizza">Pizzas</option>
                    <option value="burger">Burgers</option>
                    <option value="chinese">Asian Bowls</option>
                    <option value="healthy">Healthy</option>
                    <option value="dessert">Desserts</option>
                    <option value="rolls">Rolls</option>
                    <option value="starters">Starters</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-slate-900 font-bold">Type:</label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="vegType"
                    checked={dishIsVeg}
                    onChange={() => setDishIsVeg(true)}
                  />
                  <span>🌱 Vegetarian</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="vegType"
                    checked={!dishIsVeg}
                    onChange={() => setDishIsVeg(false)}
                  />
                  <span>🍗 Non-Vegetarian</span>
                </label>
              </div>

              <div>
                <label className="block mb-1 text-slate-900 font-bold">Description</label>
                <textarea
                  rows={2}
                  value={dishDesc}
                  onChange={e => setDishDesc(e.target.value)}
                  placeholder="Appetizing description of ingredients..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3.5 text-sm font-bold mt-2"
              >
                Add Dish to Live Menu
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
