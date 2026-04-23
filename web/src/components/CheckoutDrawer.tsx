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
  onSignUp: () => void;
  user?: any;
}

export default function CheckoutDrawer({
  isOpen,
  onClose,
  onSignUp,
  user: propsUser,
}: CheckoutDrawerProps) {
  const supabase = createClient();
  const { items, addItem, removeSingleItem, removeItem, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(propsUser || null);
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const { lockScroll, unlockScroll } = useUIStore();
  const [welcomeVoucher, setWelcomeVoucher] = useState<Voucher | null>(null);
  const [hasUsedWelcome, setHasUsedWelcome] = useState(false);
  const [hasPromptedVoucherReminder, setHasPromptedVoucherReminder] =
    useState(false);
  const [showVoucherReminder, setShowVoucherReminder] = useState(false);

  // Handle centralized scroll lock
  useEffect(() => {
    if (isOpen) {
      lockScroll("checkout-drawer");
    } else {
      unlockScroll("checkout-drawer");
    }
    return () => unlockScroll("checkout-drawer");
  }, [isOpen, lockScroll, unlockScroll]);

  // Voucher State
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVouchers, setAppliedVouchers] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [hoveredVoucher, setHoveredVoucher] = useState<any>(null);

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
        setHasPromptedVoucherReminder(false);
        setShowVoucherReminder(false);
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
    paymentMethod: "cod",
  });

  const [inquiryData, setInquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalPieces = items.reduce((acc, item) => acc + item.quantity, 0);
  const shipping = formData.shippingMethod === "express" ? 500 : 0;
  const total = subtotal + shipping;
  const finalTotal = Math.max(0, total - discount);

  useEffect(() => {
    if (isOpen && items.length > 0) {
      const contentIds = items.map((item) => item._id.replace("drafts.", ""));
      trackEvent("InitiateCheckout", {
        content_ids: contentIds,
        content_type: "product",
        num_items: totalPieces,
        value: finalTotal,
        currency: "NPR",
        brand: "Dolakha Furniture",
        availability: "in stock",
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
          client.fetch(welcomeVoucherQuery),
        ]);

        setCampaigns(campaignsData);
        setPaymentAccounts(accounts);
        setWelcomeVoucher(welcome);

        // Sync with prop user
        setUser(propsUser);
        
        if (propsUser) {
          // Pre-fill form data once
          setFormData((prev) => ({
            ...prev,
            email: propsUser.email || "",
            firstName: propsUser.user_metadata.full_name?.split(" ")[0] || "",
            lastName: propsUser.user_metadata.full_name?.split(" ").slice(1).join(" ") || "",
          }));

          // Verify welcome voucher eligibility
          if (welcome) {
            const usedVoucher = await client.fetch(
              `*[_type == "order" && (supabaseUserId == $userId || customerEmail == $email) && count(voucherCodes[lower(@) == lower($code)]) > 0][0]`,
              {
                userId: propsUser.id,
                email: propsUser.email,
                code: welcome.code.toLowerCase(),
              },
            );
            if (usedVoucher) {
              setHasUsedWelcome(true);
            }
          }
          setInquiryData((prev) => ({
            ...prev,
            name: propsUser.user_metadata.full_name || "",
            email: propsUser.email || "",
          }));

          // Apply dynamic welcome voucher if it exists, hasn't been used, and hasn't been applied yet
          if (
            welcome &&
            !hasUsedWelcome &&
            !appliedVouchers.some((v) => v.code === welcome.code)
          ) {
            const discountVal =
              welcome.discountType === "percentage"
                ? Math.floor((subtotal * welcome.discountValue) / 100)
                : welcome.discountValue;

            setDiscount((prev) => prev + discountVal);
            setAppliedVouchers((prev) => [
              ...prev,
              { ...welcome, amount: discountVal },
            ]);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;

    // Prevent duplicate entry
    if (
      appliedVouchers.some(
        (v) => v.code.toLowerCase() === voucherInput.toLowerCase(),
      )
    ) {
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

        setDiscount((prev) => prev + discountVal);
        setAppliedVouchers((prev) => [
          ...prev,
          { code: voucherInput, ...result, amount: discountVal },
        ]);
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

    // Step 1 -> 2: Review (Soft Gate for Vouchers - Skip if they already typed something)
    if (activeStep === 1) {
      if (
        appliedVouchers.length === 0 && 
        voucherInput.trim() === "" && 
        !hasPromptedVoucherReminder
      ) {
        setShowVoucherReminder(true);
        setHasPromptedVoucherReminder(true);
        return;
      }
      setActiveStep(2);
      setShowVoucherReminder(false); // Hide nudge if moving forward
      return;
    }

    // Step 2 -> 3: Contact Info Validation
    if (activeStep === 2) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone
      ) {
        alert("Please fill in all contact fields.");
        return;
      }
      const phoneRegex = /^9\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        alert(
          "Please enter a valid 10-digit Nepal phone number starting with 9.",
        );
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
      const voucherCodes = appliedVouchers.map((v) => v.code);
      const result = await processOrder(
        items,
        finalTotal,
        formData,
        voucherCodes,
      );
      if (result.success) {
        setOrderNumber(result.orderNumber || null);
        setIsSuccess(true);
        const contentIds = items.map((item) => item._id.replace("drafts.", ""));
        trackEvent("Purchase", {
          content_ids: contentIds,
          content_type: "product",
          currency: "NPR",
          value: Number(finalTotal) || 0,
          brand: "Dolakha Furniture",
          num_items: totalPieces,
        });
        clearCart();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      alert(
        error.message || "An error occurred during checkout. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) setActiveStep((prev) => prev - 1);
  };

  useEffect(() => {
    if (items.length === 0 && !isSuccess && isOpen) {
      // We keep it open to show empty state
    }
  }, [items.length, isSuccess, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      noPadding
      title={
        isSuccess ? (
          "Success"
        ) : items.length === 0 ? (
          "Empty Cart"
        ) : (
          <div className="flex flex-col">
            <span className="text-sm font-serif italic text-heading leading-tight">
              Checkout
            </span>
            <span className="type-label text-description/60 text-[9px] translate-y-[1px] font-bold uppercase tracking-widest whitespace-nowrap">
              Step {activeStep} of 4:{" "}
              {activeStep === 1
                ? "Review / Vouchers"
                : activeStep === 2
                  ? "Customer Details"
                  : activeStep === 3
                    ? "Delivery Info"
                    : "Finalize Payment"}
            </span>
          </div>
        )
      }
    >
      <div className="w-full h-full flex flex-col">
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar">
          {items.length === 0 && !isSuccess && (
            <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-description/30 pb-4">
              Check our active campaigns
            </p>
          )}
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 px-8 bg-surface border border-soft rounded-[3rem] shadow-sm"
            >
              <div className="w-20 h-20 bg-success/10 border border-success/20 rounded-full flex items-center justify-center mx-auto mb-8 text-success">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="type-section mb-4">Order Received.</h3>
              {orderNumber && (
                <div className="inline-block bg-heading text-app px-5 py-1.5 rounded-full type-label mb-6">
                  Order #{orderNumber}
                </div>
              )}
              <p className="type-body text-description mb-10 max-w-xs mx-auto">
                Thank you for choosing Dolakha Furniture. We'll contact you
                shortly to confirm your delivery details.
              </p>

              <div className="space-y-3">
                <Button fullWidth onClick={onClose} size="lg">
                  Return to Gallery
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  size="lg"
                  onClick={() => {
                    setInquiryData((prev) => ({
                      ...prev,
                      phone: formData.phone,
                    }));
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
              className="space-y-8 py-6 no-scrollbar"
            >
              {/* Dynamic Campaign Gallery */}
              {isInitialLoading ? (
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-[300px] w-full bg-invert/50 rounded-[3rem] animate-pulse relative overflow-hidden border border-soft/10"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-soft/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                    </div>
                  ))}
                </div>
              ) : (
                campaigns.map((campaign, idx) => (
                  <div
                    key={campaign._id}
                    className={`relative rounded-[3rem] overflow-hidden bg-surface border border-soft/20 flex flex-col group animate-in fade-in slide-in-from-bottom-4 delay-${(idx + 1) * 100} min-h-[500px] shadow-sm`}
                  >
                    {/* 1. Fixed Header (Campaign Title) */}
                    <div className="h-20 px-8 flex items-center justify-between flex-shrink-0">
                      <h3 className="text-xl font-serif italic text-heading leading-tight truncate pr-4">
                        {campaign.title}
                      </h3>
                      <Sparkles
                        size={16}
                        className="text-action/40 animate-pulse"
                      />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-soft/10 mx-6" />

                    {/* 2. Visual Section (35% - Banner or Title Fallback) */}
                    <div className="relative h-44 overflow-hidden group/banner flex-shrink-0">
                      {campaign.banner ? (
                        <>
                          <img
                            src={urlFor(campaign.banner).width(800).url()}
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover/banner:scale-110 opacity-80"
                            alt={campaign.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-heading flex items-center justify-center p-8 text-center relative overflow-hidden">
                          <span className="text-app/10 font-serif italic text-7xl absolute left-0 -top-4 select-none whitespace-nowrap">
                            {campaign.title}
                          </span>
                          <h4 className="relative z-10 text-app font-serif italic text-xl opacity-80">
                            {campaign.title}
                          </h4>
                          <Sparkles
                            size={40}
                            className="absolute text-action opacity-10 -right-4 -bottom-4"
                          />
                        </div>
                      )}
                    </div>

                    {/* 3. Description Section (30%) */}
                    <div className="flex-1 p-8 pt-6 flex flex-col">
                      <div className="space-y-4">
                        <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-description/50">
                          Details:
                        </h4>
                        <p className="type-body text-heading/70 text-sm line-clamp-3 leading-relaxed italic">
                          {campaign.tagline ||
                            String(campaign.description).split(".")[0] + "."}
                        </p>
                      </div>

                      {/* 4. Action & Voucher Layer (Rest) */}
                      <div className="mt-auto pt-8 space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-description/50">
                            Available vouchers:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {campaign.vouchers?.map((v: any, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 px-4 py-2 bg-app rounded-xl border border-soft/50 font-bold tracking-widest text-action text-[10px] shadow-sm hover:border-action/30 transition-all cursor-default"
                              >
                                <Tag size={10} className="fill-action/10" />
                                <span>{v.code.toUpperCase()}</span>
                              </div>
                            ))}
                            {!campaign.vouchers?.length && (
                              <div className="text-[9px] uppercase font-bold tracking-widest text-description/20 italic">
                                Exclusive Heritage Selection
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          onClick={() => {
                            if (campaign.buttonLink === "#signup") {
                              onSignUp?.();
                            } else {
                              onClose();
                              window.location.href =
                                campaign.buttonLink ||
                                `/campaign/${campaign.slug}`;
                            }
                          }}
                          fullWidth
                          variant="outline"
                          className="!border-soft hover:!border-action/50 !text-heading !py-4 transition-all hover:bg-surface/50 font-bold text-xs uppercase tracking-widest"
                        >
                          {campaign.buttonText || "Explore Collection"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Connect with Us (Static Anchor) */}
              <div className="relative p-8 bg-surface border border-soft/20 rounded-[3rem] overflow-hidden shadow-2xl group animate-in fade-in slide-in-from-bottom-4 delay-500">
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-action" />
                    <span className="type-label text-description tracking-[0.2em]">
                      Always Connected
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif italic text-heading">
                      Connect with Us
                    </h3>
                    <p className="type-label text-description normal-case italic">
                      Dedicated support for your heritage pieces
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <a
                      href="tel:+9779808005210"
                      className="flex items-center gap-4 p-4 bg-app rounded-2xl border border-soft/20 hover:border-action/30 transition-all group/link"
                    >
                      <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center group-hover/link:bg-action transition-colors">
                        <Phone
                          size={18}
                          className="text-heading group-hover/link:text-app"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-description">
                          Instant Reach
                        </span>
                        <span className="text-sm font-bold text-heading">
                          +977 9808005210
                        </span>
                      </div>
                    </a>

                    <a
                      href="mailto:dolakhafurniture@gmail.com"
                      className="flex items-center gap-4 p-4 bg-app rounded-2xl border border-soft/20 hover:border-action/30 transition-all group/link"
                    >
                      <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center group-hover/link:bg-action transition-colors">
                        <Mail
                          size={18}
                          className="text-heading group-hover/link:text-app"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-description">
                          Support Desk
                        </span>
                        <span className="text-sm font-bold italic text-heading truncate">
                          dolakhafurniture@gmail.com
                        </span>
                      </div>
                    </a>
                  </div>

                  <div className="absolute top-0 right-0 w-32 h-32 bg-action/5 rounded-full -mr-16 -mt-16 pointer-events-none blur-2xl" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-8 pt-4 opacity-50 hover:opacity-100 transition-opacity">
                <a
                  href="https://facebook.com/dolakhafurniture"
                  target="_blank"
                  className="text-app hover:text-[#1877F2] transition-all hover:scale-110"
                >
                  <Facebook size={22} strokeWidth={1.5} />
                </a>
                <a
                  href="https://instagram.com/dolakhafurnituredesign"
                  target="_blank"
                  className="text-app hover:text-[#e1306c] transition-all hover:scale-110"
                >
                  <Instagram size={22} strokeWidth={1.5} />
                </a>
              </div>
            </motion.div>
          ) : (
            <form
              id="checkout-form"
              onSubmit={handleCheckout}
              className="space-y-6 pb-6"
            >
              {activeStep === 1 && (
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <style
                      dangerouslySetInnerHTML={{
                        __html: `
                              .cart-scroll::-webkit-scrollbar {
                                width: 4px;
                              }
                              .cart-scroll::-webkit-scrollbar-track {
                                background: transparent;
                              }
                              .cart-scroll::-webkit-scrollbar-thumb {
                                background: soft;
                                border-radius: 10px;
                              }
                              .cart-scroll::-webkit-scrollbar-thumb:hover {
                                background: accent;
                              }
                            `,
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-description">
                        Review Your Pieces
                      </h4>
                      <span className="text-[9px] font-bold px-2.5 py-1 bg-espresso text-bone rounded-full uppercase tracking-tighter">
                        {totalPieces} Total Pieces
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[460px] overflow-y-auto pr-4 cart-scroll">
                      <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="group flex gap-3 p-3 bg-surface border border-soft rounded-2xl hover:border-action/30 transition-all shadow-sm"
                          >
                            {/* Item Image */}
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-app flex-shrink-0 border border-soft/50">
                              <img
                                src={urlFor(item.mainImage).width(160).url()}
                                className="object-contain w-full h-full p-2"
                                alt={item.title}
                              />
                            </div>

                            {/* Item Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <h5 className="type-product !text-base text-heading truncate">
                                    {item.title}
                                  </h5>
                                  <span className="type-label text-action text-[9px] flex-shrink-0">
                                    x {item.quantity}
                                  </span>
                                </div>
                                <p className="type-label text-action">
                                  Rs.{" "}
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                </p>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center mt-2">
                                <div className="flex items-center bg-app border border-soft rounded-full px-1.5 py-1 gap-3">
                                  <button
                                    type="button"
                                    onClick={() => removeSingleItem(item._id)}
                                    className="p-1 text-heading/40 hover:text-heading transition-all"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="type-label text-heading min-w-[12px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => addItem(item, 1)}
                                    className="p-1 text-heading/40 hover:text-action transition-all"
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
                                <Trash2
                                  size={18}
                                  strokeWidth={2}
                                  className="text-red-500 group-hover/delete:text-white transition-colors"
                                />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* FINAL TOTAL */}
                    {/* FINAL TOTAL */}
                    <div className="flex flex-col gap-3 pt-5 border-t border-divider bg-app p-5 rounded-2xl border-dotted shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="type-label text-description">
                            Total
                          </span>
                        </div>
                        <span className="text-2xl font-sans font-bold text-action tracking-tight">
                          Rs. {finalTotal.toLocaleString()}
                        </span>
                      </div>

                      {appliedVouchers.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {appliedVouchers.map((v, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between px-3 py-1.5 bg-action/10 rounded-full w-full"
                            >
                              <div className="flex items-center gap-2">
                                <Ticket size={12} className="text-action" />
                                <span className="type-label text-action">
                                  Voucher: {v.code}
                                </span>
                              </div>
                              <span className="type-label text-action">
                                - Rs. {v.amount.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                     {/* Voucher Input */}
                    <div className="pt-4 border-t border-divider border-dashed relative">
                      {/* Do you have a voucher hint - Triggered by 'Next' button if empty */}
                      {showVoucherReminder && appliedVouchers.length === 0 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mb-4 overflow-hidden"
                        >
                          <div className="p-3 bg-action/5 border border-action/10 rounded-xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-action/10 flex items-center justify-center text-action">
                              <Tag size={14} />
                            </div>
                            <div>
                              <p className="type-action text-[10px] leading-tight font-bold">Wait! Do you have a voucher code?</p>
                              <p className="type-label text-[9px] opacity-60 normal-case">Enter it below to unlock your special furniture offer.</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div className="flex flex-col mb-2 ml-1 gap-0.5">
                        <p className="type-label text-description">
                          Discount Voucher
                        </p>

                        {/* DYNAMIC VOUCHER RIBBON */}
                        {((welcomeVoucher && !hasUsedWelcome && user?.id) ||
                          campaigns.some((c) => c.vouchers?.length)) && (
                          <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-2">
                              <Sparkles size={12} className="text-action" />
                              <p className="type-label text-action">
                                Available Vouchers (Tap to use)
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center pt-1">
                              {/* Welcome Voucher - ONLY for logged in users */}
                              {welcomeVoucher &&
                                user?.id &&
                                !hasUsedWelcome &&
                                !appliedVouchers.some(
                                  (v) => v.code === welcomeVoucher.code,
                                ) && (
                                    <button
                                      type="button"
                                      onMouseEnter={() => setHoveredVoucher(welcomeVoucher)}
                                      onMouseLeave={() => setHoveredVoucher(null)}
                                      onClick={() => {
                                        setVoucherInput(welcomeVoucher.code);
                                        setVoucherError("");
                                      }}
                                      className="px-3 py-1.5 bg-heading border border-soft/20 rounded-full flex items-center gap-2 hover:bg-action transition-all group shadow-sm active:scale-95"
                                    >
                                      <Sparkles
                                        size={10}
                                        className="text-app fill-app/20"
                                      />
                                      <span className="type-action text-app text-[9px]">
                                        {welcomeVoucher.code} • {welcomeVoucher.discountValue}{welcomeVoucher.discountType === 'percentage' ? '%' : ' OFF'}
                                      </span>
                                    </button>
                                )}

                              {/* Campaign Vouchers - Case-insensitive deduplication */}
                              {(() => {
                                const displayedCodes = new Set();
                                const welcomeCodeUpper = welcomeVoucher?.code?.toUpperCase();
                                if (welcomeCodeUpper) displayedCodes.add(welcomeCodeUpper);

                                return campaigns
                                  .flatMap((c) => c.vouchers || [])
                                  .filter((v) => {
                                    const codeUpper = v.code.toUpperCase();

                                    // UNIVERSAL BLOCK: Hide 'WELCOME' vouchers for guests OR those who have already used them
                                    if (
                                      (!user?.id || hasUsedWelcome) &&
                                      codeUpper.includes("WELCOME")
                                    )
                                      return false;

                                    // Deduplication: Skip if already shown or already applied
                                    if (displayedCodes.has(codeUpper)) return false;
                                    if (
                                      appliedVouchers.some(
                                        (av) => av.code.toUpperCase() === codeUpper,
                                      )
                                    )
                                      return false;

                                    displayedCodes.add(codeUpper);
                                    return true;
                                  })
                                  .map((v, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onMouseEnter={() => setHoveredVoucher(v)}
                                      onMouseLeave={() => setHoveredVoucher(null)}
                                      onClick={() => {
                                        setVoucherInput(v.code);
                                        setVoucherError("");
                                      }}
                                      className="px-3 py-1.5 bg-heading border border-soft/20 rounded-full flex items-center gap-2 hover:bg-action transition-all group shadow-sm active:scale-95"
                                    >
                                      <Tag
                                        size={10}
                                        className="text-app fill-app/20"
                                      />
                                      <span className="type-action text-app text-[9px]">
                                        {v.code} • {v.discountValue}
                                        {v.discountType === "percentage"
                                          ? "%"
                                          : " OFF"}
                                      </span>
                                    </button>
                                  ));
                              })()}
                            </div>

                            {/* HOVER DESCRIPTION ROW */}
                            <AnimatePresence mode="wait">
                              {hoveredVoucher && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  className="py-1 px-2 border-l-2 border-action bg-action/5 rounded-r-md mt-2"
                                >
                                  <p className="type-label text-action font-bold uppercase tracking-widest text-[9px]">
                                    {hoveredVoucher.code}:{" "}
                                    {hoveredVoucher.discountValue}
                                    {hoveredVoucher.discountType === "percentage"
                                      ? "%"
                                      : " OFF"}{" "}
                                    on your total pieces
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <p className="type-label opacity-40 normal-case italic mt-2">
                              *TAP or CLICK the voucher to select it, OR type it
                              manually and then press APPLY
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2.5 mt-2">
                        <div className="w-full">
                          <Input
                            placeholder="Enter code"
                            containerClassName="!gap-0"
                            value={voucherInput}
                            onChange={(e) =>
                              setVoucherInput(e.target.value.toUpperCase())
                            }
                            error={voucherError}
                            className="text-sm py-4"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={handleApplyVoucher}
                          isLoading={isApplyingVoucher}
                          variant="primary"
                          fullWidth
                          className="!py-4 bg-invert hover:bg-action text-[11px]"
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
                  <h4 className="type-section mb-6">Contact Information</h4>
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    leftIcon={
                      <span className="text-[10px] font-bold pr-2 border-r border-soft mr-2">
                        +977
                      </span>
                    }
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
                  <div className="bg-app border border-divider p-10 rounded-[3rem] text-center shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[120px]">
                          {items.slice(0, 3).map((item) => (
                            <div
                              key={item._id}
                              className="w-10 h-10 rounded-xl border border-soft overflow-hidden bg-white flex-shrink-0"
                            >
                              <img
                                src={urlFor(item.mainImage).width(80).url()}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-label">
                            Current Order
                          </p>
                          <p className="text-xs font-sans font-bold text-heading">
                            {totalPieces} Pieces
                          </p>
                        </div>
                      </div>
                      <p className="text-xl font-sans font-bold text-action">
                        Rs. {finalTotal.toLocaleString()}
                      </p>
                    </div>

                    {appliedVouchers.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-soft/50">
                        {appliedVouchers.map((v, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-2 py-1 bg-action/5 rounded-md border border-action/10"
                          >
                            <Ticket size={10} className="text-action" />
                            <span className="text-[8px] font-bold text-action uppercase">
                              {v.code}
                            </span>
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
                  <h4 className="type-section mb-6">Delivery Details</h4>
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
                    <label className="text-[10px] font-bold uppercase tracking-widest text-description ml-4">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="address"
                      placeholder="Specific delivery instructions or location reminders..."
                      value={formData.address}
                      onChange={(e: any) => handleInputChange(e)}
                      className="w-full bg-app border border-soft/20 rounded-[1.5rem] p-6 text-sm focus:ring-1 focus:ring-action outline-none min-h-[120px] transition-all"
                    />
                  </div>

                  <div className="bg-app border border-soft/20 rounded-[1.5rem] overflow-hidden mt-8">
                    <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-surface/50 border-transparent transition-all group">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={formData.shippingMethod === "standard"}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-action"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-heading">
                            Standard Delivery
                          </span>
                          <span className="text-[10px] font-bold text-description">
                            Inside Kathmandu (2-5 days)
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-action uppercase tracking-widest">
                        Free
                      </span>
                    </label>
                    <label className="flex items-center justify-between p-5 opacity-40 cursor-not-allowed border-t border-soft/10 bg-surface/30">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          disabled
                          className="w-5 h-5 accent-action"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-heading">
                            Outside Valley
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-description">
                              Shipping Partner
                            </span>
                            <span className="text-[7px] font-bold bg-action text-white px-1.5 py-0.5 rounded-full tracking-tighter uppercase">
                              Coming Soon
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-description">
                        Rs. 500
                      </span>
                    </label>
                  </div>

                  {/* Mini Summary with Thumbnails */}
                  <div className="p-6 bg-app border border-soft rounded-3xl mt-12 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[120px]">
                        {items.slice(0, 3).map((item) => (
                          <div
                            key={item._id}
                            className="w-10 h-10 rounded-xl border border-soft overflow-hidden bg-white flex-shrink-0"
                          >
                            <img
                              src={urlFor(item.mainImage).width(80).url()}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-label">
                          Current Order
                        </p>
                        <p className="text-xs font-sans font-bold text-heading">
                          {totalPieces} Pieces
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-xl font-sans font-bold text-action">
                        Rs. {finalTotal.toLocaleString()}
                      </p>
                      {appliedVouchers.length > 0 && (
                        <span className="text-[9px] font-bold text-action uppercase">
                          Vouchers Applied
                        </span>
                      )}
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
                  <h4 className="type-section mb-6">Final Payment</h4>
                  <div className="space-y-4">
                    <label className="flex flex-col p-6 bg-app border border-soft/20 rounded-[1.5rem] cursor-pointer hover:bg-surface/50 hover:border-action/30 transition-all group">
                      <div className="flex items-center gap-4 mb-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-action"
                        />
                        <span className="text-sm font-bold text-heading">
                          Cash on Delivery
                        </span>
                      </div>
                      <p className="text-[10px] text-description font-bold pl-9">
                        Pay with cash when your piece arrives.
                      </p>
                    </label>

                    {paymentAccounts.map((account) => (
                      <label
                        key={account._id}
                        className="flex flex-col p-6 bg-app border border-soft/20 rounded-[1.5rem] cursor-pointer hover:bg-surface/50 hover:border-action/30 transition-all group"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={account.accountName}
                            checked={
                              formData.paymentMethod === account.accountName
                            }
                            onChange={handleInputChange}
                            className="w-5 h-5 accent-action mt-0.5"
                          />
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-heading">
                              {account.bankNameOrWalletName}
                            </span>
                            <span className="text-[10px] text-description font-bold">
                              {account.accountName} • {account.accountNumber}
                            </span>
                          </div>
                        </div>
                        {account.qrCodeImage && (
                          <div className="bg-white p-4 rounded-xl flex justify-center border border-soft/20 shadow-sm transition-all group-hover:shadow-md">
                            <img
                              src={urlFor(account.qrCodeImage).width(120).url()}
                              className="h-24 w-24 object-contain"
                            />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Final Summary Bar */}
                  <div className="p-8 bg-espresso rounded-[40px] mt-12 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center relative z-10">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-label">
                          Total Pieces
                        </p>
                        <p className="text-lg font-sans font-bold text-white">
                          {totalPieces} Handcrafted Items
                        </p>
                      </div>
                      <p className="text-3xl font-sans font-bold text-action tracking-tight">
                        Rs. {finalTotal.toLocaleString()}
                      </p>
                    </div>

                    {appliedVouchers.length > 0 && (
                      <div className="flex flex-col gap-2 relative z-10 pt-2 border-t border-white/10">
                        {appliedVouchers.map((v, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-3 py-1.5 bg-app rounded-full w-full"
                          >
                            <div className="flex items-center gap-2">
                              <Ticket size={12} className="text-action" />
                              <span className="text-[10px] font-bold text-action uppercase">
                                Voucher: {v.code}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-white">
                              - Rs. {v.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Subtle Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-app rounded-full -mr-16 -mt-16  pointer-events-none" />
                  </div>
                </motion.section>
              )}
            </form>
          )}
        </div>

        {/* Footer Actions */}
        {!isSuccess && items.length > 0 && (
          <div className="flex-shrink-0 py-4 border-t border-soft/10 flex items-center justify-between px-8 relative bg-app/80 backdrop-blur-md gap-4">
            <div className="w-[100px] flex-shrink-0">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 type-action text-description/60 hover:text-heading transition-all group py-2"
                >
                  <ArrowLeft
                    size={16}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  <span className="text-[9px] uppercase font-bold tracking-[0.2em] hidden sm:inline">
                    Back
                  </span>
                </button>
              )}
            </div>

            <Button
              form="checkout-form"
              type="submit"
              isLoading={
                isProcessing ||
                (activeStep === 1 && items.length > 0 && isInitialLoading)
              }
              disabled={
                activeStep === 1 && items.length > 0 && isInitialLoading
              }
              className="flex-1 max-w-[280px] !py-3.5 shadow-2xl shadow-action/10"
              rightIcon={
                activeStep < 4 ? (
                  <ChevronRight size={18} />
                ) : (
                  <ShieldCheck size={18} />
                )
              }
            >
              {activeStep === 1
                ? "Next: Contact Info"
                : activeStep === 2
                  ? "Next: Delivery"
                  : activeStep === 3
                    ? "Next: Payment"
                    : "Secure Order"}
            </Button>

            <div className="w-[100px] flex-shrink-0" />
          </div>
        )}
      </div>

      {/* Inquiry Modal Integration */}
      <InquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        initialData={inquiryData}
        title="Order Inquiry"
        subtitle="How can we help with your order?"
      />

    </Modal>
  );
}
