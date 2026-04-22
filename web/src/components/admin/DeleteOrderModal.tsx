"use client";

import { useState } from "react";
import { AlertOctagon, Trash2, CheckCircle2, RotateCcw, X } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { deleteOrder } from "@/app/actions/adminOrders";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";

interface DeleteOrderModalProps {
  order: Order | null;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export default function DeleteOrderModal({ order, onClose, onSuccess }: DeleteOrderModalProps) {
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [shouldRestoreStock, setShouldRestoreStock] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!order) return;
    setIsDeleting(true);
    try {
      const result = await deleteOrder(order._id, shouldRestoreStock);
      if (result.success) {
        onSuccess(order._id);
        setDeleteConfirmText("");
        onClose();
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Failed to delete order.");
    } finally {
      setIsDeleting(false);
    }
  };

  const currentOrderNumber = order?.orderNumber || (order?._id ? `#${order._id.slice(-6).toUpperCase()}` : "");
  const confirmMatch = deleteConfirmText === (order?.orderNumber ? `#${order.orderNumber}` : `#${order?._id.slice(-6).toUpperCase()}`);

  return (
    <Modal
      isOpen={!!order}
      onClose={() => !isDeleting && onClose()}
      title="Security Confirmation"
    >
      {order && (
        <div className="space-y-8 py-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/10 text-red-600 rounded-full flex items-center justify-center border border-red-500/20">
              <AlertOctagon size={32} />
            </div>
            <div>
              <h3 className="type-section text-lg uppercase font-bold tracking-widest text-heading">Permanent Order Deletion</h3>
              <p className="type-label text-label normal-case max-w-[250px] mx-auto mt-2 italic font-serif">
                This action cannot be undone. All data for 
                <span className="text-heading font-bold not-italic"> {currentOrderNumber}</span> will be purged.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Restore Stock Option */}
            <button 
              onClick={() => setShouldRestoreStock(!shouldRestoreStock)}
              className={`w-full flex flex-wrap items-center gap-4 p-5 rounded-[2rem] border transition-all ${shouldRestoreStock ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700" : "bg-surface border-soft text-label"}`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${shouldRestoreStock ? "bg-emerald-500 text-white" : "border-2 border-soft"}`}>
                {shouldRestoreStock && <CheckCircle2 size={14} />}
              </div>
              <div className="text-left flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest">Restore Stock Level</p>
                <p className="text-[9px] opacity-60 mt-1">
                  Add items back to inventory. 
                  <span className="block mt-1 text-action font-serif italic">Note: Skip this if the order used external partner stock.</span>
                </p>
              </div>
              <RotateCcw className={`opacity-40 ${shouldRestoreStock ? "animate-spin-slow" : ""}`} size={16} />
            </button>

            {/* ID Confirmation */}
            <div className="space-y-3">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-description ml-4">
                Type <span className="text-heading font-black">{currentOrderNumber}</span> to confirm
              </label>
              <input 
                type="text" 
                placeholder={currentOrderNumber}
                className="w-full bg-surface border border-soft rounded-2xl px-6 py-4 text-sm font-bold text-heading focus:outline-none focus:ring-1 focus:ring-red-500 transition-all text-center tracking-widest"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="ghost" fullWidth onClick={onClose} disabled={isDeleting}>Cancel</Button>
            <Button 
              variant="danger" 
              fullWidth 
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={!confirmMatch}
            >
              Delete Order
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
