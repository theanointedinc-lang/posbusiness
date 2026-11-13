"use client";
import { useState } from "react";
import { usePOS } from "@/context/POSContext";
import { Trash2, Plus, Minus, CreditCard, Banknote, Smartphone, Tag, ShoppingBag } from "./icons";
import { Order } from "@/lib/types";

function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartTax,
    cartTotal,
    discount,
    setDiscount,
    placeOrder,
    setActiveTab,
  } = usePOS();

  const [discountInput, setDiscountInput] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "payment" | "receipt">("cart");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  function handleApplyDiscount() {
    const val = parseFloat(discountInput);
    if (!isNaN(val) && val >= 0 && val <= cartSubtotal) {
      setDiscount(val);
    }
    setDiscountInput("");
  }

  function handlePayment(method: Order["paymentMethod"]) {
    const order = placeOrder(method);
    setLastOrder(order);
    setCheckoutStep("receipt");
  }

  function handleNewSale() {
    setCheckoutStep("cart");
    setLastOrder(null);
  }

  if (checkoutStep === "receipt" && lastOrder) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Payment Complete!</h2>
            <p className="text-sm text-gray-500 mt-1">{lastOrder.id}</p>
          </div>
          <div className="w-full bg-gray-50 rounded-xl p-4 text-left space-y-2">
            {lastOrder.items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>{formatPrice(lastOrder.subtotal)}</span>
              </div>
              {lastOrder.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span><span>−{formatPrice(lastOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax (10%)</span><span>{formatPrice(lastOrder.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-200">
                <span>Total</span><span>{formatPrice(lastOrder.total)}</span>
              </div>
            </div>
            <div className="text-xs text-center text-gray-400 pt-1 capitalize">
              Paid via {lastOrder.paymentMethod}
            </div>
          </div>
        </div>
        <div className="p-4 space-y-2 border-t border-gray-200">
          <button
            onClick={handleNewSale}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            New Sale
          </button>
          <button
            onClick={() => { handleNewSale(); setActiveTab("orders"); }}
            className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  if (checkoutStep === "payment") {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <button
            onClick={() => setCheckoutStep("cart")}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back
          </button>
          <h2 className="font-semibold text-gray-900">Select Payment</h2>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <p className="text-sm text-indigo-600 font-medium">Total Due</p>
            <p className="text-3xl font-bold text-indigo-700 mt-1">{formatPrice(cartTotal)}</p>
          </div>

          {[
            { method: "cash" as const, label: "Cash", icon: Banknote, color: "bg-green-50 border-green-200 hover:bg-green-100 text-green-800" },
            { method: "card" as const, label: "Credit / Debit Card", icon: CreditCard, color: "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800" },
            { method: "mobile" as const, label: "Mobile Payment", icon: Smartphone, color: "bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-800" },
          ].map(({ method, label, icon: Icon, color }) => (
            <button
              key={method}
              onClick={() => handlePayment(method)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 font-medium transition-all active:scale-98 ${color}`}
            >
              <Icon className="w-6 h-6 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Cart view
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-900">
            Cart{" "}
            {cart.length > 0 && (
              <span className="text-gray-400 font-normal text-sm">
                ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            )}
          </h2>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-3">
            <ShoppingBag className="w-12 h-12" />
            <p className="text-sm text-gray-400">Cart is empty</p>
            <p className="text-xs text-gray-300">Click a product to add it</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-400">{formatPrice(item.product.price)} each</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="w-14 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals + checkout */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 p-4 space-y-3">
          {/* Discount */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="number"
                placeholder="Discount ($)"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              onClick={handleApplyDiscount}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              Apply
            </button>
          </div>

          {/* Summary */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Tax (10%)</span><span>{formatPrice(cartTax)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
              <span>Total</span><span className="text-indigo-600">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => setCheckoutStep("payment")}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors active:scale-98"
          >
            Checkout — {formatPrice(cartTotal)}
          </button>
        </div>
      )}
    </div>
  );
}

