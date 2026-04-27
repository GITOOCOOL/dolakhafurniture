"use client";

import { useUIStore } from "@/store/useUIStore";
import Modal from "./ui/Modal";
import ProductDetail from "./ProductDetail";
import { X } from "lucide-react";

export default function ProductQuickView() {
  const { viewingProduct, setViewingProduct } = useUIStore();

  if (!viewingProduct) return null;

  return (
    <Modal
      isOpen={!!viewingProduct}
      onClose={() => setViewingProduct(null)}
      title={viewingProduct.title}
      position="bottom"
      className="sm:max-w-7xl !p-0 sm:h-[85dvh]"
      noPadding
    >
      <div className="relative w-full h-full bg-app/80 backdrop-blur-3xl">
        <ProductDetail product={viewingProduct} variant="modal" />
      </div>
    </Modal>
  );
}
