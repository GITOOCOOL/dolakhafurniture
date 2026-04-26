"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";
import { Search, X, Filter } from "lucide-react";
import ProductCard from "./ProductCard";

interface ShopClientProps {
  products: Product[];
}

export default function ShopClient({ products }: ShopClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 1. Get unique categories from products
  const categories = useMemo(() => {
    const cats = products.reduce((acc, product) => {
      const cat = product.category?.title || "Other";
      if (!acc.includes(cat)) acc.push(cat);
      return acc;
    }, [] as string[]);
    return ["All", ...cats.sort()];
  }, [products]);

  // 2. Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        !selectedCategory || selectedCategory === "All" || 
        product.category?.title === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // 3. Group filtered products by category
  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const cat = product.category?.title || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [filteredProducts]);

  const groupNames = Object.keys(groupedProducts).sort();

  return (
    <div className="space-y-12">
      {/* FILTER & SEARCH SUITE */}
      <div className="space-y-6">
        {/* SEARCH BAR */}
        <div className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-action opacity-40 group-focus-within:opacity-100 transition-opacity">
            <Search size={20} strokeWidth={1.5} />
          </div>
          <input
            type="text"
            placeholder="Search our collection by name or style..."
            className="w-full bg-surface border border-soft rounded-2xl py-4 pl-14 pr-6 text-heading placeholder:text-label focus:outline-none focus:border-action transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-label hover:text-action transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* CATEGORY PILLS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-2 text-[10px] font-bold uppercase tracking-widest text-label">
            <Filter size={12} /> Filter by:
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === "All" ? null : cat)}
              className={`px-5 py-2 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
                (selectedCategory === cat || (!selectedCategory && cat === "All"))
                  ? "bg-action border-action text-white shadow-md shadow-accent/20"
                  : "bg-app border-soft text-label hover:border-action hover:text-action"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS AREA */}
      <div className="space-y-24 pt-12">
        {groupNames.length > 0 ? (
          groupNames.map((category) => (
            <section key={category} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Category Header */}
              <div className="relative border-l-2 border-action pl-6">
                <h2 className="text-3xl font-serif italic text-heading">
                  {category}<span className="text-action">.</span>
                </h2>
                <p className="type-label text-label mt-2">
                  {groupedProducts[category].length} {groupedProducts[category].length === 1 ? 'Item' : 'Items'} available
                </p>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {groupedProducts[category].map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-32 border-2 border-dotted border-soft rounded-[4rem]">
            <p className="text-2xl font-serif italic text-label">
              "No items matched your current search criteria."
            </p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
              className="mt-6 text-action font-bold uppercase text-[10px] tracking-widest hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
