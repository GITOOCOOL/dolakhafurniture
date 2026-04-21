"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  position?: "center" | "right" | "left" | "bottom";
  hideCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  position = "center",
  hideCloseButton = false,
}: ModalProps) {
  const { lockScroll, unlockScroll } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      lockScroll("ui-modal");
    } else {
      unlockScroll("ui-modal");
    }
    return () => unlockScroll("ui-modal");
  }, [isOpen, lockScroll, unlockScroll]);

  const positions = {
    center: "sm:items-center sm:justify-center sm:px-4",
    right: "items-stretch justify-end",
    left: "items-stretch justify-start",
    bottom: "items-end justify-center",
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
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" },
    },
  };

  const isDrawer =
    position === "right" || position === "left" || position === "bottom";

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[1000] flex ${positions[position]}`}>
          {/* Backdrop (Solid & Defined) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-overlay"
          />

          {/* Modal Master Shell */}
          <motion.div
            initial={variants[position].initial}
            animate={variants[position].animate}
            exit={variants[position].exit}
            transition={
              isDrawer
                ? { type: "spring", damping: 35, stiffness: 5000, mass: 0.2 }
                : { type: "spring", duration: 0.25, bounce: 0.0 }
            }
            className={`
              relative bg-app border-divider shadow-2xl flex flex-col transition-all duration-300
              ${
                position === "right" || position === "left"
                  ? `h-full w-full sm:w-[500px] rounded-none ${position === "right" ? "border-l" : "border-r"}`
                  : position === "bottom"
                    ? "w-full sm:max-w-3xl h-[85dvh] rounded-t-[2.5rem] border-t"
                    : "w-full h-full sm:h-auto sm:max-w-xl sm:border sm:rounded-[2.5rem] p-0 shadow-sm sm:max-h-[85dvh] overflow-hidden"
              }
              ${className}
            `}
          >
            {/* Standardized Master Header */}
            <div
              className={`flex items-center justify-between p-8 border-b border-soft/20 flex-shrink-0 relative z-20`}
            >
              <div className="flex items-center gap-3">
                {isDrawer && position === "left" && (
                  <div className="w-2 h-2 rounded-full bg-action animate-pulse" />
                )}
                <h3 className="type-section text-heading">
                  {title || (position === "left" ? "Navigation" : "Info")}
                </h3>
              </div>

              {!hideCloseButton && (
                <button
                  onClick={onClose}
                  className="w-12 h-12 bg-heading text-app rounded-full shadow-xl flex items-center justify-center transition-all hover:bg-action active:scale-95 translate-x-2"
                  aria-label="Close"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              )}
            </div>

            <div
              className={`relative z-10 font-sans flex-1 overflow-y-auto custom-scrollbar ${isDrawer ? "p-8" : "p-10"}`}
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
