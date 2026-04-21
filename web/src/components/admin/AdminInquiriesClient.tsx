"use client";

import { useState } from "react";
import { MessageSquare, Mail, Phone, Calendar, User, Package, ChevronDown } from "lucide-react";
import Link from "next/link";

interface Inquiry {
  _id: string;
  _createdAt: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  message?: string;
  subject?: string;
  status?: string;
  productReference?: {
    title: string;
    slug: string;
  };
}

export default function AdminInquiriesClient({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-600",
    responded: "bg-emerald-500/10 text-emerald-600",
    archived: "bg-soft text-label",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      <div className="grid grid-cols-1 gap-6">
        {inquiries.map((inquiry) => (
          <div key={inquiry._id} className="bg-app border border-soft rounded-[3rem] p-10 shadow-sm hover:border-action/20 transition-all duration-500 relative group">
            {/* STATUS SELECT */}
            <div className="absolute top-10 right-10 flex items-center gap-4">
               <div className="relative">
                <select 
                  value={inquiry.status?.toLowerCase() || "new"}
                  disabled={updatingId === inquiry._id}
                  onChange={(e) => updateStatus(inquiry._id, e.target.value)}
                  className={`
                    appearance-none pl-6 pr-10 py-2.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-widest 
                    transition-all outline-none cursor-pointer border border-transparent hover:border-action/20
                    ${statusColors[inquiry.status?.toLowerCase() || "new"]}
                    ${updatingId === inquiry._id ? "opacity-50" : ""}
                  `}
                >
                  <option value="new">New</option>
                  <option value="responded">Responded</option>
                  <option value="archived">Archived</option>
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
                      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-1">Customer</p>
                      <h3 className="text-lg font-sans font-bold text-heading">{inquiry.customerName || "Anonymous"}</h3>
                   </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-soft border-dotted">
                   <div className="flex items-center gap-3 text-label">
                     <Mail size={14} className="opacity-40" />
                     <span className="text-[10px] font-bold lowercase tracking-widest">{inquiry.customerEmail}</span>
                   </div>
                   <div className="flex items-center gap-3 text-label">
                     <Phone size={14} className="opacity-40" />
                     <span className="text-[10px] font-bold tracking-widest">{inquiry.customerPhone}</span>
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
                 <div>
                    <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-label mb-4 opacity-50">Message Content</h4>
                    {inquiry.subject && (
                      <p className="text-sm font-bold text-heading mb-4">Subject: {inquiry.subject}</p>
                    )}
                    <p className="text-lg font-serif italic text-description leading-relaxed">
                       "{inquiry.message}"
                    </p>
                 </div>
                 
                 <div className="mt-12 flex gap-4">
                    <a 
                      href={`mailto:${inquiry.customerEmail}`}
                      className="flex items-center gap-2 px-8 py-3 bg-invert text-app rounded-full text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-action transition-all"
                    >
                       <Mail size={14} /> Send Email
                    </a>
                    {inquiry.customerPhone && (
                      <a 
                        href={`https://wa.me/${inquiry.customerPhone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-full text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md"
                      >
                         WhatsApp
                      </a>
                    )}
                 </div>
              </div>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && (
          <div className="text-center py-32 bg-app border border-soft border-dotted rounded-[4rem]">
             <MessageSquare size={48} className="mx-auto text-label mb-6 opacity-20" />
             <p className="text-xl font-serif italic text-label">"A moment of silence in the gallery."</p>
             <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-label mt-4 opacity-40">No pending inquiries found</p>
          </div>
        )}
      </div>
    </div>
  );
}
