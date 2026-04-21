"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[38px] h-[38px] rounded-full bg-surface border border-divider/20" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-[38px] h-[38px] flex items-center justify-center bg-clay shadow-sm hover:bg-stone-muted/30 rounded-full transition-all text-heading overflow-hidden group"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ y: 20, opacity: 0, rotate: isDark ? 45 : -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: isDark ? -45 : 45 }}
          transition={{ duration: 0.3, ease: "backOut" }}
          className="flex items-center justify-center w-full h-full"
        >
          {isDark ? (
            <Moon size={22} className="md:w-7 md:h-7 stroke-[1.2]" />
          ) : (
            <Sun size={22} className="md:w-7 md:h-7 stroke-[1.2]" />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-action/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
