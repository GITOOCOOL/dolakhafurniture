"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  campaign,
}: {
  isMobile?: boolean;
  onItemClick?: () => void;
  campaign?: any;
}) {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchCategories() {
      try {
        const data = await client.fetch(categoriesQuery);
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
    { name: 'Home. / घर', href: '/' },
    { name: 'Shop. / पसल', href: '/shop' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Campaigns', href: '/campaigns' },
  ];

  const categoryLinks = categories.map((cat) => ({
    name: cat.title,
    href: `/category/${cat.slug}`,
  }));

  const endLinks = [
    { name: 'About Us', href: '/our-story' },
    { name: 'Stories', href: '/stories' },
  ];

  const allLinks = [...baseLinks, ...categoryLinks, ...endLinks];

  if (!mounted || loading) {
    return isMobile ? (
      <nav className="flex flex-col items-start justify-start gap-8 w-full opacity-50 pt-2 overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-12 md:h-14 w-64 border-soft animate-pulse rounded-2xl"></div>
        ))}
      </nav>
    ) : (
      <div className="flex gap-6 lg:gap-10 opacity-50">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-4 w-16 border-soft animate-pulse rounded"></div>
        ))}
      </div>
    );
  }

  const checkActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col items-start justify-start gap-8 w-full pt-2">
        {/* Campaign Promo inside Scroll View */}
        {campaign && (
          <button
            onClick={() => {
              onItemClick?.();
              // Trigger campaign modal - we'll handle this in the parent or via a store
              window.dispatchEvent(new CustomEvent('open-campaign-modal'));
            }}
            className="w-full mb-4 p-5 rounded-[2rem] bg-surface border border-divider flex items-center justify-between group overflow-hidden relative shadow-sm"
          >
            <div className="relative z-10 flex items-center gap-4">
              <span className="text-2xl animate-bounce-slow">🏮</span>
              <div className="text-left">
                <p className="type-label text-description uppercase tracking-[0.2em] text-[8px] mb-0.5">
                  Limited Offer
                </p>
                <p className="type-product text-heading group-hover:text-action transition-colors text-sm">
                  {campaign.title}
                </p>
              </div>
            </div>
            <div className="relative z-10 w-8 h-8 rounded-full border border-divider flex items-center justify-center text-heading group-hover:bg-action group-hover:text-app transition-all text-xs">
              →
            </div>
          </button>
        )}

        {allLinks.map((link) => {
          const isActive = checkActive(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onItemClick}
              className={`relative group text-2xl md:text-3xl font-serif italic tracking-tight text-heading hover:text-action flex-shrink-0 flex items-center gap-3 py-2 ${isActive ? 'text-action' : ''}`}
            >
              {link.name}
              {link.href === '/stories' && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
              <span className={`absolute bottom-0 left-0 h-[2px] bg-action transition-all duration-300 rounded-full ${isActive ? 'w-full opacity-100' : 'w-0 opacity-60 group-hover:w-full'}`}></span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-center gap-6 lg:gap-10 text-[13px] font-medium font-serif italic tracking-wide w-full overflow-x-auto no-scrollbar py-1">
      {allLinks.map((link) => {
        const isActive = checkActive(link.href);
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`text-heading whitespace-nowrap hover:text-action transition-colors relative group py-1 flex items-center gap-2 ${isActive ? 'text-action' : ''}`}
          >
            {link.name}
            {link.href === '/stories' && (
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
            )}
            <span className={`absolute bottom-[-4px] left-0 h-[2px] bg-action transition-all duration-300 rounded-full ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
        );
      })}
    </nav>
  );
}
