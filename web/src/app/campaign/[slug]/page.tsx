import { client, urlFor } from "@/lib/sanity";
import { campaignBySlugQuery } from "@/lib/queries";
import { Campaign } from "@/types";
import ProductCard from "@/components/ProductCard";
import { Leaf, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import DownloadButton from "@/components/DownloadButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function CampaignLandingPage({ params }: Props) {
  const { slug } = await params;
  const campaign: Campaign = await client.fetch(campaignBySlugQuery, { slug });

  if (!campaign) notFound();

  const themeColor = campaign.themeColor || "#a3573a";

  return (
    <main className="min-h-screen bg-[#fdfaf5] pb-24 font-sans text-[#3d2b1f]">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[35vh] md:h-[45vh] overflow-hidden flex flex-col justify-end">
        {campaign.banner && (
          <Image
            src={urlFor(campaign.banner).width(2000).url()}
            alt={campaign.title}
            fill
            className="object-cover"
            priority
          />
        )}
        
        <div className="absolute top-0 right-0 p-4 md:p-6 z-20 flex flex-col items-end gap-3 no-print">
          <Link 
            href="/campaigns" 
            className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-[10px] uppercase tracking-widest hover:bg-black/60 transition-all shadow-lg"
          >
            <ArrowLeft size={12} />
            Back
          </Link>
          <div className="flex flex-col gap-2">
            <DownloadButton label="Catalog" />
            <Link
              href={`/campaign/${slug}/price-list`}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Price List
            </Link>
          </div>
        </div>

        <div className="absolute top-0 left-0 p-8 z-20 flex items-center gap-3 no-print">
          <div className="text-white opacity-40">
            <Leaf size={20} />
          </div>
        </div>

        {/* Overlay Gradient */}
        <div 
          className="absolute inset-0 z-10" 
          style={{ background: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)` }} 
        />

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-6 md:px-12 pb-8 md:pb-12 space-y-4">
          <div className="flex items-center gap-2 text-white/50">
            <Sparkles size={14} />
            <p className="text-[8px] uppercase tracking-[0.4em] font-bold">Collection</p>
          </div>
          <h1 className="text-4xl md:text-7xl font-serif italic text-white leading-tight">
            {campaign.title}
          </h1>
        </div>
      </section>

      {/* EDITORIAL BLOCK (Shrunk) */}
      <section className="container mx-auto px-6 md:px-12 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center border-b border-[#e5dfd3]/30">
        <div className="space-y-4">
          <div 
            className="w-12 h-[1px]" 
            style={{ backgroundColor: themeColor }}
          />
          <h2 className="text-2xl md:text-3xl font-serif italic text-balance leading-tight">
            {campaign.tagline || `A curated selection of handcrafted pieces.`}
          </h2>
        </div>
        <div className="text-[#a89f91] text-xs font-light leading-relaxed max-w-md italic border-l border-[#e5dfd3] pl-6">
          Explore the intersection of traditional craftsmanship and modern living.
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="container mx-auto px-6 md:px-12">
        <div className="flex items-center gap-4 mb-16 no-print">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a3573a]">The Collection</p>
          <div className="flex-1 h-[1px] bg-[#e5dfd3] opacity-50" />
        </div>

        {campaign.products && campaign.products.length > 0 ? (
          <>
            {/* 1. WEB VIEW: Continuous Responsive Grid (Hidden on Print) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 print:hidden">
              {campaign.products.filter(p => p !== null && p !== undefined).map((product, idx) => (
                <ProductCard 
                  key={`${product._id}-${idx}`} 
                  product={product} 
                  variant="ribbon" 
                  accentColor={themeColor} 
                />
              ))}
            </div>

            {/* 2. PRINT VIEW: Paginated 2x2 Grid (Hidden on Web) */}
            <div className="hidden print:block space-y-0">
              {(() => {
                const validProducts = campaign.products.filter(p => p !== null && p !== undefined);
                const chunks = [];
                for (let i = 0; i < validProducts.length; i += 4) {
                  chunks.push(validProducts.slice(i, i + 4));
                }
                
                return chunks.map((chunk, chunkIdx) => (
                  <div key={chunkIdx} className="page-break-after-always pt-8">
                    <div className="flex items-center gap-4 mb-8">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-[#a3573a] whitespace-nowrap">
                        {campaign.title} / Part {chunkIdx + 1}
                      </p>
                      <div className="flex-1 h-[0.5px] bg-[#e5dfd3] opacity-20" />
                    </div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-20">
                      {chunk.map((product, pIdx) => (
                        <ProductCard 
                          key={`${product._id}-${pIdx}`} 
                          product={product} 
                          variant="ribbon" 
                          accentColor={themeColor} 
                        />
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </>
        ) : (
          <div className="text-center py-24 border-t border-[#e5dfd3] border-dotted">
            <p className="text-[#a89f91] italic font-serif text-2xl">
              "Treasure from this story will be available soon."
            </p>
          </div>
        )}
      </section>

      {/* FOOTER ACCENT */}
      <section className="mt-32 pt-24 border-t border-[#e5dfd3] border-dotted text-center space-y-8">
        <Leaf size={32} className="mx-auto text-[#a3573a] opacity-30" />
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#a89f91]">Crafted in Nepal</p>
      </section>

    </main>
  );
}
