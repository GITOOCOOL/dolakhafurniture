import React from "react";
import { createClient } from "@/utils/supabase/server";
import { isSuperAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  // Only Super Admins can even VIEW this page
  const isAdmin = await isSuperAdmin();
  if (!isAdmin) {
    redirect("/admin");
  }

  const supabase = await createClient();
  
  // Initialize Admin Client for the shadow-realm scan
  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  
  // 1. Fetch all profiles from the DB
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .order("role", { ascending: true });

  // 2. Fetch the Master List from Auth (using Admin clearance)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
  const authUsers = authData?.users || [];

  if (profileError || authError) {
    console.error("User fetch error:", profileError || authError);
  }

  // 3. Merge them to ensure everyone is visible
  const mergedProfiles = authUsers.map(authUser => {
    const existingProfile = profiles?.find(p => p.id === authUser.id);
    return {
      id: authUser.id,
      email: authUser.email || "no-email",
      full_name: existingProfile?.full_name || authUser.user_metadata?.full_name || "Auth Orphan",
      role: existingProfile?.role || "Incomplete",
      avatar_url: existingProfile?.avatar_url || null,
      isOrphan: !existingProfile
    };
  });

  return <AdminUsersClient initialProfiles={mergedProfiles} />;
}
