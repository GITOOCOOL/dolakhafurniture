"use client";

import { MessageCircle, Facebook, MessageSquare, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import InquiryModal from "./InquiryModal";
import { useUIStore } from "@/store/useUIStore";

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { activeLocks, isInquiryModalOpen, setIsInquiryModalOpen } = useUIStore();

  // Scroll listener for visibility - Syncing with header transition
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

  // Pre-filled WhatsApp link
  const whatsappNumber = "9779808005210";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  // Messenger link
  const messengerLink = "https://m.me/224061751418570";

  const buttons = [
    {
      icon: (
        <Phone
          size={20}
          strokeWidth={1.5}
          className="text-app"
        />
      ),
      label: "Phone Call",
      href: "tel:9861326438",
      color: "bg-heading",
      textColor: "text-app",
    },
    {
      icon: (
        <MessageCircle
          size={20}
          strokeWidth={1.5}
          className="fill-[#128C7E] stroke-[0.5]"
        />
      ),
      label: "WhatsApp",
      href: whatsappLink,
      color: "bg-[#25D366]",
      textColor: "text-white",
    },
    {
      icon: (
        <Facebook
          size={20}
          strokeWidth={1.5}
          className="fill-[#0084FF] stroke-[0.5]"
        />
      ),
      label: "Messenger",
      href: messengerLink,
      color: "bg-[#0084FF]",
      textColor: "text-white",
    },
    {
      icon: <MessageSquare size={20} strokeWidth={2.5} />,
      label: "Inquiry",
      onClick: () => setIsInquiryModalOpen(true),
      color: "bg-action",
      textColor: "text-app",
      showLabel: true,
    },
  ];

  const isAnyModalOpen = activeLocks.size > 0;

  if (pathname?.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {isVisible && !isAnyModalOpen && (
        <motion.div
          key="fc-trigger-container"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-0 right-0 z-[9999999] flex flex-col items-end gap-4 p-6 md:p-10"
        >
          {/* MAIN TOGGLE BUTTON - Minimalist Circular Action */}
          <motion.button
            layout
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 flex items-center justify-center transition-all duration-500 rounded-full border shadow-lg ring-1 ${
              isOpen
                ? "bg-heading border-bone/20 ring-white/10 shadow-2xl"
                : "bg-action border-bone/10 ring-white/5 hover:scale-105 active:scale-95 shadow-accent/20"
            }`}
          >
            {isOpen ? (
              <X size={20} strokeWidth={2.5} className="text-app" />
            ) : (
              <MessageSquare size={20} strokeWidth={2.5} className="text-app" />
            )}
          </motion.button>

          {/* DROPDOWN MENU */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="flex flex-col items-end gap-3 mt-1"
              >
                {buttons.map((btn, idx) =>
                  btn.onClick ? (
                    <button
                      key={idx}
                      onClick={() => {
                        btn.onClick();
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between gap-3 px-6 py-3.5 rounded-full shadow-lg ${btn.color} ${btn.textColor} hover:scale-105 transition-transform duration-200 w-48`}
                    >
                      <span className="text-[11px] font-sans font-bold uppercase tracking-widest">
                        {btn.label}
                      </span>
                      {btn.icon}
                    </button>
                  ) : (
                    <a
                      key={idx}
                      href={btn.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between gap-3 px-6 py-3.5 rounded-full shadow-lg ${btn.color} ${btn.textColor} hover:scale-105 transition-transform duration-200 w-48`}
                    >
                      <span className="text-[11px] font-sans font-bold uppercase tracking-widest">
                        {btn.label}
                      </span>
                      {btn.icon}
                    </a>
                  ),
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
      <InquiryModal
        key="fc-inquiry-modal"
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        title=" Inquiry"
        subtitle="How can we assist you today?"
      />
    </AnimatePresence>
  );
};

export default FloatingContact;
