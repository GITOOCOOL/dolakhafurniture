"use client";

import { useState, useMemo } from "react";
import { Box, Search, Check, AlertTriangle, EyeOff, Facebook, Filter, X, ChevronDown, Tag, Plus, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  isActive: boolean;
  syncToFacebook: boolean;
  category: string;
  imageUrl?: string;
}

export default function AdminInventoryClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Restock State
  const [productToRestock, setProductToRestock] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState(1);
  const [isRestockSubmitting, setIsRestockSubmitting] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  // Derived Categories
  const categories = useMemo(() => {
    const cats = new Set(initialProducts.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [initialProducts]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        !searchQuery || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      
      let matchesStock = true;
      if (stockFilter === "out") matchesStock = product.stock <= 0;
      if (stockFilter === "low") matchesStock = product.stock > 0 && product.stock <= 3;
      if (stockFilter === "in") matchesStock = product.stock > 3;

      const matchesVisibility = 
        visibilityFilter === "all" || 
        (visibilityFilter === "visible" && product.isActive) || 
        (visibilityFilter === "hidden" && !product.isActive);

      return matchesSearch && matchesCategory && matchesStock && matchesVisibility;
    });
  }, [products, searchQuery, categoryFilter, stockFilter, visibilityFilter]);

  const updateField = async (productId: string, field: string, value: any) => {
    setUpdatingId(productId);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, field, value }),
      });
      if (res.ok) {
        setProducts(products.map(p => p._id === productId ? { ...p, [field]: value } : p));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRestock = async () => {
    if (!productToRestock) return;
    setIsRestockSubmitting(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: productToRestock._id, 
          field: "stock", 
          value: restockAmount,
          operation: "inc"
        }),
      });
      if (res.ok) {
        setProducts(products.map(p => p._id === productToRestock._id ? { ...p, stock: p.stock + restockAmount } : p));
        setProductToRestock(null);
        setRestockAmount(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRestockSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* FILTER BAR */}
      <div className="bg-surface border border-soft rounded-[2.5rem] p-6 lg:p-10 mb-8 space-y-6 shadow-sm">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Search */}
            <div className="md:col-span-5 relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-label opacity-40" size={18} />
               <input 
                 type="text" 
                 placeholder="Search by product name..." 
                 className="w-full bg-app border border-soft rounded-2xl pl-16 pr-6 py-4 text-sm font-medium text-heading focus:outline-none focus:ring-1 focus:ring-action transition-all"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-label hover:text-heading"><X size={14} /></button>
               )}
            </div>

            {/* Category Filter */}
            <div className="md:col-span-2 relative">
               <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-label opacity-40" size={14} />
               <select 
                 className="w-full bg-app border border-soft rounded-2xl pl-14 pr-10 py-4 text-xs font-bold uppercase tracking-widest text-heading appearance-none focus:outline-none focus:ring-1 focus:ring-action outline-none cursor-pointer"
                 value={categoryFilter}
                 onChange={(e) => setCategoryFilter(e.target.value)}
               >
                 <option value="all">All Categories</option>
                 {categories.map(cat => (
                   <option key={cat} value={cat}>{cat}</option>
                 ))}
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-label opacity-40 pointer-events-none" size={12} />
            </div>

            {/* Stock Filter */}
            <div className="md:col-span-2 relative">
               <Box className="absolute left-6 top-1/2 -translate-y-1/2 text-label opacity-40" size={14} />
               <select 
                 className="w-full bg-app border border-soft rounded-2xl pl-14 pr-10 py-4 text-xs font-bold uppercase tracking-widest text-heading appearance-none focus:outline-none focus:ring-1 focus:ring-action outline-none cursor-pointer"
                 value={stockFilter}
                 onChange={(e) => setStockFilter(e.target.value)}
               >
                 <option value="all">Stock: All</option>
                 <option value="out">Out of Stock</option>
                 <option value="low">Low Stock</option>
                 <option value="in">In Stock</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-label opacity-40 pointer-events-none" size={12} />
            </div>

            {/* Visibility Filter */}
            <div className="md:col-span-3 relative">
               <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-label opacity-40" size={14} />
               <select 
                 className="w-full bg-app border border-soft rounded-2xl pl-14 pr-10 py-4 text-xs font-bold uppercase tracking-widest text-heading appearance-none focus:outline-none focus:ring-1 focus:ring-action outline-none cursor-pointer"
                 value={visibilityFilter}
                 onChange={(e) => setVisibilityFilter(e.target.value)}
               >
                 <option value="all">Visibility: All</option>
                 <option value="visible">Visible Only</option>
                 <option value="hidden">Hidden Only</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-label opacity-40 pointer-events-none" size={12} />
            </div>
         </div>

         {/* SUMMARY */}
         {(searchQuery || categoryFilter !== "all" || stockFilter !== "all" || visibilityFilter !== "all") && (
           <div className="flex items-center justify-between pt-4 border-t border-soft/50">
              <p className="text-[10px] font-bold text-label uppercase tracking-widest">
                 Displaying <span className="text-heading">{filteredProducts.length}</span> of {initialProducts.length} items
              </p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStockFilter("all");
                  setVisibilityFilter("all");
                }}
                className="text-[9px] font-bold text-action hover:text-heading uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                 <X size={12} /> Clear filters
              </button>
           </div>
         )}
      </div>

      <div className="bg-app border border-soft rounded-[3rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-soft border-dotted bg-soft/10">
                <th className="px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label">Product</th>
                <th className="px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label w-48">Price (Rs.)</th>
                <th className="px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label w-48">Stock</th>
                <th className="px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label text-center w-24">Visibility</th>
                <th className="px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label text-center w-24">Meta Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft divide-dotted">
              {filteredProducts.map((product) => (
                <tr key={product._id} className={`group transition-colors ${!product.isActive ? 'bg-soft/20 opacity-60 hover:opacity-100' : 'hover:bg-soft/10'}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-14 bg-white rounded-lg border border-soft overflow-hidden flex-shrink-0 relative">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                        ) : (
                          <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-label opacity-20" size={16} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-heading truncate max-w-[250px]" title={product.title}>
                          {product.title}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-label font-bold mt-1">
                          {product.category || "Uncategorized"}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-8 py-6">
                    <input 
                      type="number"
                      value={product.price || 0}
                      disabled={updatingId === product._id}
                      onChange={(e) => updateField(product._id, "price", parseFloat(e.target.value))}
                      className="w-full bg-transparent border border-transparent hover:border-soft focus:border-action/30 rounded-lg px-3 py-2 text-sm font-bold text-heading disabled:opacity-50 transition-colors focus:outline-none"
                    />
                  </td>
                  
                  <td className="px-8 py-6">
                      <div className="relative flex items-center group/stock">
                         <input 
                           type="number"
                           value={product.stock || 0}
                           disabled={updatingId === product._id}
                           onChange={(e) => updateField(product._id, "stock", parseInt(e.target.value, 10))}
                           className={`w-full bg-transparent border rounded-lg pl-3 pr-10 py-2 text-sm font-bold text-heading disabled:opacity-50 transition-colors focus:outline-none ${product.stock <= 0 ? 'border-red-500/30 text-red-600 bg-red-500/5 hover:border-red-500/50 focus:border-red-500' : product.stock < 3 ? 'border-orange-500/30 text-orange-600 bg-orange-500/5 hover:border-orange-500/50' : 'border-transparent hover:border-soft focus:border-action/30'}`}
                         />
                         <button 
                           onClick={() => {
                             setProductToRestock(product);
                             setRestockAmount(1);
                           }}
                           className="absolute right-2 p-1.5 bg-action text-white rounded-md opacity-0 group-hover/stock:opacity-100 hover:bg-heading transition-all shadow-lg scale-90"
                           title="Quick Restock"
                         >
                            <Plus size={12} />
                         </button>
                         {product.stock <= 0 && <AlertTriangle size={12} className="absolute right-3 text-red-500 pointer-events-none group-hover/stock:hidden" />}
                      </div>
                   </td>
                  
                  <td className="px-8 py-6 text-center">
                    <button
                      disabled={updatingId === product._id}
                      onClick={() => updateField(product._id, "isActive", !product.isActive)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all disabled:opacity-50 ${product.isActive ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'}`}
                      title={product.isActive ? "Active on Web" : "Hidden from Web"}
                    >
                      {product.isActive ? <Check size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>

                  <td className="px-8 py-6 text-center">
                    <button
                      disabled={updatingId === product._id}
                      onClick={() => updateField(product._id, "syncToFacebook", !product.syncToFacebook)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all disabled:opacity-50 ${product.syncToFacebook ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20' : 'bg-soft text-label hover:text-heading'}`}
                      title={product.syncToFacebook ? "Syncing to Meta" : "Not Syncing to Meta"}
                    >
                      <Facebook size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-24 italic font-serif text-label opacity-40 uppercase tracking-widest text-[10px]">
              No items match your filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* RESTOCK MODAL */}
      <Modal
        isOpen={!!productToRestock}
        onClose={() => !isRestockSubmitting && setProductToRestock(null)}
        title="Arrival of New Inventory"
      >
        {productToRestock && (
          <div className="space-y-8 py-4">
             <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-action/10 text-action rounded-full flex items-center justify-center border border-action/20">
                   <RefreshCcw size={32} />
                </div>
                <div>
                   <h3 className="type-section text-lg uppercase tracking-widest">{productToRestock.title}</h3>
                   <p className="type-label text-label normal-case italic font-serif mt-2">
                     Current Stock: <span className="text-heading font-bold not-italic">{productToRestock.stock} units</span>
                   </p>
                </div>
             </div>

             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-label ml-4">
                      Units to Add
                   </label>
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setRestockAmount(Math.max(1, restockAmount - 1))}
                        className="w-14 h-14 bg-soft rounded-2xl flex items-center justify-center hover:bg-action hover:text-white transition-all text-xl font-bold"
                      >
                         -
                      </button>
                      <input 
                        type="number" 
                        className="flex-1 bg-surface border border-soft rounded-[2rem] px-6 py-4 text-2xl font-bold text-heading text-center focus:outline-none"
                        value={restockAmount}
                        onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
                      />
                      <button 
                        onClick={() => setRestockAmount(restockAmount + 1)}
                        className="w-14 h-14 bg-soft rounded-2xl flex items-center justify-center hover:bg-action hover:text-white transition-all text-xl font-bold"
                      >
                         +
                      </button>
                   </div>
                </div>
             </div>

             <div className="flex gap-4">
                <Button variant="ghost" fullWidth onClick={() => setProductToRestock(null)} disabled={isRestockSubmitting}>Cancel</Button>
                <Button 
                   fullWidth 
                   onClick={handleRestock}
                   isLoading={isRestockSubmitting}
                >
                   Finalize Restock
                </Button>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
