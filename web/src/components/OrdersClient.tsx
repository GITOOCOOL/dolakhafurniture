"use client";

import { Leaf, Package, PackageSearch, MessageCircle } from "lucide-react";
import { Order } from "@/types";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
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
    <div className="max-w-6xl mx-auto text-heading pt-32 pb-20 relative">
      {/* TOP LEFT: Back to home */}
      <div className="absolute top-12 left-0 md:left-4">
        <Link 
          href="/" 
          className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-heading hover:text-action transition-all flex items-center gap-2"
        >
          <span className="text-sm">←</span> Back to home
        </Link>
      </div>

      {/* HEADER SECTION - Compact Standard Design */}
      <header className="mb-12 text-left border-b border-soft pb-6">
        <p className="type-label text-action mb-4">
          Archive History
        </p>
        <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-heading leading-tight">
          Orders / मेरो अर्डर<span className="text-action">.</span>
        </h1>
      </header>

      {/* ORDERS LIST */}
      <div className="space-y-8">
        <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-label mb-6">
          Order History ({orders.length})
        </h3>

        {orders.length === 0 ? (
          <div className="bg-app p-24 rounded-[4rem] border-2 border-dotted border-soft text-center flex flex-col items-center gap-6">
            <PackageSearch
              size={48}
              className="text-label"
              strokeWidth={1}
            />
            <p className="text-label font-serif italic text-2xl">
              "Your journey begins with your first selection."
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order: Order) => (
              <div
                key={order._id}
                className="bg-app  p-10 rounded-[4rem] border border-soft shadow-sm hover:border-action/40 transition-all duration-700 group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                  <div className="flex gap-10">
                    <div>
                      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-2">
                        Order Date
                      </p>
                      <p className="text-sm font-sans font-bold text-heading">
                        {new Date(order._createdAt).toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-label mb-2">
                        Order Reference
                      </p>
                      <p className="text-sm font-sans font-bold text-heading">
                        #
                        {order.orderNumber || order._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* STATUS & INQUIRY */}
                  <div className="flex flex-wrap items-center gap-4">
                    <button 
                      onClick={() => handleInquiry(order.orderNumber || order._id)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-app border border-action/20 rounded-full text-[9px] font-sans font-bold uppercase tracking-widest text-action hover:bg-action hover:text-white transition-all duration-300 shadow-sm"
                    >
                      <MessageCircle size={12} />
                      Order Inquiry
                    </button>
                    <span className="bg-espresso text-bone px-8 py-2.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-[0.2em] shadow-md group-hover:bg-action transition-all duration-500">
                      {order.status || "Processing"}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {order.items?.map((item, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm border-b border-soft border-dotted pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-6">
                        {/* ITEM IMAGE */}
                        <div className="w-16 h-20 bg-app rounded-2xl overflow-hidden border border-soft flex-shrink-0 relative">
                          {item.image ? (
                            <Image
                              src={urlFor(item.image).width(200).url()}
                              alt={item.title}
                              fill
                              className="object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-app text-[8px] text-label">
                              NO IMG
                            </div>
                          )}
                        </div>

                        <span className="text-label font-serif italic text-xl">
                          <span className="text-heading font-sans font-bold not-italic mr-3">
                            {item.quantity}x
                          </span>
                          {item.title}
                        </span>
                      </div>
                      <span className="font-sans font-bold text-heading tracking-tight">
                        Rs. {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-10 border-t border-soft border-dotted flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-label opacity-40" />
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-label">
                      Order Total
                    </span>
                  </div>
                  <span className="text-5xl font-sans font-bold text-heading tracking-tighter">
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
