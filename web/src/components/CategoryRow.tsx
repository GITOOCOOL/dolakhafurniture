import CategoryRibbon from "./CategoryRibbon";
import Carousel from "./Carousel";
import ProductCard from "./ProductCard";
import type { Product } from "../types/product";

type CategoryRowProps = {
  title: string;
  slug: string;
  products: Product[];
  autoScroll?: boolean;
};

const CategoryRow = ({ title, slug, products, autoScroll = false }: CategoryRowProps) => {
  if (!products.length) return null;
  return (
    <section className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start w-full overflow-visible">
      {/* Ribbon: Spans full width on mobile, side-aligned on desktop */}
      <div className="flex-shrink-0 w-full lg:w-auto px-1 md:px-0">
        <CategoryRibbon title={title} slug={slug} />
      </div>

      {/* Carousel Wrapper: min-w-0 is vital for flexbox carousels */}
      <div className="w-full min-w-0">
        <Carousel>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryRow;
