import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/components/HeaderClient";
import VerticalBulletinTicker from "@/components/VerticalBulletinTicker";
import { client } from "@/lib/sanity";
import { bulletinQuery, activeCampaignsQuery } from "@/lib/queries";
import { Bulletin, Campaign } from "@/types";
import { ToastProvider } from "@/components/Toast";
import MetaPixel from "@/components/MetaPixel";
import FloatingContact from "@/components/FloatingContact";
import AnnouncementBar from "@/components/AnnouncementBar";
import CampaignModal from "@/components/CampaignModal";
import NextTopLoader from 'nextjs-toploader';
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
  const [bulletins, activeCampaigns] = await Promise.all([
    client.fetch<Bulletin[]>(bulletinQuery),
    client.fetch<Campaign[]>(activeCampaignsQuery)
  ]);

  const latestCampaign = activeCampaigns?.[0] || null;

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true} data-scroll-behavior="smooth">
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
        className={`${serif.variable} ${sans.variable} antialiased bg-[#fdfaf5] text-[#3d2b1f] font-sans w-full min-h-screen flex flex-col`}
      >
        <NextTopLoader 
          color="#22c55e"
          initialPosition={0.08}
          crawlSpeed={200}
          height={5}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 15px rgba(34,197,94,0.6), 0 0 10px rgba(34,197,94,0.4)"
          zIndex={999999}
        />
        <ToastProvider>
          <Suspense fallback={null}>
            <MetaPixel />
          </Suspense>
          
          {/* 1. TOP ANNOUNCEMENT (Scrolls away) */}
          <AnnouncementBar bulletins={bulletins} />
          
          {/* 2. STICKY HEADER (Persistent) */}
          <HeaderClient latestCampaign={latestCampaign} />
          
          {/* 3. MAIN CONTENT */}
          <main className="w-full relative flex-1">{children}</main>
          
          {/* 4. GLOBAL ELEMENTS */}
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
      </body>
    </html>
  );
}
