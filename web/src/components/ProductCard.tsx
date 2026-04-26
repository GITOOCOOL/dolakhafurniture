"use client";

import { urlFor } from "../lib/sanity";
import Link from "next/link";
import { Product } from "@/types";
import { ShoppingBag } from "lucide-react";
import { useToast } from "./Toast";
import { trackEvent } from "./MetaPixel";
import { useCart } from "@/store/useCart";

const ProductCard = ({
  product,
  variant = "default",
  accentColor = "accent",
}: {
  product: Product;
  variant?: "default" | "ribbon";
  accentColor?: string;
}) => {
  const { showToast } = useToast();
  const { addItem } = useCart();
  // Pre-filled WhatsApp link
  const whatsappNumber = "61410765748";
  const whatsappMessage = encodeURIComponent(
    `Hi Dolakha! I'm interested in buying ${product.title}.`,
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Messenger link
  const messengerLink = `https://m.me/224061751418570?ref=${encodeURIComponent(product.title)}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-soft bg-surface w-full h-full shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1">
      <Link
        href={`/product/${product.slug}`}
        className="flex flex-col h-full transition-transform duration-200 ease-out touch-manipulation"
      >
        <div className="aspect-square bg-app overflow-hidden relative">
          <img
            loading="lazy"
            src={urlFor(product.mainImage).width(400).format("webp").url()}
            alt={product.title}
            className="object-contain w-full h-full transition-transform duration-[1.5s] group-hover:scale-105"
          />
          {product.stock !== undefined &&
            product.stock <= 0 &&
            variant !== "ribbon" && (
              <div className="absolute top-2 right-2 bg-app border border-divider text-heading px-3 py-1.5 rounded-lg type-label shadow-sm z-20 flex flex-col items-center gap-0.5 text-center leading-tight">
                <span className="text-action">OUT OF STOCK</span>
                <span className="text-heading text-[6px] md:text-[7px] normal-case font-extrabold italic">
                  will be made after order
                </span>
              </div>
            )}

          {variant === "ribbon" && (
            <div
              className="absolute top-0 right-0 h-full w-8 md:w-10 z-30 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: accentColor }}
            >
              <div className="rotate-90 text-app type-label whitespace-nowrap">
                NPR{" "}
                <span className="text-[14px] md:text-[16px] ml-1">
                  {product.price}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 flex-1 flex flex-col gap-0.5 overflow-hidden">
          <h3 className="type-product text-heading group-hover:text-action transition-colors line-clamp-2 uppercase">
            {product.title}
          </h3>
          {variant !== "ribbon" && (
            <p className="type-label text-action">
              Rs. {product.price}
            </p>
          )}
        </div>
      </Link>

      {/* REFINED COMMERCE ACTIONS: Two-Tier System */}
      <div className="flex flex-col p-2 pt-0 gap-3 mt-auto">
        {/* ROW 1: Communication Hub */}
        <div className="flex items-center gap-2">
            {/* WHATSAPP BUTTON */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                trackEvent("Contact", {
                  method: "whatsapp",
                  product: product.title,
                });
              }}
              className="flex-1 h-8 flex items-center justify-center rounded-xl bg-success/5 border border-success/20 hover:bg-success hover:text-white transition-all duration-300 group/wa"
              title="WhatsApp Inquiry"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="fill-success group-hover/wa:fill-white transition-colors"
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
                trackEvent("Contact", {
                  method: "messenger",
                  product: product.title,
                });
              }}
              className="flex-1 h-8 flex items-center justify-center rounded-xl bg-action/5 border border-action/20 hover:bg-action hover:text-white transition-all duration-300 group/ms"
              title="Messenger Inquiry"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="fill-action group-hover/ms:fill-white transition-colors"
              >
                <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.303 2.254.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.12l-3.058-3.268-5.965 3.268 6.556-6.974 3.125 3.268 5.898-3.268-6.556 6.974z" />
              </svg>
            </a>
          </div>

        {/* ROW 2: Primary Actions */}
        <div className="flex items-center justify-center w-full">
          {/* ADD TO CART BUTTON */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const cleanId = product._id.replace("drafts.", "");
              addItem(product, 1);
              const thumbUrl = urlFor(product.mainImage).width(120).height(120).fit('crop').url();
              showToast(`1 x ${product.title} added`, thumbUrl);
              trackEvent("AddToCart", {
                content_name: product.title,
                content_category: product.category?.title,
                content_ids: [cleanId],
                content_type: "product",
                value: product.price,
                currency: "NPR",
                brand: "Dolakha Furniture",
                availability:
                  (product.stock ?? 0) > 0 ? "in stock" : "available for order",
              });
            }}
            className="w-full h-8 flex items-center justify-center gap-2 rounded-xl bg-action shadow-md active:translate-y-[1px] hover:bg-heading transition-all duration-300 group/cart"
            title="झोला मा हाल्नुहोस"
          >
            <ShoppingBag size={13} strokeWidth={2.5} className="text-white" />
            <span className="text-[8.5px] font-sans font-bold uppercase tracking-tight text-white">
              झोला मा हाल्नुहोस
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
