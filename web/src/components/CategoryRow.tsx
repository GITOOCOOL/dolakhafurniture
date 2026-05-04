import CategoryRibbon from "./CategoryRibbon";
import Carousel from "./Carousel";
import ProductCard from "./ProductCard";
import type { Product, BusinessMetaData, Voucher } from "../types";

type CategoryRowProps = {
  title: string;
  slug: string;
  products: Product[];
  autoScroll?: boolean;
  subtitle?: string;
  vouchers?: Voucher[];
  description?: string;
  businessMetaData?: BusinessMetaData | null;
};

const CategoryRow = ({
  title,
  slug,
  products,
  autoScroll = false,
  subtitle,
  vouchers,
  description,
  businessMetaData,
}: CategoryRowProps) => {
  const validProducts = products?.filter(Boolean) || [];

  if (!validProducts.length) return null;
  return (
    <section className="flex flex-col gap-4 w-full overflow-visible">
      {/* Ribbon: Spans full width as a banner header */}
      <div className="flex-shrink-0 w-full px-1">
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
          {validProducts.map((product) => {
            // Calculate best discount for this product card
            let discountedPrice = product.price;
            if (vouchers && vouchers.length > 0) {
              const bestVoucher = vouchers.reduce((best, current) => {
                const currentVal = current.discountType === 'percentage' 
                  ? product.price * (current.discountValue / 100) 
                  : current.discountValue;
                const bestVal = best.discountType === 'percentage' 
                  ? product.price * (best.discountValue / 100) 
                  : best.discountValue;
                return currentVal > bestVal ? current : best;
              }, vouchers[0]);

              if (bestVoucher.discountType === 'percentage') {
                discountedPrice = product.price - (product.price * (bestVoucher.discountValue / 100));
              } else {
                discountedPrice = Math.max(0, product.price - bestVoucher.discountValue);
              }
            }

            return (
              <ProductCard 
                key={product._id} 
                product={product} 
                businessMetaData={businessMetaData} 
                discountedPrice={Math.floor(discountedPrice)}
              />
            );
          })}
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryRow;
