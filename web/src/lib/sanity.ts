import {createClient} from 'next-sanity';

import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url';

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'b6iov2to',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-03-11',
    useCdn: false,
    fetch: {
        cache: 'no-store', // This forces Next.js to fetch fresh data on every request
    }
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
    return builder.image(source);
}