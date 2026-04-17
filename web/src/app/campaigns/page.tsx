import { client } from "@/lib/sanity";
import { activeCampaignsQuery } from "@/lib/queries";
import { Campaign } from "@/types";
import CampaignCard from "@/components/CampaignCard";
import { Leaf, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const campaigns: Campaign[] = await client.fetch(activeCampaignsQuery);

  return (
    <main className="min-h-screen bg-[#fdfaf5] pt-32 pb-24 px-6 md:px-12">
      <div className="container mx-auto max-w-7xl">
        
        {/* HEADER */}
        <header className="mb-20 text-center space-y-6">
          <div className="flex items-center justify-center gap-4 text-[#a3573a] opacity-40">
            <Sparkles size={20} />
            <Leaf size={24} />
            <Sparkles size={20} />
          </div>
          <h1 className="text-6xl md:text-8xl font-serif italic text-[#3d2b1f] leading-tight">
            Our Stories <br /> 
            <span className="text-[#a3573a] pl-12 md:pl-24">&amp; Campaigns</span>
          </h1>
          <p className="text-[#a89f91] max-w-2xl mx-auto text-xl font-light italic leading-relaxed border-t border-[#e5dfd3] pt-8 mt-8">
            Explore our curated collections, seasonal stories, and special projects 
            handcrafted for the soulful home.
          </p>
        </header>

        {/* CAMPAIGN LIST */}
        <div className="space-y-12 md:space-y-20">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))
          ) : (
            <div className="py-32 text-center space-y-4">
              <Leaf className="mx-auto text-[#e5dfd3]" size={48} />
              <p className="text-[#a89f91] font-serif italic text-2xl">
                Our artisans are crafting new stories. <br /> Check back soon.
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
