"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Leaf } from "lucide-react"; // Small boho accent

export default function AccountClient({ user, orders, showSuccess }: any) {
  const [visible, setVisible] = useState(showSuccess);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="max-w-6xl mx-auto text-[#3d2b1f]">
      {/* SUCCESS BANNER - Swapped to Terracotta and Boho Radius */}
      {visible && (
        <div className="mb-12 p-8 bg-[#a3573a] text-[#fdfaf5] rounded-[3rem] font-sans font-bold uppercase tracking-[0.3em] text-center animate-in fade-in slide-in-from-top-4 duration-1000 shadow-xl">
          ✨ Your  order is being prepared
        </div>
      )}

      {/* HEADER - Editorial Serif style */}
      <header className="mb-16 border-b border-[#e5dfd3] border-dotted pb-10">
        <h1 className="text-6xl md:text-8xl font-serif italic font-medium text-[#3d2b1f] leading-none">
          My Profile<span className="text-[#a3573a]">.</span>
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <Leaf size={14} className="text-[#a3573a] opacity-60" />
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#a89f91]">
            Curated Member / Handcrafted Excellence
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* LEFT: USER INFO - Softer cards */}
        <div className="lg:col-span-4">
          <div className="bg-white/60 backdrop-blur-md p-10 rounded-[4rem] border border-[#e5dfd3] shadow-sm sticky top-32">
            <div className="relative w-24 h-24 mb-8 rounded-full overflow-hidden border-4 border-[#fdfaf5] shadow-sm">
              <Image 
                src={user.user_metadata.avatar_url} 
                alt="profile" 
                fill 
                className="object-cover" 
              />
            </div>
            {/* NAME: Using Serif for prestige */}
            <h2 className="text-3xl font-serif italic font-medium text-[#3d2b1f] leading-none">
              {user.user_metadata.full_name}
            </h2>
            {/* EMAIL: Stays Sans for clarity */}
            <p className="text-[#a89f91] text-xs font-sans font-medium mt-3 mb-8">{user.email}</p>
            
            <div className="pt-8 border-t border-[#e5dfd3] border-dotted">
              <div className="flex justify-between items-center text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91]">
                <span>Member Tier</span>
                <span className="text-[#a3573a]">Premium </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: ORDERS - List of artisanal items */}
        <div className="lg:col-span-8 space-y-8">
          <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-[#a89f91] mb-4 ml-2">
            Order History ({orders.length})
          </h3>

          {orders.length === 0 ? (
            <div className="bg-white/40 p-20 rounded-[4rem] border-2 border-dotted border-[#e5dfd3] text-center">
              <p className="text-[#a89f91] font-serif italic text-2xl">
                "Your home awaits its first pillar."
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order: any) => (
                <div key={order._id} className="bg-white/60 backdrop-blur-sm p-10 rounded-[4rem] border border-[#e5dfd3] shadow-sm hover:border-[#a3573a]/40 transition-all duration-700 group">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#a89f91] mb-2">Order Date</p>
                      {/* DATE: Stays Sans for readability */}
                      <p className="text-sm font-sans font-bold text-[#3d2b1f]">
                        {new Date(order._createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    {/* STATUS: Terracotta button */}
                    <span className="bg-[#3d2b1f] text-[#fdfaf5] px-6 py-2 rounded-full text-[9px] font-sans font-bold uppercase tracking-widest shadow-md group-hover:bg-[#a3573a] transition-colors">
                      {order.status || 'Processing'}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm border-b border-[#e5dfd3] border-dotted pb-5 last:border-0 last:pb-0">
                        <span className="text-[#a89f91] font-serif italic text-lg">
                          <span className="text-[#3d2b1f] font-sans font-bold not-italic mr-2">{item.quantity}x</span> 
                          {item.title}
                        </span>
                        {/* ITEM PRICE: Clean Sans-Serif */}
                        <span className="font-sans font-bold text-[#3d2b1f]">Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-[#e5dfd3] border-dotted flex justify-between items-end">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91]">Total Investment</span>
                    {/* TOTAL: Big, Bold, Clean Sans-Serif */}
                    <span className="text-4xl font-sans font-bold text-[#3d2b1f] tracking-tighter">
                      Rs. {order.totalPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
