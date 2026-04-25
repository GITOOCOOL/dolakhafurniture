import { SanityImageSource } from "@sanity/image-url";
import { Product } from "./product";
import { Voucher } from "./voucher";

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
    description?: string;
    banner?: SanityImageSource;
    vouchers?: Voucher[];
    products?: Product[];
    marketingAssets?: {
        asset: SanityImageSource;
        alt?: string;
        assetType: "square" | "story" | "fb_banner" | "other";
    }[];
    campaignBrief?: string;
    buttonText?: string;
    buttonLink?: string;
}
