"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { useCart } from "@/store/useCart";
import { Leaf, Minus, Plus, ShieldCheck } from "lucide-react";
import Button from "./ui/Button";
import { Product } from "@/types";

export default function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 text-[#3d2b1f]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT: ORGANIC IMAGE GALLERY */}
        <div className="relative group">
          <div className="aspect-square relative overflow-hidden rounded-[4rem] bg-white border border-[#e5dfd3] shadow-sm transition-all duration-1000 group-hover:shadow-[0_20px_60px_rgba(163,87,58,0.1)] group-hover:border-[#a3573a]/20">
            <Image
              src={urlFor(product.mainImage).width(1000).url()}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
              priority
            />
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#df9152]/10 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-[2s]" />
        </div>

        {/* RIGHT: ARTISANAL CONTENT */}
        <div className="space-y-10 lg:pl-10">
          <header>
            <div className="flex items-center gap-3 mb-4">
              <Leaf size={14} className="text-[#a3573a] opacity-70" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a3573a]">
                {product.category?.title || "Handcrafted Piece"}
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
            "{product.description || "Designed for the soulful home, this piece is thoughtfully handcrafted with artisanal precision in Kathmandu."}"
          </section>

          {/* QUANTITY & BUTTON */}
          <div className="space-y-8 pt-8 border-t border-[#e5dfd3] border-dotted">
            <div className="flex items-center gap-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a89f91]">Quantity</span>
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
            </div>

            {/* BUTTON: Changed to font-sans font-bold for a clear, modern action */}
            <Button
              onClick={handleAddToCart}
              fullWidth
              size="xl"
              variant={isSuccess ? "accent" : "primary"}
              className={isSuccess ? "shadow-[0_20px_40px_rgba(163,87,58,0.3)]" : "hover:shadow-[0_20px_40px_rgba(163,87,58,0.2)]"}
              leftIcon={isSuccess ? <ShieldCheck size={18} /> : undefined}
            >
              {isSuccess ? "Added to home" : "Add to Cart"}
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
