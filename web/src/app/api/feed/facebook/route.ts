import { NextResponse } from 'next/server';
import { client, urlFor } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

export async function GET() {
    try {
        // Fetch products, mapping only the necessary fields
        const products = await client.fetch(`*[_type == "product"]{
            _id,
            title,
            price,
            mainImage,
            "slug": slug.current,
            description,
            stock
        }`);

        const baseUrl = 'https://dolakhafurniture.pages.dev';

        // Generate the XML wrapper
        let rssEntries = products.map((product: any) => {
            const title = escapeXml(product.title || '');
            const description = escapeXml(product.description || '');
            const availability = product.stock > 0 ? 'in stock' : 'out of stock';
            const price = `${product.price} NPR`;
            const link = `${baseUrl}/product/${product.slug}`;
            
            // Resolve the Sanity image format natively to a high-quality JPG URL
            const imageLink = product.mainImage 
                ? urlFor(product.mainImage).width(1200).format('jpg').url() 
                : '';

            return `
        <item>
            <g:id>${escapeXml(product._id)}</g:id>
            <g:title>${title}</g:title>
            <g:description>${description}</g:description>
            <g:link>${link}</g:link>
            <g:image_link>${escapeXml(imageLink)}</g:image_link>
            <g:brand>Dolakha furniture</g:brand>
            <g:condition>new</g:condition>
            <g:availability>${availability}</g:availability>
            <g:price>${price}</g:price>
        </item>`;
        }).join('');

        const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
        <title>Dolakha Furniture</title>
        <link>${baseUrl}</link>
        <description>Product Catalog for Dolakha Furniture</description>
${rssEntries}
    </channel>
</rss>`;

        return new NextResponse(xmlString, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                // Explicitly cache heavily on the Cloudflare Edge to prevent hammering the Sanity DB
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        console.error('Error generating Facebook Feed:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
