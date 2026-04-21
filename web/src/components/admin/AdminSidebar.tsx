import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  Users, 
  Settings, 
  ChevronRight,
  LogOut,
  Store
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "User Roles", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  return (
    <aside className="w-72 bg-app border-r border-soft min-h-screen flex flex-col sticky top-0">
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
          className="w-full flex items-center gap-4 px-6 py-4 rounded-full text-red-500/70 hover:text-red-500 transition-all font-sans font-bold uppercase tracking-widest text-[10px]"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
