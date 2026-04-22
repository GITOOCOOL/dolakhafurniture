"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  TrendingUp,
  Users, 
  Settings, 
  ChevronRight,
  LogOut,
  Store,
  Box
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inventory", href: "/admin/inventory", icon: Box },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Service Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Sales Leads", href: "/admin/leads", icon: TrendingUp },
  { label: "User Roles", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const { isAdminSidebarOpen, setIsAdminSidebarOpen } = useUIStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Toggle behavior: automatically close drawer on mobile after navigation, 
  // but leave it alone on desktop unless explicitly toggled.
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsAdminSidebarOpen(false);
    }
  }, [pathname, setIsAdminSidebarOpen]);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-heading/20 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${isAdminSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsAdminSidebarOpen(false)}
      />

      <aside className={`bg-app border-r border-soft h-[100dvh] flex flex-col fixed md:sticky top-0 z-[70] overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isAdminSidebarOpen ? "w-72 translate-x-0 shadow-2xl md:shadow-none" : "w-0 -translate-x-full shadow-none"}`}>
      {/* BRANDING */}
      <div className="p-8 border-b border-soft border-dotted">
        <Link href="/admin" className="block text-2xl font-serif italic font-bold text-heading">
          Dolakha <span className="text-action">Admin.</span>
        </Link>
        <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-label mt-2">
          Management Portal
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between px-6 py-4 rounded-full text-heading hover:bg-soft transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <item.icon size={18} className="text-label group-hover:text-action transition-colors" />
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest">
                {item.label}
              </span>
            </div>
            <ChevronRight size={14} className="text-label opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </Link>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-6 border-t border-soft border-dotted space-y-2">
        <Link
          href="/"
          className="flex items-center gap-4 px-6 py-4 rounded-full text-label hover:text-heading transition-all"
        >
          <Store size={18} />
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest">
            Back to Store
          </span>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-full text-red-500/70 hover:text-red-500 transition-all font-sans font-bold uppercase tracking-widest text-[10px]"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
    </>
  );
}
