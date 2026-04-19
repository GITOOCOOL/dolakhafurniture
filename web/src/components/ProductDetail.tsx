"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { useCart } from "@/store/useCart";
import { Leaf, Minus, Plus, ShieldCheck } from "lucide-react";
import Button from "./ui/Button";
import { Product } from "@/types";
import { trackEvent } from "./MetaPixel";
import { useToast } from "./Toast";
import { useEffect } from "react";

export default function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    trackEvent("ViewContent", {
      content_name: product.title,
      content_category: product.category?.title,
      content_ids: [product._id],
      content_type: "product",
      value: product.price,
      currency: "NPR",
    });
  }, [product]);

  // Combined Gallery: mainImage + visible gallery images
  const allImages = [
    product.mainImage,
    ...(product.images?.filter((img) => img.isVisible) || [])
  ];

  const [selectedImage, setSelectedImage] = useState<any>(product.mainImage);
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
    trackEvent("AddToCart", {
      content_name: product.title,
      content_ids: [product._id],
      content_type: "product",
      value: Number(product.price * quantity) || 0,
      currency: "NPR",
    });
    setIsSuccess(true);
    showToast(`${quantity} x ${product.title} added to cart`);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 text-[#3d2b1f]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* LEFT: ORGANIC IMAGE GALLERY */}
        <div className="space-y-6">
          <div className="relative group">
            <div className="aspect-square relative overflow-hidden rounded-[3rem] bg-white border border-[#e5dfd3] shadow-sm transition-all duration-1000 group-hover:shadow-[0_20px_60px_rgba(163,87,58,0.1)] group-hover:border-[#a3573a]/20">
              <Image
                src={urlFor(selectedImage).width(1000).url()}
                alt={product.title}
                fill
                className="object-contain transition-transform duration-[1.5s] group-hover:scale-105"
                priority
              />
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#df9152]/10 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-[2s]" />
          </div>

          {/* THUMBNAILS */}
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === img
                      ? "border-[#a3573a] scale-95"
                      : "border-[#e5dfd3] opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={urlFor(img).width(200).url()}
                    alt={`${product.title} gallery ${idx}`}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT:  CONTENT */}
        <div className="space-y-10 lg:pl-10">
          <header>
            <div className="flex items-center gap-3 mb-4">
              <Leaf size={14} className="text-[#a3573a] opacity-70" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a3573a]">
                {product.category?.title || "Furniture Piece"}
              </p>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif italic font-medium text-[#3d2b1f] leading-[1.1] mb-6">
              {product.title}
            </h1>

            {/* PRICE: Changed to font-sans for better readability */}
            <p className="text-3xl font-sans font-bold text-[#a3573a] tracking-tight">
              Rs. {product.price}
            </p>
          </header>

          <section className="text-[#a89f91] leading-relaxed font-light italic text-xl max-w-lg border-l-2 border-[#e5dfd3] pl-6 py-2">
            "
            {product.description ||
              "Designed for your home, this piece is made with care in Kathmandu."}
            "
          </section>

          {/* SPECIFICATIONS */}
          {(product.material ||
            product.length ||
            product.breadth ||
            product.height) && (
            <div className="space-y-4 pt-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#a3573a]">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                {product.material && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase text-[#a89f91] opacity-60">
                      Material
                    </span>
                    <span className="font-medium">{product.material}</span>
                  </div>
                )}
                {(product.length || product.breadth || product.height) && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase text-[#a89f91] opacity-60">
                      Dimensions
                    </span>
                    <span className="font-sans font-semibold">
                      {[product.length, product.breadth, product.height]
                        .filter(Boolean)
                        .join(" x ")}{" "}
                      in
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QUANTITY & BUTTON */}
          <div className="space-y-8 pt-8 border-t border-[#e5dfd3] border-dotted">
            <div className="flex items-center gap-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a89f91]">
                Quantity
              </span>
              <div className="flex items-center border border-[#e5dfd3] rounded-full px-2 py-2 gap-4 bg-white shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 min-h-0 text-[#a89f91]"
                  leftIcon={<Minus size={16} />}
                />

                <span className="font-sans font-bold text-lg w-6 text-center">
                  {quantity}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 min-h-0 text-[#a89f91]"
                  leftIcon={<Plus size={16} />}
                />
              </div>
              {product.stock !== undefined && product.stock <= 0 && (
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#a3573a] animate-pulse">
                  Out of Stock — Get it made after you order
                </div>
              )}
            </div>

            {/* BUTTON: Changed to font-sans font-bold for a clear, modern action */}
            <Button
              onClick={handleAddToCart}
              fullWidth
              size="xl"
              variant={isSuccess ? "accent" : "primary"}
              className={
                isSuccess
                  ? "shadow-[0_20px_40px_rgba(163,87,58,0.3)]"
                  : "hover:shadow-[0_20px_40px_rgba(163,87,58,0.2)]"
              }
              leftIcon={isSuccess ? <ShieldCheck size={18} /> : undefined}
            >
              {isSuccess
                ? "Added to home"
                : product.stock !== undefined && product.stock <= 0
                  ? "Order Custom Piece"
                  : "Add to Cart"}
            </Button>

            <p className="text-center text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-[#a89f91] opacity-60">
              * Locally Sourced • Hand-Finished • Delivered in Kathmandu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
