"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Camera, 
  Ruler, 
  Type, 
  Tag, 
  Package, 
  Save, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  EyeOff, 
  Facebook, 
  RefreshCw,
  Image as ImageIcon,
  Trash2,
  Plus
} from "lucide-react";
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
  costPrice?: number;
  stock: number;
  isActive: boolean;
  syncToFacebook: boolean;
  length?: number;
  breadth?: number;
  height?: number;
  description?: string;
  categoryId?: string;
  imageUrl?: string;
  galleryImages?: string[];
}

interface ProductStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
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
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    costPrice: "",
    stock: "",
    categoryId: "",
    length: "",
    breadth: "",
    height: "",
    description: "",
    imageAssetId: "",
    imageUrl: "",
    galleryAssetIds: [] as string[],
    galleryUrls: [] as string[],
    isActive: true,
    syncToFacebook: true
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        price: product.price?.toString() || "",
        costPrice: product.costPrice?.toString() || "",
        stock: product.stock?.toString() || "0",
        categoryId: product.categoryId || "",
        length: product.length?.toString() || "",
        breadth: product.breadth?.toString() || "",
        height: product.height?.toString() || "",
        description: product.description || "",
        imageAssetId: "",
        imageUrl: product.imageUrl || "",
        galleryAssetIds: [], // We don't have asset IDs for existing images easily, but we can handle it
        galleryUrls: product.galleryImages || [],
        isActive: product.isActive,
        syncToFacebook: product.syncToFacebook || false
      });
    } else {
      setFormData({
        title: "",
        price: "",
        costPrice: "",
        stock: "0",
        categoryId: categories[0]?._id || "",
        length: "",
        breadth: "",
        height: "",
        description: "",
        imageAssetId: "",
        imageUrl: "",
        galleryAssetIds: [],
        galleryUrls: [],
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

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const uploadData = new FormData();
        uploadData.append("image", files[i]);
        const result = await uploadArtisanImage(uploadData);
        if (result.success && result.assetId) {
          setFormData(prev => ({
            ...prev,
            galleryAssetIds: [...prev.galleryAssetIds, result.assetId!],
            galleryUrls: [...prev.galleryUrls, result.url!]
          }));
        }
      }
    } catch (err) {
      setError("Gallery upload failed.");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => {
      const newUrls = [...prev.galleryUrls];
      const newAssetIds = [...prev.galleryAssetIds];
      
      // If it's a new upload (we have assetId), remove it from assetIds too
      // This is simplified; in a real app you'd need to map url -> assetId
      newUrls.splice(index, 1);
      if (newAssetIds.length > index) {
          newAssetIds.splice(index, 1);
      }
      
      return {
        ...prev,
        galleryUrls: newUrls,
        galleryAssetIds: newAssetIds
      };
    });
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
        setError(result.error || "Failed to save.");
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-heading/40 backdrop-blur-sm z-[100]"
          />

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
                  {isEdit ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-label mt-1">
                   Product Management
                </p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-soft rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-12 pb-32">
              
              {/* MAIN IMAGE SECTION */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-label flex items-center gap-2">
                  <Camera size={14} /> Product Image
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

              {/* GALLERY SECTION */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-label flex items-center gap-2">
                  <ImageIcon size={14} /> Gallery / Carousel Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.galleryUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-soft group">
                      <img src={url} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square bg-soft/30 rounded-2xl border-2 border-dashed border-soft flex flex-col items-center justify-center cursor-pointer hover:border-action transition-all">
                    {isUploadingGallery ? <RefreshCw className="animate-spin text-action" size={20} /> : <Plus size={20} className="text-label" />}
                    <span className="text-[8px] font-bold uppercase tracking-widest text-label mt-2">{isUploadingGallery ? "Uploading" : "Add More"}</span>
                    <input type="file" multiple className="hidden" onChange={handleGalleryUpload} accept="image/*" />
                  </label>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4 flex items-center gap-2">
                    Selling Price (Rs.)
                  </label>
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full bg-surface border border-soft rounded-2xl px-6 py-4 text-sm font-bold text-heading focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4 flex items-center gap-2">
                    Cost Price (Rs.)
                  </label>
                  <input 
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                    className="w-full bg-surface border border-soft rounded-2xl px-6 py-4 text-sm font-bold text-heading focus:outline-none"
                    placeholder="0"
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
                  <Ruler size={14} /> Dimensions (inches)
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
                   Description
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
                  <CheckCircle2 size={14} /> Product successfully {isEdit ? "Updated" : "Added"}
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
                  {isEdit ? "Save Changes" : "Add Product"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
