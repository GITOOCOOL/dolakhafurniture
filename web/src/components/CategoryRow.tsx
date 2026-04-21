import CategoryRibbon from "./CategoryRibbon";
import Carousel from "./Carousel";
import ProductCard from "./ProductCard";
import type { Product } from "../types/product";

type CategoryRowProps = {
  title: string;
  slug: string;
  products: Product[];
  autoScroll?: boolean;
  subtitle?: string;
  vouchers?: string[];
  description?: string;
};

const CategoryRow = ({ title, slug, products, autoScroll = false, subtitle, vouchers, description }: CategoryRowProps) => {
  const validProducts = products?.filter(Boolean) || [];
  
  if (!validProducts.length) return null;
  return (
    <section className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-stretch w-full overflow-visible">
      {/* Ribbon: Spans full width on mobile, side-aligned on desktop */}
      <div className="flex-shrink-0 w-fit md:w-44 px-1 md:px-0">
        <CategoryRibbon 
          title={title} 
          slug={slug} 
          subtitle={subtitle} 
          vouchers={vouchers} 
          description={description} 
        />
      </div>

      {/* Carousel Wrapper: min-w-0 is vital for flexbox carousels */}
      <div className="w-full min-w-0">
        <Carousel>
          {validProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Carousel>
      </div>
    </section>
  );
};


export default CategoryRow;
