"use client";

import { useCart } from "@/store/useCart";
import { useState, useEffect } from "react";
import { urlFor, client } from "@/lib/sanity";
import { processOrder } from "@/app/actions/checkout";
import { validateVoucher } from "@/app/actions/vouchers";
import { paymentAccountsQuery, activeCampaignsQuery } from "@/lib/queries";
import InquiryModal from "@/components/InquiryModal";
import Modal from "@/components/ui/Modal";
import {
  ShoppingBag,
  Leaf,
  ShieldCheck,
  CreditCard,
  Truck,
  ChevronRight,
  MapPin,
  Mail,
  User,
  Phone,
  QrCode,
  CheckCircle2,
  Package,
  ArrowRight,
  X,
  Tag,
  Ticket,
  Trash2,
  ArrowLeft,
  Info,
  Plus,
  Minus,
  Facebook,
  Instagram,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { trackEvent } from "@/components/MetaPixel";
import Link from "next/link";
import { useUIStore } from "@/store/useUIStore";

import { welcomeVoucherQuery } from "@/lib/queries";
import { Voucher } from "@/types";

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp?: () => void;
}

export default function CheckoutDrawer({ isOpen, onClose, onSignUp }: CheckoutDrawerProps) {
  const supabase = createClient();
  const { items, addItem, removeSingleItem, removeItem, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const { lockScroll, unlockScroll } = useUIStore();
  const [welcomeVoucher, setWelcomeVoucher] = useState<Voucher | null>(null);
  const [hasUsedWelcome, setHasUsedWelcome] = useState(false);
  const [hasPromptedVoucherReminder, setHasPromptedVoucherReminder] = useState(false);
  const [showVoucherReminder, setShowVoucherReminder] = useState(false);

  // Handle centralized scroll lock
  useEffect(() => {
    if (isOpen) {
      lockScroll('checkout-drawer');
    } else {
      unlockScroll('checkout-drawer');
    }
    return () => unlockScroll('checkout-drawer');
  }, [isOpen, lockScroll, unlockScroll]);
  
  // Voucher State
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVouchers, setAppliedVouchers] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  // RESET LOGIC: Ensure drawer resets on close
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        setOrderNumber(null);
        setActiveStep(1);
        setAppliedVouchers([]);
        setDiscount(0);
        setVoucherInput("");
        setVoucherError("");
      }, 500); // Wait for slide-out animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "Bagmati",
    phone: "",
    saveInfo: true,
    shippingMethod: "standard",
    paymentMethod: "cod"
  });

  const [inquiryData, setInquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalPieces = items.reduce((acc, item) => acc + item.quantity, 0);
  const shipping = formData.shippingMethod === "express" ? 500 : 0;
  const total = subtotal + shipping;
  const finalTotal = Math.max(0, total - discount);

  useEffect(() => {
    if (isOpen && items.length > 0) {
      const contentIds = items.map(item => item._id.replace("drafts.", ""));
      trackEvent("InitiateCheckout", {
        content_ids: contentIds,
        content_type: "product",
        num_items: totalPieces,
        value: finalTotal,
        currency: "NPR",
        brand: "Dolakha Furniture",
        availability: "in stock"
      });
    }
  }, [isOpen]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsInitialLoading(true);
        const [campaignsData, accounts, welcome] = await Promise.all([
          client.fetch(activeCampaignsQuery),
          client.fetch(paymentAccountsQuery),
          client.fetch(welcomeVoucherQuery)
        ]);
        
        setCampaigns(campaignsData);
        setPaymentAccounts(accounts);
        setWelcomeVoucher(welcome);
        
        // Pre-apply signup incentive if applicable
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          
          // Check if user has already used the welcome voucher
          if (welcome) {
            const usedVoucher = await client.fetch(
              `*[_type == "order" && (supabaseUserId == $userId || customerEmail == $email) && $code in voucherCodes][0]`,
              { userId: user.id, email: user.email, code: welcome.code.toLowerCase() }
            );
            if (usedVoucher) {
              setHasUsedWelcome(true);
            }
          }
          setFormData(prev => ({
            ...prev,
            email: user.email || "",
            firstName: user.user_metadata.full_name?.split(" ")[0] || "",
            lastName: user.user_metadata.full_name?.split(" ").slice(1).join(" ") || ""
          }));
          setInquiryData(prev => ({
            ...prev,
            name: user.user_metadata.full_name || "",
            email: user.email || ""
          }));

          // Apply dynamic welcome voucher if it exists, hasn't been used, and hasn't been applied yet
          if (welcome && !hasUsedWelcome && !appliedVouchers.some(v => v.code === welcome.code)) {
              const discountVal = welcome.discountType === 'percentage' 
                ? Math.floor((subtotal * welcome.discountValue) / 100)
                : welcome.discountValue;
                
              setDiscount(prev => prev + discountVal);
              setAppliedVouchers(prev => [...prev, { ...welcome, amount: discountVal }]);
          }
        }
      } catch (error) {
        console.error("Error loading checkout data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    if (isOpen) fetchData();
  }, [supabase, isOpen, items.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
    
    // Prevent duplicate entry
    if (appliedVouchers.some(v => v.code.toLowerCase() === voucherInput.toLowerCase())) {
        setVoucherError("This voucher is already applied.");
        return;
    }

    setIsApplyingVoucher(true);
    setVoucherError("");
    
    try {
      const result = await validateVoucher(voucherInput);
      if (result.success) {
        let discountVal = 0;
        if (result.discountType === "percentage") {
          discountVal = Math.floor((subtotal * result.discountValue!) / 100);
        } else {
          discountVal = result.discountValue!;
        }
        
        setDiscount(prev => prev + discountVal);
        setAppliedVouchers(prev => [...prev, { code: voucherInput, ...result, amount: discountVal }]);
        setVoucherInput("");
      } else {
        setVoucherError(result.message || "Invalid voucher.");
      }
    } catch (err) {
      setVoucherError("Failed to apply voucher.");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Step 1 -> 2: Review (With Smart Voucher Validation)
    if (activeStep === 1) {
      if (voucherInput.trim()) {
        alert("Please apply your voucher before proceeding!");
        return;
      }

      if (appliedVouchers.length === 0 && !hasPromptedVoucherReminder) {
        setShowVoucherReminder(true);
        return;
      }
      
      setActiveStep(2);
      return;
    }

    // Step 2 -> 3: Contact Info Validation
    if (activeStep === 2) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert("Please fill in all contact fields.");
        return;
      }
      const phoneRegex = /^9\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        alert("Please enter a valid 10-digit Nepal phone number starting with 9.");
        return;
      }
      setActiveStep(3);
      return;
    }

    // Step 3 -> 4: Address Validation
    if (activeStep === 3) {
      if (!formData.address || !formData.city) {
        alert("Please provide the delivery address and city.");
        return;
      }
      setActiveStep(4);
      return;
    }

    // Step 4: Final Processing
    setIsProcessing(true);
    try {
      const voucherCodes = appliedVouchers.map(v => v.code);
      const result = await processOrder(items, finalTotal, formData, voucherCodes);
      if (result.success) {
        setOrderNumber(result.orderNumber || null);
        setIsSuccess(true);
        const contentIds = items.map(item => item._id.replace("drafts.", ""));
        trackEvent("Purchase", {
          content_ids: contentIds,
          content_type: "product",
          currency: "NPR",
          value: Number(finalTotal) || 0,
          brand: "Dolakha Furniture",
          num_items: totalPieces
        });
        clearCart();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      alert(error.message || "An error occurred during checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) setActiveStep(prev => prev - 1);
  };

  useEffect(() => {
    if (items.length === 0 && !isSuccess && isOpen) {
      // We keep it open to show empty state
    }
  }, [items.length, isSuccess, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#3d2b1f]/20 backdrop-blur-sm z-[1000]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-[#fdfaf5] z-[1010] shadow-2xl flex flex-col pt-safe-top"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#e5dfd3] bg-white">
              <div>
                <h2 className="text-2xl font-serif italic text-[#3d2b1f]">
                  {isSuccess ? "Success" : items.length === 0 ? "Empty Cart" : "Checkout"}
                </h2>
                {!isSuccess && (
                   <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#a89f91] mt-1">
                     {items.length === 0 
                       ? "Why not check our active campaigns, vouchers and offers?" 
                       : `Step ${activeStep} of 4`
                     }
                   </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-[#3d2b1f] hover:bg-[#e5dfd3]/50 transition-colors rounded-none"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-[#a3573a]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#a3573a]">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-3xl font-serif italic mb-4">Order Received.</h3>
                  {orderNumber && (
                    <div className="inline-block bg-[#a3573a] text-white px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                      Order #{orderNumber}
                    </div>
                  )}
                  <p className="text-sm text-[#a89f91] mb-10 leading-relaxed max-w-xs mx-auto">
                    Thank you for choosing Dolakha Furniture. We'll contact you shortly to confirm your delivery details.
                  </p>
                  
                  <div className="space-y-3">
                    <Button fullWidth onClick={onClose} size="lg">Return to Gallery</Button>
                    <Button 
                      variant="outline" 
                      fullWidth 
                      size="lg" 
                      onClick={() => {
                        setInquiryData(prev => ({ ...prev, phone: formData.phone }));
                        setShowInquiryModal(true);
                      }}
                    >
                      Inquiry / Track
                    </Button>
                  </div>
                </motion.div>
              ) : items.length === 0 && !isSuccess ? (
                <motion.div 
                  key="empty-cart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12 py-6 no-scrollbar"
                >
                  {/* Hero Welcome Offer */}
                  <div className="relative p-8 bg-[#3d2b1f] rounded-[40px] overflow-hidden text-white shadow-2xl border border-white/10 group animate-in fade-in slide-in-from-bottom-4">
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-[#df9152]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a89f91]">Limited Welcome Offer</span>
                      </div>
                      <h3 className="text-3xl font-serif italic leading-tight">Your first piece comes with a gift.</h3>
                      <p className="text-xs text-white/60 max-w-[200px] leading-relaxed">
                        Sign up to unlock your exclusive <span className="text-[#df9152] font-bold">{welcomeVoucher?.code || 'WELCOME5'}</span> voucher and get {welcomeVoucher?.discountValue || 5}% off your first handcrafted piece.
                      </p>
                      
                      <div className="pt-4 flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Voucher Code</span>
                          <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/5 font-bold tracking-widest text-[#df9152] text-sm">
                            {welcomeVoucher?.code || 'WELCOME5'}
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            if (onSignUp) {
                              onSignUp();
                            } else {
                              onClose();
                            }
                          }} 
                          size="sm" 
                          variant="outline" 
                          className="text-white border-white/20 hover:bg-white hover:text-[#3d2b1f] mt-4"
                        >
                          Sign Up to Claim
                        </Button>
                      </div>
                    </div>
                    
                    {/* Abstract Shapes */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#df9152]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#df9152]/20 transition-all duration-700" />
                  </div>

                  {/* Dynamic Campaign Hero Cards */}
                  {isInitialLoading ? (
                    <div className="space-y-6">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-[280px] w-full bg-[#3d2b1f]/10 rounded-[40px] animate-pulse relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>
                      ))}
                    </div>
                  ) : campaigns.slice(0, 2).map((campaign, idx) => (
                    <div 
                      key={campaign._id}
                      className={`relative p-8 rounded-[40px] overflow-hidden text-white shadow-2xl border border-white/10 group animate-in fade-in slide-in-from-bottom-4 delay-${(idx + 1) * 100}`}
                      style={{ backgroundColor: campaign.themeColor || '#1a1c13' }}
                    >
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2">
                          <Leaf size={16} className="text-[#df9152]" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Featured Collection</span>
                        </div>
                        <h3 className="text-3xl font-serif italic leading-tight">{campaign.title}</h3>
                        <p className="text-xs text-white/60 max-w-[200px] leading-relaxed">
                          {campaign.tagline || String(campaign.description).slice(0, 100) + '...'}
                        </p>
                        
                        <div className="pt-4 flex items-center gap-3">
                           {campaign.vouchers && campaign.vouchers[0] && (
                             <div className="flex flex-col">
                               <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Active Voucher</span>
                               <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/5 font-bold tracking-widest text-[#df9152] text-sm">
                                 {campaign.vouchers[0].code}
                               </div>
                             </div>
                           )}
                           <Button 
                             onClick={() => {
                               onClose();
                               window.location.href = `/campaign/${campaign.slug}`;
                             }} 
                             size="sm" 
                             variant="outline" 
                             className="text-white border-white/20 hover:bg-white hover:text-[#3d2b1f] mt-4"
                           >
                             Explore Collection
                           </Button>
                        </div>
                      </div>
                      
                      {campaign.banner && (
                        <div className="absolute inset-0 z-0 overflow-hidden">
                           <img src={urlFor(campaign.banner).width(800).url()} className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all" />
                        </div>
                      )}
                      
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
                    </div>
                  ))}

                  {/* Connect with Us Hero Card */}
                  <div className="relative p-8 bg-[#3d2b1f] rounded-[40px] overflow-hidden text-white shadow-2xl border border-white/10 group animate-in fade-in slide-in-from-bottom-4 delay-300">
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-2">
                        <Leaf size={16} className="text-[#a3573a]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Connectivity</span>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-3xl font-serif italic leading-tight">Connect with Us</h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                         <a href="tel:+9779808005210" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-[#a3573a] transition-all group/link">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover/link:bg-white/20 transition-colors">
                               <Phone size={18} />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Call or WhatsApp</span>
                               <span className="text-sm font-sans font-bold">+977 9808005210</span>
                            </div>
                         </a>
                         
                         <a href="mailto:dolakhafurniture@gmail.com" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-[#a3573a] transition-all group/link">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover/link:bg-white/20 transition-colors">
                               <Mail size={18} />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Email Support</span>
                               <span className="text-sm font-sans font-bold italic">dolakhafurniture@gmail.com</span>
                            </div>
                         </a>
                      </div>

                      <div className="flex items-center justify-center gap-8 pt-2">
                         <a href="https://facebook.com/dolakhafurniture" target="_blank" className="hover:text-[#1877F2] transition-colors"><Facebook size={24} strokeWidth={1.5} /></a>
                         <a href="https://instagram.com/dolakhafurnituredesign" target="_blank" className="hover:text-[#e1306c] transition-colors"><Instagram size={24} strokeWidth={1.5} /></a>
                         <a href="https://tiktok.com/@dolakhafurniture" target="_blank" className="hover:text-white transition-opacity">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.61-1.49-2.11-2.46-.01 2.13.01 4.26-.01 6.38-.04 2.11-.46 4.38-1.92 6.01-1.62 1.83-4.22 2.58-6.6 2.18-2.6-.44-4.83-2.61-5.32-5.22-.54-2.84.58-6.04 2.94-7.69 1.52-1.07 3.51-1.46 5.33-1.05v4.1c-.88-.25-1.87-.21-2.69.24-1.2.66-1.85 2.11-1.6 3.47.2 1.14 1.13 2.14 2.27 2.32 1.34.2 2.82-.36 3.5-1.55.33-.58.46-1.25.45-1.92V.02z" />
                            </svg>
                         </a>
                      </div>
                    </div>

                    {/* Subtle Dolakha Sentry Shape */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#a3573a]/20 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
                  </div>
                </motion.div>
              ) : (
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-10 pb-20">
                      
                      {activeStep === 1 && (
                        <motion.section 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-8"
                        >
                          <div className="space-y-6">
                            <style dangerouslySetInnerHTML={{ __html: `
                              .cart-scroll::-webkit-scrollbar {
                                width: 4px;
                              }
                              .cart-scroll::-webkit-scrollbar-track {
                                background: transparent;
                              }
                              .cart-scroll::-webkit-scrollbar-thumb {
                                background: #e5dfd3;
                                border-radius: 10px;
                              }
                              .cart-scroll::-webkit-scrollbar-thumb:hover {
                                background: #a3573a;
                              }
                            `}} />
                            <div className="flex justify-between items-center">
                              <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91]">Review Your Pieces</h4>
                              <span className="text-[9px] font-bold px-2.5 py-1 bg-[#3d2b1f] text-white rounded-full uppercase tracking-tighter">{totalPieces} Total Pieces</span>
                            </div>
                            
                            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-4 cart-scroll">
                               <AnimatePresence mode="popLayout">
                                 {items.map((item) => (
                                   <motion.div 
                                      key={item._id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, x: -20 }}
                                      className="group flex gap-4 p-4 bg-white border border-[#e5dfd3] rounded-3xl hover:border-[#a3573a]/30 transition-all shadow-sm"
                                   >
                                      {/* Item Image */}
                                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#fdfaf5] flex-shrink-0 border border-[#e5dfd3]/50">
                                        <img src={urlFor(item.mainImage).width(160).url()} className="object-contain w-full h-full p-2" alt={item.title} />
                                      </div>

                                      {/* Item Details */}
                                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                         <div>
                                            <div className="flex justify-between items-start gap-2">
                                              <h5 className="text-sm font-serif italic text-[#3d2b1f] truncate">{item.title}</h5>
                                              <span className="text-[10px] font-bold text-[#a3573a] flex-shrink-0">x {item.quantity}</span>
                                            </div>
                                            <p className="text-[10px] font-sans font-bold text-[#a3573a]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                         </div>
                                         
                                         {/* Quantity Controls */}
                                         <div className="flex items-center mt-2">
                                            <div className="flex items-center bg-[#fdfaf5] border border-[#e5dfd3] rounded-full px-1.5 py-1 gap-3">
                                               <button 
                                                  type="button"
                                                  onClick={() => removeSingleItem(item._id)} 
                                                  className="p-1 text-[#3d2b1f]/40 hover:text-[#3d2b1f] transition-all"
                                               >
                                                  <Minus size={14} />
                                               </button>
                                               <span className="text-xs font-sans font-bold min-w-[12px] text-center text-[#1a1c13]">{item.quantity}</span>
                                               <button 
                                                  type="button"
                                                  onClick={() => addItem(item, 1)} 
                                                  className="p-1 text-[#3d2b1f]/40 hover:text-[#a3573a] transition-all"
                                               >
                                                  <Plus size={14} />
                                               </button>
                                            </div>
                                         </div>
                                      </div>

                                      {/* Delete Action - Red Bin */}
                                      <div className="flex items-center pl-2">
                                        <button 
                                           type="button"
                                           onClick={() => removeItem(item._id)}
                                           className="p-3 text-red-100 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-2xl transition-all group/delete"
                                           title="Remove from cart"
                                        >
                                           <Trash2 size={18} strokeWidth={2} className="text-red-500 group-hover/delete:text-white transition-colors" />
                                        </button>
                                      </div>
                                   </motion.div>
                                 ))}
                               </AnimatePresence>
                            </div>

                            {/* FINAL TOTAL */}
                            <div className="flex flex-col gap-4 pt-6 border-t border-[#e5dfd3] bg-pattern-boho bg-[#fdfaf5] p-6 rounded-3xl border-dotted bg-opacity-40">
                              <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#a89f91]">Total</span>
                                </div>
                                <span className="text-3xl font-sans font-extrabold text-[#a3573a] tracking-tighter">Rs. {finalTotal.toLocaleString()}</span>
                              </div>
                              
                              {appliedVouchers.length > 0 && (
                                <div className="space-y-2 mt-2">
                                   {appliedVouchers.map((v, idx) => (
                                     <div key={idx} className="flex items-center justify-between px-3 py-1.5 bg-[#a3573a]/10 rounded-full w-full">
                                        <div className="flex items-center gap-2">
                                          <Ticket size={12} className="text-[#a3573a]" />
                                          <span className="text-[10px] font-bold text-[#a3573a] uppercase">Voucher: {v.code}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#a3573a]">- Rs. {v.amount.toLocaleString()}</span>
                                     </div>
                                   ))}
                                </div>
                              )}
                            </div>

                            {/* Voucher Input */}
                            <div className="pt-6 border-t border-[#e5dfd3] border-dashed">
                               <div className="flex flex-col mb-3 ml-4 gap-1">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-[#a89f91]">Discount Voucher</p>
                                 
                                 {/* DYNAMIC VOUCHER RIBBON */}
                                 {(welcomeVoucher && !hasUsedWelcome || campaigns.some(c => c.vouchers?.length)) && (
                                   <div className="space-y-3 pt-2">
                                     <div className="flex items-center gap-2">
                                       <Sparkles size={12} className="text-[#a3573a]" />
                                       <p className="text-[9px] font-bold uppercase tracking-widest text-[#a3573a]">Available Vouchers (Tap to use)</p>
                                     </div>
                                     <div className="flex flex-wrap gap-3 items-center pt-1">
                                       <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3d2b1f] mr-1">Tap to use:</span>
                                       {welcomeVoucher && !hasUsedWelcome && !appliedVouchers.some(v => v.code === welcomeVoucher.code) && (
                                         <button 
                                           type="button"
                                           onClick={() => setVoucherInput(welcomeVoucher.code)} 
                                           className="px-4 py-2 bg-[#10b981] border border-[#059669] rounded-full flex items-center gap-2 hover:bg-[#059669] transition-all group shadow-md hover:shadow-lg active:scale-95"
                                         >
                                           <Sparkles size={12} className="text-white fill-white/20" />
                                           <span className="text-[11px] font-black text-white uppercase tracking-wider">{welcomeVoucher.code} (Welcome)</span>
                                         </button>
                                       )}
                                       {campaigns.flatMap(c => c.vouchers || [])
                                         .filter(v => v.code !== welcomeVoucher?.code && !appliedVouchers.some(av => av.code === v.code))
                                         .map((v, i) => (
                                         <button 
                                           key={i}
                                           type="button"
                                           onClick={() => setVoucherInput(v.code)} 
                                           className="px-4 py-2 bg-[#df9152] border border-[#c47d3e] rounded-full flex items-center gap-2 hover:bg-[#c47d3e] transition-all group shadow-md hover:shadow-lg active:scale-95"
                                         >
                                           <Tag size={12} className="text-white fill-white/20" />
                                           <span className="text-[11px] font-black text-white uppercase tracking-wider">{v.code}</span>
                                         </button>
                                       ))}
                                     </div>
                                     <p className="text-[8px] font-bold text-[#a89f91] uppercase tracking-tighter opacity-60">* Tap a voucher to select it, then press Apply</p>
                                   </div>
                                 )}
                               </div>
                               <div className="flex flex-col gap-3 mt-4">
                                  <div className="w-full">
                                    <Input
                                      placeholder="Enter code"
                                      containerClassName="!gap-0"
                                      value={voucherInput}
                                      onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                                      error={voucherError}
                                      className="text-lg py-6"
                                    />
                                  </div>
                                  <Button 
                                    type="button" 
                                    onClick={handleApplyVoucher}
                                    isLoading={isApplyingVoucher}
                                    variant="primary"
                                    fullWidth
                                    className="!py-5 text-sm font-black uppercase tracking-widest bg-[#3d2b1f] hover:bg-[#a3573a]"
                                  >
                                    Apply Voucher
                                  </Button>
                               </div>
                            </div>
                          </div>
                        </motion.section>
                      )}

                      {activeStep === 2 && (
                        <motion.section 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-8"
                        >
                          <h4 className="text-lg font-serif italic mb-6">Contact Information</h4>
                          <Input
                            label="Phone Number"
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            leftIcon={<span className="text-[10px] font-bold pr-2 border-r border-[#e5dfd3] mr-2">+977</span>}
                          />
                          <Input
                            label="Email Address (Optional)"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="To receive order updates"
                            icon={Mail}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="First name"
                              required
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                            />
                            <Input
                              label="Last name"
                              required
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                            />
                          </div>

                          {/* Mini Summary with Thumbnails */}
                          <div className="p-6 bg-[#fdfaf5] border border-[#e5dfd3] rounded-3xl mt-12 space-y-5">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[120px]">
                                  {items.slice(0, 3).map((item) => (
                                    <div key={item._id} className="w-10 h-10 rounded-xl border border-[#e5dfd3] overflow-hidden bg-white flex-shrink-0">
                                      <img src={urlFor(item.mainImage).width(80).url()} className="w-full h-full object-contain p-1" />
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a89f91]">Current Order</p>
                                  <p className="text-xs font-sans font-bold text-[#3d2b1f]">{totalPieces} Pieces</p>
                                </div>
                              </div>
                              <p className="text-xl font-sans font-bold text-[#a3573a]">Rs. {finalTotal.toLocaleString()}</p>
                            </div>
                            
                            {appliedVouchers.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-4 border-t border-[#e5dfd3]/50">
                                 {appliedVouchers.map((v, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-[#a3573a]/5 rounded-md border border-[#a3573a]/10">
                                       <Ticket size={10} className="text-[#a3573a]" />
                                       <span className="text-[8px] font-bold text-[#a3573a] uppercase">{v.code}</span>
                                    </div>
                                 ))}
                              </div>
                            )}
                          </div>
                        </motion.section>
                      )}

                      {activeStep === 3 && (
                        <motion.section 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-8"
                        >
                          <h4 className="text-lg font-serif italic mb-6">Delivery Details</h4>
                          <Input
                            label="Town / City"
                            required
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="e.g. Kathmandu"
                            icon={MapPin}
                          />
                          <Input
                            label="Tole / Area (Optional)"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleInputChange}
                            placeholder="e.g. Near Ganesh Mandir"
                          />
                          <div className="space-y-3">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-[#a89f91] ml-4">Additional Notes (Optional)</label>
                             <textarea 
                                name="address"
                                placeholder="Specific delivery instructions or location reminders..."
                                value={formData.address}
                                onChange={(e: any) => handleInputChange(e)}
                                className="w-full bg-white border border-[#e5dfd3] rounded-2xl p-6 text-sm focus:ring-1 focus:ring-[#a3573a] outline-none min-h-[120px] transition-all"
                             />
                          </div>
                          
                          
                          <div className="bg-white border border-[#e5dfd3] rounded-2xl overflow-hidden mt-8">
                             <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#fdfaf5] border border-transparent checked-parent:border-[#a3573a]/30">
                                <div className="flex items-center gap-3">
                                   <input type="radio" name="shippingMethod" value="standard" checked={formData.shippingMethod === "standard"} onChange={handleInputChange} className="w-5 h-5 accent-[#3d2b1f]" />
                                   <div className="flex flex-col">
                                     <span className="text-sm font-bold text-[#1a1c13]">Standard Delivery</span>
                                     <span className="text-[10px] font-bold text-[#5c564b]">Inside Kathmandu (2-5 days)</span>
                                   </div>
                                </div>
                                <span className="text-[10px] font-extrabold text-[#a3573a] uppercase">Free</span>
                             </label>
                             <label className="flex items-center justify-between p-5 opacity-50 cursor-not-allowed border-t border-[#e5dfd3] bg-[#f9f7f2]">
                                <div className="flex items-center gap-3">
                                   <input type="radio" name="shippingMethod" value="express" disabled className="w-5 h-5 accent-[#3d2b1f]" />
                                   <div className="flex flex-col">
                                     <span className="text-sm font-bold text-[#1a1c13]">Outside Valley</span>
                                     <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-bold text-[#5c564b]">Shipping Partner</span>
                                       <span className="text-[7px] font-bold bg-[#3d2b1f] text-white px-1 py-0.5 rounded tracking-tighter uppercase">Coming Soon</span>
                                     </div>
                                   </div>
                                </div>
                                <span className="text-[10px] font-extrabold text-[#a89f91]">Rs. 500</span>
                             </label>
                          </div>

                          {/* Mini Summary with Thumbnails */}
                          <div className="p-6 bg-[#fdfaf5] border border-[#e5dfd3] rounded-3xl mt-12 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[120px]">
                                {items.slice(0, 3).map((item) => (
                                  <div key={item._id} className="w-10 h-10 rounded-xl border border-[#e5dfd3] overflow-hidden bg-white flex-shrink-0">
                                    <img src={urlFor(item.mainImage).width(80).url()} className="w-full h-full object-contain p-1" />
                                  </div>
                                ))}
                              </div>
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a89f91]">Current Order</p>
                                <p className="text-xs font-sans font-bold text-[#3d2b1f]">{totalPieces} Pieces</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="text-xl font-sans font-bold text-[#a3573a]">Rs. {finalTotal.toLocaleString()}</p>
                              {appliedVouchers.length > 0 && <span className="text-[9px] font-bold text-[#a3573a] uppercase">Vouchers Applied</span>}
                            </div>
                          </div>
                        </motion.section>
                      )}

                      {activeStep === 4 && (
                        <motion.section 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-8"
                        >
                          <h4 className="text-lg font-serif italic mb-6">Final Payment</h4>
                          <div className="space-y-4">
                            <label className="flex flex-col p-6 bg-white border border-[#e5dfd3] rounded-2xl cursor-pointer hover:border-[#a3573a] transition-all">
                               <div className="flex items-center gap-4 mb-2">
                                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleInputChange} className="w-5 h-5 accent-[#3d2b1f]" />
                                  <span className="text-sm font-bold text-[#1a1c13]">Cash on Delivery</span>
                               </div>
                               <p className="text-[10px] text-[#5c564b] font-bold pl-9">Pay with cash when your piece arrives.</p>
                            </label>

                            {paymentAccounts.map((account) => (
                               <label key={account._id} className="flex flex-col p-6 bg-white border border-[#e5dfd3] rounded-2xl cursor-pointer hover:border-[#a3573a] transition-all">
                                  <div className="flex items-start gap-4 mb-4">
                                     <input type="radio" name="paymentMethod" value={account.accountName} checked={formData.paymentMethod === account.accountName} onChange={handleInputChange} className="w-5 h-5 accent-[#3d2b1f] mt-0.5" />
                                     <div className="flex flex-col gap-1">
                                        <span className="text-sm font-bold text-[#1a1c13]">{account.bankNameOrWalletName}</span>
                                        <span className="text-[10px] text-[#5c564b] font-bold">{account.accountName} • {account.accountNumber}</span>
                                     </div>
                                  </div>
                                  {account.qrCodeImage && (
                                     <div className="bg-[#fdfaf5] p-4 rounded-xl flex justify-center border border-[#e5dfd3]/50">
                                        <img src={urlFor(account.qrCodeImage).width(120).url()} className="h-24 w-24 object-contain" />
                                     </div>
                                  )}
                               </label>
                            ))}
                          </div>

                           {/* Final Summary Bar */}
                           <div className="p-8 bg-[#3d2b1f] rounded-[40px] mt-12 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
                             <div className="flex justify-between items-center relative z-10">
                               <div>
                                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a89f91]">Total Pieces</p>
                                 <p className="text-lg font-sans font-bold text-white">{totalPieces} Handcrafted Items</p>
                               </div>
                               <p className="text-3xl font-sans font-extrabold text-[#df9152] tracking-tighter">Rs. {finalTotal.toLocaleString()}</p>
                             </div>
                             
                             {appliedVouchers.length > 0 && (
                               <div className="flex flex-col gap-2 relative z-10 pt-2 border-t border-white/10">
                                  {appliedVouchers.map((v, idx) => (
                                    <div key={idx} className="flex items-center justify-between px-3 py-1.5 bg-white/10 rounded-full w-full">
                                      <div className="flex items-center gap-2">
                                        <Ticket size={12} className="text-[#df9152]" />
                                        <span className="text-[10px] font-bold text-[#df9152] uppercase">Voucher: {v.code}</span>
                                      </div>
                                      <span className="text-[10px] font-bold text-white">- Rs. {v.amount.toLocaleString()}</span>
                                    </div>
                                  ))}
                               </div>
                             )}
                             
                             {/* Subtle Background Pattern */}
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                           </div>
                        </motion.section>
                      )}
                    </form>
                  )}
            </div>

            {/* Footer Actions */}
            {!isSuccess && items.length > 0 && (
              <div className="p-6 border-t border-[#e5dfd3] bg-white flex items-center justify-between gap-4">
                {activeStep > 1 ? (
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#a89f91] hover:text-[#3d2b1f] transition-all"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                ) : (
                   <div />
                )}
                
                <Button
                  form="checkout-form"
                  type="submit"
                  isLoading={isProcessing || (activeStep === 1 && items.length > 0 && isInitialLoading)}
                  disabled={activeStep === 1 && items.length > 0 && isInitialLoading}
                  className="px-8 !py-4"
                  rightIcon={activeStep < 4 ? <ChevronRight size={16} /> : <ShieldCheck size={16} />}
                >
                  {activeStep < 4 ? "Continue" : "Complete Purchase"}
                </Button>
              </div>
            )}

            {/* Inquiry Modal Integration */}
            <InquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        initialData={inquiryData}
        title="Order Inquiry"
        subtitle="How can we help with your order?"
      />

      {/* VOUCHER REMINDER MODAL */}
      <Modal 
        isOpen={showVoucherReminder} 
        onClose={() => setShowVoucherReminder(false)}
        title="Discount Voucher"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-[#a3573a]/10 rounded-full flex items-center justify-center mx-auto text-[#a3573a]">
            <Ticket size={32} />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-[#3d2b1f] font-medium leading-relaxed">
              Do you have a discount voucher you'd like to apply to this order?
            </p>
            <p className="text-[10px] text-[#a89f91] uppercase tracking-widest font-bold">
              Check your email or our active campaigns
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              fullWidth 
              onClick={() => setShowVoucherReminder(false)}
              className="bg-[#3d2b1f] hover:bg-[#a3573a] text-white"
            >
              I have a voucher
            </Button>
            <Button 
              variant="outline"
              fullWidth 
              onClick={() => {
                setShowVoucherReminder(false);
                setHasPromptedVoucherReminder(true);
                setActiveStep(2);
              }}
            >
              No, I don't have a voucher
            </Button>
          </div>
        </div>
      </Modal>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
