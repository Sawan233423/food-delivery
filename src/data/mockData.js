export const CATEGORIES = [
  { id: 'all', name: 'All Cravings', icon: '🍽️' },
  { id: 'biryani', name: 'Biryani', icon: '🍚', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80' },
  { id: 'pizza', name: 'Pizzas', icon: '🍕', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80' },
  { id: 'burger', name: 'Burgers', icon: '🍔', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80' },
  { id: 'chinese', name: 'Asian & Bowls', icon: '🍜', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&auto=format&fit=crop&q=80' },
  { id: 'healthy', name: 'Healthy & Salads', icon: '🥗', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80' },
  { id: 'dessert', name: 'Desserts & Cakes', icon: '🍰', img: '/images/chocolate_cake_dessert.jpg' },
  { id: 'rolls', name: 'Rolls & Wraps', icon: '🌯', img: '/images/chicken_kathi_roll.jpg' },
  { id: 'beverages', name: 'Shakes & Coffee', icon: '🥤', img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300&auto=format&fit=crop&q=80' }
];

export const RESTAURANTS = [
  {
    id: 'resto-1',
    name: 'Dum Safar Biryani House',
    cuisine: ['Hyderabadi', 'Mughlai', 'Kebabs'],
    rating: 4.6,
    reviewsCount: '3.4k+',
    deliveryTimeMin: 28,
    distanceKm: 2.1,
    costForTwo: 450,
    offer: '60% OFF up to ₹120',
    couponCode: 'STEAL60',
    pureVeg: false,
    promoted: true,
    banner: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    address: 'Plot 42, Sector 18, Central Food District',
    coords: { x: 220, y: 140 }, // internal 2D grid coordinates for live map simulation
    gps: { lat: 28.5700, lng: 77.3200 },
    menu: [
      {
        id: 'ds-1',
        name: 'Royal Dum Hyderabadi Chicken Biryani',
        category: 'biryani',
        price: 349,
        isVeg: false,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 1420,
        description: 'Authentic long-grain basmati cooked with tender chicken pieces marinated in secret spices and slow-cooked in sealed clay handi.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ds-2',
        name: 'Nawabi Paneer Dum Biryani',
        category: 'biryani',
        price: 299,
        isVeg: true,
        isBestseller: true,
        rating: 4.7,
        ratingCount: 890,
        description: 'Fragrant saffron basmati rice layered with melt-in-mouth cottage cheese chunks, caramelized onions, and fresh mint.',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ds-3',
        name: 'Galouti Kebab with Roomali Roti (4 pcs)',
        category: 'starters',
        price: 289,
        isVeg: false,
        isBestseller: false,
        rating: 4.5,
        ratingCount: 420,
        description: 'Silky, aromatic Lucknowi minced meat patties pan-seared in pure ghee, served with mint chutney and pickled onions.',
        image: '/images/galouti_kebab.jpg'
      },
      {
        id: 'ds-4',
        name: 'Shahi Tukda with Rabri',
        category: 'dessert',
        price: 149,
        isVeg: true,
        isBestseller: false,
        rating: 4.6,
        ratingCount: 310,
        description: 'Crisp golden brioche soaked in cardamom syrup and blanketed with thickened saffron rabri and sliced pistachios.',
        image: '/images/shahi_tukda.jpg'
      }
    ]
  },
  {
    id: 'resto-2',
    name: 'Artisan Crust Pizza Co.',
    cuisine: ['Woodfired Pizza', 'Italian', 'Pasta'],
    rating: 4.7,
    reviewsCount: '2.8k+',
    deliveryTimeMin: 22,
    distanceKm: 1.6,
    costForTwo: 550,
    offer: 'FLAT ₹100 OFF',
    couponCode: 'CRUST100',
    pureVeg: false,
    promoted: false,
    banner: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    address: 'Shop 12, The Galleria Mall, 5th Avenue',
    coords: { x: 380, y: 110 },
    gps: { lat: 28.5820, lng: 77.3100 },
    menu: [
      {
        id: 'ac-1',
        name: 'Classic Margherita Di Bufala (12")',
        category: 'pizza',
        price: 399,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 1650,
        description: 'San Marzano tomato sauce, fresh buffalo mozzarella, hand-torn sweet basil, and extra virgin olive oil on 48h cold fermented crust.',
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ac-2',
        name: 'Fiery Pepperoni & Hot Honey Pizza',
        category: 'pizza',
        price: 499,
        isVeg: false,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 2100,
        description: 'Crispy pork pepperoni cups, shredded whole-milk mozzarella, house marinara, finished with chilli-infused hot honey drizzle.',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'ac-3',
        name: 'Truffle Parmesan Garlic Breadsticks',
        category: 'starters',
        price: 199,
        isVeg: true,
        isBestseller: false,
        rating: 4.6,
        ratingCount: 520,
        description: 'Pull-apart brioche breadsticks glazed with black truffle butter, aged parmesan, and roasted garlic aioli dip.',
        image: '/images/garlic_breadsticks.jpg'
      },
      {
        id: 'ac-4',
        name: 'Double Chocolate Fudge Brownie',
        category: 'dessert',
        price: 169,
        isVeg: true,
        isBestseller: false,
        rating: 4.7,
        ratingCount: 430,
        description: 'Warm Belgian dark chocolate brownie loaded with molten chips, served with chocolate ganache.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'resto-3',
    name: 'Burger & Co. Craft Shack',
    cuisine: ['Gourmet Burgers', 'Crispy Fries', 'Thick Shakes'],
    rating: 4.5,
    reviewsCount: '1.9k+',
    deliveryTimeMin: 25,
    distanceKm: 2.8,
    costForTwo: 350,
    offer: '50% OFF up to ₹100',
    couponCode: 'BURGER50',
    pureVeg: false,
    promoted: true,
    banner: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    address: 'Corner Bay 9, Cyber Park Boulevard',
    coords: { x: 160, y: 320 },
    gps: { lat: 28.5600, lng: 77.3350 },
    menu: [
      {
        id: 'bc-1',
        name: 'The Smokey BBQ Bacon Cheeseburger',
        category: 'burger',
        price: 279,
        isVeg: false,
        isBestseller: true,
        rating: 4.7,
        ratingCount: 1100,
        description: 'Smashed juicy patty, sharp cheddar, crispy smoked bacon, caramelized onion jam, and smokey chipotle mayo in toasted brioche.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'bc-2',
        name: 'Crispy Truffle Mushroom Crunch Burger',
        category: 'burger',
        price: 249,
        isVeg: true,
        isBestseller: true,
        rating: 4.6,
        ratingCount: 780,
        description: 'Golden panko-crusted portobello mushroom stuffed with molten cheese, truffle garlic sauce, fresh arugula, and pickles.',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'bc-3',
        name: 'Peri-Peri Loaded Cheese Fries',
        category: 'starters',
        price: 159,
        isVeg: true,
        isBestseller: false,
        rating: 4.5,
        ratingCount: 920,
        description: 'Skin-on crispy fries tossed in fiery African peri-peri dust, topped with warm liquid cheese sauce and jalapeños.',
        image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'bc-4',
        name: 'Salted Caramel Hazelnut Thickshake',
        category: 'beverages',
        price: 189,
        isVeg: true,
        isBestseller: false,
        rating: 4.8,
        ratingCount: 390,
        description: 'Rich vanilla ice cream blended with roasted crushed hazelnuts, English toffee caramel, and sea salt flakes.',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'resto-4',
    name: 'Wok & Roll Asian Street',
    cuisine: ['Pan-Asian', 'Noodles', 'Dimsums', 'Bao'],
    rating: 4.6,
    reviewsCount: '2.1k+',
    deliveryTimeMin: 30,
    distanceKm: 3.2,
    costForTwo: 500,
    offer: 'Free Delivery',
    couponCode: 'FREEDEL',
    pureVeg: false,
    promoted: false,
    banner: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    address: 'East Wing, Metro Junction Food Court',
    coords: { x: 420, y: 280 },
    gps: { lat: 28.5900, lng: 77.3400 },
    menu: [
      {
        id: 'wr-1',
        name: 'Spicy Hakka Noodles with Chilli Paneer Bowl',
        category: 'chinese',
        price: 269,
        isVeg: true,
        isBestseller: true,
        rating: 4.7,
        ratingCount: 1340,
        description: 'Wok-tossed noodles with bell peppers, spring onions, paired with wok-glazed crispy cottage cheese in spicy garlic sauce.',
        image: '/images/veg_hakka_noodles.jpg'
      },
      {
        id: 'wr-2',
        name: 'Steamed Crystal Chicken Dimsums (6 pcs)',
        category: 'chinese',
        price: 249,
        isVeg: false,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 960,
        description: 'Translucent tapioca dumplings filled with minced chicken, ginger, and lemongrass, served with burnt garlic chilli oil.',
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'wr-3',
        name: 'Crispy Veg Spring Rolls (4 pcs)',
        category: 'starters',
        price: 179,
        isVeg: true,
        isBestseller: false,
        rating: 4.4,
        ratingCount: 450,
        description: 'Golden fried paper-thin rolls packed with glass noodles, cabbage, and carrots with sweet Thai chilli dip.',
        image: '/images/crispy_spring_rolls.jpg'
      }
    ]
  },
  {
    id: 'resto-5',
    name: 'Green Bowl & Superfoods',
    cuisine: ['Healthy', 'Salads', 'Keto', 'Smoothies'],
    rating: 4.8,
    reviewsCount: '1.4k+',
    deliveryTimeMin: 18,
    distanceKm: 1.2,
    costForTwo: 400,
    offer: '20% OFF | Code: HEALTH20',
    couponCode: 'HEALTH20',
    pureVeg: true,
    promoted: true,
    banner: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    address: 'Green Plaza, Eco Park Road',
    coords: { x: 260, y: 380 },
    gps: { lat: 28.5650, lng: 77.3050 },
    menu: [
      {
        id: 'gb-1',
        name: 'Mediterranean Quinoa & Avocado Power Bowl',
        category: 'healthy',
        price: 299,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 820,
        description: 'Tri-color quinoa, ripe Hass avocado, kalamata olives, cherry tomatoes, cucumbers, feta crumble, and lemon oregano vinaigrette.',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'gb-2',
        name: 'Berry Blast Acai Protein Smoothie Bowl',
        category: 'healthy',
        price: 279,
        isVeg: true,
        isBestseller: false,
        rating: 4.7,
        ratingCount: 490,
        description: 'Organic acai blended with almond milk, topped with chia seeds, fresh blueberries, banana slices, and toasted coconut flakes.',
        image: '/images/acai_bowl.jpg'
      }
    ]
  },
  {
    id: 'resto-6',
    name: 'Kathi Junction & Shawarma',
    cuisine: ['Rolls', 'Fast Food', 'Street Food'],
    rating: 4.4,
    reviewsCount: '4.2k+',
    deliveryTimeMin: 20,
    distanceKm: 1.9,
    costForTwo: 250,
    offer: '40% OFF up to ₹80',
    couponCode: 'KATHI40',
    pureVeg: false,
    promoted: false,
    banner: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    address: 'Opposite Central Station, G.T. Road',
    coords: { x: 120, y: 190 },
    gps: { lat: 28.5750, lng: 77.3150 },
    menu: [
      {
        id: 'kj-1',
        name: 'Double Egg Chicken Kathi Roll',
        category: 'rolls',
        price: 189,
        isVeg: false,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 2300,
        description: 'Flaky layered paratha lined with double egg, packed with spiced shredded chicken tikka, sliced onions, and spicy green relish.',
        image: '/images/chicken_kathi_roll.jpg'
      },
      {
        id: 'kj-2',
        name: 'Paneer Makhani Cheese Wrap',
        category: 'rolls',
        price: 169,
        isVeg: true,
        isBestseller: true,
        rating: 4.6,
        ratingCount: 1450,
        description: 'Char-grilled cottage cheese cubes smothered in rich makhani gravy and melted mozzarella, rolled in whole wheat tortilla.',
        image: '/images/paneer_tikka_roll.jpg'
      }
    ]
  }
];

// Delivery Riders pool for the Slide 7 Dispatch & Matching Simulator
export const RIDERS_POOL = [
  {
    id: 'rider-01',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    rating: 4.9,
    completedOrders: 1420,
    vehicle: 'Hero Splendor (DL 04 EF 7821)',
    currentCoords: { x: 250, y: 180 },
    distanceToRestoKm: 0.8,
    etaToRestoMin: 4,
    status: 'AVAILABLE', // AVAILABLE | BUSY | OFFLINE
    photo: '/images/rider_rahul.jpg',
    acceptanceRate: '98%',
    matchingScore: 94.5
  },
  {
    id: 'rider-02',
    name: 'Amit Verma',
    phone: '+91 98112 34567',
    rating: 4.8,
    completedOrders: 980,
    vehicle: 'Honda Activa 6G (DL 07 BC 4590)',
    currentCoords: { x: 310, y: 130 },
    distanceToRestoKm: 1.4,
    etaToRestoMin: 7,
    status: 'AVAILABLE',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    acceptanceRate: '95%',
    matchingScore: 88.2
  },
  {
    id: 'rider-03',
    name: 'Vikram Singh',
    phone: '+91 97123 98765',
    rating: 4.7,
    completedOrders: 2150,
    vehicle: 'Bajaj Pulsar 150 (DL 09 XY 1123)',
    currentCoords: { x: 180, y: 260 },
    distanceToRestoKm: 2.3,
    etaToRestoMin: 11,
    status: 'AVAILABLE',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    acceptanceRate: '92%',
    matchingScore: 76.8
  },
  {
    id: 'rider-04',
    name: 'Deepak Kumar',
    phone: '+91 99887 76655',
    rating: 4.6,
    completedOrders: 640,
    vehicle: 'TVS Jupiter (DL 02 PQ 8899)',
    currentCoords: { x: 410, y: 210 },
    distanceToRestoKm: 3.1,
    etaToRestoMin: 14,
    status: 'AVAILABLE',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    acceptanceRate: '89%',
    matchingScore: 68.0
  }
];

export const AVAILABLE_COUPONS = [
  { code: 'STEAL60', discountPct: 60, maxDiscount: 120, minCart: 199, label: '60% OFF up to ₹120' },
  { code: 'WELCOME50', discountPct: 50, maxDiscount: 100, minCart: 149, label: '50% OFF up to ₹100' },
  { code: 'CRUST100', flatDiscount: 100, minCart: 399, label: 'FLAT ₹100 OFF on orders above ₹399' },
  { code: 'FREEDEL', freeDelivery: true, minCart: 199, label: 'Free Delivery on order' }
];

export const SYSTEM_DESIGN_MODULES = [
  {
    id: 1,
    title: 'High-Level Architecture',
    summary: 'Decoupled Microservices behind an API Gateway with Edge Caching & Event Stream.',
    tech: ['API Gateway', 'CDN / Cloudflare', 'React Vite Frontend', 'Express / Go Microservices'],
    pattern: 'Microservices with API Composition & BFF (Backend-For-Frontend) layer.',
    keyDecisions: 'Separated read-heavy catalog searches from write-heavy transactional order pipelines.'
  },
  {
    id: 2,
    title: 'Restaurant Discovery & Search',
    summary: 'Sub-100ms geospatial lookup indexing millions of dishes and restaurant polygons.',
    tech: ['Elasticsearch', 'Uber H3 Hexagonal Grid', 'Redis Geo (GEOSEARCH)'],
    pattern: 'Geospatial Indexing with Multi-Faceted Inverted Index for fuzzy dish searches.',
    keyDecisions: 'Indexed restaurant coverage zones using H3 cell resolution 7 (~1.2km) to prune search space.'
  },
  {
    id: 3,
    title: 'Menu & Restaurant Service',
    summary: 'High-read cached menu queries with instant inventory toggling (In Stock / Sold Out).',
    tech: ['PostgreSQL (Master-Replica)', 'Redis Cache-Aside', 'CDN for Static Assets'],
    pattern: 'Cache-Aside with proactive cache eviction when restaurant flags dish unavailability.',
    keyDecisions: 'Nested JSONB catalog for flexible dish addons and variants.'
  },
  {
    id: 4,
    title: 'Order Management & State Machine',
    summary: 'Strict state transition lifecycle preventing invalid states and handling rollbacks.',
    tech: ['Saga Pattern (Orchestrator)', 'State Machine Engine', 'PostgreSQL Row Locking'],
    pattern: 'Distributed Saga with compensating transactions if payment or kitchen rejects.',
    keyDecisions: 'Enforced idempotent state transitions: PLACED -> ACCEPTED -> PREPARING -> READY -> PICKED_UP -> DELIVERED.'
  },
  {
    id: 5,
    title: 'Cart & Checkout Engine',
    summary: 'In-memory cart sessions with dynamic tax, surge delivery fee, and voucher validation.',
    tech: ['Redis In-Memory Hashes', 'Rule Evaluation Engine'],
    pattern: 'Optimistic item locking during checkout countdown (5-minute hold).',
    keyDecisions: 'Recalculates cart total server-side prior to payment token generation to prevent tampering.'
  },
  {
    id: 6,
    title: 'Payment System & Ledger',
    summary: 'Double-entry accounting ledger with idempotency keys and asynchronous webhook reconciliation.',
    tech: ['Payment Gateways (Razorpay/Stripe)', 'Double-Entry Ledger SQL', 'Kafka Events'],
    pattern: 'Two-Phase Commit / Outbox Pattern with Idempotency Key header on every charge.',
    keyDecisions: 'Zero payment losses via automated webhook polling fallback for dropped connection callbacks.'
  },
  {
    id: 7,
    title: 'Delivery Partner Assignment (Dispatch Engine)',
    summary: 'Greedy heuristic & bipartite matching finding the optimal rider within a dynamic radius.',
    tech: ['Redis Geo (GEORADIUS / GEOSEARCH)', 'Scoring Engine', 'Distributed Lock (Redlock)'],
    pattern: 'Ranked Multi-Factor Scoring with 30-second driver acceptance timeout and radius expansion.',
    keyDecisions: 'Calculates arrival ETA matching food prep time so the rider waits zero minutes at the kitchen.'
  },
  {
    id: 8,
    title: 'Real-Time Order Tracking',
    summary: 'Bi-directional live GPS coordinate streaming between delivery rider, server, and consumer map.',
    tech: ['WebSockets', 'Server-Sent Events (SSE)', 'Redis Pub/Sub', 'Vector Road Maps'],
    pattern: 'Pub/Sub channel per active order (`order:{id}:tracking`) with coordinate interpolation.',
    keyDecisions: 'Rider app throttles GPS beacons to 1 per 3 seconds and batch sends to conserve battery.'
  },
  {
    id: 9,
    title: 'Kafka & Event-Driven Architecture',
    summary: 'High-throughput append-only event stream orchestrating asynchronous downstream microservices.',
    tech: ['Apache Kafka', 'Schema Registry (Avro / Protobuf)'],
    pattern: 'Event Sourcing with partitioned topics (`orders`, `notifications`, `driver-locations`).',
    keyDecisions: 'Partitioning by `restaurant_id` ensures sequential order processing per kitchen.'
  },
  {
    id: 10,
    title: 'Notification System',
    summary: 'Multi-channel priority push notifications (WebPush, SMS OTP, WhatsApp Order Receipts).',
    tech: ['Firebase Cloud Messaging', 'Twilio SMS', 'Redis Priority Queue'],
    pattern: 'Worker pool consumer consuming notifications with rate limiting per user.',
    keyDecisions: 'High-priority queues for OTPs and immediate order status; low priority for marketing promos.'
  },
  {
    id: 11,
    title: 'Coupons & Dynamic Offers',
    summary: 'Coupon validation engine verifying user criteria, maximum budget caps, and cart thresholds.',
    tech: ['Redis Rate Limiter', 'Rule Engine', 'PostgreSQL Redemptions Table'],
    pattern: 'Atomic Redis `DECR` on global coupon budget to avoid over-budget promo redemptions during flash sales.',
    keyDecisions: 'Atomic coupon reservation during checkout with auto-release after 10-minute expiry.'
  },
  {
    id: 12,
    title: 'Loyalty & Referral System',
    summary: 'Gamified rewards, coin balances, tier benefits, and friend referral rewards.',
    tech: ['Ledger Database', 'Event Listener'],
    pattern: 'Audit trail ledger tracking every credited/debited food coin.',
    keyDecisions: 'Points unlocked only after successful order delivery and return period expiry.'
  },
  {
    id: 13,
    title: 'Scalability & Performance',
    summary: 'Handling 10x traffic bursts during lunch (1 PM) and dinner (8 PM) with zero degradation.',
    tech: ['Horizontal Pod Autoscalers', 'Multi-layer Caching (L1 App, L2 Redis)', 'Read Replicas'],
    pattern: 'Graceful degradation disabling heavy recommendation ML models during peak surge.',
    keyDecisions: 'Static restaurant catalog cached in Cloudflare CDN edges with 60s TTL.'
  },
  {
    id: 14,
    title: 'Failure Handling & Reliability',
    summary: 'Circuit breakers, Dead Letter Queues (DLQ), and automated failover for zero downtime.',
    tech: ['Circuit Breaker (Resilience4j / Opossum)', 'Kafka DLQ', 'Graceful Degradation'],
    pattern: 'Fallback responses (e.g. cached static estimates when ML ETA service fails).',
    keyDecisions: 'Asynchronous retry with exponential backoff on transient payment or restaurant ping failures.'
  },
  {
    id: 15,
    title: 'Database Design & Polyglot Storage',
    summary: 'Selecting the optimal database engine for each microservice boundary.',
    tech: ['PostgreSQL (ACID for Orders/Billing)', 'Redis (Geo & Sessions)', 'Elasticsearch (Catalog)'],
    pattern: 'Polyglot Persistence aligned with domain boundaries.',
    keyDecisions: 'Separated real-time transactional orders from analytical data warehouse (ClickHouse / Snowflake).'
  }
];
