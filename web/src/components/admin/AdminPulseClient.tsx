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
  Eye,
  ChevronDown,
  ChevronUp,
  Cpu,
  Link2,
  Fingerprint,
  RotateCw,
  MoveDown,
  Server
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
  userAgent?: string;
  city?: string;
  isp?: string;
  duration_seconds?: number;
  scroll_depth?: number;
  is_returning?: boolean;
}

interface Props {
  initialPulses: Pulse[];
}

export default function AdminPulseClient({ initialPulses }: Props) {
  const [pulses] = useState(initialPulses);
  const [expandedPulse, setExpandedPulse] = useState<string | null>(null);

  // --- ANALYTICS DERIVATIONS ---
  
  const activeSessions = useMemo(() => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Set(pulses.filter(p => new Date(p.timestamp) > fiveMinutesAgo).map(p => p.sessionID)).size;
  }, [pulses]);

  const avgEngagement = useMemo(() => {
    const pings = pulses.filter(p => p.eventType === "engagement_ping" && p.duration_seconds! > 0);
    if (pings.length === 0) return 0;
    const total = pings.reduce((acc, p) => acc + (p.duration_seconds || 0), 0);
    return Math.round(total / pings.length);
  }, [pulses]);

  const platformBreakdown = useMemo(() => {
    const platforms: Record<string, number> = {};
    pulses.forEach(p => {
      const r = p.referrer.toLowerCase();
      let platform = "Direct / Search";
      if (r.includes("instagram")) platform = "Instagram";
      else if (r.includes("facebook") || r.includes("fb.com")) platform = "Facebook";
      else if (r.includes("tiktok")) platform = "TikTok";
      else if (r.includes("google")) platform = "Google";
      platforms[platform] = (platforms[platform] || 0) + 1;
    });
    return Object.entries(platforms).sort((a, b) => b[1] - a[1]);
  }, [pulses]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-soft pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-action/10 rounded-2xl animate-pulse">
            <Activity size={24} className="text-action" />
          </div>
          <div>
            <h1 className="text-3xl font-serif italic text-heading">Omniscient Sentinel V3</h1>
            <p className="text-sm font-sans text-description mt-1 uppercase tracking-widest text-[10px] font-bold">
              Total Business Visibility & Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest border border-emerald-500/20">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
             Telemetric Stream: Active
          </div>
          <button onClick={() => window.location.reload()} className="p-3 bg-app border border-soft rounded-full text-label hover:text-action transition-all">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-app border border-soft rounded-[2.5rem] p-8 space-y-2">
           <p className="text-[10px] font-bold uppercase tracking-widest text-label">Active Now</p>
           <p className="text-4xl font-serif italic text-heading">{activeSessions}</p>
           <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Live Visitors</p>
        </div>
        <div className="bg-app border border-soft rounded-[2.5rem] p-8 space-y-2">
           <p className="text-[10px] font-bold uppercase tracking-widest text-label">Avg. Session</p>
           <p className="text-4xl font-serif italic text-heading">{avgEngagement}s</p>
           <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Time on Site</p>
        </div>
        <div className="bg-app border border-soft rounded-[2.5rem] p-8 space-y-2">
           <p className="text-[10px] font-bold uppercase tracking-widest text-label">Retention</p>
           <p className="text-4xl font-serif italic text-heading">
             {Math.round((pulses.filter(p => p.is_returning).length / pulses.length) * 100 || 0)}%
           </p>
           <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Returning Rate</p>
        </div>
        <div className="bg-app border border-soft rounded-[2.5rem] p-8 space-y-2">
           <p className="text-[10px] font-bold uppercase tracking-widest text-label">Top Referral</p>
           <p className="text-2xl font-serif italic text-heading truncate">{platformBreakdown[0]?.[0] || "Direct"}</p>
           <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Ingress Source</p>
        </div>
      </div>

      {/* EVENT STREAM */}
      <div className="bg-app border border-soft rounded-[3.5rem] overflow-hidden shadow-sm">
         <div className="p-8 border-b border-soft bg-surface/30 flex justify-between items-center">
            <h2 className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-label">Surgical Intelligence Stream</h2>
            <div className="flex gap-4">
               <span className="text-[9px] font-bold text-label uppercase tracking-widest flex items-center gap-1"><MapPin size={10} /> City Aware</span>
               <span className="text-[9px] font-bold text-label uppercase tracking-widest flex items-center gap-1"><Fingerprint size={10} /> ID Tracked</span>
            </div>
         </div>
         <div className="divide-y divide-soft divide-dotted">
            {pulses.slice(0, 50).map((pulse) => (
              <div key={pulse._id} className="transition-all">
                 <div 
                   onClick={() => setExpandedPulse(expandedPulse === pulse._id ? null : pulse._id)}
                   className={`p-8 hover:bg-soft/20 cursor-pointer flex items-center justify-between group ${expandedPulse === pulse._id ? 'bg-soft/40' : ''}`}
                 >
                    <div className="flex items-center gap-6">
                       <div className={`p-4 rounded-2xl ${
                         pulse.eventType === 'engagement_ping' ? 'bg-emerald-500/10 text-emerald-600' :
                         pulse.eventType === 'intent_to_buy' ? 'bg-orange-500/10 text-orange-600' :
                         pulse.eventType === 'product_view' ? 'bg-indigo-500/10 text-indigo-600' :
                         'bg-soft text-label'
                       }`}>
                          {pulse.eventType === 'engagement_ping' ? <Zap size={18} /> : 
                           pulse.eventType === 'intent_to_buy' ? <ShoppingCart size={18} /> :
                           pulse.is_returning ? <RotateCw size={18} /> : <MousePointer2 size={18} />}
                       </div>
                       <div>
                          <div className="flex items-center gap-3">
                             <p className="text-sm font-bold text-heading">
                               {pulse.eventType === 'engagement_ping' ? `Engaged for ${pulse.duration_seconds}s` : 
                                pulse.eventType === 'product_view' ? `Viewed ${pulse.eventData?.slug || pulse.path}` : 
                                pulse.path}
                             </p>
                             {pulse.is_returning && <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 rounded-full text-[8px] font-bold uppercase tracking-widest">Returning</span>}
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                             <div className="flex items-center gap-1.5 text-[9px] font-bold text-label uppercase tracking-widest">
                                <MapPin size={10} /> {pulse.city || "Kathmandu"}, {pulse.location}
                             </div>
                             {pulse.scroll_depth ? (
                               <div className="flex items-center gap-1.5 text-[9px] font-bold text-action uppercase tracking-widest">
                                  <MoveDown size={10} /> {pulse.scroll_depth}% Depth
                               </div>
                             ) : null}
                          </div>
                       </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                       <p className="text-[10px] font-bold text-label uppercase tracking-widest opacity-40">
                          {formatDistanceToNow(new Date(pulse.timestamp), { addSuffix: true })}
                       </p>
                       {expandedPulse === pulse._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                 </div>

                 {/* DEEP INSPECTOR */}
                 {expandedPulse === pulse._id && (
                   <div className="bg-surface/50 p-8 border-t border-b border-soft grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-4">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-label uppercase tracking-widest">
                            <Fingerprint size={12} /> Digital ID
                         </div>
                         <div className="bg-app p-4 rounded-2xl border border-soft space-y-2">
                            <p className="text-[10px] text-label truncate">Session: <span className="text-heading font-mono">{pulse.sessionID}</span></p>
                            <p className="text-[10px] text-label truncate">Referrer: <span className="text-heading">{pulse.referrer}</span></p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-label uppercase tracking-widest">
                            <Server size={12} /> Network Intelligence
                         </div>
                         <div className="bg-app p-4 rounded-2xl border border-soft space-y-2">
                            <p className="text-[10px] text-label">ISP: <span className="text-heading">{pulse.isp || "Unknown"}</span></p>
                            <p className="text-[10px] text-label">City: <span className="text-heading">{pulse.city || "Unknown"}</span></p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-label uppercase tracking-widest">
                            <Cpu size={12} /> Browser Details
                         </div>
                         <div className="bg-app p-4 rounded-2xl border border-soft">
                            <p className="text-[10px] text-label leading-relaxed break-all truncate">{pulse.userAgent}</p>
                         </div>
                      </div>
                      <div className="md:col-span-3 space-y-4">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-label uppercase tracking-widest">
                            <Link2 size={12} /> Raw Meta Payload
                         </div>
                         <div className="bg-app p-4 rounded-2xl border border-soft">
                            <code className="text-[10px] text-orange-600 break-all">{pulse.path}</code>
                         </div>
                      </div>
                   </div>
                 )}
              </div>
            ))}
         </div>
      </div>

    </div>
  );
}
