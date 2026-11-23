import { cache } from "react";
import { client } from "@/lib/sanity";
import { businessMetaDataQuery } from "@/lib/queries";
import { BusinessMetaData } from "@/types";

// One Sanity request per page visit: React's cache() remembers the result for the
// rest of this request, so layout.tsx (metadata + frame) and page.tsx share it.
export const getBusinessMetaData = cache(async () =>
  (await client.fetch<BusinessMetaData>(businessMetaDataQuery)) || null,
);
