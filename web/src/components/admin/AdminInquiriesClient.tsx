"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  Package, 
  ChevronDown, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Info, 
  Wand2, 
  ArrowRightCircle,
  Search,
  Filter,
  X
} from "lucide-react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface Inquiry {
  _id: string;
  _createdAt: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  inquiryType?: string;
  status?: string;
  productReference?: {
    title: string;
    slug: string;
  };
}

export default function AdminInquiriesClient({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [elevatingId, setElevatingId] = useState<string | null>(null);
  const [isElevationSuccess, setIsElevationSuccess] = useState(false);

  // FILTER STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const filteredInquiries = inquiries.filter(inquiry => {
    // SEARCH CHECK
    const matchesSearch = !searchQuery || 
      inquiry.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // TYPE CHECKS
    const matchesStatus = !statusFilter || inquiry.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = !typeFilter || inquiry.inquiryType?.toLowerCase() === typeFilter.toLowerCase();

    // DATE LOGIC
    let matchesDate = true;
    if (dateFilter) {
      const createdAt = new Date(inquiry._createdAt).getTime();
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

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setTypeFilter(null);
    setDateFilter(null);
  };

  const updateStatus = async (inquiryId: string, newStatus: string) => {
    setUpdatingId(inquiryId);
    try {
      const res = await fetch("/api/admin/inquiries/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId, status: newStatus }),
      });
      if (res.ok) {
        setInquiries(inquiries.map(i => i._id === inquiryId ? { ...i, status: newStatus } : i));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleElevate = async (inquiryId: string) => {
    setElevatingId(inquiryId);
    try {
      const res = await fetch("/api/admin/leads/elevate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId }),
      });
      if (res.ok) {
        setInquiries(inquiries.map(i => i._id === inquiryId ? { ...i, status: "elevated" } : i));
        setIsElevationSuccess(true);
        setTimeout(() => setIsElevationSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setElevatingId(null);
    }
  };

  const statusConfigs: Record<string, { color: string; icon: any; label: string }> = {
    new: { color: "bg-blue-500/10 text-blue-600", icon: Clock, label: "New Message" },
    progress: { color: "bg-amber-500/10 text-amber-600", icon: Info, label: "In Progress" },
    resolved: { color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle, label: "Resolved" },
    elevated: { color: "bg-purple-500/10 text-purple-600", icon: Wand2, label: "Elevated to Lead" },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

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
               
               {/* TYPE DROPDOWN */}
               <div className="relative group">
                  <select 
                     value={typeFilter || ""}
                     onChange={(e) => setTypeFilter(e.target.value || null)}
                     className="appearance-none bg-surface border border-soft rounded-xl pl-10 pr-10 py-3 text-[10px] font-bold uppercase tracking-widest text-heading focus:outline-none focus:border-action/40 transition-all cursor-pointer min-w-[200px]"
                  >
                     <option value="">All Inquiry Types</option>
                     <option value="General Inquiry">General Inquiry</option>
                     <option value="Product Inquiry">Product Inquiry</option>
                     <option value="Order Tracking">Order Tracking</option>
                     <option value="Returns & Refunds">Returns & Refunds</option>
                     <option value="Custom Design">Custom Design</option>
                  </select>
                  <Filter size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-label opacity-40" />
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

               {(searchQuery || statusFilter || typeFilter || dateFilter) && (
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
               All Messages
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
        {filteredInquiries.map((inquiry) => (
          <div key={inquiry._id} className="bg-app border border-soft rounded-[3rem] p-10 shadow-sm hover:border-action/20 transition-all duration-500 relative group">
            <div className="absolute top-10 right-10 flex items-center gap-4">
               <div className="relative">
                <select 
                  value={inquiry.status?.toLowerCase() || "new"}
                  disabled={updatingId === inquiry._id}
                  onChange={(e) => updateStatus(inquiry._id, e.target.value)}
                  className={`
                    appearance-none pl-6 pr-10 py-2.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-widest 
                    transition-all outline-none cursor-pointer border border-transparent hover:border-action/20
                    ${statusConfigs[inquiry.status?.toLowerCase() || "new"]?.color || "bg-soft text-label"}
                    ${updatingId === inquiry._id ? "opacity-50" : ""}
                  `}
                >
                  {Object.entries(statusConfigs).map(([val, config]) => (
                    <option key={val} value={val}>{config.label}</option>
                  ))}
                </select>
                <ChevronDown size={10} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
               </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* CUSTOMER INFO */}
              <div className="lg:w-1/3 space-y-6 border-r border-soft border-dotted lg:pr-12">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-action/5 border border-action/10 flex items-center justify-center text-action">
                      <User size={20} strokeWidth={1.5} />
                   </div>
                    <div>
                       <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-1">Inquiry Identity</p>
                       <h3 className="text-lg font-sans font-bold text-heading">{inquiry.name || "Anonymous Traveler"}</h3>
                    </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-soft border-dotted">
                    <div className="flex items-center gap-3 text-label">
                      <Mail size={14} className="opacity-40" />
                      <span className="text-[10px] font-bold lowercase tracking-widest">{inquiry.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-label">
                      <Phone size={14} className="opacity-40" />
                      <span className="text-[10px] font-bold tracking-widest">{inquiry.phone}</span>
                    </div>
                   <div className="flex items-center gap-3 text-label">
                     <Calendar size={14} className="opacity-40" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">
                       {new Date(inquiry._createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                     </span>
                   </div>
                </div>

                {inquiry.productReference && (
                  <div className="pt-6 border-t border-soft border-dotted">
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-3 flex items-center gap-2">
                       <Package size={10} /> Related Selection
                    </p>
                    <Link 
                      href={`/product/${inquiry.productReference.slug}`}
                      className="inline-flex items-center gap-3 p-3 bg-soft/50 rounded-xl border border-divider hover:border-action/40 transition-all group/prod"
                    >
                      <span className="text-xs font-bold text-heading group-hover/prod:text-action transition-colors">{inquiry.productReference.title}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* MESSAGE CONTENT */}
              <div className="lg:w-2/3 flex flex-col justify-between">
                 <div className="space-y-6">
                    <div className="flex justify-between items-start">
                       <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-label opacity-50">Support Request</h4>
                    </div>
                    {inquiry.inquiryType && (
                      <p className="text-xs font-bold text-action uppercase tracking-widest bg-action/5 inline-block px-3 py-1 rounded-md">
                        {inquiry.inquiryType}
                      </p>
                    )}
                    <p className="text-lg font-serif italic text-description leading-relaxed bg-surface/50 p-8 rounded-3xl border border-soft/50 group-hover:bg-app transition-colors duration-500">
                       "{inquiry.message}"
                    </p>
                 </div>
                 
                 <div className="mt-12 flex flex-wrap gap-4">
                    {inquiry.status !== "elevated" ? (
                      <Button 
                        onClick={() => handleElevate(inquiry._id)}
                        isLoading={elevatingId === inquiry._id}
                        variant="accent"
                        className="rounded-full px-8"
                        leftIcon={<Wand2 size={14} />}
                      >
                         Elevate to Lead
                      </Button>
                    ) : (
                      <div className="px-8 py-3 bg-purple-500/5 text-purple-600 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 border border-purple-500/10">
                         <CheckCircle size={14} /> Lead Created
                      </div>
                    )}
                    <a 
                      href={`mailto:${inquiry.email}`}
                      className="flex items-center gap-2 px-8 py-3 bg-invert text-app rounded-full text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-action transition-all"
                    >
                       <Mail size={14} /> Send Email
                    </a>
                    {inquiry.phone && (
                      <div className="flex gap-4">
                        <a 
                          href={`tel:${inquiry.phone}`}
                          className="flex items-center gap-2 px-8 py-3 bg-action text-white rounded-full text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-invert transition-all shadow-md"
                        >
                           <Phone size={14} /> Direct Call
                        </a>
                        <a 
                          href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-full text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md"
                        >
                           WhatsApp
                        </a>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        ))}
        {filteredInquiries.length === 0 && (
          <div className="text-center py-32 bg-app border border-soft border-dotted rounded-[4rem]">
             <MessageSquare size={48} className="mx-auto text-label mb-6 opacity-20" />
             <p className="text-xl font-serif italic text-label">"The archive is quiet."</p>
             <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-label mt-4 opacity-40">No inquiries match your current filters</p>
             {(searchQuery || statusFilter || typeFilter || dateFilter) && (
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
      {/* ELEVATION SUCCESS TOAST */}
      {isElevationSuccess && (
        <div className="fixed bottom-10 right-10 z-50 animate-in slide-in-from-right-10 fade-in duration-500">
           <Link href="/admin/leads" className="bg-heading text-app px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 hover:bg-action transition-all group">
              <div className="w-8 h-8 bg-action/20 text-action rounded-full flex items-center justify-center">
                 <ArrowRightCircle size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest">Lead Created Successfully</p>
                 <p className="text-[9px] opacity-60 group-hover:opacity-100 transition-opacity">Click here to view in CRM dashboard</p>
              </div>
           </Link>
        </div>
      )}
    </div>
  );
}
