"use client";

import { useCart } from "@/store/useCart";
import Link from "next/link";
import { useState, useEffect } from "react";
import { urlFor } from "@/lib/sanity";
import { processOrder } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, Trash2, ShieldCheck, Leaf } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function CheckoutPage() {
  const supabase = createClient();
  const { items, removeItem, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { 
            redirectTo: `${window.location.origin}/auth/callback?next=/checkout` 
          }
        });
        if (error) throw error;
        return;
      }

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
    <div className="pt-32 pb-20 bg-[#fdfaf5] min-h-screen text-[#3d2b1f] selection:bg-[#a3573a]/20">
      <div className="container mx-auto px-6">
        
        {/* HEADER */}
        <header className="mb-16 border-b border-[#e5dfd3] border-dotted pb-12">
          <h1 className="text-6xl md:text-8xl font-serif italic font-medium text-[#3d2b1f]">
            Your Cart<span className="text-[#a3573a]">.</span>
          </h1>
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#a89f91] mt-4 flex items-center gap-4">
            Dolakha Furniture <Leaf size={12} className="text-[#a3573a]" /> Secure home Checkout
          </p>
        </header>

        {items.length === 0 ? (
          <div className="py-24 text-center bg-white/50 rounded-[4rem] border border-[#e5dfd3] border-dotted backdrop-blur-sm">
            <ShoppingBag className="w-12 h-12 text-[#e5dfd3] mx-auto mb-6" />
            <p className="text-[#a89f91] italic font-serif text-2xl">
              "Beautiful Pieces to be explored."
            </p>
            <Link href="/shop" className="inline-flex items-center gap-3 mt-10 text-[11px] font-sans font-bold uppercase tracking-widest bg-[#3d2b1f] text-[#fdfaf5] px-10 py-5 rounded-full hover:bg-[#a3573a] transition-all">
              <ArrowLeft size={14} /> Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* ITEM LIST */}
            <div className="lg:col-span-7 space-y-12">
              {items.map((item) => (
                <div key={item._id} className="flex gap-8 pb-10 border-b border-[#e5dfd3] border-dotted group">
                  <div className="w-32 h-40 bg-white rounded-[2rem] overflow-hidden border border-[#e5dfd3] flex-shrink-0 relative shadow-sm">
                    {item.mainImage ? (
                      <img
                        src={urlFor(item.mainImage).width(300).url()}
                        alt={item.title}
                        className="object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-sans text-[#a89f91]">VOID</div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-between py-2 w-full">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-3xl font-serif italic font-medium text-[#3d2b1f] group-hover:text-[#a3573a] transition-colors">
                          {item.title}
                        </h3>
                        {/* ITEM TOTAL PRICE: Sans Font */}
                        <p className="font-sans font-bold text-xl text-[#3d2b1f]">Rs. {item.price * item.quantity}</p>
                      </div>
                      {/* QTY & UNIT PRICE: Sans Font */}
                      <p className="text-[10px] font-sans font-bold text-[#a89f91] uppercase tracking-[0.2em] mt-2">
                        Quantity {item.quantity} <span className="mx-2 text-[#e5dfd3]">/</span> Rs. {item.price} per unit
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item._id)}
                      className="flex items-center gap-2 text-[10px] font-sans font-bold text-[#a89f91] uppercase tracking-widest hover:text-[#a3573a] transition-colors"
                    >
                      <Trash2 size={12} /> Remove Piece
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY PANEL */}
            <div className="lg:col-span-5">
              <div className="bg-white/60 p-10 rounded-[4rem] border border-[#e5dfd3] shadow-sm sticky top-32 backdrop-blur-xl">
                <h2 className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-[#a89f91] mb-10">Order Summary</h2>
                
                <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-center text-[#a89f91] font-sans font-bold uppercase text-[10px] tracking-widest">
                    <span>Subtotal</span>
                    {/* SUB TOTAL: Sans Font */}
                    <span className="text-[#3d2b1f] text-lg font-sans font-bold">Rs. {total}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#a89f91] font-sans font-bold uppercase text-[10px] tracking-widest pb-8 border-b border-[#e5dfd3] border-dotted">
                    <span>Shipping</span>
                    <span className="text-[#a3573a] italic font-serif text-[11px] text-right">Free inside ring road Kathmandu</span>
                  </div>
                  <div className="flex justify-between items-end pt-6">
                    <span className="text-[#a89f91] font-sans font-bold uppercase text-xs tracking-widest">Grand Total</span>
                    {/* GRAND TOTAL: Sans Font */}
                    <span className="text-5xl font-sans font-bold text-[#3d2b1f] tracking-tighter">Rs. {total}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full py-6 rounded-3xl font-sans font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-500 flex items-center justify-center gap-3 shadow-lg
                    ${isProcessing 
                      ? 'bg-[#e5dfd3] text-[#a89f91] cursor-not-allowed' 
                      : 'bg-[#3d2b1f] text-[#fdfaf5] hover:bg-[#a3573a] hover:shadow-[0_20px_40px_rgba(163,87,58,0.2)]'
                    }`}
                >
                  {isProcessing ? "Authorizing..." : user ? (
                    <>Place Order <ShieldCheck size={16} /></>
                  ) : "Login to Finalize"}
                </button>
                
                <div className="mt-10 flex items-center justify-center gap-6 opacity-40">
                   <div className="h-[1px] w-8 bg-[#e5dfd3]" />
                   <span className="text-[8px] font-sans font-bold uppercase tracking-[0.4em] text-[#a89f91]">Secure  Checkout</span>
                   <div className="h-[1px] w-8 bg-[#e5dfd3]" />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
