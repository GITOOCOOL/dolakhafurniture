"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { useCart } from "@/store/useCart";
import { Leaf, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import Button from "./ui/Button";
import { Product } from "@/types";
import { trackEvent } from "./MetaPixel";
import { useToast } from "./Toast";
import { useEffect } from "react";

export default function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  // Tracking: ViewContent and AddToCart
  useEffect(() => {
    if (product) {
      const cleanId = product._id.replace("drafts.", "");
      trackEvent("ViewContent", {
        content_name: product.title,
        content_category: product.category?.title,
        content_ids: [cleanId],
        content_type: "product",
        value: product.price,
        currency: "NPR",
        brand: "Dolakha Furniture",
        availability: (product.stock ?? 0) > 0 ? "in stock" : "available for order"
      });
    }
  }, [product]);

  // Combined Gallery: mainImage + visible gallery images
  const allImages = [
    product.mainImage,
    ...(product.images?.filter((img) => img.isVisible) || [])
  ];

  const [selectedImage, setSelectedImage] = useState<any>(product.mainImage);
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product) return;
    const cleanId = product._id.replace("drafts.", "");
    addItem(product, quantity);
    trackEvent("AddToCart", {
      content_name: product.title,
      content_category: product.category?.title,
      content_ids: [cleanId],
      content_type: "product",
      value: Number(product.price * quantity) || 0,
      currency: "NPR",
      brand: "Dolakha Furniture",
      availability: (product.stock ?? 0) > 0 ? "in stock" : "available for order"
    });
    setIsSuccess(true);
    let thumbUrl = "";
    try {
      // Prioritize mainImage, fallback to first gallery image if needed
      const imgSource = product.mainImage || (product.images && product.images.length > 0 ? product.images[0] : null);
      
      if (imgSource) {
        thumbUrl = urlFor(imgSource).width(120).height(120).fit('crop').url();
      }
    } catch (e) {
      console.error("Toast Image Error", e);
    }
    
    showToast(`${quantity} x ${product.title} added`, thumbUrl);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 text-heading">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* LEFT: ORGANIC IMAGE GALLERY */}
        <div className="space-y-6">
          <div className="relative group">
            <div className="aspect-square relative bg-app rounded-[3rem] overflow-hidden border border-divider shadow-sm transition-all duration-1000 group-hover:shadow-[0_20px_60px_rgba(163,87,58,0.1)] group-hover:border-action/20">
              <Image
                src={urlFor(selectedImage).width(1000).format("webp").url()}
                alt={product.title}
                fill
                className="object-contain transition-transform duration-[1.5s] group-hover:scale-105"
                priority
              />
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-action/10 [120px] opacity-0 group-hover:opacity-100 transition-opacity duration-[2s]" />
          </div>

          {/* THUMBNAILS */}
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border transition-all ${
                    selectedImage === img
                      ? "border-action ring-2 ring-accent/20"
                      : "border-divider hover:border-action/50"
                  }`}
                >
                  <Image
                    src={urlFor(img).width(300).format("webp").url()}
                    alt={`${product.title} gallery ${index}`}
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
              <Leaf size={14} className="text-action opacity-70" />
              <p className="text-[10px] font-sans font-extrabold text-action uppercase tracking-[0.2em]">
                {product.category?.title || "Signature Piece"}
              </p>
            </div>

            <h1 className="type-section text-heading mb-4 leading-tight">
              {product.title}
            </h1>

            <p className="text-3xl font-sans font-extrabold text-action tracking-tighter mb-8">
              Rs. {product.price.toLocaleString()}
            </p>
          </header>

          <h2 className="text-[10px] font-sans font-bold uppercase tracking-widest text-description mb-4">About this piece</h2>
          <p className="text-md text-heading leading-relaxed italic max-w-lg">
            "{product.description || "Every piece of Dolakha furniture is handcrafted with passion, blending traditional Nepali artistry with modern functional design."}"
          </p>

          {/* SPECIFICATIONS */}
          {(product.material ||
            product.length ||
            product.breadth ||
            product.height) && (
            <div className="space-y-4 pt-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-action">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                {product.material && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase text-description">
                      Material
                    </span>
                    <span className="font-medium">{product.material}</span>
                  </div>
                )}
                {(product.length || product.breadth || product.height) && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase text-description">
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
          <div className="pt-8 border-t border-divider border-dashed space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-app border border-divider rounded-none flex items-center justify-center text-action">
                <Truck size={18} strokeWidth={1.5} />
              </div>
              <p className="text-[10px] font-sans font-bold text-heading uppercase tracking-widest">Free Shipping Inside Valley</p>
            </div>

            <div className="flex items-center gap-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-description">
                Quantity
              </span>
              <div className="flex items-center border border-divider rounded-full px-2 py-2 gap-4 bg-app shadow-inner">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 min-h-0 text-description hover:text-action"
                  leftIcon={<Minus size={16} />}
                />

                <span className="font-sans font-bold text-lg w-6 text-center text-heading">
                  {quantity}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 min-h-0 text-description"
                  leftIcon={<Plus size={16} />}
                />
              </div>
            </div>

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

            <p className="text-center text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-description">
              * Locally Sourced • Hand-Finished • Delivered in Kathmandu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
