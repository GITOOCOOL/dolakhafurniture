"use client";
import Link from 'next/link';
import { ArrowBigDownDash, ArrowRight, Phone, MessageCircle, Leaf, Facebook, Instagram, Mail, ArrowDown } from 'lucide-react';
import BulletinTicker from '@/components/BulletinTicker';
import { Bulletin as BulletinType } from '@/types/bulletin';
import { HeroImage as HeroImageType } from '@/types/heroImage';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
  }),
};

const Hero = ({ bulletins, heroImages }: { bulletins: BulletinType[], heroImages: HeroImageType[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);

  const activeIndex = page % heroImages.length;
  // Handle wrapping for negative indices
  const safeIndex = activeIndex < 0 ? activeIndex + heroImages.length : activeIndex;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleScroll = () => {
    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 4000);

    return () => clearInterval(timer);
  }, [heroImages.length, page]);

  return (
    <section className="relative w-full lg:min-h-[80vh] flex flex-col justify-center bg-[#fdfaf5] overflow-hidden">

      {/* 0. FULL-WIDTH BULLETIN TICKER WITH SPACING GAP */}
      <div className="mt-4 md:mt-6">
        <BulletinTicker bulletins={bulletins} />
      </div>



      <div className="container mx-auto px-6 xl:pl-40 pt-10 pb-0 lg:py-24 relative z-10">

        {/* 2. MAIN BRANDING */}
        <div className="max-w-6xl">
          {/* --- HERO IMAGE CAROUSEL --- */}
          <div
            className="relative w-full mt-0 mb-12 overflow-hidden rounded-[3rem] border border-[#e5dfd3] shadow-2xl group bg-stone-100 isolate"
            style={{
              height: '31vh', // Reduced by another 10% (from 35vh)
              maxHeight: '380px', // Reduced from 420px
              minHeight: '250px', // Reduced from 280px
              WebkitMaskImage: '-webkit-radial-gradient(white, black)'
            }}
          >
            {heroImages.length > 0 ? (
              <>
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={page}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "tween", ease: "linear", duration: 0.8 },
                      opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0 flex items-center justify-center z-10 w-full h-full overflow-hidden"
                  >
                    {/* Background Blur Layer */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <Image
                        src={urlFor(heroImages[safeIndex].mainImage).width(800).blur(50).url()}
                        alt=""
                        fill
                        className="object-cover opacity-40 scale-[1.01]"
                        priority
                      />
                    </div>

                    {/* Main Image Layer (Full Visibility) */}
                    <div className="relative w-full h-full p-4 md:p-8 flex items-center justify-center z-10">
                      <Image
                        src={urlFor(heroImages[safeIndex].mainImage).width(1200).url()}
                        alt={heroImages[safeIndex].title || "Hero Image"}
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* BROWSE BUTTON OVERLAY (Outside AnimatePresence - Strictly Static) */}
                <div className="absolute inset-0 flex items-end justify-center pb-12 z-30 pointer-events-none">
                  <button
                    onClick={handleScroll}
                    className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-bold uppercase text-[12px] tracking-[0.3em] hover:bg-white hover:text-[#3d2b1f] shadow-2xl flex items-center gap-4 group"
                  >
                    Browse all
                    <ArrowDown size={18} />
                  </button>
                </div>

                {/* SLIDE INDICATORS (DOTS) */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage([i, i > safeIndex ? 1 : -1])}
                      className={`h-1 transition-all duration-500 rounded-full ${i === safeIndex ? 'w-10 bg-[#a3573a]' : 'w-4 bg-white/40 hover:bg-white/60'
                        }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-stone-400 font-serif italic">
                Curation in progress...
              </div>
            )}
          </div>

          <h1 className="text-[12vw] lg:text-[10rem] font-serif italic font-medium leading-[0.85] mb-14 text-[#3d2b1f] tracking-tight">
            Dolakha<br />
            <span className="text-[#a3573a] decoration-[#e5dfd3] underline-offset-[1.5rem] underline decoration-dotted">Furniture.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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

              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap gap-5">
                  <Link href="/shop" className="w-full bg-[#3d2b1f] text-[#fdfaf5] px-6 py-6 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-[#a3573a] transition-all shadow-xl flex items-center gap-3">
                    Shop Now <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="flex gap-5">
                  <a
                    href="tel:+9779808005210"
                    className="w-full bg-white border border-[#e5dfd3] text-[#3d2b1f] px-6 py-4 rounded-full font-sans font-bold uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#fdfaf5] transition-all shadow-sm"
                  >
                    <Phone size={16} className="text-[#a3573a]" />
                    Call Us Anytime
                  </a>
                  <a href="https://wa.me" target="_blank" className="w-full bg-white border border-[#e5dfd3] text-[#3d2b1f] px-4 py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 hover:bg-[#fdfaf5] transition-all shadow-sm">
                    <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* 3. THE SOCIAL ROW (COMPACT) */}
            <div className="bg-white/40 p-6 md:p-8 rounded-[2.5rem] border border-[#e5dfd3] backdrop-blur-md relative">
              <Leaf className="absolute -top-3 -right-3 text-[#a3573a] rotate-12 opacity-30" size={24} />

              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#a89f91] mb-6 text-center">
                Connect to our Socials
              </p>

              <div className="flex flex-row gap-6 md:gap-10 justify-center items-center">
                {/* Facebook */}
                <a href="https://facebook.com/dolakhafurniture" target="_blank" className="group">
                  <div className="h-12 w-12 rounded-full bg-[#fdfaf5] border border-[#e5dfd3] flex items-center justify-center shadow-sm group-hover:bg-[#3b5998] group-hover:text-white transition-all duration-700">
                    <Facebook strokeWidth={1.2} size={20} />
                  </div>
                </a>

                {/* Instagram */}
                <a href="https://instagram.com/dolakhafurnituredesign" target="_blank" className="group">
                  <div className="h-12 w-12 rounded-full bg-[#fdfaf5] border border-[#e5dfd3] flex items-center justify-center shadow-sm group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:to-purple-600 group-hover:text-white transition-all duration-700">
                    <Instagram strokeWidth={1.2} size={20} />
                  </div>
                </a>

                {/* TikTok */}
                <a href="https://tiktok.com/@dolakhafurniture" target="_blank" className="group">
                  <div className="h-12 w-12 rounded-full bg-[#fdfaf5] border border-[#e5dfd3] flex items-center justify-center shadow-sm group-hover:bg-[#1a1c13] group-hover:text-white transition-all duration-700">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.61-1.49-2.11-2.46-.01 2.13.01 4.26-.01 6.38-.04 2.11-.46 4.38-1.92 6.01-1.62 1.83-4.22 2.58-6.6 2.18-2.6-.44-4.83-2.61-5.32-5.22-.54-2.84.58-6.04 2.94-7.69 1.52-1.07 3.51-1.46 5.33-1.05v4.1c-.88-.25-1.87-.21-2.69.24-1.2.66-1.85 2.11-1.6 3.47.2 1.14 1.13 2.14 2.27 2.32 1.34.2 2.82-.36 3.5-1.55.33-.58.46-1.25.45-1.92V.02z" />
                    </svg>
                  </div>
                </a>

                {/* Email */}
                <a href="mailto:dolakhafurniture@gmail.com" className="group">
                  <div className="h-12 w-12 rounded-full bg-[#fdfaf5] border border-[#e5dfd3] flex items-center justify-center shadow-sm group-hover:bg-[#a3573a] group-hover:text-white transition-all duration-700">
                    <Mail strokeWidth={1.2} size={20} />
                  </div>
                </a>
              </div>
            </div>


          </div>
        </div>

        {/* 4. TRUST SIGNALS (NATURAL TONES) */}
        {/* <div className="mt-24 flex flex-wrap gap-12 lg:gap-24 border-t border-[#e5dfd3] border-dotted pt-16">
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
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
