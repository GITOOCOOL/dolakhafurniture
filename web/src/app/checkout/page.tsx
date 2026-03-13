"use client";

import { useCart } from "@/store/useCart";
import Link from "next/link";
import { useState, useEffect } from "react";
import { urlFor } from "@/lib/sanity";
import { processOrder } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, Trash2, ShieldCheck } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function CheckoutPage() {
  const supabase = createClient();
  const { items, removeItem, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Check for user on mount to update button UI
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // 1. Check Auth Status
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // 2. If no user, trigger Google Auth with a redirect back to this page
      if (!currentUser) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { 
            redirectTo: `${window.location.origin}/auth/callback?next=/checkout` 
          }
        });
        if (error) throw error;
        return; // Redirecting...
      }

      // 3. If user exists, run the Sanity order action
      const result = await processOrder(items, total);
      if (result.success) {
        clearCart();
        router.push("/account?ordered=true");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || "An error occurred during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-stone-950 min-h-screen text-stone-100 selection:bg-orange-500/30">
      <div className="container mx-auto px-6">
        
        <header className="mb-16 border-b border-stone-800/50 pb-12">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white">
            Cart<span className="text-orange-600">.</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-500 mt-4 flex items-center gap-4">
            Dolakha Furniture <span className="w-12 h-[1px] bg-stone-800" /> Secure Checkout
          </p>
        </header>

        {items.length === 0 ? (
          <div className="py-24 text-center bg-stone-900/30 rounded-[3rem] border border-stone-800/50 backdrop-blur-sm">
            <ShoppingBag className="w-12 h-12 text-stone-700 mx-auto mb-6" />
            <p className="text-stone-400 italic font-serif text-2xl">
              "Your sanctuary is waiting for its first piece."
            </p>
            <Link href="/" className="inline-flex items-center gap-3 mt-10 text-[10px] font-black uppercase tracking-widest bg-white text-black px-10 py-4 rounded-full hover:bg-orange-600 hover:text-white transition-all">
              <ArrowLeft size={14} /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* ITEM LIST */}
            <div className="lg:col-span-7 space-y-12">
              {items.map((item) => (
                <div key={item._id} className="flex gap-8 pb-10 border-b border-stone-900 group">
                  <div className="w-32 h-40 bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 flex-shrink-0 relative">
                    {item.mainImage ? (
                      <img
                        src={urlFor(item.mainImage).width(300).url()}
                        alt={item.title}
                        className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-700">VOID</div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-between py-2 w-full">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-orange-500 transition-colors">
                          {item.title}
                        </h3>
                        <p className="font-black text-xl text-white">Nrs. {item.price * item.quantity}</p>
                      </div>
                      <p className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mt-2">
                        Quantity {item.quantity} <span className="mx-2 text-stone-800">/</span> Nrs. {item.price} per unit
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item._id)}
                      className="flex items-center gap-2 text-[10px] text-stone-500 font-black uppercase tracking-widest hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY PANEL */}
            <div className="lg:col-span-5">
              <div className="bg-stone-900/50 p-10 rounded-[3rem] border border-stone-800 shadow-2xl sticky top-32 backdrop-blur-xl">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-600 mb-10">Order Summary</h2>
                
                <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-center text-stone-400 font-black uppercase text-[10px] tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-white text-lg font-bold">Nrs. {total}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-400 font-black uppercase text-[10px] tracking-widest pb-8 border-b border-stone-800">
                    <span>Shipping</span>
                    <span className="text-orange-500">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-end pt-6">
                    <span className="text-stone-500 font-black uppercase text-xs tracking-widest">Grand Total</span>
                    <span className="text-5xl font-black text-white tracking-tighter">Nrs. {total}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all duration-500 flex items-center justify-center gap-3
                    ${isProcessing 
                      ? 'bg-stone-800 text-stone-600 cursor-not-allowed' 
                      : 'bg-white text-black hover:bg-orange-600 hover:text-white hover:shadow-[0_0_40px_rgba(234,88,12,0.3)] active:scale-[0.98]'
                    }`}
                >
                  {isProcessing ? (
                    "Authorizing..."
                  ) : user ? (
                    <>Complete Order <ShieldCheck size={16} /></>
                  ) : (
                    "Login to Place Order"
                  )}
                </button>
                
                <div className="mt-10 flex items-center justify-center gap-6 opacity-20 grayscale hover:opacity-50 transition-opacity">
                   <div className="h-[1px] w-8 bg-stone-500" />
                   <span className="text-[8px] font-black uppercase tracking-[0.4em]">Encrypted Checkout</span>
                   <div className="h-[1px] w-8 bg-stone-500" />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
