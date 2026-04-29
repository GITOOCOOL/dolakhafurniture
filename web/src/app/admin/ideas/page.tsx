import React from "react";
import { client } from "@/lib/sanity";
import { adminContentIdeasQuery } from "@/lib/queries";
import AdminContentIdeasClient from "@/components/admin/AdminContentIdeasClient";

export const dynamic = "force-dynamic";

export default async function AdminContentIdeasPage() {
  const ideas = await client.fetch(adminContentIdeasQuery, {}, { useCdn: false });

  return <AdminContentIdeasClient initialIdeas={ideas} />;
}
