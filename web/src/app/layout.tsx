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
import BrowserBanner from "@/components/BrowserBanner";
import CampaignModal from "@/components/CampaignModal";
import FooterClient from "@/components/FooterClient";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    client.fetch<Campaign[]>(activeCampaignsQuery),
  ]);

  const latestCampaign = activeCampaigns?.[0] || null;

  return (
    <html
      lang="en"
      className="scroll-smooth"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__name = window.__name || ((f, n) => f);`,
          }}
        />
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
        className={`${serif.variable} ${sans.variable} antialiased bg-app text-heading font-sans w-full min-h-screen flex flex-col transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
        >
          <NextTopLoader
            color="#df9152"
            initialPosition={0.08}
            crawlSpeed={200}
            height={6}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 20px rgba(223, 145, 82, 0.9), 0 0 10px rgba(223, 145, 82, 0.7)"
            zIndex={999999}
          />
          <ToastProvider>
            <Suspense fallback={null}>
              <MetaPixel />
            </Suspense>

            <BrowserBanner />
            <AnnouncementBar bulletins={bulletins} />
            <HeaderClient latestCampaign={latestCampaign} />
            <main className="w-full relative flex-1">{children}</main>
          </ToastProvider>
          <FloatingContact />

          {/* FOOTER */}
          <FooterClient />
        </ThemeProvider>
      </body>
    </html>
  );
}
