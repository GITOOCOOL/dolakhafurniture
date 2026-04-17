"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { Campaign } from "@/types";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const themeColor = campaign.themeColor || "#a3573a";

  return (
    <div 
      className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-[#e5dfd3] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col md:flex-row min-h-[320px]"
    >
      {/* Visual Side */}
      <div className="md:w-1/2 relative overflow-hidden bg-[#fdfaf5]">
        {campaign.banner ? (
          <Image
            src={urlFor(campaign.banner).width(800).url()}
            alt={campaign.title}
            fill
            className="object-cover transition-transform duration-[2s] group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-10">
            <Sparkles size={80} className="text-[#a3573a]" />
          </div>
        )}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{ background: `linear-gradient(135deg, ${themeColor} 0%, transparent 100%)` }} 
        />
      </div>

      {/* Content Side */}
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-6">
        <header className="space-y-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-[2px] rounded-full" 
              style={{ backgroundColor: themeColor }}
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: themeColor }}>
              Active Campaign
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif italic text-[#3d2b1f] leading-tight">
            {campaign.title}
          </h2>
        </header>

        {campaign.tagline && (
          <p className="text-[#a89f91] text-lg font-light leading-relaxed italic border-l-2 border-[#e5dfd3] pl-6 py-1">
            "{campaign.tagline}"
          </p>
        )}

        <div className="pt-4">
          <Link
            href={`/campaign/${campaign.slug}`}
            className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#3d2b1f] hover:text-[#a3573a] transition-all group/link"
          >
            Check it out
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#e5dfd3] group-hover/link:border-[#a3573a] group-hover/link:bg-[#a3573a] group-hover/link:text-white transition-all duration-300"
            >
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </div>
      
      {/* Corner Accent */}
      <div 
        className="absolute bottom-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none -mr-12 -mb-12"
        style={{ color: themeColor }}
      >
        <Sparkles size={128} />
      </div>
    </div>
  );
}
