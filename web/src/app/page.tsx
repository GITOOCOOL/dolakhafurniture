import { client } from "@/lib/sanity";
import CategoryRow from "@/components/CategoryRow"; 
import { Product, Category } from '@/types';
import Hero from "@/components/Hero";
import { categoriesQuery, allProductsQuery, featuredProductsQuery, activeCampaignHomeQuery } from "@/lib/queries";
import Carousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";

export const dynamic = 'force-dynamic';

export default async function Home() {
  
  // Fetch only featured products for the top carousel
  const featuredProducts = (await client.fetch<Product[]>(featuredProductsQuery)) || [];

  // Fetch all products to group them by category for the bottom section
  const allProducts = (await client.fetch<Product[]>(allProductsQuery)) || [];
  
  const categoriesInOrder = (await client.fetch<Category[]>(categoriesQuery)) || [];

  const activeCampaign = (await client.fetch<any>(activeCampaignHomeQuery)) || null;

  const productsByCategory = allProducts.reduce((acc, product) => {
    const key = product.category?.slug || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="w-full bg-app">

      {/* 0. TOPMOST: ACTIVE CAMPAIGN (High visibility) */}
      {activeCampaign?.products?.length > 0 && (
        <section className="w-full py-6 md:py-10 border-b-2 border-action/20 bg-app">
          <div className="container mx-auto px-6">
            <CategoryRow 
              title={`Campaign: ${activeCampaign.title}`}
              slug={`campaign/${activeCampaign.slug}`}
              products={activeCampaign.products}
              subtitle={activeCampaign.endDate}
              vouchers={activeCampaign.vouchers}
              autoScroll={true}
              description={activeCampaign.description}
            />
          </div>
        </section>
      )}

      {/* 1. TOP: FEATURED PRODUCTS (Using exactly the same design as Category rows) */}
      {featuredProducts.length > 0 && (
        <section className="w-full py-4 md:py-6 border-b border-soft bg-app">
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
      <div id="category-rows-section" className="w-full bg-app pb-16">
        <div className="container mx-auto px-6 border-t border-soft border-dotted pt-16 mt-8">
          <p className="type-label text-label mb-2 text-center">Full Catalogue</p>
          <h2 className="text-4xl text-center font-serif italic tracking-tight text-heading mb-16"> Explore by Category </h2>
        </div>
        
        {categoriesInOrder.map((cat, index) => {
          const catProducts = productsByCategory[cat.slug] || [];
          if (catProducts.length === 0) return null;
          
          return (
            <section
              key={cat.slug}
              className="py-6 md:py-8 w-full border-t border-soft transition-all duration-500 bg-app"
            >
              <div className="container mx-auto px-6">
                <CategoryRow
                  title={cat.title}
                  slug={cat.slug}
                  products={catProducts}
                  autoScroll={true}
                  description={cat.description}
                />
              </div>
            </section>
          );
        })}
      </div>

      {/* 3. BOTTOM: BRAND STORY / MISSION (Moved from middle for better product-first flow) */}
      <div className="border-t border-soft border-dotted">
        <Hero />
      </div>
    </div>
  );
}
