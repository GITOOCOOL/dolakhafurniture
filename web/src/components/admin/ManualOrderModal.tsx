"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Minus, 
  Search, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Store,
  Info
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createManualOrder, ManualOrderItem, uploadArtisanImage } from "@/app/actions/adminOrders";
import { validateVoucher } from "@/app/actions/vouchers";
import { activeVouchersQuery, allMaterialsQuery } from "@/lib/queries";
import { client } from "@/lib/sanity";
import Image from "next/image";
import { Tag, Ticket, Sparkles, Sliders, ChevronDown } from "lucide-react";

interface ManualOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ManualOrderModal({ isOpen, onClose, onSuccess }: ManualOrderModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Step 1: Product Selection State
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ManualOrderItem[]>([]);

  // Step 2 & 3: Customer Data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Bagmati",
    orderSource: "walk-in",
    internalNotes: "",
    advanceDeposit: 0
  });

  // Discount/Voucher State
  const [voucherInput, setVoucherInput] = useState("");
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
  const [appliedVouchers, setAppliedVouchers] = useState<any[]>([]);
  const [manualDiscount, setManualDiscount] = useState<number>(0);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);

  // Custom Product Studio State
  const [isCustomStudioOpen, setIsCustomStudioOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const [customProduct, setCustomProduct] = useState({
    title: "",
    price: "",
    material: "Solid Wood",
    color: "",
    length: "",
    breadth: "",
    height: "",
    description: "",
    imageAssetId: "",
    imageUrl: "",
    formicaId: "",
    fabricId: ""
  });

  // Fetch available vouchers on open
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [vouchers, mats, prods] = await Promise.all([
            client.fetch(activeVouchersQuery),
            client.fetch(allMaterialsQuery),
            client.fetch(`*[_type == "product" && isActive == true] {
              _id, title, price, "imageUrl": mainImage.asset->url, stock, category->{title}
            }`)
          ]);
          setAvailableVouchers(vouchers);
          setMaterials(mats);
          setAllProducts(prods);
        } catch (err) {
          console.error("Data fetch error:", err);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  // Calculate Total
  const grossTotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const voucherDiscount = appliedVouchers.reduce((acc, v) => acc + v.amount, 0);
  const totalDiscount = voucherDiscount + manualDiscount;
  const netTotal = Math.max(0, grossTotal - totalDiscount);
  const balanceDue = Math.max(0, netTotal - formData.advanceDeposit);

  // Search Logic
  // Hybrid Dropdown-Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(allProducts);
      return;
    }

    const filtered = allProducts.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
    setIsDropdownOpen(true);
  }, [searchQuery, allProducts]);

  const addItem = (product: any) => {
    const existing = selectedItems.find(item => item.productId === product._id);
    if (existing) {
      setSelectedItems(selectedItems.map(item => 
        item.productId === product._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl
      }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (productId: string) => {
    setSelectedItems(selectedItems.filter(item => item.productId !== productId));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadArtisanImage(formData);
      
      if (result.success && result.assetId) {
        setCustomProduct({
          ...customProduct,
          imageAssetId: result.assetId,
          imageUrl: result.url || ""
        });
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (err: any) {
      console.error("Image upload failed:", err);
      alert(`Failed to upload image: ${err.message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const addCustomItem = () => {
    if (!customProduct.title || !customProduct.price) {
      alert("Title and Price are required for custom creations.");
      return;
    }

    const newItem: ManualOrderItem = {
      productId: `temp-${Date.now()}`,
      title: customProduct.title,
      price: Number(customProduct.price),
      quantity: 1,
      imageUrl: customProduct.imageUrl,
      isCustom: true,
      material: customProduct.material,
      color: customProduct.color,
      dimensions: {
        length: Number(customProduct.length) || undefined,
        breadth: Number(customProduct.breadth) || undefined,
        height: Number(customProduct.height) || undefined
      },
      description: customProduct.description,
      imageAssetId: customProduct.imageAssetId,
      formicaId: customProduct.formicaId || undefined,
      fabricId: customProduct.fabricId || undefined
    };

    setSelectedItems([...selectedItems, newItem]);
    
    // Reset Studio
    setCustomProduct({
      title: "",
      price: "",
      material: "Solid Wood",
      color: "",
      length: "",
      breadth: "",
      height: "",
      description: "",
      imageAssetId: "",
      imageUrl: "",
      formicaId: "",
      fabricId: ""
    });
    setIsCustomStudioOpen(false);
  };

  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
    if (appliedVouchers.some(v => v.code.toLowerCase() === voucherInput.toLowerCase())) {
       alert("Voucher already applied.");
       return;
    }

    setIsValidatingVoucher(true);
    try {
      const result = await validateVoucher(voucherInput);
      if (result.success) {
        let discountVal = 0;
        if (result.discountType === "percentage") {
          discountVal = Math.floor((grossTotal * result.discountValue!) / 100);
        } else {
          discountVal = result.discountValue!;
        }
        setAppliedVouchers([...appliedVouchers, { code: voucherInput, amount: discountVal }]);
        setVoucherInput("");
      } else {
        alert(result.message || "Invalid voucher.");
      }
    } catch (err) {
      alert("Error validating voucher.");
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const applyVoucherFromChip = async (code: string) => {
    if (appliedVouchers.some(v => v.code.toLowerCase() === code.toLowerCase())) {
       return;
    }
    
    setIsValidatingVoucher(true);
    try {
      const result = await validateVoucher(code);
      if (result.success) {
        let discountVal = 0;
        if (result.discountType === "percentage") {
          discountVal = Math.floor((grossTotal * result.discountValue!) / 100);
        } else {
          discountVal = result.discountValue!;
        }
        setAppliedVouchers([...appliedVouchers, { code, amount: discountVal }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const removeVoucher = (code: string) => {
    setAppliedVouchers(appliedVouchers.filter(v => v.code !== code));
  };

  const handleNext = () => {
    if (step === 1 && selectedItems.length === 0) {
      alert("Please select at least one item.");
      return;
    }
    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
        alert("Please fill in the required customer details.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await createManualOrder({
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state
        },
        items: selectedItems,
        orderSource: formData.orderSource,
        internalNotes: formData.internalNotes,
        discountValue: totalDiscount,
        advanceDeposit: formData.advanceDeposit,
        voucherCodes: appliedVouchers.map(v => v.code)
      });

      if (result.success) {
        setOrderNumber(result.orderNumber || null);
        setIsSuccess(true);
        onSuccess();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset function
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSearchResults([]);
      setSelectedItems([]);
      setSearchQuery("");
      setVoucherInput("");
      setAppliedVouchers([]);
      setManualDiscount(0);
      setIsSuccess(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "Bagmati",
        orderSource: "walk-in",
        internalNotes: "",
        advanceDeposit: 0
      });
    }, 500);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={isSuccess ? "Order Confirmed" : `Manual Order - Step ${step} of 3`}
      position="right"
      noPadding
    >
      <div className="flex flex-col h-full bg-app">
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
               <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 size={40} />
               </div>
               <div className="space-y-4">
                  <h3 className="type-section">Order Logged Successfully.</h3>
                  <div className="inline-block px-6 py-2 bg-heading text-app rounded-full font-bold tracking-widest text-[10px] uppercase">
                    Order #{orderNumber}
                  </div>
                  <p className="type-label text-label normal-case mx-auto max-w-xs italic font-serif">
                    The inventory has been updated and the order record is now live in the console.
                  </p>
               </div>
               <div className="w-full space-y-3 pt-8">
                  <Button fullWidth onClick={handleClose}>Back to Orders</Button>
                  <Button variant="outline" fullWidth onClick={() => window.print()}>Print Summary</Button>
               </div>
            </div>
          ) : (
            <>
              {/* STEP 1: PRODUCTS */}
              {step === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <h4 className="text-[10px] uppercase font-bold tracking-widest text-label">1. Select Products</h4>
                         <button 
                            onClick={() => setIsCustomStudioOpen(!isCustomStudioOpen)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${isCustomStudioOpen ? 'bg-heading text-app' : 'bg-action text-white hover:bg-heading'}`}
                          >
                             {isCustomStudioOpen ? <X size={12} /> : <Plus size={12} />}
                             {isCustomStudioOpen ? "Cancel Studio" : "Custom Product Studio"}
                          </button>
                       </div>

                       <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-description opacity-40" size={18} />
                        <input 
                          type="text" 
                          placeholder="Search or browse items..." 
                          className="w-full bg-surface border border-soft rounded-3xl pl-16 pr-24 py-5 text-sm type-body focus:outline-none focus:ring-1 focus:ring-action transition-all"
                          value={searchQuery}
                          onFocus={() => setIsDropdownOpen(true)}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 border-l border-soft pl-4">
                            {searchQuery && (
                              <button 
                                onClick={() => setSearchQuery("")}
                                className="p-1 hover:bg-soft rounded-full text-label opacity-40 hover:opacity-100 transition-all"
                              >
                                <X size={14} />
                              </button>
                            )}
                            <button 
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              className={`p-1 hover:bg-soft rounded-full transition-all ${isDropdownOpen ? 'rotate-180 text-action' : 'text-label opacity-40'}`}
                            >
                               <ChevronDown size={20} />
                            </button>
                         </div>
                      </div>

                      {/* ARTISAN CUSTOM PRODUCT STUDIO FORM */}
                      {isCustomStudioOpen && (
                         <div className="bg-surface border border-action/20 rounded-[2.5rem] p-8 space-y-6 shadow-xl animate-in slide-in-from-top-4 duration-500 overflow-hidden relative">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-action/5 rounded-full blur-2xl" />
                            <div className="flex items-center gap-3 mb-2">
                               <Sparkles size={16} className="text-action animate-pulse" />
                               <h5 className="text-[10px] font-bold uppercase tracking-widest text-action">Artisan Custom Studio</h5>
                            </div>
 
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-4">
                                  <Input 
                                    placeholder="e.g. Custom Walnut Mirror" 
                                    value={customProduct.title}
                                    onChange={(e) => setCustomProduct({...customProduct, title: e.target.value})}
                                  />
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-extrabold uppercase tracking-widest text-description ml-4">Agreed Price (NPR)</label>
                                     <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-bold text-label opacity-40">Rs.</span>
                                        <input 
                                          type="number" 
                                          className="w-full bg-app border border-soft rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:outline-none"
                                          placeholder="0"
                                          value={customProduct.price}
                                          onChange={(e) => setCustomProduct({...customProduct, price: e.target.value})}
                                        />
                                     </div>
                                  </div>
                               </div>
 
                               <div className="space-y-4">
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-extrabold uppercase tracking-widest text-description ml-4">Reference Blueprint / Photo</label>
                                     <div className="relative h-[112px] group">
                                        {customProduct.imageUrl ? (
                                          <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-action/30 relative">
                                             <Image src={customProduct.imageUrl} alt="Custom" fill className="object-cover" />
                                             <button 
                                               onClick={() => setCustomProduct({...customProduct, imageUrl: "", imageAssetId: ""})}
                                               className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                                             >
                                                <X size={12} />
                                             </button>
                                          </div>
                                        ) : (
                                          <div className="w-full h-full border-2 border-dashed border-soft rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-soft/10 transition-all cursor-pointer relative overflow-hidden">
                                             {isUploadingImage ? (
                                                <div className="w-6 h-6 border-2 border-action border-t-transparent rounded-full animate-spin" />
                                             ) : (
                                               <>
                                                 <Package size={24} className="text-label opacity-20" />
                                                 <span className="text-[9px] font-bold text-label opacity-40 uppercase">Upload Reference</span>
                                               </>
                                             )}
                                             <input 
                                               type="file" 
                                               accept="image/*"
                                               className="absolute inset-0 opacity-0 cursor-pointer"
                                               onChange={handleImageUpload}
                                               disabled={isUploadingImage}
                                             />
                                          </div>
                                        )}
                                     </div>
                                  </div>
                               </div>
                            </div>
 
                            <div className="grid grid-cols-3 gap-4 border-t border-soft/50 pt-6">
                               <Input label="Material" value={customProduct.material} onChange={(e) => setCustomProduct({...customProduct, material: e.target.value})} />
                               <Input label="Color / Finish" placeholder="e.g. Dark Matte" value={customProduct.color} onChange={(e) => setCustomProduct({...customProduct, color: e.target.value})} />
                               <div className="grid grid-cols-3 gap-2">
                                  <div className="space-y-2">
                                     <label className="text-[10px] uppercase font-bold text-label opacity-40 flex justify-center">L (in)</label>
                                     <input type="number" className="w-full bg-app border border-soft rounded-xl py-2 text-center text-xs font-bold" value={customProduct.length} onChange={(e) => setCustomProduct({...customProduct, length: e.target.value})} />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[10px] uppercase font-bold text-label opacity-40 flex justify-center">B (in)</label>
                                     <input type="number" className="w-full bg-app border border-soft rounded-xl py-2 text-center text-xs font-bold" value={customProduct.breadth} onChange={(e) => setCustomProduct({...customProduct, breadth: e.target.value})} />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[10px] uppercase font-bold text-label opacity-40 flex justify-center">H (in)</label>
                                     <input type="number" className="w-full bg-app border border-soft rounded-xl py-2 text-center text-xs font-bold" value={customProduct.height} onChange={(e) => setCustomProduct({...customProduct, height: e.target.value})} />
                                  </div>
                               </div>
                            </div>
 
                            <div className="grid grid-cols-2 gap-6 p-6 bg-app/5 rounded-3xl border border-soft/30">
                               <div className="space-y-3">
                                  <div className="flex items-center gap-2 mb-1">
                                     <Sliders size={12} className="text-action" />
                                     <label className="text-[10px] font-bold uppercase tracking-widest text-label">Formica Choice</label>
                                  </div>
                                  <select 
                                    className="w-full bg-surface border border-soft rounded-xl px-4 py-3 text-xs font-bold focus:outline-none"
                                    value={customProduct.formicaId}
                                    onChange={(e) => setCustomProduct({...customProduct, formicaId: e.target.value})}
                                  >
                                     <option value="">No Formica</option>
                                     {materials.filter(m => m.type === 'formica').map(m => (
                                       <option key={m._id} value={m._id}>{m.title} {m.brand ? `(${m.brand})` : ''}</option>
                                     ))}
                                  </select>
                               </div>
                               <div className="space-y-3">
                                  <div className="flex items-center gap-2 mb-1">
                                     <Sliders size={12} className="text-action" />
                                     <label className="text-[10px] font-bold uppercase tracking-widest text-label">Fabric Choice</label>
                                  </div>
                                  <select 
                                    className="w-full bg-surface border border-soft rounded-xl px-4 py-3 text-xs font-bold focus:outline-none"
                                    value={customProduct.fabricId}
                                    onChange={(e) => setCustomProduct({...customProduct, fabricId: e.target.value})}
                                  >
                                     <option value="">No Fabric</option>
                                     {materials.filter(m => m.type === 'fabric').map(m => (
                                       <option key={m._id} value={m._id}>{m.title} {m.brand ? `(${m.brand})` : ''}</option>
                                     ))}
                                  </select>
                               </div>
                            </div>
 
                            <div className="flex gap-4 pt-4">
                               <textarea 
                                 className="flex-1 bg-app border border-soft rounded-2xl p-4 text-xs italic font-serif focus:ring-1 focus:ring-action outline-none min-h-[80px]"
                                 placeholder="Special artisan notes or client specifications..."
                                 value={customProduct.description}
                                 onChange={(e) => setCustomProduct({...customProduct, description: e.target.value})}
                               />
                               <div className="flex flex-col gap-2">
                                  <Button fullWidth onClick={addCustomItem} className="h-full bg-heading hover:bg-action">
                                     Add to Ledger
                                  </Button>
                               </div>
                            </div>
                         </div>
                       )}

                      {/* SEARCH RESULTS DROPDOWN (ARTI-COMBOBOX) */}
                      {isDropdownOpen && searchResults.length > 0 && (
                        <div className="bg-surface border border-soft rounded-[2rem] shadow-xl overflow-hidden max-h-80 overflow-y-auto divide-y divide-soft border-dotted z-10 relative mt-2 animate-in slide-in-from-top-2 duration-300">
                           {searchResults.map((product) => (
                             <button 
                               key={product._id} 
                               onClick={() => addItem(product)}
                               className="w-full flex items-center gap-4 p-5 hover:bg-soft/30 transition-colors group text-left"
                             >
                               <div className="w-12 h-12 bg-app rounded-xl overflow-hidden border border-soft flex-shrink-0">
                                 {product.imageUrl ? (
                                   <Image src={product.imageUrl} alt="" width={48} height={48} className="object-cover w-full h-full" />
                                 ) : <div className="p-3"><Package size={20} className="text-label opacity-20" /></div>}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-heading truncate">{product.title}</p>
                                  <p className="text-[10px] font-sans font-bold text-action uppercase tracking-widest">Rs. {product.price}</p>
                               </div>
                               <div className="w-10 h-10 rounded-full bg-soft group-hover:bg-action group-hover:text-app flex items-center justify-center transition-all">
                                  <Plus size={16} />
                               </div>
                             </button>
                           ))}
                        </div>
                      )}
                   </div>

                   {/* SELECTED ITEMS BASKET */}
                   <div className="space-y-4 pt-4">
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-label flex justify-between">
                         Order Basket <span>{selectedItems.length} items</span>
                      </h4>
                      <div className="space-y-3">
                         {selectedItems.length > 0 ? selectedItems.map((item) => (
                           <div key={item.productId} className="flex gap-4 p-4 bg-surface border border-soft rounded-2xl">
                              <div className="w-16 h-20 bg-app rounded-xl overflow-hidden flex-shrink-0">
                                 {item.imageUrl ? (
                                   <Image src={item.imageUrl} alt="" width={64} height={80} className="object-cover w-full h-full" />
                                 ) : <div className="p-4"><Package size={24} className="text-label opacity-20" /></div>}
                              </div>
                              <div className="flex-1 py-1 flex flex-col justify-between">
                                 <div className="flex justify-between items-start">
                                    <h5 className="text-sm font-bold text-heading leading-tight max-w-[150px]">{item.title}</h5>
                                    <button onClick={() => removeItem(item.productId)} className="text-label hover:text-red-500 transition-colors">
                                       <X size={14} />
                                    </button>
                                 </div>
                                 <div className="flex justify-between items-end">
                                    <p className="text-xs font-bold text-action">Rs. {item.price * item.quantity}</p>
                                    <div className="flex items-center gap-4 bg-app px-2 py-1.5 rounded-full border border-soft">
                                       <button onClick={() => updateQuantity(item.productId, -1)} className="text-label hover:text-heading"><Minus size={12} /></button>
                                       <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                                       <button onClick={() => updateQuantity(item.productId, 1)} className="text-label hover:text-heading"><Plus size={12} /></button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                         )) : (
                           <div className="py-12 text-center bg-soft/10 border border-soft border-dashed rounded-[2rem]">
                              <Package size={32} className="mx-auto text-label opacity-20 mb-4" />
                              <p className="text-xs font-serif italic text-label">Search items to add them here</p>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 2: CUSTOMER DATA */}
              {step === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-6">
                       <h4 className="text-[10px] uppercase font-bold tracking-widest text-label">2. Customer Information</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <Input 
                            label="First Name" 
                            placeholder="John" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            required
                          />
                          <Input 
                            label="Last Name" 
                            placeholder="Doe" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            required
                          />
                       </div>
                       <Input 
                         label="Phone Number" 
                         placeholder="98XXXXXXXX" 
                         icon={Phone} 
                         value={formData.phone}
                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         required
                       />
                       <Input 
                         label="Email Address (Optional)" 
                         placeholder="john@example.com" 
                         icon={Mail} 
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                       />
                       <Input 
                         label="Shipping Address" 
                         placeholder="Street, Area, etc." 
                         icon={MapPin} 
                         value={formData.address}
                         onChange={(e) => setFormData({...formData, address: e.target.value})}
                         required
                       />
                       <div className="grid grid-cols-2 gap-4">
                          <Input 
                            label="City" 
                            placeholder="Kathmandu" 
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            required
                          />
                          <div className="flex flex-col gap-2">
                             <label className="text-[10px] font-extrabold uppercase tracking-widest text-description ml-4">State/Zone</label>
                             <select 
                               className="bg-surface border border-soft rounded-2xl px-6 py-4 text-sm font-bold text-heading focus:ring-1 focus:ring-action outline-none appearance-none"
                               value={formData.state}
                               onChange={(e) => setFormData({...formData, state: e.target.value})}
                             >
                               <option value="Bagmati">Bagmati</option>
                               <option value="Gandaki">Gandaki</option>
                               <option value="Lumbini">Lumbini</option>
                               <option value="Koshi">Koshi</option>
                               <option value="Madhesh">Madhesh</option>
                               <option value="Karnali">Karnali</option>
                               <option value="Sudurpashchim">Sudurpashchim</option>
                             </select>
                          </div>
                       </div>
                    </div>
                </div>
              )}

              {/* STEP 3: REVIEW & META */}
              {step === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-6">
                       <h4 className="text-[10px] uppercase font-bold tracking-widest text-label">3. Source & Review</h4>
                       
                       <div className="space-y-3">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-description ml-4">Order Source</label>
                          <div className="grid grid-cols-2 gap-3">
                             {["walk-in", "whatsapp", "phone", "facebook"].map(source => (
                               <button 
                                 key={source}
                                 onClick={() => setFormData({...formData, orderSource: source})}
                                 className={`px-6 py-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all ${formData.orderSource === source ? "bg-heading text-app border-heading" : "bg-surface border-soft text-label hover:border-action/20"}`}
                               >
                                 {source}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-4 pt-4 border-t border-soft/50">
                          <h4 className="text-[10px] uppercase font-bold tracking-widest text-label flex items-center gap-2">
                             <Sparkles size={10} className="text-action" /> Select Available Vouchers
                          </h4>
                          
                          <div className="flex flex-wrap gap-2">
                             {availableVouchers.length > 0 ? availableVouchers.map((v) => {
                               const isApplied = appliedVouchers.some(av => av.code === v.code);
                               return (
                                 <button
                                   key={v._id}
                                   onClick={() => !isApplied && applyVoucherFromChip(v.code)}
                                   disabled={isApplied || isValidatingVoucher}
                                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${isApplied ? "bg-soft text-label opacity-40 cursor-not-allowed" : "bg-app border border-soft hover:border-action/50 text-heading hover:bg-soft/30 shadow-sm"}`}
                                 >
                                    <Ticket size={10} className={isApplied ? "opacity-20" : "text-action"} />
                                    <span>{v.code}</span>
                                    {!isApplied && <span className="opacity-40 ml-1">({v.discountType === 'percentage' ? `${v.discountValue}%` : `Rs.${v.discountValue}`})</span>}
                                 </button>
                               );
                             }) : (
                               <p className="text-[9px] font-bold text-label opacity-20 uppercase tracking-widest">No active vouchers found</p>
                             )}
                          </div>

                          <div className="flex gap-4 pt-2">
                             <div className="flex-1 relative group">
                                <Ticket className="absolute left-6 top-1/2 -translate-y-1/2 text-description opacity-40" size={16} />
                                <input 
                                  type="text" 
                                  placeholder="Or type manual code..." 
                                  className="w-full bg-surface border border-soft rounded-2xl pl-14 pr-4 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-action transition-all"
                                  value={voucherInput}
                                  onChange={(e) => setVoucherInput(e.target.value)}
                                />
                             </div>
                             <Button 
                               variant="secondary" 
                               className="!px-6"
                               onClick={handleApplyVoucher}
                               isLoading={isValidatingVoucher}
                             >
                               Apply
                             </Button>
                          </div>

                          {appliedVouchers.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                               {appliedVouchers.map((v) => (
                                 <div key={v.code} className="flex items-center gap-2 px-4 py-2 bg-action/10 border border-action/20 text-action rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm">
                                    <Tag size={10} />
                                    <span>{v.code} (-Rs.{v.amount})</span>
                                    <button onClick={() => removeVoucher(v.code)} className="ml-1 hover:text-heading"><X size={10} /></button>
                                 </div>
                               ))}
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-extrabold uppercase tracking-widest text-description ml-4">Manual Discount (NPR)</label>
                                 <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-description font-bold text-xs opacity-40">Rs.</span>
                                    <input 
                                      type="number" 
                                      placeholder="0" 
                                      className="w-full bg-surface border border-soft rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-heading focus:outline-none focus:ring-1 focus:ring-action transition-all"
                                      value={manualDiscount || ""}
                                      onChange={(e) => setManualDiscount(Number(e.target.value))}
                                    />
                                 </div>
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-extrabold uppercase tracking-widest text-description ml-4">Advance Deposit (NPR)</label>
                                 <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-description font-bold text-xs opacity-40 text-emerald-500">Rs.</span>
                                    <input 
                                      type="number" 
                                      placeholder="0" 
                                      className="w-full bg-surface border border-soft rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
                                      value={formData.advanceDeposit || ""}
                                      onChange={(e) => setFormData({...formData, advanceDeposit: Number(e.target.value)})}
                                    />
                                 </div>
                              </div>
                           </div>
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-description ml-4">Internal Notes</label>
                          <textarea 
                             className="w-full bg-surface border border-soft rounded-[2rem] p-6 text-sm italic font-serif focus:ring-1 focus:ring-action outline-none min-h-[100px]"
                             placeholder="Any special instructions or reference notes... (e.g. delivery date, payment status)"
                             value={formData.internalNotes}
                             onChange={(e) => setFormData({...formData, internalNotes: e.target.value})}
                          />
                       </div>

                       <div className="p-8 bg-heading rounded-[2.5rem] text-app space-y-6 shadow-xl relative overflow-hidden">
                          <Info className="absolute -right-4 -bottom-4 w-24 h-24 text-app/5 rotate-12" />
                          <h5 className="text-[10px] uppercase font-bold tracking-widest text-app/60">Final Summary</h5>
                          <div className="space-y-2 border-b border-app/10 pb-4">
                             <div className="flex justify-between text-xs text-app/60">
                                <span>Gross Total ({selectedItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                                <span>Rs. {grossTotal}</span>
                             </div>
                             {totalDiscount > 0 && (
                               <div className="flex justify-between text-xs text-red-300">
                                  <span>Total Savings</span>
                                  <span>-Rs. {totalDiscount}</span>
                               </div>
                             )}
                             {formData.advanceDeposit > 0 && (
                               <div className="flex justify-between text-xs text-emerald-300">
                                  <span>Advance Deposit Received</span>
                                  <span>-Rs. {formData.advanceDeposit}</span>
                               </div>
                             )}
                          </div>
                          <div className="flex justify-between items-baseline">
                             <span className="text-[10px] uppercase font-bold tracking-widest text-app/40">Remaining Balance Due</span>
                             <span className="text-3xl font-bold">Rs. {balanceDue}</span>
                          </div>
                       </div>
                    </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        {!isSuccess && (
          <div className="p-8 border-t border-soft/20 flex gap-4 bg-app relative z-30">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack} 
                className="flex-1"
                leftIcon={<ChevronLeft size={16} />}
              >
                Back
              </Button>
            )}
            <Button 
              fullWidth 
              className={step > 1 ? "flex-[2]" : "flex-1"}
              onClick={step === 3 ? handleSubmit : handleNext}
              isLoading={isSubmitting}
              rightIcon={step === 3 ? <CheckCircle2 size={16} /> : <ChevronRight size={16} />}
            >
              {step === 3 ? "Process Order" : "Next Step"}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
