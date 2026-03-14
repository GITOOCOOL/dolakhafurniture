import { client, urlFor } from "@/lib/sanity";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Collections | Dolakha Furniture",
  description: "Browse our complete archive of handcrafted furniture and decor.",
};

export default async function ShopPage() {
  const products = await client.fetch(
    `*[_type == "product"] | order(category asc, title asc) {
      _id,
      title,
      price,
      mainImage,
      category,
      description,
      "slug": slug.current
    }`
  );

  return (
    <div className="bg-[#fdfaf5] min-h-screen pt-32 pb-20 font-sans text-[#3d2b1f]">
      <div className="container mx-auto px-6">
        
        {/* SHOP HEADER */}
        <header className="mb-20 max-w-6xl text-center md:text-left">
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#a3573a] mb-4">
            Our Complete Collection
          </p>
          <h1 className="text-6xl md:text-8xl font-serif italic font-medium text-[#3d2b1f] leading-none mb-8">
            The Shop<span className="text-[#a3573a]">.</span>
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-[#a89f91] max-w-2xl leading-relaxed mx-auto md:mx-0">
            "Every piece in our collection is sustainably sourced, thoughtfully handcrafted, and curated for your home."
          </p>
        </header>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 border-t border-[#e5dfd3] border-dotted pt-16">
          {products.map((product: any, index: number) => (
            <Link 
              href={`/product/${product.slug}`} 
              key={product._id}
              className="group flex flex-col space-y-6"
            >
              {/* Image Container */}
              <div className="aspect-[3/4] relative overflow-hidden rounded-[3rem] bg-white border border-[#e5dfd3] shadow-sm transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(163,87,58,0.1)] group-hover:border-[#a3573a]/30">
                <img
                  src={urlFor(product.mainImage).width(800).url()}
                  alt={product.title}
                  className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                />
                
                <div className="absolute top-6 left-6">
                  <span className="bg-[#fdfaf5]/90 backdrop-blur-md text-[#3d2b1f] px-4 py-2 rounded-full text-[9px] font-sans font-bold uppercase tracking-widest border border-[#e5dfd3]">
                    {product.category}
                  </span>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="bg-[#a3573a] text-white px-8 py-3 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest shadow-xl">
                    View Details
                  </span>
                </div>
              </div>

              {/* PRODUCT INFO */}
              <div className="px-4 space-y-2">
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
                  {product.description || "Handcrafted with precision in Dolakha, bringing artisanal elegance to your ."}
                </p>
                
                <div className="pt-4">
                  {/* FONT CORRECTION: Sourced Item Number set to font-sans */}
                  <span className="inline-block border-b border-[#e5dfd3] pb-1 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#e5dfd3] group-hover:text-[#a3573a] group-hover:border-[#a3573a] transition-all duration-300">
                    Sourced Item <span className="font-sans">{String(index + 1).padStart(3, '0')}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* FOOTER NAV */}
        <div className="mt-48 pt-16 border-t border-[#e5dfd3] border-dotted flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#a89f91]">
                Dolakha Furniture / Shop All
            </div>
            <Link 
              href="/" 
              className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#3d2b1f] hover:text-[#a3573a] transition-colors border-b border-[#3d2b1f] hover:border-[#a3573a] pb-1"
            >
              Back to Home ↑
            </Link>
            {/* FONT CORRECTION: Year set to font-sans */}
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#a89f91]">
                EST. 2024
            </div>
        </div>
      </div>
    </div>
  );
}
