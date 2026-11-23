import "server-only";
import { createClient } from "next-sanity";

// The dataset is private: every read needs a token, so this file is server-only.
// Browser components get their data through server actions in app/actions/publicData.ts.
// SANITY_API_READ_TOKEN should be a Viewer token; the write token is a fallback
// until that one exists.
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6iov2to",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-11",
  useCdn: false,
  perspective: "published", // with a token, drafts would otherwise be readable
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
  fetch: {
    cache: "no-store",
  },
});

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6iov2to",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-11",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export { urlFor } from "./sanityImage";
