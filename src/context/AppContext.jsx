import React, { createContext, useContext, useState, useEffect } from 'react';
import { RESTAURANTS, RIDERS_POOL, AVAILABLE_COUPONS } from '../data/mockData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

// Simple Web Audio API sound synthesizers for tactile UX
const playTone = (type) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else if (type === 'bell') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    }
  } catch {
    // Audio context not allowed before user interaction
  }
};

export const AppProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState(RESTAURANTS);
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryTip, setDeliveryTip] = useState(20);
  const [activeRole, setActiveRole] = useState('customer'); // customer | kitchen | rider | system_design
  const [activeOrder, setActiveOrder] = useState(null);
  const [systemLogs, setSystemLogs] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({
    tag: 'Home',
    text: 'Flat 402, Lotus Greens, Central Boulevard',
    coords: { x: 440, y: 390 }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPhoneAuthOpen, setIsPhoneAuthOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('foodpulse_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.name || parsed.name.toLowerCase().includes('rahul')) {
          parsed.name = 'SAWAN';
          localStorage.setItem('foodpulse_user', JSON.stringify(parsed));
        }
        return parsed;
      }
      const defaultUser = {
        id: 'user-01',
        name: 'SAWAN',
        phone: '+91 98765 43210',
        walletCoins: 240,
        addresses: [
          { tag: 'Home', text: 'Flat 402, Lotus Greens, Central Boulevard', coords: { x: 440, y: 390 } }
        ]
      };
      localStorage.setItem('foodpulse_user', JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return { id: 'user-01', name: 'SAWAN', phone: '+91 98765 43210', walletCoins: 240 };
    }
  });

  // Sync with backend API on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCurrentUser(prev => {
            if (!prev || prev.name.toLowerCase().includes('rahul')) {
              localStorage.setItem('foodpulse_user', JSON.stringify(data.data));
              return data.data;
            }
            return prev;
          });
        }
      })
      .catch(() => {});

    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length > 0) {
          setRestaurants(data.data);
        }
      })
      .catch(() => {});

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length > 0) {
          setOrderHistory(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const [dispatchRadar, setDispatchRadar] = useState({
    active: false,
    radiusKm: 3.0,
    scoredCandidates: [],
    matchedRider: null,
    countdownSec: 30
  });

  const [orderHistory, setOrderHistory] = useState([
    {
      id: 'ORD-918231',
      date: 'Yesterday, 8:45 PM',
      restaurant: RESTAURANTS[0],
      items: [
        { id: 'ds-1', name: 'Royal Dum Hyderabadi Chicken Biryani', price: 349, qty: 1, isVeg: false }
      ],
      totalPaid: 398,
      status: 'DELIVERED',
      paymentMethod: 'UPI'
    },
    {
      id: 'ORD-882310',
      date: '28 Sep 2026, 1:15 PM',
      restaurant: RESTAURANTS[1],
      items: [
        { id: 'ac-1', name: 'Classic Margherita Di Bufala (12")', price: 399, qty: 1, isVeg: true },
        { id: 'ac-3', name: 'Truffle Parmesan Garlic Breadsticks', price: 199, qty: 1, isVeg: true }
      ],
      totalPaid: 642,
      status: 'DELIVERED',
      paymentMethod: 'CARD'
    }
  ]);

  const [favorites, setFavorites] = useState(['resto-1', 'resto-2']);

  const toggleFavorite = (restoId) => {
    setFavorites(prev => {
      const exists = prev.includes(restoId);
      const next = exists ? prev.filter(id => id !== restoId) : [...prev, restoId];
      showToast(
        exists ? 'Removed from Bookmarks' : 'Saved to Favorites',
        'Updated your favorite food spots',
        '❤️'
      );
      return next;
    });
  };

  const reorderPastOrder = (pastOrder) => {
    setCart(pastOrder.items.map(it => ({
      ...it,
      restaurantId: pastOrder.restaurant.id,
      restaurantName: pastOrder.restaurant.name,
      restaurantCoords: pastOrder.restaurant.coords
    })));
    setIsCartOpen(true);
    showToast('Items Added to Cart', `Loaded ${pastOrder.items.length} items from past order`, '🛍️');
  };

  // Helper to publish simulated Kafka Events to the system event bus
  const emitKafkaEvent = (topic, eventName, payload) => {
    const logEntry = {
      id: 'kfk-' + Math.random().toString(36).substring(2, 9),
      topic,
      event: eventName,
      payload,
      timestamp: new Date().toLocaleTimeString() + '.' + String(new Date().getMilliseconds()).padStart(3, '0')
    };
    setSystemLogs(prev => [logEntry, ...prev.slice(0, 49)]); // keep latest 50
  };

  const showToast = (title, message, icon = '🔔') => {
    setToastMessage({ title, message, icon });
    setTimeout(() => {
      setToastMessage(prev => (prev?.title === title ? null : prev));
    }, 4000);
  };

  // Cart operations
  const addToCart = (item, restaurant) => {
    playTone('pop');
    setCart(prev => {
      // If adding from another restaurant, reset cart or warn
      const existingRestoItem = prev.find(i => i.restaurantId !== restaurant.id);
      if (existingRestoItem) {
        if (!window.confirm(`Your cart already contains items from "${existingRestoItem.restaurantName}". Reset cart to add from "${restaurant.name}"?`)) {
          return prev;
        }
        return [{
          ...item,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          restaurantCoords: restaurant.coords,
          qty: 1
        }];
      }

      const existingIndex = prev.findIndex(i => i.id === item.id);
      if (existingIndex > -1) {
        return prev.map((it, idx) => idx === existingIndex ? { ...it, qty: it.qty + 1 } : it);
      } else {
        return [...prev, {
          ...item,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          restaurantCoords: restaurant.coords,
          qty: 1
        }];
      }
    });
    showToast('Added to Cart', `${item.name} added to your order`, '🛍️');
  };

  const updateCartQty = (itemId, delta) => {
    playTone('pop');
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code) => {
    const found = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!found) {
      showToast('Invalid Coupon', 'Coupon code not found or expired', '❌');
      return false;
    }
    const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (itemTotal < found.minCart) {
      showToast('Min Cart Value', `Add ₹${found.minCart - itemTotal} more to apply this coupon`, '⚠️');
      return false;
    }
    setAppliedCoupon(found);
    playTone('success');
    showToast('Coupon Applied!', `You saved with ${found.code}`, '🎉');
    return true;
  };

  // Bill calculations
  const calculateBill = () => {
    const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let deliveryFee = itemTotal > 0 ? 35 : 0;
    const platformFee = itemTotal > 0 ? 7 : 0;
    const taxes = Math.round(itemTotal * 0.05); // 5% GST
    let discount = 0;

    if (appliedCoupon && itemTotal >= appliedCoupon.minCart) {
      if (appliedCoupon.freeDelivery) {
        discount += deliveryFee;
        deliveryFee = 0;
      } else if (appliedCoupon.flatDiscount) {
        discount += appliedCoupon.flatDiscount;
      } else if (appliedCoupon.discountPct) {
        const pctVal = Math.round((itemTotal * appliedCoupon.discountPct) / 100);
        discount += Math.min(pctVal, appliedCoupon.maxDiscount || pctVal);
      }
    }

    const totalToPay = Math.max(0, itemTotal + deliveryFee + platformFee + taxes + deliveryTip - discount);
    return { itemTotal, deliveryFee, platformFee, taxes, discount, tip: deliveryTip, totalToPay };
  };

  // Order Placement & State Machine Flow
  const placeOrder = (paymentMethod) => {
    if (cart.length === 0) return;
    const bill = calculateBill();
    const currentResto = RESTAURANTS.find(r => r.id === cart[0].restaurantId) || RESTAURANTS[0];
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const deliveryPin = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder = {
      id: orderId,
      status: 'PLACED', // State 1: Placed
      items: [...cart],
      restaurant: currentResto,
      bill,
      totalPaid: bill.totalToPay,
      paymentMethod,
      customerAddress: selectedAddress,
      deliveryAddress: selectedAddress,
      deliveryPin,
      assignedRider: null,
      etaMin: currentResto.deliveryTimeMin,
      currentStepIndex: 0,
      createdAt: new Date().toISOString(),
      date: 'Just now, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      history: [
        { status: 'PLACED', label: 'Order Placed & Payment Authorized', time: new Date().toLocaleTimeString() }
      ],
      // Road path coordinates for live tracking animation: Resto -> Waypoint1 -> Waypoint2 -> Customer
      routeCoords: [
        currentResto.coords,
        { x: (currentResto.coords.x + selectedAddress.coords.x) / 2 - 40, y: (currentResto.coords.y + selectedAddress.coords.y) / 2 + 30 },
        { x: (currentResto.coords.x + selectedAddress.coords.x) / 2 + 40, y: (currentResto.coords.y + selectedAddress.coords.y) / 2 - 20 },
        selectedAddress.coords
      ],
      riderCurrentPos: { ...currentResto.coords },
      riderProgressPct: 0
    };

    setActiveOrder(newOrder);
    setOrderHistory(prev => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);
    playTone('success');
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

    // Sync order to backend
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser?.id || 'user-01',
        restaurant: currentResto,
        items: [...cart],
        bill,
        paymentMethod,
        deliveryAddress: selectedAddress
      })
    }).catch(() => {});

    // Emit Kafka events
    emitKafkaEvent('orders.lifecycle', 'ORDER_PLACED', {
      orderId,
      customerId: currentUser?.id || 'usr_8921',
      restaurantId: currentResto.id,
      amount: bill.totalToPay,
      paymentMethod
    });

    emitKafkaEvent('payments.ledger', 'PAYMENT_CAPTURED', {
      orderId,
      status: 'SUCCESS',
      escrowHold: true,
      amount: bill.totalToPay
    });

    showToast('Order Placed Successfully!', `Order ${orderId} sent to ${currentResto.name}`, '🚀');

    // Automatically transition to RESTAURANT_ACCEPTED in 2.5s for seamless demo
    setTimeout(() => {
      kitchenAcceptOrder(orderId);
    }, 2800);
  };

  // State 2: Restaurant Accepts Order
  const kitchenAcceptOrder = (orderId) => {
    setActiveOrder(prev => {
      if (!prev || prev.id !== orderId) return prev;
      playTone('bell');
      emitKafkaEvent('kitchen.orders', 'ORDER_ACCEPTED_BY_KITCHEN', {
        orderId,
        prepTimeEstimatedMin: 15,
        timestamp: new Date().toISOString()
      });
      return {
        ...prev,
        status: 'ACCEPTED',
        currentStepIndex: 1,
        history: [
          ...prev.history,
          { status: 'ACCEPTED', label: 'Restaurant Confirmed & Assigned to Chef', time: new Date().toLocaleTimeString() }
        ]
      };
    });

    showToast('Kitchen Accepted Order', 'Chefs have fired up the stove!', '🍳');

    // Trigger food preparation state & dispatch engine simulation
    setTimeout(() => {
      kitchenPreparing(orderId);
    }, 3200);
  };

  // State 3: Food Preparing & Trigger Slide 7 Dispatch Algorithm
  const kitchenPreparing = (orderId) => {
    setActiveOrder(prev => {
      if (!prev || prev.id !== orderId) return prev;
      emitKafkaEvent('kitchen.orders', 'FOOD_COOKING_IN_PROGRESS', {
        orderId,
        station: 'Wok / Tandoor'
      });
      return {
        ...prev,
        status: 'PREPARING',
        currentStepIndex: 2,
        history: [
          ...prev.history,
          { status: 'PREPARING', label: 'Chef is cooking your fresh dishes', time: new Date().toLocaleTimeString() }
        ]
      };
    });

    // Run Slide 7 Dispatch Matching Algorithm!
    simulateDispatchAssignment(orderId);
  };

  // SLIDE 7: Delivery Partner Assignment (Dispatch Engine Algorithm)
  const simulateDispatchAssignment = (orderId) => {
    emitKafkaEvent('dispatch.matching', 'DISPATCH_TRIGGERED', {
      orderId,
      algorithm: 'Greedy Heuristic Proximity Ranking',
      searchRadiusKm: 3.5,
      timestamp: new Date().toISOString()
    });

    // Score all riders based on distance, ETA, rating, acceptance rate
    const candidates = RIDERS_POOL.map(rider => {
      // Score = 40% distance proximity + 30% rating + 30% acceptance rate
      const distScore = Math.max(0, 100 - (rider.distanceToRestoKm * 25));
      const ratingScore = (rider.rating / 5.0) * 100;
      const acceptScore = parseFloat(rider.acceptanceRate);
      const totalScore = (distScore * 0.45) + (ratingScore * 0.25) + (acceptScore * 0.30);
      return {
        ...rider,
        computedScore: Math.round(totalScore * 10) / 10
      };
    }).sort((a, b) => b.computedScore - a.computedScore);

    const winner = candidates[0];

    setDispatchRadar({
      active: true,
      radiusKm: 3.5,
      scoredCandidates: candidates,
      matchedRider: winner,
      countdownSec: 30
    });

    emitKafkaEvent('dispatch.matching', 'CANDIDATES_SCORED', {
      orderId,
      topCandidate: winner.name,
      score: winner.computedScore,
      distanceKm: winner.distanceToRestoKm
    });

    // Simulate Rider accepting the order after 3.5 seconds
    setTimeout(() => {
      riderAcceptOrder(winner, orderId);
    }, 3800);
  };

  // State 4: Rider Accepted (Slide 7 Completed)
  const riderAcceptOrder = (rider, orderId) => {
    playTone('success');
    setDispatchRadar(prev => ({ ...prev, active: false }));

    emitKafkaEvent('dispatch.matching', 'RIDER_ACQUIRED_LOCK', {
      orderId,
      riderId: rider.id,
      lockType: 'Redis Redlock (Distributed)',
      ttlMs: 30000
    });

    setActiveOrder(prev => {
      if (!prev || prev.id !== orderId) return prev;
      return {
        ...prev,
        status: 'RIDER_ASSIGNED',
        assignedRider: rider,
        currentStepIndex: 3,
        history: [
          ...prev.history,
          { status: 'RIDER_ASSIGNED', label: `${rider.name} is on the way to pick up food`, time: new Date().toLocaleTimeString() }
        ]
      };
    });

    showToast('Delivery Partner Assigned!', `${rider.name} (${rider.vehicle}) is reaching restaurant`, '🛵');

    // Automatically transition to Picked Up
    setTimeout(() => {
      riderPickupOrder(orderId);
    }, 4500);
  };

  // State 5: Food Picked Up from Restaurant
  const riderPickupOrder = (orderId) => {
    playTone('pop');
    emitKafkaEvent('dispatch.lifecycle', 'ORDER_PICKED_UP_FROM_KITCHEN', {
      orderId,
      riderId: activeOrder?.assignedRider?.id || 'rider-01',
      thermalBagSealed: true
    });

    setActiveOrder(prev => {
      if (!prev || prev.id !== orderId) return prev;
      return {
        ...prev,
        status: 'OUT_FOR_DELIVERY',
        currentStepIndex: 4,
        history: [
          ...prev.history,
          { status: 'OUT_FOR_DELIVERY', label: 'Order picked up! Rider is speeding towards your location', time: new Date().toLocaleTimeString() }
        ]
      };
    });

    showToast('Food Picked Up!', 'Your food is hot and out for delivery 🚀', '🍕');
  };

  // Move rider along route (Slide 8 Real-time tracking animation loop)
  useEffect(() => {
    if (!activeOrder || activeOrder.status !== 'OUT_FOR_DELIVERY') return;

    const interval = setInterval(() => {
      setActiveOrder(prev => {
        if (!prev || prev.status !== 'OUT_FOR_DELIVERY') return prev;
        const currentPct = prev.riderProgressPct || 0;
        const nextPct = currentPct + 2.5;

        if (nextPct >= 100) {
          // Delivered!
          clearInterval(interval);
          playTone('success');
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });

          emitKafkaEvent('orders.lifecycle', 'ORDER_DELIVERED', {
            orderId: prev.id,
            deliveredAt: new Date().toISOString(),
            settlementTriggered: true
          });

          return {
            ...prev,
            status: 'DELIVERED',
            riderProgressPct: 100,
            currentStepIndex: 5,
            etaMin: 0,
            history: [
              ...prev.history,
              { status: 'DELIVERED', label: 'Delivered with a smile! Enjoy your feast 😋', time: new Date().toLocaleTimeString() }
            ]
          };
        }

        // Interpolate coordinates along route
        const p1 = prev.routeCoords[0];
        const p2 = prev.routeCoords[1];
        const p3 = prev.routeCoords[2];
        const p4 = prev.routeCoords[3];

        const t = nextPct / 100;
        // Cubic bezier or multi-segment lerp
        let currentX, currentY;
        if (t < 0.33) {
          const subT = t / 0.33;
          currentX = p1.x + (p2.x - p1.x) * subT;
          currentY = p1.y + (p2.y - p1.y) * subT;
        } else if (t < 0.66) {
          const subT = (t - 0.33) / 0.33;
          currentX = p2.x + (p3.x - p2.x) * subT;
          currentY = p2.y + (p3.y - p2.y) * subT;
        } else {
          const subT = (t - 0.66) / 0.34;
          currentX = p3.x + (p4.x - p3.x) * subT;
          currentY = p3.y + (p4.y - p3.y) * subT;
        }

        const remainingEta = Math.max(1, Math.round(prev.restaurant.deliveryTimeMin * (1 - t)));

        // Periodically emit Kafka GPS location beacon (Slide 8)
        if (Math.floor(nextPct) % 10 === 0) {
          emitKafkaEvent('rider.gps.stream', 'LOCATION_BEACON', {
            riderId: prev.assignedRider?.id,
            orderId: prev.id,
            x: Math.round(currentX),
            y: Math.round(currentY),
            speedKmh: 34,
            remainingEtaMin: remainingEta
          });
        }

        return {
          ...prev,
          riderProgressPct: nextPct,
          riderCurrentPos: { x: currentX, y: currentY },
          etaMin: remainingEta
        };
      });
    }, 600);

    return () => clearInterval(interval);
  }, [activeOrder?.status]);

  // Kitchen toggle item inventory
  const toggleItemStock = (restaurantId, itemId) => {
    setRestaurants(prev => {
      return prev.map(resto => {
        if (resto.id === restaurantId) {
          return {
            ...resto,
            menu: resto.menu.map(dish => {
              if (dish.id === itemId) {
                const nextState = !dish.isOutOfStock;
                showToast(
                  nextState ? 'Dish Marked Out of Stock' : 'Dish Marked Available',
                  `${dish.name} status updated`,
                  nextState ? '🔴' : '🟢'
                );
                emitKafkaEvent('menu.inventory', 'ITEM_AVAILABILITY_CHANGED', {
                  restaurantId,
                  itemId,
                  isOutOfStock: nextState
                });
                return { ...dish, isOutOfStock: nextState };
              }
              return dish;
            })
          };
        }
        return resto;
      });
    });
  };

  return (
    <AppContext.Provider
      value={{
        restaurants,
        cart,
        addToCart,
        updateCartQty,
        clearCart,
        appliedCoupon,
        applyCouponCode,
        removeCoupon: () => setAppliedCoupon(null),
        deliveryTip,
        setDeliveryTip,
        calculateBill,
        activeRole,
        setActiveRole,
        activeOrder,
        placeOrder,
        kitchenAcceptOrder,
        kitchenFoodReady: () => activeOrder && simulateDispatchAssignment(activeOrder.id),
        riderAcceptOrder,
        riderPickupOrder,
        selectedAddress,
        setSelectedAddress,
        searchQuery,
        setSearchQuery,
        vegOnlyFilter,
        setVegOnlyFilter,
        selectedCategory,
        setSelectedCategory,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        systemLogs,
        emitKafkaEvent,
        dispatchRadar,
        toggleItemStock,
        orderHistory,
        reorderPastOrder,
        favorites,
        toggleFavorite,
        setRestaurants,
        currentUser,
        setCurrentUser,
        isPhoneAuthOpen,
        setIsPhoneAuthOpen,
        invoiceOrder,
        setInvoiceOrder,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
