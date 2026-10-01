import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SYSTEM_DESIGN_MODULES, RIDERS_POOL } from '../data/mockData';
import { 
  Cpu, 
  Terminal, 
  Layers, 
  Database, 
  Workflow, 
  Zap, 
  ShieldCheck, 
  ExternalLink,
  Radar,
  Radio,
  Clock
} from 'lucide-react';

export const SystemDesignExplorer = () => {
  const { systemLogs, dispatchRadar, activeOrder } = useApp();
  const [activeTab, setActiveTab] = useState('slide7'); // slide7 | kafka | modules | db | state_machine
  const [selectedModule, setSelectedModule] = useState(SYSTEM_DESIGN_MODULES[6]); // Module 7 (Slide 7)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Architecture & Engineering Notes
              </span>
              <span className="text-xs text-indigo-300 font-semibold bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/50 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Author: Sawan • Core Microservices</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white mt-2">
              FoodPulse Systems & Backend Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Engineering breakdown of how we architected FoodPulse for scale — dynamic rider dispatching, Kafka event pipelines, in-memory pricing, and real-time GPS tracking.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold">
            <span className="text-slate-400 px-3">Kafka Events:</span>
            <span className="bg-indigo-600 text-white px-2.5 py-1 rounded-xl font-mono">
              {systemLogs.length} Emitted
            </span>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto border-t border-slate-800 pt-4 scrollbar-none">
          <button
            onClick={() => setActiveTab('slide7')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'slide7'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radar className="w-4 h-4" />
            <span>Module 7: Dispatch Matching Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('kafka')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'kafka'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Kafka Event Bus Log ({systemLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'modules'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>15 Modules Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('state_machine')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'state_machine'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>Order State Machine</span>
          </button>

          <button
            onClick={() => setActiveTab('db')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'db'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Polyglot Database Schemas</span>
          </button>
        </div>

      </div>

      {/* TAB 1: SLIDE 7 SPOTLIGHT (DISPATCH & MATCHING ENGINE) */}
      {activeTab === 'slide7' && (
        <div className="mt-8 space-y-8 animate-slide-up">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                  Module 7: Automated Driver Dispatch Engine
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-2">
                  Dispatch Matching Engine & Redis Spatial Index
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
                  When a kitchen starts cooking, this engine solves a bipartite matching optimization: finding the best delivery rider within a dynamic search radius so that the rider arrives precisely when the food is ready.
                </p>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-xs font-mono max-w-sm flex-shrink-0">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Matching Heuristic</span>
                <div className="text-amber-400 font-bold mt-1">
                  Score = 0.45·Dist + 0.25·Rating + 0.30·Acceptance
                </div>
              </div>
            </div>

            {/* Candidate Riders Radar & Scoring Grid */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Radar visualization */}
              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-white flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Spatial Radar (Radius: 3.5 km)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    4 Idle Riders Detected
                  </span>
                </div>

                <div className="relative w-full h-64 flex items-center justify-center my-4">
                  {/* Concentric distance rings */}
                  <div className="absolute w-56 h-56 rounded-full border border-slate-800/80" />
                  <div className="absolute w-40 h-40 rounded-full border border-slate-700/60" />
                  <div className="absolute w-24 h-24 rounded-full border border-slate-600/60" />
                  
                  {/* Center Restaurant Pin */}
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 z-10 text-xs">
                    🍳
                  </div>

                  {/* Riders positioned around radar */}
                  {RIDERS_POOL.map((r, i) => {
                    const angles = [45, 140, 220, 310];
                    const angle = angles[i] * (Math.PI / 180);
                    const distMultiplier = (r.distanceToRestoKm / 3.5) * 100;
                    const x = Math.cos(angle) * distMultiplier;
                    const y = Math.sin(angle) * distMultiplier;
                    const isWinner = i === 0;

                    return (
                      <div
                        key={r.id}
                        className="absolute flex flex-col items-center group cursor-pointer transition-transform hover:scale-125"
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                      >
                        <div className={`w-8 h-8 rounded-full border-2 overflow-hidden shadow-md ${
                          isWinner ? 'border-emerald-400 ring-4 ring-emerald-400/30' : 'border-slate-500'
                        }`}>
                          <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
                        </div>
                        <span className={`text-[10px] font-mono font-bold mt-1 px-1.5 py-0.5 rounded ${
                          isWinner ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {r.distanceToRestoKm}km
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated Redis Command */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-sky-400 overflow-x-auto">
                  <code>&gt; GEOSEARCH riders:idle FROMLONLAT 77.3200 28.5700 BYRADIUS 3.5 KM ASC WITHDIST</code>
                </div>
              </div>

              {/* Scored Candidate Table */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                  Ranked Candidates (Dispatch Scoring Heuristic)
                </h4>

                <div className="space-y-3">
                  {RIDERS_POOL.map((rider, idx) => {
                    const isTop = idx === 0;
                    return (
                      <div
                        key={rider.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isTop 
                            ? 'bg-emerald-50/60 border-emerald-300 shadow-sm' 
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                              isTop ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              #{idx + 1}
                            </span>
                            <div>
                              <p className="font-bold text-sm text-slate-900">{rider.name}</p>
                              <p className="text-xs text-slate-500">{rider.vehicle} • {rider.acceptanceRate} accept</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-black text-slate-900">
                              Score: {rider.matchingScore}/100
                            </div>
                            <span className={`text-[11px] font-bold ${isTop ? 'text-emerald-700' : 'text-slate-500'}`}>
                              {isTop ? '✓ Acquired Redlock' : 'Fallback Candidate'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] bg-white/70 p-2 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-slate-400 block font-medium">Distance</span>
                            <span className="font-bold text-slate-700">{rider.distanceToRestoKm} km</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Resto ETA</span>
                            <span className="font-bold text-slate-700">{rider.etaToRestoMin} mins</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Rating</span>
                            <span className="font-bold text-slate-700">{rider.rating} ★</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Distributed Lock (Redlock) Code Snippet */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Distributed Locking & Race Condition Prevention (Slide 7 Detail)</span>
              </h4>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                To prevent two orders from simultaneously grabbing the same rider during peak rush hours, the dispatch service acquires a Redis Redlock with a 30-second TTL before sending the push notification offer:
              </p>
              <div className="terminal-window">
                <pre>{`// Redis Distributed Lock via Redlock (Node.js / Go)
const lockKey = \`lock:rider:\${selectedRider.id}\`;
const lock = await redlock.acquire([lockKey], 30000); // 30s TTL

try {
  await kafkaProducer.send({
    topic: 'dispatch.rider-offers',
    messages: [{ key: selectedRider.id, value: JSON.stringify({ orderId, timeoutSec: 30 }) }]
  });
} catch (err) {
  await lock.release();
  throw new Error('Dispatch offer dispatch failed');
}`}</pre>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: LIVE KAFKA EVENT STREAM */}
      {activeTab === 'kafka' && (
        <div className="mt-8 space-y-6 animate-slide-up">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg text-white">Real-Time Kafka Event Bus Stream</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Listening on topics: <code className="text-indigo-400">orders.*, payments.*, dispatch.*, kitchen.*</code>
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Every action you perform in this app (placing an order, kitchen acceptance, rider movement) automatically publishes an event to this stream, exactly as architected in Module 9 (Kafka Streams) & Module 4 (Order State Machine).
            </p>

            {/* Log feed */}
            <div className="mt-6 space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {systemLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono text-xs">
                  No events logged yet. Place an order in the "Order" tab to see real-time Kafka events stream here!
                </div>
              ) : (
                systemLogs.map(log => (
                  <div key={log.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded text-[11px] font-bold border border-indigo-800">
                          {log.topic}
                        </span>
                        <span className="text-amber-400 font-bold">{log.event}</span>
                      </div>
                      <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                    </div>

                    <div className="bg-slate-900/80 p-2 rounded-lg text-slate-300 overflow-x-auto text-[11px]">
                      {JSON.stringify(log.payload)}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: 15 SYSTEM DESIGN MODULES DIRECTORY */}
      {activeTab === 'modules' && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
          
          {/* Modules List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {SYSTEM_DESIGN_MODULES.map(m => (
              <div
                key={m.id}
                onClick={() => setSelectedModule(m)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedModule.id === m.id
                    ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {m.id}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                    {m.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {m.summary}
                </p>
              </div>
            ))}
          </div>

          {/* Module Deep-Dive Details */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Module #{selectedModule.id} of 15
                </span>
                <h3 className="text-2xl font-black text-slate-900 font-display mt-1">
                  {selectedModule.title}
                </h3>
              </div>
            </div>

            <div>
              <h5 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider mb-2">
                Overview & Architecture Role
              </h5>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedModule.summary}
              </p>
            </div>

            <div>
              <h5 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider mb-2">
                Recommended Technology Stack
              </h5>
              <div className="flex flex-wrap gap-2">
                {selectedModule.tech.map((t, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider mb-2">
                Architectural Pattern
              </h5>
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium">
                {selectedModule.pattern}
              </div>
            </div>

            <div>
              <h5 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider mb-2">
                Key Engineering Decisions & Trade-offs
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedModule.keyDecisions}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: ORDER STATE MACHINE (SLIDE 4) */}
      {activeTab === 'state_machine' && (
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-slide-up">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              Topic 4: Order Lifecycle & Saga State Machine
            </span>
            <h3 className="text-2xl font-black text-slate-900 font-display mt-2">
              Distributed Saga State Machine
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Food delivery orders span multiple isolated microservices (Kitchen, Payment, Driver, Customer). A centralized Saga Orchestrator manages state transitions and executes compensating rollbacks if any step fails.
            </p>
          </div>

          {/* State Machine Flowchart */}
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto text-white">
            <div className="flex items-center justify-between min-w-[750px] gap-4">
              
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 text-center flex-1">
                <span className="text-xs text-amber-400 font-bold block">1. ORDER_CREATED</span>
                <span className="text-[10px] text-slate-400">Cart locked & price verified</span>
              </div>

              <span className="text-slate-600 font-bold">➔</span>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 text-center flex-1">
                <span className="text-xs text-sky-400 font-bold block">2. PAYMENT_AUTH</span>
                <span className="text-[10px] text-slate-400">Escrow hold on credit/UPI</span>
              </div>

              <span className="text-slate-600 font-bold">➔</span>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 text-center flex-1">
                <span className="text-xs text-purple-400 font-bold block">3. KITCHEN_CONFIRM</span>
                <span className="text-[10px] text-slate-400">Chef accepts order</span>
              </div>

              <span className="text-slate-600 font-bold">➔</span>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 text-center flex-1">
                <span className="text-xs text-orange-400 font-bold block">4. DISPATCH_MATCH</span>
                <span className="text-[10px] text-slate-400">Redis spatial rider lock</span>
              </div>

              <span className="text-slate-600 font-bold">➔</span>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 text-center flex-1">
                <span className="text-xs text-emerald-400 font-bold block">5. DELIVERED</span>
                <span className="text-[10px] text-slate-400">Ledger payout released</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 5: POLYGLOT DATABASE SCHEMAS (SLIDE 15) */}
      {activeTab === 'db' && (
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-slide-up">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              Topic 15: Database Design & Polyglot Persistence
            </span>
            <h3 className="text-2xl font-black text-slate-900 font-display mt-2">
              Polyglot Storage Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Different microservices have vastly different data access patterns. Orders require ACID guarantees (PostgreSQL), while live GPS coordinates require microsecond in-memory spatial indexes (Redis).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-3">
                <Database className="w-4 h-4" />
                <span>PostgreSQL (Transactional Orders & Billing)</span>
              </div>
              <div className="terminal-window text-[11px]">
                <pre>{`CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  status VARCHAR(32) NOT NULL, -- PLACED, ACCEPTED, DELIVERED
  item_total DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  total_paid DECIMAL(10, 2) NOT NULL,
  rider_id UUID REFERENCES riders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}</pre>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-3">
                <Zap className="w-4 h-4" />
                <span>Redis Geo (Real-time Rider GPS & Locks)</span>
              </div>
              <div className="terminal-window text-[11px]">
                <pre>{`// Key Structures:
// 1. In-memory Geospatial Index:
GEOADD riders:locations 77.3200 28.5700 "rider-01"

// 2. Active Order Session (5-min TTL):
HSET order:ORD-8921:session status "PREPARING" rider "rider-01"

// 3. Distributed Lock with fencing token:
SET lock:dispatch:ORD-8921 "rider-01" NX PX 30000`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
