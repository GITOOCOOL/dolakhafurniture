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

    if (authError) {
      console.error("Auth Creation Error:", authError);
      return { 
        success: false, 
        message: authError.message.includes("already registered") 
          ? "This email is already registered in the system." 
          : `Auth Error: ${authError.message}` 
      };
    }

    if (!authData.user) {
      return { success: false, message: "User creation failed: No user data returned." };
    }

    // 3. Ensure the Profile exists with the correct role
    // We try an upsert here to be absolutely safe against race conditions with DB triggers
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({ 
        id: authData.user.id,
        email: data.email,
        role: data.role.toLowerCase(),
        full_name: data.fullName
      }, { onConflict: 'id' });

    if (profileError) {
      console.error("Profile Creation Error:", profileError);
      return { success: false, message: `Profile Link Error: ${profileError.message}` };
    }

    revalidatePath("/admin/users");

    return { 
      success: true, 
      tempPassword,
      email: data.email
    };
  } catch (error: any) {
    console.error("Staff Onboarding System Failure:", error);
    return { success: false, message: error.message || "A system error occurred during recruitment." };
  }
}
