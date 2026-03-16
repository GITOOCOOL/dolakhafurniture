"use client";

import { useState, useEffect } from "react";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavbarActions from "@/components/NavbarActions";
import CategoryNav from "@/components/CategoryNav";
import { Menu, X, Leaf, Search, Facebook, Instagram } from "lucide-react"; // Added Leaf for a boho touch
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "lucide-react";

// Boho Typography: Elegant Serif for Headlines, Soft Sans for Body
const serif = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  style: ['italic', 'normal']
});

const sans = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"]
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen, isSearchOpen]);

  // Expanded nav links for Etsy-like category bar
  // Categories are now dynamically fetched in the CategoryNav component

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        {/* Updated Neon Pulse to a "Boho Glow" (Terracotta/Ochre) */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes boho-glow {
            0%, 100% { filter: drop-shadow(0 0 2px rgba(163, 87, 58, 0.4)); }
            50% { filter: drop-shadow(0 0 8px rgba(223, 145, 82, 0.6)); }
          }
          .neon-hover:hover { animation: boho-glow 2s infinite; }
        `}} />
      </head>
      {/* Changed bg-stone-50 to a custom soft cream and updated fonts */}
      <body className={`${serif.variable} ${sans.variable} antialiased bg-[#fdfaf5] text-[#3d2b1f] font-sans overflow-x-hidden w-full max-w-full`}>

        {/* --- ETSY-STYLE HEADER --- */}
        <header className="sticky top-0 z-50 w-full bg-[#fdfaf5] border-b border-[#e5dfd3] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {/* Top Row: Hamburger, Logo/Search, Actions */}
          <div className="container mx-auto px-4 md:px-6 w-full flex items-center py-3 md:py-4">

            {/* 1. LEFT ZONE: Hamburger + Shop All */}
            <div className="flex-1 flex items-center justify-start gap-2">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2.5 text-[#3d2b1f] hover:bg-[#e5dfd3]/30 rounded-full transition-colors -ml-2"
                aria-label="Menu"
              >
                <Menu size={28} strokeWidth={1.5} />
              </button>

              <Link
                href="/shop"
                className="h-[48px] flex items-center px-4 md:px-6 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-[#3d2b1f] hover:bg-[#e5dfd3]/30 rounded-full transition-colors whitespace-nowrap"
              >
                Shop All
              </Link>
            </div>

            {/* 2. CENTER ZONE: Logo */}
            <div className="flex-1 flex items-center justify-center relative z-10 min-w-0">
              <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                <div className="relative flex-shrink-0 flex items-center justify-center">
                  {/* House Graphic Frame */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-14 h-14 md:w-20 md:h-20 text-[#a3573a] opacity-20 absolute transition-transform duration-700 group-hover:scale-110"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>

                  <img
                    src="/logo.png"
                    alt="Home"
                    className="w-8 h-8 md:w-11 md:h-11 aspect-square object-contain transition-transform duration-700 group-hover:rotate-6 relative z-10 mt-1.5"
                  />
                </div>
                <span className="hidden lg:block text-2xl xl:text-3xl font-serif italic tracking-tight text-[#3d2b1f]">
                  Dolakha<span className="text-[#a3573a]">.</span>Furniture
                </span>
              </Link>
            </div>

            {/* 3. RIGHT ZONE: Actions */}
            <div className="flex-1 flex items-center justify-end">
              <NavbarActions onSearchClick={() => setIsSearchOpen(true)} />
            </div>
          </div>



          {/* Bottom Row: Category Navigation Desktop */}
          <div className="hidden md:flex container mx-auto px-6 pb-3 justify-center">
            <CategoryNav />
          </div>
        </header>

        {/* --- FULL SCREEN SEARCH MODAL --- */}
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

        {/* --- FULL SCREEN MOBILE MENU (Warm Tones) --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="fixed inset-0 bg-[#fdfaf5] z-[100] flex flex-col p-8 overflow-hidden justify-start items-start"
            >
              {/* Header: Fixed and strictly at the top */}
              <div className="flex-shrink-0 flex justify-between items-center w-full h-16 mb-8">
                <div className="flex items-center gap-2">
                  <Leaf className="text-[#a3573a]" size={18} />
                  <p className="text-xs font-serif italic tracking-widest text-[#3d2b1f]">Menu</p>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-4 bg-[#3d2b1f] text-[#fdfaf5] rounded-full shadow-lg transition-all"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>

              {/* Menu Content: Scrollable flex-1 area */}
              <div className="flex-1 w-full overflow-hidden">
                <CategoryNav isMobile={true} onItemClick={() => setIsMenuOpen(false)} />
              </div>

              {/* Footer: Stays at the bottom */}
              <div className="flex-shrink-0 w-full border-t border-[#e5dfd3] pt-10 pb-6">
                <div className="flex gap-8 mb-4 font-serif italic text-[#3d2b1f]">
                  <a href="https://facebook.com/dolakhafurniture" className="hover:text-[#a3573a]"><Facebook size={20} /></a>
                  <a href="https://instagram.com/dolakhafurnituredesign" className="hover:text-[#a3573a]"><Instagram size={20} /></a>
                  <a href="https://tiktok.com/@dolakhafurniture" className="hover:text-[#a3573a]">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.61-1.49-2.11-2.46-.01 2.13.01 4.26-.01 6.38-.04 2.11-.46 4.38-1.92 6.01-1.62 1.83-4.22 2.58-6.6 2.18-2.6-.44-4.83-2.61-5.32-5.22-.54-2.84.58-6.04 2.94-7.69 1.52-1.07 3.51-1.46 5.33-1.05v4.1c-.88-.25-1.87-.21-2.69.24-1.2.66-1.85 2.11-1.6 3.47.2 1.14 1.13 2.14 2.27 2.32 1.34.2 2.82-.36 3.5-1.55.33-.58.46-1.25.45-1.92V.02z" />
                    </svg>
                  </a>

                </div>
                <p className="text-[10px] uppercase tracking-widest text-[#a89f91]">Crafted in the Himalayas</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="min-h-screen w-full relative">{children}</main>

        {/* --- FOOTER (Natural tones & Dotted accents) --- */}
        <footer className="border-t border-[#e5dfd3] border-dotted bg-[#1a1c13] text-[#e2e8da] py-20 w-full">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
              <div className="lg:col-span-2">
                <h3 className="text-[#fdfaf5] text-3xl font-serif italic mb-6 leading-relaxed">
                  "Sustainably sourced, <br /> thoughtfully crafted."
                </h3>
                <p className="text-[#a89f91] text-sm font-light italic leading-relaxed">
                  Each piece is a testament to our commitment to quality and sustainability. Our other platforms are just a click away, where you can explore more of our story and collections.
                </p>
                <br />
                <div className="flex justify-center md:justify-start gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
                  <a href="https://facebook.com/dolakhafurniture" target="_blank" className="hover:text-[#df9152] transition-colors">Facebook</a>
                  <a href="https://instagram.com/dolakhafurnituredesign" target="_blank" className="hover:text-[#df9152] transition-colors">Instagram</a>
                  <a href="https://tiktok.com/@dolakhafurniture" target="_blank" className="hover:text-[#df9152] transition-colors">TikTok</a>
                </div>
              </div>
              <div className="md:ml-auto w-full">
                <p className="text-[#fdfaf5] text-xs font-serif italic mb-4">Join our Socials</p>
                <div className="flex border-b border-[#3d2b1f] pb-2 max-w-xs mx-auto md:mx-0">
                  <input
                    type="text"
                    placeholder="EMAIL ADDRESS"
                    className="bg-transparent text-xs w-full outline-none placeholder:text-[#a89f91] placeholder:text-[10px] tracking-widest"
                    suppressHydrationWarning
                  />
                  <button className="text-[#df9152] font-serif italic">→</button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
