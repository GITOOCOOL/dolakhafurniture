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
import Carousel from "./Carousel";
import ProductCard from "./ProductCard";

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

  const totalDiscountPercent = campaign.vouchers?.reduce((acc, v) => acc + (v.discountType === 'percentage' ? v.discountValue : 0), 0) || 0;
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
          <div className="relative h-64 md:h-96 rounded-[2rem] overflow-hidden flex-shrink-0 mb-6 border border-soft/50">
            <img
              src={urlFor(campaign.banner).width(1200).url()}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bone/20 via-transparent to-transparent" />
          </div>
        )}

        {/* --- HIGH VISIBILITY SAVINGS HUB --- */}
        <div className="flex flex-col items-center justify-center p-6 bg-surface border border-soft/20 rounded-[2rem] gap-4 mb-10 shadow-sm">
          <div className="flex flex-col items-center gap-1">
            <div className="text-[10px] uppercase tracking-[0.3em] text-description/60 font-bold">
              Vouchers:
            </div>
            {campaign.vouchers && campaign.vouchers.length > 0 && (
              <div className="text-[10px] uppercase tracking-widest text-action font-black">
                Total Discounts: {totalDiscountPercent}%
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {campaign.vouchers && campaign.vouchers.length > 0 ? (
              campaign.vouchers.map((v) => (
                <div
                  key={v.code}
                  className="group relative px-6 py-3 bg-heading border border-soft/20 rounded-full flex items-center gap-3 shadow-md"
                >
                  <div className="w-2 h-2 rounded-full bg-app animate-pulse" />
                  <span className="type-action text-app uppercase">
                    {v.code}
                  </span>
                </div>
              ))
            ) : (
              <div
                className="group relative px-6 py-3 bg-heading border border-soft/20 rounded-full flex items-center gap-3 shadow-md"
              >
                  <div className="w-2 h-2 rounded-full bg-app animate-pulse" />
                <span className="type-action text-app uppercase">
                  {firstVoucher}
                </span>
              </div>
            )}
          </div>
          
          <p className="text-[10px] uppercase font-sans tracking-[0.2em] text-action font-black bg-action/5 px-4 py-2 rounded-full border border-action/20">
            ✨ Applied automatically in your order
          </p>
        </div>

        <div className="text-center pb-10 max-w-2xl mx-auto w-full">
          <h2 className="text-4xl md:text-5xl font-serif italic mb-6 text-heading leading-tight">
            {campaign.tagline || campaign.title}
          </h2>

          <p className="type-label text-description font-medium leading-relaxed mb-10 px-4">
            {campaign.description}
          </p>

          {/* Action Stack */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 justify-center mb-12">
            <button
              onClick={handleClose}
              className="flex-1 md:max-w-[240px] min-h-[64px] flex items-center justify-center rounded-[1.5rem] border-2 border-espresso text-heading font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-espresso/5 transition-all py-6"
            >
              Start Shopping 🛋️
            </button>
            {campaign.buttonLink === "#signup" ? (
              <button
                onClick={() => {
                  handleClose();
                  setIsAccountModalOpen(true);
                }}
                className="flex-1 md:max-w-[240px] min-h-[64px] flex items-center justify-center rounded-[1.5rem] bg-action text-white font-bold uppercase tracking-widest text-[10px] md:text-xs shadow-lg shadow-accent/20 hover:bg-espresso transition-all py-6"
              >
                {campaign.buttonText || "Sign Up Now! 🏮"}
              </button>
            ) : (
              <Link
                href={campaign.buttonLink || `/campaign/${campaign.slug}`}
                onClick={handleClose}
                className="flex-1 md:max-w-[240px] min-h-[64px] flex items-center justify-center rounded-[1.5rem] bg-action text-white font-bold uppercase tracking-widest text-[10px] md:text-xs shadow-lg shadow-accent/20 hover:bg-espresso transition-all py-6"
              >
                {campaign.buttonText || "See Campaign Products 🏮"}
              </Link>
            )}
          </div>

          {/* --- PRODUCT SHOWCASE CAROUSEL --- */}
          {campaign.products && campaign.products.length > 0 && (
            <div className="w-full text-left">
              <div className="flex items-center justify-between px-2 mb-6">
                 <div>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-action mb-1">On Offer Now</p>
                    <h3 className="type-product text-heading text-xl">Campaign Showcase</h3>
                 </div>
              </div>
              <Carousel autoScroll={false}>
                {campaign.products.map((product) => {
                   const discPrice = Math.round(product.price * (1 - totalDiscountPercent / 100));
                   return (
                    <div key={product._id} className="w-[180px] md:w-[220px]">
                      <ProductCard 
                        product={product} 
                        variant="campaign" 
                        discountedPrice={discPrice} 
                        businessMetaData={businessMetaData}
                      />
                    </div>
                  );
                })}
              </Carousel>
            </div>
          )}
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

      <div className="w-full text-center py-6 text-[10px] uppercase tracking-widest text-label border-t border-soft/50 mt-10">
        Honest Craft, {businessMetaData?.businessName || "undefined_setmetadata_in_studio"}
      </div>
    </Modal>
  );
}
