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
    title: `${product.title} | Dolakha Furniture`,
    description: product.description || defaultDescription,
    openGraph: {
      title: `${product.title} | Dolakha Furniture`,
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
      title: `${product.title} | Dolakha Furniture`,
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

  const imageUrl = product.mainImage
    ? urlFor(product.mainImage).width(1200).height(630).url()
    : "/logo.png";
  
  const defaultDescription = "A unique, handcrafted addition to your home, created in Kathmandu.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": imageUrl,
    "description": product.description || defaultDescription,
    "brand": {
      "@type": "Brand",
      "name": "Dolakha Furniture"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://dolakhafurniture.com/product/${slug}`,
      "priceCurrency": "NPR",
      "price": product.price,
      "availability": (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="bg-app min-h-screen text-heading selection:bg-action/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </div>
  );
}
