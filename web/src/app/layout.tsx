"use client";

import { useState, useEffect } from "react";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavbarActions from "@/components/NavbarActions";
import { Menu, X, Leaf } from "lucide-react"; // Added Leaf for a boho touch
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

  const navLinks = [
    { name: 'Shop All', href: '/shop' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Our Story', href: '/our-story' },
  ];

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      {/* Changed bg-stone-50 to a custom soft cream and updated fonts */}
      <body className={`${serif.variable} ${sans.variable} antialiased bg-[#fdfaf5] text-[#3d2b1f] font-sans overflow-x-hidden w-full max-w-full`}>
        
        {/* --- HEADER (Softer background and borders) --- */}
        <header className="sticky top-0 z-50 w-full border-b border-[#e5dfd3] bg-[#fdfaf5]/80 backdrop-blur-md">
          <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6 w-full">
            
            {/* Logo Section (More organic/craft look) */}
            <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
              <div className="relative flex-shrink-0 flex items-center justify-center">
                <img
                  src="/logo.png" 
                  alt="logo" 
                  className="w-12 h-12 md:w-14 md:h-14 aspect-square object-contain transition-transform duration-700 group-hover:rotate-12"
                />
              </div>
              <span className="hidden md:block text-2xl font-serif italic tracking-tight text-[#3d2b1f]">
                Dolakha<span className="text-[#a3573a]">.</span>Furniture
              </span>
            </Link>

            {/* Desktop Navigation (Swapped heavy tracking for elegant serif) */}
            <nav className="hidden lg:flex items-center gap-10 text-sm font-medium font-serif italic tracking-wide">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-[#3d2b1f] hover:text-[#a3573a] transition-all duration-300">
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex-shrink-0 flex items-center gap-2 md:gap-4">
              <NavbarActions />
              <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-[#3d2b1f] hover:text-[#a3573a] transition-colors">
                <Menu size={24} strokeWidth={1.5} />
              </button>
            </div>
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

              <nav className="flex flex-col items-start justify-center flex-grow gap-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-5xl font-serif italic text-[#3d2b1f] hover:text-[#a3573a] transition-all"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto border-t border-[#e5dfd3] pt-10 pb-6">
                <div className="flex gap-8 mb-4 font-serif italic text-[#3d2b1f]">
                    <a href="#" className="hover:text-[#a3573a]">Instagram</a>
                    <a href="#" className="hover:text-[#a3573a]">Pinterest</a>
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
                  "Sustainably sourced, <br/> thoughtfully crafted."
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
        <style dangerouslySetInnerHTML={{ __html: `
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
