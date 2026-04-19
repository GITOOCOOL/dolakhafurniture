"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  position?: "center" | "right" | "left";
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = "", 
  position = "center" 
}: ModalProps) {
  const { lockScroll, unlockScroll } = useUIStore();

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      lockScroll('ui-modal');
    } else {
      unlockScroll('ui-modal');
    }
    return () => unlockScroll('ui-modal');
  }, [isOpen, lockScroll, unlockScroll]);

  const positions = {
    center: "items-center justify-center px-4",
    right: "items-stretch justify-end",
    left: "items-stretch justify-start",
  };

  const variants = {
    center: {
      initial: { opacity: 0, scale: 0.9, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: 20 },
    },
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
    },
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
    },
  };

  const isDrawer = position === "right" || position === "left";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex ${positions[position]}`}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#3d2b1f]/20 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={variants[position].initial}
            animate={variants[position].animate}
            exit={variants[position].exit}
            transition={isDrawer ? { type: "spring", damping: 25, stiffness: 200 } : { type: "spring", duration: 0.5, bounce: 0.3 }}
            className={`
              relative bg-[#fdfaf5] border-[#e5dfd3] shadow-2xl overflow-hidden flex flex-col
              ${isDrawer ? "h-full w-full sm:w-[400px] border-l rounded-none" : "w-full max-w-lg border rounded-[2.5rem] p-8 md:p-10"}
              ${className}
            `}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-6 right-6 p-2 text-[#a89f91] hover:text-[#3d2b1f] hover:bg-[#3d2b1f]/5 transition-all z-20 ${isDrawer ? "rounded-none" : "rounded-full"}`}
            >
              <X size={24} />
            </button>

            {title && (
              <div className={`mb-8 ${isDrawer ? "p-6 border-b" : "text-center"}`}>
                <h3 className={`${isDrawer ? "text-2xl" : "text-3xl"} font-serif italic mb-2 text-[#3d2b1f]`}>{title}</h3>
                {!isDrawer && <div className="w-12 h-0.5 bg-[#a3573a] mx-auto rounded-full opacity-30" />}
              </div>
            )}

            <div className={`relative z-10 font-sans flex-1 overflow-y-auto ${isDrawer ? "p-6 md:p-8" : ""}`}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
