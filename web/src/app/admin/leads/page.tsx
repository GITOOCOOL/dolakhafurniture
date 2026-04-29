import React from "react";
import { client } from "@/lib/sanity";
import { adminLeadsQuery } from "@/lib/queries";
import AdminLeadsClient from "@/components/admin/AdminLeadsClient";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const [leads, products] = await Promise.all([
    client.fetch(adminLeadsQuery, {}, { useCdn: false }),
    client.fetch(`*[_type == "product"] | order(title asc) { _id, title }`, {}, { useCdn: false })
  ]);

  return <AdminLeadsClient initialLeads={leads} products={products} />;
}
