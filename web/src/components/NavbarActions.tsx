"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Leaf, User, Search, ArrowRight, ArrowUp, Sun, Moon, X, LayoutDashboard } from "lucide-react";
import AuthForm from "./AuthForm";
import CheckoutDrawer from "./CheckoutDrawer";
import { ThemeToggle } from "./ThemeToggle";
import { useRouter, useSearchParams } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";
import Modal from "./ui/Modal";

interface NavbarActionsProps {
  onSearchClick: () => void;
}

export default function NavbarActions({ onSearchClick }: NavbarActionsProps) {
  const supabase = createClient();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const { 
    isCheckoutDrawerOpen, 
    setIsCheckoutDrawerOpen,
    isAccountModalOpen,
    setIsAccountModalOpen
  } = useUIStore();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (totalQuantity > 0) {
      setShowCheckoutPopup(true);
      
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
      
      popupTimerRef.current = setTimeout(() => {
        setShowCheckoutPopup(false);
      }, 5000);
    } else {
      setShowCheckoutPopup(false);
    }

    return () => {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    }
  }, [totalQuantity]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
        
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          setRole(profile?.role || "user");
        } else {
          setRole(null);
        }
      } catch (err) {
        console.warn("Auth check deferred (Lock busy):", err);
        // Fallback to null user if locked, onAuthStateChange will catch it eventually
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      try {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", currentUser.id)
            .single();
          setRole(profile?.role || "user");
        } else {
          setRole(null);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Deep linking to checkout
  useEffect(() => {
    if (searchParams.get("checkout") === "true") {
      setIsCheckoutDrawerOpen(true);
      // Clean up the URL without a full page refresh
      router.replace(pathname);
    }
  }, [searchParams, pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    useCart.getState().clearCart();
    window.location.href = "/";
  };

  const { lockScroll, unlockScroll, setCampaignModalOpen } = useUIStore();

  // Prevent background scroll when account modal is open
  useEffect(() => {
    if (isAccountModalOpen) lockScroll('account-drawer');
    else unlockScroll('account-drawer');
    return () => unlockScroll('account-drawer');
  }, [isAccountModalOpen, lockScroll, unlockScroll]);


  const getInitials = (userName?: string, userEmail?: string) => {
    if (!userName && !userEmail) return "U";
    
    // 1. Try full name
    if (userName) {
      const parts = userName.split(" ").filter(p => p.length > 0);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      if (parts.length === 1) return parts[0][0].toUpperCase();
    }

    // 2. Fallback to Email prefix
    if (userEmail) {
      const emailPrefix = userEmail.split("@")[0];
      if (emailPrefix.length >= 2) return emailPrefix.substring(0, 2).toUpperCase();
      return emailPrefix[0].toUpperCase();
    }

    return "U";
  };


  return (
    <div className="flex items-center gap-6 md:gap-4 relative z-50 flex-shrink-0">
      {/* Search Toggle Button - Grouped with Actions - Commented out for minimalism */}
      {/* 
      <button
        type="button"
        onPointerDown={() => onSearchClick()}
        onClick={() => onSearchClick()}
        className="w-[38px] h-[38px] flex items-center justify-center text-heading bg-clay shadow-sm hover:bg-stone-muted/30 rounded-full transition-all cursor-pointer flex-shrink-0"
        aria-label="Search"
      >
        <Search size={22} className="md:w-7 md:h-7" strokeWidth={1.2} />
      </button>
      */}

      {/* Theme Switcher */}
      <ThemeToggle />

      {/* --- ANIMATED CART SECTION --- */}
      <div className="relative flex-shrink-0">
        <motion.button
          key={totalQuantity}
          type="button"
          onClick={() => setIsCheckoutDrawerOpen(true)}
          initial={{ scale: 1 }}
          animate={totalQuantity > 0 ? {
            rotate: [0, -15, 15, -15, 15, 0],
          } : {}}
          transition={{
            rotate: {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className={`relative flex items-center justify-center w-[38px] h-[38px] shadow-sm transition-all cursor-pointer touch-manipulation flex-shrink-0 rounded-full
            ${totalQuantity > 0
              ? 'bg-app-invert text-action-success shadow-[0_0_15px_rgba(74,222,128,0.3)]'
               : 'bg-clay text-heading hover:bg-stone-muted/30 shadow-sm'}`}
        >
          <div className="flex items-center gap-1">
            <ShoppingBag size={22} className="md:w-7 md:h-7" strokeWidth={1.2} />
          </div>

          {totalQuantity > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-action-success text-app-invert text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-app-invert"
            >
              {totalQuantity}
            </motion.span>
          )}
        </motion.button>

        {/* 5-Second Checkout Prompt */}
        <AnimatePresence>
          {showCheckoutPopup && totalQuantity > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-full right-0 mt-4 z-[100] whitespace-nowrap"
            >
              <div className="bg-app-invert text-action-success px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-2xl flex items-center gap-2 border border-action-success/20">
                <span>Checkout here</span>
                <ArrowUp size={12} className="animate-bounce" />
              </div>
              {/* Tooltip Arrow */}
              <div className="absolute -top-1 right-4 w-2 h-2 bg-app-invert rotate-45 border-t border-l border-action-success/20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- ACCOUNT / AUTH SECTION --- */}
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setIsAccountModalOpen(true)}
           className="w-[38px] h-[38px] flex items-center justify-center bg-clay shadow-sm hover:bg-stone-muted/30 rounded-full transition-all text-heading cursor-pointer touch-manipulation group flex-shrink-0"
        >
          {loading ? (
            <div className="w-[26px] h-[26px] md:w-8 md:h-8 rounded-full border border-divider animate-pulse bg-soft" />
          ) : user ? (
            user.user_metadata?.avatar_url && !avatarError ? (
              <img
                src={user.user_metadata.avatar_url}
                onError={() => {
                  setAvatarError(true);
                  console.log("Google's icon couldn't be fetched, showing the initials of the account instead.");
                }}
                className="w-[26px] h-[26px] md:w-8 md:h-8 rounded-full border border-divider shadow-sm group-hover:border-action transition-all object-cover flex-shrink-0"
                alt="profile"
              />
            ) : (
              <div className="w-[26px] h-[26px] md:w-8 md:h-8 rounded-full bg-espresso text-bone flex items-center justify-center text-[9px] md:text-[10px] font-bold tracking-tighter border border-divider shadow-sm group-hover:bg-action transition-all flex-shrink-0 uppercase">
                {getInitials(user.user_metadata?.full_name, user.email)}
              </div>
            )
          ) : (
            <div className="flex items-center gap-1 flex-shrink-0">
              <User size={22} className="md:w-7 md:h-7 flex-shrink-0" strokeWidth={1.2} />
            </div>
          )}
        </button>

        <Modal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          position="right"
          title={user ? "My Account" : "Welcome"}
        >
          <div className="w-full h-full flex flex-col">
            {user ? (
              <div className="flex flex-col gap-8 h-full">
                <div className="flex items-center gap-4">
                  {user.user_metadata.avatar_url && !avatarError ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      onError={() => {
                        setAvatarError(true);
                        console.log("Google's icon couldn't be fetched, showing the initials of the account instead.");
                      }}
                      className="w-16 h-16 rounded-full border border-soft/20 shadow-sm object-cover"
                      alt="profile"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-espresso text-bone flex items-center justify-center text-xl font-bold tracking-tighter border border-soft/20 shadow-sm uppercase">
                      {getInitials(user.user_metadata.full_name, user.email)}
                    </div>
                  )}
                  <div>
                    <p className="type-product text-heading mb-1">
                      Hi, {user.user_metadata.full_name?.split(" ")[0] || "User"}
                    </p>
                      <p className="type-label text-description lowercase">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {(role === "admin" || role === "staff") && (
                    <Link
                      href="/admin"
                      onClick={() => setIsAccountModalOpen(false)}
                      className="flex items-center justify-between p-5 bg-action-success/5 border border-action-success/20 rounded-2xl hover:border-action-success transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <LayoutDashboard size={18} className="text-action-success" />
                        <span className="type-product text-action-success italic">Admin Dashboard</span>
                      </div>
                      <span className="text-action-success group-hover:translate-x-1 transition-all">→</span>
                    </Link>
                  )}
                  <Link
                    href="/account"
                    onClick={() => setIsAccountModalOpen(false)}
                    className="flex items-center justify-between p-5 bg-surface border border-soft/20 rounded-2xl hover:border-action transition-all group"
                  >
                    <span className="type-product text-heading">Account Settings</span>
                    <span className="text-description group-hover:text-action transition-colors">→</span>
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setIsAccountModalOpen(false)}
                    className="flex items-center justify-between p-5 bg-surface border border-soft/20 rounded-2xl hover:border-action transition-all group"
                  >
                    <span className="type-product text-heading">View Orders</span>
                    <span className="text-description group-hover:text-action transition-colors">→</span>
                  </Link>
                </div>

                <div className="mt-auto pb-8">
                  <button
                    onClick={() => {
                      setIsAccountModalOpen(false);
                      handleLogout();
                    }}
                    className="w-full py-5 text-xs font-bold tracking-widest uppercase text-heading border-2 border-espresso rounded-2xl hover:bg-espresso hover:text-bone transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8 h-full text-center py-4">
                  <div className="mx-auto w-12 h-12 rounded-none bg-app border border-soft/20 flex items-center justify-center text-action shadow-sm">
                  <Leaf size={20} strokeWidth={1.5} />
                </div>

                <AuthForm
                  onSuccess={() => setIsAccountModalOpen(false)}
                  showRewardBanner={true}
                />
              </div>
            )}
          </div>
        </Modal>
      </div>

      {/* --- CHECKOUT DRAWER --- */}
      <CheckoutDrawer 
        isOpen={isCheckoutDrawerOpen} 
        onClose={() => setIsCheckoutDrawerOpen(false)} 
        onSignUp={() => {
          setIsCheckoutDrawerOpen(false);
          setIsAccountModalOpen(true);
        }}
      />
    </div>
  );
}
