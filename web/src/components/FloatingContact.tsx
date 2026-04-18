"use client";

import { MessageCircle, Facebook, MessageSquare, Plus, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Pre-filled WhatsApp link
  const whatsappNumber = "61410765748";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  // Messenger link
  const messengerLink = "https://m.me/224061751418570";

  const buttons = [
    {
      icon: <MessageCircle size={24} className="fill-[#128C7E] stroke-[0.5]" />,
      label: "WhatsApp",
      href: whatsappLink,
      color: "bg-[#25D366]",
      textColor: "text-white"
    },
    {
      icon: <Facebook size={24} className="fill-[#0084FF] stroke-[0.5]" />,
      label: "Messenger",
      href: messengerLink,
      color: "bg-[#0084FF]",
      textColor: "text-white"
    },
    {
      icon: <MessageSquare size={24} />,
      label: "Chat Now",
      href: "#",
      color: "bg-[#a3573a]",
      textColor: "text-white",
      showLabel: true
    }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex flex-col items-end gap-3 mb-2"
          >
            {buttons.map((btn, idx) => (
              <a
                key={idx}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-lg ${btn.color} ${btn.textColor} hover:scale-105 transition-transform duration-200`}
              >
                {(btn.label === "Chat Now" || isOpen) && (
                  <span className="text-[12px] font-sans font-bold uppercase tracking-widest">
                    {btn.label}
                  </span>
                )}
                {btn.icon}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden ${
          isOpen ? "bg-[#3d2b1f] rotate-90" : "bg-[#a3573a] hover:bg-[#b3674a]"
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X size={32} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <MessageSquare size={32} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default FloatingContact;
