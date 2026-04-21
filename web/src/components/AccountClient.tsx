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
    <div className="max-w-6xl mx-auto text-heading">
      {/* SUCCESS BANNER */}
      {visible && (
        <div className="mb-12 p-8 bg-action text-bone rounded-[3rem] font-sans font-bold uppercase tracking-[0.3em] text-center animate-in fade-in slide-in-from-top-4 duration-1000 shadow-xl">
          ✨ Your record has been updated
        </div>
      )}

      {/* HEADER - Editorial Serif style */}
      <header className="mb-16 border-b border-soft border-dotted pb-10">
        <h1 className="type-hero font-medium text-heading leading-none">
          My Account<span className="text-action">.</span>
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <Leaf size={14} className="text-action opacity-60" />
          <p className="type-label text-label">
            Account / Orders / Support
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* LEFT COLUMN: HUB NAVIGATION */}
        <div className="lg:col-span-5 space-y-10">
          <div className="flex items-center gap-6 mb-12">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-soft shadow-inner bg-white flex items-center justify-center">
              {user.user_metadata.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-heading tracking-tighter">
                  {getInitials(user.user_metadata?.full_name)}
                </span>
              )}
            </div>
            <div>
              <p className="text-[10px] font-sans font-bold text-label uppercase tracking-[0.2em] mb-4">Saved Contact Details</p>
              <h2 className="text-3xl font-serif italic text-heading leading-tight">
                Hi, {user.user_metadata.full_name?.split(" ")[0]}
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-label mb-6 ml-2">
              Quick Navigation
            </h3>
            <Link
              href="/orders"
              className="group flex flex-col p-8 bg-white border border-soft rounded-[3rem] hover:border-action hover:shadow-xl transition-all duration-500"
            >
              <div className="flex justify-between items-center mb-4">
                <Package
                  size={24}
                  className="text-action"
                  strokeWidth={1.5}
                />
                <span className="text-label group-hover:text-action transform group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
              <p className="text-2xl font-serif italic text-heading">
                View Orders
              </p>
              <p className="text-[10px] font-sans font-bold opacity-40 uppercase tracking-widest mt-2">
                Track your history
              </p>
            </Link>

            <button
              onClick={() => setShowInquiryModal(true)}
              className="group flex flex-col p-8 bg-white border border-soft rounded-[3rem] hover:border-action hover:shadow-xl transition-all duration-500 text-left w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <MessageCircle
                  size={24}
                  className="text-action"
                  strokeWidth={1.5}
                />
                <span className="text-label group-hover:text-action transform group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
              <p className="text-2xl font-serif italic text-heading">
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
          <div className="bg-app p-12 rounded-[4rem] border border-soft space-y-12">
            {/* CONTACT ESSENTIALS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-label">
                  <Mail size={12} /> Email Address
                </div>
                <p className="text-sm font-sans font-bold text-heading break-all">
                  {user.email}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-label">
                  <Phone size={12} /> Contact Phone
                </div>
                <p className="text-sm font-sans font-bold text-heading">
                  {lastOrder?.customerPhone ||
                    user.user_metadata.phone ||
                    "No phone added"}
                </p>
              </div>
            </div>

            {/* SAVED ADDRESS (From last order) */}
            <div className="pt-10 border-t border-soft border-dotted space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-label">
                <MapPin size={12} /> Last Delivery Address
              </div>

              {lastOrder?.shippingAddress ? (
                <div className="space-y-2">
                  <p className="text-2xl font-serif italic text-heading">
                    {lastOrder.shippingAddress.address}
                  </p>
                  <p className="text-sm font-sans font-bold text-label">
                    {lastOrder.shippingAddress.apartment
                      ? `${lastOrder.shippingAddress.apartment}, `
                      : ""}
                    {lastOrder.shippingAddress.city},{" "}
                    {lastOrder.shippingAddress.state}{" "}
                    {lastOrder.shippingAddress.postcode}
                  </p>
                  <div className="mt-8">
                    <span className="px-4 py-1.5 bg-app border border-soft rounded-full text-[8px] font-sans font-bold uppercase tracking-widest text-label">
                      Verified from Order #{lastOrder.orderNumber || lastOrder._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-10 border-2 border-dotted border-soft rounded-3xl text-center">
                  <p className="text-sm text-label italic font-serif">
                    "No delivery history found yet."
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SUPPORT FOOTNOTE */}
          <p className="text-[10px] font-sans font-bold text-center uppercase tracking-widest text-label opacity-60">
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
