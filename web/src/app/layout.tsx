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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  // Expanded nav links for Etsy-like category bar
  // Categories are now dynamically fetched in the CategoryNav component

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      {/* Changed bg-stone-50 to a custom soft cream and updated fonts */}
      <body className={`${serif.variable} ${sans.variable} antialiased bg-[#fdfaf5] text-[#3d2b1f] font-sans overflow-x-hidden w-full max-w-full`}>

        {/* --- ETSY-STYLE HEADER --- */}
        <header className="sticky top-0 z-50 w-full bg-[#fdfaf5] border-b border-[#e5dfd3] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {/* Top Row: Logo, Search, Actions */}
          <div className="container mx-auto px-4 md:px-6 w-full flex items-center justify-between py-3 md:py-4 gap-4 md:gap-8">

            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="relative flex-shrink-0 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="w-10 h-10 md:w-12 md:h-12 aspect-square object-contain transition-transform duration-700 group-hover:rotate-6"
                />
              </div>
              <span className="hidden lg:block text-2xl font-serif italic tracking-tight text-[#3d2b1f]">
                Dolakha<span className="text-[#a3573a]">.</span>Furniture
              </span>
            </Link>

            {/* Search Bar (Center, expanding) */}
            <div className="flex-1 max-w-2xl hidden md:flex items-center group relative">
              <input
                type="text"
                placeholder="Search for furniture, decor, and more..."
                className="w-full bg-white border border-[#e5dfd3] text-[#3d2b1f] placeholder:text-[#a89f91] text-sm md:text-base rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#a3573a]/30 focus:border-[#a3573a] transition-all shadow-sm group-hover:shadow-md"
              />
              <button className="absolute right-1.5 p-2 bg-[#a3573a] text-white rounded-full hover:bg-[black] transition-colors shadow-sm">
                <Search size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Actions Section */}
            <div className="flex-shrink-0 flex items-center gap-2 md:gap-4">
              <NavbarActions />
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 text-[#3d2b1f] hover:bg-[#e5dfd3]/30 rounded-full transition-colors ml-1"
                aria-label="Menu"
              >
                <Menu size={24} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Only visible on small screens below md) */}
          <div className="md:hidden px-4 pb-3 w-full">
            <div className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Search furniture & decor..."
                className="w-full bg-white border border-[#e5dfd3] text-[#3d2b1f] placeholder:text-[#a89f91] text-sm rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#a3573a]/30 focus:border-[#a3573a] shadow-sm"
              />
              <button className="absolute right-2 text-[#a3573a] p-1.5 hover:bg-[#fdfaf5] rounded-full transition-colors">
                <Search size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Bottom Row: Category Navigation Desktop */}
          <div className="hidden md:flex container mx-auto px-6 pb-3 justify-center">
            <CategoryNav />
          </div>
        </header>

        {/* --- FULL SCREEN MOBILE MENU (Warm Tones) --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="fixed inset-0 bg-[#fdfaf5] z-[100] flex flex-col p-8 overflow-hidden"
            >
              <div className="flex justify-between items-center h-20 mb-12">
                <div className="flex items-center gap-2">
                  <Leaf className="text-[#a3573a]" size={18} />
                  <p className="text-xs font-serif italic tracking-widest text-[#3d2b1f]">Menu</p>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-4 bg-[#3d2b1f] text-[#fdfaf5] rounded-full shadow-lg active:scale-90 transition-all"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>

              <CategoryNav isMobile={true} onItemClick={() => setIsMenuOpen(false)} />

              <div className="mt-auto border-t border-[#e5dfd3] pt-10 pb-6">
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
                  />
                  <button className="text-[#df9152] font-serif italic">→</button>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Updated Neon Pulse to a "Boho Glow" (Terracotta/Ochre) */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes boho-glow {
            0%, 100% { filter: drop-shadow(0 0 2px rgba(163, 87, 58, 0.4)); }
            50% { filter: drop-shadow(0 0 8px rgba(223, 145, 82, 0.6)); }
          }
          .neon-hover:hover { animation: boho-glow 2s infinite; }
        `}} />
      </body>
    </html>
  );
}
