"use client";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";

export default function POSView() {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Product side */}
      <div className="flex-1 overflow-hidden flex flex-col border-r border-gray-200">
        <ProductGrid />
      </div>

      {/* Cart side */}
      <div className="w-80 xl:w-96 shrink-0 overflow-hidden flex flex-col">
        <Cart />
      </div>
    </div>
  );
}

