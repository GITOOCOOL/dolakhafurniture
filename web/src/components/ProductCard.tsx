import { urlFor } from "../lib/sanity";
import Link from "next/link";

const ProductCard = ({ product }: { product: any }) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#e5dfd3] bg-white w-full h-full shadow-sm hover:shadow-[0_20px_50px_rgba(163,87,58,0.1)] transition-shadow duration-700">
      <Link 
        href={`/product/${product.slug}`} 
        className="flex flex-col h-full transition-transform duration-200 ease-out touch-manipulation"
      >
        <div className="aspect-[4/5] bg-[#fdfaf5] overflow-hidden">
           <img 
             src={urlFor(product.mainImage).width(500).url()} 
             alt={product.title} 
             className="object-cover w-full h-full transition-transform duration-[1.5s] group-hover:scale-110 group-hover:sepia-[0.1]" 
           />
        </div>

        <div className="p-5 md:p-7 flex-1 flex flex-col gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a3573a] opacity-80">
            {product.category?.title || "Handcrafted Piece"}
          </span>

          {/* Title: Stays Serif Italic for the "Boho" look */}
          <h3 className="text-lg md:text-xl font-serif italic font-medium text-[#3d2b1f] group-hover:text-[#a3573a] transition-colors line-clamp-1 leading-tight">
            {product.title}
          </h3>
          
          {/* Price: Swapped to Standard Sans-Serif (font-sans) for maximum readability */}
          <p className="mt-auto text-sm md:text-base font-sans font-semibold text-[#a89f91] tracking-tight">
            Rs. {product.price}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
