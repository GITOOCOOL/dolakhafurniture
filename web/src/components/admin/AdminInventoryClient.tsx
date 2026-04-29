"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Search,
  Check,
  AlertTriangle,
  EyeOff,
  Facebook,
  Filter,
  X,
  ChevronDown,
  Tag,
  Plus,
  RefreshCcw,
  Edit3,
  CheckCircle2,
  Maximize2,
  Layers
} from "lucide-react";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ProductStudioDrawer from "./ProductStudioDrawer";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  title: string;
  price: number;
  costPrice?: number;
  stock: number;
  isActive: boolean;
  syncToFacebook: boolean;
  category: string;
  categoryId?: string;
  imageUrl?: string;
  length?: number;
  breadth?: number;
  height?: number;
  description?: string;
}

interface Category {
  _id: string;
  title: string;
}

export default function AdminInventoryClient({
  initialProducts,
  categories: allCategoryObjects,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    price: true,
    costPrice: true,
    specs: true,
    stock: true,
    visibility: true,
    metaSync: true,
  });

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  // Restock State
  const [productToRestock, setProductToRestock] = useState<Product | null>(
    null,
  );
  const [restockAmount, setRestockAmount] = useState(1);
  const [isRestockSubmitting, setIsRestockSubmitting] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  // Derived Categories
  const categories = useMemo(() => {
    const cats = new Set(
      initialProducts.map((p) => p.category).filter(Boolean),
    );
    return Array.from(cats).sort();
  }, [initialProducts]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      let matchesStock = true;
      if (stockFilter === "out") matchesStock = product.stock <= 0;
      if (stockFilter === "low")
        matchesStock = product.stock > 0 && product.stock <= 3;
      if (stockFilter === "in") matchesStock = product.stock > 3;

      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "visible" && product.isActive) ||
        (visibilityFilter === "hidden" && !product.isActive);

      return (
        matchesSearch && matchesCategory && matchesStock && matchesVisibility
      );
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
        setProducts(
          products.map((p) =>
            p._id === productId ? { ...p, [field]: value } : p,
          ),
        );
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
          operation: "inc",
        }),
      });
      if (res.ok) {
        setProducts(
          products.map((p) =>
            p._id === productToRestock._id
              ? { ...p, stock: p.stock + restockAmount }
              : p,
          ),
        );
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
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-serif italic text-heading leading-tight">
            Inventory
          </h2>
          <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-label opacity-60">
            Manage your products and stock
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedProduct(null);
            setIsDrawerOpen(true);
          }}
          leftIcon={<Plus size={16} />}
        >
          Add New Product
        </Button>
      </div>

      {/* FILTER BAR BOX */}
      <div className="bg-surface border border-soft rounded-[2.5rem] p-6 lg:p-10 mb-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-label opacity-40"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by product name..."
              className="w-full bg-app border border-soft rounded-2xl pl-16 pr-6 py-4 text-sm font-medium text-heading focus:outline-none focus:ring-1 focus:ring-action transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-label hover:text-heading"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2 relative">
            <Tag
              className="absolute left-6 top-1/2 -translate-y-1/2 text-label opacity-40"
              size={14}
            />
            <select
              className="w-full bg-app border border-soft rounded-2xl pl-14 pr-10 py-4 text-xs font-bold uppercase tracking-widest text-heading appearance-none focus:outline-none focus:ring-1 focus:ring-action outline-none cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-label opacity-40 pointer-events-none"
              size={12}
            />
          </div>

          {/* Stock Filter */}
          <div className="md:col-span-2 relative">
            <Box
              className="absolute left-6 top-1/2 -translate-y-1/2 text-label opacity-40"
              size={14}
            />
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
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-label opacity-40 pointer-events-none"
              size={12}
            />
          </div>

          {/* Visibility Filter */}
          <div className="md:col-span-3 relative">
            <Filter
              className="absolute left-6 top-1/2 -translate-y-1/2 text-label opacity-40"
              size={14}
            />
            <select
              className="w-full bg-app border border-soft rounded-2xl pl-14 pr-10 py-4 text-xs font-bold uppercase tracking-widest text-heading appearance-none focus:outline-none focus:ring-1 focus:ring-action outline-none cursor-pointer"
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
            >
              <option value="all">Visibility: All</option>
              <option value="visible">Visible Only</option>
              <option value="hidden">Hidden Only</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-label opacity-40 pointer-events-none"
              size={12}
            />
          </div>
        </div>

        {/* SUMMARY & COLUMN FILTER RIBBON */}
        <div className="pt-6 border-t border-soft border-dotted space-y-6">
          {(searchQuery ||
            categoryFilter !== "all" ||
            stockFilter !== "all" ||
            visibilityFilter !== "all") && (
            <div className="flex items-center justify-between pb-4">
              <p className="text-[10px] font-bold text-label uppercase tracking-widest">
                Displaying{" "}
                <span className="text-heading">{filteredProducts.length}</span>{" "}
                of {initialProducts.length} items
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

          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-label flex items-center gap-2">
              <Filter size={14} /> Display Attributes:
            </span>

            <div className="flex flex-wrap items-center gap-4">
              {Object.entries({
                price: "Price",
                costPrice: "Cost",
                specs: "Specs",
                stock: "Stock",
                visibility: "Visible",
                metaSync: "Meta Sync",
              }).map(([key, label]) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all ${visibleColumns[key as keyof typeof visibleColumns] ? "bg-action/5 border-action/30 text-action" : "bg-transparent border-soft text-label hover:border-action/20"}`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={visibleColumns[key as keyof typeof visibleColumns]}
                    onChange={() =>
                      toggleColumn(key as keyof typeof visibleColumns)
                    }
                  />
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${visibleColumns[key as keyof typeof visibleColumns] ? "bg-action border-action text-white" : "border-soft"}`}
                  >
                    {visibleColumns[key as keyof typeof visibleColumns] && (
                      <Check size={10} strokeWidth={4} />
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* INVENTORY LIST */}
      <div className="bg-app border border-soft rounded-[3rem] overflow-hidden shadow-sm">
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-soft border-dotted bg-soft/10">
                <th className="sticky left-0 bg-app z-10 px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                  Product
                </th>
                {visibleColumns.price && (
                  <th className="px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label w-40">
                    Price (Rs.)
                  </th>
                )}
                {visibleColumns.costPrice && (
                  <th className="px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label w-40">
                    Cost (Rs.)
                  </th>
                )}
                {visibleColumns.specs && (
                  <th className="px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label w-40">
                    Specs (L×B×H)
                  </th>
                )}
                {visibleColumns.stock && (
                  <th className="px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label w-32">
                    Stock
                  </th>
                )}
                {visibleColumns.visibility && (
                  <th className="px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label text-center w-24">
                    Store
                  </th>
                )}
                {visibleColumns.metaSync && (
                  <th className="px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label text-center w-24">
                    Meta
                  </th>
                )}
                <th className="px-8 py-6 text-[9px] font-sans font-bold uppercase tracking-widest text-label text-center w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft divide-dotted">
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-soft/5 transition-colors group"
                >
                  <td className="sticky left-0 bg-white group-hover:bg-soft/5 z-10 px-8 py-6 shadow-[2px_0_5px_rgba(0,0,0,0.02)] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 bg-surface rounded-lg overflow-hidden border border-soft shrink-0">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Box
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-label opacity-20"
                            size={16}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-bold text-heading truncate max-w-[200px]"
                          title={product.title}
                        >
                          {product.title}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-label font-bold mt-1">
                          {product.category || "Uncategorized"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {visibleColumns.price && (
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-heading">
                        रू {product.price?.toLocaleString()}
                      </p>
                    </td>
                  )}

                  {visibleColumns.costPrice && (
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-description">
                          रू {product.costPrice?.toLocaleString() || "0"}
                        </p>
                        {product.price && product.costPrice && (
                          <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                            Margin: {Math.round(((product.price - product.costPrice) / product.price) * 100)}%
                          </p>
                        )}
                      </div>
                    </td>
                  )}

                  {visibleColumns.specs && (
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-heading">
                          <span className="opacity-40 font-normal">L:</span>{" "}
                          {product.length || "—"}
                          <span className="opacity-40 font-normal ml-1">
                            B:
                          </span>{" "}
                          {product.breadth || "—"}
                          <span className="opacity-40 font-normal ml-1">
                            H:
                          </span>{" "}
                          {product.height || "—"}
                        </div>
                        <p className="text-[8px] uppercase tracking-tighter text-label opacity-40">
                          inches
                        </p>
                      </div>
                    </td>
                  )}

                  {visibleColumns.stock && (
                    <td className="px-8 py-6">
                      <div className="relative flex items-center group/stock min-w-[120px]">
                        <input
                          type="number"
                          value={product.stock || 0}
                          disabled={updatingId === product._id}
                          onChange={(e) =>
                            updateField(
                              product._id,
                              "stock",
                              parseInt(e.target.value, 10),
                            )
                          }
                          className={`w-full bg-surface border rounded-lg px-3 py-2 text-sm font-bold text-heading text-center disabled:opacity-50 transition-colors focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${product.stock <= 0 ? "border-red-500/50 text-red-600 bg-red-500/5 hover:border-red-500 focus:border-red-500" : product.stock < 3 ? "border-orange-500/50 text-orange-600 bg-orange-500/5 hover:border-orange-500" : "border-soft/40 hover:border-soft focus:border-action"}`}
                        />
                        <button
                          onClick={() => {
                            setProductToRestock(product);
                            setRestockAmount(1);
                          }}
                          className="absolute right-2 p-1.5 bg-action text-white rounded-md opacity-0 group-hover/stock:opacity-100 hover:bg-heading transition-all shadow-lg scale-90"
                          title="Restock"
                        >
                          <Plus size={12} />
                        </button>
                        {product.stock <= 0 && (
                          <AlertTriangle
                            size={12}
                            className="absolute right-3 text-red-500 pointer-events-none group-hover/stock:hidden"
                          />
                        )}
                      </div>
                    </td>
                  )}

                  {visibleColumns.visibility && (
                    <td className="px-8 py-6 text-center">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all mx-auto ${product.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600 opacity-40"}`}
                        title={product.isActive ? "Visible on Storefront" : "Hidden from Storefront"}
                      >
                        {product.isActive ? <CheckCircle2 size={16} /> : <EyeOff size={16} />}
                      </div>
                    </td>
                  )}

                  {visibleColumns.metaSync && (
                    <td className="px-8 py-6 text-center">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all mx-auto ${product.syncToFacebook ? "bg-blue-500/10 text-blue-600" : "bg-soft text-label opacity-20"}`}
                        title={product.syncToFacebook ? "Synced to Meta Catalog" : "Meta Sync Disabled"}
                      >
                        <Facebook size={16} />
                      </div>
                    </td>
                  )}

                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsDrawerOpen(true);
                      }}
                      className="w-10 h-10 bg-surface border border-soft text-heading rounded-xl flex items-center justify-center hover:bg-action hover:text-white hover:border-action transition-all shadow-sm mx-auto"
                      title="Edit Product Details"
                    >
                      <Edit3 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="lg:hidden divide-y divide-soft divide-dotted">
          {filteredProducts.map((product) => (
            <div key={product._id} className="p-6 space-y-6 bg-white hover:bg-soft/5 transition-all">
              {/* Card Header: Product & Basic Info */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 bg-surface rounded-2xl overflow-hidden border border-soft shrink-0 shadow-sm">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                    ) : (
                      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-label opacity-20" size={18} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-heading leading-tight">{product.title}</h3>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-label mt-1">{product.category || "Uncategorized"}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsDrawerOpen(true);
                  }}
                  className="w-10 h-10 bg-soft text-heading rounded-xl flex items-center justify-center hover:bg-action hover:text-white transition-all shadow-sm"
                >
                  <Edit3 size={14} />
                </button>
              </div>

              {/* Card Content Grid: Tabular attributes stacked intelligently */}
              <div className="grid grid-cols-2 gap-4 bg-app/50 p-5 rounded-[1.5rem] border border-soft/50">
                {visibleColumns.price && (
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-label opacity-60">Price</p>
                    <p className="text-xs font-bold text-heading">रू {product.price?.toLocaleString()}</p>
                  </div>
                )}
                {visibleColumns.costPrice && (
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-label opacity-60">Cost</p>
                    <div className="flex flex-col">
                      <p className="text-xs font-bold text-description">रू {product.costPrice?.toLocaleString() || "0"}</p>
                      {product.price && product.costPrice && (
                        <p className="text-[8px] font-bold text-emerald-600">
                          {Math.round(((product.price - product.costPrice) / product.price) * 100)}% Margin
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {visibleColumns.specs && (
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-label opacity-60">Specs (in)</p>
                    <p className="text-[10px] font-bold text-heading">
                      {product.length || "—"} × {product.breadth || "—"} × {product.height || "—"}
                    </p>
                  </div>
                )}
                {visibleColumns.stock && (
                  <div className="col-span-2 pt-2 border-t border-soft/30 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-label opacity-60">Current Stock</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${product.stock <= 0 ? "text-red-500" : product.stock < 3 ? "text-orange-500" : "text-heading"}`}>
                          {product.stock} units
                        </span>
                        {product.stock <= 0 && <AlertTriangle size={10} className="text-red-500" />}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setProductToRestock(product);
                        setRestockAmount(1);
                      }}
                      className="px-4 py-2 bg-action text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-2"
                    >
                      <Plus size={12} /> Restock
                    </button>
                  </div>
                )}
                {(visibleColumns.visibility || visibleColumns.metaSync) && (
                  <div className="col-span-2 pt-4 border-t border-soft/30 flex items-center justify-between">
                     <div className="space-y-1">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-label opacity-60">System Status</p>
                        <div className="flex items-center gap-3">
                          {visibleColumns.visibility && (
                            <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest ${product.isActive ? "text-emerald-600" : "text-red-500 opacity-60"}`}>
                              {product.isActive ? <CheckCircle2 size={10} /> : <EyeOff size={10} />}
                              {product.isActive ? "Store Active" : "Store Hidden"}
                            </div>
                          )}
                          {visibleColumns.metaSync && (
                            <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest ${product.syncToFacebook ? "text-blue-600" : "text-label opacity-20"}`}>
                              <Facebook size={10} /> {product.syncToFacebook ? "Meta Synced" : "Meta Off"}
                            </div>
                          )}
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 italic font-serif text-label opacity-40 uppercase tracking-widest text-[10px]">
            No items match your filter criteria.
          </div>
        )}
      </div>

      {/* RESTOCK MODAL */}
      <Modal
        isOpen={!!productToRestock}
        onClose={() => !isRestockSubmitting && setProductToRestock(null)}
        title="Add New Inventory"
      >
        {productToRestock && (
          <div className="space-y-8 py-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-action/10 text-action rounded-full flex items-center justify-center border border-action/20">
                <RefreshCcw size={32} />
              </div>
              <div>
                <h3 className="type-section text-lg uppercase tracking-widest">
                  {productToRestock.title}
                </h3>
                <p className="type-label text-label normal-case italic font-serif mt-2">
                  Current Stock:{" "}
                  <span className="text-heading font-bold not-italic">
                    {productToRestock.stock} units
                  </span>
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
                    onClick={() =>
                      setRestockAmount(Math.max(1, restockAmount - 1))
                    }
                    className="w-14 h-14 bg-soft rounded-2xl flex items-center justify-center hover:bg-action hover:text-white transition-all text-xl font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="flex-1 bg-surface border border-soft rounded-[2rem] px-6 py-4 text-2xl font-bold text-heading text-center focus:outline-none"
                    value={restockAmount}
                    onChange={(e) =>
                      setRestockAmount(parseInt(e.target.value) || 0)
                    }
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
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setProductToRestock(null)}
                disabled={isRestockSubmitting}
              >
                Cancel
              </Button>
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

      <ProductStudioDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={selectedProduct}
        categories={allCategoryObjects}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
