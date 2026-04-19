"use client";

import { urlFor } from "../lib/sanity";
import Link from "next/link";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useToast } from "./Toast";
import { trackEvent } from "./MetaPixel";
import { useCart } from "@/store/useCart";

const ProductCard = ({ 
  product, 
  variant = 'default',
  accentColor = '#a3573a'
}: { 
  product: Product;
  variant?: 'default' | 'ribbon';
  accentColor?: string;
}) => {
  const { showToast } = useToast();
  const { addItem } = useCart();
  // Pre-filled WhatsApp link
  const whatsappNumber = "61410765748"; 
  const whatsappMessage = encodeURIComponent(`Hi Dolakha! I'm interested in buying ${product.title}.`);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Messenger link
  const messengerLink = `https://m.me/224061751418570?ref=${encodeURIComponent(product.title)}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-[#e5dfd3] bg-white w-full h-full shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1">
      
      <Link 
        href={`/product/${product.slug}`} 
        className="flex flex-col h-full transition-transform duration-200 ease-out touch-manipulation"
      >
        <div className="aspect-square bg-[#fdfaf5] overflow-hidden relative">
           <img 
             loading="lazy"
             src={urlFor(product.mainImage).width(400).format("webp").url()} 
             alt={product.title} 
             className="object-contain w-full h-full transition-transform duration-[1.5s] group-hover:scale-105" 
           />
            {product.stock !== undefined && product.stock <= 0 && variant !== 'ribbon' && (
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md border border-[#e5dfd3] text-[#3d2b1f] px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-widest shadow-sm z-20 flex flex-col items-center gap-0.5 text-center leading-tight">
                <span className="text-[#a3573a]">Stock Out</span>
                <span className="opacity-70 text-[6px] md:text-[7px] normal-case font-medium italic">will be made after order</span>
              </div>
            )}

            {variant === 'ribbon' && (
              <div className="absolute top-0 right-0 h-full w-8 md:w-10 z-30 flex items-center justify-center shadow-[left_4px_10px_rgba(0,0,0,0.1)]" style={{ backgroundColor: accentColor }}>
                <div className="rotate-90 text-white font-bold text-[10px] md:text-[12px] whitespace-nowrap tracking-[0.2em] uppercase">
                  NPR <span className="text-[14px] md:text-[16px] ml-1">{product.price}</span>
                </div>
              </div>
            )}
        </div>

        <div className="p-3 flex-1 flex flex-col gap-1 overflow-hidden">
          <h3 className="text-[10px] md:text-[12px] font-sans font-extrabold text-[#3d2b1f] group-hover:text-[#a3573a] transition-colors truncate uppercase tracking-wider">
            {product.title}
          </h3>
          {variant !== 'ribbon' && (
            <p className="text-[8px] md:text-[9px] font-sans font-semibold text-[#a3573a]">
              Rs. {product.price}
            </p>
          )}
        </div>
      </Link>

      {/* REFINED COMMERCE ROW: Muted Tints + Soft Elevation */}
      <div className="flex items-center justify-around p-2 pt-0 gap-3 mt-auto">
        {/* WHATSAPP BUTTON */}
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            trackEvent("Contact", { method: "whatsapp", product: product.title });
          }}
          className="flex-1 h-8 md:h-10 flex items-center justify-center rounded-lg bg-[#25D366]/5 border border-[#25D366]/20 shadow-sm active:translate-y-[1px] transition-all duration-150"
          title="WhatsApp"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            className="w-[18px] h-[18px] md:w-[22px] md:h-[22px] fill-[#128C7E] stroke-[#128C7E] stroke-[0.5]"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
        
        {/* MESSENGER BUTTON */}
        <a 
          href={messengerLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            trackEvent("Contact", { method: "messenger", product: product.title });
          }}
          className="flex-1 h-8 md:h-10 flex items-center justify-center rounded-lg bg-[#0084FF]/5 border border-[#0084FF]/20 shadow-sm active:translate-y-[1px] transition-all duration-150"
          title="Messenger"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="22" 
            height="22" 
            viewBox="0 0 24 24"
            className="w-[18px] h-[18px] md:w-[22px] md:h-[22px] fill-[#0073e6] stroke-[#0073e6] stroke-[0.5]"
          >
            <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.303 2.254.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.12l-3.058-3.268-5.965 3.268 6.556-6.974 3.125 3.268 5.898-3.268-6.556 6.974z" />
          </svg>
        </a>

        {/* CART BUTTON */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const cleanId = product._id.replace("drafts.", ""); 
            addItem(product, 1);
            showToast(`1 x ${product.title} added to cart`);
            trackEvent("AddToCart", { 
              content_name: product.title, 
              content_category: product.category?.title,
              content_ids: [cleanId],
              content_type: "product",
              value: product.price, 
              currency: "NPR",
              brand: "Dolakha Furniture",
              availability: (product.stock ?? 0) > 0 ? "in stock" : "available for order"
            });
          }}
          className="flex-1 h-8 md:h-10 flex items-center justify-center gap-2 rounded-lg bg-[#3d2b1f] shadow-sm active:translate-y-[1px] hover:bg-[#a3573a] transition-all duration-150"
          title="Add to Cart"
        >
          <ShoppingCart size={20} strokeWidth={2} className="text-white" />
          <span className="text-[10px] font-bold text-white tracking-tighter tracking-widest">+1</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
