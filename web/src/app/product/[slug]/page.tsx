import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import ProductDetail from "@/components/ProductDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. DYNAMIC SEO METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]`, 
    { slug }
  );

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title} | Dolakha Furniture`,
    description: product.description || "Handcrafted furniture from Dolakha.",
    openGraph: {
      title: `${product.title} | Dolakha Furniture`,
      description: product.description,
      images: [
        {
          url: urlFor(product.mainImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
  };
}

// 2. THE PAGE COMPONENT
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  
  // Fetch the full product data
  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]`,
    { slug }
  );

  // If the slug is wrong, show the 404 page
  if (!product) {
    notFound();
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Pass the Sanity data into our Interactive Client Component */}
      <ProductDetail product={product} />
    </div>
  );
}
