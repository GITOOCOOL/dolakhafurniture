"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavbarActions from "@/components/NavbarActions";
import CategoryNav from "@/components/CategoryNav";
import { Menu, X, Leaf, Search, Facebook, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { trackEvent } from "./MetaPixel";
import CampaignModal from "./CampaignModal";
import Modal from "./ui/Modal";
import { Campaign } from "@/types";

interface HeaderClientProps {
  latestCampaign?: Campaign | null;
}

export default function HeaderClient({ latestCampaign }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { lockScroll, unlockScroll, setCampaignModalOpen } = useUIStore();

  useEffect(() => {
    if (isMenuOpen) lockScroll("mobile-menu");
    else unlockScroll("mobile-menu");
    return () => unlockScroll("mobile-menu");
  }, [isMenuOpen, lockScroll, unlockScroll]);

  useEffect(() => {
    if (isSearchOpen) lockScroll("main-search");
    else unlockScroll("main-search");
    return () => unlockScroll("main-search");
  }, [isSearchOpen, lockScroll, unlockScroll]);

  return (
    <>
      <header className="sticky top-0 z-[100] w-full bg-app border-b border-soft shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="container mx-auto px-2 md:px-6 w-full flex items-center justify-between py-3 md:py-4 gap-2">
          <div className="flex-none flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="w-[38px] h-[38px] flex items-center justify-center text-heading hover:text-action transition-all -ml-1 md:-ml-2 flex-shrink-0"
              aria-label="Menu"
            >
              <Menu size={26} className="md:w-7 md:h-7" strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2">
              {latestCampaign && (
                <button
                  onClick={() => setCampaignModalOpen(true)}
                  className="h-8 md:h-[48px] flex items-center px-4 md:px-6 text-[10px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-white bg-action hover:bg-espresso rounded-full transition-all whitespace-nowrap flex-shrink-0 shadow-lg shadow-accent/20 animate-in fade-in slide-in-from-left-4 duration-500"
                >
                  <span className="mr-2">🏮</span>
                  Offers
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center min-w-0">
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0"
            >
              <div className="relative flex-shrink-0 w-14 h-14 md:w-20 md:h-20 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full text-action opacity-20 absolute transition-transform duration-700 group-hover:scale-110"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                <img
                  src="/logo.png"
                  alt="Home"
                  style={{ width: "22px", height: "22px" }}
                  className="md:w-11 md:h-11 aspect-square object-contain transition-transform duration-700 group-hover:rotate-6 relative z-10 mt-1"
                />
              </div>
              <span className="hidden lg:block text-2xl xl:text-3xl font-serif italic tracking-tight text-heading">
                Dolakha<span className="text-action">.</span>Furniture
              </span>
            </Link>
          </div>

          <div className="flex-none flex items-center justify-end">
            <NavbarActions onSearchClick={() => {}} />
          </div>
        </div>

        <div className="hidden md:flex container mx-auto px-6 pb-3 justify-center w-full">
          <CategoryNav />
        </div>

        {/* --- CAMPAIGN TAKEOVER (Inside header context for prioritized layering) --- */}
        <CampaignModal campaign={latestCampaign || null} />
      </header>

      {/* 
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-app z-[200] flex flex-col items-center pt-20 px-6"
          >
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 p-3 text-heading hover:border-soft/30 rounded-full transition-colors cursor-pointer touch-manipulation"
            >
              <X size={32} strokeWidth={1.2} />
            </button>
            <div className="w-full max-w-4xl space-y-12">
              <div className="text-center space-y-4">
                <Leaf className="mx-auto text-action opacity-40" size={32} />
                <h2 className="text-4xl md:text-6xl font-serif italic text-heading">What can we craft for you?</h2>
              </div>
              <div className="relative group">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by collection, material, or style..."
                  className="w-full bg-transparent border-b-2 border-soft text-heading placeholder:text-label text-2xl md:text-4xl py-6 focus:outline-none focus:border-action transition-all font-light"
                  suppressHydrationWarning
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const value = (e.target as HTMLInputElement).value;
                      if (value.trim()) {
                        trackEvent("Search", { search_string: value });
                      }
                    }
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Search size={40} strokeWidth={1} className="text-action opacity-30 group-focus-within:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-label w-full text-center mb-2">Popular Searches</span>
                {['Sofa Sets', 'Dining Tables', 'Wardrobes', 'Beds', 'Office Chairs'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="px-6 py-2 rounded-full border border-soft text-heading hover:border-action hover:text-action transition-all text-[11px] font-medium uppercase tracking-wider cursor-pointer touch-manipulation"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      */}
      <Modal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        position="left"
        title="Navigation"
      >
        <div className="w-full h-full flex flex-col">
          <div className="w-full flex-1">
            {/* FESTIVE CAMPAIGN TRIGGER (Uniform System Inversion) */}
            {latestCampaign && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setCampaignModalOpen(true);
                }}
                className="w-full mb-10 p-6 rounded-[2rem] bg-heading border border-soft/20 flex items-center justify-between group overflow-hidden relative"
              >
                <div className="relative z-10 flex items-center gap-5">
                  <span className="text-3xl animate-bounce-slow">🏮</span>
                  <div className="text-left">
                    <p className="type-label text-app/50 uppercase tracking-[0.2em] text-[9px] mb-1">
                      Limited Time Offer
                    </p>
                    <p className="type-product text-app group-hover:text-white transition-colors">
                      Exclusive Festive Collection
                    </p>
                  </div>
                </div>
                <div className="relative z-10 w-10 h-10 rounded-full border border-soft/20 flex items-center justify-center text-app group-hover:bg-white group-hover:text-action transition-all">
                  →
                </div>

                {/* Aesthetic Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-app/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-all" />
              </button>
            )}

            <CategoryNav
              isMobile={true}
              onItemClick={() => setIsMenuOpen(false)}
            />
          </div>

          <div className="flex-shrink-0 w-full border-t border-soft/20 pt-10 pb-6 mt-10">
            <div className="flex gap-8 mb-6">
              <a
                href="https://facebook.com/dolakhafurniture"
                className="text-heading/40 hover:text-action transition-all flex items-center gap-2"
              >
                <Facebook size={22} strokeWidth={1.5} />
              </a>
              <a
                href="https://instagram.com/dolakhafurnituredesign"
                className="text-heading/40 hover:text-action transition-all flex items-center gap-2"
              >
                <Instagram size={22} strokeWidth={1.5} />
              </a>
              <a
                href="https://tiktok.com/@dolakhafurniture"
                className="text-heading/40 hover:text-action transition-all flex items-center gap-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.61-1.49-2.11-2.46-.01 2.13.01 4.26-.01 6.38-.04 2.11-.46 4.38-1.92 6.01-1.62 1.83-4.22 2.58-6.6 2.18-2.6-.44-4.83-2.61-5.32-5.22-.54-2.84.58-6.04 2.94-7.69 1.52-1.07 3.51-1.46 5.33-1.05v4.1c-.88-.25-1.87-.21-2.69.24-1.2.66-1.85 2.11-1.6 3.47.2 1.14 1.13 2.14 2.27 2.32 1.34.2 2.82-.36 3.5-1.55.33-.58.46-1.25.45-1.92V.02z" />
                </svg>
              </a>
            </div>
            <p className="type-label text-description/40 uppercase tracking-[0.3em] text-[9px]">
              Honest Craft, Nepal
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
