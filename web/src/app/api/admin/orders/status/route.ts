import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/auth";
import { sanityAdminClient } from "@/lib/sanity.admin";

export async function PATCH(request: Request) {
  try {
    const isAuthorized = await isAuthorizedAdmin();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await sanityAdminClient
      .patch(orderId)
      .set({ status })
      .commit();

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Order status update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
