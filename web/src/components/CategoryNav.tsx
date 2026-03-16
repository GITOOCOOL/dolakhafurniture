"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { categoriesQuery } from "@/lib/queries";

type Category = {
  _id: string;
  title: string;
  slug: string;
};

export default function CategoryNav({
  isMobile = false,
  onItemClick,
}: {
  isMobile?: boolean;
  onItemClick?: () => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchCategories() {
      try {
        const data = await client.fetch(categoriesQuery);
        console.log("FETCHED CATEGORIES:", data);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const baseLinks = [
    { name: 'Shop All', href: '/shop' },
    { name: 'New Arrivals', href: '/new-arrivals' },
  ];

  const categoryLinks = categories.map((cat) => ({
    name: cat.title,
    href: `/category/${cat.slug}`,
  }));

  const endLinks = [
    { name: 'Our Story', href: '/our-story' },
  ];

  const allLinks = [...baseLinks, ...categoryLinks, ...endLinks];

  if (!mounted || loading) {
    return isMobile ? (
      <nav className="flex flex-col items-start justify-start flex-grow gap-8 w-full opacity-50 pt-2 h-full overflow-hidden pb-20">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-12 md:h-14 w-64 bg-[#e5dfd3] animate-pulse rounded-2xl"></div>
        ))}
      </nav>
    ) : (
      <div className="flex gap-6 lg:gap-10 opacity-50">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-4 w-16 bg-[#e5dfd3] animate-pulse rounded"></div>
        ))}
      </div>
    );
  }

  if (isMobile) {
    return (
      <nav className="flex flex-col items-start justify-start flex-grow gap-8 overflow-y-auto no-scrollbar pb-20 w-full h-full pt-2">
        {allLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={onItemClick}
            className="text-5xl font-serif italic text-[#3d2b1f] hover:text-[#a3573a] flex-shrink-0"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-center gap-6 lg:gap-10 text-[13px] font-medium font-serif italic tracking-wide w-full overflow-x-auto no-scrollbar py-1">
      {allLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-[#3d2b1f] whitespace-nowrap hover:text-[#a3573a] transition-colors relative group py-1"
        >
          {link.name}
          <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#a3573a] transition-all duration-300 group-hover:w-full rounded-full"></span>
        </Link>
      ))}
    </nav>
  );
}
