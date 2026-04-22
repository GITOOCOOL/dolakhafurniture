import React from "react";
import { client } from "@/lib/sanity";
import AdminInventoryClient from "@/components/admin/AdminInventoryClient";
// Pre-flight check for AdminInventoryClient module resolution

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const [products, categories] = await Promise.all([
    client.fetch(
      `*[_type == "product"] | order(category->title asc, title asc) {
        _id,
        title,
        price,
        stock,
        isActive,
        syncToFacebook,
        length,
        breadth,
        height,
        description,
        "category": category->title,
        "categoryId": category->_id,
        "imageUrl": mainImage.asset->url
      }`,
      {},
      { useCdn: false }
    ),
    client.fetch(`*[_type == "category"] | order(title asc) { _id, title }`)
  ]);

  return <AdminInventoryClient initialProducts={products} categories={categories} />;
}
