import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import ProductDetail from "@/components/ProductDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. DYNAMIC SEO METADATA - Updated for a boutique, artisanal feel
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]`, 
    { slug }
  );

  if (!product) return { title: "Piece Not Found" };

  return {
    title: `${product.title} | Handcrafted at Dolakha Furniture`,
    description: product.description || "A unique, artisanal addition to your home, handcrafted in Kathmandu.",
    openGraph: {
      title: `${product.title} | Dolakha Furniture home Collection`,
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
  
  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]`,
    { slug }
  );

  if (!product) {
    notFound();
  }

  return (
    /* Changed bg-stone-50 to your new Boho Cream (#fdfaf5) */
    <div className="bg-[#fdfaf5] min-h-screen text-[#3d2b1f] selection:bg-[#a3573a]/20">
      {/* 
          IMPORTANT: The real UI shift happens inside <ProductDetail />.
          Ensure that component uses:
          - Serif Garamond for titles
          - Terracotta (#a3573a) for "Add to Cart" 
          - Organic, rounded corners (rounded-[3rem])
      */}
      <ProductDetail product={product} />
    </div>
  );
}
