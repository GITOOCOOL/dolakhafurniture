import { cache } from "react";
import { client } from "@/lib/sanity";
import { businessMetaDataQuery } from "@/lib/queries";
import { BusinessMetaData } from "@/types";

// One Sanity request per page visit: React's cache() remembers the result for the
// rest of this request, so layout.tsx (metadata + frame) and page.tsx share it.
export const getBusinessMetaData = cache(async () => {
  const data = (await client.fetch<BusinessMetaData>(businessMetaDataQuery)) || null;
  // Customers see blanks for missing fields (lib/missing.ts); this makes them visible in the logs.
  const required = ["businessName", "tagline", "phone", "whatsapp", "businessUrl", "googleMapsUrl"] as const;
  const missing = data ? required.filter((k) => !data[k]) : ["the whole document"];
  if (missing.length) console.warn(`[businessMetaData] empty in Sanity Studio: ${missing.join(", ")}`);
  return data;
});
