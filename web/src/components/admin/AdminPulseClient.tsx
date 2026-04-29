"use client";

import React, { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  Activity, 
  Users, 
  MapPin, 
  ArrowUpRight, 
  Clock, 
  MousePointer2, 
  Globe, 
  Flame,
  Search,
  RefreshCcw,
  Box,
  ShoppingCart,
  Zap,
  Target,
  ArrowDownAZ,
  Eye
} from "lucide-react";

interface Pulse {
  _id: string;
  timestamp: string;
  path: string;
  sessionID: string;
  referrer: string;
  location: string;
  eventType: string;
  eventData?: any;
}

interface Props {
  initialPulses: Pulse[];
}

export default function AdminPulseClient({ initialPulses }: Props) {
  const [pulses] = useState(initialPulses);

  // --- ANALYTICS DERIVATIONS ---
  
  const activeSessions = useMemo(() => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const uniqueSessions = new Set(
      pulses
        .filter(p => new Date(p.timestamp) > fiveMinutesAgo)
        .map(p => p.sessionID)
    );
    return uniqueSessions.size;
  }, [pulses]);

  const searchTrends = useMemo(() => {
    const counts: Record<string, number> = {};
    pulses.filter(p => p.eventType === "search").forEach(p => {
      const q = p.eventData?.query || "unknown";
      counts[q] = (counts[q] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [pulses]);

  const popularSlugs = useMemo(() => {
    const counts: Record<string, number> = {};
    pulses.filter(p => p.eventType === "product_view").forEach(p => {
      const slug = p.eventData?.slug || "unknown";
      counts[slug] = (counts[slug] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [pulses]);

  const conversionFunnel = useMemo(() => {
    const sessions = new Set(pulses.map(p => p.sessionID));
    const views = new Set(pulses.filter(p => p.eventType === "product_view").map(p => p.sessionID));
    const intent = new Set(pulses.filter(p => p.eventType === "intent_to_buy").map(p => p.sessionID));
    
    return [
      { label: "Total Visitors", count: sessions.size, color: "bg-blue-500" },
      { label: "Product Interest", count: views.size, color: "bg-indigo-500" },
      { label: "Intent to Buy", count: intent.size, color: "bg-orange-500" },
    ];
  }, [pulses]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* SENTINEL HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-soft pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-2xl animate-pulse">
            <Activity size={24} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-serif italic text-heading">Supabase Sentinel V2</h1>
            <p className="text-sm font-sans text-description mt-1 uppercase tracking-widest text-[10px] font-bold">
              High-Frequency Business Intelligence Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest border border-emerald-500/20">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
             Supabase Realtime Ready
          </div>
          <button onClick={() => window.location.reload()} className="p-3 bg-app border border-soft rounded-full text-label hover:text-action transition-all">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-app border border-soft rounded-[2.5rem] p-8 space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={80} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-label">Active Now</p>
          <p className="text-4xl font-serif italic text-heading">{activeSessions}</p>
          <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
            <Zap size={10} fill="currentColor" /> Live Visitors
          </p>
        </div>

        <div className="bg-app border border-soft rounded-[2.5rem] p-8 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-label">Conversion Rate</p>
          <p className="text-4xl font-serif italic text-heading">
            {pulses.length > 0 ? ((conversionFunnel[2].count / conversionFunnel[0].count) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Intent Velocity</p>
        </div>

        <div className="bg-app border border-soft rounded-[2.5rem] p-8 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-label">Top Location</p>
          <p className="text-2xl font-serif italic text-heading truncate">{pulses[0]?.location || "Nepal"}</p>
          <p className="text-[9px] font-bold text-label uppercase tracking-widest">Global Orbit</p>
        </div>

        <div className="bg-app border border-soft rounded-[2.5rem] p-8 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-label">Intelligence Mode</p>
          <p className="text-xl font-sans font-bold text-heading uppercase tracking-tighter">Ultra-Performance</p>
          <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
            <ArrowDownAZ size={10} /> Supabase Postgres
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: FUNNEL & SEARCH */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* CONVERSION FUNNEL */}
           <div className="bg-app border border-soft rounded-[3rem] p-10 space-y-8 shadow-sm">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Target size={20} className="text-action" />
                    <h2 className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-label">Conversion Pipeline</h2>
                 </div>
              </div>
              <div className="space-y-6">
                 {conversionFunnel.map((step, idx) => (
                    <div key={step.label} className="relative">
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-heading">{step.label}</span>
                          <span className="text-[10px] font-mono text-label">{step.count} sessions</span>
                       </div>
                       <div className="h-12 w-full bg-soft rounded-2xl overflow-hidden p-1">
                          <div 
                            className={`h-full ${step.color} rounded-xl transition-all duration-1000 shadow-lg`}
                            style={{ width: `${(step.count / conversionFunnel[0].count) * 100}%` }}
                          />
                       </div>
                       {idx < conversionFunnel.length - 1 && (
                         <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 z-10">
                            <div className="bg-app border border-soft p-1 rounded-full text-[8px] text-label">
                               {((conversionFunnel[idx+1].count / step.count) * 100 || 0).toFixed(0)}% drop
                            </div>
                         </div>
                       )}
                    </div>
                 ))}
              </div>
           </div>

           {/* SEARCH INTENT */}
           <div className="bg-app border border-soft rounded-[3rem] p-10 space-y-8 shadow-sm">
              <div className="flex items-center gap-3">
                 <Search size={20} className="text-blue-500" />
                 <h2 className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-label">Search Intent Intelligence</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {searchTrends.map(([query, count]) => (
                    <div key={query} className="bg-surface border border-soft rounded-2xl p-6 flex items-center justify-between group hover:border-action transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-soft rounded-xl flex items-center justify-center text-label group-hover:text-action">
                             <Search size={16} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-heading">"{query}"</p>
                             <p className="text-[9px] font-bold text-label uppercase tracking-widest mt-1">Requested {count} times</p>
                          </div>
                       </div>
                       <ArrowUpRight size={14} className="text-label opacity-40 group-hover:opacity-100" />
                    </div>
                 ))}
                 {searchTrends.length === 0 && (
                    <p className="col-span-2 text-center py-10 text-[10px] font-bold uppercase tracking-widest text-label opacity-40 italic">Waiting for customer search data...</p>
                 )}
              </div>
           </div>

        </div>

        {/* RIGHT COLUMN: LIVE STREAM & POPULAR */}
        <div className="space-y-8">
           
           {/* LIVE FEED */}
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h2 className="text-[10px] font-sans font-bold uppercase tracking-widest text-heading">Live Intelligence Feed</h2>
              </div>
              <div className="bg-app border border-soft rounded-[2.5rem] overflow-hidden max-h-[500px] overflow-y-auto scrollbar-none shadow-inner">
                 <div className="divide-y divide-soft divide-dotted">
                    {pulses.slice(0, 20).map((pulse) => (
                      <div key={pulse._id} className="p-6 hover:bg-soft/30 transition-all space-y-3">
                         <div className="flex items-center justify-between">
                            <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                              pulse.eventType === 'search' ? 'bg-blue-500/10 text-blue-600' :
                              pulse.eventType === 'intent_to_buy' ? 'bg-orange-500/10 text-orange-600' :
                              pulse.eventType === 'product_view' ? 'bg-indigo-500/10 text-indigo-600' :
                              'bg-soft text-label'
                            }`}>
                               {pulse.eventType === 'intent_to_buy' ? <ShoppingCart size={10} /> : <Globe size={10} />}
                               {pulse.eventType.replace('_', ' ')}
                            </div>
                            <span className="text-[8px] font-bold text-label opacity-40">{formatDistanceToNow(new Date(pulse.timestamp), { addSuffix: true })}</span>
                         </div>
                         <p className="text-[11px] font-medium text-heading truncate">
                            {pulse.eventType === 'search' ? `Searched for "${pulse.eventData?.query}"` : 
                             pulse.eventType === 'product_view' ? `Viewing product: ${pulse.eventData?.slug}` : 
                             pulse.path}
                         </p>
                         <div className="flex items-center gap-3 text-[8px] font-bold text-label uppercase tracking-widest opacity-60">
                            <MapPin size={10} /> {pulse.location}
                            <div className="w-1 h-1 bg-divider rounded-full" />
                            <MousePointer2 size={10} /> {pulse.sessionID.slice(0, 6)}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* HOT PRODUCTS */}
           <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3 px-2">
                 <Flame size={18} className="text-orange-500" />
                 <h2 className="text-[10px] font-sans font-bold uppercase tracking-widest text-heading">Product Heat Map</h2>
              </div>
              <div className="bg-app border border-soft rounded-[2.5rem] p-6 space-y-3 shadow-sm">
                 {popularSlugs.map(([slug, count], idx) => (
                    <div key={slug} className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-soft">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-soft flex items-center justify-center text-[10px] font-bold text-label">#{idx+1}</div>
                          <p className="text-xs font-bold text-heading truncate max-w-[120px]">{slug}</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-orange-500">{count} views</span>
                          <Eye size={12} className="text-orange-400" />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </div>

    </div>
  );
}
