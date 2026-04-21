"use client";

import { useState } from "react";
import { Box, Search, Check, AlertTriangle, EyeOff, Facebook } from "lucide-react";
import Image from "next/image";

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

  return (
    <div className="space-y-10 animate-in fade-in duration-700">

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
              {products.map((product) => (
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
                     <div className="relative flex items-center">
                        <input 
                          type="number"
                          value={product.stock || 0}
                          disabled={updatingId === product._id}
                          onChange={(e) => updateField(product._id, "stock", parseInt(e.target.value, 10))}
                          className={`w-full bg-transparent border rounded-lg px-3 py-2 text-sm font-bold text-heading disabled:opacity-50 transition-colors focus:outline-none ${product.stock <= 0 ? 'border-red-500/30 text-red-600 bg-red-500/5 hover:border-red-500/50 focus:border-red-500' : product.stock < 3 ? 'border-orange-500/30 text-orange-600 bg-orange-500/5 hover:border-orange-500/50' : 'border-transparent hover:border-soft focus:border-action/30'}`}
                        />
                        {product.stock <= 0 && <AlertTriangle size={12} className="absolute right-3 text-red-500 pointer-events-none" />}
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
          
          {products.length === 0 && (
            <div className="text-center py-24 italic font-serif text-label opacity-40 uppercase tracking-widest text-[10px]">
              No products found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
