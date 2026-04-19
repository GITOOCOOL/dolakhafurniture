import { client } from "@/lib/sanity";
import { activeCampaignsQuery } from "@/lib/queries";
import { Campaign } from "@/types";
import CampaignCard from "@/components/CampaignCard";
import { Leaf, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const campaigns: Campaign[] = await client.fetch(activeCampaignsQuery);

  return (
    <main className="min-h-screen bg-[#fdfaf5] pt-24 pb-20 px-6 md:px-12">
      <div className="container mx-auto max-w-7xl">
        {/* HEADER: Compressed for better focus on content */}
        <header className="mb-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 text-[#a3573a] opacity-30">
            <Sparkles size={16} />
            <Leaf size={20} />
            <Sparkles size={16} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif italic text-[#3d2b1f] leading-tight">
            Our <span className="text-[#a3573a] font-light"></span> Campaigns
          </h1>
          <p className="text-[#a89f91] max-w-xl mx-auto text-sm md:text-md font-light italic leading-relaxed pt-2">
            Explore our collections, limited-time offers, and special projects
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
                Our artisans are crafting new campaigns. <br /> Check back soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
