"use server";

import { createClient } from "@supabase/supabase-js";
import { isSuperAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Initialize Supabase Admin Client (Service Role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function addStaffMember(data: {
  email: string;
  fullName: string;
  role: string;
}) {
  try {
    // 1. Security Check: Only Super Admins can add staff
    const isAdmin = await isSuperAdmin();
    if (!isAdmin) {
      return { success: false, message: "Unauthorized. Super Admin access required." };
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, message: "System Error: Service Role Key is not configured." };
    }

    // 2. Create User in Auth
    // We generate a secure temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + "Art1san!";
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: data.fullName }
    });

    if (authError) throw authError;

    // 3. Update the Profile Role
    // Profiles are usually created via DB trigger, so we update the existing row
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ 
        role: data.role.toLowerCase(),
        full_name: data.fullName
      })
      .eq("id", authData.user.id);

    if (profileError) {
      // If update fails, maybe the trigger hasn't finished or doesn't exist
      // We attempt a direct insert just in case
      await supabaseAdmin
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          role: data.role.toLowerCase()
        });
    }

    revalidatePath("/admin/users");

    return { 
      success: true, 
      tempPassword,
      email: data.email
    };
  } catch (error: any) {
    console.error("Staff Onboarding Error:", error);
    return { success: false, message: error.message || "Failed to onboard new staff member." };
  }
}
