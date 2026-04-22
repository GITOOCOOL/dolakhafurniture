"use client";

import { useState, useEffect, useMemo } from "react";
import { Package, MapPin, Phone, Mail, Calendar, ChevronDown, Plus, Tag, Info, User, CheckCircle2, Search, Filter, X, Trash2, AlertOctagon, RotateCcw } from "lucide-react";
import Image from "next/image";
import ManualOrderModal from "./ManualOrderModal";
import { deleteOrder } from "@/app/actions/adminOrders";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface Order {
  _id: string;
  orderNumber?: string;
  status?: string;
  orderSource?: string;
  isPhoneOrder?: boolean;
  internalNotes?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  totalPrice: number;
  discountValue?: number;
  advanceDeposit?: number;
  voucherCodes?: string[];
  _createdAt: string;
  shippingAddress?: any;
  items: any[];
}

export default function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [shouldRestoreStock, setShouldRestoreStock] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        !searchQuery || 
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone?.includes(searchQuery);
      
      const matchesStatus = statusFilter === "all" || order.status?.toLowerCase() === statusFilter;
      const matchesSource = sourceFilter === "all" || order.orderSource?.toLowerCase() === sourceFilter;
      
      let matchesType = true;
      if (typeFilter === "manual") matchesType = !!order.isPhoneOrder;
      if (typeFilter === "website") matchesType = !order.isPhoneOrder;

      // DATE LOGIC
      let matchesDate = true;
      if (dateFilter) {
        const createdAt = new Date(order._createdAt).getTime();
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

      return matchesSearch && matchesStatus && matchesSource && matchesType && matchesDate;
    });
  }, [orders, searchQuery, statusFilter, sourceFilter, typeFilter, dateFilter]);

  // Keep internal state in sync with server data when it changes
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

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

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteOrder(orderToDelete._id, shouldRestoreStock);
      if (result.success) {
        setOrderToDelete(null);
        setDeleteConfirmText("");
        setOrders(orders.filter(o => o._id !== orderToDelete._id));
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Failed to delete order.");
    } finally {
      setIsDeleting(false);
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
      <div className="flex justify-end items-end mb-4">
        <button 
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-2 px-8 py-3 bg-action text-white rounded-full text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-heading transition-all shadow-xl shadow-action/20"
        >
           <Plus size={14} strokeWidth={3} />
           Create Manual Order
        </button>
      </div>

      {/* FILTER BAR (UNIFIED DESIGN) */}
      <div className="bg-app border border-soft rounded-[2.5rem] p-6 space-y-6 shadow-sm">
         <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* SEARCH */}
            <div className="relative flex-1 group">
               <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-label opacity-40 group-focus-within:text-action group-focus-within:opacity-100 transition-all" />
               <input 
                  type="text"
                  placeholder="Search by Order #, Name or Phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface border border-soft rounded-2xl pl-16 pr-6 py-4 text-sm font-medium text-heading focus:outline-none focus:ring-1 focus:ring-action focus:border-transparent transition-all shadow-inner"
               />
            </div>

            {/* QUICK FILTERS */}
            <div className="flex flex-wrap items-center gap-3">
               <div className="h-8 w-px bg-divider mx-4 hidden lg:block" />
               
               {/* CHANNEL/TYPE FILTER */}
               <div className="relative group">
                  <select 
                     value={typeFilter}
                     onChange={(e) => setTypeFilter(e.target.value)}
                     className="appearance-none bg-surface border border-soft rounded-xl pl-10 pr-10 py-3 text-[10px] font-bold uppercase tracking-widest text-heading focus:outline-none focus:border-action/40 transition-all cursor-pointer min-w-[160px]"
                  >
                     <option value="all">All Channels</option>
                     <option value="website">Website Sales</option>
                     <option value="manual">Manual Sales</option>
                  </select>
                  <Filter size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-label opacity-40" />
                  <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-label opacity-40" />
               </div>

               {/* SOURCE FILTER */}
               <div className="relative group">
                  <select 
                     value={sourceFilter}
                     onChange={(e) => setSourceFilter(e.target.value)}
                     className="appearance-none bg-surface border border-soft rounded-xl pl-10 pr-10 py-3 text-[10px] font-bold uppercase tracking-widest text-heading focus:outline-none focus:border-action/40 transition-all cursor-pointer min-w-[160px]"
                  >
                     <option value="all">All Sources</option>
                     <option value="website">Website</option>
                     <option value="walk-in">Walk-In</option>
                     <option value="whatsapp">WhatsApp</option>
                     <option value="phone">Phone Call</option>
                     <option value="facebook">Facebook</option>
                  </select>
                  <Package size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-label opacity-40" />
                  <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-label opacity-40" />
               </div>

               {/* DATE FILTER */}
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

               {(searchQuery || statusFilter !== "all" || sourceFilter !== "all" || typeFilter !== "all" || dateFilter) && (
                  <button 
                     onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setSourceFilter("all");
                        setTypeFilter("all");
                        setDateFilter(null);
                     }}
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
               onClick={() => setStatusFilter("all")}
               className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === "all" ? 'bg-invert text-app shadow-lg' : 'bg-soft text-label hover:bg-divider'}`}
            >
               All Orders
            </button>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((val) => (
               <button 
                  key={val}
                  onClick={() => setStatusFilter(val)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === val ? 'bg-invert text-app shadow-lg font-black' : 'bg-soft text-label hover:bg-divider'}`}
               >
                  {val === statusFilter && <CheckCircle2 size={12} />}
                  {val.charAt(0).toUpperCase() + val.slice(1)}
               </button>
            ))}
         </div>
      </div>

      <ManualOrderModal 
        isOpen={isManualModalOpen} 
        onClose={() => setIsManualModalOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />

      <div className="space-y-6">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
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
                   <div className="flex items-center gap-3 mb-2">
                     <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label">Order Reference</p>
                     <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1.5 ${order.isPhoneOrder ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"}`}>
                        {order.isPhoneOrder ? (
                          <><User size={10} strokeWidth={3} /> Manual Sale</>
                        ) : (
                          <><Package size={10} strokeWidth={3} /> Website Sale</>
                        )}
                     </span>
                   </div>
                   <h3 className="text-xl font-sans font-bold text-heading">#{order.orderNumber || order._id.slice(-6).toUpperCase()}</h3>
                </div>
                
                {/* VOUCHERS & DISCOUNTS */}
                {(order.voucherCodes?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {order.voucherCodes?.map((code, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-action/10 text-action rounded-full text-[8px] font-bold uppercase tracking-widest border border-action/10">
                        <Tag size={10} />
                        {code}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-label">
                    <Calendar size={14} className="opacity-40" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {new Date(order._createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-label">
                    <Mail size={14} className="opacity-40" />
                    <span className="text-[10px] font-bold lowercase tracking-widest">{order.customerEmail || "No Email"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-label">
                    <Phone size={14} className="opacity-40" />
                    <span className="text-[10px] font-bold tracking-widest">{order.customerPhone || "No Phone"}</span>
                  </div>
                </div>

                {order.internalNotes && (
                  <div className="pt-6 border-t border-soft border-dotted">
                     <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-2 text-action">Internal Notes</p>
                     <p className="text-xs font-medium text-heading bg-action/5 p-4 rounded-xl border border-action/10 italic">
                        {order.internalNotes}
                     </p>
                  </div>
                )}

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
                           <div className="w-12 h-16 bg-white rounded-lg border border-soft flex-shrink-0 relative overflow-hidden">
                             {item.imageUrl ? (
                               <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                             ) : (
                               <div className="w-full h-full bg-soft/50 flex items-center justify-center">
                                  <Package size={14} className="text-label opacity-40" />
                               </div>
                             )}
                           </div>
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
                    <div className="flex gap-16">
                      <div>
                        <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-1">Total</p>
                        <h4 className="text-xl font-sans font-bold text-heading">Rs. {order.totalPrice}</h4>
                      </div>
                      {order.advanceDeposit && order.advanceDeposit > 0 ? (
                        <>
                          <div>
                            <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-emerald-500 mb-1">Deposit Paid</p>
                            <h4 className="text-xl font-sans font-bold text-emerald-600">Rs. {order.advanceDeposit}</h4>
                          </div>
                          <div>
                            <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-red-500 mb-1">Balance Due</p>
                            <h4 className="text-xl font-sans font-bold text-red-600">Rs. {Math.max(0, order.totalPrice - order.advanceDeposit)}</h4>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div className="flex gap-3">
                       <button 
                         onClick={() => setSelectedOrder(order)}
                         className="flex items-center gap-2 px-8 py-3 bg-invert text-app rounded-full text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-action transition-all shadow-lg"
                       >
                          <Plus size={14} /> Full Breakdown
                       </button>
                       <button 
                         onClick={() => {
                           setOrderToDelete(order);
                           setDeleteConfirmText("");
                           setShouldRestoreStock(true);
                         }}
                         className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-600 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                         title="Delete Order"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-24 text-center border border-soft border-dashed rounded-[3rem] bg-soft/5">
             <Package size={40} className="mx-auto text-label opacity-20 mb-4" />
             <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-label">No orders match your selection</p>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order Details: #${selectedOrder.orderNumber}` : "Order Details"}
        position="right"
        noPadding
      >
        {selectedOrder && (
          <div className="flex flex-col h-full bg-app">
            <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
              {/* SECTION: CUSTOMER */}
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-label flex items-center gap-3">
                  <User size={12} className="text-action" /> Customer Identity
                </h4>
                <div className="bg-surface border border-soft rounded-[2rem] p-8 space-y-4">
                  <div className="flex justify-between items-center border-b border-soft border-dotted pb-4">
                    <span className="text-[10px] uppercase font-bold text-label">Name</span>
                    <span className="text-sm font-bold text-heading">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-soft border-dotted pb-4">
                    <span className="text-[10px] uppercase font-bold text-label">Phone</span>
                    <span className="text-sm font-bold text-heading">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-label">Email</span>
                    <span className="text-sm font-bold text-heading lowercase">{selectedOrder.customerEmail || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* SECTION: LOGISTICS */}
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-label flex items-center gap-3">
                  <MapPin size={12} className="text-action" /> Delivery Logistics
                </h4>
                <div className="bg-surface border border-soft rounded-[2.5rem] p-8 space-y-6">
                  <div className="space-y-2">
                     <p className="text-[9px] uppercase font-bold text-label opacity-40">Recipient</p>
                     <p className="type-body text-heading font-bold">{selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[9px] uppercase font-bold text-label opacity-40">Full Address</p>
                     <p className="type-body text-heading leading-relaxed italic">
                        {selectedOrder.shippingAddress?.address}<br />
                        {selectedOrder.shippingAddress?.apartment && <>{selectedOrder.shippingAddress.apartment}, </>}
                        {selectedOrder.shippingAddress?.city && <>{selectedOrder.shippingAddress.city}, </>}
                        {selectedOrder.shippingAddress?.state}<br />
                        Nepal
                     </p>
                  </div>
                </div>
              </div>

              {/* SECTION: FINANCIALS */}
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-label flex items-center gap-3">
                  <Info size={12} className="text-action" /> Financial Breakdown
                </h4>
                <div className="bg-heading rounded-[2.5rem] p-10 text-app space-y-8 shadow-2xl relative overflow-hidden">
                   <Package className="absolute -right-6 -bottom-6 w-32 h-32 text-app/5 rotate-12" />
                   <div className="space-y-4">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs opacity-70">
                           <span>{item.quantity}x {item.title}</span>
                           <span className="font-bold">Rs. {item.price * item.quantity}</span>
                        </div>
                      ))}
                   </div>
                   
                   <div className="pt-6 border-t border-app/10 space-y-4">
                      <div className="flex justify-between items-center text-xs opacity-50">
                         <span>Subtotal</span>
                         <span>Rs. {selectedOrder.items.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                      </div>
                      {(selectedOrder.discountValue ?? 0) > 0 && (
                        <div className="flex justify-between items-center text-xs text-red-300 font-bold">
                           <span className="flex items-center gap-2"><Tag size={12} /> Total Savings</span>
                           <span>-Rs. {selectedOrder.discountValue}</span>
                        </div>
                      )}
                       <div className="flex justify-between items-center pt-4 border-b border-app/10 pb-4 mb-4">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-app/40">Total Price</span>
                          <span className="text-3xl font-bold">Rs. {selectedOrder.totalPrice}</span>
                       </div>

                       {selectedOrder.advanceDeposit && selectedOrder.advanceDeposit > 0 ? (
                         <div className="space-y-4 pt-4 border-t border-app/10 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <div className="flex justify-between items-center text-xs text-emerald-400 font-bold">
                               <span className="uppercase tracking-widest opacity-60">Advance Deposit Paid</span>
                               <span>Rs. {selectedOrder.advanceDeposit}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                               <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">Remaining Balance Due</span>
                               <span className="text-2xl font-bold text-red-400">Rs. {Math.max(0, selectedOrder.totalPrice - selectedOrder.advanceDeposit)}</span>
                            </div>
                         </div>
                       ) : (
                         <div className="flex justify-between items-center pt-2 text-xs opacity-40">
                            <span className="uppercase tracking-widest italic">No advance deposit logged</span>
                            <span>Balance: Rs. {selectedOrder.totalPrice}</span>
                         </div>
                       )}
                    </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-soft/20 bg-app">
               <Button fullWidth onClick={() => setSelectedOrder(null)}>Close Review</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!orderToDelete}
        onClose={() => !isDeleting && setOrderToDelete(null)}
        title="Security Confirmation"
      >
        {orderToDelete && (
          <div className="space-y-8 py-4">
             <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 text-red-600 rounded-full flex items-center justify-center border border-red-500/20">
                   <AlertOctagon size={32} />
                </div>
                <div>
                   <h3 className="type-section text-lg">Permanent Order Deletion</h3>
                   <p className="type-label text-label normal-case max-w-[250px] mx-auto mt-2 italic font-serif">
                     This action cannot be undone. All data for 
                     <span className="text-heading font-bold not-italic"> #{orderToDelete.orderNumber}</span> will be purged.
                   </p>
                </div>
             </div>

             <div className="space-y-6">
                {/* Restore Stock Option */}
                <button 
                  onClick={() => setShouldRestoreStock(!shouldRestoreStock)}
                  className={`w-full flex items-center gap-4 p-5 rounded-[2rem] border transition-all ${shouldRestoreStock ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700" : "bg-surface border-soft text-label"}`}
                >
                   <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${shouldRestoreStock ? "bg-emerald-500 text-white" : "border-2 border-soft"}`}>
                      {shouldRestoreStock && <CheckCircle2 size={14} />}
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-widest">Restore Stock Level</p>
                      <p className="text-[9px] opacity-60">
                        Add items back to inventory. 
                        <span className="block mt-1 text-action font-serif italic">Note: Skip this if the order used external partner stock.</span>
                      </p>
                   </div>
                   <RotateCcw className={`ml-auto opacity-40 ${shouldRestoreStock ? "animate-spin-slow" : ""}`} size={16} />
                </button>

                {/* ID Confirmation */}
                <div className="space-y-3">
                   <label className="text-[10px] font-extrabold uppercase tracking-widest text-description ml-4">
                      Type <span className="text-heading">#{orderToDelete.orderNumber}</span> to confirm
                   </label>
                   <input 
                     type="text" 
                     placeholder={`#${orderToDelete.orderNumber}`}
                     className="w-full bg-surface border border-soft rounded-2xl px-6 py-4 text-sm font-bold text-heading focus:outline-none focus:ring-1 focus:ring-red-500 transition-all text-center tracking-widest"
                     value={deleteConfirmText}
                     onChange={(e) => setDeleteConfirmText(e.target.value)}
                   />
                </div>
             </div>

             <div className="flex gap-4">
                <Button variant="ghost" fullWidth onClick={() => setOrderToDelete(null)} disabled={isDeleting}>Cancel</Button>
                <Button 
                   variant="danger" 
                   fullWidth 
                   onClick={handleDeleteOrder}
                   isLoading={isDeleting}
                   disabled={deleteConfirmText !== `#${orderToDelete.orderNumber}`}
                >
                   Delete Order
                </Button>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
