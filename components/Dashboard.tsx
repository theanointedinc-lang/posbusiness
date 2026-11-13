"use client";
import { usePOS } from "@/context/POSContext";
import { TrendingUp, ShoppingCart, DollarSign, Package } from "./icons";
import { PRODUCTS } from "@/lib/data";

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function Dashboard() {
  const { orders } = usePOS();

  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0);
  const avgOrder = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
  const lowStockCount = PRODUCTS.filter((p) => p.stock < 20 && p.stock < 999).length;

  // Today's orders
  const today = new Date();
  const todayOrders = completedOrders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
  });
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);

  // Top products
  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
  completedOrders.forEach((o) => {
    o.items.forEach((item) => {
      if (!productSales[item.product.id]) {
        productSales[item.product.id] = { name: item.product.name, qty: 0, revenue: 0 };
      }
      productSales[item.product.id].qty += item.quantity;
      productSales[item.product.id].revenue += item.product.price * item.quantity;
    });
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Payment breakdown
  const paymentBreakdown = { cash: 0, card: 0, mobile: 0 };
  completedOrders.forEach((o) => { paymentBreakdown[o.paymentMethod] += o.total; });

  const stats = [
    {
      label: "Today's Revenue",
      value: formatPrice(todayRevenue),
      sub: `${todayOrders.length} orders today`,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      sub: `${completedOrders.length} completed orders`,
      icon: TrendingUp,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Avg Order Value",
      value: formatPrice(avgOrder),
      sub: "per transaction",
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Low Stock Items",
      value: lowStockCount.toString(),
      sub: "products below 20 units",
      icon: Package,
      color: lowStockCount > 0 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600",
    },
  ];

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
              <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-300 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(p.revenue / topProducts[0].revenue) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">{formatPrice(p.revenue)}</p>
                  <p className="text-xs text-gray-400">{p.qty} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Payment Methods</h2>
          <div className="space-y-4">
            {(["cash", "card", "mobile"] as const).map((method) => {
              const amount = paymentBreakdown[method];
              const pct = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
              const colors: Record<string, string> = {
                cash: "bg-green-500",
                card: "bg-blue-500",
                mobile: "bg-purple-500",
              };
              return (
                <div key={method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium text-gray-700">{method}</span>
                    <span className="text-gray-500">
                      {formatPrice(amount)} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[method]} rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent orders mini-list */}
          <h2 className="font-semibold text-gray-900 mt-6 mb-3">Recent Orders</h2>
          <div className="space-y-2">
            {orders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-gray-800">{o.id}</span>
                  <span className="text-gray-400 ml-2">{o.cashier}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      o.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : o.status === "refunded"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {o.status}
                  </span>
                  <span className="font-semibold text-gray-900">{formatPrice(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

