import { client } from "@/lib/sanity";
import { socialMediaQuery } from "@/lib/queries";
import SocialStories from "@/components/SocialStories";
import ReelsSection from "@/components/ReelsSection";
import { SocialContent } from "@/types";

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Live Stories | Dolakha Furniture',
  description: 'Behind the scenes at Dolakha Furniture - Factory reels, latest designs, and live updates.',
};

export default async function StoriesPage() {
  const socialContent = (await client.fetch<SocialContent[]>(socialMediaQuery)) || [];
  const stories = socialContent.filter(item => item.type === 'story');
  const reels = socialContent.filter(item => item.type === 'reel');

  return (
    <div className="w-full bg-app min-h-screen">
      {/* 1. Header Section */}
      <section className="pt-24 pb-12 px-6 border-b border-soft bg-app">
        <div className="container mx-auto">
          <p className="type-label text-label mb-2">FACTORY LIVE</p>
          <h1 className="text-4xl md:text-5xl font-serif italic tracking-tight text-heading">
            Our Stories & Reels
          </h1>
          <p className="mt-4 text-body max-w-2xl">
            See the craft in motion. From our factory floor to your showroom, 
            witness the journey of every Dolakha Furniture piece.
          </p>
        </div>
      </section>

      {/* 2. RECENT STORIES */}
      <section className="py-12 border-b border-soft">
        <div className="container mx-auto">
          <div className="px-6 mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-serif text-heading italic">Active Stories</h2>
              <p className="text-sm text-label">Snapshots from the last 24 hours</p>
            </div>
            <div className="hidden md:block h-[1px] flex-grow mx-8 bg-soft/50 mb-3" />
          </div>
          <SocialStories stories={stories} />
        </div>
      </section>

      {/* 3. FACTORY REELS */}
      <section className="py-12 bg-app">
        <div className="container mx-auto">
          <div className="px-6 mb-12 text-center">
            <p className="type-label text-label mb-2">ARCHIVE</p>
            <h2 className="text-3xl font-serif text-heading italic">Factory Reels</h2>
          </div>
          <ReelsSection reels={reels} />
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-24 border-t border-soft border-dotted text-center">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-serif italic text-heading mb-6">Want to see more?</h3>
          <p className="text-body mb-8 max-w-md mx-auto">
            Follow us on Instagram for daily updates and exclusive behind-the-scenes content.
          </p>
          <a 
            href="https://www.instagram.com/dolakhafurniture/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-action text-white hover:bg-action-hover transition-all duration-300 rounded-sm font-medium tracking-wide shadow-custom"
          >
            FOLLOW ON INSTAGRAM
          </a>
        </div>
      </section>
    </div>
  );
}
