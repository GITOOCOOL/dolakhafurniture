"use client";

import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface CategorizedProductGridProps {
  products: Product[];
}

export default function CategorizedProductGrid({ products }: CategorizedProductGridProps) {
  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const categoryName = product.category?.title || "Other";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Get sorted category names
  const categories = Object.keys(groupedProducts).sort();

  return (
    <div className="space-y-24">
      {categories.map((category) => (
        <section key={category} className="space-y-12">
          {/* Category Header */}
          <div className="relative">
            <h2 className="text-3xl md:type-section text-heading relative z-10">
              {category}<span className="text-action">.</span>
            </h2>
            <div className="absolute -bottom-4 left-0 w-24 h-1 bg-action/20 rounded-full" />
            <p className="type-label text-label mt-4">
              {groupedProducts[category].length} {groupedProducts[category].length === 1 ? 'Piece' : 'Pieces'} in Collection
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {groupedProducts[category].map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      ))}

      {categories.length === 0 && (
        <div className="text-center py-24 border-t border-soft border-dotted">
          <p className="text-label italic font-serif text-2xl">
            "No products found in this selection."
          </p>
        </div>
      )}
    </div>
  );
}
