"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

export default function BrowserBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Detect In-App Browsers (Facebook, Messenger, Instagram, etc.)
    const ua = (navigator.userAgent || navigator.vendor || (window as any).opera).toLowerCase();
    
    const isInApp = 
      ua.includes("fban") || 
      ua.includes("fbav") || 
      ua.includes("messenger") || 
      ua.includes("instagram") ||
      ua.includes("fb_iab") ||
      ua.includes("fbios") || 
      ua.includes("fb4a") ||
      ua.includes("fbsn") || 
      ua.includes("fbsv") ||
      ua.includes("fbid");

    if (isInApp) {
      // Check if dismissed for this session
      const isDismissed = sessionStorage.getItem("dismiss-browser-tip");
      if (!isDismissed) {
        setShow(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("dismiss-browser-tip", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-[#1a1c13] text-white z-[1000] border-t border-[#df9152]/20 shadow-[0_-15px_40px_rgba(0,0,0,0.6)]"
        >
          <div className="container mx-auto px-5 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleDismiss}
                className="absolute -top-4 left-4 w-8 h-8 bg-[#1a1c13] text-white rounded-full flex items-center justify-center shadow-2xl border border-white/20 active:scale-95 transition-all z-[10]"
              >
                <X size={16} strokeWidth={3} />
              </button>

              {/* Step 1: Text Instructions */}
              <div className="flex-1 space-y-1 ml-4 pt-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#df9152] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                  <p className="text-[11px] font-bold tracking-tight">Tap the <span className="text-[#df9152]">...</span> at the bottom</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#df9152] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                  <p className="text-[11px] font-bold tracking-tight">Choose <span className="underline">Open in Browser</span></p>
                </div>
              </div>

              {/* Step 2: Full Footer Mimic Graphic */}
              <div className="relative flex-shrink-0 bg-white/5 px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-5">
                {/* Simplified icons matching the screenshot */}
                <div className="flex gap-4 opacity-20">
                  <div className="w-3 h-3 border-r-2 border-b-2 border-white rotate-[135deg]" /> {/* Back */}
                  <div className="w-3 h-3 border-r-2 border-b-2 border-white -rotate-[45deg]" /> {/* Forward */}
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-0 rounded-full relative">
                     <div className="absolute top-0 right-[-1px] w-1 h-1 bg-white" />
                  </div> {/* Refresh */}
                  <div className="w-3.5 h-3.5 border-2 border-white rounded-sm relative">
                     <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white" />
                  </div> {/* Share */}
                </div>

                  {/* Highlighted Target dots */}
                  <div className="relative flex gap-0.5">
                    <div className="w-1 h-1 bg-white/40 rounded-full" />
                    <div className="w-1 h-1 bg-white/40 rounded-full" />
                    
                    {/* The 3rd Dot (Target) */}
                    <div className="relative">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.8, 1], 
                          opacity: [0, 0.8, 0] 
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2,
                          times: [0, 0.5, 1] 
                        }}
                        className="absolute inset-0 bg-[#df9152] rounded-full blur-[6px]"
                      />
                      <div className="relative w-1.5 h-1.5 bg-[#df9152] rounded-full shadow-[0_0_8px_#df9152]" />

                      {/* ANIMATED TAPPING FINGER - Now pointing DOWN at the real phone UI */}
                      <motion.div 
                        animate={{ 
                          y: [-30, 8, 12, 8, -30],
                          scale: [1, 1, 0.9, 1, 1],
                          opacity: [0, 1, 1, 1, 0]
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2,
                          times: [0, 0.4, 0.5, 0.6, 1],
                          ease: "easeInOut"
                        }}
                        className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-[20%] text-[#df9152] z-[20] pointer-events-none rotate-180"
                      >
                        {/* Flipped Stylized Pointing Finger SVG */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="0.5">
                          <path d="M18,13 L18,19 C18,20.65 16.65,22 15,22 L10,22 C9.12,22 8.32,21.61 7.78,21 L2.46,15.68 C2.18,15.4 2,15.02 2,14.61 C2,13.78 2.67,13.11 3.5,13.11 C3.9,13.11 4.27,13.27 4.54,13.54 L7,16 L7,5 C7,3.9 7.9,3 9,3 C10.1,3 11,3.9 11,5 L11,11 L12,11 C12,11 15,11 15,11 C16.1,11 17,11.9 17,13 L18,13 Z" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
