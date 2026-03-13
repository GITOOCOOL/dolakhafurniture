"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavbarActions from "@/components/NavbarActions";
import { Menu, X } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Shop All', href: '/' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Our Story', href: '/our-story' },
  ];

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-50 text-stone-900 overflow-x-hidden w-full max-w-full`}>
        
        {/* --- HEADER --- */}
        <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-[#f0f9f4]/90 backdrop-blur-xl">
          <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6 w-full">
            
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
              <div className="relative flex-shrink-0 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="logo" 
                  className="w-9 h-9 md:w-12 md:h-12 aspect-square object-contain flex-shrink-0 transition-all duration-500 neon-hover
                            [filter:sepia(1)_hue-rotate(120deg)_brightness(0.5)_saturate(2)] 
                            group-hover:brightness-110 group-hover:saturate-150"
                  style={{ maxHeight: '48px', maxWidth: '48px' }} 
                />
              </div>
              <span className="hidden md:block text-xl font-black tracking-tighter uppercase italic leading-none text-stone-900">
                Dolakha<span className="text-orange-600 group-hover:animate-pulse">.</span>Furniture
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em]">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-stone-900 hover:text-orange-600 transition-all duration-300">
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex-shrink-0 flex items-center gap-2 md:gap-4">
              <NavbarActions />
              <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-stone-900 hover:text-orange-600 transition-colors">
                <Menu size={24} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </header>

        {/* --- FULL SCREEN MOBILE MENU --- */}
        {/* --- FULL SCREEN MOBILE MENU --- */}
<AnimatePresence>
  {isMenuOpen && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-white z-[100] flex flex-col p-6 overflow-hidden"
    >
      {/* 1. High Visibility Close Button (Fixed Right Top) */}
      <div className="flex justify-between items-center h-20 border-b border-stone-100 mb-12">
        <div className="flex items-center gap-3">
          <span className="h-1 w-8 bg-orange-600"></span>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-900">Close Menu</p>
        </div>
        
        <button 
          onClick={() => setIsMenuOpen(false)} 
          className="p-4 bg-stone-900 text-white rounded-full shadow-xl active:scale-90 transition-all flex items-center justify-center"
          aria-label="Close menu"
        >
          <X size={24} strokeWidth={3} />
        </button>
      </div>

      {/* 2. Centered Navigation Links */}
      <nav className="flex flex-col items-center justify-center flex-grow gap-12 text-center">
        {navLinks.map((link, i) => (
          <motion.div
            key={link.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", damping: 20 }}
          >
            <Link 
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-5xl font-black uppercase tracking-tighter text-stone-900 hover:text-orange-600 active:scale-95 transition-all block"
            >
              {link.name}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* 3. Modal Footer (Always Visible at Bottom) */}
      <div className="mt-auto border-t border-stone-100 pt-10 pb-6 text-center">
         <div className="flex justify-center gap-10 mb-6">
            <a href="#" className="text-[11px] font-black uppercase tracking-widest text-stone-900 hover:text-orange-600">Instagram</a>
            <a href="#" className="text-[11px] font-black uppercase tracking-widest text-stone-900 hover:text-orange-600">Pinterest</a>
         </div>
         <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400">Dolakha Furniture / Kathmandu</p>
      </div>
    </motion.div>
  )}
</AnimatePresence>


        {/* --- MAIN CONTENT --- */}
        <main className="min-h-screen w-full relative">{children}</main>

        {/* --- FOOTER --- */}
        <footer className="border-t border-stone-200 bg-stone-900 text-stone-400 py-20 mt-20 w-full">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="lg:col-span-2">
                <h3 className="text-white text-3xl font-serif italic mb-6">"Crafted in Dolakha, designed for your sanctuary."</h3>
                <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em]">
                  <a href="#" className="text-white hover:text-orange-500 transition-colors">Instagram</a>
                  <a href="#" className="text-white hover:text-orange-500 transition-colors">Twitter</a>
                </div>
              </div>
              <div className="md:ml-auto">
                <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">Newsletter</p>
                <div className="flex border-b border-stone-700 pb-2">
                   <input type="text" placeholder="YOUR@EMAIL.COM" className="bg-transparent text-[10px] w-full outline-none" />
                   <button className="text-orange-500 font-bold">→</button>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes neon-pulse {
            0%, 100% { filter: drop-shadow(0 0 2px #ea580c) drop-shadow(0 0 5px #ea580c); }
            50% { filter: drop-shadow(0 0 10px #ea580c) drop-shadow(0 0 20px #f97316); }
          }
          .neon-hover:hover { animation: neon-pulse 1.5s infinite; filter: none !important; }
        `}} />
      </body>
    </html>
  );
}
