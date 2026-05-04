"use client";

import { useEffect, useState, useRef } from "react";
import { client } from "@/lib/sanity";
import { categoriesQuery } from "@/lib/queries";
import { Category } from "@/types";

export default function CategorySwitcher({ isAdmin = false }: { isAdmin?: boolean }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await client.fetch(categoriesQuery, { isAdmin });
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 140; // Approximate header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (loading || categories.length === 0) return null;

  const allItems = [
    { title: "Featured", id: "cat-featured" },
    { title: "सबै सामान", id: "cat-all" },
    ...categories.map(cat => ({ title: cat.title, id: `cat-${cat.slug}` }))
  ];

  return (
    <div className="w-full bg-app/80 backdrop-blur-md border-b border-soft sticky top-[72px] md:top-[120px] z-[90]">
      <div 
        ref={scrollRef}
        className="flex items-center gap-2 px-4 py-3 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x"
      >
        {allItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="flex-shrink-0 px-4 py-2 rounded-full border border-soft bg-surface/50 text-[11px] font-sans font-bold uppercase tracking-widest text-heading hover:bg-action hover:text-white hover:border-action transition-all duration-300 shadow-sm whitespace-nowrap active:scale-95"
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
