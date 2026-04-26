"use client";

import { useCart } from "@/store/useCart";
import { useState, useEffect, useMemo } from "react";
import { urlFor, client } from "@/lib/sanity";
import { processOrder } from "@/app/actions/checkout";
import { validateVoucher, checkVoucherUsage } from "@/app/actions/vouchers";
import {
  paymentAccountsQuery,
  activeCampaignsQuery,
  checkoutSettingsQuery,
} from "@/lib/queries";
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
import ExpressCheckout from "@/components/ExpressCheckout";

import { firstOrderVoucherQuery } from "@/lib/queries";
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
  const [firstOrderVoucher, setFirstOrderVoucher] = useState<Voucher | null>(
    null,
  );
  const [isFirstOrderExhausted, setIsFirstOrderExhausted] = useState(false);
  const [hasPromptedVoucherReminder, setHasPromptedVoucherReminder] =
    useState(false);
  const [showVoucherReminder, setShowVoucherReminder] = useState(false);
  const [checkoutMethod, setCheckoutMethod] = useState<"standard" | "express">(
    "standard",
  );
  const [isAutoApplying, setIsAutoApplying] = useState(false);

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
  const [voucherStatuses, setVoucherStatuses] = useState<
    Record<string, "success" | "invalid" | "untried">
  >({});

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

  // AUTO-APPLY VOUCHER LOGIC (Express Mode)
  useEffect(() => {
    if (
      isOpen &&
      items.length > 0 &&
      checkoutMethod === "express" &&
      campaigns.length > 0 &&
      !isAutoApplying &&
      !isInitialLoading
    ) {
      const applyAllPossible = async () => {
        setIsAutoApplying(true);
        let totalDiscount = 0;
        const newApplied: any[] = [];

        // Collect all available vouchers from active campaigns
        const allCandidateVouchers = campaigns.flatMap((c) => c.vouchers || []);

        for (const v of allCandidateVouchers) {
          // SKIP First-Order Vouchers if the user has already used one
          if (v.isFirstOrderVoucher && isFirstOrderExhausted) {
            continue;
          }

          try {
            const result = await validateVoucher(v.code);
            if (result.success) {
              let discountVal = 0;
              if (result.discountType === "percentage") {
                discountVal = Math.floor(
                  (subtotal * result.discountValue!) / 100,
                );
              } else {
                discountVal = result.discountValue!;
              }
              totalDiscount += discountVal;
              newApplied.push({ ...v, amount: discountVal });
              setVoucherStatuses((prev) => ({
                ...prev,
                [v.code.toUpperCase()]: "success",
              }));
            } else {
              setVoucherStatuses((prev) => ({
                ...prev,
                [v.code.toUpperCase()]: "invalid",
              }));
            }
          } catch (err) {
            console.error("Auto-apply error:", err);
            setVoucherStatuses((prev) => ({
              ...prev,
              [v.code.toUpperCase()]: "invalid",
            }));
          }
        }

        if (newApplied.length > 0) {
          setDiscount(totalDiscount);
          setAppliedVouchers(newApplied);
        }
        setIsAutoApplying(false);
      };
      applyAllPossible();
    }
  }, [
    isOpen,
    checkoutMethod,
    campaigns,
    items.length,
    subtotal,
    isFirstOrderExhausted,
    isInitialLoading,
  ]);

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

  // FORM VALIDATION LOGIC
  const isFormValid = useMemo(() => {
    const { firstName, lastName, phone, apartment, city } = formData;

    // For Express (Single Page): Every required field must be present
    if (checkoutMethod === "express") {
      return !!(
        firstName.trim() &&
        lastName.trim() &&
        phone.trim() &&
        apartment.trim() &&
        city.trim()
      );
    }

    // For Standard (Multi-step): Validate based on current visual step
    if (activeStep === 2) {
      return !!(firstName.trim() && lastName.trim() && phone.trim());
    }
    if (activeStep === 3) {
      return !!(apartment.trim() && city.trim());
    }

    return true; // Steps 1 and 4 are logically always valid to proceed
  }, [formData, checkoutMethod, activeStep]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsInitialLoading(true);
        const [campaignsData, accounts, settings] = await Promise.all([
          client.fetch(activeCampaignsQuery),
          client.fetch(paymentAccountsQuery),
          client.fetch(checkoutSettingsQuery),
        ]);

        setCampaigns(campaignsData);
        setPaymentAccounts(accounts);
        if (settings?.method) setCheckoutMethod(settings.method);

        // Derive first order voucher from campaigns
        const firstOrder = campaignsData
          .flatMap((c: any) => c.vouchers || [])
          .find((v: any) => v.isFirstOrderVoucher);

        setFirstOrderVoucher(firstOrder);

        // Check first order voucher usage if logged in
        if (propsUser && firstOrder) {
          const exhausted = await checkVoucherUsage(
            firstOrder.code,
            propsUser.id,
            propsUser.email,
          );
          setIsFirstOrderExhausted(exhausted);
        }

        // Sync with prop user
        setUser(propsUser);

        if (propsUser) {
          // Pre-fill form data once
          setFormData((prev) => ({
            ...prev,
            email: propsUser.email || "",
            firstName: propsUser.user_metadata.full_name?.split(" ")[0] || "",
            lastName:
              propsUser.user_metadata.full_name
                ?.split(" ")
                .slice(1)
                .join(" ") || "",
          }));

          setInquiryData((prev) => ({
            ...prev,
            name: propsUser.user_metadata.full_name || "",
            email: propsUser.email || "",
          }));
        }
      } catch (error) {
        console.error("Error loading checkout data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    if (isOpen) fetchData();
  }, [supabase, isOpen, items.length, propsUser]);

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
        setVoucherStatuses((prev) => ({
          ...prev,
          [voucherInput.toUpperCase()]: "success",
        }));
        setVoucherInput("");
      } else {
        setVoucherError(result.message || "Invalid voucher.");
        setVoucherStatuses((prev) => ({
          ...prev,
          [voucherInput.toUpperCase()]: "invalid",
        }));
      }
    } catch (err) {
      setVoucherError("Failed to apply voucher.");
      setVoucherStatuses((prev) => ({
        ...prev,
        [voucherInput.toUpperCase()]: "invalid",
      }));
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    // EXPRESS CHECKOUT FAST-PATH
    if (checkoutMethod === "express") {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.phone ||
        !formData.city ||
        !formData.apartment
      ) {
        alert("Please fill in all details (Name, Phone, City, Tole/Area).");
        return;
      }
      const phoneRegex = /^9\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        alert(
          "Please enter a valid 10-digit Nepal phone number starting with 9.",
        );
        return;
      }

      setIsProcessing(true);
      try {
        const voucherCodes = appliedVouchers.map((v) => v.code);
        // Force COD for express
        const result = await processOrder(
          items,
          finalTotal,
          { ...formData, paymentMethod: "cod" },
          voucherCodes,
        );
        if (result.success) {
          setOrderNumber(result.orderNumber || null);
          setIsSuccess(true);
          trackEvent("Purchase", {
            content_ids: items.map((item) => item._id.replace("drafts.", "")),
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
          error.message ||
            "An error occurred during checkout. Please try again.",
        );
      } finally {
        setIsProcessing(false);
      }
      return;
    }

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
      if (!formData.city || !formData.apartment) {
        alert("Please provide the delivery city and tole/area.");
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
            <span className="type-label text-description/60 text-[9px] translate-y-[1px] font-bold uppercase tracking-widest leading-relaxed">
              {checkoutMethod === "express" ? (
                "Cash on Delivery Order ( You pay after the item is delivered )"
              ) : (
                <>
                  Step {activeStep} of 4:{" "}
                  {activeStep === 1
                    ? "Review / Vouchers"
                    : activeStep === 2
                      ? "Customer Details"
                      : activeStep === 3
                        ? "Delivery Info"
                        : "Finalize Payment"}
                </>
              )}
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
                  href="https://www.facebook.com/dolakhafurniture/"
                  target="_blank"
                  className="text-app hover:text-[#1877F2] transition-all hover:scale-110"
                >
                  <Facebook size={22} strokeWidth={1.5} />
                </a>
                <a
                  href="https://www.instagram.com/dolakhafurnituredesign/"
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
              {checkoutMethod === "express" ? (
                <ExpressCheckout
                  items={items}
                  totalPieces={totalPieces}
                  subtotal={subtotal}
                  discount={discount}
                  total={finalTotal}
                  formData={formData}
                  onInputChange={handleInputChange}
                  isProcessing={isProcessing}
                  appliedVouchers={appliedVouchers}
                  addItem={addItem}
                  removeSingleItem={removeSingleItem}
                  removeItem={removeItem}
                  user={user}
                  firstOrderVoucher={firstOrderVoucher}
                  isFirstOrderExhausted={isFirstOrderExhausted}
                  isInitialLoading={isInitialLoading}
                  isAutoApplying={isAutoApplying}
                  onSignUp={onSignUp}
                />
              ) : (
                <>
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
                            Review Your Order
                          </h4>
                          <span className="text-[9px] font-bold px-2.5 py-1 bg-espresso text-bone rounded-full uppercase tracking-tighter">
                            {totalPieces} Total Items
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
                                    src={urlFor(item.mainImage)
                                      .width(160)
                                      .url()}
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
                                        onClick={() =>
                                          removeSingleItem(item._id)
                                        }
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

                      {/* Summary with Integrated Voucher Input */}
                      <div className="bg-app border border-divider p-8 rounded-[2.5rem] mt-12">
                        <div className="flex justify-between items-center pb-6 border-b border-soft/50">
                          <div className="flex items-center gap-4">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[120px]">
                              {items.slice(0, 3).map((item) => (
                                <div
                                  key={item._id}
                                  className="w-10 h-10 rounded-xl border border-soft overflow-hidden bg-app flex-shrink-0"
                                >
                                  <img
                                    src={urlFor(item.mainImage).width(80).url()}
                                    className="w-full h-full object-contain p-1"
                                    alt={item.title}
                                  />
                                </div>
                              ))}
                            </div>
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-label">
                                Order Summary
                              </p>
                              <p className="text-xs font-sans font-bold text-heading">
                                {totalPieces} Items
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-label opacity-40">
                              Total
                            </p>
                            <p className="text-xl font-sans font-bold text-action">
                              Rs. {finalTotal.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Vouchers in Summary */}
                        {appliedVouchers.length > 0 && (
                          <div className="py-4 space-y-2 border-b border-soft/30">
                            {appliedVouchers.map((v, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between px-3 py-2 bg-action/5 rounded-xl border border-action/10"
                              >
                                <div className="flex items-center gap-2">
                                  <Ticket size={12} className="text-action" />
                                  <span className="text-[10px] font-bold text-action uppercase tracking-tight">
                                    {v.code}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-action">
                                    -Rs. {v.amount.toLocaleString()}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setAppliedVouchers((prev) =>
                                        prev.filter((_, i) => i !== idx),
                                      );
                                      setDiscount((prev) => prev - v.amount);
                                    }}
                                    className="p-1 hover:text-red-500 transition-colors"
                                  >
                                    <Minus size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Compact Ribbon for Step 2 */}
                        {((firstOrderVoucher &&
                          !isFirstOrderExhausted &&
                          user?.id) ||
                          campaigns.some((c) => c.vouchers?.length)) && (
                          <div className="flex flex-wrap gap-2 py-4 border-b border-soft/30">
                            {firstOrderVoucher &&
                              user?.id &&
                              !isFirstOrderExhausted &&
                              !appliedVouchers.some(
                                (v) => v.code === firstOrderVoucher.code,
                              ) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setVoucherInput(firstOrderVoucher.code);
                                    setVoucherError("");
                                  }}
                                  className="text-[9px] font-bold text-action bg-action/5 px-3 py-1.5 rounded-full border border-action/20 hover:bg-action hover:text-white transition-all active:scale-95"
                                >
                                  Apply First Order Gift 🎁
                                </button>
                              )}
                            {campaigns
                              .flatMap((c) => c.vouchers || [])
                              .filter(
                                (v) =>
                                  v.code !== firstOrderVoucher?.code &&
                                  !appliedVouchers.some(
                                    (av) =>
                                      av.code.toUpperCase() ===
                                      v.code.toUpperCase(),
                                  ),
                              )
                              .map((v, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => {
                                    setVoucherInput(v.code);
                                    setVoucherError("");
                                  }}
                                  className="text-[9px] font-bold text-description bg-surface px-3 py-1.5 rounded-full border border-soft hover:border-action transition-all active:scale-95"
                                >
                                  {v.code}
                                </button>
                              ))}
                          </div>
                        )}

                        <div className="pt-4 flex gap-2">
                          <Input
                            placeholder="Voucher code?"
                            value={voucherInput}
                            onChange={(e: any) => {
                              setVoucherInput(e.target.value.toUpperCase());
                              setVoucherError("");
                            }}
                            className="flex-1 !py-2.5 !rounded-xl !text-xs"
                            containerClassName="!gap-0"
                          />
                          <Button
                            type="button"
                            onClick={handleApplyVoucher}
                            isLoading={isApplyingVoucher}
                            variant="outline"
                            className="!px-6 !py-2.5 !rounded-xl text-[10px] font-bold border-soft"
                          >
                            Apply
                          </Button>
                        </div>
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
                        label="Tole / Area"
                        required
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        placeholder="e.g. Samakhusi"
                        icon={MapPin}
                      />
                      <Input
                        label="Town / City"
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Kathmandu"
                      />
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-description ml-4">
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          name="address"
                          placeholder="Specific delivery instructions or location reminders..."
                          value={formData.address}
                          onChange={(e: any) => handleInputChange(e)}
                          className="w-full bg-surface border border-soft rounded-2xl p-6 text-sm focus:ring-1 focus:ring-action outline-none min-h-[120px] transition-all"
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
                                className="w-10 h-10 rounded-xl border border-soft overflow-hidden bg-app flex-shrink-0"
                              >
                                <img
                                  src={urlFor(item.mainImage).width(80).url()}
                                  className="w-full h-full object-contain p-1"
                                  alt={item.title}
                                />
                              </div>
                            ))}
                          </div>
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-label">
                              Current Order
                            </p>
                            <p className="text-xs font-sans font-bold text-heading">
                              {totalPieces} Items
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
                            Pay with cash when your order arrives.
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
                                  {account.accountName} •{" "}
                                  {account.accountNumber}
                                </span>
                              </div>
                            </div>
                            {account.qrCodeImage && (
                              <div className="bg-white p-4 rounded-xl flex justify-center border border-soft/20 shadow-sm transition-all group-hover:shadow-md">
                                <img
                                  src={urlFor(account.qrCodeImage)
                                    .width(120)
                                    .url()}
                                  className="h-24 w-24 object-contain"
                                  alt="QR Code"
                                />
                              </div>
                            )}
                          </label>
                        ))}
                      </div>

                      {/* Final Summary Bar */}
                      <div className="p-8 bg-espresso rounded-3xl mt-12 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center relative z-10">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-label">
                              Total Order
                            </p>
                            <p className="text-lg font-sans font-bold text-white">
                              {totalPieces} Items
                            </p>
                          </div>
                          <p className="text-3xl font-sans font-bold text-white tracking-tight">
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
                                <span className="text-[10px] font-bold text-heading">
                                  - Rs. {v.amount.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.section>
                  )}
                </>
              )}
            </form>
          )}
        </div>
        {!isSuccess && items.length > 0 && (
          <div className="flex-shrink-0 border-t border-divider bg-app/95 backdrop-blur-sm shadow-[0_-10px_20px_rgba(0,0,0,0.03)] transition-all">
            {checkoutMethod === "express" ? (
              <div className="flex flex-col w-full max-w-4xl mx-auto divide-y divide-soft/10">
                {/* Row 1: Voucher Sentinel */}
                <div className="py-2 border-b border-soft/30 bg-surface/30 backdrop-blur-sm overflow-hidden min-h-[50px] flex flex-col justify-center gap-1">
                  <div className="px-6 flex items-center justify-between">
                    <span className="text-[8px] font-bold text-description uppercase tracking-[0.2em] opacity-60">
                      autoapplying eligible discounts
                    </span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {isInitialLoading || isAutoApplying ? (
                      <div className="flex items-center gap-2 animate-pulse">
                        <div className="flex gap-1">
                          <div className="w-1 h-1 rounded-full bg-action animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-1 h-1 rounded-full bg-action animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-1 h-1 rounded-full bg-action animate-bounce" />
                        </div>
                        <span className="text-[9px] font-bold text-description uppercase tracking-widest">
                          Scanning and validating vouchers...
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {/* Sign-up Nudge Pill */}
                        {!user && firstOrderVoucher && (
                          <button
                            type="button"
                            onClick={onSignUp}
                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-espresso text-white rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-lg shadow-espresso/20 hover:scale-105 transition-all relative overflow-hidden group/signup border-2 border-emerald-500"
                          >
                            <Sparkles
                              size={11}
                              className="animate-bounce text-yellow-300"
                            />
                            <span className="relative z-10 font-black text-[8px]">EXTRA {firstOrderVoucher.discountValue}% CLICK HERE 🎉</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/signup:translate-x-full transition-transform duration-1000" />
                          </button>
                        )}

                        {/* Combined Vouchers (Campaigns) */}
                        <div className="flex items-center gap-2">
                          {Array.from(
                            new Map(
                              campaigns
                                .flatMap((c) => c.vouchers || [])
                                .map((v: any) => [v.code.toUpperCase(), v]),
                            ).values(),
                          ).map((v, i) => {
                            const isFirstOrder = v.isFirstOrderVoucher;
                            if (isFirstOrder && !user) return null;
                            const isExhausted =
                              isFirstOrder && isFirstOrderExhausted;
                            const status = isExhausted
                              ? "invalid"
                              : voucherStatuses[v.code.toUpperCase()] ||
                                "untried";
                            const isApplied = appliedVouchers.some(
                              (av) =>
                                av.code.toUpperCase() === v.code.toUpperCase(),
                            );

                            return (
                              <button
                                key={i}
                                type="button"
                                disabled={isExhausted}
                                onClick={() => {
                                  if (!isApplied && !isExhausted) {
                                    setVoucherInput(v.code);
                                    handleApplyVoucher();
                                  }
                                }}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold transition-all active:scale-95 shadow-sm border ${
                                  isApplied || status === "success"
                                    ? "bg-action/10 border-action text-action"
                                    : status === "invalid"
                                      ? "bg-red-50 border-red-300 text-red-700 opacity-90"
                                      : "bg-surface border-soft hover:border-action text-description hover:text-action"
                                }`}
                              >
                                <Tag
                                 size={8}
                                 className={
                                   isApplied || status === "success"
                                     ? "fill-action/20"
                                     : status === "invalid"
                                       ? "fill-red-500/10"
                                       : ""
                                 }
                               />
                               <span className="text-[8px]">{v.code}</span>
                               {isApplied && (
                                 <div className="flex items-center gap-1 ml-1 bg-action/20 px-1 rounded-xs text-[6.5px] animate-in fade-in zoom-in duration-300">
                                   <CheckCircle2 size={6} />
                                   Applied
                                 </div>
                               )}
                                {isExhausted && (
                                  <span className="opacity-80 ml-1 font-medium">
                                    Spent
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {appliedVouchers.length === 0 &&
                          !isAutoApplying &&
                          campaigns.length === 0 &&
                          !firstOrderVoucher && (
                            <span className="text-[9px] font-bold text-description/40 uppercase tracking-widest italic">
                              No active vouchers found
                            </span>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-0 py-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-description uppercase tracking-widest opacity-40 leading-none mb-1">
                          Subtotal
                        </span>
                        <div className="flex items-center gap-1.5 font-sans font-bold text-heading/80 text-base leading-none">
                           <span className="opacity-30 line-through">
                             {total.toLocaleString()}
                           </span>
                           {discount > 0 && (
                             <span className="text-action">
                               -{discount.toLocaleString()}
                             </span>
                           )}
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[9px] font-extrabold text-description uppercase tracking-widest leading-none mb-1">
                          Total
                        </span>
                        <span className="text-lg font-sans font-bold text-heading leading-none whitespace-nowrap underline underline-offset-4 decoration-heading/20">
                          Rs. {finalTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                  </div>


                  <div className="flex-1 max-w-[280px]">
                    <Button
                      form="checkout-form"
                      type="submit"
                      isLoading={isProcessing || isInitialLoading}
                      disabled={
                        isProcessing || isInitialLoading || !isFormValid
                      }
                      fullWidth
                      className="!py-3 bg-success hover:bg-success/90 text-espresso shadow-xl shadow-success/20 border-none group/confirm"
                      rightIcon={
                        <ShieldCheck size={18} className="text-espresso" />
                      }
                    >
                      <div className="flex flex-col items-center leading-tight">
                        <span className="text-sm font-bold uppercase tracking-widest text-espresso">
                          Confirm
                        </span>
                        <span className="text-[8px] font-bold text-espresso/60 normal-case tracking-tight">
                          (Cash on Delivery)
                        </span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
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

                <div className="flex-1 flex flex-col items-center">
                  <Button
                    form="checkout-form"
                    type="submit"
                    isLoading={
                      isProcessing ||
                      (activeStep === 1 && items.length > 0 && isInitialLoading)
                    }
                    disabled={isProcessing || isInitialLoading || !isFormValid}
                    className="w-full max-w-[280px] !py-3.5 shadow-2xl shadow-action/10"
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
                </div>

                <div className="w-[100px] flex-shrink-0" />
              </div>
            )}
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
