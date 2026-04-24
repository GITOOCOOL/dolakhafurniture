"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  MessageCircle,
  Leaf,
  Facebook,
  Instagram,
  Mail,
  Play,
} from "lucide-react";
import Button from "./ui/Button";
import Image from "next/image";

import { SocialContent } from "@/types";
import SocialStories from "./SocialStories";
import StoryViewer from "./StoryViewer";
import Carousel from "./Carousel";

const Hero = ({ 
  stories = [], 
  reels = [] 
}: { 
  stories?: SocialContent[], 
  reels?: SocialContent[] 
}) => {
  const [selectedReel, setSelectedReel] = useState<number | null>(null);
  const reelsSlice = reels.slice(0, 8);

  return (
    <section className="relative w-full py-24 flex flex-col justify-center bg-app overflow-hidden">
      <div className="absolute inset-0 bg-app transition-colors duration-1000" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Mission Statement & Actions */}
          <div className="space-y-12">
            <div className="space-y-6 border-l-2 border-action pl-10">
              <p className="type-label text-action mb-2">Our Mission</p>
              <h2 className="type-section text-heading pr-4">
                "Redefining Nepali spaces with our signature iron-wood fusion."
              </h2>
              <p className="type-body text-description max-w-sm">
                Thoughtfully crafted for your home, designed for a lifetime of
                beauty. Every piece tells a story of local artisans and
                sustainable materials.
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
                    View All Products
                  </Button>
                </Link>
              </div>
              <div className="flex gap-5">
                <a href="tel:+9779808005210" className="w-full flex-1">
                  <div className="flex items-center justify-center gap-3 py-4 px-8 rounded-lg bg-invert text-app shadow-sm active:translate-y-[1px] transition-all font-bold uppercase tracking-widest text-[10px] h-14 hover:bg-action">
                    <Phone size={18} />
                    <span>Call Us</span>
                  </div>
                </a>
                <a
                  href="https://wa.me/9779808005210"
                  target="_blank"
                  className="w-full flex-1"
                >
                  <div className="group flex items-center justify-center gap-3 py-4 px-8 rounded-lg bg-invert border border-divider transition-all duration-300 hover:shadow-xl hover:border-action h-14">
                    <MessageCircle size={18} className="text-app stroke-[2]" />
                    <span className="type-action text-app">WhatsApp</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* 1. Live Feed Component (Stories & Reels) */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {/* TRACK 1: Stories Circles */}
              {stories.length > 0 && (
                <div>
                  <div className="flex justify-between items-end mb-4 px-2">
                    <h3 className="text-xl font-serif italic text-heading">Factory Live</h3>
                    <Link href="/stories" className="text-[10px] font-sans font-bold uppercase tracking-widest text-label hover:text-action transition-colors border-b border-soft pb-1">
                      Archive
                    </Link>
                  </div>
                  <SocialStories stories={stories.slice(0, 8)} />
                </div>
              )}

              {/* TRACK 2: Reels Horizontal Track */}
              {reelsSlice.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-6 px-2">
                    <h3 className="text-xl font-serif italic text-heading">Studio Reels</h3>
                    <div className="h-[1px] flex-1 bg-soft/30" />
                  </div>
                  
                  <div className="-mx-6">
                    <Carousel>
                      {reelsSlice.map((reel, idx) => (
                        <div 
                          key={reel._id} 
                          onClick={() => setSelectedReel(idx)}
                          className="block relative aspect-[9/16] rounded-2xl overflow-hidden group shadow-md cursor-pointer border border-soft/20"
                        >
                          {reel.thumbnailUrl ? (
                            <Image 
                              src={reel.thumbnailUrl} 
                              alt={reel.title} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                          ) : (
                            <div className="absolute inset-0 bg-soft flex items-center justify-center">
                              <Play size={24} className="text-action opacity-50" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                            <p className="text-white text-[11px] font-medium leading-tight line-clamp-2">{reel.title}</p>
                          </div>
                        </div>
                      ))}
                    </Carousel>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Social Connect Board */}
            <div className="bg-surface px-6 py-10 md:p-14 rounded-[3rem] border border-divider relative shadow-sm">
              <Leaf
                className="absolute -top-4 -right-4 text-action rotate-12 opacity-30"
                size={40}
              />

              <h3 className="type-product text-center text-heading mb-12">
                Join our socials
              </h3>

              <div className="grid grid-cols-2 gap-6 md:gap-8 justify-center items-center">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/dolakhafurniture/"
                  target="_blank"
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-14 h-14 bg-invert border border-divider rounded-xl flex items-center justify-center text-app group-hover:bg-action transition-all duration-500 shadow-sm transform group-hover:rotate-12">
                    <Facebook strokeWidth={1.5} size={28} />
                  </div>
                  <span className="type-label text-description text-[8px]">
                    Facebook
                  </span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/dolakhafurnituredesign/"
                  target="_blank"
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="h-14 w-14 rounded-full bg-invert border border-divider flex items-center justify-center text-app group-hover:bg-action transition-all duration-500 shadow-sm active:translate-y-[1px]">
                    <Instagram strokeWidth={1.5} size={28} />
                  </div>
                  <span className="type-label text-description text-[8px]">
                    Instagram
                  </span>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@dolakhafurniture/"
                  target="_blank"
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="h-14 w-14 rounded-full bg-invert border border-divider flex items-center justify-center text-app group-hover:bg-action transition-all duration-500 shadow-sm active:translate-y-[1px]">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-7 h-7 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.49-2.11-2.46-.01 2.13.01 4.26-.01 6.38-.04 2.11-.46 4.38-1.92 6.01-1.62 1.83-4.22 2.58-6.6 2.18-2.6-.44-4.83-2.61-5.32-5.22-.54-2.84.58-6.04 2.94-7.69 1.52-1.07 3.51-1.46 5.33-1.05v4.1c-.88-.25-1.87-.21-2.69.24-1.2.66-1.85 2.11-1.6 3.47.2 1.14 1.13 2.14 2.27 2.32 1.34.2 2.82-.36 3.5-1.55.33-.58.46-1.25.45-1.92V.02z" />
                    </svg>
                  </div>
                  <span className="type-label text-description text-[8px]">
                    TikTok
                  </span>
                </a>

                {/* Email */}
                <a
                  href="mailto:dolakhafurniture@gmail.com"
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="h-14 w-14 rounded-full bg-invert border border-divider flex items-center justify-center text-app group-hover:bg-action transition-all duration-500 shadow-sm active:translate-y-[1px]">
                    <Mail strokeWidth={1.5} size={28} />
                  </div>
                  <span className="type-label text-description text-[8px]">
                    Email
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StoryViewer 
        isOpen={selectedReel !== null}
        onClose={() => setSelectedReel(null)}
        items={reelsSlice}
        activeIndex={selectedReel ?? 0}
        onNavigate={(idx) => setSelectedReel(idx)}
      />
    </section>
  );
};

export default Hero;
