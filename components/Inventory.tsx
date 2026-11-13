"use client";
import { useState } from "react";
import { PRODUCTS } from "@/lib/data";
import { Search, AlertTriangle, Package } from "./icons";

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "stock" | "price">("name");

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "stock") return a.stock - b.stock;
    if (sortBy === "price") return a.price - b.price;
    return a.name.localeCompare(b.name);
  });

  const lowStock = PRODUCTS.filter((p) => p.stock < 20 && p.stock < 999);
  const totalValue = PRODUCTS.reduce((s, p) => s + (p.stock < 999 ? p.stock * p.price : 0), 0);

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <div className="flex gap-3 text-sm">
            <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium">
              {PRODUCTS.length} Products
            </div>
            <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-medium">
              {formatPrice(totalValue)} Stock Value
            </div>
            {lowStock.length > 0 && (
              <div className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {lowStock.length} Low Stock
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or barcode…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === cat ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "stock" | "price")}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="name">Sort: Name</option>
            <option value="stock">Sort: Stock (↑)</option>
            <option value="price">Sort: Price (↑)</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Barcode</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Stock Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => {
                const isLow = product.stock < 20 && product.stock < 999;
                const isUnlimited = product.stock >= 999;
                return (
                  <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${isLow ? "bg-red-50/50" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                          <Package className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <span className="font-medium text-gray-800">{product.name}</span>
                        {isLow && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{product.category}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs hidden lg:table-cell">{product.barcode}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-semibold ${
                          isLow ? "text-red-600" : isUnlimited ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {isUnlimited ? "∞" : product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 hidden md:table-cell">
                      {isUnlimited ? "—" : formatPrice(product.stock * product.price)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

