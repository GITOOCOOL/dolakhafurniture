"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarActions from "@/components/NavbarActions";
import CategoryNav from "@/components/CategoryNav";
import { Menu, X, Facebook, Instagram, Search, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { trackEvent } from "./MetaPixel";
import { Campaign, Product } from "@/types";
import { client } from "@/lib/sanity";
import { searchProductsQuery } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import CampaignModal from "./CampaignModal";
import Modal from "./ui/Modal";

interface HeaderClientProps {
  latestCampaign?: Campaign | null;
}

export default function HeaderClient({ latestCampaign }: HeaderClientProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    lockScroll,
    unlockScroll,
    setCampaignModalOpen,
    isSearchOpen,
    setIsSearchOpen,
  } = useUIStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search logic
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const products = await client.fetch<Product[]>(searchProductsQuery, {
          searchTerm: `${searchQuery}*`, // Add wildcard for partial matching
        });
        setSearchResults(products);
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
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen) lockScroll("header-overlay");
    else unlockScroll("header-overlay");
    return () => unlockScroll("header-overlay");
  }, [isMenuOpen, isSearchOpen, lockScroll, unlockScroll]);

  if (isAdmin) return null;

  return (
    <>
      <header className="sticky top-0 z-[100] w-full pointer-events-none transition-all duration-300">
        {/* Main Header Surface */}
        <div className="bg-app border-b border-soft shadow-[0_2px_10px_rgba(0,0,0,0.02)] pointer-events-auto">
          <div className="container mx-auto px-2 md:px-6 w-full flex items-center justify-between py-3 md:py-4">
            {/* Left: Utility (Menu + Offers) - Balanced as flex-1 */}
            <div className="flex-1 basis-0 flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-heading hover:text-action transition-all -ml-1 md:-ml-2 flex-shrink-0"
                aria-label="Menu"
              >
                <Menu size={26} className="md:w-7 md:h-7" strokeWidth={1.5} />
              </button>

              {/* Promo Trigger */}
              <div className="flex items-center">
                {latestCampaign && (
                  <button
                    onClick={() => setCampaignModalOpen(true)}
                    className="h-7 md:h-[48px] flex items-center px-3 md:px-6 text-[9px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-white bg-action hover:bg-espresso rounded-full transition-all whitespace-nowrap flex-shrink-0 shadow-lg shadow-accent/20"
                  >
                    <span className="mr-1 md:mr-2">🏮</span>
                    <span className="hidden xs:inline">Offers</span>
                    <span className="xs:hidden">Sale</span>
                  </button>
                )}
              </div>
            </div>

            {/* Center: Branding - Dead Center Nudge */}
            <div className="flex-none flex items-center justify-center px-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative flex-shrink-0 w-14 h-14 md:w-20 md:h-20 flex items-center justify-center">
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
                    style={{ width: "30px", height: "30px" }}
                    className="md:w-15 md:h-15 aspect-square object-contain transition-transform duration-700 group-hover:rotate-6 relative z-10 mt-1"
                  />
                </div>
                <span className="hidden lg:block text-2xl xl:text-3xl font-serif italic tracking-tight text-heading">
                  Dolakha<span className="text-action">.</span>Furniture
                </span>
              </Link>
            </div>

            {/* Right: Actions - Balanced as flex-1 */}
            <div className="flex-1 basis-0 flex items-center justify-end">
              <NavbarActions onSearchClick={() => setIsSearchOpen(true)} />
            </div>
          </div>

          <div className="hidden md:flex container mx-auto px-6 pb-3 justify-center w-full">
            <CategoryNav />
          </div>
        </div>

        {/* --- FULL-WIDTH SEARCH TRIGGER --- */}
        <div className="container mx-auto px-6 pt-4 pointer-events-none">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="pointer-events-auto w-full bg-app/50 backdrop-blur-md border border-soft/50 shadow-sm px-6 py-4 rounded-2xl text-label hover:border-action transition-all duration-500 group flex items-center justify-between"
            aria-label="Search Collection"
          >
            <div className="flex items-center gap-4">
              <Search
                size={18}
                className="text-action opacity-50 group-hover:opacity-100 transition-opacity"
                strokeWidth={1.5}
              />
              <span className="text-[11px] font-sans font-medium lowercase tracking-wide text-description group-hover:text-heading transition-colors">
                Search by name, material, or style...
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.2em] text-label opacity-40 group-hover:opacity-100">
              <span>Quick Search</span>
              <span className="text-action">→</span>
            </div>
          </button>
        </div>

        <CampaignModal campaign={latestCampaign || null} />
      </header>

      {/* --- SEARCH TAKEOVER MODAL --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-app z-[200] flex flex-col items-center pt-20 px-6 backdrop-blur-xl overflow-y-auto pb-32"
          >
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="fixed top-8 right-8 z-[210] p-3 text-heading hover:text-action transition-colors cursor-pointer touch-manipulation bg-app/50 backdrop-blur-md rounded-full border border-soft shadow-lg"
            >
              <X size={32} strokeWidth={1.2} />
            </button>
            <div className="w-full max-w-4xl space-y-8">
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
                  searchResults.length > 0 ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="flex justify-between items-end border-b border-soft pb-4">
                        <h3 className="type-label text-label uppercase tracking-widest">
                          Results found ({searchResults.length})
                        </h3>
                        <p className="type-label text-description italic">
                          Scroll for more
                        </p>
                      </div>
                      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {searchResults.map((product) => (
                          <div
                            key={product._id}
                            className="h-full"
                            onClick={() => setIsSearchOpen(false)}
                          >
                            <ProductCard product={product} />
                          </div>
                        ))}
                      </div>
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
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        position="left"
        title="Navigation"
      >
        <div className="w-full h-full flex flex-col">
          <div className="w-full flex-1">
            {latestCampaign && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setCampaignModalOpen(true);
                }}
                className="w-full mb-10 p-6 rounded-[2rem] bg-surface border border-divider flex items-center justify-between group overflow-hidden relative"
              >
                <div className="relative z-10 flex items-center gap-5">
                  <span className="text-3xl animate-bounce-slow">🏮</span>
                  <div className="text-left">
                    <p className="type-label text-description uppercase tracking-[0.2em] text-[9px] mb-1">
                      Limited Time Offer
                    </p>
                    <p className="type-product text-heading group-hover:text-action transition-colors">
                      {latestCampaign.title}
                    </p>
                  </div>
                </div>
                <div className="relative z-10 w-10 h-10 rounded-full border border-divider flex items-center justify-center text-heading group-hover:bg-action group-hover:text-app transition-all">
                  →
                </div>
              </button>
            )}

            <CategoryNav
              isMobile={true}
              onItemClick={() => setIsMenuOpen(false)}
            />
          </div>

          <div className="flex-shrink-0 w-full border-t border-soft/20 pt-10 pb-6 mt-10">
            <div className="flex gap-8 mb-6">
              <a
                href="https://facebook.com/dolakhafurniture"
                className="text-heading/40 hover:text-action transition-all"
              >
                <Facebook size={22} strokeWidth={1.5} />
              </a>
              <a
                href="https://instagram.com/dolakhafurnituredesign"
                className="text-heading/40 hover:text-action transition-all"
              >
                <Instagram size={22} strokeWidth={1.5} />
              </a>
              <a
                href="https://tiktok.com/@dolakhafurniture"
                className="text-heading/40 hover:text-action transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.61-1.49-2.11-2.46-.01 2.13.01 4.26-.01 6.38-.04 2.11-.46 4.38-1.92 6.01-1.62 1.83-4.22 2.58-6.6 2.18-2.6-.44-4.83-2.61-5.32-5.22-.54-2.84.58-6.04 2.94-7.69 1.52-1.07 3.51-1.46 5.33-1.05v4.1c-.88-.25-1.87-.21-2.69.24-1.2.66-1.85 2.11-1.6 3.47.2 1.14 1.13 2.14 2.27 2.32 1.34.2 2.82-.36 3.5-1.55.33-.58.46-1.25.45-1.92V.02z" />
                </svg>
              </a>
            </div>
            <p className="type-label text-description/40 uppercase tracking-[0.3em] text-[10px]">
              Honest Craft, Nepal
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
