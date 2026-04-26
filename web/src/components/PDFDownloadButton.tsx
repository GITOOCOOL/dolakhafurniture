"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Campaign, Voucher } from "@/types";
import { Download } from "lucide-react";
import { CampaignPDF } from "./CampaignPDF";

// Dynamically import PDF components to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface Props {
  campaign: Campaign;
  firstOrderVoucher?: Voucher | null;
  label: string;
  className?: string;
  variant?: "glass" | "outline";
}

export default function PDFDownloadButton({ campaign, firstOrderVoucher, label, className = "", variant = "glass" }: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const baseStyles = "flex items-center gap-3 px-6 py-2.5 rounded-full type-action transition-all shadow-md active:scale-95 no-print";
  
  const variants = {
    glass: "bg-invert text-app hover:bg-action hover:text-white border border-soft",
    outline: "bg-surface border border-soft text-heading hover:bg-stone-muted/10 shadow-sm"
  };

  if (!isClient) return null;

  return (
    <div className={className}>
      <PDFDownloadLink
        document={<CampaignPDF campaign={campaign} firstOrderVoucher={firstOrderVoucher} />}
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
