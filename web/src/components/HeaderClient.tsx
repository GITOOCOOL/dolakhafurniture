"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import NavbarActions from "@/components/NavbarActions";
import CategoryNav from "@/components/CategoryNav";
import { Menu, X, Facebook, Instagram, Search, Leaf, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { trackEvent } from "./MetaPixel";
import { Campaign, Product, BusinessMetaData } from "@/types";
import { client } from "@/lib/sanity";
import { searchProductsQuery } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import CampaignModal from "./CampaignModal";
import Modal from "./ui/Modal";
import CategorySwitcher from "./CategorySwitcher";
import ProductQuickView from "./ProductQuickView";
import InquiryModal from "./InquiryModal";

interface HeaderClientProps {
  latestCampaign?: Campaign | null;
  businessMetaData?: BusinessMetaData | null;
  isAdmin?: boolean;
}

export default function HeaderClient({ latestCampaign, businessMetaData, isAdmin: isAuthorizedAdmin }: HeaderClientProps) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const {
    lockScroll,
    unlockScroll,
    setCampaignModalOpen,
    isSearchOpen,
    setIsSearchOpen,
    isInquiryModalOpen,
    setIsInquiryModalOpen,
  } = useUIStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ products: Product[]; categories: any[] }>({
    products: [],
    categories: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener for search bar visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced search logic
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ products: [], categories: [] });
        return;
      }

      setIsSearching(true);
      try {
        const results = await client.fetch(searchProductsQuery, {
          searchTerm: `${searchQuery}*`,
          isAdmin: isAuthorizedAdmin,
        });
        setSearchResults({
          products: results.products || [],
          categories: results.categories || [],
        });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchResults, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Clear results on close
  useEffect(() => {
    if (!isSearchOpen) {
      setSearchQuery("");
      setSearchResults({ products: [], categories: [] });
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen || isInquiryModalOpen) lockScroll("header-overlay");
    else unlockScroll("header-overlay");

    const handleOpenCampaign = () => setCampaignModalOpen(true);
    window.addEventListener('open-campaign-modal', handleOpenCampaign);

    return () => {
      unlockScroll("header-overlay");
      window.removeEventListener('open-campaign-modal', handleOpenCampaign);
    };
  }, [isMenuOpen, isSearchOpen, isInquiryModalOpen, lockScroll, unlockScroll, setCampaignModalOpen]);

  // Track Header Height dynamically to allow modals to dock perfectly below it
  useEffect(() => {
    if (isAdminPath) return;
    const header = document.getElementById("main-site-header");
    if (!header) return;

    // Set initial height
    document.documentElement.style.setProperty("--header-height", `${header.clientHeight}px`);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        document.documentElement.style.setProperty("--header-height", `${entry.target.clientHeight}px`);
      }
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, [isAdminPath]);

  if (isAdminPath) return null;

  return (
    <>
      <header id="main-site-header" className="sticky top-0 z-[100] w-full pointer-events-none transition-all duration-300">
        {/* Main Header Surface */}
        <div className="bg-app border-b border-soft shadow-[0_2px_10px_rgba(0,0,0,0.02)] pointer-events-auto">
          <div className="w-full flex items-center justify-between py-3 md:py-4 px-6 md:px-10 lg:px-16 gap-2 md:gap-0">
            {/* Hidden Spacer for Desktop - Ensures Logo stays centered */}
            <div className="hidden md:flex flex-1 basis-0" />

            {/* Logo/Branding - Centered on desktop, left-aligned on mobile flow */}
            <div className="flex-none md:flex-1 md:basis-0 flex items-center justify-start md:justify-center">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative flex-shrink-0 w-12 h-12 md:w-20 md:h-20 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full text-action opacity-[0.35] absolute transition-transform duration-700 group-hover:scale-110"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <line
                      x1="4"
                      y1="18"
                      x2="20"
                      y2="18"
                      className="opacity-30"
                    />
                  </svg>
                  <img
                    src="/logo.png"
                    alt="Home"
                    style={{ width: "26px", height: "26px" }}
                    className="md:w-15 md:h-15 aspect-square object-contain transition-transform duration-700 group-hover:rotate-6 relative z-10 mt-1"
                  />
                </div>
                 <span className="hidden lg:block text-2xl xl:text-3xl font-serif italic tracking-tight text-heading">
                  {businessMetaData?.businessName || "undefined_setmetadata_in_studio"}
                  <span className="text-action">.</span>
                </span>
              </Link>
            </div>

            {/* All Utilities (including Menu on mobile) */}
            <div className="flex-1 flex items-center justify-end gap-2">
              <NavbarActions 
                onSearchClick={() => setIsSearchOpen(true)} 
                onMenuClick={() => setIsMenuOpen(true)}
                businessMetaData={businessMetaData}
              />
            </div>
          </div>

          <div className="hidden md:flex w-full pb-3 justify-center">
            <CategoryNav isAdmin={isAuthorizedAdmin} />
          </div>
        </div>

        {pathname === "/" && (
          <div className="pointer-events-auto">
            <CategorySwitcher isAdmin={isAuthorizedAdmin} />
          </div>
        )}
        <div className="pointer-events-auto">
          <ProductQuickView businessMetaData={businessMetaData} />
        </div>

        <CampaignModal campaign={latestCampaign || null} />
        <InquiryModal 
          isOpen={isInquiryModalOpen} 
          onClose={() => setIsInquiryModalOpen(false)} 
          businessMetaData={businessMetaData} 
        />
</header>

      {/* --- SEARCH MODAL --- */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Search Catalog"
        position="bottom"
        className="sm:max-w-7xl !p-0 sm:h-[calc(100dvh-var(--header-height,5rem))]"
        noPadding
      >
        <div className="relative w-full h-full bg-app/80 backdrop-blur-3xl overflow-y-auto pt-6 px-6 sm:pt-10 sm:px-10 pb-32">
            <div className="w-full max-w-4xl mx-auto space-y-8">
              <div className="relative group">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by name, material, or style..."
                  className="w-full bg-transparent border-b-2 border-soft text-heading placeholder:text-label text-2xl md:text-4xl py-6 focus:outline-none focus:border-action transition-all font-light"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (searchQuery.trim()) {
                        trackEvent("Search", { search_string: searchQuery });
                      }
                    }
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                  {isSearching && (
                    <div className="w-6 h-6 border-2 border-action border-t-transparent rounded-full animate-spin" />
                  )}
                  <Search
                    size={40}
                    strokeWidth={1}
                    className="text-action opacity-30 group-focus-within:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              {/* RESULTS AREA */}
              <div className="min-h-[40vh] py-8">
                {searchQuery.length > 0 ? (
                  searchResults.products.length > 0 || searchResults.categories.length > 0 ? (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      
                      {/* CATEGORIES / COLLECTIONS */}
                      {searchResults.categories.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="type-label text-label uppercase tracking-widest text-[10px]">
                            Matching Collections
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {searchResults.categories.map((category) => (
                              <Link
                                key={category._id}
                                href={`/category/${category.slug}`}
                                onClick={() => setIsSearchOpen(false)}
                                className="group flex items-center gap-3 px-6 py-3 bg-surface border border-soft rounded-full hover:border-action hover:text-action transition-all shadow-sm"
                              >
                                <span className="text-lg">📂</span>
                                <span className="font-serif italic text-heading group-hover:text-action transition-colors">
                                  {category.title}
                                </span>
                                <span className="text-action opacity-0 group-hover:opacity-100 transition-opacity">
                                  →
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* PRODUCTS */}
                      {searchResults.products.length > 0 && (
                        <div className="space-y-6">
                          <div className="flex justify-between items-end border-b border-soft pb-4">
                            <h3 className="type-label text-label uppercase tracking-widest text-[10px]">
                              Products ({searchResults.products.length})
                            </h3>
                            <p className="type-label text-description italic text-[10px]">
                              Scroll for more
                            </p>
                          </div>
                          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {searchResults.products.map((product) => (
                              <div
                                key={product._id}
                                className="h-full"
                                onClick={() => setIsSearchOpen(false)}
                              >
                                <ProductCard product={product} businessMetaData={businessMetaData} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    !isSearching && (
                      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 rounded-full bg-soft/10 flex items-center justify-center mb-6">
                          <Search size={32} className="text-label" />
                        </div>
                        <h3 className="text-2xl font-serif italic text-heading mb-2">
                          No results matched your craft
                        </h3>
                        <p className="text-description max-w-xs">
                          Double check your spelling or try searching for
                          materials like "teak" or "velvet".
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <div className="flex flex-wrap justify-center gap-4 pt-8">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-label w-full text-center mb-2">
                      Popular Searches
                    </span>
                    {[
                      "Sofa Sets",
                      "Dining Tables",
                      "Wardrobes",
                      "Beds",
                      "Office Chairs",
                    ].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setSearchQuery(term)}
                        className="px-6 py-2 rounded-full border border-soft text-heading hover:border-action hover:text-action transition-all text-[11px] font-medium uppercase tracking-wider cursor-pointer touch-manipulation"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
        </div>
      </Modal>

      <Modal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        position="right"
        title="Navigation"
      >
        <div className="w-full h-full flex flex-col">
          {/* Scrollable Navigation Area */}
          <div className="flex-1 overflow-y-auto pb-10 scrollbar-hide">
            <CategoryNav
              isMobile={true}
              onItemClick={() => setIsMenuOpen(false)}
              campaign={latestCampaign}
              isAdmin={isAuthorizedAdmin}
            />
          </div>

          {/* Sticky Footer Area */}
          <div className="flex-shrink-0 w-full border-t border-soft/20 py-4 mt-auto sticky bottom-0 bg-app/90 backdrop-blur-xl z-30 px-6">
            <div className="flex items-center justify-between gap-6">
              {/* --- COMPACT THEME TOGGLE --- */}
              {mounted && (
                <div className="flex items-center justify-center p-1 bg-surface border border-soft rounded-full relative w-32 h-10">
                  <button
                    onClick={() => setTheme("light")}
                    className={`relative z-10 flex-1 h-full flex items-center justify-center rounded-full transition-all duration-300 ${
                      resolvedTheme === "light" ? "text-heading" : "text-description/40 hover:text-heading"
                    }`}
                  >
                    <Sun size={16} strokeWidth={2} />
                    {resolvedTheme === "light" && (
                      <motion.div
                        layoutId="active-theme"
                        className="absolute inset-0 bg-app border border-soft shadow-sm rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`relative z-10 flex-1 h-full flex items-center justify-center rounded-full transition-all duration-300 ${
                      resolvedTheme === "dark" ? "text-white" : "text-description/40 hover:text-heading"
                    }`}
                  >
                    <Moon size={16} strokeWidth={2} />
                    {resolvedTheme === "dark" && (
                      <motion.div
                        layoutId="active-theme"
                        className="absolute inset-0 bg-heading border border-action/30 shadow-md rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      >
                         <div className="absolute inset-0 bg-action/10" />
                      </motion.div>
                    )}
                  </button>
                </div>
              )}

              {/* --- SOCIALS --- */}
              <div className="flex items-center gap-8">
                {businessMetaData?.facebookUrl && (
                  <a
                    href={businessMetaData.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-heading/30 hover:text-action transition-all flex items-center justify-center"
                  >
                    <Facebook size={22} strokeWidth={1.5} />
                  </a>
                )}
                {businessMetaData?.instagramUrl && (
                  <a
                    href={businessMetaData.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-heading/30 hover:text-action transition-all flex items-center justify-center"
                  >
                    <Instagram size={22} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
