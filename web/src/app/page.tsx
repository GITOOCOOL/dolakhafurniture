import { client } from "@/lib/sanity";
import CategoryRow from "@/components/CategoryRow";
import { Product, Category } from "@/types";
import Hero from "@/components/Hero";
import {
  categoriesQuery,
  allProductsQuery,
  featuredProductsQuery,
  activeCampaignHomeQuery,
  socialMediaQuery,
} from "@/lib/queries";
import Carousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";
import { SocialContent } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch only featured products for the top carousel
  const featuredProducts =
    (await client.fetch<Product[]>(featuredProductsQuery)) || [];

  // Fetch all products to group them by category for the bottom section
  const allProducts = (await client.fetch<Product[]>(allProductsQuery)) || [];

  const categoriesInOrder =
    (await client.fetch<Category[]>(categoriesQuery)) || [];

  const activeCampaign =
    (await client.fetch<any>(activeCampaignHomeQuery)) || null;

  let socialContent: SocialContent[] = [];
  try {
    socialContent = await client.fetch<SocialContent[]>(
      socialMediaQuery,
      {},
      { next: { revalidate: 60 } },
    );
  } catch (error) {
    console.error("Home: Failed to fetch social content:", error);
  }

  const homepageStories = socialContent
    .filter((item) => item.type === "story")
    .slice(0, 3);
  const homepageReels = socialContent
    .filter((item) => item.type === "reel")
    .slice(0, 3);

  const productsByCategory = allProducts.reduce(
    (acc, product) => {
      const key = product.category?.slug || "other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  return (
    <div className="w-full bg-app">
      {/* 0. TOPMOST: ACTIVE CAMPAIGN (High visibility) */}
      {activeCampaign?.products?.length > 0 && (
        <section className="w-full py-6 md:py-10 border-b-2 border-action/20 bg-app">
          <div className="w-full px-0">
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

      {/* 1. TOP:  FEATURED PRODUCTS (Using exactly the same design as Category rows) */}
      {featuredProducts.length > 0 && (
        <section
          id="cat-featured"
          className="w-full py-4 md:py-6 border-b border-soft bg-app"
        >
          <div className="w-full px-0">
            <CategoryRow
              title="Featured"
              slug="featured"
              products={featuredProducts}
              autoScroll={true}
            />
          </div>
        </section>
      )}

      {/* 1.5 ALL PRODUCTS CAROUSEL (Sabai Saman) */}
      {allProducts.length > 0 && (
        <section
          id="cat-all"
          className="w-full py-4 md:py-6 border-b border-soft bg-app"
        >
          <div className="w-full px-0">
            <CategoryRow
              title="सबै सामान (Sabai Saman)"
              slug="shop"
              products={allProducts}
              autoScroll={false}
              description="Explore our full collection of handcrafted furniture."
            />
          </div>
        </section>
      )}

      {/* 2. TOP: CATEGORY CAROUSELS (Primary product discovery) */}
      <div id="category-rows-section" className="w-full bg-app pb-16">
        <div className="w-full px-0 border-t border-soft border-dotted pt-16 mt-8">
          <p className="type-label text-label mb-2 text-center">
            Full Catalogue
          </p>
          <h2 className="text-4xl text-center font-serif italic tracking-tight text-heading mb-16">
            {" "}
            Explore by Category{" "}
          </h2>
        </div>

        {categoriesInOrder.map((cat, index) => {
          const catProducts = productsByCategory[cat.slug] || [];
          if (catProducts.length === 0) return null;

          return (
            <section
              key={cat.slug}
              id={`cat-${cat.slug}`}
              className="py-6 md:py-8 w-full border-t border-soft transition-all duration-500 bg-app"
            >
              <div className="w-full px-0">
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

      {/* 4. BOTTOM: BRAND STORY / MISSION (Moved from middle for better product-first flow) */}
      <div className="border-t border-soft border-dotted">
        <Hero stories={homepageStories} reels={homepageReels} />
      </div>
    </div>
  );
}
