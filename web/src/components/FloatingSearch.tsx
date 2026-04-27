"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";

const FloatingSearch = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { setIsSearchOpen, activeLocks } = useUIStore();

  // Scroll listener to show/hide the floating button
  useEffect(() => {
    const handleScroll = () => {
      // Threshold at 10px to match the header's search-bar-vanish timing
      if (window.scrollY > 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAnyModalOpen = activeLocks.size > 0;

  if (pathname?.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {isVisible && !isAnyModalOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className="fixed bottom-0 left-0 z-[400] p-6 md:p-10"
        >
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-14 h-14 flex items-center justify-center bg-action dark:bg-white border border-soft shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 rounded-full group"
            aria-label="Open Search"
          >
            <Search 
              size={22} 
              strokeWidth={1.5} 
              className="text-white dark:text-action group-hover:scale-110 transition-transform" 
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingSearch;
