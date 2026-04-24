"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bulletin } from "@/types";
import { Ticket } from "lucide-react";

interface AnnouncementBarProps {
  bulletins: (Bulletin & { type?: string; voucherCode?: string })[];
}

export default function AnnouncementBar({ bulletins }: AnnouncementBarProps) {
  const [index, setIndex] = useState(0);

  const pathname = usePathname();

  useEffect(() => {
    if (bulletins.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % bulletins.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bulletins.length]);

  const currentBulletin = bulletins[index];
  const isCampaign = currentBulletin?.type === "campaign";
  const voucherCode = currentBulletin?.voucherCode;

  if (bulletins.length === 0 || pathname?.startsWith("/admin")) return null;

  return (
    <motion.div 
      animate={{ 
        backgroundColor: isCampaign ? "#E1AD01" : "#A3563A", 
        color: isCampaign ? "#2D2424" : "#F8F1E7" 
      }}
      transition={{ duration: 0.8 }}
      className="h-12 md:h-14 flex items-center justify-center overflow-hidden relative z-[60]"
    >
      <div className="container mx-auto px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center justify-center gap-3 md:gap-5"
          >
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <span className="text-[9px] md:text-[10px] font-sans font-extrabold uppercase tracking-[0.3em] opacity-80">
                {currentBulletin.title || "Dolakha Furniture"}
              </span>
              <span className="hidden md:inline-block opacity-40">•</span>
              <span className="text-[10px] md:text-xs font-serif italic tracking-wide">
                {currentBulletin.content}
              </span>
            </div>

            {voucherCode && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-dashed border-current font-sans font-bold tracking-widest text-[9px] md:text-[11px] shadow-sm animate-in fade-in zoom-in-95 duration-500">
                <Ticket size={12} className="opacity-70" />
                <span className="uppercase">{voucherCode}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
