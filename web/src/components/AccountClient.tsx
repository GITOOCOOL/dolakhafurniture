"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Leaf,
  Package,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Order } from "@/types";
import Link from "next/link";
import InquiryModal from "./InquiryModal";

interface AccountClientProps {
  user: User;
  lastOrder?: Order;
  showSuccess?: boolean;
}

export default function AccountClient({
  user,
  lastOrder,
  showSuccess,
}: AccountClientProps) {
  const [visible, setVisible] = useState(showSuccess);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto text-[#3d2b1f]">
      {/* SUCCESS BANNER */}
      {visible && (
        <div className="mb-12 p-8 bg-[#a3573a] text-[#fdfaf5] rounded-[3rem] font-sans font-bold uppercase tracking-[0.3em] text-center animate-in fade-in slide-in-from-top-4 duration-1000 shadow-xl">
          ✨ Your record has been updated
        </div>
      )}

      {/* HEADER - Editorial Serif style */}
      <header className="mb-16 border-b border-[#e5dfd3] border-dotted pb-10">
        <h1 className="text-6xl md:text-8xl font-serif italic font-medium text-[#3d2b1f] leading-none">
          My Account<span className="text-[#a3573a]">.</span>
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <Leaf size={14} className="text-[#a3573a] opacity-60" />
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#a89f91]">
            Account / Orders / Support
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* LEFT COLUMN: HUB NAVIGATION */}
        <div className="lg:col-span-5 space-y-10">
          <div className="flex items-center gap-6 mb-12">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-[#e5dfd3] shadow-inner bg-white flex items-center justify-center">
              {user.user_metadata.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-[#3d2b1f] tracking-tighter">
                  {getInitials(user.user_metadata?.full_name)}
                </span>
              )}
            </div>
            <div>
              <p className="text-[10px] font-sans font-bold text-[#a89f91] uppercase tracking-[0.2em] mb-4">Saved Contact Details</p>
              <h2 className="text-3xl font-serif italic text-[#3d2b1f] leading-tight">
                Hi, {user.user_metadata.full_name?.split(" ")[0]}
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-[#a89f91] mb-6 ml-2">
              Quick Navigation
            </h3>
            <Link
              href="/orders"
              className="group flex flex-col p-8 bg-white border border-[#e5dfd3] rounded-[3rem] hover:border-[#a3573a] hover:shadow-xl transition-all duration-500"
            >
              <div className="flex justify-between items-center mb-4">
                <Package
                  size={24}
                  className="text-[#a3573a]"
                  strokeWidth={1.5}
                />
                <span className="text-[#a89f91] group-hover:text-[#a3573a] transform group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
              <p className="text-2xl font-serif italic text-[#3d2b1f]">
                View Orders
              </p>
              <p className="text-[10px] font-sans font-bold opacity-40 uppercase tracking-widest mt-2">
                Track your history
              </p>
            </Link>

            <button
              onClick={() => setShowInquiryModal(true)}
              className="group flex flex-col p-8 bg-white border border-[#e5dfd3] rounded-[3rem] hover:border-[#a3573a] hover:shadow-xl transition-all duration-500 text-left w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <MessageCircle
                  size={24}
                  className="text-[#a3573a]"
                  strokeWidth={1.5}
                />
                <span className="text-[#a89f91] group-hover:text-[#a3573a] transform group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
              <p className="text-2xl font-serif italic text-[#3d2b1f]">
                Send Inquiry
              </p>
              <p className="text-[10px] font-sans font-bold opacity-40 uppercase tracking-widest mt-2">
                Get in touch
              </p>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: SAVED ESSENTIALS */}
        <div className="lg:col-span-7 space-y-12">
          <div className="bg-white/40 p-12 rounded-[4rem] border border-[#e5dfd3] space-y-12">
            {/* CONTACT ESSENTIALS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91]">
                  <Mail size={12} /> Email Address
                </div>
                <p className="text-sm font-sans font-bold text-[#3d2b1f] break-all">
                  {user.email}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91]">
                  <Phone size={12} /> Contact Phone
                </div>
                <p className="text-sm font-sans font-bold text-[#3d2b1f]">
                  {lastOrder?.customerPhone ||
                    user.user_metadata.phone ||
                    "No phone added"}
                </p>
              </div>
            </div>

            {/* SAVED ADDRESS (From last order) */}
            <div className="pt-10 border-t border-[#e5dfd3] border-dotted space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#a89f91]">
                <MapPin size={12} /> Last Delivery Address
              </div>

              {lastOrder?.shippingAddress ? (
                <div className="space-y-2">
                  <p className="text-2xl font-serif italic text-[#3d2b1f]">
                    {lastOrder.shippingAddress.address}
                  </p>
                  <p className="text-sm font-sans font-bold text-[#a89f91]">
                    {lastOrder.shippingAddress.apartment
                      ? `${lastOrder.shippingAddress.apartment}, `
                      : ""}
                    {lastOrder.shippingAddress.city},{" "}
                    {lastOrder.shippingAddress.state}{" "}
                    {lastOrder.shippingAddress.postcode}
                  </p>
                  <div className="mt-8">
                    <span className="px-4 py-1.5 bg-[#fdfaf5] border border-[#e5dfd3] rounded-full text-[8px] font-sans font-bold uppercase tracking-widest text-[#a89f91]">
                      Verified from Order #{lastOrder.orderNumber || lastOrder._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-10 border-2 border-dotted border-[#e5dfd3] rounded-3xl text-center">
                  <p className="text-sm text-[#a89f91] italic font-serif">
                    "No delivery history found yet."
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SUPPORT FOOTNOTE */}
          <p className="text-[10px] font-sans font-bold text-center uppercase tracking-widest text-[#a89f91] opacity-60">
            For privacy updates or data requests, please contact our support.
          </p>
        </div>
      </div>

      <InquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        initialData={{
          name: user.user_metadata.full_name,
          email: user.email,
          phone: lastOrder?.customerPhone || user.user_metadata.phone,
        }}
        title="Account Inquiry"
        subtitle="How can we help with your collection?"
      />
    </div>
  );
}
