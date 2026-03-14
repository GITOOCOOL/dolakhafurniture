import { client } from "@/lib/sanity";
import CategoryRow from "@/components/CategoryRow";
import { Product } from '@/types/product';
import Hero from "@/components/Hero";

export default async function Home() {
  // Fetch products with their images
  const products = await client.fetch<Product[]>(`*[_type == "product"]{
    _id, title, price, mainImage, category, "slug": slug.current, description
  }`);

  // DYNAMIC IMAGE LOGIC: 
  // Get all unique product images and shuffle them to pick 4
  const heroImagePool = products
    .filter(p => p.mainImage)
    .map(p => p.mainImage)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const categoriesInOrder = [
    { title: 'Clay Pots', value: 'clay-pots' },
    { title: 'Plant Stands', value: 'plant-stands' },
    { title: 'Hand-Painted', value: 'hand-painted' },
    { title: 'Artsy Decor', value: 'artsy-decor' },
  ];

  const productsByCategory = products.reduce((acc, product) => {
    const key = product.category || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <main className="min-h-screen bg-white text-stone-900 pb-20 overflow-x-hidden">
      
      {/* --- HERO SECTION WITH DYNAMIC IMAGES --- */}
      <Hero dynamicImages={heroImagePool} />

      {/* --- PRODUCT ROWS --- */}
      <div className="w-full">
        {categoriesInOrder.map((cat, index) => {
          const isStriped = index % 2 !== 0;
          return (
            <section 
              key={cat.value} 
              className={`py-16 md:py-16 pt-0 w-full border-t border-stone-200 scroll-mt-20 transition-all duration-500 ${
                isStriped 
                  ? 'bg-stone-100 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]' 
                  : 'bg-white'
              }`}
            >
              <div className="container mx-auto px-6">
                <CategoryRow 
                  title={cat.title}
                  slug={cat.value}
                  products={productsByCategory[cat.value] ?? []}
                />
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
