"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { Campaign } from "@/types";
import { ArrowRight, Sparkles, MessageCircle, Facebook } from "lucide-react";

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const themeColor = campaign.themeColor || "accent";

  return (
    <div 
      className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-divider transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col md:flex-row min-h-[320px]"
    >
      {/* Visual Side */}
      <div className="md:w-1/2 relative overflow-hidden bg-app">
        {campaign.banner ? (
          <Image
            src={urlFor(campaign.banner).width(800).url()}
            alt={campaign.title}
            fill
            className="object-cover transition-transform duration-[2s] group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-10">
            <Sparkles size={80} className="text-action" />
          </div>
        )}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{ background: `linear-gradient(135deg, ${themeColor} 0%, transparent 100%)` }} 
        />
      </div>

      {/* Content Side */}
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-6">
        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-[2px] rounded-full" 
              style={{ backgroundColor: themeColor }}
            />
            <p className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: themeColor }}>
              Active Campaign
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif italic text-heading leading-tight">
            {campaign.title}
          </h2>
          
          {/* Metadata: Ends on & Vouchers */}
          {(campaign.endDate || (campaign.vouchers && campaign.vouchers.length > 0)) && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {campaign.endDate && (
                <div className="text-[9px] font-sans font-extrabold uppercase tracking-widest text-action flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-action animate-pulse" />
                  Ends: {new Date(campaign.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
              {campaign.vouchers && campaign.vouchers.map(v => (
                <span 
                  key={v.code}
                  className="px-2 py-0.5 bg-action text-[8px] font-bold text-white rounded-sm uppercase tracking-widest shadow-sm"
                >
                  {v.code}
                </span>
              ))}
            </div>
          )}
        </header>

        {campaign.tagline && (
          <p className="text-description text-md font-medium leading-relaxed italic border-l-2 border-divider pl-6 py-1">
            "{campaign.tagline}"
          </p>
        )}

        <div className="pt-4 flex items-center justify-between gap-4">
          <Link
            href={`/campaign/${campaign.slug}`}
            className="inline-flex items-center gap-4 type-action text-heading hover:text-action transition-all group/link"
          >
            Check it out
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center border border-divider group-hover/link:border-action group-hover/link:bg-action group-hover/link:text-white transition-all duration-300"
            >
              <ArrowRight size={16} />
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <a 
              href={`https://wa.me/61410765748?text=${encodeURIComponent(`Hi! I'm interested in the ${campaign.title} collection.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25D366]/5 border border-[#25D366]/20 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all duration-300"
              title="WhatsApp Inquiry"
            >
              <MessageCircle size={18} />
            </a>
            <a 
              href="https://m.me/224061751418570"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0084FF]/5 border border-[#0084FF]/20 text-[#0084FF] hover:bg-[#0084FF] hover:text-white transition-all duration-300"
              title="Messenger Inquiry"
            >
              <Facebook size={18} />
            </a>
          </div>
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
