"use client";

import { useUIStore } from "@/store/useUIStore";
import Modal from "./ui/Modal";
import ProductDetail from "./ProductDetail";
import { useEffect } from "react";
import { logPulse } from "@/app/actions/pulse";
import { BusinessMetaData } from "@/types";

export default function ProductQuickView({ businessMetaData }: { businessMetaData?: BusinessMetaData | null }) {
  const { viewingProduct, setViewingProduct } = useUIStore();

  useEffect(() => {
    if (viewingProduct) {
      // Get session from localStorage to link this modal view to their main visit
      const sessionID = localStorage.getItem("dolakha_session_id") || "modal_session";
      
      logPulse({
        path: `/product/${viewingProduct.slug}`,
        sessionID,
        eventType: "product_view",
        eventData: { 
          slug: viewingProduct.slug,
          source: "modal_quickview",
          title: viewingProduct.title
        },
        referrer: window.location.pathname,
        location: Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || "unknown",
      });
    }
  }, [viewingProduct]);

  if (!viewingProduct) return null;

  return (
    <Modal
      isOpen={!!viewingProduct}
      onClose={() => setViewingProduct(null)}
      title={viewingProduct.title}
      position="bottom"
      className="sm:max-w-7xl !p-0 sm:h-[calc(100dvh-var(--header-height,5rem))]"
      noPadding
    >
      <div className="relative w-full h-full bg-app/80 backdrop-blur-3xl">
        <ProductDetail product={viewingProduct} variant="modal" businessMetaData={businessMetaData} />
      </div>
    </Modal>
  );
}
