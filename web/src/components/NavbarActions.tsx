"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Leaf, User, Search, ArrowRight, ArrowUp, Sun, Moon, X, LayoutDashboard, MessageSquare, Gift, Menu, MessageCircle, Facebook, Phone } from "lucide-react";
import AuthForm from "./AuthForm";
import CheckoutDrawer from "./CheckoutDrawer";
import { ThemeToggle } from "./ThemeToggle";
import { useRouter, useSearchParams } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";
import Modal from "./ui/Modal";
import { BusinessMetaData } from "@/types";

interface NavbarActionsProps {
  onSearchClick: () => void;
  onMenuClick: () => void;
  businessMetaData?: BusinessMetaData | null;
}

export default function NavbarActions({ onSearchClick, onMenuClick, businessMetaData }: NavbarActionsProps) {
  const supabase = createClient();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactDropdownRef = useRef<HTMLDivElement>(null);
  const { 
    isCheckoutDrawerOpen, 
    setIsCheckoutDrawerOpen,
    isAccountModalOpen,
    setIsAccountModalOpen,
    setIsInquiryModalOpen
  } = useUIStore();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  const [justAdded, setJustAdded] = useState(false);
  const prevQuantityRef = useRef(totalQuantity);

  useEffect(() => {
    if (totalQuantity > prevQuantityRef.current) {
      setJustAdded(true);
      const timer = setTimeout(() => setJustAdded(false), 1000);
      prevQuantityRef.current = totalQuantity;
      return () => clearTimeout(timer);
    }
    prevQuantityRef.current = totalQuantity;
  }, [totalQuantity]);

  // Click outside listener for contact dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target as Node)) {
        setIsContactOpen(false);
      }
    };
    if (isContactOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isContactOpen]);


  useEffect(() => {
    console.log("[Auth-Trace] Mounting auth effect. Setting up listener.");
    // 1. Single source of truth for auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      console.log(`[Auth-Trace] onAuthStateChange fired! Event: ${event}, User present:`, !!session?.user);
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
        console.warn("Profile check deferred:", err);
      } finally {
        setLoading(false);
      }
    });

    // 2. Initial fast check to set loading state
    const syncSession = async () => {
      console.log("[Auth-Trace] Running fast initial getSession()...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("[Auth-Trace] Initial getSession() result. User present:", !!session?.user);
      if (session) {
        setUser(session.user);
      }
      setLoading(false);
    };
    syncSession();

    return () => {
      console.log("[Auth-Trace] Unmounting component. Unsubscribing auth listener.");
      subscription.unsubscribe();
    };
  }, []); // Fixed the dependency array to run only once on mount

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
    <div className="flex items-center gap-4 md:gap-5 lg:gap-6 relative z-50 flex-shrink-0">
      {/* --- SEARCH TRIGGER --- */}
      <button
        type="button"
        onClick={onSearchClick}
        className="w-[38px] h-[38px] flex items-center justify-center bg-clay shadow-sm hover:bg-stone-muted/30 rounded-full transition-all text-heading cursor-pointer touch-manipulation group flex-shrink-0"
        aria-label="Search"
      >
        <Search size={20} className="md:w-6 md:h-6" strokeWidth={1.5} />
      </button>

      {/* --- OFFERS / GIFT ICON --- */}
      <button
        type="button"
        onClick={() => setCampaignModalOpen(true)}
        className="w-[38px] h-[38px] flex items-center justify-center bg-clay shadow-sm hover:bg-stone-muted/30 rounded-full transition-all text-action cursor-pointer touch-manipulation group flex-shrink-0"
        aria-label="View Offers"
      >
        <Gift size={22} className="md:w-7 md:h-7" strokeWidth={1.5} />
      </button>

      {/* --- ANIMATED CART SECTION --- */}
      <div className="relative flex-shrink-0">
        <motion.button
          type="button"
          onClick={() => setIsCheckoutDrawerOpen(true)}
          initial={{ scale: 1, rotate: 0 }}
          animate={totalQuantity > 0 && !justAdded ? {
            rotate: [0, -15, 15, -15, 15, 0],
          } : { rotate: 0 }}
          transition={{
            rotate: {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className={`relative flex items-center justify-center w-[38px] h-[38px] shadow-sm transition-colors duration-500 cursor-pointer touch-manipulation flex-shrink-0 rounded-full
            ${totalQuantity > 0
              ? 'bg-[#ea580c] text-white shadow-[0_0_25px_rgba(234,88,12,0.7)]'
               : 'bg-clay text-heading hover:bg-stone-muted/30 shadow-sm'}`}
        >
          <div className="flex items-center justify-center relative w-[22px] h-[22px] md:w-7 md:h-7">
            <AnimatePresence mode="popLayout">
              {justAdded ? (
                <motion.div
                  key="arrow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <ArrowUp size={22} className="md:w-7 md:h-7" strokeWidth={1.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="bag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <ShoppingBag size={22} className="md:w-7 md:h-7" strokeWidth={1.2} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {totalQuantity > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-heading text-app text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-[1.5px] border-[#ea580c]"
            >
              {totalQuantity}
            </motion.span>
          )}
        </motion.button>

      </div>

      {/* --- ACCOUNT / AUTH SECTION --- */}
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setIsAccountModalOpen(true)}
           className="w-[38px] h-[38px] flex items-center justify-center bg-clay shadow-sm hover:bg-stone-muted/30 rounded-full transition-all text-heading cursor-pointer touch-manipulation group flex-shrink-0"
        >
          {user ? (
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

      {/* Inquiry Hub Trigger */}
      <button
        type="button"
        onClick={() => setIsInquiryModalOpen(true)}
        className="w-[38px] h-[38px] flex items-center justify-center bg-clay shadow-sm hover:bg-stone-muted/30 rounded-full transition-all text-heading cursor-pointer touch-manipulation group flex-shrink-0"
        aria-label="Send Inquiry"
      >
        <MessageSquare size={20} className="md:w-6 md:h-6" strokeWidth={1.5} />
      </button>

      {/* --- CHECKOUT DRAWER --- */}
      <CheckoutDrawer 
        isOpen={isCheckoutDrawerOpen} 
        onClose={() => setIsCheckoutDrawerOpen(false)} 
        user={user}
        businessMetaData={businessMetaData}
        onSignUp={() => {
          setIsCheckoutDrawerOpen(false);
          setIsAccountModalOpen(true);
        }}
      />


      {/* Hamburger Menu - Unified into the utility stack */}
      <button
        type="button"
        onClick={onMenuClick}
        className="w-[38px] h-[38px] flex items-center justify-center bg-clay shadow-sm hover:bg-stone-muted/30 rounded-full transition-all text-heading cursor-pointer touch-manipulation flex-shrink-0"
        aria-label="Toggle Menu"
      >
        <Menu size={22} strokeWidth={1.5} />
      </button>
    </div>
  );
}
