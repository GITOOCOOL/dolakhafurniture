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

    const { productId, field, value } = await request.json();

    if (!productId || !field) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prepare the patch object based on the field
    const patchData: any = {};
    patchData[field] = value;

    // Optional: if bumping stock up, update lastRestocked? 
    // We'll let the user manually or rely on hooks, but a simple check:
    // Actually, setting lastRestocked would require knowing the previous stock. We'll skip for now.

    const result = await sanityAdminClient
      .patch(productId)
      .set(patchData)
      .commit();

    return NextResponse.json({ success: true, product: result });
  } catch (error: any) {
    console.error("Inventory update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
