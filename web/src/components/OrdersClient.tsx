"use client";

import { Leaf, Package, PackageSearch, MessageCircle } from "lucide-react";
import { Order } from "@/types";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import { useState } from "react";
import InquiryModal from "./InquiryModal";

interface OrdersClientProps {
  orders: Order[];
}

export default function OrdersClient({ orders }: OrdersClientProps) {
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | "">("");

  const handleInquiry = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowInquiryModal(true);
  };
  return (
    <div className="max-w-6xl mx-auto text-[#3d2b1f] pt-32 pb-20">
      {/* HEADER - Editorial Serif style */}
      <header className="mb-16 border-b border-[#e5dfd3] border-dotted pb-10">
        <h1 className="text-6xl md:text-8xl font-serif italic font-medium text-[#3d2b1f] leading-none">
          My Orders<span className="text-[#a3573a]">.</span>
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <Leaf size={14} className="text-[#a3573a] opacity-60" />
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#a89f91]">
            Track your orders
          </p>
        </div>
      </header>

      {/* ORDERS LIST */}
      <div className="space-y-8">
        <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-[#a89f91] mb-6">
          Order History ({orders.length})
        </h3>

        {orders.length === 0 ? (
          <div className="bg-white/40 p-24 rounded-[4rem] border-2 border-dotted border-[#e5dfd3] text-center flex flex-col items-center gap-6">
            <PackageSearch
              size={48}
              className="text-[#e5dfd3]"
              strokeWidth={1}
            />
            <p className="text-[#a89f91] font-serif italic text-2xl">
              "Your journey begins with your first selection."
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order: Order) => (
              <div
                key={order._id}
                className="bg-white/60 backdrop-blur-sm p-10 rounded-[4rem] border border-[#e5dfd3] shadow-sm hover:border-[#a3573a]/40 transition-all duration-700 group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                  <div className="flex gap-10">
                    <div>
                      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#a89f91] mb-2">
                        Order Date
                      </p>
                      <p className="text-sm font-sans font-bold text-[#3d2b1f]">
                        {new Date(order._createdAt).toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#a89f91] mb-2">
                        Order Reference
                      </p>
                      <p className="text-sm font-sans font-bold text-[#3d2b1f]">
                        #
                        {order.orderNumber || order._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* STATUS & INQUIRY */}
                  <div className="flex flex-wrap items-center gap-4">
                    <button 
                      onClick={() => handleInquiry(order.orderNumber || order._id)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#fdfaf5] border border-[#a3573a]/20 rounded-full text-[9px] font-sans font-bold uppercase tracking-widest text-[#a3573a] hover:bg-[#a3573a] hover:text-white transition-all duration-300 shadow-sm"
                    >
                      <MessageCircle size={12} />
                      Order Inquiry
                    </button>
                    <span className="bg-[#3d2b1f] text-[#fdfaf5] px-8 py-2.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-[0.2em] shadow-md group-hover:bg-[#a3573a] transition-all duration-500">
                      {order.status || "Processing"}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {order.items?.map((item, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm border-b border-[#e5dfd3] border-dotted pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-6">
                        {/* ITEM IMAGE */}
                        <div className="w-16 h-20 bg-white rounded-2xl overflow-hidden border border-[#e5dfd3] flex-shrink-0 relative">
                          {item.image ? (
                            <Image
                              src={urlFor(item.image).width(200).url()}
                              alt={item.title}
                              fill
                              className="object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#fdfaf5] text-[8px] text-[#a89f91]">
                              NO IMG
                            </div>
                          )}
                        </div>

                        <span className="text-[#a89f91] font-serif italic text-xl">
                          <span className="text-[#3d2b1f] font-sans font-bold not-italic mr-3">
                            {item.quantity}x
                          </span>
                          {item.title}
                        </span>
                      </div>
                      <span className="font-sans font-bold text-[#3d2b1f] tracking-tight">
                        Rs. {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-10 border-t border-[#e5dfd3] border-dotted flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-[#a89f91] opacity-40" />
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91]">
                      Order Total
                    </span>
                  </div>
                  <span className="text-5xl font-sans font-bold text-[#3d2b1f] tracking-tighter">
                    Rs. {order.totalPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <InquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        initialOrderReference={selectedOrderId}
        title="Order Assistance"
        subtitle="How can we help with this specific selection?"
      />
    </div>
  );
}
