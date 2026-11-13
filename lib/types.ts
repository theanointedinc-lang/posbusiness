// Store data types
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  barcode?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "mobile";
  status: "completed" | "refunded" | "pending";
  createdAt: Date;
  cashier: string;
}

export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

