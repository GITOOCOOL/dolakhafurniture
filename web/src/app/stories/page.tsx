import { client } from "@/lib/sanity";
import { socialMediaQuery } from "@/lib/queries";
import SocialStories from "@/components/SocialStories";
import ReelsSection from "@/components/ReelsSection";
import { SocialContent } from "@/types";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Stories | Dolakha Furniture',
  description: 'Behind the scenes at Dolakha Furniture - Factory reels, latest designs, and heritage blogs.',
};

export default async function StoriesPage() {
  let socialContent: SocialContent[] = [];

  try {
    socialContent = await client.fetch<SocialContent[]>(socialMediaQuery, {}, { next: { revalidate: 60 } });
  } catch (error) {
    console.error("Failed to fetch stories:", error);
  }

  const stories = socialContent.filter(item => item.type === 'story');
  const reels = socialContent.filter(item => item.type === 'reel');
  const blogs = socialContent.filter(item => item.type === 'blog');

  return (
    <div className="w-full bg-app min-h-screen">
      {/* 1. Header Section */}
      <section className="pt-24 pb-12 px-6 border-b border-soft bg-app">
        <div className="container mx-auto text-center md:text-left">
          <p className="type-label text-label mb-2 uppercase tracking-widest">Brand Hub</p>
          <h1 className="text-4xl md:text-6xl font-serif italic tracking-tight text-heading">
            Stories, Reels & Blogs
          </h1>
          <p className="mt-4 text-body max-w-2xl mx-auto md:mx-0">
            Witness the craft. A unified feed of our latest factory updates, 
            cinematic reels, and heritage articles.
          </p>
        </div>
      </section>

      {/* 2. THE STORIES (CIRCLE FEED) */}
      <section className="py-12 border-b border-soft overflow-hidden">
        <div className="container mx-auto">
          <div className="px-6 mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-serif text-heading italic">Active Stories</h2>
              <p className="text-sm text-label">Snapshots of our daily craft</p>
            </div>
            <div className="hidden md:block h-[1px] flex-grow mx-8 bg-soft/50 mb-3" />
          </div>
          <div className="px-6">
            <SocialStories stories={stories} />
          </div>
        </div>
      </section>

      {/* 3. THE REELS (CAROUSEL) */}
      <section className="py-20 bg-app">
        <div className="container mx-auto">
          <div className="px-6 mb-12 text-center md:text-left">
            <p className="type-label text-label mb-2 uppercase">Vision</p>
            <h2 className="text-4xl font-serif text-heading italic">Factory Reels</h2>
          </div>
          <ReelsSection reels={reels} />
        </div>
      </section>

      {/* 4. THE BLOGS (ARTICLE GRID) */}
      {blogs.length > 0 && (
        <section className="py-24 border-t border-soft bg-app-alt/30">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <p className="type-label text-label mb-2 uppercase tracking-widest">Heritage</p>
              <h2 className="text-4xl md:text-5xl font-serif text-heading italic">From the Blog</h2>
              <div className="h-[1px] w-24 bg-action/30 mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {blogs.map((post) => (
                <Link key={post._id} href={`/stories/${post._id}`} className="group cursor-pointer block">
                  <div className="relative aspect-[16/10] overflow-hidden mb-6 rounded-sm bg-soft/30">
                    {post.thumbnailUrl ? (
                      <Image 
                        src={post.thumbnailUrl} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-label italic">
                        Dolakha Furniture Heritage
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge text="ARTICLE" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif text-heading italic mb-3 group-hover:text-action transition-colors">
                    {post.title}
                  </h3>
                  {post.tagline ? (
                     <p className="text-description line-clamp-2 mb-4 text-sm leading-relaxed italic border-l border-action/20 pl-4">
                        {post.tagline}
                     </p>
                  ) : (
                    <p className="text-description line-clamp-2 mb-4 text-sm leading-relaxed">
                        {post.caption}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-label text-[11px] font-bold tracking-widest uppercase">
                    Read Story <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CALL TO ACTION */}
      <section className="py-24 border-t border-soft border-dotted text-center bg-app">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-serif italic text-heading mb-6 tracking-tight">Stay connected to the source.</h3>
          <p className="text-body mb-10 max-w-md mx-auto italic">
            Follow our journey across platforms for daily craft updates and exclusive previews.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://www.instagram.com/dolakhafurnituredesign/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-heading text-white hover:bg-black transition-all duration-300 rounded-sm font-medium tracking-wide shadow-custom"
            >
              INSTAGRAM
            </a>
            <a 
              href="https://www.facebook.com/dolakhafurniture/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 border border-heading text-heading hover:bg-heading hover:text-white transition-all duration-300 rounded-sm font-medium tracking-wide"
            >
              FACEBOOK
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Utility components built local for this page
function Badge({ text }: { text: string }) {
  return (
    <div className="px-3 py-1 bg-white/90 backdrop-blur-sm text-heading text-[10px] font-bold tracking-widest rounded-full shadow-sm">
      {text}
    </div>
  )
}
