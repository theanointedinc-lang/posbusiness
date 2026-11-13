"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CartItem, Order, Product } from "@/lib/types";
import { SAMPLE_ORDERS } from "@/lib/data";

interface POSContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
  cartTax: number;
  discount: number;
  setDiscount: (d: number) => void;

  // Orders
  orders: Order[];
  placeOrder: (paymentMethod: Order["paymentMethod"]) => Order;

  // UI
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const POSContext = createContext<POSContextType | null>(null);

const TAX_RATE = 0.1;

export function POSProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [discount, setDiscount] = useState(0);
  const [activeTab, setActiveTab] = useState("pos");

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscount(0);
  }, []);

  const cartSubtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const cartTax = (cartSubtotal - discount) * TAX_RATE;
  const cartTotal = cartSubtotal - discount + cartTax;

  const placeOrder = useCallback(
    (paymentMethod: Order["paymentMethod"]): Order => {
      const order: Order = {
        id: `ORD-${1008 + orders.length}`,
        items: [...cart],
        subtotal: cartSubtotal,
        tax: cartTax,
        discount,
        total: cartTotal,
        paymentMethod,
        status: "completed",
        createdAt: new Date(),
        cashier: "Alex",
      };
      setOrders((prev) => [order, ...prev]);
      clearCart();
      return order;
    },
    [cart, cartSubtotal, cartTax, discount, cartTotal, orders.length, clearCart]
  );

  return (
    <POSContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartSubtotal,
        cartTax,
        discount,
        setDiscount,
        orders,
        placeOrder,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const ctx = useContext(POSContext);
  if (!ctx) throw new Error("usePOS must be used within POSProvider");
  return ctx;
}

