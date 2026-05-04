import { client, urlFor } from "@/lib/sanity";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Leaf } from "lucide-react";
import { Product, BusinessMetaData } from "@/types";
import ProductCard from "@/components/ProductCard";
import { businessMetaDataQuery } from "@/lib/queries";
import { isAuthorizedAdmin } from "@/lib/auth";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const isAdmin = await isAuthorizedAdmin();
  const [category, businessMetaData] = await Promise.all([
    client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug }),
    client.fetch(businessMetaDataQuery, { isAdmin })
  ]);

  if (!category) return { title: "Collection Not Found" };

  const name = businessMetaData?.businessName || "undefined_setmetadata_in_studio";
  const description = category.description || `Explore our ${category.title} collection.`;

  return {
    title: `${category.title} | ${name}`,
    description: description,
    openGraph: {
      title: `${category.title} | ${name}`,
      description: description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.title} Collection | ${name}`,
      description: description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const isAdmin = await isAuthorizedAdmin();
  const data = await client.fetch(
    `{
      "category": *[_type == "category" && slug.current == $slug][0],
      "products": *[_type == "product" && category->slug.current == $slug && (isActive == true || ($isAdmin && adminPreview == true))] | order(_createdAt desc) {
        _id, title, price, mainImage, images, "category": category->{title, "slug": slug.current}, "slug": slug.current, description, stock, isFeatured
      },
      "businessMetaData": *[_type == "businessMetaData"][0]
    }`,
    { slug, isAdmin },
  );

  if (!data.category) notFound();

  return (
    <div className="bg-app min-h-screen pb-20 font-sans text-heading">
      <div className="container mx-auto px-6 relative pt-24">
        {/* TOP LEFT: Back to home */}
        <div className="absolute top-8 left-6">
          <Link 
            href="/" 
            className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-heading hover:text-action transition-all flex items-center gap-2"
          >
            <span className="text-sm">←</span> Back to home
          </Link>
        </div>

        {/* PAGE HEADER - Compact Standard Design */}
        <header className="mb-12 text-left max-w-6xl border-b border-soft pb-6">
          <p className="type-label text-action mb-4">
             Collection Archive
          </p>
          <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-heading">
            {data.category.title}<span className="text-action">.</span>
          </h1>
        </header>

        {/* PRODUCT GRID */}
        {data.products.length === 0 ? (
          <div className="py-24 border-t border-soft border-dotted text-center">
            <p className="text-label italic font-serif text-2xl">
              "New treasures for this collection are currently being
              handcrafted."
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 border-t border-soft border-dotted pt-16">
            {data.products.map((product: Product) => (
              <ProductCard key={product._id} product={product} businessMetaData={data.businessMetaData} />
            ))}
          </div>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="mt-48 pt-16 border-t border-soft border-dotted flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-medium uppercase tracking-[0.4em] text-label">
            {data.businessMetaData?.businessName || "undefined_setmetadata_in_studio"} / {data.category.title}
          </div>
          <Link
            href="/"
            className="type-label text-heading hover:text-action transition-colors border-b border-espresso hover:border-action pb-1"
          >
            Back to Showroom ↑
          </Link>
          <div className="type-label text-label">
            {new Date().getFullYear()} Archive
          </div>
        </div>
      </div>
    </div>
  );
}
