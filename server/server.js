import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RESTAURANTS, RIDERS_POOL, AVAILABLE_COUPONS } from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Persistent DB if not present
function getDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [
        {
          id: 'user-01',
          name: 'Rahul Sharma',
          phone: '+91 98765 43210',
          walletCoins: 240,
          addresses: [
            { tag: 'Home', text: 'Flat 402, Lotus Greens, Central Boulevard', coords: { x: 440, y: 390 } },
            { tag: 'Office', text: 'Tower B, Tech Innovation Park, Sector 62', coords: { x: 390, y: 340 } },
            { tag: 'Other', text: 'Villa 12, Palm Meadows, Lake View', coords: { x: 470, y: 310 } }
          ],
          favorites: ['resto-1']
        }
      ],
      restaurants: RESTAURANTS,
      orders: [
        {
          id: 'ORD-9421',
          userId: 'user-01',
          restaurant: {
            id: 'resto-1',
            name: 'Dum Safar Biryani House'
          },
          items: [
            { id: 'ds-1', name: 'Royal Dum Hyderabadi Chicken Biryani', price: 349, qty: 2 }
          ],
          totalPaid: 638,
          paymentMethod: 'UPI (GPay)',
          date: 'Yesterday, 8:45 PM',
          status: 'DELIVERED',
          deliveryPin: '4821',
          deliveryAddress: { tag: 'Home', text: 'Flat 402, Lotus Greens, Central Boulevard' }
        }
      ],
      activeOtps: {}
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ---------------- RESTAURANTS API ---------------- //
app.get('/api/restaurants', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.restaurants });
});

app.get('/api/restaurants/:id', (req, res) => {
  const db = getDB();
  const resto = db.restaurants.find(r => r.id === req.params.id);
  if (!resto) return res.status(404).json({ success: false, message: 'Restaurant not found' });
  res.json({ success: true, data: resto });
});

// ---------------- ORDERS API ---------------- //
app.get('/api/orders', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.orders });
});

app.get('/api/orders/:id', (req, res) => {
  const db = getDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
});

app.post('/api/orders', (req, res) => {
  const db = getDB();
  const { 
    userId = 'user-01', 
    restaurant, 
    items, 
    bill, 
    paymentMethod, 
    deliveryAddress,
    specialInstructions 
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
  }

  const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
  const deliveryPin = Math.floor(1000 + Math.random() * 9000).toString();
  const assignedRider = RIDERS_POOL[0]; // Rahul Sharma

  const newOrder = {
    id: orderId,
    userId,
    restaurant,
    items,
    bill,
    paymentMethod,
    deliveryAddress,
    specialInstructions: specialInstructions || '',
    status: 'CONFIRMED', // CONFIRMED -> PREPARING -> ON_THE_WAY -> DELIVERED
    assignedRider,
    deliveryPin,
    etaMin: 24,
    createdAt: new Date().toISOString(),
    timeline: [
      { step: 'Order Placed', time: 'Just now', done: true },
      { step: 'Kitchen Preparing', time: 'In 5 mins', done: false },
      { step: 'Rider Picked Up', time: 'In 12 mins', done: false },
      { step: 'Out for Delivery', time: 'In 18 mins', done: false },
      { step: 'Delivered', time: 'In 24 mins', done: false }
    ]
  };

  db.orders.unshift(newOrder);
  saveDB(db);

  res.status(201).json({ success: true, data: newOrder });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const db = getDB();
  const orderIndex = db.orders.findIndex(o => o.id === req.params.id);
  if (orderIndex === -1) return res.status(404).json({ success: false, message: 'Order not found' });

  const { status, etaMin } = req.body;
  if (status) db.orders[orderIndex].status = status;
  if (etaMin !== undefined) db.orders[orderIndex].etaMin = etaMin;

  saveDB(db);
  res.json({ success: true, data: db.orders[orderIndex] });
});

// ---------------- USER & AUTH API (Phone OTP) ---------------- //
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number' });
  }

  const db = getDB();
  // Fixed OTP 1234 or random 4 digits for demo testing
  const otp = '1234'; 
  db.activeOtps[phone] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  };
  saveDB(db);

  res.json({ 
    success: true, 
    message: `OTP sent successfully to ${phone}`,
    demoOtp: otp 
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp, userName } = req.body;
  const db = getDB();

  const record = db.activeOtps[phone];
  // Allow test OTP 1234 or the generated one
  if (otp !== '1234' && (!record || record.otp !== otp)) {
    return res.status(400).json({ success: false, message: 'Invalid OTP code. Please enter 1234 for testing.' });
  }

  // Find or create user
  let user = db.users.find(u => u.phone.includes(phone.slice(-10)));
  if (!user) {
    user = {
      id: 'user-' + Date.now(),
      name: userName || 'Foodie Customer',
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      walletCoins: 100, // welcome bonus!
      addresses: [
        { tag: 'Home', text: 'Plot 42, Green Avenue, Sector 18', coords: { x: 440, y: 390 } }
      ],
      favorites: []
    };
    db.users.push(user);
    saveDB(db);
  }

  res.json({
    success: true,
    message: 'Login successful!',
    data: {
      user,
      token: 'jwt_token_' + Date.now()
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const db = getDB();
  const user = db.users[0];
  res.json({ success: true, data: user });
});

// ---------------- PAYMENT GATEWAY INTENT API ---------------- //
app.post('/api/payment/create-intent', (req, res) => {
  const { amount, orderId = 'ORD-' + Date.now() } = req.body;
  const upiString = `upi://pay?pa=foodpulse.pay@okaxis&pn=FoodPulse%20Order&am=${amount}&cu=INR&tn=Order%20${orderId}`;
  
  res.json({
    success: true,
    data: {
      orderId,
      amount,
      upiString,
      qrDataUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`,
      gateway: 'Razorpay / UPI Sandbox'
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`FoodPulse Express API Server running on http://localhost:${PORT}`);
});
