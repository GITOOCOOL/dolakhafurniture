import { client } from "@/lib/sanity";
import Link from "next/link";
import { Metadata } from "next";
import { allProductsQuery } from "@/lib/queries";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Shop | Dolakha Furniture",
  description: "Explore our collection of handcrafted, sustainable furniture.",
};

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await client.fetch(allProductsQuery);

  return (
    <div className="bg-app min-h-screen font-sans text-heading relative pb-20">
      
      {/* MINIMALIST HEADER */}
      <div className="container mx-auto px-4 md:px-6 pt-8 pb-12 flex flex-col items-center relative">
        
        {/* TOP LEFT: Back to home */}
        <div className="absolute top-8 left-4 md:left-6">
          <Link 
            href="/" 
            className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-heading hover:text-action transition-all flex items-center gap-2"
          >
            <span className="text-sm">←</span> Back to home
          </Link>
        </div>

        {/* CENTERED TITLE */}
        <h1 className="text-7xl md:text-9xl font-serif italic font-medium text-heading mt-12 mb-4">
          Shop<span className="text-action">.</span>
        </h1>
      </div>

      {/* HIGH-DENSITY GRID */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-10 gap-y-32 md:gap-x-12 md:gap-y-24 border-t border-soft pt-12">
          {products.map((product: Product) => (
            <div key={product._id} className="w-full">
               <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
