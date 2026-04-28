"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ShoppingBag, ArrowUp } from "lucide-react";
import { useCart } from "@/store/useCart";

interface ToastItem {
  id: string;
  message: string;
  image?: string;
}

const ToastItemComponent = ({ toast }: { toast: ToastItem }) => {
  const [showArrow, setShowArrow] = useState(true);
  const items = useCart((state) => state.items);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const timer = setTimeout(() => setShowArrow(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      className="pointer-events-auto w-full"
    >
      <div className="bg-heading text-app pl-2 pr-6 py-3 rounded-full shadow-[0_15px_60px_rgba(0,0,0,0.5)] flex items-center gap-4 border-2 border-app/10 w-full">
        {/* Product Thumbnail or Fallback */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-app/20 flex-shrink-0 shadow-sm flex items-center justify-center relative">
          {toast.image ? (
            <img
              src={toast.image}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-action/10 flex items-center justify-center">
              <Leaf size={18} className="text-action opacity-30" />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[8px] font-sans font-extrabold uppercase tracking-[0.3em] text-app/50 leading-none mb-1">
            Added to Bag
          </span>
          <span className="font-sans font-bold uppercase tracking-widest text-[11px] truncate">
            {toast.message}
          </span>
        </div>

        <div className="flex items-center justify-center relative w-[38px] h-[38px] rounded-full bg-[#ea580c] shadow-[0_0_15px_rgba(234,88,12,0.4)] border border-[#ea580c] flex-shrink-0">
          <AnimatePresence mode="popLayout">
            {showArrow ? (
              <motion.div
                key="arrow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <ArrowUp size={22} className="text-white" strokeWidth={1.5} />
              </motion.div>
            ) : (
              <motion.div
                key="bag"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <ShoppingBag size={22} strokeWidth={1.2} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {totalQuantity > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-heading text-app text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-[1.5px] border-[#ea580c]"
            >
              {totalQuantity}
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface ToastContextType {
  showToast: (message: string, image?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const showToast = (message: string, image?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, image: image || undefined }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {mounted && createPortal(
        <div className="fixed top-24 right-4 sm:right-6 z-[1000] flex flex-col gap-3 items-end pointer-events-none w-[90vw] max-w-sm">
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <ToastItemComponent key={toast.id} toast={toast} />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
