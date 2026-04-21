"use client";

import { useState, useEffect } from "react";
import { Campaign } from "@/types";
import { urlFor } from "@/lib/sanity";
import { Copy, Check, X, Leaf } from "lucide-react";
import { useToast } from "./Toast";
import { motion, AnimatePresence } from "framer-motion";

import { useUIStore } from "@/store/useUIStore";
import Link from "next/link";

interface CampaignModalProps {
  campaign: Campaign | null;
}

export default function CampaignModal({ campaign }: CampaignModalProps) {
  const {
    isCampaignModalOpen,
    setCampaignModalOpen,
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
    <AnimatePresence>
      {isCampaignModalOpen && (
        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          style={{
            transform: "translateZ(100px)",
            backfaceVisibility: "hidden",
          }}
          className="fixed inset-0 bg-[#fdfaf5]/85 backdrop-blur-xl z-[1100] flex flex-col p-8 pt-14 sm:pt-20 overflow-y-auto justify-start items-start border-r border-[#e5dfd3]/30"
        >
          {/* IDENTICAL HEADER TO NAV MENU */}
          <div className="flex-shrink-0 flex justify-between items-center w-full h-16 mb-8 mt-2 sm:mt-0">
            <div className="flex items-center gap-2">
              <Leaf className="text-[#a3573a]" size={18} />
              <p className="text-xs font-serif italic tracking-widest text-[#3d2b1f]">
                New Year Offer
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-4 bg-[#3d2b1f] text-[#fdfaf5] rounded-full shadow-lg transition-all"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          <div className="w-full flex-1 flex flex-col">
            {/* Banner Section */}
            {campaign.banner && (
              <div className="relative h-64 md:h-96 rounded-[2rem] overflow-hidden flex-shrink-0 mb-8 border border-[#e5dfd3]/50">
                <img
                  src={urlFor(campaign.banner).width(1200).url()}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fdfaf5]/20 via-transparent to-transparent" />
              </div>
            )}

            <div className="text-center pb-20 max-w-2xl mx-auto w-full">
              <h2 className="text-4xl md:text-7xl font-serif italic mb-6 text-[#3d2b1f] leading-tight">
                {campaign.tagline || campaign.title}
              </h2>

              <p className="text-lg md:text-xl text-[#a89f91] font-medium leading-relaxed mb-10">
                {campaign.description}
              </p>

              {/* Voucher Tile */}
              <div
                className="relative group p-10 rounded-3xl bg-[#a3573a]/5 border-2 border-dashed border-[#a3573a]/30 transition-all duration-500 hover:bg-[#a3573a]/10 cursor-pointer mb-12"
                onClick={() => copyToClipboard(firstVoucher)}
              >
                <div className="text-[12px] uppercase tracking-[0.4em] text-[#a3573a] font-bold mb-3">
                  Tap to copy code
                </div>
                <div className="text-4xl md:text-6xl font-serif italic text-[#3d2b1f] flex items-center justify-center gap-4">
                  {firstVoucher}
                  {copied ? (
                    <Check className="text-green-600" size={32} />
                  ) : (
                    <Copy className="opacity-40" size={24} />
                  )}
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button
                  onClick={handleClose}
                  className="h-16 flex items-center justify-center rounded-2xl border-2 border-[#3d2b1f] text-[#3d2b1f] font-bold uppercase tracking-widest text-xs hover:bg-[#3d2b1f]/5 transition-all"
                >
                  Start Shopping 🛋️
                </button>
                <Link
                  href={`/campaign/${campaign.slug}`}
                  onClick={handleClose}
                  className="h-16 flex items-center justify-center rounded-2xl bg-[#a3573a] text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#a3573a]/20 hover:bg-[#3d2b1f] transition-all"
                >
                  See Campaign Products 🏮
                </Link>
              </div>

              <AnimatePresence>
                {isInApp && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 p-5 rounded-2xl bg-[#a3573a]/10 border-2 border-[#a3573a]/30 flex flex-col items-center gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl pt-1">💡</div>
                      <div className="flex-1 text-left">
                        <p className="text-[11px] uppercase font-black tracking-[0.2em] text-[#a3573a] mb-2">Better Experience Tip</p>
                        <p className="text-[13px] text-[#3d2b1f] font-medium leading-relaxed">
                          Browsing from Messenger? Tap the <span className="font-bold underline">3 dots (⋮ or ...)</span> above and select <span className="font-bold">"Open in Browser"</span>.
                        </p>
                      </div>
                    </div>
                    {/* Visual Guide: Animated Arrow */}
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                      className="mt-2 text-[#a3573a]"
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

          <div className="w-full text-center py-6 text-[10px] uppercase tracking-widest text-[#a89f91] border-t border-[#e5dfd3]/50">
            Honest Craft, Dolakha Furniture
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
