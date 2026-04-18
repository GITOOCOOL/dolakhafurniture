import { client } from "@/lib/sanity";
import CategoryRow from "@/components/CategoryRow"; 
import { Product, Category } from '@/types';
import Hero from "@/components/Hero";
import { categoriesQuery, allProductsQuery } from "@/lib/queries";
import Carousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";

export const dynamic = 'force-dynamic';

export default async function Home() {
  
  // Fetch only featured products for the top carousel
  const featuredProducts = await client.fetch<Product[]>(`*[_type == "product" && isFeatured == true] | order(_createdAt desc){
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, description, stock
  }`);

  // Fetch all products to group them by category for the bottom section
  const allProducts = await client.fetch<Product[]>(`*[_type == "product"]{
    _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, description, stock
  }`);
  
  const categoriesInOrder = await client.fetch<Category[]>(categoriesQuery);

  const activeCampaign = await client.fetch<any>(`*[_type == "campaign" && status == "active"] | order(startDate desc)[0] {
    title,
    "slug": slug.current,
    endDate,
    "vouchers": vouchers[]->code,
    "products": promotedProducts[]-> {
      _id, title, price, mainImage, "category": category->{title, "slug": slug.current}, "slug": slug.current, description, stock
    }
  }`);

  const productsByCategory = allProducts.reduce((acc, product) => {
    const key = product.category?.slug || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="w-full bg-[#fdfaf5]">

      {/* 0. TOPMOST: ACTIVE CAMPAIGN (High visibility) */}
      {activeCampaign?.products?.length > 0 && (
        <section className="w-full py-6 md:py-10 border-b-2 border-[#a3573a]/20 bg-[#a3573a]/5">
          <div className="container mx-auto px-6">
            <CategoryRow 
              title={`Campaign: ${activeCampaign.title}`}
              slug={`campaign/${activeCampaign.slug}`}
              products={activeCampaign.products}
              subtitle={activeCampaign.endDate}
              vouchers={activeCampaign.vouchers}
              autoScroll={true}
            />
          </div>
        </section>
      )}

      {/* 1. TOP: FEATURED PRODUCTS (Using exactly the same design as Category rows) */}
      {featuredProducts.length > 0 && (
        <section className="w-full py-4 md:py-6 border-b border-[#e5dfd3] bg-[#fdfaf5]">
          <div className="container mx-auto px-6">
            <CategoryRow 
              title="Featured"
              slug="featured"
              products={featuredProducts}
              autoScroll={true}
            />
          </div>
        </section>
      )}

      {/* 2. TOP: CATEGORY CAROUSELS (Primary product discovery) */}
      <div id="category-rows-section" className="w-full bg-[#fdfaf5] pb-16">
        <div className="container mx-auto px-6 border-t border-[#e5dfd3] border-dotted pt-16 mt-8">
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#a89f91] mb-2 text-center">Full Catalogue</p>
          <h2 className="text-4xl text-center font-serif italic tracking-tight text-[#3d2b1f] mb-16"> Explore by Category </h2>
        </div>
        
        {categoriesInOrder.map((cat, index) => {
          const catProducts = productsByCategory[cat.slug] || [];
          if (catProducts.length === 0) return null;
          
          const isStriped = index % 2 !== 0;
          return (
            <section
              key={cat.slug}
              className={`py-6 md:py-8 w-full border-t border-[#e5dfd3] transition-all duration-500 ${isStriped
                ? 'bg-stone-50'
                : 'bg-[#fdfaf5]'
                }`}
            >
              <div className="container mx-auto px-6">
                <CategoryRow
                  title={cat.title}
                  slug={cat.slug}
                  products={catProducts}
                  autoScroll={true}
                />
              </div>
            </section>
          );
        })}
      </div>

      {/* 3. BOTTOM: BRAND STORY / MISSION (Moved from middle for better product-first flow) */}
      <div className="border-t border-[#e5dfd3] border-dotted">
        <Hero />
      </div>
    </div>
  );
}
