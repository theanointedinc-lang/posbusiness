"use client";
import { POSProvider } from "@/context/POSContext";
import Sidebar from "@/components/Sidebar";
import POSView from "@/components/POSView";
import Dashboard from "@/components/Dashboard";
import Orders from "@/components/Orders";
import Inventory from "@/components/Inventory";
import { usePOS } from "@/context/POSContext";

function AppContent() {
  const { activeTab } = usePOS();
  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {activeTab === "pos" && <POSView />}
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "orders" && <Orders />}
        {activeTab === "inventory" && <Inventory />}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <POSProvider>
      <AppContent />
    </POSProvider>
  );
}
