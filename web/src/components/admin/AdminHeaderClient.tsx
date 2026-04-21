"use client";

import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";
import { Menu } from "lucide-react";

export default function AdminHeaderClient() {
  const pathname = usePathname();
  const { setIsAdminSidebarOpen } = useUIStore();

  let pageTitle = "Overview";
  if (pathname?.includes("/inventory")) pageTitle = "Inventory";
  else if (pathname?.includes("/orders")) pageTitle = "Orders";
  else if (pathname?.includes("/inquiries")) pageTitle = "Inquiries";
  else if (pathname?.includes("/users")) pageTitle = "User Roles";

  return (
    <header className="sticky top-0 z-40 bg-app/80 backdrop-blur-md border-b border-soft px-6 md:px-12 py-4 md:py-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsAdminSidebarOpen(true)} 
          className="md:hidden p-2 -ml-2 text-heading hover:bg-soft rounded-lg transition-colors"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <h2 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-label hidden md:flex items-center gap-2">
          Admin Console <span className="opacity-30">/</span> <span className="text-heading">{pageTitle}</span>
        </h2>
        <h2 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-heading md:hidden">
          {pageTitle}
        </h2>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
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
  );
}
