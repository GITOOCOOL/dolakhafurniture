"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Info, Mail, MapPin, Truck, Ticket, ShoppingBag, CheckCircle2, Minus, Plus, Trash2, Sparkles } from "lucide-react";
import Input from "@/components/ui/Input";
import { urlFor } from "@/lib/sanity";

interface ExpressCheckoutProps {
  items: any[];
  totalPieces: number;
  subtotal: number;
  discount: number;
  total: number;
  formData: any;
  onInputChange: (e: any) => void;
  isProcessing: boolean;
  appliedVouchers: any[];
  addItem: (product: any, quantity: number) => void;
  removeSingleItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  user: any | null;
  firstOrderVoucher: any | null;
  isFirstOrderExhausted: boolean;
  isInitialLoading: boolean;
  isAutoApplying: boolean;
  onSignUp: () => void;
}

export default function ExpressCheckout({
  items,
  totalPieces,
  subtotal,
  discount,
  total,
  formData,
  onInputChange,
  isProcessing,
  appliedVouchers,
  addItem,
  removeSingleItem,
  removeItem,
  user,
  firstOrderVoucher,
  isFirstOrderExhausted,
  isInitialLoading,
  isAutoApplying,
  onSignUp,
}: ExpressCheckoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* 1. CART REVIEW (STANDARD VERSION) */}
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
        <div className="flex justify-between items-center px-2">
          <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-description">
            Review Your Order
          </h4>
          <span className="text-[9px] font-bold px-2.5 py-1 bg-espresso text-bone rounded-full uppercase tracking-tighter">
            {totalPieces} Total Items
          </span>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 cart-scroll">
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
                      Rs. {(item.price * item.quantity).toLocaleString()}
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
      </div>

      {/* 2. AUTO-APPLY PROCESSING STATE */}
      {isAutoApplying && (
         <div className="bg-surface border border-soft/50 rounded-[1.5rem] p-6 flex flex-col items-center text-center gap-3 animate-pulse">
            <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-action animate-bounce [animation-delay:-0.3s]" />
               <div className="w-1.5 h-1.5 rounded-full bg-action animate-bounce [animation-delay:-0.15s]" />
               <div className="w-1.5 h-1.5 rounded-full bg-action animate-bounce" />
            </div>
            <p className="text-[9px] font-bold text-description uppercase tracking-[0.2em]">
              Scanning for optimal deals...
            </p>
         </div>
      )}


      {/* 2.5 WELCOME VOUCHER FAILSAVE */}
      {isInitialLoading ? (
         <div className="bg-surface border border-soft/20 rounded-[1.5rem] p-6 flex flex-col items-center text-center gap-3 animate-pulse">
            <div className="w-8 h-8 border-2 border-action border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-heading uppercase tracking-widest">
              Checking Voucher Eligibility...
            </p>
         </div>
      ) : (
        <>
          {/* 2.5a SIGNUP NUDGE (GUESTS ONLY) */}
          {!user && firstOrderVoucher && (
            <div className="bg-espresso/5 border border-espresso/10 rounded-[1.5rem] p-6 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in duration-500">
              <div className="w-10 h-10 bg-app rounded-full flex items-center justify-center shadow-sm">
                <Sparkles size={20} className="text-action animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-heading">
                  Want an extra {firstOrderVoucher.discountValue}% off?
                </p>
                <p className="text-[10px] text-description leading-relaxed">
                  Sign up now and get an extra discount on your first order. It only
                  takes 30 seconds!
                </p>
              </div>
              <button
                type="button"
                onClick={onSignUp}
                className="w-full py-2.5 bg-espresso text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-heading transition-all shadow-lg shadow-espresso/10"
              >
                Sign Up & Save {firstOrderVoucher.discountValue}%
              </button>
            </div>
          )}

          {/* 2.5b APPLIED SUCCESS (LOGGED IN & APPLIED) */}
          {user && appliedVouchers.some(v => v.isFirstOrderVoucher) && (
            <div className="bg-action/5 border border-action/20 rounded-[1.5rem] p-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <CheckCircle2 size={20} className="text-action" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-heading uppercase tracking-widest">First Order Discount Active</p>
                <p className="text-[10px] text-action italic">Your first order gift has been applied to this order 🏮</p>
              </div>
            </div>
          )}

          {/* 2.5c EXHAUSTED MESSAGE (LOGGED IN ONLY) */}
          {user && isFirstOrderExhausted && (
            <div className="bg-surface border border-soft/50 rounded-[1.5rem] p-6 flex flex-col items-center text-center gap-3">
              <div className="w-8 h-8 bg-soft/20 rounded-full flex items-center justify-center">
                <Ticket size={16} className="text-description opacity-40" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-heading uppercase tracking-widest">
                  First Order Voucher Exhausted
                </p>
                <p className="text-[10px] text-description italic">
                  First order voucher already used in your previous purchase, don't
                  worry more offers might be there in the future!
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* 3. PAYMENT & TOTAL SUMMARY (MOVED UP) */}
      <div className="bg-espresso rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-app">
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Truck size={18} />
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold tracking-widest opacity-60">
                  Payment Mode
                </p>
                <p className="text-sm font-bold">Cash on Delivery</p>
              </div>
            </div>
            <CheckCircle2 size={24} className="text-white/40" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-white/60">
              <span className="text-xs">Subtotal</span>
              <span className="text-sm font-bold">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>
            {appliedVouchers.length > 0 && (
              <div className="space-y-1 py-1">
                {appliedVouchers.map((v, i) => (
                  <div key={i} className="flex justify-between items-center text-action/90 animate-in fade-in slide-in-from-right-2">
                    <div className="flex items-center gap-1.5">
                      <Ticket size={10} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{v.code}</span>
                    </div>
                    <span className="text-[11px] font-bold">
                      - Rs. {v.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2">
              <span className="text-sm font-bold text-white uppercase tracking-widest">
                To Pay
              </span>
              <span className="text-2xl font-bold text-white tracking-tight">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-action/10 rounded-full -mr-16 -mt-16 blur-3xl" />
      </div>

      {/* 4. CUSTOMER DETAILS */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <User size={14} className="text-action" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-description">
            Personal Information
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            required
            value={formData.firstName}
            onChange={onInputChange}
            placeholder="e.g. Rahul"
          />
          <Input
            label="Last Name"
            name="lastName"
            required
            value={formData.lastName}
            onChange={onInputChange}
            placeholder="e.g. Sharma"
          />
        </div>
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={onInputChange}
          placeholder="98XXXXXXXX"
          leftIcon={
            <span className="text-[10px] font-bold pr-2 border-r border-soft mr-2">
              +977
            </span>
          }
        />
        <Input
          label="Email (Optional)"
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          placeholder="For order tracking updates"
          icon={Mail}
        />
      </div>

      {/* 5. ADDRESS DETAILS */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <MapPin size={14} className="text-action" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-description">
            Delivery Address
          </span>
        </div>
        <Input
          label="Tole / Area"
          name="apartment"
          required
          value={formData.apartment}
          onChange={onInputChange}
          placeholder="e.g. Samakhusi / Gongabu"
          icon={MapPin}
        />
        <Input
          label="Town / City"
          name="city"
          required
          value={formData.city}
          onChange={onInputChange}
          placeholder="e.g. Kathmandu"
        />
      </div>
      {/* 6. TRUST FOOTER */}
      <div className="bg-surface border border-soft/30 rounded-[2rem] p-6 flex items-start gap-4 shadow-sm">
        <div className="w-8 h-8 bg-description/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Info size={14} className="text-description opacity-60" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-heading uppercase tracking-widest">Important Info / आवश्यक जानकारी</p>
          <p className="text-xs font-bold text-description italic">
            अर्डर पक्का गर्न हाम्रो टिमले तपाईंलाई फोन गर्नेछ ।
          </p>
          <p className="text-[9px] text-description/60">
            Our team will call you to confirm the order details before we begin processing your order.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
