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
  
  // Fetch all profiles
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("role", { ascending: true });

  if (error) {
    console.error("Error fetching profiles:", error);
    return (
      <div className="p-12 text-center text-red-500 font-bold bg-red-50/50 rounded-3xl">
        Error loading user directory: {error.message}
      </div>
    );
  }

  return <AdminUsersClient initialProfiles={profiles || []} />;
}
