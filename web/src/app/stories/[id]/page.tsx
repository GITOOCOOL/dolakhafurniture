import { client } from "@/lib/sanity";
import { socialMediaQuery } from "@/lib/queries";
import { PortableTextContent } from "@/components/PortableTextContent";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the specific blog post by ID
  const query = `*[_type == "socialMedia" && _id == $id][0] {
    _id,
    title,
    tagline,
    body,
    "thumbnailUrl": thumbnail.asset->url,
    hashtags,
    _createdAt
  }`;

  const post = await client.fetch(query, { id });

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-app min-h-screen">
      {/* 1. PROGRESSIVE HEADER */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        {post.thumbnailUrl && (
          <Image 
            src={post.thumbnailUrl} 
            alt={post.title} 
            fill 
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-app via-app/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end pb-20 px-6">
          <div className="container mx-auto">
            <Link 
              href="/stories" 
              className="inline-flex items-center gap-2 text-action mb-8 font-bold tracking-widest text-[10px] uppercase group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Brand Hub
            </Link>
            
            <h1 className="text-5xl md:text-7xl font-serif italic text-heading tracking-tight mb-6 max-w-4xl">
              {post.title}
            </h1>
            
            {post.tagline && (
              <p className="text-2xl font-serif text-body/80 italic max-w-2xl border-l-2 border-action pl-6">
                {post.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. META DATA */}
      <div className="container mx-auto px-6 py-12 border-b border-soft">
        <div className="flex flex-wrap gap-8 items-center text-label text-xs font-bold tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> 
            {new Date(post._createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" /> 
            {post.hashtags?.slice(0, 3).join(', ') || 'Heritage'}
          </div>
        </div>
      </div>

      {/* 3. THE BODY (UNIVERSAL RENDERER) */}
      <article className="container mx-auto px-6 py-20 max-w-4xl">
        <PortableTextContent value={post.body} />
      </article>

      {/* 4. FOOTER CTA */}
      <section className="py-24 border-t border-soft bg-app-alt/20 text-center">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-serif italic text-heading mb-6 tracking-tight">Inspired by the craft?</h3>
          <p className="text-body mb-10 max-w-md mx-auto italic">
            Visit our showroom to see the heritage in person or explore our latest designs.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/stories" 
              className="px-12 py-5 bg-heading text-white hover:bg-black transition-all rounded-sm font-bold tracking-widest text-xs"
            >
              EXPLORE MORE STORIES
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
