"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Leaf, User } from "lucide-react";

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
        <div className="flex items-center gap-4 group/account relative cursor-pointer">
          <Link href="/account">
            {user.user_metadata.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                className="w-10 h-10 rounded-full border border-[#e5dfd3] shadow-sm hover:border-[#a3573a] transition-all cursor-pointer" 
                alt="profile" 
              />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#e5dfd3]/50 text-[#3d2b1f] transition-all cursor-pointer">
                <User size={20} strokeWidth={2} />
              </div>
            )}
          </Link>

          {/* Account Dropdown */}
          <div className="absolute top-full right-0 pt-2 w-48 opacity-0 pointer-events-none group-hover/account:opacity-100 group-hover/account:pointer-events-auto transition-all z-50">
            <div className="bg-white border border-[#e5dfd3] rounded-2xl shadow-lg p-4">
              <span suppressHydrationWarning className="block text-xs font-serif italic font-bold text-[#a3573a] w-full border-b border-[#e5dfd3] pb-2 mb-2">
                Hi, {user.user_metadata.full_name?.split(" ")[0]}
              </span>
              <div className="flex flex-col gap-2">
                <Link href="/account" className="text-xs font-medium text-[#3d2b1f] hover:text-[#a3573a] transition-colors">
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-xs font-medium text-left text-[#3d2b1f] hover:text-[#a3573a] transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={handleLogin} 
          className="flex flex-col items-center gap-1 text-[#3d2b1f] hover:text-[#a3573a] transition-colors"
        >
          <User size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium hidden md:block">Sign in</span>
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
            className={`relative flex items-center justify-center p-2 rounded-full hover:bg-[#e5dfd3]/50 transition-all
              ${totalQuantity > 0 
                ? 'text-[#a3573a]' 
                : 'text-[#3d2b1f]'}`}
          >
            <div className="flex flex-col items-center gap-1">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="text-[10px] font-medium hidden md:block">Cart</span>
            </div>
            
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
