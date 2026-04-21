"use client";

import { useState } from "react";
import { 
  Flame, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Info, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Package, 
  ChevronDown, 
  ArrowRightCircle,
  TrendingUp,
  MessageSquare,
  Search,
  Filter,
  X
} from "lucide-react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface Lead {
  _id: string;
  _createdAt: string;
  customerName?: string;
  email?: string;
  phone?: string;
  status?: string;
  priority?: string;
  internalNotes?: string;
  source?: string;
  productReference?: {
    title: string;
    slug: string;
  };
  originalInquiry?: {
    _id: string;
    message: string;
  };
}

export default function AdminLeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [tempNotes, setTempNotes] = useState("");
  
  // FILTER STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const filteredLeads = leads.filter(lead => {
    // SEARCH CHECK
    const matchesSearch = !searchQuery || 
      lead.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // TYPE CHECKS
    const matchesStatus = !statusFilter || lead.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = !priorityFilter || lead.priority?.toLowerCase() === priorityFilter.toLowerCase();
    const matchesSource = !sourceFilter || lead.source?.toLowerCase() === sourceFilter.toLowerCase();

    // DATE LOGIC
    let matchesDate = true;
    if (dateFilter) {
      const createdAt = new Date(lead._createdAt).getTime();
      const now = new Date().getTime();
      const dayMs = 24 * 60 * 60 * 1000;

      if (dateFilter === "today") {
        const startOfToday = new Date().setHours(0, 0, 0, 0);
        matchesDate = createdAt >= startOfToday;
      } else if (dateFilter === "7days") {
        matchesDate = createdAt >= (now - (7 * dayMs));
      } else if (dateFilter === "30days") {
        matchesDate = createdAt >= (now - (30 * dayMs));
      } else if (dateFilter === "month") {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
        matchesDate = createdAt >= startOfMonth;
      }
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesSource && matchesDate;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setPriorityFilter(null);
    setSourceFilter(null);
    setDateFilter(null);
  };

  const updateLead = async (leadId: string, updates: Partial<Lead>) => {
    setUpdatingId(leadId);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, ...updates }),
      });
      if (res.ok) {
        const updatedLeads = leads.map(l => l._id === leadId ? { ...l, ...updates } : l);
        setLeads(updatedLeads);
        if (selectedLead?._id === leadId) {
          setSelectedLead({ ...selectedLead, ...updates });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusConfigs: Record<string, { color: string; icon: any; label: string }> = {
    new: { color: "bg-blue-500/10 text-blue-600", icon: Clock, label: "New Lead" },
    contacted: { color: "bg-indigo-500/10 text-indigo-600", icon: MessageSquare, label: "Contacted" },
    hot: { color: "bg-red-500/10 text-red-600", icon: Flame, label: "🔥 Hot Deal" },
    won: { color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle, label: "🏆 Won" },
    lost: { color: "bg-soft text-label opacity-60", icon: XCircle, label: "Lost" },
  };

  const sourceLabels: Record<string, string> = {
    web: "🌐 Website",
    instagram: "📸 Instagram",
    facebook: "📘 Facebook",
    whatsapp: "💬 WhatsApp",
    manual: "🤝 Manual",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* KPI STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-app border border-soft rounded-[2rem] p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-label mb-2">Active Pipeline</p>
            <div className="flex items-baseline gap-3">
               <span className="text-3xl font-serif italic text-heading">{leads.filter(l => l.status !== "won" && l.status !== "lost").length}</span>
               <span className="text-[10px] font-bold text-action">Total Leads</span>
            </div>
         </div>
         <div className="bg-app border border-soft rounded-[2rem] p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-label mb-2">Hot Opportunities</p>
            <div className="flex items-baseline gap-3">
               <span className="text-3xl font-serif italic text-red-500">{leads.filter(l => l.status === "hot").length}</span>
               <span className="text-[10px] font-bold text-red-400">Action Required</span>
            </div>
         </div>
         <div className="bg-app border border-soft rounded-[2rem] p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-label mb-2">Conversions</p>
            <div className="flex items-baseline gap-3">
               <span className="text-3xl font-serif italic text-emerald-500">{leads.filter(l => l.status === "won").length}</span>
               <span className="text-[10px] font-bold text-emerald-400">Closed Deals</span>
            </div>
         </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-app border border-soft rounded-[2.5rem] p-6 space-y-6 shadow-sm">
         <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* SEARCH */}
            <div className="relative flex-1 group">
               <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-label opacity-40 group-focus-within:text-action group-focus-within:opacity-100 transition-all" />
               <input 
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface border border-soft rounded-2xl pl-16 pr-6 py-4 text-sm font-medium text-heading focus:outline-none focus:ring-1 focus:ring-action focus:border-transparent transition-all shadow-inner"
               />
            </div>

            {/* QUICK FILTERS */}
            <div className="flex flex-wrap items-center gap-3">
               <div className="h-8 w-px bg-divider mx-4 hidden lg:block" />
               
               {/* PRIORITY DROPDOWN */}
               <div className="relative group">
                  <select 
                     value={priorityFilter || ""}
                     onChange={(e) => setPriorityFilter(e.target.value || null)}
                     className="appearance-none bg-surface border border-soft rounded-xl pl-10 pr-10 py-3 text-[10px] font-bold uppercase tracking-widest text-heading focus:outline-none focus:border-action/40 transition-all cursor-pointer"
                  >
                     <option value="">All Priorities</option>
                     <option value="high">High Priority</option>
                     <option value="medium">Medium Priority</option>
                     <option value="low">Low Priority</option>
                  </select>
                  <Filter size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-label opacity-40" />
                  <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-label opacity-40" />
               </div>

               {/* SOURCE DROPDOWN */}
               <div className="relative group">
                  <select 
                     value={sourceFilter || ""}
                     onChange={(e) => setSourceFilter(e.target.value || null)}
                     className="appearance-none bg-surface border border-soft rounded-xl pl-10 pr-10 py-3 text-[10px] font-bold uppercase tracking-widest text-heading focus:outline-none focus:border-action/40 transition-all cursor-pointer"
                  >
                     <option value="">All Sources</option>
                     {Object.entries(sourceLabels).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                     ))}
                  </select>
                  <TrendingUp size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-label opacity-40" />
                  <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-label opacity-40" />
               </div>

               {/* DATE DROPDOWN */}
               <div className="relative group">
                  <select 
                     value={dateFilter || ""}
                     onChange={(e) => setDateFilter(e.target.value || null)}
                     className="appearance-none bg-surface border border-soft rounded-xl pl-10 pr-10 py-3 text-[10px] font-bold uppercase tracking-widest text-heading focus:outline-none focus:border-action/40 transition-all cursor-pointer"
                  >
                     <option value="">All Time</option>
                     <option value="today">Today</option>
                     <option value="7days">Last 7 Days</option>
                     <option value="30days">Last 30 Days</option>
                     <option value="month">This Month</option>
                  </select>
                  <Calendar size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-label opacity-40" />
                  <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-label opacity-40" />
               </div>

               {(searchQuery || statusFilter || priorityFilter || sourceFilter || dateFilter) && (
                  <button 
                     onClick={clearFilters}
                     className="flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                     <X size={14} /> Clear All
                  </button>
               )}
            </div>
         </div>

         {/* STATUS TABS */}
         <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-soft pt-6">
            <button 
               onClick={() => setStatusFilter(null)}
               className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${!statusFilter ? 'bg-invert text-app shadow-lg' : 'bg-soft text-label hover:bg-divider'}`}
            >
               All Leads
            </button>
            {Object.entries(statusConfigs).map(([val, config]) => (
               <button 
                  key={val}
                  onClick={() => setStatusFilter(val)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === val ? 'bg-invert text-app shadow-lg font-black' : 'bg-soft text-label hover:bg-divider'}`}
               >
                  {val === statusFilter && <config.icon size={12} />}
                  {config.label}
               </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredLeads.map((lead) => (
          <div key={lead._id} className="bg-app border border-soft rounded-[3rem] p-10 shadow-sm hover:border-action/20 transition-all duration-500 relative group">
            
            {/* STATUS & PRIORITY BADGES */}
            <div className="absolute top-10 right-10 flex items-center gap-4">
               {lead.priority === "high" && (
                 <div className="px-4 py-2 bg-red-500 text-white rounded-full text-[8px] font-bold uppercase tracking-widest animate-pulse">
                    High Priority
                 </div>
               )}
               <div className={`
                    px-6 py-2 rounded-full text-[9px] font-sans font-bold uppercase tracking-widest 
                    flex items-center gap-3 border border-transparent
                    ${statusConfigs[lead.status?.toLowerCase() || "new"]?.color || "bg-soft text-label"}
                  `}>
                   {(() => {
                      const Icon = statusConfigs[lead.status?.toLowerCase() || "new"]?.icon || Clock;
                      return <Icon size={12} />;
                   })()}
                   {statusConfigs[lead.status?.toLowerCase() || "new"]?.label || "New Lead"}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* CONTACT INFO */}
              <div className="lg:w-1/3 space-y-6 border-r border-soft border-dotted lg:pr-12">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-action/5 border border-action/10 flex items-center justify-center text-action">
                      <User size={20} strokeWidth={1.5} />
                   </div>
                   <div>
                      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-1">Sales Lead</p>
                      <h3 className="text-lg font-sans font-bold text-heading">{lead.customerName || "Sales Lead"}</h3>
                   </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-soft border-dotted">
                   <div className="flex items-center gap-3 text-label">
                     <Mail size={14} className="opacity-40" />
                     <span className="text-[10px] font-bold lowercase tracking-widest">{lead.email}</span>
                   </div>
                   <div className="flex items-center gap-3 text-label">
                     <Phone size={14} className="opacity-40" />
                     <span className="text-[10px] font-bold tracking-widest">{lead.phone}</span>
                   </div>
                   <div className="flex items-center gap-3 text-label">
                     <TrendingUp size={14} className="opacity-40" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">
                       Source: {sourceLabels[lead.source || "web"] || "Website"}
                     </span>
                   </div>
                </div>

                {lead.productReference && (
                  <div className="pt-6 border-t border-soft border-dotted">
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-3 flex items-center gap-2">
                       <Package size={10} /> Interested In
                    </p>
                    <Link 
                      href={`/product/${lead.productReference.slug}`}
                      className="inline-flex items-center gap-3 p-3 bg-soft/50 rounded-xl border border-divider hover:border-action/40 transition-all group/prod"
                    >
                      <span className="text-xs font-bold text-heading group-hover/prod:text-action transition-colors">{lead.productReference.title}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* CRM CONTENT */}
              <div className="lg:w-2/3 flex flex-col justify-between">
                 <div className="space-y-6">
                    <div className="flex justify-between items-start">
                       <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-label opacity-50">Deal Pipeline & Notes</h4>
                       {lead.originalInquiry && (
                         <div className="flex items-center gap-2 text-[9px] font-bold text-purple-600 bg-purple-500/5 px-3 py-1 rounded-full border border-purple-500/10">
                            <ArrowRightCircle size={10} /> Elevated from Inquiry
                         </div>
                       )}
                    </div>
                    
                    <p className="text-lg font-serif italic text-description leading-relaxed bg-surface/50 p-8 rounded-3xl border border-soft/50 group-hover:bg-app transition-colors duration-500">
                       {lead.internalNotes || "No notes captured yet. Start logging sales touchpoints..."}
                    </p>

                    {lead.originalInquiry && (
                      <div className="bg-soft/30 rounded-2xl p-6 border border-soft border-dotted">
                         <p className="text-[9px] font-bold uppercase tracking-widest text-label opacity-40 mb-2">Original Message Context</p>
                         <p className="text-xs text-label italic leading-relaxed">
                            "{lead.originalInquiry.message}"
                         </p>
                      </div>
                    )}
                 </div>
                 
                 <div className="mt-12 flex flex-wrap gap-4">
                    <Button 
                      onClick={() => {
                        setSelectedLead(lead);
                        setTempNotes(lead.internalNotes || "");
                      }}
                      variant="primary"
                      className="rounded-full px-8"
                      leftIcon={<Info size={14} />}
                    >
                       Manage Deal Status
                    </Button>
                    <a 
                      href={`mailto:${lead.email}`}
                      className="flex items-center gap-2 px-8 py-3 border border-divider text-heading rounded-full text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-soft transition-all"
                    >
                       <Mail size={14} /> Official Email
                    </a>
                    {lead.phone && (
                      <div className="flex gap-4">
                        <a 
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-2 px-8 py-3 bg-heading text-app rounded-full text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-action transition-all shadow-md"
                        >
                           <Phone size={14} /> Direct Call
                        </a>
                        <a 
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-full text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md"
                        >
                           WhatsApp Business
                        </a>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        ))}
        {filteredLeads.length === 0 && (
          <div className="text-center py-32 bg-app border border-soft border-dotted rounded-[4rem]">
             <TrendingUp size={48} className="mx-auto text-label mb-6 opacity-20" />
             <p className="text-xl font-serif italic text-label">"The search is quiet."</p>
             <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-label mt-4 opacity-40">No sales leads match your current filters</p>
             {(searchQuery || statusFilter || priorityFilter || sourceFilter || dateFilter) && (
               <button 
                  onClick={clearFilters}
                  className="mt-8 px-8 py-3 bg-action text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-invert transition-all shadow-lg"
               >
                  Reset All Filters
               </button>
             )}
          </div>
        )}
      </div>

      {/* CRM MODAL */}
      <Modal
        isOpen={!!selectedLead}
        onClose={() => !updatingId && setSelectedLead(null)}
        title="Sales Lead Control Center"
      >
        {selectedLead && (
          <div className="space-y-10 py-6">
             <div className="flex items-start justify-between">
                <div>
                   <h3 className="text-xl font-bold text-heading">{selectedLead.customerName}</h3>
                   <p className="text-xs text-label italic font-serif mt-1">
                     Arrived via {sourceLabels[selectedLead.source || "web"]}
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4 opacity-50">Deal Phase</label>
                   <div className="relative">
                      <select 
                        value={selectedLead.status?.toLowerCase() || "new"}
                        disabled={updatingId === selectedLead._id}
                        onChange={(e) => updateLead(selectedLead._id, { status: e.target.value })}
                        className="w-full bg-surface border border-soft rounded-2xl px-6 py-4 text-sm font-bold text-heading focus:outline-none focus:ring-1 focus:ring-action appearance-none"
                      >
                         {Object.entries(statusConfigs).map(([val, config]) => (
                           <option key={val} value={val}>{config.label}</option>
                         ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4 opacity-50">Urgency Level</label>
                   <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((p) => (
                        <button
                          key={p}
                          onClick={() => updateLead(selectedLead._id, { priority: p })}
                          className={`flex-1 py-4 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${selectedLead.priority === p ? 'bg-invert text-app shadow-lg' : 'bg-soft text-label border border-divider hover:border-action/20'}`}
                        >
                          {p}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4 opacity-50">Sales Progress Notes</label>
                <textarea 
                  className="w-full bg-surface border border-soft rounded-[2.5rem] p-8 text-sm font-medium text-heading focus:outline-none focus:ring-1 focus:ring-action min-h-[200px] leading-relaxed italic"
                  placeholder="Log custom requests, negotiation details, or artisan progress here..."
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                />
                <Button 
                   fullWidth 
                   isLoading={updatingId === selectedLead._id}
                   onClick={() => updateLead(selectedLead._id, { internalNotes: tempNotes })}
                   leftIcon={<Save size={16} />}
                >
                   Save Sales Notes
                </Button>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
