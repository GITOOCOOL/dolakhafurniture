import { Metadata } from "next";
import { client } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Master Price List & Catalog",
  description: "View our current furniture collections and official price list for Kathmandu and beyond.",
};
import { allProductsQuery } from "@/lib/queries";
import { Product } from "@/types";
import DownloadButton from "@/components/DownloadButton";
import { Leaf, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CategorizedProductGrid from "@/components/CategorizedProductGrid";

export const dynamic = "force-dynamic";

export default async function PriceListPage() {
  const allProducts: Product[] = await client.fetch(allProductsQuery);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-app pb-24 font-sans text-heading pt-32">
      {/* HEADER SECTION */}
      <div className="container mx-auto px-6 md:px-12 mb-16">
        <div className="flex justify-between items-start mb-12 no-print">
          <Link
            href="/"
            className="flex items-center gap-3 bg-white border border-soft text-heading px-6 py-3 rounded-full type-action hover:bg-stone-50 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Showroom
          </Link>
          <DownloadButton label="Download Price List" variant="outline" />
        </div>

        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <Leaf size={40} className="text-action" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic font-medium leading-tight">
            Master Price List<span className="text-action">.</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-label py-4 border-y border-soft/50">
            Issued on {currentDate} — Archive 2024
          </p>
        </div>
      </div>

      {/* PRICE LIST TABLES */}
      <div className="container mx-auto px-6 md:px-12">
        <CategorizedProductGrid products={allProducts} />
      </div>

      {/* FOOTER ACCENT */}
      <section className="container mx-auto px-6 md:px-12 mt-32 pt-16 border-t border-soft border-dotted text-center space-y-6">
        <p className="text-label font-serif italic text-lg max-w-lg mx-auto leading-relaxed">
          "Each piece is handcrafted with precision in Dolakha, bringing
          elegance to your sanctuary. Prices are subject to change based on
          custom material requirements."
        </p>
        <div className="flex justify-center items-center gap-8 pt-8">
          <div className="type-label text-label">
            EST. 2024
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-action" />
          <div className="type-label text-label">
            Dolakha Furniture
          </div>
        </div>
      </section>
    </main>
  );
}
