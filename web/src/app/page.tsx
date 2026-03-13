import { client } from "@/lib/sanity";
import CategoryRow from "@/components/CategoryRow";
import { Product } from '@/types/product'

export default async function Home() {
  const products = await client.fetch<Product[]>(`*[_type == "product"]{
    _id, title, price, mainImage, category, "slug": slug.current, description
  }`);

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
      
      {/* --- HERO SECTION --- */}
      <section className="container mx-auto px-6 pt-24 pb-32">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-[2px] w-12 bg-orange-600"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-600">
                Est. 2024
              </span>
            </div>

            <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] mb-8">
              Dolakha<br />
              <span className="font-serif italic font-light lowercase tracking-normal text-stone-400">
                Furniture.
              </span>
            </h1>

            <p className="text-stone-500 font-medium text-lg max-w-lg leading-relaxed italic">
              "We don't just build furniture; we craft the pillars of your sanctuary. Handcrafted plant stands and clay pots, designed for the modern minimalist."
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end text-right border-l-2 border-stone-200 pl-8 h-fit">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2">Based in</span>
            <span className="text-sm font-bold uppercase tracking-tighter">Nepal / Worldwide</span>
            <div className="mt-8 bg-stone-900 text-white p-6 rounded-2xl rotate-3 hover:rotate-0 transition-transform cursor-default">
               <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-orange-500">New Drop</p>
               <p className="text-lg font-bold">20+ New Arrivals</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRODUCT ROWS (CLEAN SEPARATION) --- */}
      <div className="w-full">
        {categoriesInOrder.map((cat, index) => {
          // Zebra Logic: Every second row gets a subtle grey tint
          const isStriped = index % 2 !== 0;
          
          return (
            <section 
              key={cat.value} 
              // Using a slightly more defined border and stone-100/50 for "Safe" separation
              // scroll-mt-20 ensures category links don't hide under the navbar
              className={`py-20 md:py-32 w-full border-t border-stone-200 scroll-mt-20 transition-all duration-500 ${
                isStriped 
                  ? 'bg-stone-100/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]' 
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
