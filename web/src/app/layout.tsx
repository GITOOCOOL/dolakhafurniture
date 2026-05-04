import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/components/HeaderClient";
import VerticalBulletinTicker from "@/components/VerticalBulletinTicker";
import { client } from "@/lib/sanity";
import { bulletinQuery, activeCampaignsQuery, businessMetaDataQuery } from "@/lib/queries";
import { Bulletin, Campaign, BusinessMetaData } from "@/types";
import { ToastProvider } from "@/components/Toast";
import { isAuthorizedAdmin } from "@/lib/auth";
import MetaPixel from "@/components/MetaPixel";
import AnnouncementBar from "@/components/AnnouncementBar";
import BrowserBanner from "@/components/BrowserBanner";
import CampaignModal from "@/components/CampaignModal";
import FooterClient from "@/components/FooterClient";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import PulseTracker from "@/components/PulseTracker";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Metadata } from "next";


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

export async function generateMetadata(): Promise<Metadata> {
  let businessMetaData: BusinessMetaData | null = null;
  try {
    businessMetaData = await client.fetch<BusinessMetaData>(businessMetaDataQuery);
  } catch (error) {
    console.error("Metadata fetch failed:", error);
  }

  const name = businessMetaData?.businessName || "undefined_setmetadata_in_studio";
  const tagline = businessMetaData?.tagline || "undefined_setmetadata_in_studio";
  const url = businessMetaData?.businessUrl || "https://undefined_setmetadata_in_studio.com";

  return {
    title: {
      default: `${name} | ${tagline}`,
      template: `%s | ${name}`
    },
    description: `High-quality handcrafted furniture by ${name}. We offer a wide range of sofas, beds, tables, and home decor made with durable materials and professional craftsmanship.`,
    keywords: ["handcrafted furniture", "quality sofas", "bespoke interior", name, tagline],
    authors: [{ name }],
    creator: name,
    publisher: name,
    formatDetection: {
      email: false,
      address: true,
      telephone: true,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: url,
      siteName: name,
      title: `${name} | Quality Handcrafted Furniture`,
      description: `Quality handcrafted furniture for your home by ${name}. Built to last and delivered with care.`,
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Quality Handcrafted Furniture`,
      description: `Quality handcrafted furniture for your home by ${name}. Built to last and delivered with care.`,
      images: ["/logo.png"],
    },
    metadataBase: new URL(url),
  };
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let bulletins: Bulletin[] = [];
  let activeCampaigns: Campaign[] = [];
  let businessMetaData: BusinessMetaData | null = null;

  try {
    const [fetchedBulletins, fetchedCampaigns, fetchedMetaData] = await Promise.all([
      client.fetch<Bulletin[]>(bulletinQuery),
      client.fetch<Campaign[]>(activeCampaignsQuery),
      client.fetch<BusinessMetaData>(businessMetaDataQuery),
    ]);
    bulletins = fetchedBulletins || [];
    activeCampaigns = fetchedCampaigns || [];
    businessMetaData = fetchedMetaData || null;
  } catch (error) {
    console.error("Layout data fetch failed:", error);
  }

  const isAdmin = await isAuthorizedAdmin();

  // Bulletins for the ticker
  const combinedBulletins = bulletins.length > 0 
    ? bulletins.map(b => ({ ...b, type: "default" }))
    : [{ _id: 'fallback', title: businessMetaData?.businessName || 'undefined_setmetadata_in_studio', content: 'Crafting Heritage.', type: 'default' }];

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
          defaultTheme="light"
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
              <MetaPixel pixelId={businessMetaData?.facebookPixelId} />
              <PulseTracker />
            </Suspense>

            <BrowserBanner />
            <HeaderClient latestCampaign={latestCampaign} businessMetaData={businessMetaData} isAdmin={isAdmin} />
            <main className="w-full relative flex-1 px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1920px] mx-auto">{children}</main>
            
            <CampaignModal campaign={latestCampaign} businessMetaData={businessMetaData} />
            <FooterClient businessMetaData={businessMetaData} />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
