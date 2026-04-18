import { urlFor } from "@/lib/sanity";
import { Product } from "@/types";
import { ClipboardList } from "lucide-react";

interface PriceListTableProps {
  products: Product[];
}

export default function PriceListTable({ products }: PriceListTableProps) {
  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const categoryTitle = product.category?.title || "Other";
    if (!acc[categoryTitle]) acc[categoryTitle] = [];
    acc[categoryTitle].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const categories = Object.keys(groupedProducts).sort();

  return (
    <div className="space-y-24">
      {categories.map((cat) => (
        <section key={cat} className="page-break-inside-avoid">
          {/* Category-specific dividers are removed for a continuous collection flow */}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {groupedProducts[cat].map((product) => (
              <div key={product._id} className="group space-y-4 page-break-inside-avoid">
                {/* Image Section: Much bigger preview */}
                <div className="aspect-square relative overflow-hidden rounded-2xl bg-white border border-[#e5dfd3] flex items-center justify-center p-4 transition-all duration-500 group-hover:shadow-md">
                   {product.mainImage ? (
                     <img 
                       src={urlFor(product.mainImage).width(400).url()} 
                       alt={product.title}
                       className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
                     />
                   ) : (
                     <div className="text-[#e5dfd3]">
                       <ClipboardList size={48} />
                     </div>
                   )}
                </div>

                {/* Info Section */}
                <div className="space-y-1.5 px-1">
                  <div className="flex flex-col">
                    <h3 className="text-[11px] md:text-xs font-bold text-[#3d2b1f] uppercase tracking-wider line-clamp-1">
                      {product.title}
                    </h3>
                    {product.stock !== undefined && product.stock <= 0 && (
                      <span className="text-[8px] font-bold uppercase text-[#a3573a] italic tracking-tighter">
                        Made to Order
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="font-sans font-extrabold text-[#a3573a] text-sm md:text-base">
                      Rs. {product.price.toLocaleString()}
                    </div>
                    <div className="text-[9px] md:text-[10px] text-[#a89f91] font-medium tracking-tight">
                      {product.length && product.breadth && product.height 
                        ? `${product.length}" × ${product.breadth}" × ${product.height}"`
                        : "Custom Dimensions"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
