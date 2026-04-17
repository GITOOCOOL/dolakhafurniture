import { SanityImageSource } from "@sanity/image-url";

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
}
