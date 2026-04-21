import React from "react";
import { client } from "@/lib/sanity";
import { adminLeadsQuery } from "@/lib/queries";
import AdminLeadsClient from "@/components/admin/AdminLeadsClient";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await client.fetch(adminLeadsQuery, {}, { useCdn: false });

  return <AdminLeadsClient initialLeads={leads} />;
}
