"use client";

import { Download } from "lucide-react";

export default function DownloadButton({ 
  label = "Download Catalog",
  variant = "glass"
}: { 
  label?: string;
  variant?: "glass" | "outline";
}) {
  const handleDownload = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const baseStyles = "flex items-center gap-3 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all no-print";
  const variants = {
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
    outline: "bg-white border border-[#e5dfd3] text-[#3d2b1f] hover:bg-stone-50 shadow-sm"
  };

  return (
    <button
      onClick={handleDownload}
      className={`${baseStyles} ${variants[variant]}`}
    >
      <Download size={16} />
      {label}
    </button>
  );
}
