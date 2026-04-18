"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavbarActions from "@/components/NavbarActions";
import CategoryNav from "@/components/CategoryNav";
import { Menu, X, Leaf, Search, Facebook, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen, isSearchOpen]);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? "bg-[#fdfaf5]/80 backdrop-blur-md py-1 md:py-2 border-b border-[#e5dfd3] shadow-md pl-0 lg:pl-12" 
          : "bg-[#fdfaf5] py-3 md:py-4 border-b border-transparent pl-0 lg:pl-12"
      }`}>
        <div className="container mx-auto px-2 md:px-6 w-full flex items-center justify-between gap-2 overflow-hidden">
          
          <div className="flex-none flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="px-2 h-[38px] flex items-center justify-center gap-2 text-[#3d2b1f] hover:text-[#a3573a] transition-all -ml-1 md:-ml-2 flex-shrink-0"
              aria-label="Menu"
            >
              <Menu size={26} className="md:w-7 md:h-7" strokeWidth={1.5} />
              <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.2em] mt-0.5">Menu</span>
            </button>
            <div className="bg-[#3d2b1f] rounded-full">
              <Link
                href="/shop"
                className="h-8 md:h-[48px] flex items-center px-4 md:px-6 text-[10px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-white bg-[#3d2b1f] hover:bg-[#4d3b2f] rounded-full transition-all whitespace-nowrap flex-shrink-0"
              >
                Shop
              </Link>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center min-w-0">
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative flex-shrink-0 w-14 h-14 md:w-20 md:h-20 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full text-[#a3573a] opacity-20 absolute transition-transform duration-700 group-hover:scale-110"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                <img
                  src="/logo.png"
                  alt="Home"
                  style={{ width: '22px', height: '22px' }}
                  className="md:w-11 md:h-11 aspect-square object-contain transition-transform duration-700 group-hover:rotate-6 relative z-10 mt-1"
                />
              </div>
              <span className="hidden lg:block text-2xl xl:text-3xl font-serif italic tracking-tight text-[#3d2b1f]">
                Dolakha<span className="text-[#a3573a]">.</span>Furniture
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
      </header>

      {/* 
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#fdfaf5] z-[200] flex flex-col items-center pt-20 px-6"
          >
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 p-3 text-[#3d2b1f] hover:bg-[#e5dfd3]/30 rounded-full transition-colors cursor-pointer touch-manipulation"
            >
              <X size={32} strokeWidth={1.2} />
            </button>
            <div className="w-full max-w-4xl space-y-12">
              <div className="text-center space-y-4">
                <Leaf className="mx-auto text-[#a3573a] opacity-40" size={32} />
                <h2 className="text-4xl md:text-6xl font-serif italic text-[#3d2b1f]">What can we craft for you?</h2>
              </div>
              <div className="relative group">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by collection, material, or style..."
                  className="w-full bg-transparent border-b-2 border-[#e5dfd3] text-[#3d2b1f] placeholder:text-[#a89f91] text-2xl md:text-4xl py-6 focus:outline-none focus:border-[#a3573a] transition-all font-light"
                  suppressHydrationWarning
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Search size={40} strokeWidth={1} className="text-[#a3573a] opacity-30 group-focus-within:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#a89f91] w-full text-center mb-2">Popular Searches</span>
                {['Sofa Sets', 'Dining Tables', 'Wardrobes', 'Beds', 'Office Chairs'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="px-6 py-2 rounded-full border border-[#e5dfd3] text-[#3d2b1f] hover:border-[#a3573a] hover:text-[#a3573a] transition-all text-[11px] font-medium uppercase tracking-wider cursor-pointer touch-manipulation"
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

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 bg-[#fdfaf5] z-[100] flex flex-col p-8 overflow-y-auto justify-start items-start"
          >
            <div className="flex-shrink-0 flex justify-between items-center w-full h-16 mb-8">
              <div className="flex items-center gap-2">
                <Leaf className="text-[#a3573a]" size={18} />
                <p className="text-xs font-serif italic tracking-widest text-[#3d2b1f]">Menu</p>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 p-2 px-4 bg-[#3d2b1f] text-[#fdfaf5] rounded-full shadow-lg transition-all"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">Close</span>
                <X size={18} strokeWidth={2} />
              </button>
            </div>
            <div className="w-full">
              <CategoryNav isMobile={true} onItemClick={() => setIsMenuOpen(false)} />
            </div>
            <div className="flex-shrink-0 w-full border-t border-[#e5dfd3] pt-10 pb-6">
              <div className="flex gap-8 mb-4">
                <a href="https://facebook.com/dolakhafurniture" className="text-[#1877F2] hover:opacity-70 transition-opacity"><Facebook size={24} strokeWidth={1.5} /></a>
                <a href="https://instagram.com/dolakhafurnituredesign" className="text-[#e1306c] hover:opacity-70 transition-opacity"><Instagram size={24} strokeWidth={1.5} /></a>
                <a href="https://tiktok.com/@dolakhafurniture" className="text-[#010101] hover:opacity-70 transition-opacity">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.61-1.49-2.11-2.46-.01 2.13.01 4.26-.01 6.38-.04 2.11-.46 4.38-1.92 6.01-1.62 1.83-4.22 2.58-6.6 2.18-2.6-.44-4.83-2.61-5.32-5.22-.54-2.84.58-6.04 2.94-7.69 1.52-1.07 3.51-1.46 5.33-1.05v4.1c-.88-.25-1.87-.21-2.69.24-1.2.66-1.85 2.11-1.6 3.47.2 1.14 1.13 2.14 2.27 2.32 1.34.2 2.82-.36 3.5-1.55.33-.58.46-1.25.45-1.92V.02z" />
                  </svg>
                </a>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#a89f91]">Crafted in the Himalayas</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
