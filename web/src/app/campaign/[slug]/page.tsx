import { client, urlFor } from "@/lib/sanity";
import { campaignBySlugQuery } from "@/lib/queries";
import { Campaign } from "@/types";
import ProductCard from "@/components/ProductCard";
import { Leaf, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import PDFDownloadButton from "@/components/PDFDownloadButton";
import PriceListTable from "@/components/PriceListTable";

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
      {/* HERO SECTION: Tighter and cleaner */}
      <section className="relative w-full h-[25vh] md:h-[30vh] overflow-hidden flex flex-col justify-end">
        {campaign.banner && (
          <Image
            src={urlFor(campaign.banner).width(2000).url()}
            alt={campaign.title}
            fill
            className="object-cover"
            priority
          />
        )}
        
        {/* Simplified Back Button & Download Tools */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-8 z-20 flex justify-between items-start no-print">
          <Link 
            href="/campaigns" 
            className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-[10px] uppercase tracking-widest hover:bg-black/60 transition-all shadow-lg"
          >
            <ArrowLeft size={12} />
            Back to Campaigns
          </Link>

          <div className="flex gap-3">
            <PDFDownloadButton campaign={campaign} label="Catalog / Price List" variant="glass" className="!px-8 !py-3 !text-[11px]" />
          </div>
        </div>

        {/* Overlay Gradient */}
        <div 
          className="absolute inset-0 z-10" 
          style={{ background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)` }} 
        />

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-6 md:px-12 pb-8 md:pb-12 space-y-3">
          <div className="flex items-center gap-2 text-white/60">
            <Sparkles size={12} />
            <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] font-bold">Active Campaign</p>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-white leading-tight">
            {campaign.title}
          </h1>

          {/* Scroll Indicator */}
          <div className="pt-4 flex items-center gap-3 animate-pulse opacity-50">
            <div className="w-[1px] h-4 bg-white" />
            <p className="text-[7px] uppercase tracking-[0.3em] text-white">Scroll to browse collection</p>
          </div>
        </div>
      </section>

      {/* CAMPAIGN METADATA STRIP: Vouchers & Deadline */}
      {(campaign.endDate || (campaign.vouchers && campaign.vouchers.length > 0)) && (
        <div className="bg-[#a3573a] text-white py-4 no-print border-b border-white/10 shadow-sm relative z-30">
          <div className="container mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Leaf size={18} className="text-white/40" />
              {campaign.endDate && (
                <div className="flex flex-col">
                  <p className="text-[8px] uppercase tracking-[0.2em] opacity-60 font-bold">Campaign Deadline</p>
                  <p className="text-[11px] md:text-sm font-sans font-bold uppercase tracking-widest">
                    Ends on {new Date(campaign.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
            
            {campaign.vouchers && campaign.vouchers.length > 0 && (
              <div className="flex flex-wrap items-center gap-6">
                {campaign.vouchers.map(v => (
                  <div key={v.code} className="flex flex-col gap-1 items-start md:items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] uppercase tracking-widest opacity-60">Coupon:</span>
                      <span className="px-3 py-1 bg-white text-[#a3573a] text-[10px] font-bold rounded-sm tracking-widest shadow-sm">
                        {v.code}
                      </span>
                    </div>
                    {v.details && (
                      <p className="text-[9px] font-sans font-medium text-white/80 italic tracking-wide max-w-[200px] text-left md:text-right">
                        {v.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CAMPAIGN INTRODUCTION (REPLACES OLD EDITORIAL) */}
      <section className="container mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="max-w-3xl space-y-8">
          <div 
            className="w-16 h-[1px]" 
            style={{ backgroundColor: themeColor }}
          />
          <h2 className="text-2xl md:text-4xl font-serif italic text-[#3d2b1f] leading-snug text-balance">
            {campaign.tagline || `A curated selection of handcrafted pieces.`}
          </h2>
          {campaign.description && (
            <p className="text-[#a89f91] text-sm md:text-lg font-light leading-relaxed italic border-l-2 border-[#e5dfd3] pl-8 max-w-2xl">
              {campaign.description}
            </p>
          )}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="container mx-auto px-6 md:px-12">
        <div className="flex items-center gap-4 mb-16 no-print">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a3573a]">The Collection</p>
          <div className="flex-1 h-[1px] bg-[#e5dfd3] opacity-50" />
        </div>

        {campaign.products && campaign.products.length > 0 ? (
          <PriceListTable products={campaign.products} />
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
