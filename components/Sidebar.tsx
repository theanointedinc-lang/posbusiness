"use client";
import { usePOS } from "@/context/POSContext";
import { ShoppingCart, LayoutDashboard, ClipboardList, Package } from "./icons";

const tabs = [
  { id: "pos", label: "POS", icon: ShoppingCart },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "inventory", label: "Inventory", icon: Package },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, cart } = usePOS();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <aside className="flex flex-col w-16 md:w-56 bg-gray-900 text-white shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
          <ShoppingCart className="w-4 h-4" />
        </div>
        <span className="hidden md:block font-bold text-lg tracking-tight">RetailPOS</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-2 mt-2 flex-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
              activeTab === id
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <div className="relative shrink-0">
              <Icon className="w-5 h-5" />
              {id === "pos" && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </div>
            <span className="hidden md:block">{label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 hidden md:block">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">A</div>
          <div>
            <p className="text-xs font-medium">Alex</p>
            <p className="text-[10px] text-gray-400">Cashier</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

