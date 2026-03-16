import { SanityImageSource } from "@sanity/image-url";

export interface HeroImage {
    _id: string;
    title: string;
    slug: string;
    mainImage: SanityImageSource;
    createdAt: string;
}