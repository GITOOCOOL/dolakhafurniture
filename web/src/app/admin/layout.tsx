import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeaderClient from "@/components/admin/AdminHeaderClient";
import { getUserRole } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await getUserRole();
  const role = authData.role;
  const isAuthorized = role === "admin" || role === "staff";

  if (!isAuthorized) {
    redirect("/");
  }

  return (
    <div className="flex bg-app min-h-screen">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-screen relative overflow-y-auto">
        {/* HEADER - Minimal & Floating */}
        <AdminHeaderClient />

        {/* PAGE CONTENT */}
        <div className="p-12 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
