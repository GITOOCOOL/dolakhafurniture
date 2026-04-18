"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Campaign } from "@/types";
import { Download } from "lucide-react";
import { CampaignPDF } from "./CampaignPDF";

// Dynamically import PDF components to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface Props {
  campaign: Campaign;
  label: string;
  className?: string;
  variant?: "glass" | "outline";
}

export default function PDFDownloadButton({ campaign, label, className = "", variant = "glass" }: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const baseStyles = "flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 no-print";
  
  const variants = {
    glass: "bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60",
    outline: "bg-white border border-[#e5dfd3] text-[#3d2b1f] hover:bg-stone-50 shadow-sm"
  };

  if (!isClient) return null;

  return (
    <div className={className}>
      <PDFDownloadLink
        document={<CampaignPDF campaign={campaign} />}
        fileName={`${campaign.slug}-catalog.pdf`}
        className="block"
      >
        {({ loading }) => (
          <div className={`${baseStyles} ${variants[variant]}`}>
            <Download size={14} className={loading ? "animate-bounce" : ""} />
            {loading ? "Generating..." : label}
          </div>
        )}
      </PDFDownloadLink>
    </div>
  );
}
