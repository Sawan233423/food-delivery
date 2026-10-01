# 🍔 FoodPulse — Premium Commercial Food Delivery Web Platform

A high-performance, modern food delivery web application built with **React, Vite, Vanilla CSS design system, and OpenStreetMap Leaflet live tracking**. Designed with consumer polish comparable to Swiggy & Zomato, along with a business-ready **Super Admin Dashboard** and **Client Lead Generation** system.

---

## 🌟 Key Features

### 1. Consumer Store Experience
- **Instant Food Discovery**: Category carousel, Veg-only instant toggle, search by dish or restaurant.
- **Interactive Menus**: Categorized items with Bestseller tags, Veg/Non-Veg badges, descriptions, and dynamic quantity controls.
- **Smart Cart & Offers**: Coupon engine (`STEAL60`, `WELCOME50`, `CRUST100`, `FREEDEL`), driver tip selector, itemized bill breakdown.
- **Interactive Checkout**: UPI (GPay/PhonePe), Card payments, and Cash on Delivery with simulated instant authorization and celebration confetti.

### 2. Live Order Tracking & Real-Time Street Map
- **Leaflet OpenStreetMap Integration**: Real city street tiles with animated delivery motorbike marker moving toward delivery destination.
- **Dynamic Delivery Timer & Status**: Step-by-step progress tracking (`Confirmed` ➔ `Kitchen Preparing` ➔ `Rider Picked Up` ➔ `Arriving Soon` ➔ `Delivered`).
- **Rider Details & Safety**: Delivery PIN verification, driver phone call, and live in-app driver chat.

### 3. Super Admin & Business Dashboard
- **Executive GMV Metrics**: Real-time sales volume, platform commission calculation (20%), active riders, and customer satisfaction index.
- **Restaurant Management**: Enable/disable restaurant listings, add custom restaurants, and manage menus.
- **Live Order Stream**: Instant oversight of all incoming orders across the city.

### 4. Client Lead Generation (For Agency / Freelance Sales)
- **Get This App Modal**: Interactive quote and lead inquiry form for prospective clients.
- **Instant WhatsApp Link**: Direct 1-click CTA for potential restaurant owners and clients to contact you for custom app development.

---

## 💻 Local Preview (Right Now)

The development server is already active on your machine:
```
http://localhost:5173/
```
Simply open this URL in your web browser (Google Chrome, Microsoft Edge, or Firefox).

---

## 🚀 How to Deploy to Vercel (2 Easy Methods)

### Method 1: Deploy via GitHub (Recommended — Auto-updates on git push)

1. Create a new repository on your [GitHub account](https://github.com/new) named `food-delivery`.
2. Link your local project to GitHub and push:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/food-delivery.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com) and log in.
4. Click **"Add New..."** ➔ **"Project"**.
5. Select your `food-delivery` repository from GitHub.
6. Vercel will automatically detect `Vite` framework and `vercel.json`.
7. Click **"Deploy"**! Within 45 seconds, your live production URL (e.g. `https://food-delivery-abc.vercel.app`) will be live!

---

### Method 2: Deploy directly from Terminal (1 Command)

Run the following command in PowerShell in this directory:
```bash
npx vercel
```
- When prompted `Set up and deploy?`, press `Y`.
- Log in through your browser if prompted.
- Accept the defaults (Press Enter for each prompt).
- Your project will be deployed instantly!
