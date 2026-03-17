import { SanityImageSource } from "@sanity/image-url";

export type Product = {
    _id: string;
    title: string;
    slug: string;
    price: number;
    mainImage: SanityImageSource;
    category?: {
        title: string;
        slug: string;
    };
    description?: string;
    stock?: number;
    isFeatured?: boolean;
    _createdAt?: string;
}
