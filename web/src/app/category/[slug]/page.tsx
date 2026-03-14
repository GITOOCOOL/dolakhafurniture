import { client, urlFor } from "@/lib/sanity";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Leaf } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug });
  if (!category) return { title: "Collection Not Found" };
  return { title: `${category.title} | Dolakha ` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const data = await client.fetch(
    `{
      "category": *[_type == "category" && slug.current == $slug][0],
      "products": *[_type == "product" && category == $slug] | order(_createdAt desc)
    }`,
    { slug }
  );

  if (!data.category) notFound();

  return (
    <div className="bg-[#fdfaf5] min-h-screen pt-32 pb-20 font-sans text-[#3d2b1f]">
      <div className="container mx-auto px-6">
        
        {/* SECTION HEADER */}
        <header className="mb-20 max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <Leaf size={14} className="text-[#a3573a] opacity-60" />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#a3573a]">
              Collection Archive
            </p>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif italic font-medium text-[#3d2b1f] leading-none mb-10">
            {data.category.title}<span className="text-[#a3573a]">.</span>
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-[#a89f91] max-w-2xl leading-relaxed border-l-2 border-[#e5dfd3] pl-6">
            "{data.category.description || `Artisanal pieces designed to elevate your home with the essence of Dolakha.`}"
          </p>
        </header>

        {/* PRODUCT GRID */}
        {data.products.length === 0 ? (
          <div className="py-24 border-t border-[#e5dfd3] border-dotted text-center">
            <p className="text-[#a89f91] italic font-serif text-2xl">
              "New treasures for this collection are currently being handcrafted."
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 border-t border-[#e5dfd3] border-dotted pt-16">
            {data.products.map((product: any, index: number) => (
              <Link 
                href={`/product/${product.slug.current}`} 
                key={product._id}
                className="group flex flex-col space-y-6"
              >
                {/* IMAGE CONTAINER */}
                <div className="aspect-[3/4] relative overflow-hidden rounded-[3rem] bg-white border border-[#e5dfd3] shadow-sm transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(163,87,58,0.1)] group-hover:border-[#a3573a]/20">
                  <img
                    src={urlFor(product.mainImage).width(800).url()}
                    alt={product.title}
                    className="object-cover w-full h-full transition-transform duration-[1.5s] group-hover:scale-110 group-hover:sepia-[0.1]"
                  />
                  
                  {/* View Details Label */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="bg-[#3d2b1f] text-[#fdfaf5] px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                      View Details
                    </span>
                  </div>
                </div>

                {/* PRODUCT INFO */}
                <div className="px-4 space-y-3">
                  <div className="flex justify-between items-baseline gap-4">
                    <h2 className="text-3xl font-serif italic font-medium text-[#3d2b1f] group-hover:text-[#a3573a] transition-colors leading-tight">
                      {product.title}
                    </h2>
                    {/* FONT CORRECTION: Price set to font-sans */}
                    <span className="text-lg font-sans font-bold text-[#a3573a] whitespace-nowrap">
                      Rs. {product.price}
                    </span>
                  </div>
                  
                  <p className="text-[#a89f91] text-sm font-light italic leading-relaxed line-clamp-2">
                    {product.description || "Handcrafted with precision in Dolakha, bringing artisanal elegance to your sanctuary."}
                  </p>
                  
                  <div className="pt-4">
                    {/* FONT CORRECTION: Numbers set to font-sans */}
                    <span className="inline-block border-b border-[#e5dfd3] pb-1 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#e5dfd3] group-hover:text-[#a3573a] group-hover:border-[#a3573a] transition-all duration-300">
                      Archive No. <span className="font-sans">{String(index + 1).padStart(2, '0')}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="mt-48 pt-16 border-t border-[#e5dfd3] border-dotted flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#a89f91]">
                Dolakha  / {data.category.title}
            </div>
            <Link 
              href="/" 
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#3d2b1f] hover:text-[#a3573a] transition-colors border-b border-[#3d2b1f] hover:border-[#a3573a] pb-1"
            >
              Back to Showroom ↑
            </Link>
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#a89f91]">
                EST. 2024
            </div>
        </div>
      </div>
    </div>
  );
}
