# 🍔 FoodPulse — Next-Gen Food Delivery Platform & System Design Architecture

A production-grade, full-stack food delivery application built with **React, Vite, Vanilla CSS design system, and WebSockets/Kafka event bus simulator**, implementing the complete **15-Page Handwritten System Design Handbook** inspired by [@abhi_techhub's viral post](https://www.instagram.com/p/DdolNwgGnHl/?img_index=7).

---

## 🌟 Key Highlights & Modules Built

### 1. Consumer App (Swiggy / Zomato Level Polish)
- **Sub-Second Discovery**: Category carousel, veg-only instant filter, multi-criteria sorting (Rating, Delivery Time, Price).
- **Interactive Menus**: Categorized items with Bestseller tags, Veg/Non-Veg badges, descriptions, and dynamic quantity controls.
- **Cart & Dynamic Pricing**: Coupon engine (`STEAL60`, `WELCOME50`, `CRUST100`, `FREEDEL`), 100% rider tipping options, GST & platform fee calculator.
- **Simulated Payment Gateways**: UPI (GPay/PhonePe), Credit/Debit Card, and Cash on Delivery with PCI-DSS escrow simulation.

### 2. Live Order Tracking (Real-Time GPS Engine)
- **Vector Animated Road Map**: Real-time motorbike marker moving along city waypoints from restaurant to customer door.
- **Saga State Machine**: Step-by-step progress (`PLACED` ➔ `ACCEPTED` ➔ `PREPARING` ➔ `RIDER_ASSIGNED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`).
- **Driver In-App Communication**: Masked VoIP call mockup and real-time bidirectional in-app chat.

### 3. Slide 7 Spotlight: Delivery Partner Assignment (Dispatch Engine)
- **Geospatial Radar**: Concentric spatial index visualizer scanning idle riders within a 3.5km radius.
- **Multi-Factor Scoring Heuristic**:
  $$\text{Score} = (100 - \text{Dist} \times 25) \times 0.45 + \left(\frac{\text{Rating}}{5.0} \times 100\right) \times 0.25 + \text{AcceptanceRate} \times 0.30$$
- **Redis Spatial Command Inspection**: Live execution of `GEOSEARCH` and `GEODIST`.
- **Distributed Concurrency Lock**: Redis Redlock simulation preventing double driver dispatch.

### 4. Restaurant Kitchen Display System (KDS)
- Live order sound notifications, one-click order confirmation, prep-time adjuster, and real-time inventory toggling (In Stock / Sold Out).

### 5. Delivery Partner Mobile App
- Standby mode, incoming order offers with 30s timeout, payout earnings preview, and turn-by-turn waypoint navigation.

### 6. System Design HLD Inspector
- Interactive catalog of all **15 System Design Modules** from the handbook.
- Live **Kafka Event Stream Console** showing streaming events (`orders.lifecycle`, `payments.ledger`, `dispatch.matching`, `rider.gps.stream`).
- Polyglot database schema diagrams (PostgreSQL transactional tables vs Redis in-memory caches).

---

## 🚀 Getting Started

The development server is already running! You can open your browser at:
```
http://localhost:5173/
```

To run manually:
```bash
npm install
npm run dev
```

To build for production:
```bash
npm run build
```
