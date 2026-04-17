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
          <div className="flex items-center gap-4 mb-8">
            <ClipboardList size={18} className="text-[#a3573a]" />
            <h2 className="text-3xl font-serif italic text-[#3d2b1f]">{cat}</h2>
            <div className="flex-1 h-[1px] bg-[#e5dfd3]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#3d2b1f]/10 text-[10px] uppercase tracking-widest font-bold text-[#a89f91]">
                  <th className="py-4 px-2 w-[80px] text-center">Preview</th>
                  <th className="py-4 px-2 w-[35%]">Item Description</th>
                  <th className="py-4 px-2">Material</th>
                  <th className="py-4 px-2 text-right">Dimensions (in)</th>
                  <th className="py-4 px-2 text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {groupedProducts[cat].map((product) => (
                  <tr key={product._id} className="border-b border-[#e5dfd3]/50 hover:bg-white/50 transition-colors">
                    <td className="py-4 px-2">
                      {product.mainImage && (
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden bg-white border border-[#e5dfd3] flex items-center justify-center mx-auto">
                          <img 
                            src={urlFor(product.mainImage).width(100).url()} 
                            alt={product.title}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-5 px-2">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-[#3d2b1f] capitalize">{product.title}</span>
                        {product.stock !== undefined && product.stock <= 0 && (
                          <span className="text-[9px] font-bold uppercase text-[#a3573a] italic tracking-wider">
                            Made to Order
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-2 text-[#a89f91] font-light">
                      {product.material || "Handcrafted"}
                    </td>
                    <td className="py-5 px-2 text-right font-sans lining-nums">
                      {product.length && product.breadth && product.height 
                        ? `${product.length}" x ${product.breadth}" x ${product.height}"`
                        : "Custom Size"}
                    </td>
                    <td className="py-5 px-2 text-right">
                      <span className="font-sans font-bold text-[#a3573a]">
                        Rs. {product.price.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
