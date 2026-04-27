import { client } from "@/lib/sanity";
import { activeCampaignsQuery, businessMetaDataQuery } from "@/lib/queries";
import { Campaign, BusinessMetaData } from "@/types";
import CampaignCard from "@/components/CampaignCard";
import { Leaf, Sparkles } from "lucide-react";
import Link from "next/link";

import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  let businessMetaData: BusinessMetaData | null = null;
  try {
    businessMetaData = await client.fetch<BusinessMetaData>(businessMetaDataQuery);
  } catch (error) {
    console.error("Metadata fetch failed:", error);
  }

  const name = businessMetaData?.businessName || "undefined_setmetadata_in_studio";

  return {
    title: `Campaigns & Editorials | ${name}`,
    description: `Explore exclusive collections and limited-time offers from ${name}.`,
  };
}

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const [campaigns, businessMetaData]: [Campaign[], BusinessMetaData | null] = await Promise.all([
    client.fetch(activeCampaignsQuery),
    client.fetch(businessMetaDataQuery),
  ]);

  return (
    <main className="min-h-screen bg-app pt-40 pb-20 px-6 md:px-12 relative">
      <div className="container mx-auto max-w-7xl">
        {/* TOP LEFT: Back to home */}
        <div className="absolute top-16 left-6 md:left-12">
          <Link 
            href="/" 
            className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-heading hover:text-action transition-all flex items-center gap-2"
          >
            <span className="text-sm">←</span> Back to home
          </Link>
        </div>
        {/* HEADER SECTION - Compact Standard Design */}
        <header className="mb-12 text-left max-w-6xl border-b border-soft pb-6">
          <p className="type-label text-action mb-4">
             Brand Library & Editiorials
          </p>
          <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-heading leading-tight">
            Campaigns / अभियान<span className="text-action">.</span>
          </h1>
        </header>

        {/* CAMPAIGN LIST */}
        <div className="space-y-12 md:space-y-20">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <CampaignCard 
                key={campaign._id} 
                campaign={campaign} 
                businessMetaData={businessMetaData}
              />
            ))
          ) : (
            <div className="py-32 text-center space-y-4">
              <Leaf className="mx-auto text-label" size={48} />
              <p className="text-label font-serif italic text-2xl">
                Our artisans are crafting new campaigns. <br /> Check back soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
