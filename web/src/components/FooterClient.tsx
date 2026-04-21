"use client";

import { usePathname } from "next/navigation";

export default function FooterClient() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-soft border-dotted bg-app text-description py-24 w-full transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-center md:text-left">
          <div className="lg:col-span-2">
            <h3 className="type-section text-heading mb-8">
              "Sustainably sourced, <br /> thoughtfully crafted."
            </h3>
            <p className="type-body text-description italic max-w-md mx-auto md:mx-0">
              Each piece is a testament to our commitment to quality and
              sustainability. Our other platforms are just a click away,
              where you can explore more of our story and collections.
            </p>
            <br />
            <div className="flex justify-center md:justify-start gap-10 type-action">
              <a
                href="https://facebook.com/dolakhafurniture"
                target="_blank"
                className="text-label hover:text-action transition-colors"
                rel="noreferrer"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com/dolakhafurnituredesign"
                target="_blank"
                className="text-label hover:text-action transition-colors"
                rel="noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com/@dolakhafurniture"
                target="_blank"
                className="text-label hover:text-action transition-colors"
                rel="noreferrer"
              >
                TikTok
              </a>
            </div>
          </div>
          <div className="md:ml-auto w-full max-w-sm">
            <p className="type-label text-heading mb-6">
              Join our Newsletter
            </p>
            <div className="flex border-b border-divider pb-3">
              <input
                type="text"
                placeholder="EMAIL ADDRESS"
                className="bg-transparent type-label w-full outline-none placeholder:text-description/40"
                suppressHydrationWarning
              />
              <button className="text-action hover:translate-x-1 transition-transform">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
