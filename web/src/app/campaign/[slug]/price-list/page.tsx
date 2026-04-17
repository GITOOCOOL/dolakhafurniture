import { client } from "@/lib/sanity";
import { campaignBySlugQuery } from "@/lib/queries";
import { Campaign } from "@/types";
import DownloadButton from "@/components/DownloadButton";
import { Leaf, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import PriceListTable from "@/components/PriceListTable";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function CampaignPriceListPage({ params }: Props) {
  const { slug } = await params;
  const campaign: Campaign = await client.fetch(campaignBySlugQuery, { slug });

  if (!campaign) notFound();

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <main className="min-h-screen bg-[#fdfaf5] pb-24 font-sans text-[#3d2b1f] pt-32">
      
      {/* HEADER SECTION */}
      <div className="container mx-auto px-6 md:px-12 mb-16">
        <div className="flex justify-between items-start mb-12 no-print">
          <Link 
            href={`/campaign/${slug}`} 
            className="flex items-center gap-3 bg-white border border-[#e5dfd3] text-[#3d2b1f] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Story
          </Link>
          <DownloadButton label="Download Campaign Price List" variant="outline" />
        </div>

        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <Sparkles size={40} className="text-[#a3573a]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic font-medium leading-tight">
            {campaign.title}<span className="text-[#a3573a]">.</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#a89f91] py-4 border-y border-[#e5dfd3]/50">
            Campaign Price List — {currentDate}
          </p>
        </div>
      </div>

      {/* PRICE LIST TABLES */}
      <div className="container mx-auto px-6 md:px-12">
        {campaign.products && campaign.products.length > 0 ? (
          <PriceListTable products={campaign.products} />
        ) : (
          <div className="text-center py-24 border-t border-[#e5dfd3] border-dotted">
            <p className="text-[#a89f91] italic font-serif text-2xl">
              "No products are currently linked to this campaign."
            </p>
          </div>
        )}
      </div>

      {/* FOOTER ACCENT */}
      <section className="container mx-auto px-6 md:px-12 mt-32 pt-16 border-t border-[#e5dfd3] border-dotted text-center space-y-6">
        <p className="text-[#a89f91] font-serif italic text-lg max-w-lg mx-auto leading-relaxed">
          "{campaign.tagline || `A curated selection of handcrafted pieces designed for the modern sanctuary.`}"
        </p>
        <div className="flex justify-center items-center gap-8 pt-8">
           <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a89f91]">EST. 2024</div>
           <div className="w-1.5 h-1.5 rounded-full bg-[#a3573a]" />
           <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a89f91]">Dolakha Archive</div>
        </div>
      </section>

    </main>
  );
}
