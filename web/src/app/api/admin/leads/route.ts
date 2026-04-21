import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/auth";
import { sanityAdminClient } from "@/lib/sanity.admin";

export async function PATCH(request: Request) {
  try {
    const isAuthorized = await isAuthorizedAdmin();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { leadId, ...updates } = await request.json();

    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId" }, { status: 400 });
    }

    const result = await sanityAdminClient
      .patch(leadId)
      .set(updates)
      .commit();

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Lead update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
