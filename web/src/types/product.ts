import { SanityImageSource } from "@sanity/image-url";

export type Product = {
    _id: string;
    title: string;
    slug: string;
    price: number;
    mainImage: SanityImageSource;
    images?: {
        asset: any;
        isVisible: boolean;
    }[];
    category?: {
        title: string;
        slug: string;
    };
    description?: string;
    stock?: number;
    isFeatured?: boolean;
    material?: string;
    length?: number;
    breadth?: number;
    width?: number;
    _createdAt?: string;
}
