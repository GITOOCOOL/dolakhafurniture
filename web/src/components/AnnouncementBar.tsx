"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bulletin } from "@/types";

interface AnnouncementBarProps {
  bulletins: Bulletin[];
}

export default function AnnouncementBar({ bulletins }: AnnouncementBarProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (bulletins.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % bulletins.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bulletins.length]);

  if (bulletins.length === 0) return null;

  return (
    <div className="bg-action text-bone h-12 md:h-14 flex items-center justify-center overflow-hidden relative z-[60]">
      <div className="container mx-auto px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4"
          >
            <span className="text-[9px] md:text-[10px] font-sans font-extrabold uppercase tracking-[0.3em] opacity-80">
              {bulletins[index].title || "Dolakha Furniture"}
            </span>
            <span className="hidden md:inline-block opacity-40">•</span>
            <span className="text-[10px] md:text-xs font-serif italic tracking-wide">
              {bulletins[index].content}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
