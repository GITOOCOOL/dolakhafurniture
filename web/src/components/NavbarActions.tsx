"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";

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
        // FIX: Forces Google to show the account chooser every time
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        }
      }
    });
  };

  if (loading) return <div className="w-20 h-8 bg-stone-100 animate-pulse rounded-full" />;

  return (
    <div className="flex items-center gap-6">
      {/* --- ACCOUNT / AUTH SECTION --- */}
      {user ? (
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-end">
            <span suppressHydrationWarning className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              Hi, {user.user_metadata.full_name?.split(" ")[0]}
            </span>
            <div className="flex gap-3">
              <Link href="/account" className="text-[9px] font-bold uppercase text-stone-400 hover:text-orange-600 transition-colors">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-[9px] font-bold uppercase text-stone-400 hover:text-stone-900 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
          {user.user_metadata.avatar_url && (
            <img 
              src={user.user_metadata.avatar_url} 
              className="w-8 h-8 rounded-full border border-stone-200" 
              alt="profile" 
            />
          )}
        </div>
      ) : (
        /* FIX: Dynamic button text for unauthenticated users */
        <button 
          onClick={handleLogin} 
          className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-900 hover:text-orange-600 transition-colors"
        >
          Login / Register
        </button>
      )}

      {/* --- ANIMATED CART SECTION --- */}
      <div className="relative"> 
        <Link href="/checkout">
          <motion.button
            key={totalQuantity} 
            initial={{ scale: 1, y: 0 }}
            animate={{ 
              scale: totalQuantity > 0 ? [1, 1.2, 1] : 1, 
              y: totalQuantity > 0 ? [0, -10, 0] : 0 
            }}
            transition={{ 
              duration: 0.4, 
              ease: [0.175, 0.885, 0.32, 1.275] 
            }}
            className={`relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg active:scale-95 transition-colors
              ${totalQuantity > 0 
                ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' 
                : 'bg-stone-900 text-white hover:bg-orange-600'}`}
          >
            <ShoppingBag size={20} strokeWidth={2.5} />
            
            {totalQuantity > 0 && (
              <motion.span 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1 -right-1 bg-white text-stone-900 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-orange-600"
              >
                {totalQuantity}
              </motion.span>
            )}
          </motion.button>
        </Link>

        <AnimatePresence>
          {totalQuantity > 0 && !isCheckoutPage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: [0, -5, 0], scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                default: { duration: 0.3 }
              }}
              className="absolute top-full right-0 mt-4 w-52 bg-white border border-stone-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5 z-50 pointer-events-auto"
            >
              <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-t border-l border-stone-100" />
              <div className="space-y-3 text-center">
                <p className="text-sm font-bold text-stone-900">Checkout Here</p>
                <Link href="/checkout">
                  <button className="w-full bg-stone-900 text-white py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors">
                    Go to Checkout →
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
