import { client, urlFor } from "@/lib/sanity";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug });
  if (!category) return { title: "Category Not Found" };
  return { title: `${category.title} | Dolakha Furniture` };
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
    <div className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
      <div className="container mx-auto px-6">
        
        {/* SECTION HEADER */}
        <header className="mb-20 max-w-6xl">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-600 mb-6">
            Collection Archive
          </p>
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-stone-900 leading-[0.85] mb-10">
            {data.category.title}<span className="text-orange-600">.</span>
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-stone-400 max-w-2xl leading-relaxed">
            "{data.category.description || `Artisanal pieces designed to elevate your sanctuary with the essence of Dolakha.`}"
          </p>
        </header>

        {/* RESPONSIVE GRID: 1 Col (SM) -> 2 Col (MD) -> 3 Col (LG/XL) */}
        {data.products.length === 0 ? (
          <div className="py-20 border-t border-stone-200 text-center">
            <p className="text-stone-300 italic font-serif text-2xl">
              "New treasures for this collection are currently being handcrafted."
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 border-t border-stone-200 pt-16">
            {data.products.map((product: any, index: number) => (
              <Link 
                href={`/product/${product.slug.current}`} 
                key={product._id}
                className="group flex flex-col space-y-6"
              >
                {/* LARGER IMAGE CONTAINER */}
                <div className="aspect-[3/4] relative overflow-hidden rounded-[2.5rem] bg-white border border-stone-200 shadow-sm transition-all duration-700 group-hover:shadow-[0_0_50px_rgba(234,88,12,0.15)] group-hover:border-orange-500/30">
                  <img
                    src={urlFor(product.mainImage).width(800).url()}
                    alt={product.title}
                    className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                  />
                  
                  {/* Neon Quick Tag */}
                  <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="bg-stone-900 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                      View Details
                    </span>
                  </div>
                </div>

                {/* PRODUCT INFO */}
                <div className="px-2 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-stone-900 leading-none group-hover:text-orange-600 transition-colors">
                      {product.title}
                    </h2>
                    <span className="text-lg font-serif italic text-stone-400 whitespace-nowrap">
                      Nrs. {product.price}
                    </span>
                  </div>
                  
                  <p className="text-stone-500 text-xs font-medium italic leading-relaxed line-clamp-2">
                    {product.description || "Handcrafted with precision in Dolakha, bringing artisanal elegance to your sanctuary."}
                  </p>
                  
                  <div className="pt-2">
                    <span className="inline-block border-b border-stone-200 pb-1 text-[9px] font-black uppercase tracking-[0.2em] text-stone-300 group-hover:text-orange-600 group-hover:border-orange-600 transition-all duration-300">
                      Archive No. {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="mt-48 pt-16 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">
                Dolakha Furniture / {data.category.title}
            </div>
            <Link 
              href="/" 
              className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-900 hover:text-orange-600 transition-colors border-b-2 border-stone-900 hover:border-orange-600 pb-1"
            >
              Back to Showroom ↑
            </Link>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">
                Est. 2024
            </div>
        </div>
      </div>
    </div>
  );
}
