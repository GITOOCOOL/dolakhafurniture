import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/components/HeaderClient";
import VerticalBulletinTicker from "@/components/VerticalBulletinTicker";
import { client } from "@/lib/sanity";
import { bulletinQuery } from "@/lib/queries";
import { Bulletin } from "@/types";
import { ToastProvider } from "@/components/Toast";
import MetaPixel from "@/components/MetaPixel";
import FloatingContact from "@/components/FloatingContact";
import { Suspense } from "react";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  style: ["italic", "normal"],
});

const sans = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bulletins = await client.fetch<Bulletin[]>(bulletinQuery);

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes boho-glow {
            0%, 100% { filter: drop-shadow(0 0 2px rgba(163, 86, 58, 0.4)); }
            50% { filter: drop-shadow(0 0 8px rgba(223, 145, 82, 0.6)); }
          }
          .neon-hover:hover { animation: boho-glow 2s infinite; }
        `,
          }}
        />
      </head>
      <body
        className={`${serif.variable} ${sans.variable} antialiased bg-[#fdfaf5] text-[#3d2b1f] font-sans w-full max-w-full m-0 p-0 overflow-x-hidden flex`}
      >
        {/* LEFT SIDEBAR: Persistent Vertical Bulletin (Desktop only) */}
        <aside className="hidden lg:block w-[80px] h-screen sticky top-0 flex-shrink-0 z-50 overflow-hidden">
          <VerticalBulletinTicker bulletins={bulletins} />
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col relative w-full overflow-x-hidden">
          <ToastProvider>
            <Suspense fallback={null}>
              <MetaPixel />
            </Suspense>
            <HeaderClient />
            <main className="w-full relative flex-1">{children}</main>
            <FloatingContact />
          </ToastProvider>

          {/* FOOTER */}
          <footer className="border-t border-[#e5dfd3] border-dotted bg-[#1a1c13] text-[#e2e8da] py-20 w-full">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
                <div className="lg:col-span-2">
                  <h3 className="text-[#fdfaf5] text-3xl font-serif italic mb-6 leading-relaxed">
                    "Sustainably sourced, <br /> thoughtfully crafted."
                  </h3>
                  <p className="text-[#a89f91] text-sm font-light italic leading-relaxed">
                    Each piece is a testament to our commitment to quality and
                    sustainability. Our other platforms are just a click away,
                    where you can explore more of our story and collections.
                  </p>
                  <br />
                  <div className="flex justify-center md:justify-start gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
                    <a
                      href="https://facebook.com/dolakhafurniture"
                      target="_blank"
                      className="hover:text-[#df9152] transition-colors"
                    >
                      Facebook
                    </a>
                    <a
                      href="https://instagram.com/dolakhafurnituredesign"
                      target="_blank"
                      className="hover:text-[#df9152] transition-colors"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://tiktok.com/@dolakhafurniture"
                      target="_blank"
                      className="hover:text-[#df9152] transition-colors"
                    >
                      TikTok
                    </a>
                  </div>
                </div>
                <div className="md:ml-auto w-full">
                  <p className="text-[#fdfaf5] text-xs font-serif italic mb-4">
                    Join our Socials
                  </p>
                  <div className="flex border-b border-[#3d2b1f] pb-2 max-w-xs mx-auto md:mx-0">
                    <input
                      type="text"
                      placeholder="EMAIL ADDRESS"
                      className="bg-transparent text-xs w-full outline-none placeholder:text-[#a89f91] placeholder:text-[10px] tracking-widest"
                      suppressHydrationWarning
                    />
                    <button className="text-[#df9152] font-serif italic">
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
