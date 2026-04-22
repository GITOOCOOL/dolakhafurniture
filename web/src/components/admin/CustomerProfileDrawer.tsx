"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  Package, 
  MessageCircle, 
  TrendingUp, 
  Calendar, 
  ExternalLink,
  History,
  ShieldCheck,
  CreditCard,
  Loader2,
  Trash2,
  Phone,
  Mail
} from "lucide-react";
import { getCustomerIntelligence } from "@/app/actions/adminCustomer";
import { format } from "date-fns";
import { Order } from "@/types/order";
import DeleteOrderModal from "./DeleteOrderModal";

interface CustomerProfileDrawerProps {
  email: string | null;
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
}

export default function CustomerProfileDrawer({ 
  email, 
  isOpen, 
  onClose,
  customerName 
}: CustomerProfileDrawerProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen && email) {
      setLoading(true);
      setError(null);
      getCustomerIntelligence(email)
        .then((res) => {
          if (res.success) {
            setData(res.data);
          } else {
            setError(res.message || "Failed to load intelligence");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, email]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDeleteSuccess = (orderId: string) => {
    if (data) {
      setData({
        ...data,
        orders: data.orders.filter((o: any) => o._id !== orderId)
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-heading/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-app border-l border-soft shadow-2xl z-[70] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-soft flex justify-between items-start bg-app/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-3xl bg-soft border border-divider flex items-center justify-center text-label overflow-hidden">
                   <User size={30} className="opacity-30" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-heading mb-1">{customerName || "Customer Profile"}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    {email && (
                      <a 
                        href={`mailto:${email}`}
                        className="text-[10px] font-sans font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors"
                        title="Draft Quick Email"
                      >
                        {email}
                      </a>
                    )}
                    {data?.orders?.[0]?.customerPhone && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-soft" />
                        <a 
                          href={`tel:${data.orders[0].customerPhone}`}
                          className="flex items-center gap-1.5 text-emerald-500 hover:text-emerald-600 transition-colors"
                          title="Call Artisan Lead"
                        >
                          <Phone size={10} strokeWidth={3} className="fill-emerald-500/10" />
                          <span className="text-[10px] font-bold tracking-widest">{data.orders[0].customerPhone}</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-soft rounded-full transition-colors text-label"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40">
                  <Loader2 className="animate-spin" size={40} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Aggregating Artisan Data...</p>
                </div>
              ) : error ? (
                <div className="p-10 border border-red-500/20 bg-red-500/5 rounded-3xl text-center">
                   <p className="text-sm font-bold text-red-600">{error}</p>
                </div>
              ) : data ? (
                <>
                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-action/5 border border-action/20 rounded-[2rem] space-y-2">
                       <div className="flex items-center gap-2 text-action opacity-60">
                         <TrendingUp size={14} />
                         <span className="text-[9px] font-bold uppercase tracking-widest">Lifetime Value</span>
                       </div>
                       <p className="text-2xl font-serif italic text-heading">{formatPrice(data.metrics.totalSpend)}</p>
                    </div>
                    <div className="p-6 bg-app border border-soft rounded-[2rem] space-y-2 shadow-sm">
                       <div className="flex items-center gap-2 text-label opacity-60">
                         <Package size={14} />
                         <span className="text-[9px] font-bold uppercase tracking-widest">Total Orders</span>
                       </div>
                       <p className="text-2xl font-serif italic text-heading">{data.metrics.orderCount}</p>
                    </div>
                  </div>

                  {/* Orders Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                      <History size={16} className="text-action/60" />
                      <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-heading">Artisan Ledger</h3>
                      <div className="h-px bg-soft flex-1 ml-4" />
                    </div>

                    <div className="space-y-4">
                      {data.orders.length > 0 ? data.orders.map((order: any) => (
                        <div key={order._id} className="p-6 bg-surface border border-soft rounded-[2rem] hover:border-action/30 transition-all group">
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-label mb-1">
                                  #{order.orderNumber} • {format(new Date(order._createdAt), 'MMM dd, yyyy')}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {order.items.slice(0, 3).map((item: any, i: number) => (
                                    <span key={i} className="text-[10px] font-bold tracking-tight bg-soft px-2 py-0.5 rounded-lg opacity-60">
                                      {item.quantity}x {item.title}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <span className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-600' :
                                order.status === 'processing' ? 'bg-amber-500/10 text-amber-600' :
                                'bg-soft text-label'
                              }`}>
                                {order.status}
                              </span>
                           </div>
                           <div className="flex justify-between items-end border-t border-soft border-dotted pt-4">
                              <p className="text-lg font-serif italic text-heading">{formatPrice(order.totalPrice)}</p>
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => setOrderToDelete(order)}
                                  className="p-2 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                  title="Delete Order"
                                >
                                  <Trash2 size={12} />
                                </button>
                                <a 
                                  href={`/admin/orders?order=${order.orderNumber}`} 
                                  className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-action opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  View Details <ExternalLink size={12} />
                                </a>
                              </div>
                           </div>
                        </div>
                      )) : (
                        <div className="p-10 border-2 border-dotted border-soft rounded-[2rem] text-center text-label italic font-serif opacity-40">
                          "No physical commissions recorded."
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Activity Section */}
                   <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                      <MessageCircle size={16} className="text-label opacity-40" />
                      <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-label">Recent Inquiries</h3>
                      <div className="h-px bg-soft flex-1 ml-4" />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       {data.inquiries.map((inquiry: any) => (
                         <div key={inquiry._id} className="p-6 bg-app border border-soft rounded-[2rem]">
                            <div className="flex justify-between items-start mb-3">
                               <span className="text-[8px] font-bold uppercase tracking-widest bg-action/5 text-action px-3 py-1 rounded-full border border-action/10">
                                 {inquiry.inquiryType}
                               </span>
                               <span className="text-[9px] text-label opacity-40 font-serif italic">
                                 {format(new Date(inquiry._createdAt), 'MMM dd')}
                               </span>
                            </div>
                            <p className="text-xs text-heading leading-relaxed line-clamp-3 italic font-serif">
                              "{inquiry.message}"
                            </p>
                         </div>
                       ))}
                       {data.inquiries.length === 0 && (
                         <p className="text-[10px] text-center font-bold uppercase tracking-widest text-label opacity-40 py-4">
                            No digital inquiries found
                         </p>
                       )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="pt-10 space-y-4">
                    <div className="flex items-center justify-between text-[9px] font-bold tracking-[0.3em] text-label uppercase opacity-40 px-2">
                       <span>CRM Profile Sync</span>
                       <div className="flex items-center gap-2">
                          <ShieldCheck size={10} /> Verified Data
                       </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </>
      )}

      {/* SHARED DELETE MODAL INTEGRATION */}
      <DeleteOrderModal 
        order={orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onSuccess={handleDeleteSuccess}
      />
    </AnimatePresence>
  );
}
