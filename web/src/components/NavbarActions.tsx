"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Leaf, User, Search } from "lucide-react";
import AuthForm from "./AuthForm";

interface NavbarActionsProps {
  onSearchClick: () => void;
}

export default function NavbarActions({ onSearchClick }: NavbarActionsProps) {
  const supabase = createClient();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

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


  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0][0].toUpperCase();
  };

  if (loading) return <div className="w-20 h-8 bg-[#fdfaf5] animate-pulse rounded-full border border-[#e5dfd3]" />;

  return (
    <div className="flex items-center gap-6 md:gap-4 relative z-50 flex-shrink-0">
      {/* Search Toggle Button - Grouped with Actions */}
      <button
        type="button"
        onPointerDown={() => onSearchClick()}
        onClick={() => onSearchClick()}
        className="w-[38px] h-[38px] flex items-center justify-center text-[#3d2b1f] bg-[#f8f5ee] shadow-sm hover:bg-[#eee9df] rounded-full transition-all cursor-pointer flex-shrink-0"
        aria-label="Search"
      >
        <Search size={22} className="md:w-7 md:h-7" strokeWidth={1.2} />
      </button>

      {/* --- ANIMATED CART SECTION --- */}
      <div className="relative flex-shrink-0">
        <Link href="/checkout">
          <motion.button
            key={totalQuantity}
            type="button"
            initial={{ scale: 1 }}
            animate={{
              scale: totalQuantity > 0 ? [1, 1.15, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
            className={`relative flex items-center justify-center w-[38px] h-[38px] bg-[#f8f5ee] shadow-sm hover:bg-[#eee9df] transition-all cursor-pointer touch-manipulation flex-shrink-0 rounded-full
              ${totalQuantity > 0
                ? 'text-[#a3573a]'
                : 'text-[#3d2b1f]'}`}
          >
            <div className="flex items-center gap-1">
              <ShoppingBag size={22} className="md:w-7 md:h-7" strokeWidth={1.2} />
              {/* <span className="text-[10px] font-medium hidden md:block">Cart</span> */}
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
                  <button className="w-full bg-[#3d2b1f] text-[#fdfaf5] py-3 rounded-none text-[9px] font-bold uppercase tracking-widest hover:bg-[#a3573a] transition-all">
                    checkout here →
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* --- ACCOUNT / AUTH SECTION --- */}
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setIsAccountModalOpen(true)}
          className="w-[38px] h-[38px] flex items-center justify-center bg-[#f8f5ee] shadow-sm hover:bg-[#eee9df] rounded-full transition-all text-[#3d2b1f] cursor-pointer touch-manipulation group flex-shrink-0"
        >
          {user ? (
            user.user_metadata.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                className="w-[26px] h-[26px] md:w-8 md:h-8 rounded-full border border-[#e5dfd3] shadow-sm group-hover:border-[#a3573a] transition-all object-cover flex-shrink-0"
                alt="profile"
              />
            ) : (
              <div className="w-[26px] h-[26px] md:w-8 md:h-8 rounded-full bg-[#3d2b1f] text-[#fdfaf5] flex items-center justify-center text-[9px] md:text-[10px] font-bold tracking-tighter border border-[#e5dfd3] shadow-sm group-hover:bg-[#a3573a] transition-all flex-shrink-0">
                {getInitials(user.user_metadata.full_name)}
              </div>
            )
          ) : (
            <div className="flex items-center gap-1 flex-shrink-0">
              <User size={22} className="md:w-7 md:h-7 flex-shrink-0" strokeWidth={1.2} />
            </div>
          )}
        </button>

        {/* --- ACCOUNT SLIDE-OUT DRAWER --- */}
        <AnimatePresence>
          {isAccountModalOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-[#3d2b1f]/20 backdrop-blur-sm z-[200]"
                onClick={() => setIsAccountModalOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#fdfaf5] z-[210] shadow-2xl flex flex-col pt-safe-top rounded-none"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#e5dfd3]">
                  <h2 className="text-2xl font-serif italic text-[#3d2b1f]">
                    {user ? "My Account" : "Welcome"}
                  </h2>
                  <button
                    onClick={() => setIsAccountModalOpen(false)}
                    className="p-2 -mr-2 text-[#3d2b1f] hover:bg-[#e5dfd3]/50 rounded-none transition-colors"
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  {user ? (
                    <div className="flex flex-col gap-8 h-full">
                      <div className="flex items-center gap-4">
                        {user.user_metadata.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            className="w-16 h-16 rounded-full border border-[#e5dfd3] shadow-sm object-cover"
                            alt="profile"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[#3d2b1f] text-[#fdfaf5] flex items-center justify-center text-xl font-bold tracking-tighter border border-[#e5dfd3] shadow-sm">
                            {getInitials(user.user_metadata.full_name)}
                          </div>
                        )}
                        <div>
                          <p className="text-lg font-medium text-[#3d2b1f] mb-1">
                            Hi, {user.user_metadata.full_name?.split(" ")[0] || "User"}
                          </p>
                          <p className="text-sm text-[#a89f91]">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link
                          href="/account"
                          onClick={() => setIsAccountModalOpen(false)}
                          className="flex items-center justify-between p-4 bg-white border border-[#e5dfd3] rounded-xl hover:border-[#a3573a] hover:shadow-sm transition-all group"
                        >
                          <span className="font-medium text-[#3d2b1f]">Profile Settings</span>
                          <span className="text-[#a89f91] group-hover:text-[#a3573a] transition-colors">→</span>
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setIsAccountModalOpen(false)}
                          className="flex items-center justify-between p-4 bg-white border border-[#e5dfd3] rounded-xl hover:border-[#a3573a] hover:shadow-sm transition-all group"
                        >
                          <span className="font-medium text-[#3d2b1f]">Order History</span>
                          <span className="text-[#a89f91] group-hover:text-[#a3573a] transition-colors">→</span>
                        </Link>
                      </div>

                      <div className="mt-auto pb-8">
                        <button
                          onClick={() => {
                            setIsAccountModalOpen(false);
                            handleLogout();
                          }}
                          className="w-full py-4 text-sm font-bold tracking-widest uppercase text-[#3d2b1f] border border-[#3d2b1f] rounded-none hover:bg-[#3d2b1f] hover:text-[#fdfaf5] transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-8 h-full text-center py-4">
                      <div className="mx-auto w-12 h-12 rounded-none bg-[#fdfaf5] border border-[#e5dfd3] flex items-center justify-center text-[#a3573a] shadow-sm">
                        <Leaf size={20} strokeWidth={1.5} />
                      </div>

                      <AuthForm
                        onSuccess={() => setIsAccountModalOpen(false)}
                        showRewardBanner={true}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>


    </div>
  );
}
