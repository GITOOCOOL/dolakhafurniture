"use client";

import { useCart } from "@/store/useCart";
import Link from "next/link";
import { useState, useEffect } from "react";
import { urlFor, client } from "@/lib/sanity";
import { processOrder } from "@/app/actions/checkout";
import { submitInquiry } from "@/app/actions/inquiry";
import { validateVoucher } from "@/app/actions/vouchers";
import { paymentAccountsQuery } from "@/lib/queries";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Leaf,
  CreditCard,
  Truck,
  ChevronRight,
  Info,
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
  Ticket
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  const supabase = createClient();
  const { items, removeItem, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  // Voucher State
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  const router = useRouter();

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
  const shipping = formData.shippingMethod === "express" ? 500 : 0;
  const total = subtotal + shipping;
  const finalTotal = Math.max(0, total - discount);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
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
      }

      const accounts = await client.fetch(paymentAccountsQuery);
      setPaymentAccounts(accounts);
    };
    fetchData();
  }, [supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInquiryData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
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
        setDiscount(discountVal);
        setAppliedVoucher({ code: voucherInput, ...result });
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
    setIsProcessing(true);
    try {
      // Pass finalTotal to processOrder
      const result = await processOrder(items, finalTotal, formData);
      if (result.success) {
        setIsSuccess(true);
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || "An error occurred during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus('submitting');
    try {
      const result = await submitInquiry(inquiryData);
      if (result.success) {
        setInquiryStatus('success');
        setTimeout(() => {
          setShowInquiryModal(false);
          setInquiryStatus('idle');
        }, 2000);
      } else {
        setInquiryStatus('error');
      }
    } catch (error) {
      setInquiryStatus('error');
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-32 pb-20 bg-[#fdfaf5] min-h-screen text-[#3d2b1f] selection:bg-[#a3573a]/10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-6 max-w-2xl text-center"
        >
          <div className="w-24 h-24 bg-[#a3573a]/10 rounded-full flex items-center justify-center mx-auto mb-10 text-[#a3573a]">
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </div>
          
          <h1 className="text-5xl font-serif italic mb-6">Order Received.</h1>
          <p className="text-lg text-[#a89f91] mb-12 max-w-lg mx-auto leading-relaxed">
            Thank you for choosing Dolakha Furniture. We have received your order and will contact you shortly to confirm the details.
          </p>

          {/* SIGNUP INCENTIVE FOR GUESTS */}
          {!user && (
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-[#3d2b1f] text-white rounded-[2rem] p-8 mb-16 relative overflow-hidden group"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#a3573a] blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative z-10">
                   <div className="inline-flex items-center gap-2 bg-[#a3573a] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-4">
                      Special Offer <Tag size={10} />
                   </div>
                   <h3 className="text-2xl font-serif italic mb-2">Claim your welcome gift.</h3>
                   <p className="text-xs text-[#a89f91] mb-8 max-w-xs mx-auto">Create an account now and get <strong>10% OFF</strong> your next handcrafted piece. Use code <span className="text-white border-b border-white/30">WELCOME10</span> at signup.</p>
                   <Link 
                    href="/auth" 
                    className="inline-flex items-center gap-2 bg-white text-[#3d2b1f] px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#a3573a] hover:text-white transition-all shadow-lg"
                   >
                     Sign Up & Claim <Ticket size={14} />
                   </Link>
                </div>
             </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mb-16">
            <Link 
              href="/shop" 
              className="group flex items-center justify-center gap-2 bg-[#3d2b1f] text-white px-8 py-5 rounded-full font-sans font-bold uppercase tracking-widest hover:bg-[#a3573a] transition-all"
            >
              Continue Shopping <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={() => {
                setInquiryData(prev => ({ ...prev, phone: formData.phone }));
                setShowInquiryModal(true);
              }}
              className="flex items-center justify-center gap-2 bg-white border border-[#e5dfd3] text-[#3d2b1f] px-8 py-5 rounded-full font-sans font-bold uppercase tracking-widest hover:border-[#a3573a] hover:text-[#a3573a] transition-all"
            >
              Inquiry / Track <Package size={16} />
            </button>
          </div>

          <div className="bg-white/50 border border-[#e5dfd3] rounded-[2rem] p-8 max-w-md mx-auto backdrop-blur-sm">
             <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-[#3d2b1f] rounded-full flex items-center justify-center text-white shrink-0">
                   <Info size={18} />
                </div>
                <div>
                   <h4 className="text-sm font-bold mb-1">Next Steps</h4>
                   <p className="text-xs text-[#a89f91] leading-relaxed">
                     Our team will review your order within 24 hours. If you chose Cash on Delivery, please have the amount ready upon arrival. For Bank Transfers, please ensure you've sent the screenshot to our support.
                   </p>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Inquiry Modal */}
        <AnimatePresence>
          {showInquiryModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowInquiryModal(false)}
                className="absolute inset-0 bg-[#3d2b1f]/20 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-[#fdfaf5] border border-[#e5dfd3] rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
              >
                <button 
                  onClick={() => setShowInquiryModal(false)}
                  className="absolute top-6 right-6 p-2 text-[#a89f91] hover:text-[#3d2b1f] transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="mb-10 text-center">
                  <div className="w-16 h-16 bg-[#3d2b1f]/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Package className="text-[#3d2b1f]" size={32} />
                  </div>
                  <h3 className="text-3xl font-serif italic mb-2">Track your Order</h3>
                  <p className="text-xs text-[#a89f91] uppercase tracking-[0.2em]">Our team will get back to you shortly</p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-6">
                  <div className="space-y-4">
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="Your Full Name"
                      value={inquiryData.name}
                      onChange={handleInquiryChange}
                      className="w-full bg-white border border-[#e5dfd3] px-8 py-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        required
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={inquiryData.email}
                        onChange={handleInquiryChange}
                        className="w-full bg-white border border-[#e5dfd3] px-8 py-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all"
                      />
                      <input
                        required
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={inquiryData.phone}
                        onChange={handleInquiryChange}
                        className="w-full bg-white border border-[#e5dfd3] px-8 py-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all"
                      />
                    </div>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      placeholder="Your message (Order ID, Inquiry detail, etc.)"
                      value={inquiryData.message}
                      onChange={handleInquiryChange}
                      className="w-full bg-white border border-[#e5dfd3] px-8 py-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={inquiryStatus === 'submitting'}
                    className={`w-full py-5 rounded-full font-sans font-bold uppercase tracking-widest text-[10px] transition-all duration-500
                      ${inquiryStatus === 'submitting' 
                        ? 'bg-[#e5dfd3] text-[#a89f91]' 
                        : inquiryStatus === 'success'
                        ? 'bg-green-600 text-white'
                        : 'bg-[#3d2b1f] text-white hover:bg-[#a3573a]'
                      }`}
                  >
                    {inquiryStatus === 'submitting' ? "Sending..." : inquiryStatus === 'success' ? "Inquiry Sent!" : "Submit Inquiry"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 bg-[#fdfaf5] min-h-screen text-[#3d2b1f]">
        <div className="container mx-auto px-6 max-w-xl text-center">
          <ShoppingBag className="w-16 h-16 text-[#e5dfd3] mx-auto mb-8" />
          <h1 className="text-4xl font-serif italic mb-6">Your spaces await.</h1>
          <p className="text-[#a89f91] mb-12">Your cart is currently empty. Explore our handcrafted pieces to find your next favorite.</p>
          <Link href="/shop" className="inline-block bg-[#3d2b1f] text-white px-12 py-5 rounded-full font-sans font-bold uppercase tracking-widest hover:bg-[#a3573a] transition-all">
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#fdfaf5] min-h-screen text-[#3d2b1f] selection:bg-[#a3573a]/10">
      <div className="container mx-auto px-4 md:px-6">

        {/* TOP MOBILE LOGO (Centered) */}
        <div className="flex justify-center mb-10 md:hidden">
          <Link href="/" className="text-3xl font-serif italic">Dolakha<span className="text-[#a3573a]">.</span></Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-16 items-start">

          {/* LEFT COLUMN: CHECKOUT FLOW */}
          <div className="lg:col-span-7 order-2 lg:order-1 pt-10 lg:pt-0">

            {/* Steps / Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#a89f91] mb-12 overflow-x-auto no-scrollbar whitespace-nowrap">
              <Link href="/checkout" className="text-[#3d2b1f]">Information</Link>
              <ChevronRight size={12} />
              <span className={activeStep >= 2 ? "text-[#3d2b1f]" : ""}>Shipping</span>
              <ChevronRight size={12} />
              <span className={activeStep >= 3 ? "text-[#3d2b1f]" : ""}>Payment</span>
            </nav>

            <form onSubmit={handleCheckout} className="space-y-12">

              {/* CONTACT SECTION */}
              <section className="space-y-6">
                <div className="flex justify-between items-end">
                  <h2 className="text-2xl font-serif italic">Contact</h2>
                  {!user && (
                    <div className="text-[11px] text-[#a89f91]">
                      Have an account? <Link href="/auth" className="text-[#a3573a] underline underline-offset-4">Log in</Link>
                    </div>
                  )}
                </div>

                {/* PHONE (Priority in Nepal) */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2 border-r border-[#e5dfd3]">
                    <span className="text-[10px] font-bold">NP</span>
                    <span className="text-[10px] text-[#a89f91]">+977</span>
                  </div>
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e5dfd3] pl-20 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all"
                  />
                </div>

                {/* EMAIL */}
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89f91] group-focus-within:text-[#a3573a] transition-colors" size={18} />
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e5dfd3] px-12 py-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="subscribe"
                    className="w-5 h-5 rounded-md border-[#e5dfd3] text-[#a3573a] focus:ring-[#a3573a]/20"
                  />
                  <label htmlFor="subscribe" className="text-xs text-[#3d2b1f]/80">Email me with news and offers</label>
                </div>
              </section>

              {/* DELIVERY SECTION */}
              <section className="space-y-6">
                <h2 className="text-2xl font-serif italic">Delivery</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89f91]" size={18} />
                    <input
                      required
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#e5dfd3] px-12 py-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all"
                    />
                  </div>
                  <input
                    required
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e5dfd3] px-6 py-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89f91]" size={18} />
                  <input
                    required
                    type="text"
                    name="address"
                    placeholder="Area, Building, or Street"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e5dfd3] px-12 py-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all"
                  />
                </div>

                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-[#e5dfd3] px-6 py-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    name="city"
                    placeholder="City / Tole"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e5dfd3] px-6 py-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all"
                  />
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e5dfd3] px-6 py-5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all appearance-none"
                  >
                    <option value="Bagmati">Bagmati</option>
                    <option value="Gandaki">Gandaki</option>
                    <option value="Lumbini">Lumbini</option>
                    <option value="Koshi">Koshi</option>
                    <option value="Madhesh">Madhesh</option>
                    <option value="Karnali">Karnali</option>
                    <option value="Sudurpashchim">Sudurpashchim</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded-md border-[#e5dfd3] text-[#a3573a] focus:ring-[#a3573a]/20"
                  />
                  <label htmlFor="saveInfo" className="text-xs text-[#3d2b1f]/80">Save this information for later</label>
                </div>
              </section>

              {/* SHIPPING METHOD */}
              <section className="space-y-6">
                <h2 className="text-2xl font-serif italic">Shipping method</h2>
                <div className="bg-white border border-[#e5dfd3] rounded-[2rem] overflow-hidden">
                  <label className="flex items-center justify-between p-6 cursor-pointer hover:bg-[#fdfaf5]/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={formData.shippingMethod === "standard"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#3d2b1f] focus:ring-[#3d2b1f]"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">In-Home Delivery (Kathmandu Valley)</span>
                        <span className="text-[10px] text-[#a89f91]">2-5 working days</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#a3573a]">Free</span>
                  </label>
                  <label className="flex items-center justify-between p-6 cursor-pointer border-t border-[#e5dfd3] hover:bg-[#fdfaf5]/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={formData.shippingMethod === "express"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#3d2b1f] focus:ring-[#3d2b1f]"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">Standard Delivery (Outside Valley)</span>
                        <span className="text-[10px] text-[#a89f91]">4-7 working days</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold">Rs. 500</span>
                  </label>
                </div>
              </section>

              {/* PAYMENT SECTION */}
              <section className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-serif italic">Payment</h2>
                  <p className="text-[10px] text-[#a89f91] uppercase tracking-widest">Select a secure payment method</p>
                </div>

                <div className="bg-white border border-[#e5dfd3] rounded-[2rem] overflow-hidden">
                  <div className="p-6 bg-[#fdfaf5]/50 flex justify-between items-center border-b border-[#e5dfd3]">
                    <span className="text-sm font-bold">Payment Options</span>
                    <div className="flex gap-2">
                      <div className="w-8 h-5 bg-white border border-[#e5dfd3] rounded flex items-center justify-center"><QrCode size={12} className="opacity-40" /></div>
                      <div className="w-8 h-5 bg-white border border-[#e5dfd3] rounded flex items-center justify-center text-[8px] font-bold opacity-40">COD</div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* CASH ON DELIVERY */}
                    <label className="flex items-start gap-4 p-4 border border-[#e5dfd3] rounded-2xl cursor-pointer hover:bg-[#fdfaf5]/50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-[#3d2b1f] focus:ring-[#3d2b1f]"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold">Cash on Delivery</span>
                        <p className="text-[11px] text-[#a89f91]">Pay with cash when your furniture arrives at your doorstep.</p>
                      </div>
                    </label>

                    {/* ACTIVE PAYMENT ACCOUNTS (Dynamic) */}
                    {paymentAccounts.length > 0 && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#a89f91]">Bank Transfer / Digital Wallet</span>
                        {paymentAccounts.map((account) => (
                          <label key={account._id} className="flex flex-col gap-4 p-6 border border-[#e5dfd3] rounded-2xl cursor-pointer hover:bg-[#fdfaf5]/50 transition-colors">
                            <div className="flex items-start gap-4">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={account.accountName}
                                checked={formData.paymentMethod === account.accountName}
                                onChange={handleInputChange}
                                className="mt-1 w-5 h-5 text-[#3d2b1f] focus:ring-[#3d2b1f]"
                              />
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold">{account.bankNameOrWalletName}</span>
                                <div className="text-[11px] text-[#3d2b1f] space-y-0.5">
                                  <p><strong>Account:</strong> {account.accountName}</p>
                                  <p><strong>Ref:</strong> {account.accountNumber}</p>
                                </div>
                              </div>
                            </div>

                            {account.qrCodeImage && (
                              <div className="flex justify-center bg-white p-4 rounded-xl border border-[#e5dfd3] w-fit mx-auto">
                                <img
                                  src={urlFor(account.qrCodeImage).width(150).url()}
                                  alt="Payment QR"
                                  className="w-32 h-32 object-contain"
                                />
                              </div>
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-6 bg-[#fdfaf5] border border-dashed border-[#a3573a]/30 rounded-2xl">
                  <Info size={16} className="text-[#a3573a] flex-shrink-0" />
                  <p className="text-[10px] text-[#a3573a] font-medium leading-relaxed italic">
                    Please take a screenshot of the QR code/Bank details for reference. We will contact you via phone to confirm the order.
                  </p>
                </div>
              </section>

              {/* EXPRESS CHECKOUT SECTION (Move to bottom) */}
              <section className="space-y-6 pt-10 border-t border-[#e5dfd3]">
                <div className="flex flex-col items-center gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a89f91] opacity-50">Local Card Payments (Coming Soon)</span>
                  <div className="grid grid-cols-3 gap-4 w-full h-10 opacity-30 grayscale pointer-events-none">
                    <div className="bg-white border border-[#e5dfd3] rounded-lg flex items-center justify-center p-2"><CreditCard size={18} /></div>
                    <div className="bg-white border border-[#e5dfd3] rounded-lg flex items-center justify-center p-2"><CreditCard size={18} /></div>
                    <div className="bg-white border border-[#e5dfd3] rounded-lg flex items-center justify-center p-2"><CreditCard size={18} /></div>
                  </div>
                </div>
              </section>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-6 rounded-full font-sans font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl
                  ${isProcessing
                    ? 'bg-[#e5dfd3] text-[#a89f91] cursor-not-allowed'
                    : 'bg-[#3d2b1f] text-[#fdfaf5] hover:bg-[#a3573a] hover:-translate-y-1'
                  }`}
              >
                {isProcessing ? "Processing Order..." : (
                  <>Complete Purchase <ShieldCheck size={16} /></>
                )}
              </button>

            </form>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY (Sticky) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white/40 border border-[#e5dfd3] rounded-[3rem] p-8 md:p-10 sticky top-28 backdrop-blur-xl transition-all">

              <div className="flex items-center justify-between mb-10">
                <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#a89f91]">Order Summary</h3>
                <span className="bg-[#3d2b1f] text-white text-[9px] px-3 py-1 rounded-full">{items.length} Items</span>
              </div>

              {/* ITEM LIST */}
              <div className="max-h-[40vh] overflow-y-auto no-scrollbar space-y-8 pr-2 mb-10">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-6 group">
                    <div className="w-20 h-24 bg-white rounded-2xl overflow-hidden border border-[#e5dfd3] flex-shrink-0 relative">
                      {item.mainImage ? (
                        <img
                          src={urlFor(item.mainImage).width(200).url()}
                          alt={item.title}
                          className="object-cover w-full h-full opacity-90 transition-transform duration-1000 group-hover:scale-110"
                        />
                      ) : <div className="w-full h-full flex items-center justify-center text-[10px] opacity-20">VOID</div>}
                      <span className="absolute -top-1 -right-1 bg-[#3d2b1f] text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{item.quantity}</span>
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#3d2b1f] truncate mb-1">{item.title}</h4>
                      <p className="text-[10px] text-[#a89f91] font-medium tracking-wider">Rs. {item.price}</p>
                    </div>
                    <div className="flex flex-col items-end justify-center">
                      <span className="text-sm font-bold text-[#3d2b1f]">Rs. {item.price * item.quantity}</span>
                      <button onClick={() => removeItem(item._id)} className="text-[9px] text-[#a89f91] uppercase font-bold hover:text-[#a3573a] mt-1">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Voucher Section */}
              <div className="space-y-4 mb-10">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Voucher code"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    disabled={!!appliedVoucher}
                    className="flex-1 bg-white border border-[#e5dfd3] px-6 py-4 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-[#a3573a] transition-all disabled:opacity-50"
                  />
                  <button 
                    onClick={handleApplyVoucher}
                    disabled={isApplyingVoucher || !!appliedVoucher || !voucherInput}
                    className={`px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-colors
                      ${appliedVoucher 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-[#e5dfd3] text-[#3d2b1f] hover:bg-[#d9d1c1]'
                      }`}
                  >
                    {isApplyingVoucher ? "..." : appliedVoucher ? "Applied" : "Apply"}
                  </button>
                </div>
                {voucherError && <p className="text-[10px] text-red-500 pl-2">{voucherError}</p>}
                {appliedVoucher && (
                  <div className="flex items-center justify-between bg-green-50 border border-green-100 px-4 py-2 rounded-xl">
                    <div className="flex items-center gap-2 text-[10px] text-green-700 font-bold uppercase">
                      <Tag size={12} /> {appliedVoucher.code}
                    </div>
                    <button 
                      onClick={() => {
                        setAppliedVoucher(null);
                        setDiscount(0);
                        setVoucherInput("");
                      }}
                      className="text-[9px] text-green-700/50 hover:text-green-700 uppercase font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* PRICE BREAKDOWN */}
              <div className="space-y-4 pt-6 border-t border-[#e5dfd3] border-dotted">
                <div className="flex justify-between items-center text-[11px] font-medium">
                  <span className="text-[#a89f91]">Subtotal</span>
                  <span className="font-bold">Rs. {subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-[11px] font-medium text-green-600">
                    <span className="flex items-center gap-1"><Tag size={12} /> Discount</span>
                    <span className="font-bold">- Rs. {discount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[11px] font-medium">
                  <span className="text-[#a89f91]">Shipping</span>
                  <span className="font-bold">{shipping > 0 ? `Rs. ${shipping}` : "Free"}</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-[#e5dfd3] mt-4">
                  <span className="text-lg font-serif italic">Total</span>
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] text-[#a89f91] font-bold">NPR</span>
                      <span className="text-4xl font-sans font-bold tracking-tighter text-[#3d2b1f]">Rs. {finalTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-12 flex flex-col items-center gap-4 opacity-40">
                <div className="flex items-center gap-10">
                  <Truck size={14} />
                  <ShieldCheck size={14} />
                  <ShoppingBag size={14} />
                </div>
                <p className="text-[8px] font-sans font-bold uppercase tracking-[0.5em] text-[#a89f91]">Verified Furniture Purveyor</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
