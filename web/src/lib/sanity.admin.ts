import { createClient } from "next-sanity";

export const sanityAdminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6iov2to",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-11",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, // This must be set for status updates
});
