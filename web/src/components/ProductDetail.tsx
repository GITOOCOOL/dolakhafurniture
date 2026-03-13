"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { useCart } from "@/store/useCart";

export default function ProductDetail({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT: NEON IMAGE GALLERY */}
        <div className="relative group">
          <div className="aspect-square relative overflow-hidden rounded-[2.5rem] bg-white border border-stone-200 shadow-sm transition-all duration-700 group-hover:shadow-[0_0_50px_rgba(234,88,12,0.15)]">
            <Image
              src={urlFor(product.mainImage).width(1000).url()}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
          {/* Subtle Accent Glow */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </div>

        {/* RIGHT: CONTENT */}
        <div className="space-y-10">
          <header>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-4">
              {product.category?.title || "Handcrafted Piece"}
            </p>
            <h1 className="text-6xl font-black uppercase tracking-tighter text-stone-900 leading-[0.9]">
              {product.title}
            </h1>
            <p className="text-3xl font-serif italic text-stone-400 mt-6">
              Nrs. {product.price}
            </p>
          </header>

          <section className="text-stone-500 leading-relaxed font-medium italic text-lg max-w-lg">
            "{product.description || "Designed for the modern minimalist, this piece is handcrafted with precision in Dolakha."}"
          </section>

          {/* QUANTITY & BUTTON */}
          <div className="space-y-6 pt-6 border-t border-stone-100">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Qty</span>
              <div className="flex items-center border border-stone-200 rounded-full px-4 py-2 gap-6 bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-orange-600 font-bold">-</button>
                <span className="font-black text-sm w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="hover:text-orange-600 font-bold">+</button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-6 rounded-full font-black uppercase tracking-[0.3em] transition-all duration-500 active:scale-95 shadow-xl
                ${isSuccess 
                  ? 'bg-orange-600 text-white shadow-[0_0_30px_rgba(234,88,12,0.8)]' 
                  : 'bg-stone-900 text-white hover:bg-orange-600 hover:shadow-[0_0_30px_rgba(234,88,12,0.6)]'}`}
            >
              {isSuccess ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
