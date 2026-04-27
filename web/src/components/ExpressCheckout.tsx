"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Info, Mail, MapPin, Truck, Ticket, ShoppingBag, CheckCircle2, Minus, Plus, Trash2, Sparkles, ArrowLeft } from "lucide-react";
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
  step: number;
  hasOverflow?: boolean;
  onBack: () => void;
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
  step,
  hasOverflow,
  onBack,
}: ExpressCheckoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
      key={step}
    >
      {step === 1 ? (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center py-4">
            <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-description underline underline-offset-4 decoration-description/30">
              {hasOverflow ? "Scroll to review your order" : "Review your order"}
            </h4>
          </div>

          <div className="space-y-4">
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
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
          {/* Top Navigation */}
          <div className="px-2">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-description/60 hover:text-heading transition-all group py-2"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Go Back to Review</span>
            </button>
          </div>

          {/* CUSTOMER DETAILS */}
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

          {/* ADDRESS DETAILS */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <MapPin size={14} className="text-action" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-description">
                Delivery Address / तोल (क्षेत्र)
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

          {/* TRUST FOOTER */}
          <div className="bg-surface border border-soft/30 rounded-[2.5rem] p-8 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 bg-description/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Info size={16} className="text-description opacity-60" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-heading uppercase tracking-widest leading-tight">आवश्यक जानकारी</p>
              <p className="text-[13px] font-bold text-description italic leading-snug">
                अर्डर पक्का गर्न हाम्रो टिमले तपाईंलाई फोन गर्नेछ ।
              </p>
              <p className="text-[10px] text-description/60 leading-relaxed font-sans">
                Our team will call you to confirm order details before processing.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
