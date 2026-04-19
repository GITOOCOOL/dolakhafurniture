import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { facebookMelaProductsQuery } from "@/lib/queries";
import { Product } from "@/types";
import { urlFor } from "@/lib/sanity";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function GET() {
  try {
    const products: Product[] = await client.fetch(facebookMelaProductsQuery);
    const melaProducts = Array.isArray(products) ? products : [];
    
    const DOMAIN = "https://dolakhafurniture.com";
    const CURRENCY = "NPR";

    const xmlItems = melaProducts
      .filter(
        (p) => p.syncToFacebook === true && p.mainImage && p.price && p.slug,
      ) // Only sync manually approved and complete products
      .map((product) => {
        const title = escapeXml(product.title || "Untitled Product");
        // Sanitize ID: Remove Sanity drafts prefix to ensure match with tracker ID
        const cleanId = product._id.replace("drafts.", "");
        
        const description = escapeXml(
          product.description ||
            `High-quality handcrafted ${product.category?.title || "furniture"} from Dolakha Furniture. Material: ${product.material || " Wood"}.`,
        );
        const availability =
          product.stock && product.stock > 0
            ? "in stock"
            : "available for order";
        const imageLink = escapeXml(
          urlFor(product.mainImage).width(1200).url(),
        );

        return `
      <item>
        <g:id>${escapeXml(cleanId)}</g:id>
        <g:title><![CDATA[${title}]]></g:title>
        <g:description><![CDATA[${description}]]></g:description>
        <g:link>${escapeXml(`${DOMAIN}/product/${product.slug}`)}</g:link>
        <g:image_link>${imageLink}</g:image_link>
        <g:brand>Dolakha Furniture</g:brand>
        <g:condition>new</g:condition>
        <g:availability>${availability}</g:availability>
        <g:price>${product.price}.00 ${CURRENCY}</g:price>
        <g:google_product_category>603</g:google_product_category>
        <g:material>${escapeXml(product.material || "Wood")}</g:material>
        <g:quantity_to_sell>${product.stock || 0}</g:quantity_to_sell>
      </item>`;
      })
      .join("");

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Dolakha Furniture Product Catalog</title>
    <link>${DOMAIN}</link>
    <description>, handcrafted furniture from Nepal.</description>
    ${xmlItems}
  </channel>
</rss>`;

    return new NextResponse(rssFeed, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Facebook Feed Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
