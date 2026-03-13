"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AccountClient({ user, orders, showSuccess }: any) {
  const [visible, setVisible] = useState(showSuccess);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* SUCCESS BANNER */}
      {visible && (
        <div className="mb-12 p-6 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-center animate-in fade-in slide-in-from-top-4 duration-700 shadow-[0_0_40px_rgba(234,88,12,0.4)]">
          ✨ Order Placed Successfully!
        </div>
      )}

      <header className="mb-16">
        <h1 className="text-7xl font-black uppercase tracking-tighter text-stone-900 leading-none">
          Profile<span className="text-orange-600">.</span>
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mt-4">
          Customer Portal / Handcrafted Excellence
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* LEFT: USER INFO */}
        <div className="lg:col-span-4">
          <div className="bg-white p-10 rounded-[3rem] border border-stone-200 shadow-sm sticky top-32">
            <div className="relative w-24 h-24 mb-8 rounded-full overflow-hidden border-4 border-stone-50 shadow-inner">
              <Image 
                src={user.user_metadata.avatar_url} 
                alt="profile" 
                fill 
                className="object-cover" 
              />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-stone-900 leading-none">
              {user.user_metadata.full_name}
            </h2>
            <p className="text-stone-400 text-xs font-medium mt-2 mb-8">{user.email}</p>
            
            <div className="pt-8 border-t border-stone-100">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-stone-300">
                <span>Status</span>
                <span className="text-orange-600">Premium Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: ORDERS */}
        <div className="lg:col-span-8 space-y-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400 mb-4 ml-2">
            Order History ({orders.length})
          </h3>

          {orders.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-stone-100 text-center">
              <p className="text-stone-300 font-serif italic text-2xl">
                "Your sanctuary awaits its first pillar."
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => (
                <div key={order._id} className="bg-white p-10 rounded-[3rem] border border-stone-200 shadow-sm hover:border-orange-500/50 transition-all duration-500 group">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-stone-300 mb-1">Created At</p>
                      <p className="text-xs font-bold text-stone-900">
                        {new Date(order._createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <span className="bg-stone-900 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg group-hover:bg-orange-600 transition-colors">
                      {order.status || 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-5">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm border-b border-stone-50 pb-4 last:border-0 last:pb-0">
                        <span className="text-stone-500 font-medium italic">
                          <span className="text-stone-900 font-black not-italic mr-2">{item.quantity}x</span> 
                          {item.title}
                        </span>
                        <span className="font-black text-stone-900">Nrs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-stone-100 flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total Investment</span>
                    <span className="text-3xl font-black text-stone-900">
                      Nrs. {order.totalPrice}
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
