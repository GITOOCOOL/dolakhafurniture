import { urlFor } from "../lib/sanity";
import Link from "next/link";

const ProductCard = ({ product }: { product: any }) => {
  return (
    /* Removed transition-all from parent to keep it lightweight */
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white w-full h-full shadow-sm hover:shadow-md">
      <Link 
        href={`/product/${product.slug}`} 
        /* 
          - touch-manipulation: Removes the 300ms tap delay on iPhone
          - active:scale-95: Shrinks the card slightly on touch
          - duration-75: Makes the "pop" feel instant and mechanical 
        */
        className="flex flex-col h-full active:scale-[0.97] transition-transform duration-75 ease-out touch-manipulation"
      >
        <div className="aspect-[4/5] bg-stone-100 overflow-hidden">
           <img 
             src={urlFor(product.mainImage).width(500).url()} 
             alt={product.title} 
             className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
           />
        </div>
        <div className="p-3 md:p-5 flex-1 flex flex-col">
          <h3 className="text-[11px] md:text-sm font-black uppercase tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
            {product.title}
          </h3>
          <p className="mt-auto text-sm md:text-lg font-black text-stone-900">
            Nrs. {product.price}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
