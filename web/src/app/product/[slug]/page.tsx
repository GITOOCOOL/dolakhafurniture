import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import ProductDetail from "@/components/ProductDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { productBySlugQuery } from "@/lib/queries";
import { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. DYNAMIC SEO METADATA - Updated for a boutique,  feel
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await client.fetch<Product | null>(productBySlugQuery, {
    slug,
  });

  if (!product) return { title: "Piece Not Found" };

  const defaultDescription =
    "A unique,  addition to your home, handcrafted in Kathmandu.";
  const imageUrl = product.mainImage
    ? urlFor(product.mainImage).width(1200).height(630).url()
    : "/logo.png"; // Fallback image

  return {
    title: `${product.title} | Handcrafted at Dolakha Furniture`,
    description: product.description || defaultDescription,
    openGraph: {
      title: `${product.title} | Dolakha Furniture Home Collection`,
      description: product.description || defaultDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Handcrafted at Dolakha Furniture`,
      description: product.description || defaultDescription,
      images: [imageUrl],
    },
  };
}

// 2. THE PAGE COMPONENT
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await client.fetch<Product | null>(productBySlugQuery, {
    slug,
  });

  if (!product) {
    notFound();
  }

  return (
    /* Changed bg-stone-50 to your new Boho Cream (bone) */
    <div className="bg-app min-h-screen text-heading selection:bg-action/20">
      {/* 
          IMPORTANT: The real UI shift happens inside <ProductDetail />.
          Ensure that component uses:
          - Serif Garamond for titles
          - Terracotta (accent) for "Add to Cart" 
          - Organic, rounded corners (rounded-[3rem])
      */}
      <ProductDetail product={product} />
    </div>
  );
}
