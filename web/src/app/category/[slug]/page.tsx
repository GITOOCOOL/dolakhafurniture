import { client, urlFor } from "@/lib/sanity";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Leaf } from "lucide-react";
import { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]`,
    { slug },
  );
  if (!category) return { title: "Collection Not Found" };
  return { title: `${category.title} | Dolakha ` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const data = await client.fetch(
    `{
      "category": *[_type == "category" && slug.current == $slug][0],
      "products": *[_type == "product" && category->slug.current == $slug && isActive == true] | order(_createdAt desc) {
        _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, description, stock, isFeatured
      }
    }`,
    { slug },
  );

  if (!data.category) notFound();

  return (
    <div className="bg-app min-h-screen pt-32 pb-20 font-sans text-heading">
      <div className="container mx-auto px-6">
        {/* SECTION HEADER */}
        <header className="mb-20 max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <Leaf size={14} className="text-action opacity-60" />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-action">
              Collection Archive
            </p>
          </div>
          <h1 className="type-hero font-medium text-heading leading-none mb-10">
            {data.category.title}
            <span className="text-action">.</span>
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-label max-w-2xl leading-relaxed border-l-2 border-soft pl-6">
            "
            {data.category.description ||
              ` pieces designed to elevate your home with the essence of Dolakha.`}
            "
          </p>
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
            {data.products.map((product: Product, index: number) => (
              <Link
                href={`/product/${product.slug}`}
                key={product._id}
                className="group flex flex-col space-y-6"
              >
                {/* IMAGE CONTAINER */}
                <div className="aspect-[3/4] relative overflow-hidden rounded-[3rem] bg-white border border-soft shadow-sm transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(163,87,58,0.1)] group-hover:border-action/20">
                  <img
                    src={urlFor(product.mainImage).width(800).url()}
                    alt={product.title}
                    className="object-cover w-full h-full transition-transform duration-[1.5s] group-hover:scale-110 group-hover:sepia-[0.1]"
                  />

                  {product.stock !== undefined && product.stock <= 0 && (
                    <div className="absolute top-6 right-6 bg-app  border border-soft text-heading px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl z-20 flex flex-col items-center gap-1 text-center leading-tight">
                      <span className="text-action">OUT OF STOCK</span>
                      <span className="opacity-70 text-[8px] normal-case font-medium italic">
                        will be made after order
                      </span>
                    </div>
                  )}

                  {/* View Details Label */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="bg-espresso text-bone px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                      View Details
                    </span>
                  </div>
                </div>

                {/* PRODUCT INFO */}
                <div className="px-4 space-y-3">
                  <div className="flex justify-between items-baseline gap-4">
                    <h2 className="text-3xl font-serif italic font-medium text-heading group-hover:text-action transition-colors leading-tight">
                      {product.title}
                    </h2>
                    {/* FONT CORRECTION: Price set to font-sans */}
                    <span className="text-lg font-sans font-bold text-action whitespace-nowrap">
                      Rs. {product.price}
                    </span>
                  </div>

                  <p className="text-label type-body italic leading-relaxed line-clamp-2">
                    {product.description ||
                      "Made with care in Nepal, bringing elegance to your home."}
                  </p>

                  <div className="pt-4">
                    {/* FONT CORRECTION: Numbers set to font-sans */}
                    <span className="inline-block border-b border-soft pb-1 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-label group-hover:text-action group-hover:border-action transition-all duration-300">
                      Archive No.{" "}
                      <span className="font-sans">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="mt-48 pt-16 border-t border-soft border-dotted flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-medium uppercase tracking-[0.4em] text-label">
            Dolakha / {data.category.title}
          </div>
          <Link
            href="/"
            className="type-label text-heading hover:text-action transition-colors border-b border-espresso hover:border-action pb-1"
          >
            Back to Showroom ↑
          </Link>
          <div className="type-label text-label">
            EST. 2024
          </div>
        </div>
      </div>
    </div>
  );
}
