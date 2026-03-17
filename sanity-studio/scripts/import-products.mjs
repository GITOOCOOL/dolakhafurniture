import fs from "node:fs/promises";
import { createClient } from "sanity";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const apiVersion = "2024-03-11";

const token = process.env.SANITY_IMPORT_TOKEN;

if (!token) {
  console.error(
    "Missing SANITY_IMPORT_TOKEN. Create a token with write access in Sanity manage and set it before running:\n" +
    "  SANITY_IMPORT_TOKEN=xxx node scripts/import-products.mjs"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

async function ensureImageAsset() {
  // Simple: always upload once per run; Sanity dedupes by file hash internally.
  const imageUrl =
    "https://images.pexels.com/photos/2112655/pexels-photo-2112655.jpeg?auto=compress&cs=tinysrgb&w=800";

  console.log("Fetching sample image from internet…");
  const res = await fetch(imageUrl);
  if (!res.ok || !res.body) {
    throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
  }

  console.log("Uploading image to Sanity assets…");
  const asset = await client.assets.upload("image", res.body, {
    filename: "dolakha-gamala-stand.jpg",
  });

  console.log("Uploaded image asset:", asset._id);
  return asset;
}

async function main() {
  const jsonPath = new URL("./products-import.json", import.meta.url);
  const raw = await fs.readFile(jsonPath, "utf8");
  const items = JSON.parse(raw);

  console.log(`Loaded ${items.length} products from JSON.`);

  const asset = await ensureImageAsset();

  const tx = client.transaction();

  for (const item of items) {
    tx.create({
      _type: "product",
      title: item.title,
      slug: {
        _type: "slug",
        current: item.slug,
      },
      price: item.price,
      mainImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      },
      category: item.category,
      description: item.description,
      stock: item.stock,
      isFeatured: item.isFeatured,
    });
  }

  console.log("Committing transaction…");
  await tx.commit();
  console.log("Done. Products created in Sanity.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

