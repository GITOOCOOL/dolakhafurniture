import { NextResponse } from "next/server";
import { isSuperAdmin } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";

export async function PATCH(request: Request) {
  try {
    // ONLY the super admin can change roles
    const isAdmin = await isSuperAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
    }

    const { targetUserId, newRole } = await request.json();

    if (!targetUserId || !newRole) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", targetUserId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Role update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
