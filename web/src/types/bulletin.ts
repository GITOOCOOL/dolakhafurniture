import { SanityImageSource } from "@sanity/image-url";

export interface Bulletin {
    _id: string;
    title: string;
    content: string;
    bulletinType: string;
    slug: string;
    mainImage: SanityImageSource;
    createdAt: string;
}
