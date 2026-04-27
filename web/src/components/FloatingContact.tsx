"use client";

import { MessageCircle, Facebook, MessageSquare, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { BusinessMetaData } from "@/types";
import InquiryModal from "./InquiryModal";

interface FloatingContactProps {
  businessMetaData?: BusinessMetaData | null;
}

const FloatingContact = ({ businessMetaData }: FloatingContactProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { activeLocks, isInquiryModalOpen, setIsInquiryModalOpen, isContactSuiteOpen, setIsContactSuiteOpen } = useUIStore();

  // Scroll listener for visibility - Syncing with header transition
  useEffect(() => {
    setMounted(true);
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
  const whatsappNumber = businessMetaData?.whatsapp || "undefined_setmetadata_in_studio";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  // Messenger link
  const messengerLink = businessMetaData?.messengerUrl || "undefined_setmetadata_in_studio";

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
      href: `tel:${businessMetaData?.phone || "undefined_setmetadata_in_studio"}`,
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

  if (pathname?.startsWith("/admin") || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && !isAnyModalOpen && (
        <motion.div
          key="fc-trigger-container"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-0 right-0 z-[400] flex flex-col items-end gap-4 p-6 md:p-10"
        >
          {/* MAIN TOGGLE BUTTON - Minimalist Circular Action */}
          <motion.button
            layout
            onClick={() => setIsContactSuiteOpen(!isContactSuiteOpen)}
            className={`w-14 h-14 flex items-center justify-center transition-all duration-500 rounded-full border shadow-lg ring-1 ${
              isContactSuiteOpen
                ? "bg-heading border-bone/20 ring-white/10 shadow-2xl"
                : "bg-action border-bone/10 ring-white/5 hover:scale-105 active:scale-95 shadow-accent/20"
            }`}
          >
            {isContactSuiteOpen ? (
              <X size={20} strokeWidth={2.5} className="text-app" />
            ) : (
              <MessageSquare size={20} strokeWidth={2.5} className="text-app" />
            )}
          </motion.button>

          {/* DROPDOWN MENU */}
          <AnimatePresence>
            {isContactSuiteOpen && (
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
                        setIsContactSuiteOpen(false);
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
        businessMetaData={businessMetaData}
        title="Inquiry Hub"
        subtitle="How would you like to connect?"
      />
    </AnimatePresence>,
    document.body
  );
};

export default FloatingContact;
