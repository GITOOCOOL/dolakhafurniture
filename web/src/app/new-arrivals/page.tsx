import { client, urlFor } from "@/lib/sanity";
import Link from "next/link";
import { Metadata } from "next";
import { Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "New Arrivals | Dolakha Furniture",
  description: "The latest handcrafted additions to our  collection.",
};

export const dynamic = 'force-dynamic';

export default async function NewArrivalsPage() {
  const products = await client.fetch(
    `*[_type == "product" && isActive == true] | order(_createdAt desc) [0...4] {
      _id,
      title,
      price,
      mainImage,
      "category": category->{title, "slug": slug.current},
      description,
      "slug": slug.current
    }`
  );

  return (
    <div className="bg-app min-h-screen pt-32 pb-20 font-sans text-heading">
      <div className="container mx-auto px-6">
        
        {/* PAGE HEADER */}
        <header className="mb-20 max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warmth opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-action"></span>
            </span>
            <p className="type-label text-action">
              Fresh From The Workshop
            </p>
          </div>
          
          <h1 className="type-hero font-medium text-heading leading-none mb-10">
            New Arrivals<span className="text-warmth">.</span>
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-label max-w-2xl leading-relaxed">
            "The newest expressions of Dolakha craftsmanship. Limited pieces, recently perfected and ready for your home."
          </p>
        </header>

        {/* ARRIVALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32 border-t border-soft border-dotted pt-16">
          {products.map((product: any, index: number) => (
            <Link 
              href={`/product/${product.slug}`} 
              key={product._id}
              className={`group flex flex-col space-y-8 ${index % 2 !== 0 ? 'md:mt-32' : ''}`}
            >
              {/* IMAGE CONTAINER */}
              <div className="aspect-[4/5] relative overflow-hidden rounded-[4rem] bg-white border border-soft shadow-sm transition-all duration-700 group-hover:shadow-[0_20px_60px_rgba(163,87,58,0.1)] group-hover:border-action/20">
                <img
                  src={urlFor(product.mainImage).width(1000).url()}
                  alt={product.title}
                  className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                />
                
                <div className="absolute top-8 right-8">
                  <span className="bg-espresso/90  text-bone px-6 py-2 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest shadow-lg">
                    Newly Perfected
                  </span>
                </div>
              </div>

              {/* PRODUCT INFO */}
              <div className="px-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-action mb-2">
                      {product.category?.title}
                    </p>
                    <h2 className="type-section font-medium text-heading leading-none group-hover:text-action transition-colors">
                      {product.title}
                    </h2>
                  </div>
                  {/* FONT CORRECTION: Price set to font-sans */}
                  <span className="text-xl font-sans font-bold text-action whitespace-nowrap pt-2">
                    Rs. {product.price}
                  </span>
                </div>
                
                <p className="text-label text-sm md:text-base font-light italic leading-relaxed max-w-xl">
                  {product.description || "A fresh addition to our store, made with care in Kathmandu."}
                </p>

                <div className="pt-6">
                    <span className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-heading group-hover:text-action transition-all duration-500 flex items-center gap-4">
                        Explore Piece 
                        <span className="h-[1px] w-12 border-soft group-hover:w-24 group-hover:bg-action transition-all duration-500"></span>
                    </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* FOOTER NAV */}
        <div className="mt-64 pt-16 border-t border-soft border-dotted flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="type-label text-label">
                Dolakha Furniture / New Arrivals
            </div>
            <Link 
              href="/shop" 
              className="group text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-heading hover:text-action transition-colors border-b border-espresso hover:border-action pb-1"
            >
              Full Archive <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
            </Link>
            {/* FONT CORRECTION: Year set to font-sans */}
            <div className="type-label text-label">
                {new Date().getFullYear()} Inventory
            </div>
        </div>
      </div>
    </div>
  );
}
