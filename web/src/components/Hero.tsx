"use client";
import Link from 'next/link';
import { ArrowRight, Phone, MessageCircle, Leaf, Facebook, Instagram, Mail } from 'lucide-react';
import Button from './ui/Button';

// Removing the bulletins and heroImages props entirely, leaving it fully static and lightweight
const Hero = () => {
  return (
    <section className="relative w-full py-20 flex flex-col justify-center bg-white overflow-hidden">
      <div className="absolute inset-0 bg-app transition-colors duration-1000" />
      <div className="container mx-auto px-6 relative z-10">

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
          {/* Mission Statement & Actions */}
          <div className="space-y-12">
            <div className="space-y-6 border-l-2 border-action pl-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-description mb-2 drop-shadow-sm group-hover:text-action transition-colors">Our Mission</p>
              <h2 className="text-xl md:text-3xl font-serif italic text-heading leading-tight pr-4">
                "Redefining Nepali spaces with our signature iron-wood fusion."
              </h2>
              <p className="text-description text-sm lg:text-base font-medium leading-relaxed max-w-sm">
                Thoughtfully crafted for your home, designed for a lifetime of beauty. 
                Every piece tells a story of local artisans and sustainable materials.
              </p>
            </div>

            <div className="flex flex-col gap-5 max-w-md">
              <div className="flex flex-wrap gap-5">
                <Link href="/shop" className="w-full">
                  <Button
                    fullWidth
                    size="xl"
                    rightIcon={<ArrowRight size={16} />}
                  >
                    View All Collections
                  </Button>
                </Link>
              </div>
              <div className="flex gap-5">
                <a href="tel:+9779808005210" className="w-full flex-1">
                  <div className="flex items-center justify-center gap-2 py-4 px-6 rounded-lg bg-espresso text-white shadow-sm active:translate-y-[1px] transition-all font-bold uppercase tracking-widest text-[10px] h-14 hover:bg-espresso/90">
                    <Phone size={18} className="text-white" />
                    <span>Call Us</span>
                  </div>
                </a>
                <a href="https://wa.me" target="_blank" className="w-full flex-1">
                  <div className="group flex items-center justify-between p-6 bg-white border border-divider transition-all duration-300 hover:shadow-xl hover:border-action">
                    <MessageCircle size={18} className="fill-emerald-600 stroke-[0.5]" />
                    <span>WhatsApp</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Social Connect Board */}
          <div className="bg-app p-10 md:p-14 rounded-[3rem] border border-divider relative shadow-sm">
            <Leaf className="absolute -top-4 -right-4 text-action rotate-12 opacity-30" size={40} />

            <h3 className="text-2xl font-serif italic text-center text-heading mb-8">
              Join our socials
            </h3>

            <div className="grid grid-cols-2 gap-6 justify-center items-center">
              {/* Facebook */}
              <a href="https://facebook.com/dolakhafurniture" target="_blank" className="flex flex-col items-center gap-3 group">
                <div className="w-12 h-12 bg-app border border-divider rounded-none flex items-center justify-center text-heading group-hover:bg-action group-hover:text-white transition-all duration-500 shadow-md transform group-hover:rotate-12">
                  <Facebook strokeWidth={1.5} size={28} />
                </div>
                <span className="text-[10px] uppercase font-bold text-description tracking-widest">Facebook</span>
              </a>

              {/* Instagram */}
              <a href="https://instagram.com/dolakhafurnituredesign" target="_blank" className="flex flex-col items-center gap-3 group">
                <div className="h-16 w-16 rounded-full bg-white border border-[#bc1888]/20 flex items-center justify-center shadow-sm active:translate-y-[1px] transition-all duration-300">
                  <Instagram strokeWidth={1.5} size={28} className="text-[#bc1888]" />
                </div>
                <span className="text-[10px] uppercase font-bold text-label tracking-widest">Instagram</span>
              </a>

              {/* TikTok */}
              <a href="https://tiktok.com/@dolakhafurniture" target="_blank" className="flex flex-col items-center gap-3 group">
                <div className="h-16 w-16 rounded-full bg-white border border-black/10 flex items-center justify-center shadow-sm active:translate-y-[1px] transition-all duration-300">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#010101]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.61-1.49-2.11-2.46-.01 2.13.01 4.26-.01 6.38-.04 2.11-.46 4.38-1.92 6.01-1.62 1.83-4.22 2.58-6.6 2.18-2.6-.44-4.83-2.61-5.32-5.22-.54-2.84.58-6.04 2.94-7.69 1.52-1.07 3.51-1.46 5.33-1.05v4.1c-.88-.25-1.87-.21-2.69.24-1.2.66-1.85 2.11-1.6 3.47.2 1.14 1.13 2.14 2.27 2.32 1.34.2 2.82-.36 3.5-1.55.33-.58.46-1.25.45-1.92V.02z" />
                  </svg>
                </div>
                <span className="text-[10px] uppercase font-bold text-label tracking-widest">TikTok</span>
              </a>

              {/* Email */}
              <a href="mailto:dolakhafurniture@gmail.com" className="flex flex-col items-center gap-3 group">
                <div className="h-16 w-16 rounded-full bg-white border border-action/20 flex items-center justify-center shadow-sm active:translate-y-[1px] transition-all duration-300">
                  <Mail strokeWidth={1.5} size={28} className="text-action" />
                </div>
                <span className="text-[10px] uppercase font-bold text-label tracking-widest">Email</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
