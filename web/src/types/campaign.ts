import { SanityImageSource } from "@sanity/image-url";
import { Product } from "./product";

export type Campaign = {
    _id: string;
    title: string;
    slug: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    themeColor?: string;
    startDate?: string;
    endDate?: string;
    platforms?: string[];
    tagline?: string;
    banner?: SanityImageSource;
    products?: Product[];
    marketingAssets?: {
        asset: SanityImageSource;
        alt?: string;
        assetType: "square" | "story" | "fb_banner" | "other";
    }[];
    campaignBrief?: string;
}
