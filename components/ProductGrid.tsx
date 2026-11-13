"use client";
import { useState, useMemo } from "react";
import { usePOS } from "@/context/POSContext";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import { Search, Plus } from "./icons";

const CATEGORY_COLORS: Record<string, string> = {
  Beverages: "bg-blue-100 text-blue-700",
  Snacks: "bg-amber-100 text-amber-700",
  Dairy: "bg-purple-100 text-purple-700",
  Household: "bg-green-100 text-green-700",
  Bakery: "bg-orange-100 text-orange-700",
};

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function ProductGrid() {
  const { addToCart, cart } = usePOS();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.barcode && p.barcode.includes(search));
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const getCartQty = (productId: string) =>
    cart.find((i) => i.product.id === productId)?.quantity ?? 0;

  return (
    <div className="flex flex-col h-full">
      {/* Search + filter bar */}
      <div className="p-4 border-b border-gray-200 space-y-3 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products or scan barcode…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                category === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Search className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((product) => {
              const qty = getCartQty(product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`relative bg-white rounded-xl border p-3 text-left transition-all hover:shadow-md hover:border-indigo-300 active:scale-95 ${
                    qty > 0 ? "border-indigo-400 ring-1 ring-indigo-300" : "border-gray-200"
                  }`}
                >
                  {/* Category badge */}
                  <span
                    className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full mb-2 ${
                      CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.category}
                  </span>

                  {/* Name */}
                  <p className="text-xs font-semibold text-gray-800 leading-tight mb-1 line-clamp-2">
                    {product.name}
                  </p>

                  {/* Price + stock */}
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-sm font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <span
                      className={`text-[10px] ${
                        product.stock < 10 ? "text-red-500 font-semibold" : "text-gray-400"
                      }`}
                    >
                      {product.stock < 999 ? `${product.stock} left` : ""}
                    </span>
                  </div>

                  {/* Cart qty badge */}
                  {qty > 0 && (
                    <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {qty}
                    </span>
                  )}

                  {/* Add icon overlay */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100">
                    <Plus className="w-3 h-3 text-indigo-500" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

