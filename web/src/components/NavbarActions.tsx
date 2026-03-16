"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Leaf, User, Search } from "lucide-react";

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
    <div className="flex items-center gap-1 md:gap-4 relative z-50">
      {/* Search Toggle Button - Grouped with Actions */}
      <button
        type="button"
        onPointerDown={() => onSearchClick()}
        onClick={() => onSearchClick()}
        className="p-2.5 text-[#3d2b1f] hover:bg-[#e5dfd3]/30 rounded-full transition-colors cursor-pointer"
        aria-label="Search"
      >
        <Search size={28} strokeWidth={1.5} />
      </button>

      {/* --- ANIMATED CART SECTION --- */}
      <div className="relative">
        <Link href="/checkout">
          <motion.button
            key={totalQuantity}
            type="button"
            initial={{ scale: 1 }}
            animate={{
              scale: totalQuantity > 0 ? [1, 1.15, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
            className={`relative flex items-center justify-center p-2.5 rounded-none hover:bg-[#e5dfd3]/50 transition-all cursor-pointer touch-manipulation
              ${totalQuantity > 0
                ? 'text-[#a3573a]'
                : 'text-[#3d2b1f]'}`}
          >
            <div className="flex items-center gap-1">
              <ShoppingBag size={28} strokeWidth={1.5} />
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
      <div className="relative">
        {user ? (
          <button
            type="button"
            onClick={() => setIsAccountModalOpen(true)}
            className="flex items-center justify-center p-2.5 rounded-full hover:bg-[#e5dfd3]/50 transition-all text-[#3d2b1f] cursor-pointer touch-manipulation"
          >
            {user.user_metadata.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                className="w-10 h-10 -m-2.5 rounded-none border border-[#e5dfd3] shadow-sm hover:border-[#a3573a] transition-all"
                alt="profile"
              />
            ) : (
              <User size={28} strokeWidth={1.5} />
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsAccountModalOpen(true)}
            className="flex items-center justify-center p-2.5 rounded-full hover:bg-[#e5dfd3]/50 transition-all text-[#3d2b1f] cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-1">
              <User size={28} strokeWidth={1.5} />
              <span className="text-[10px] font-medium hidden md:block"></span>
            </div>
          </button>
        )}

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
                            className="w-16 h-16 rounded-full border border-[#e5dfd3] shadow-sm"
                            alt="profile"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[#e5dfd3]/50 flex items-center justify-center text-[#3d2b1f]">
                            <User size={32} strokeWidth={1.5} />
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
                    <div className="flex flex-col gap-8 justify-center h-full text-center">
                      <div className="mx-auto w-16 h-16 rounded-none bg-[#fdfaf5] border border-[#e5dfd3] flex items-center justify-center text-[#a3573a] shadow-sm">
                        <Leaf size={24} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-serif italic text-[#3d2b1f] mb-2">Join our Community</h3>
                        <p className="text-[#a89f91] text-sm leading-relaxed max-w-xs mx-auto">
                          Sign in to access your orders, save items to your wishlist, and check out faster.
                        </p>
                      </div>

                      <button
                        onClick={handleLogin}
                        className="w-full bg-[#3d2b1f] text-[#fdfaf5] py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#a3573a] transition-all shadow-md mt-4 flex items-center justify-center gap-3"
                      >
                        <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                          <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                        Continue with Google
                      </button>
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
