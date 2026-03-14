import React from 'react';
import Link from 'next/link';

export default function OurStory() {
  return (
    /* Changed to your Boho Cream background and Espresso text */
    <div className="bg-[#fdfaf5] min-h-screen pt-32 pb-20 font-sans text-[#3d2b1f]">
      <div className="container mx-auto px-6">
        
        {/* HEADER SECTION - Softer, more poetic "Journal" style */}
        <header className="mb-24 text-center max-w-4xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a3573a] mb-6">
            Our Heritage & Vision
          </p>
          <h1 className="text-6xl md:text-8xl font-serif italic font-medium text-[#3d2b1f] leading-tight mb-12">
            The Story of Dolakha<span className="text-[#a3573a]">.</span>
          </h1>
          <div className="h-[1px] w-24 bg-[#a3573a] mx-auto opacity-50"></div>
        </header>

        {/* MAIN NARRATIVE GRID - More organic spacing and imagery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <div className="space-y-10 order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-serif italic font-medium text-[#3d2b1f] leading-snug">
              Born in Kathmandu, <br />
              Inspired by Tradition.
            </h2>
            <div className="space-y-6">
                <p className="text-lg text-[#a89f91] leading-relaxed font-light">
                Established as a leading furniture designer and supplier in the heart of Kathmandu, 
                Dolakha Furniture was founded with a singular purpose: to bring the strength and 
                beauty of artisanal craftsmanship into every Nepali home. 
                </p>
                <p className="text-[#a3573a] italic font-serif text-2xl leading-relaxed">
                "Quality product with beauty is in our mind."
                </p>
            </div>
          </div>
          
          {/* Image Container: More rounded/organic with a warm sepia tone */}
          <div className="order-1 lg:order-2 aspect-[4/5] bg-[#e5dfd3] rounded-[4rem] overflow-hidden shadow-sm relative group">
            <img 
              src="/hero.jpg" 
              alt="Dolakha Craftsmanship" 
              className="object-cover w-full h-full opacity-90 sepia-[0.3] hover:sepia-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-[#a3573a]/5 mix-blend-multiply"></div>
          </div>
        </div>

        {/* CORE VALUES - Muted colors and elegant numbering */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-y border-[#e5dfd3] border-dotted py-24 mb-40">
          <div className="space-y-4">
            <span className="text-[#a3573a] font-serif italic text-4xl">01.</span>
            <h3 className="text-lg font-serif italic font-semibold text-[#3d2b1f]">Smart Design</h3>
            <p className="text-sm text-[#a89f91] leading-relaxed font-light">
              From our famous metallic swings to versatile plant stands, we blend iron and wood 
              using smart ideas to maximize your home's potential.
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-[#a3573a] font-serif italic text-4xl">02.</span>
            <h3 className="text-lg font-serif italic font-semibold text-[#3d2b1f]">Enduring Quality</h3>
            <p className="text-sm text-[#a89f91] leading-relaxed font-light">
              Every product—whether a bed, daraz, or console table—is built to be as strong 
              as it is good-looking, ensuring it lasts for generations.
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-[#a3573a] font-serif italic text-4xl">03.</span>
            <h3 className="text-lg font-serif italic font-semibold text-[#3d2b1f]">Personal Touch</h3>
            <p className="text-sm text-[#a89f91] leading-relaxed font-light">
              Based in Samakhusi, we pride ourselves on direct connection—delivering 
              personally to your doorstep across Kathmandu.
            </p>
          </div>
        </div>

        {/* CALL TO ACTION - Moved from Black to Deep Olive/Forest for Boho warmth */}
        <section className="bg-[#1a1c13] text-[#fdfaf5] rounded-[5rem] p-12 md:p-24 text-center">
          <h2 className="text-4xl md:text-6xl font-serif italic font-medium mb-10 leading-snug">
            Visit Our Samakhusi <br /> Showroom<span className="text-[#df9152]">.</span>
          </h2>
          <p className="text-[#e2e8da] mb-12 max-w-xl mx-auto text-xl italic font-serif leading-relaxed">
            "Experience the texture and strength of our pieces in person. We are ready 
            to deliver beauty to your home."
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link 
              href="/shop" 
              className="bg-[#fdfaf5] text-[#1a1c13] px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-[#a3573a] hover:text-white transition-all"
            >
              Explore Archive
            </Link>
            <a 
              href="https://www.facebook.com/dolakhafurniture/" 
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#fdfaf5]/20 text-[#fdfaf5] px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:border-[#a3573a] hover:text-[#a3573a] transition-all"
            >
              Message Us
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
