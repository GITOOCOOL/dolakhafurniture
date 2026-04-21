import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
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
        <header className="sticky top-0 z-40 bg-app/80 backdrop-blur-md border-b border-soft px-12 py-6 flex justify-between items-center">
          <h2 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-label">
            Admin Console <span className="opacity-30">/</span> Overview
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-soft border border-divider flex items-center justify-center text-[10px] font-bold text-heading">
                A
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-heading">
                Admin User
              </span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-12 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
