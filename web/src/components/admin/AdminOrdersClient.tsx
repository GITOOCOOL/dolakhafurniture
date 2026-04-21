"use client";

import { useState } from "react";
import { Package, MapPin, Phone, Mail, Calendar, ChevronDown } from "lucide-react";

interface Order {
  _id: string;
  orderNumber?: string;
  status?: string;
  customerEmail?: string;
  customerPhone?: string;
  totalPrice: number;
  _createdAt: string;
  shippingAddress?: any;
  items: any[];
}

export default function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600",
    processing: "bg-blue-500/10 text-blue-600",
    shipped: "bg-purple-500/10 text-purple-600",
    delivered: "bg-emerald-500/10 text-emerald-600",
    cancelled: "bg-red-500/10 text-red-600",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="type-hero font-medium text-heading mb-2">Orders<span className="text-action">.</span></h1>
          <p className="type-label text-label uppercase tracking-widest text-[9px]">Managing {orders.length} Total Selections</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-app border border-soft rounded-[3rem] p-10 shadow-sm hover:border-action/20 transition-all duration-500 overflow-hidden relative group">
            {/* STATUS BADGE */}
            <div className="absolute top-10 right-10 flex items-center gap-4">
               <div className="relative">
                <select 
                  value={order.status?.toLowerCase() || "pending"}
                  disabled={updatingId === order._id}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className={`
                    appearance-none pl-6 pr-10 py-2.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-widest 
                    transition-all outline-none cursor-pointer border border-transparent hover:border-action/20
                    ${statusColors[order.status?.toLowerCase() || "pending"]}
                    ${updatingId === order._id ? "opacity-50" : ""}
                  `}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown size={10} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* ORDER HEADER */}
              <div className="lg:col-span-4 space-y-6 border-r border-soft border-dotted pr-12">
                <div>
                   <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-2">Order Reference</p>
                   <h3 className="text-xl font-sans font-bold text-heading">#{order.orderNumber || order._id.slice(-6).toUpperCase()}</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-label">
                    <Calendar size={14} className="opacity-40" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {new Date(order._createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-label">
                    <Mail size={14} className="opacity-40" />
                    <span className="text-[10px] font-bold lowercase tracking-widest">{order.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-3 text-label">
                    <Phone size={14} className="opacity-40" />
                    <span className="text-[10px] font-bold tracking-widest">{order.customerPhone}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-soft border-dotted">
                  <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-4 flex items-center gap-2">
                    <MapPin size={10} /> Shipping Destination
                  </p>
                  <p className="text-xs font-medium text-heading leading-loose">
                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}<br />
                    {order.shippingAddress?.address}<br />
                    {order.shippingAddress?.apartment && <>{order.shippingAddress.apartment}, </>}
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                    {order.shippingAddress?.postcode}
                  </p>
                </div>
              </div>

              {/* ORDER ITEMS */}
              <div className="lg:col-span-8">
                 <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-6">Order Contents</p>
                 <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-soft/30 p-6 rounded-2xl border border-soft/50">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-16 bg-white rounded-lg border border-soft flex-shrink-0" />
                           <div>
                              <p className="text-sm font-bold text-heading mb-1">{item.title}</p>
                              <p className="text-xs text-label font-serif italic">Quantity: {item.quantity}</p>
                           </div>
                        </div>
                        <p className="text-sm font-bold text-heading">Rs. {item.price * item.quantity}</p>
                      </div>
                    ))}
                 </div>

                 <div className="mt-8 pt-8 border-t border-soft border-dotted flex justify-between items-end">
                    <div>
                      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-1">Grand Total</p>
                      <h4 className="text-3xl font-sans font-bold text-heading">Rs. {order.totalPrice}</h4>
                    </div>
                    <button className="flex items-center gap-2 px-8 py-3 bg-invert text-app rounded-full text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-action transition-all">
                       <Package size={14} /> Full Details
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
