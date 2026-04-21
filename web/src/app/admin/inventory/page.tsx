import React from "react";
import { client } from "@/lib/sanity";
import AdminInventoryClient from "@/components/admin/AdminInventoryClient";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const products = await client.fetch(
    `*[_type == "product"] | order(category->title asc, title asc) {
      _id,
      title,
      price,
      stock,
      isActive,
      syncToFacebook,
      "category": category->title,
      "imageUrl": mainImage.asset->url
    }`,
    {},
    { useCdn: false }
  );

  return <AdminInventoryClient initialProducts={products} />;
}
