import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import ProductDetail from "@/components/ProductDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { productBySlugQuery, businessMetaDataQuery } from "@/lib/queries";
import { Product, BusinessMetaData } from "@/types";
import { isAuthorizedAdmin } from "@/lib/auth";

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. DYNAMIC SEO METADATA - Updated for a boutique feel
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const isAdmin = await isAuthorizedAdmin();
  const [product, businessMetaData] = await Promise.all([
    client.fetch<Product | null>(productBySlugQuery, { slug, isAdmin }),
    client.fetch<BusinessMetaData | null>(businessMetaDataQuery, { isAdmin }),
  ]);

  const name = businessMetaData?.businessName || "undefined_setmetadata_in_studio";

  if (!product) return { title: `Piece Not Found | ${name}` };

  const defaultDescription =
    `A unique, handcrafted addition to your home, created by ${name}.`;
  const imageUrl = product.mainImage
    ? urlFor(product.mainImage).width(1200).height(630).url()
    : "/logo.png"; // Fallback image

  return {
    title: `${product.title} | ${name}`,
    description: product.description || defaultDescription,
    openGraph: {
      title: `${product.title} | ${name}`,
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
      title: `${product.title} | ${name}`,
      description: product.description || defaultDescription,
      images: [imageUrl],
    },
  };
}

// 2. THE PAGE COMPONENT
export default async function ProductPage({ params }: Props) {
  const isAdmin = await isAuthorizedAdmin();
  const [product, businessMetaData] = await Promise.all([
    client.fetch<Product | null>(productBySlugQuery, { slug, isAdmin }),
    client.fetch<BusinessMetaData | null>(businessMetaDataQuery, { isAdmin })
  ]);

  if (!product) {
    notFound();
  }

  const imageUrl = product.mainImage
    ? urlFor(product.mainImage).width(1200).height(630).url()
    : "/logo.png";
  
  const name = businessMetaData?.businessName || "undefined_setmetadata_in_studio";
  const url = businessMetaData?.businessUrl || "https://undefined_setmetadata_in_studio.com";
  const defaultDescription = `A unique, handcrafted addition to your home, created by ${name}.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": imageUrl,
    "description": product.description || defaultDescription,
    "brand": {
      "@type": "Brand",
      "name": name
    },
    "offers": {
      "@type": "Offer",
      "url": `${url}/product/${slug}`,
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
      <ProductDetail product={product} businessMetaData={businessMetaData} />
    </div>
  );
}
