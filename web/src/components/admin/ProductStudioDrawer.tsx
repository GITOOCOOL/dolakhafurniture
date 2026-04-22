"use client";

import { useState, useEffect } from "react";
import { X, Camera, Ruler, Type, Tag, Package, Save, PlusCircle, CheckCircle2, AlertCircle, EyeOff, Facebook, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { uploadArtisanImage } from "@/app/actions/adminOrders";
import { createArtisanProduct, updateArtisanProduct } from "@/app/actions/adminInventory";

interface Category {
  _id: string;
  title: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  isActive: boolean;
  syncToFacebook: boolean;
  length?: number;
  breadth?: number;
  height?: number;
  description?: string;
  categoryId?: string;
  imageUrl?: string;
}

interface ProductStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null; // null means "Create Mode"
  categories: Category[];
  onSuccess: () => void;
}

export default function ProductStudioDrawer({
  isOpen,
  onClose,
  product,
  categories,
  onSuccess,
}: ProductStudioDrawerProps) {
  const isEdit = !!product;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    categoryId: "",
    length: "",
    breadth: "",
    height: "",
    description: "",
    imageAssetId: "",
    imageUrl: "",
    isActive: true,
    syncToFacebook: true
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "0",
        categoryId: product.categoryId || "",
        length: product.length?.toString() || "",
        breadth: product.breadth?.toString() || "",
        height: product.height?.toString() || "",
        description: product.description || "",
        imageAssetId: "",
        imageUrl: product.imageUrl || "",
        isActive: product.isActive,
        syncToFacebook: product.syncToFacebook || false
      });
    } else {
      setFormData({
        title: "",
        price: "",
        stock: "0",
        categoryId: categories[0]?._id || "",
        length: "",
        breadth: "",
        height: "",
        description: "",
        imageAssetId: "",
        imageUrl: "",
        isActive: true,
        syncToFacebook: true
      });
    }
    setError(null);
    setSuccess(false);
  }, [product, isOpen, categories]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const result = await uploadArtisanImage(uploadData);
      if (result.success && result.assetId) {
        setFormData(prev => ({ 
          ...prev, 
          imageAssetId: result.assetId!,
          imageUrl: result.url || prev.imageUrl 
        }));
      } else {
        setError("Failed to upload portrait.");
      }
    } catch (err) {
      setError("Upload interruption.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (isEdit && product) {
        result = await updateArtisanProduct(product._id, formData);
      } else {
        result = await createArtisanProduct(formData);
      }

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.error || "Forge failed.");
      }
    } catch (err) {
      setError("System interruption.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-heading/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-app shadow-2xl z-[101] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-soft flex items-center justify-between bg-surface/50">
              <div>
                <h2 className="text-2xl font-serif italic text-heading flex items-center gap-3">
                  {isEdit ? <Package size={24} className="text-action" /> : <PlusCircle size={24} className="text-action" />}
                  {isEdit ? "Refine Product" : "Forge New Piece"}
                </h2>
                <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-label mt-1">
                   Artisan Studio Suite
                </p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-soft rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-12">
              
              {/* IMAGE SECTION */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-label flex items-center gap-2">
                  <Camera size={14} /> Product Portrait
                </h3>
                <div className="relative group aspect-video bg-soft/30 rounded-[2rem] border-2 border-dashed border-soft overflow-hidden flex items-center justify-center transition-all hover:border-action">
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-heading/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-heading px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
                          Change Image
                          <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-3 w-full h-full justify-center">
                      <div className="p-6 bg-white rounded-full shadow-sm text-action">
                        {isUploading ? <RefreshCw className="animate-spin" size={24} /> : <PlusCircle size={24} />}
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-label">
                        {isUploading ? "Uploading..." : "Click to add main photo"}
                      </p>
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  )}
                </div>
              </div>

              {/* IDENTITY SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4 flex items-center gap-2">
                    <Type size={12} /> Product Title
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-surface border border-soft rounded-2xl px-6 py-4 text-sm font-bold text-heading focus:outline-none focus:ring-1 focus:ring-action"
                    placeholder="E.g. Heritage Teak Chair"
                  />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4 flex items-center gap-2">
                      <Tag size={12} /> Collection Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full bg-surface border border-soft rounded-2xl px-6 py-4 text-sm font-bold text-heading appearance-none focus:outline-none focus:ring-1 focus:ring-action"
                    >
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.title}</option>
                      ))}
                    </select>
                </div>
              </div>

              {/* VALUE & STOCK SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4 flex items-center gap-2">
                    Price (Rs.)
                  </label>
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full bg-surface border border-soft rounded-2xl px-6 py-4 text-sm font-bold text-heading focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4 flex items-center gap-2">
                        Inventory Count
                    </label>
                    <input 
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      className="w-full bg-surface border border-soft rounded-2xl px-6 py-4 text-sm font-bold text-heading focus:outline-none"
                      placeholder="0"
                    />
                </div>
              </div>

              {/* SPECIFICATIONS SECTION */}
              <div className="space-y-6">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-label flex items-center gap-2">
                  <Ruler size={14} /> Dimensional Registry (inches)
                </h3>
                <div className="grid grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <input 
                        type="number"
                        value={formData.length}
                        onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                        className="w-full bg-app border border-soft rounded-xl px-4 py-3 text-sm font-bold text-heading text-center"
                        placeholder="L"
                      />
                      <p className="text-[9px] text-center uppercase tracking-tighter text-label font-bold">Length</p>
                   </div>
                   <div className="space-y-2">
                      <input 
                        type="number"
                        value={formData.breadth}
                        onChange={(e) => setFormData(prev => ({ ...prev, breadth: e.target.value }))}
                        className="w-full bg-app border border-soft rounded-xl px-4 py-3 text-sm font-bold text-heading text-center"
                        placeholder="B"
                      />
                      <p className="text-[9px] text-center uppercase tracking-tighter text-label font-bold">Breadth</p>
                   </div>
                   <div className="space-y-2">
                      <input 
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                        className="w-full bg-app border border-soft rounded-xl px-4 py-3 text-sm font-bold text-heading text-center"
                        placeholder="H"
                      />
                      <p className="text-[9px] text-center uppercase tracking-tighter text-label font-bold">Height</p>
                   </div>
                </div>
              </div>

              {/* STORY SECTION */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4">
                   Artisan Narrative (Description)
                </label>
                <textarea 
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-surface border border-soft rounded-[2rem] px-8 py-6 text-sm font-medium text-heading focus:outline-none focus:ring-1 focus:ring-action resize-none placeholder:italic"
                  placeholder="Tell the story of this piece..."
                />
              </div>

              {/* VISIBILITY & SYNC SECTION */}
              <div className="grid grid-cols-2 gap-6 p-6 bg-surface/50 rounded-[2rem] border border-soft">
                 <button
                   type="button"
                   onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                   className={`flex items-center gap-3 p-4 rounded-xl transition-all border ${formData.isActive ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600' : 'bg-soft border-transparent text-label opacity-60'}`}
                 >
                    {formData.isActive ? <CheckCircle2 size={18} /> : <EyeOff size={18} />}
                    <div className="text-left">
                       <p className="text-xs font-bold uppercase tracking-widest">Web Visibility</p>
                       <p className="text-[10px] opacity-70 italic font-serif leading-none">{formData.isActive ? 'Active on Storefront' : 'Hidden from Client'}</p>
                    </div>
                 </button>

                 <button
                   type="button"
                   onClick={() => setFormData(prev => ({ ...prev, syncToFacebook: !prev.syncToFacebook }))}
                   className={`flex items-center gap-3 p-4 rounded-xl transition-all border ${formData.syncToFacebook ? 'bg-blue-500/5 border-blue-500/20 text-blue-600' : 'bg-soft border-transparent text-label opacity-60'}`}
                 >
                    <Facebook size={18} />
                    <div className="text-left">
                       <p className="text-xs font-bold uppercase tracking-widest">Meta Sync</p>
                       <p className="text-[10px] opacity-70 italic font-serif leading-none">{formData.syncToFacebook ? 'Catalog Connected' : 'Manual Registry only'}</p>
                    </div>
                 </button>
              </div>

            </form>

            {/* Footer Actions */}
            <div className="p-8 border-t border-soft bg-surface/50 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-xs font-bold uppercase tracking-widest">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 text-xs font-bold uppercase tracking-widest">
                  <CheckCircle2 size={14} /> Product successfully {isEdit ? "Refined" : "Forged"}
                </div>
              )}

              <div className="flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isSubmitting}>
                   Abort Changes
                </Button>
                <Button 
                  className="flex-[2]" 
                  type="submit" 
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  leftIcon={<Save size={16} />}
                >
                  {isEdit ? "Commit Refinements" : "Launch in Collection"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


