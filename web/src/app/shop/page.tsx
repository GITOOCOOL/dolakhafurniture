import { client } from "@/lib/sanity";
import Link from "next/link";
import { Metadata } from "next";
import { allProductsQuery, businessMetaDataQuery } from "@/lib/queries";
import { Product } from "@/types";
import ShopClient from "@/components/ShopClient";

export async function generateMetadata(): Promise<Metadata> {
  const businessMetaData = await client.fetch(businessMetaDataQuery);
  const name = businessMetaData?.businessName || "undefined_setmetadata_in_studio";

  return {
    title: `Shop | ${name}`,
    description: `Explore our collection of handcrafted, sustainable furniture at ${name}.`,
  };
}

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await client.fetch(allProductsQuery);

  return (
    <div className="bg-app min-h-screen font-sans text-heading relative pb-20">
      
      {/* COMPACT LOCALIZED HEADER */}
      <div className="container mx-auto px-6 md:px-12 pt-40 pb-8 relative">
        
        {/* TOP LEFT: Back to home */}
        <div className="absolute top-16 left-6 md:left-12">
          <Link 
            href="/" 
            className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-heading hover:text-action transition-all flex items-center gap-2"
          >
            <span className="text-sm">←</span> Back to home
          </Link>
        </div>

        {/* REFINED TITLE */}
        <div className="text-left mb-8 border-b border-soft pb-6">
          <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-heading mb-2">
            Shop / पसल<span className="text-action">.</span>
          </h1>
        </div>

        {/* DYNAMIC SHOP SUITE */}
        <ShopClient products={products} />
      </div>
    </div>
  );
}
