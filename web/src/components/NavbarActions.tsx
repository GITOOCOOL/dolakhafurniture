"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Leaf } from "lucide-react";

export default function NavbarActions() {
  const supabase = createClient();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const items = useCart((state) => state.items);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const isCheckoutPage = pathname === "/checkout";

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    useCart.getState().clearCart();
    window.location.href = "/";
  };

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        }
      }
    });
  };

  if (loading) return <div className="w-20 h-8 bg-[#fdfaf5] animate-pulse rounded-full border border-[#e5dfd3]" />;

  return (
    <div className="flex items-center gap-6">
      {/* --- ACCOUNT / AUTH SECTION --- */}
      {user ? (
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span suppressHydrationWarning className="text-[10px] font-serif italic font-bold text-[#a3573a]">
              Hi, {user.user_metadata.full_name?.split(" ")[0]}
            </span>
            <div className="flex gap-3">
              <Link href="/account" className="text-[9px] font-bold uppercase tracking-widest text-[#a89f91] hover:text-[#a3573a] transition-colors">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-[9px] font-bold uppercase tracking-widest text-[#a89f91] hover:text-[#3d2b1f] transition-colors">
                Exit
              </button>
            </div>
          </div>
          {user.user_metadata.avatar_url && (
            <img 
              src={user.user_metadata.avatar_url} 
              className="w-8 h-8 rounded-full border border-[#e5dfd3] shadow-sm" 
              alt="profile" 
            />
          )}
        </div>
      ) : (
        <button 
          onClick={handleLogin} 
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3d2b1f] hover:text-[#a3573a] transition-colors"
        >
          Login
        </button>
      )}

      {/* --- ANIMATED CART SECTION --- */}
      <div className="relative"> 
        <Link href="/checkout">
          <motion.button
            key={totalQuantity} 
            initial={{ scale: 1 }}
            animate={{ 
              scale: totalQuantity > 0 ? [1, 1.15, 1] : 1, 
            }}
            transition={{ duration: 0.4 }}
            className={`relative flex items-center justify-center w-11 h-11 rounded-full shadow-md active:scale-95 transition-all
              ${totalQuantity > 0 
                ? 'bg-[#a3573a] text-white shadow-[0_10px_20px_rgba(163,87,58,0.3)]' 
                : 'bg-[#3d2b1f] text-[#fdfaf5] hover:bg-[#a3573a]'}`}
          >
            <ShoppingBag size={18} strokeWidth={2} />
            
            {totalQuantity > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-[#fdfaf5] text-[#3d2b1f] text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-[#a3573a]"
              >
                {totalQuantity}
              </motion.span>
            )}
          </motion.button>
        </Link>

        {/* Floating Tooltip: Softer, Boho styling */}
        <AnimatePresence>
          {totalQuantity > 0 && !isCheckoutPage && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full right-0 mt-4 w-56 bg-white border border-[#e5dfd3] rounded-[2.5rem] shadow-[0_20px_50px_rgba(61,43,31,0.12)] p-6 z-50 pointer-events-auto"
            >
              <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-t border-l border-[#e5dfd3]" />
              <div className="space-y-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Leaf size={14} className="text-[#a3573a] opacity-60" />
                  <p className="text-sm font-serif italic text-[#3d2b1f]">Ready to finalize?</p>
                </div>
                <Link href="/checkout">
                  <button className="w-full bg-[#3d2b1f] text-[#fdfaf5] py-3 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-[#a3573a] transition-all">
                    checkout here →
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
