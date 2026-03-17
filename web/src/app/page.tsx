import { client } from "@/lib/sanity";
import CategoryRow from "@/components/CategoryRow"; 
import { Product, Bulletin, HeroImage, Category } from '@/types';
import Hero from "@/components/Hero";
import { bulletinQuery, heroImageQuery, categoriesQuery } from "@/lib/queries";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch products with their images
  const products = await client.fetch<Product[]>(`*[_type == "product"]{
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, description
  }`);
  const bulletins = await client.fetch<Bulletin[]>(bulletinQuery);
  const heroImages = await client.fetch<HeroImage[]>(heroImageQuery);
  const categoriesInOrder = await client.fetch<Category[]>(categoriesQuery);

  const productsByCategory = products.reduce((acc, product) => {
    const key = product.category?.slug || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <main className="min-h-screen bg-white text-stone-900 pb-20 overflow-x-hidden">

      {/* --- HERO SECTION WITH DYNAMIC IMAGES --- */}
      <Hero bulletins={bulletins} heroImages={heroImages} />

      {/* --- PRODUCT ROWS --- */}
      <div id="products-section" className="w-full">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif italic tracking-tight text-[#3d2b1f] my-16 py-16 underline underline-offset-4 decoration-[#a3573a] decoration-2 transition-all duration-500 hover:decoration-[#a3573a]/50"> Browse Our Collections </h2>
        </div>
        {categoriesInOrder.map((cat, index) => {
          const isStriped = index % 2 !== 0;
          return (
            <section
              key={cat.slug}
              className={`mt-00 py-0 md:py-16 pt-0 w-full border-t border-stone-200 scroll-mt-20 transition-all duration-500 ${isStriped
                ? 'bg-stone-100 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]'
                : 'bg-white'
                }`}
            >
              <div className="container mx-auto px-6">
                <CategoryRow
                  title={cat.title}
                  slug={cat.slug}
                  products={productsByCategory[cat.slug] ?? []}
                />
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
