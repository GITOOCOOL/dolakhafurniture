import React from "react";
import { client } from "@/lib/sanity";
import { adminInquiriesQuery } from "@/lib/queries";
import AdminInquiriesClient from "@/components/admin/AdminInquiriesClient";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await client.fetch(adminInquiriesQuery, {}, { useCdn: false });

  return <AdminInquiriesClient initialInquiries={inquiries} />;
}
