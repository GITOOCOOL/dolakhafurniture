import { client, urlFor } from "@/lib/sanity";
import { campaignBySlugQuery } from "@/lib/queries";
import { Campaign } from "@/types";
import ProductCard from "@/components/ProductCard";
import { Leaf, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import PDFDownloadButton from "@/components/PDFDownloadButton";
import PriceListTable from "@/components/PriceListTable";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign: Campaign = await client.fetch(campaignBySlugQuery, { slug });
  
  if (!campaign) return { title: "Campaign Not Found" };
  
  return {
    title: `${campaign.title} | Dolakha Furniture`,
    description: campaign.description || campaign.tagline || 'Exclusive Campaign from Dolakha Furniture.',
    openGraph: {
      title: `${campaign.title} | Dolakha Furniture`,
      description: campaign.description || campaign.tagline || 'Exclusive Campaign from Dolakha Furniture.',
      images: campaign.banner ? [urlFor(campaign.banner).width(1200).height(630).url()] : [],
    }
  };
}

export default async function CampaignLandingPage({ params }: Props) {
  const { slug } = await params;
  const campaign: Campaign = await client.fetch(campaignBySlugQuery, { slug });

  if (!campaign) notFound();

  const themeColor = campaign.themeColor || "#a3573a";

  return (
    <main className="min-h-screen bg-[#fdfaf5] pb-24 font-sans text-[#3d2b1f]">
      {/* TOP NAVIGATION STRIP: Unified and clean */}
      <div className="bg-[#fdfaf5] border-b border-[#e5dfd3] no-print">
        <div className="container mx-auto px-6 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link
            href="/campaigns"
            className="flex items-center gap-2 text-[#3d2b1f] hover:text-[#a3573a] transition-all text-[10px] uppercase tracking-widest font-bold group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Campaigns
          </Link>

          <PDFDownloadButton
            campaign={campaign}
            label="DOWNLOAD CATALOG / PRICE LIST"
            variant="outline"
            className="!px-8 !py-2.5 !text-[11px] !border-[#e5dfd3] !text-[#3d2b1f] hover:!bg-[#fdfaf5] hover:!border-[#a3573a]"
          />
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative w-full h-[30vh] md:h-[35vh] overflow-hidden flex flex-col justify-end">
        {campaign.banner && (
          <Image
            src={urlFor(campaign.banner).width(2000).url()}
            alt={campaign.title}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Overlay Gradient */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)`,
          }}
        />

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-6 md:px-12 pb-10 md:pb-14 space-y-4">
          <div className="flex items-center gap-2 text-white/70">
            <Sparkles size={14} />
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold">
              Active Campaign
            </p>
          </div>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif italic text-white leading-none">
            {campaign.title}
          </h1>
        </div>
      </section>

      {/* CAMPAIGN METADATA STRIP: Vouchers & Deadline */}
      {(campaign.endDate ||
        (campaign.vouchers && campaign.vouchers.length > 0)) && (
        <div className="bg-[#a3573a] text-white py-4 no-print border-b border-white/10 shadow-sm relative z-30">
          <div className="container mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Leaf size={18} className="text-white/40" />
              {campaign.endDate && (
                <div className="flex flex-col">
                  <p className="text-[8px] uppercase tracking-[0.2em] opacity-60 font-bold">
                    Campaign Deadline
                  </p>
                  <p className="text-[11px] md:text-sm font-sans font-bold uppercase tracking-widest">
                    Ends on{" "}
                    {new Date(campaign.endDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            {campaign.vouchers && campaign.vouchers.length > 0 && (
              <div className="flex flex-wrap items-center gap-6">
                {campaign.vouchers.map((v) => (
                  <div
                    key={v.code}
                    className="flex flex-col gap-1 items-start md:items-end"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] uppercase tracking-widest opacity-60">
                        Voucher:
                      </span>
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
            {campaign.tagline || `New arrivals for your home.`}
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
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a3573a]">
            The Collection
          </p>
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
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#a89f91]">
          Crafted in Nepal
        </p>
      </section>
    </main>
  );
}
