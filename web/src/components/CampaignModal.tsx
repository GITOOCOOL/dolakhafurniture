"use client";

import { useState, useEffect } from "react";
import { Campaign, BusinessMetaData } from "@/types";
import { urlFor } from "@/lib/sanity";
import { Copy, Check, X, Leaf } from "lucide-react";
import { useToast } from "./Toast";
import { motion, AnimatePresence } from "framer-motion";

import { useUIStore } from "@/store/useUIStore";
import Link from "next/link";
import Modal from "@/components/ui/Modal";

interface CampaignModalProps {
  campaign: Campaign | null;
  businessMetaData?: BusinessMetaData | null;
}

export default function CampaignModal({ campaign, businessMetaData }: CampaignModalProps) {
  const {
    isCampaignModalOpen,
    setCampaignModalOpen,
    setIsAccountModalOpen,
    lockScroll,
    unlockScroll,
  } = useUIStore();
  const [copied, setCopied] = useState(false);
  const [isInApp, setIsInApp] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Detect In-App Browsers (Facebook, Messenger, Instagram, etc.)
    const ua = (navigator.userAgent || navigator.vendor || (window as any).opera).toLowerCase();
    
    const isInAppDetected = 
      ua.includes("fban") || 
      ua.includes("fbav") || 
      ua.includes("messenger") || 
      ua.includes("instagram") ||
      ua.includes("fb_iab") ||
      ua.includes("fbios") || 
      ua.includes("fb4a") ||
      ua.includes("messengerforios") ||
      ua.includes("fba4") ||
      ua.includes("fb_iab") ||
      ua.includes("fbsn") || 
      ua.includes("fbsv") ||
      ua.includes("fbid");

    setIsInApp(isInAppDetected);
  }, []);

  useEffect(() => {
    if (!campaign) return;

    // Check if user has seen this specific campaign modal
    const storageKey = `hasSeen_campaign_${campaign._id}`;
    const hasSeen = localStorage.getItem(storageKey);

    if (!hasSeen) {
      // Delay to let the site load first (Premium Feel)
      const timer = setTimeout(() => {
        setCampaignModalOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [campaign, setCampaignModalOpen]);

  // SYNC SCROLL LOCK (Same as Mobile Menu)
  useEffect(() => {
    if (isCampaignModalOpen) lockScroll("campaign-takeover");
    else unlockScroll("campaign-takeover");
    return () => unlockScroll("campaign-takeover");
  }, [isCampaignModalOpen, lockScroll, unlockScroll]);

  const handleClose = () => {
    if (campaign) {
      localStorage.setItem(`hasSeen_campaign_${campaign._id}`, "true");
    }
    setCampaignModalOpen(false);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast("Voucher code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!campaign) return null;

  const firstVoucher = campaign.vouchers?.[0]?.code || "NEWYEAR10";

  return (
    <Modal
      isOpen={isCampaignModalOpen}
      onClose={handleClose}
      position="left"
      title="Special Offers"
      id="campaign-modal"
    >
      <div className="w-full flex-1 flex flex-col">
        {/* Banner Section */}
        {campaign.banner && (
          <div className="relative h-64 md:h-96 rounded-[2rem] overflow-hidden flex-shrink-0 mb-8 border border-soft/50">
            <img
              src={urlFor(campaign.banner).width(1200).url()}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bone/20 via-transparent to-transparent" />
          </div>
        )}

        <div className="text-center pb-10 max-w-2xl mx-auto w-full">
          <h2 className="text-4xl md:text-6xl font-serif italic mb-6 text-heading leading-tight">
            {campaign.tagline || campaign.title}
          </h2>

          <p className="type-label text-description font-medium leading-relaxed mb-10 px-4">
            {campaign.description}
          </p>

          {/* Interaction Hub: Voucher Chips + Buttons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 text-left">
            {/* Column 1: Voucher Display (Literal Chip Parity) */}
            <div className="flex flex-col items-center justify-center p-8 bg-surface border border-soft/20 rounded-[2rem] gap-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-description/60 font-bold">
                Available Vouchers
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {campaign.vouchers && campaign.vouchers.length > 0 ? (
                  campaign.vouchers.map((v) => (
                    <button
                      key={v.code}
                      onClick={() => copyToClipboard(v.code)}
                      className="group relative px-6 py-3 bg-heading border border-soft/20 rounded-full flex items-center gap-3 transition-all hover:bg-action active:scale-95"
                    >
                      <div className="w-2 h-2 rounded-full bg-app group-hover:bg-white animate-pulse" />
                      <span className="type-action text-app group-hover:text-white uppercase">
                        {v.code}
                      </span>
                      {copied ? (
                        <Check size={14} className="text-green-500 group-hover:text-white" />
                      ) : (
                        <Copy size={14} className="opacity-40 group-hover:opacity-100 text-app group-hover:text-white" />
                      )}
                    </button>
                  ))
                ) : (
                  <button
                    onClick={() => copyToClipboard(firstVoucher)}
                    className="group relative px-6 py-3 bg-heading border border-soft/20 rounded-full flex items-center gap-3 transition-all hover:bg-action active:scale-95"
                  >
                     <div className="w-2 h-2 rounded-full bg-app group-hover:bg-white animate-pulse" />
                    <span className="type-action text-app group-hover:text-white uppercase">
                      {firstVoucher}
                    </span>
                    {copied ? (
                      <Check size={14} className="text-green-500 group-hover:text-white" />
                    ) : (
                      <Copy size={14} className="opacity-40 group-hover:opacity-100 text-app group-hover:text-white" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-[10px] uppercase tracking-widest text-action font-bold">
                Tap to copy
              </p>
            </div>

            {/* Column 2: Action Stack */}
            <div className="flex flex-col gap-4 md:gap-5 justify-between h-full">
              <button
                onClick={handleClose}
                className="flex-1 min-h-[64px] flex items-center justify-center rounded-[1.5rem] border-2 border-espresso text-heading font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-espresso/5 transition-all py-6"
              >
                Start Shopping 🛋️
              </button>
              {campaign.buttonLink === "#signup" ? (
                <button
                  onClick={() => {
                    handleClose();
                    setIsAccountModalOpen(true);
                  }}
                  className="flex-1 min-h-[64px] flex items-center justify-center rounded-[1.5rem] bg-action text-white font-bold uppercase tracking-widest text-[10px] md:text-xs shadow-lg shadow-accent/20 hover:bg-espresso transition-all py-6"
                >
                  {campaign.buttonText || "Sign Up Now! 🏮"}
                </button>
              ) : (
                <Link
                  href={campaign.buttonLink || `/campaign/${campaign.slug}`}
                  onClick={handleClose}
                  className="flex-1 min-h-[64px] flex items-center justify-center rounded-[1.5rem] bg-action text-white font-bold uppercase tracking-widest text-[10px] md:text-xs shadow-lg shadow-accent/20 hover:bg-espresso transition-all py-6"
                >
                  {campaign.buttonText || "See Campaign Products 🏮"}
                </Link>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isInApp && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 p-5 rounded-2xl bg-action/10 border-2 border-action/30 flex flex-col items-center gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl pt-1">💡</div>
                  <div className="flex-1 text-left">
                    <p className="text-[11px] uppercase font-black tracking-[0.2em] text-action mb-2">Better Experience Tip</p>
                    <p className="text-[13px] text-heading font-medium leading-relaxed">
                      Browsing from Messenger? Tap the <span className="font-bold underline">3 dots (⋮ or ...)</span> above and select <span className="font-bold">"Open in Browser"</span>.
                    </p>
                  </div>
                </div>
                {/* Visual Guide: Animated Arrow */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="mt-2 text-action"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 13l5 5 5-5M12 18V6" />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full text-center py-6 text-[10px] uppercase tracking-widest text-label border-t border-soft/50 mt-10">
        Honest Craft, {businessMetaData?.businessName || "undefined_setmetadata_in_studio"}
      </div>
    </Modal>
  );
}
