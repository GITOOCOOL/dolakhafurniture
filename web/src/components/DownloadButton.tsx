"use client";

import { Download } from "lucide-react";

export default function DownloadButton({ 
  label = "Download Catalog",
  variant = "glass",
  className
}: { 
  label?: string;
  variant?: "glass" | "outline";
  className?: string;
}) {
  const handleDownload = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const baseStyles = "flex items-center gap-3 px-6 py-3 rounded-full type-action transition-all no-print";
  const variants = {
    glass: "bg-surface border border-soft text-heading hover:bg-app",
    outline: "bg-surface border border-soft text-heading hover:opacity-80 shadow-sm"
  };

  return (
    <button
      onClick={handleDownload}
      className={`${baseStyles} ${variants[variant]} ${className || ""}`}
    >
      <Download size={16} />
      {label}
    </button>
  );
}
