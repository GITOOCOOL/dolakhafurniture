"use client";

import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

interface ToastItem {
  id: string;
  message: string;
  image?: string;
}

interface ToastContextType {
  showToast: (message: string, image?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

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

      {/* BOTTOM CENTER CONTAINER - 90% WIDTH FOCUS */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[9999999] flex flex-col-reverse gap-3 items-center pointer-events-none w-[90vw] max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              layout
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
                      key={toast.image}
                    />
                  ) : (
                    <div className="w-full h-full bg-action/10 flex items-center justify-center">
                      <Leaf size={18} className="text-action opacity-30" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[8px] font-sans font-extrabold uppercase tracking-[0.3em] text-app/50 leading-none mb-1">
                    Added to Cart
                  </span>
                  <span className="font-sans font-bold uppercase tracking-widest text-[11px] truncate">
                    {toast.message}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
