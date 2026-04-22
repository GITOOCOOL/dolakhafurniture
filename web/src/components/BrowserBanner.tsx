"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, MousePointer2 } from "lucide-react";

export default function BrowserBanner() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  // MASTER KILL SWITCH: Feature deactivated for further refinement
  return null;

  useEffect(() => {
    // 1. Detection Phase
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
      const isDismissed = sessionStorage.getItem("dismiss-browser-tip");
      if (!isDismissed) {
        setShow(true);
      }
    }
  }, []);

  // 2. Auto-Dismiss Logic (3 Seconds)
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("dismiss-browser-tip", "true");
      }, 4000); // Allow slightly more for the animation sequence (3s active + enter/exit)
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ 
            y: [200, 0, -25, 0, -15, 0, -10, 0],
            opacity: 1
          }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ 
            duration: 3.5,
            times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
            ease: "easeInOut"
          }}
          className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-2xl z-[1000] border-t border-soft shadow-[0_-15px_50px_rgba(0,0,0,0.15)]"
        >
          <div className="container mx-auto px-6 py-5">
            <div className="flex items-center justify-between gap-6">
              
              {/* BRANDED ALERT INFO */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-action/10 border border-action/20 flex items-center justify-center text-action">
                      <ExternalLink size={16} />
                   </div>
                   <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-heading">Artisan Experience Tip</h3>
                </div>
                <div className="space-y-1.5 pl-11">
                  <p className="text-[11px] font-medium leading-tight text-label">
                    Browsing from <span className="text-heading font-bold">Messenger</span>?
                  </p>
                  <p className="text-[12px] font-serif italic text-heading leading-tight">
                    "Tap the <span className="font-bold underline decoration-action">3 dots</span> below and select <span className="font-bold">Open in Browser</span> for the best performance."
                  </p>
                </div>
              </div>

              {/* DYNAMIC HINT VISUAL */}
              <div className="relative flex-shrink-0 w-24 h-12 bg-app/50 rounded-2xl border border-soft flex items-center justify-center gap-2 overflow-hidden shadow-inner">
                <div className="flex gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-label/20" />
                   <div className="w-1.5 h-1.5 rounded-full bg-label/20" />
                   <div className="relative">
                      <motion.div 
                        animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-action rounded-full"
                      />
                      <div className="relative w-1.5 h-1.5 rounded-full bg-action shadow-[0_0_8px_rgba(var(--action-rgb),0.5)]" />
                   </div>
                </div>

                {/* Animated Finger Pointer */}
                <motion.div 
                  animate={{ 
                    y: [-40, 5, 10, 5, -40],
                    opacity: [0, 1, 1, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    times: [0, 0.4, 0.5, 0.6, 1],
                  }}
                  className="absolute bottom-[-10px] right-2 text-action pointer-events-none rotate-180"
                >
                  <MousePointer2 size={24} className="fill-action stroke-app border-2" />
                </motion.div>
              </div>

            </div>
          </div>

          {/* PROGRESS INDICATOR (Visual Timer) */}
          <motion.div 
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3.5, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-action origin-left opacity-30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
