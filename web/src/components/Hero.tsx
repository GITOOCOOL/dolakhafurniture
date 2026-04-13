"use client";
import Link from 'next/link';
import { ArrowRight, Phone, MessageCircle, Leaf, Facebook, Instagram, Mail } from 'lucide-react';
import Button from './ui/Button';

// Removing the bulletins and heroImages props entirely, leaving it fully static and lightweight
const Hero = () => {
  return (
    <section className="relative w-full py-20 flex flex-col justify-center bg-white overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
          {/* Mission Statement & Actions */}
          <div className="space-y-12">
            <div className="space-y-6 border-l-2 border-[#a3573a] pl-8">
              <h2 className="text-[#3d2b1f] font-serif italic text-4xl lg:text-5xl leading-tight">
                Our Mission.
              </h2>
              <p className="text-[#3d2b1f] font-serif italic text-xl lg:text-3xl max-w-md leading-relaxed opacity-90">
                "Redefining Nepali spaces with our signature iron-wood fusion."
              </p>
              <p className="text-[#a89f91] text-sm lg:text-base font-light leading-relaxed max-w-sm">
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
                  <div className="flex items-center justify-center gap-2 py-4 px-6 rounded-lg bg-[#3d2b1f] text-white shadow-sm active:translate-y-[1px] transition-all font-bold uppercase tracking-widest text-[10px] h-14 hover:bg-[#4d3b2f]">
                    <Phone size={18} className="text-white" />
                    <span>Call Us</span>
                  </div>
                </a>
                <a href="https://wa.me" target="_blank" className="w-full flex-1">
                  <div className="flex items-center justify-center gap-2 py-4 px-6 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#128C7E] shadow-sm active:translate-y-[1px] transition-all font-bold uppercase tracking-widest text-[10px] h-14 hover:bg-[#25D366]/20">
                    <MessageCircle size={18} className="fill-[#128C7E] stroke-[0.5]" />
                    <span>WhatsApp</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Social Connect Board */}
          <div className="bg-[#fdfaf5] p-10 md:p-14 rounded-[3rem] border border-[#e5dfd3] relative shadow-sm">
            <Leaf className="absolute -top-4 -right-4 text-[#a3573a] rotate-12 opacity-30" size={40} />

            <h3 className="text-2xl font-serif italic text-center text-[#3d2b1f] mb-8">
              Join our socials
            </h3>

            <div className="grid grid-cols-2 gap-6 justify-center items-center">
              {/* Facebook */}
              <a href="https://facebook.com/dolakhafurniture" target="_blank" className="flex flex-col items-center gap-3 group">
                <div className="h-16 w-16 rounded-full bg-white border border-[#1877F2]/20 flex items-center justify-center shadow-sm active:translate-y-[1px] transition-all duration-300">
                  <Facebook strokeWidth={1.5} size={28} className="text-[#1877F2]" />
                </div>
                <span className="text-[10px] uppercase font-bold text-[#a89f91] tracking-widest">Facebook</span>
              </a>

              {/* Instagram */}
              <a href="https://instagram.com/dolakhafurnituredesign" target="_blank" className="flex flex-col items-center gap-3 group">
                <div className="h-16 w-16 rounded-full bg-white border border-[#bc1888]/20 flex items-center justify-center shadow-sm active:translate-y-[1px] transition-all duration-300">
                  <Instagram strokeWidth={1.5} size={28} className="text-[#bc1888]" />
                </div>
                <span className="text-[10px] uppercase font-bold text-[#a89f91] tracking-widest">Instagram</span>
              </a>

              {/* TikTok */}
              <a href="https://tiktok.com/@dolakhafurniture" target="_blank" className="flex flex-col items-center gap-3 group">
                <div className="h-16 w-16 rounded-full bg-white border border-black/10 flex items-center justify-center shadow-sm active:translate-y-[1px] transition-all duration-300">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#010101]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.61-1.49-2.11-2.46-.01 2.13.01 4.26-.01 6.38-.04 2.11-.46 4.38-1.92 6.01-1.62 1.83-4.22 2.58-6.6 2.18-2.6-.44-4.83-2.61-5.32-5.22-.54-2.84.58-6.04 2.94-7.69 1.52-1.07 3.51-1.46 5.33-1.05v4.1c-.88-.25-1.87-.21-2.69.24-1.2.66-1.85 2.11-1.6 3.47.2 1.14 1.13 2.14 2.27 2.32 1.34.2 2.82-.36 3.5-1.55.33-.58.46-1.25.45-1.92V.02z" />
                  </svg>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#a89f91] tracking-widest">TikTok</span>
              </a>

              {/* Email */}
              <a href="mailto:dolakhafurniture@gmail.com" className="flex flex-col items-center gap-3 group">
                <div className="h-16 w-16 rounded-full bg-white border border-[#a3573a]/20 flex items-center justify-center shadow-sm active:translate-y-[1px] transition-all duration-300">
                  <Mail strokeWidth={1.5} size={28} className="text-[#a3573a]" />
                </div>
                <span className="text-[10px] uppercase font-bold text-[#a89f91] tracking-widest">Email</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
