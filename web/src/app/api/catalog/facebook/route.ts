import { client } from "@/lib/sanity";
import { allProductsQuery } from "@/lib/queries";
import { Product } from "@/types";
import { urlFor } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export async function GET() {
  const products: Product[] = await client.fetch(allProductsQuery);
  const DOMAIN = "https://dolakhafurniture.com";
  const CURRENCY = "NPR";

  const xmlItems = products
    .filter((p) => p.mainImage && p.price && p.slug) // Only sync products that have the essentials
    .map((product) => {
      const title = product.title || "Untitled Product";
      const description = product.description || `High-quality handcrafted ${product.category?.title || "furniture"} from Dolakha Furniture. material: ${product.material || "Artisanal Wood"}.`;
      const availability = product.stock && product.stock > 0 ? "in stock" : "out of stock";
      const imageLink = urlFor(product.mainImage).width(1200).url();
      
      return `
    <item>
      <g:id>${product._id}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${DOMAIN}/product/${product.slug}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:brand>Dolakha Furniture</g:brand>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${product.price}.00 ${CURRENCY}</g:price>
      <g:google_product_category>603</g:google_product_category>
      <g:material>${product.material || "Wood"}</g:material>
      <g:quantity_to_sell>${product.stock || 0}</g:quantity_to_sell>
    </item>`;
    })
    .join("");

  const rssFeed = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Dolakha Furniture Product Catalog</title>
    <link>${DOMAIN}</link>
    <description>Artisanal, handcrafted furniture from Nepal.</description>
    ${xmlItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
