"use client";

import { urlFor } from "../lib/sanity";
import Link from "next/link";
import { Product, BusinessMetaData } from "@/types";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { trackEvent } from "./MetaPixel";
import { useCart } from "@/store/useCart";
import { useUIStore } from "@/store/useUIStore";
import { useState } from "react";

const ProductCard = ({
  product,
  variant = "default",
  accentColor = "accent",
  businessMetaData,
  discountedPrice,
}: {
  product: Product;
  variant?: "default" | "ribbon" | "campaign";
  accentColor?: string;
  businessMetaData?: BusinessMetaData | null;
  discountedPrice?: number;
}) => {
  const { addItem } = useCart();
  const { setViewingProduct, setIsCheckoutDrawerOpen } = useUIStore();
  const [quantity, setQuantity] = useState(1);

  // Pre-filled WhatsApp link
  const whatsappNumber = businessMetaData?.whatsapp || "undefined_setmetadata_in_studio";
  const whatsappMessage = encodeURIComponent(
    `Hi ${businessMetaData?.businessName || "undefined_setmetadata_in_studio"}! I'm interested in buying ${product.title}.`,
  );
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  // Messenger link
  const messengerLink = businessMetaData?.messengerUrl || "undefined_setmetadata_in_studio";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-soft bg-surface w-full h-full shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1">
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          setViewingProduct(product);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setViewingProduct(product);
          }
        }}
        className="block transition-transform duration-200 ease-out touch-manipulation cursor-pointer focus:outline-none"
      >
        <div 
          className="aspect-square bg-app overflow-hidden relative"
        >
          {product.mainImage ? (
            <>
              {/* BLURRED BACKDROP */}
              <img
                loading="lazy"
                src={urlFor(product.mainImage).width(100).blur(2).format("webp").url()}
                alt=""
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110 pointer-events-none"
              />
              {/* SHARP CENTERED IMAGE */}
              <img
                loading="lazy"
                src={urlFor(product.mainImage).width(400).format("webp").url()}
                alt={product.title}
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                className="relative z-10 object-contain w-full h-full transition-transform duration-[1.5s] group-hover:scale-105 select-none pointer-events-none"
              />
              {/* TRANSPARENT SHIELD OVERLAY (Touch point for clicks, but file is hidden) */}
              <div 
                className="absolute inset-0 z-20 cursor-pointer" 
                onContextMenu={(e) => e.preventDefault()}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-soft/10 text-label/40">
              <ShoppingBag size={48} strokeWidth={0.5} />
              <p className="text-[10px] uppercase tracking-widest mt-4">Photo Pending</p>
            </div>
          )}
          
          {product.stock !== undefined &&
            product.stock <= 0 &&
            variant !== "ribbon" && (
              <div className="absolute top-2 right-2 bg-app border border-divider text-heading px-1 py-0.5 rounded-sm type-label shadow-sm z-20 scale-[0.6] origin-top-right">
                <span className="text-action font-bold">SOLD</span>
              </div>
            )}

          {product.adminPreview && (
            <div className="absolute top-2 left-2 bg-action text-app px-1.5 py-0.5 rounded-sm text-[8px] font-black tracking-[0.2em] z-20 shadow-lg animate-pulse uppercase">
              Preview
            </div>
          )}

          {variant === "ribbon" && (
            <div
              className="absolute top-0 right-0 h-full w-6 z-30 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: accentColor }}
            >
              <div className="rotate-90 text-app type-label whitespace-nowrap text-[8px]">
                NPR{" "}
                <span className="text-[10px] ml-1">
                  {product.price}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-1 border-b border-soft/30">
          <h3 className="type-product text-heading group-hover:text-action transition-colors line-clamp-1 uppercase text-[6px] md:text-[7px] leading-tight tracking-[0.2em]">
            {product.title}
          </h3>
          {discountedPrice && discountedPrice < product.price ? (
            <div className="flex items-baseline gap-1 mt-0.5">
              <p className="type-label text-description text-[7px] line-through decoration-action/40 decoration-1">
                Rs. {product.price}
              </p>
              <p className="type-label text-action text-[9px] font-black">
                Rs. {discountedPrice}
              </p>
            </div>
          ) : (
            <p className="type-label text-action text-[8px] mt-0.5 font-bold">
              Rs. {product.price}
            </p>
          )}
        </div>
      </div>

      {/* ACTION DECK: Vertically Stacked Row */}
      <div className="flex flex-col w-full border-t border-soft/30 mt-auto">
        {/* ADD TO BAG */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const cleanId = product._id.replace("drafts.", "");
            addItem(product, quantity);
            setIsCheckoutDrawerOpen(true);
            trackEvent("AddToCart", {
              content_name: product.title,
              content_category: product.category?.title,
              content_ids: [cleanId],
              content_type: "product",
              value: product.price * quantity,
              currency: "NPR",
              brand: businessMetaData?.businessName || "undefined_setmetadata_in_studio",
              availability: (product.stock ?? 0) > 0 ? "in stock" : "available for order",
            });
          }}
          className="w-full flex items-center justify-center gap-2 p-3 bg-action text-white hover:bg-action/90 transition-colors border-b border-soft/30"
          title="Add to Bag"
        >
          <ShoppingBag size={16} strokeWidth={1.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Add to Bag</span>
        </button>

        {/* WHATSAPP */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-full flex items-center justify-center gap-2 p-3 bg-success/10 hover:bg-success hover:text-heading transition-colors border-b border-soft/30 group"
          title="WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="fill-heading group-hover:fill-heading transition-colors"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest text-heading group-hover:text-heading transition-colors">WhatsApp</span>
        </a>

        {/* MESSENGER */}
        <a
          href={messengerLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-full flex items-center justify-center gap-2 p-3 bg-action/10 hover:bg-action hover:text-surface transition-colors group"
          title="Messenger"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="fill-heading group-hover:fill-surface transition-colors"
          >
            <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.303 2.254.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.12l-3.058-3.268-5.965 3.268 6.556-6.974 3.125 3.268 5.898-3.268-6.556 6.974z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest text-heading group-hover:text-surface transition-colors">Messenger</span>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
