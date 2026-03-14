"use client";

import React from 'react';
import { ArrowRight, MessageCircle, Instagram, Facebook, Mail, Leaf, Phone } from 'lucide-react';
import Link from 'next/link';
import Bulletin from '@/components/Bulletin';

const Hero = () => {
  return (
    <section className="relative w-full lg:min-h-[90vh] flex flex-col justify-center bg-[#fdfaf5] overflow-hidden border-b border-[#e5dfd3] border-dotted">
      
      {/* 1. BOHO SIDEBAR (SUBTLE SERIF) */}
      <div className="hidden xl:flex fixed left-0 top-0 bottom-0 w-20 border-r border-[#e5dfd3] border-dotted flex-col items-center justify-center gap-10 z-50 bg-white/30 backdrop-blur-sm">
        <p className="rotate-180 [writing-mode:vertical-lr] text-[10px] font-serif italic tracking-[0.4em] text-[#a89f91]">
          Dolakha home Archive / 2024
        </p>
      </div>

      <div className="container mx-auto px-6 xl:pl-40 pt-10 pb-20 lg:py-24 relative z-10">
        
        {/* 2. MAIN BRANDING */}
        <div className="max-w-6xl">
          {/* I will later add a dynamic news ticker here that fetches updates from the backend, but for now these are hardcoded bulletins to add some life and movement to the hero section. The colors can be customized via props, and the component is designed to be reusable across the site for any important announcements or promotions. */}
          <Bulletin news="Now Delivering Across Kathmandu, Bhaktapur, Lalitpur and Surrounds" color="#0d00ff"/>
          <Bulletin news="New Year Sale - Up to 30% Off - Starting Soon" color="#d95518"/>
          
          <h1 className="text-[14vw] lg:text-[10rem] font-serif italic font-medium leading-[0.85] mb-14 text-[#3d2b1f] tracking-tight">
            Dolakha<br />
            <span className="text-[#a3573a] decoration-[#e5dfd3] underline-offset-[1.5rem] underline decoration-dotted">Furniture.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Mission Statement */}
            <div className="space-y-12">
              <div className="space-y-6 border-l-2 border-[#a3573a] pl-8">
                <p className="text-[#3d2b1f] font-serif italic text-2xl lg:text-3xl max-w-md leading-relaxed">
                  "Redefining Nepali spaces with our signature iron-wood fusion."
                </p>
                <p className="text-[#a89f91] text-sm lg:text-base font-light leading-relaxed max-w-sm">
                  Thoughtfully crafted for your home, designed for a lifetime of beauty.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-5">
                <Link href="/shop" className="w-full bg-[#3d2b1f] text-[#fdfaf5] px-6 py-6 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-[#a3573a] transition-all shadow-xl flex items-center gap-3 active:scale-95">
                  Shop Now <ArrowRight size={16} />
                </Link>
              </div>
              <div className="flex gap-5">
                <a 
                    href="tel:+9779808005210" /* Replace with your actual business number */
                    className="w-full bg-white border border-[#e5dfd3] text-[#3d2b1f] px-6 py-6 rounded-full font-sans font-bold uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#fdfaf5] transition-all active:scale-95 shadow-sm"
                >
                    <Phone size={16} className="text-[#a3573a]" /> 
                    Call Us Anytime
                </a>
                <a href="https://wa.me" target="_blank" className="w-full bg-white border border-[#e5dfd3] text-[#3d2b1f] px-6 py-6 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 hover:bg-[#fdfaf5] transition-all active:scale-95 shadow-sm">
                  <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp
                </a>
              </div>
            </div>

            {/* 3. THE SOCIAL GRID (CLEAN & SPACED) */}
            {/* 3. THE SOCIAL GRID (CLEAN & SPACED) */}
            <div className="bg-white/40 p-8 md:p-16 rounded-[4rem] md:rounded-[5rem] border border-[#e5dfd3] backdrop-blur-md relative">
            <Leaf className="absolute -top-4 -right-4 md:-top-6 md:-right-6 text-[#a3573a] rotate-12 opacity-30" size={32} />
            
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-[#a89f91] mb-10 md:mb-16 text-center lg:text-left">
                Connect to our Socials
            </p>
            
            {/* MOBILE: Row of 4 icons | DESKTOP: Vertical list with large gaps */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-y-16">
                
                {/* Facebook */}
                <a href="https://facebook.com/dolakhafurniture" target="_blank" className="flex items-center gap-6 group justify-center sm:justify-start">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-[#fdfaf5] border border-[#e5dfd3] flex items-center justify-center shadow-sm group-hover:bg-[#3b5998] group-hover:text-white transition-all duration-700">
                    <Facebook strokeWidth={1.2} className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
                </div>
                <div className="hidden sm:flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#3d2b1f]">Facebook</span>
                    <span className="text-[9px] italic font-serif text-[#a89f91]">@dolakhafurniture</span>
                </div>
                </a>

                {/* Instagram */}
                <a href="https://instagram.com/dolakhafurnituredesign" target="_blank" className="flex items-center gap-6 group justify-center sm:justify-start">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-[#fdfaf5] border border-[#e5dfd3] flex items-center justify-center shadow-sm group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:to-purple-600 group-hover:text-white transition-all duration-700">
                    <Instagram strokeWidth={1.2} className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
                </div>
                <div className="hidden sm:flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#3d2b1f]">Instagram</span>
                    <span className="text-[9px] italic font-serif text-[#a89f91]">@dolakhafurnituredesign</span>
                </div>
                </a>

                {/* TikTok */}
                <a href="https://tiktok.com/@dolakhafurniture" target="_blank" className="flex items-center gap-6 group justify-center sm:justify-start">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-[#fdfaf5] border border-[#e5dfd3] flex items-center justify-center shadow-sm group-hover:bg-[#1a1c13] group-hover:text-white transition-all duration-700">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] fill-current" xmlns="http://www.w3.org">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.61-1.49-2.11-2.46-.01 2.13.01 4.26-.01 6.38-.04 2.11-.46 4.38-1.92 6.01-1.62 1.83-4.22 2.58-6.6 2.18-2.6-.44-4.83-2.61-5.32-5.22-.54-2.84.58-6.04 2.94-7.69 1.52-1.07 3.51-1.46 5.33-1.05v4.1c-.88-.25-1.87-.21-2.69.24-1.2.66-1.85 2.11-1.6 3.47.2 1.14 1.13 2.14 2.27 2.32 1.34.2 2.82-.36 3.5-1.55.33-.58.46-1.25.45-1.92V.02z" />
                    </svg>
                </div>
                <div className="hidden sm:flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#3d2b1f]">TikTok</span>
                    <span className="text-[9px] italic font-serif text-[#a89f91]">@dolakhafurniture</span>
                </div>
                </a>

                {/* Email */}
                <a href="mailto:dolakhafurniture@gmail.com" className="flex items-center gap-6 group justify-center sm:justify-start">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-[#fdfaf5] border border-[#e5dfd3] flex items-center justify-center shadow-sm group-hover:bg-[#a3573a] group-hover:text-white transition-all duration-700">
                    <Mail strokeWidth={1.2} className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
                </div>
                <div className="hidden sm:flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#3d2b1f]">Email</span>
                    <span className="text-[9px] italic font-serif text-[#a89f91]">Message us</span>
                </div>
                </a>
                
            </div>
            </div>


          </div>
        </div>

        {/* 4. TRUST SIGNALS (NATURAL TONES) */}
        <div className="mt-24 flex flex-wrap gap-12 lg:gap-24 border-t border-[#e5dfd3] border-dotted pt-16">
           <div className="flex flex-col gap-2">
              <span className="text-4xl font-serif italic text-[#3d2b1f]">Free</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a89f91]">Delivery in Ktm</span>
           </div>
           <div className="flex flex-col gap-2">
              <span className="text-4xl font-serif italic text-[#3d2b1f]">100+</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a89f91]">Artisan Pieces</span>
           </div>
           <div className="flex flex-col gap-2">
              <span className="text-4xl font-serif italic text-[#3d2b1f]">Pure</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a89f91]">Iron-Wood Fusion</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
