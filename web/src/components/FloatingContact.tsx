"use client";

import { MessageCircle, Facebook, MessageSquare, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import InquiryModal from "./InquiryModal";
import { useUIStore } from "@/store/useUIStore";

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll listener to shrink the button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
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
      icon: <MessageCircle size={20} strokeWidth={1.5} className="fill-[#128C7E] stroke-[0.5]" />,
      label: "WhatsApp",
      href: whatsappLink,
      color: "bg-[#25D366]",
      textColor: "text-white",
    },
    {
      icon: <Facebook size={20} strokeWidth={1.5} className="fill-[#0084FF] stroke-[0.5]" />,
      label: "Messenger",
      href: messengerLink,
      color: "bg-[#0084FF]",
      textColor: "text-white",
    },
    {
      icon: <MessageSquare size={20} strokeWidth={2.5} />,
      label: "Inquiry",
      onClick: () => setShowInquiryModal(true),
      color: "bg-action",
      textColor: "text-app",
      showLabel: true,
    },
  ];

  const { activeLocks } = useUIStore();
  const isAnyModalOpen = activeLocks.size > 0;

  if (pathname?.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {!isAnyModalOpen && (
        <motion.div
          key="fc-trigger-container"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-0 right-0 z-[9999999] flex flex-col items-end gap-4 p-6 md:p-10"
        >
          {/* MAIN TOGGLE BUTTON - Morphs on scroll */}
          <motion.button
            layout
            onClick={() => setIsOpen(!isOpen)}
            className={`h-14 flex items-center justify-center transition-all duration-500 overflow-hidden border ring-1 ${
              isOpen
                ? "bg-heading rounded-full w-14 shadow-2xl border-bone/20 ring-white/10"
                : "bg-action hover:scale-105 active:scale-95 shadow-lg shadow-accent/20 border-bone/10 ring-white/5"
            } ${
              !isOpen &&
              (scrolled
                ? "rounded-full w-14"
                : "rounded-full px-5 min-w-[56px]")
            }`}
          >
            {isOpen ? (
              <X size={20} strokeWidth={2.5} className="text-app" />
            ) : (
              <div className="flex items-center gap-3">
                {!scrolled && (
                  <span className="text-[11px] font-sans font-extrabold uppercase tracking-[0.2em] text-white whitespace-nowrap">
                    Chat Now
                  </span>
                )}
                <MessageSquare size={20} strokeWidth={2.5} className="text-app" />
              </div>
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
                      className={`flex items-center gap-3 px-5 py-3.5 rounded-full shadow-lg ${btn.color} ${btn.textColor} hover:scale-105 transition-transform duration-200 w-full justify-end`}
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
                      className={`flex items-center gap-3 px-5 py-3.5 rounded-full shadow-lg ${btn.color} ${btn.textColor} hover:scale-105 transition-transform duration-200`}
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
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        title=" Inquiry"
        subtitle="How can we assist you today?"
      />
    </AnimatePresence>
  );
};

export default FloatingContact;
