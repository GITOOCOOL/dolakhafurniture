import React from "react";
import { client } from "@/lib/sanity";
import { adminOrdersQuery } from "@/lib/queries";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";
import { Order } from "@/types/order";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await client.fetch<Order[]>(adminOrdersQuery, {}, { useCdn: false });

  return <AdminOrdersClient initialOrders={orders} />;
}
