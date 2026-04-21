import { NextResponse } from "next/server";
import { sanityAdminClient } from "@/lib/sanity.admin";
import { getUserRole } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const authData = await getUserRole();
    const role = authData.role;
    
    // Only admins or staff can update inventory
    if (role !== "admin" && role !== "staff") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, field, value, operation } = await request.json();

    if (!productId || !field) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let transaction = sanityAdminClient.patch(productId);

    if (operation === "inc") {
      transaction = transaction
        .inc({ [field]: value })
        .set({ lastRestocked: new Date().toISOString() });
    } else {
      transaction = transaction.set({ [field]: value });
    }

    const result = await transaction.commit();

    return NextResponse.json({ success: true, product: result });
  } catch (error: any) {
    console.error("Inventory update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
