"use client";

import { MessageCircle, Facebook, MessageSquare, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InquiryModal from "./InquiryModal";

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
  const whatsappNumber = "61410765748";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  // Messenger link
  const messengerLink = "https://m.me/224061751418570";

  const buttons = [
    {
      icon: <MessageCircle size={20} className="fill-[#128C7E] stroke-[0.5]" />,
      label: "WhatsApp",
      href: whatsappLink,
      color: "bg-[#25D366]",
      textColor: "text-white",
    },
    {
      icon: <Facebook size={20} className="fill-[#0084FF] stroke-[0.5]" />,
      label: "Messenger",
      href: messengerLink,
      color: "bg-[#0084FF]",
      textColor: "text-white",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Inquiry",
      onClick: () => setShowInquiryModal(true),
      color: "bg-action",
      textColor: "text-white",
      showLabel: true,
    },
  ];

  return (
    <div 
      className="fixed right-6 z-[9999999] flex flex-col items-end gap-3"
      style={{ top: "18vh" }}
    >
      {/* MAIN TOGGLE BUTTON - Morphs on scroll */}
      <motion.button
        layout
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden ${
          isOpen ? "bg-espresso rounded-full w-14" : "bg-action hover:scale-105 active:scale-95"
        } ${!isOpen && (scrolled ? "rounded-full w-14" : "rounded-full px-5 min-w-[56px]")}`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X size={26} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              {/* Text only shows when at the top and not open */}
              {!scrolled && (
                <motion.span 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-[11px] font-sans font-extrabold uppercase tracking-[0.2em] text-white whitespace-nowrap"
                >
                  Chat Now
                </motion.span>
              )}
              <MessageSquare size={26} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
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

      <InquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        title=" Inquiry"
        subtitle="How can we assist you today?"
      />
    </div>
  );
};

export default FloatingContact;
