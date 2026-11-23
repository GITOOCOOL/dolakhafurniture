import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

// Image URLs need only the project and dataset, never a token, so this file is
// safe to import from browser components. Sanity image files stay public even
// when the dataset is private.
const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6iov2to",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
