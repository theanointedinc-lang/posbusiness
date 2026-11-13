import { Product, Order } from "./types";

export const PRODUCTS: Product[] = [
  // Beverages
  { id: "p1", name: "Coca-Cola 500ml", price: 1.99, category: "Beverages", stock: 48, barcode: "5000112637922" },
  { id: "p2", name: "Water Bottle 1L", price: 0.99, category: "Beverages", stock: 120, barcode: "5000112611953" },
  { id: "p3", name: "Orange Juice 1L", price: 2.49, category: "Beverages", stock: 32, barcode: "5000112622959" },
  { id: "p4", name: "Red Bull 250ml", price: 1.79, category: "Beverages", stock: 60, barcode: "9002490100070" },
  { id: "p5", name: "Coffee (Hot)", price: 2.99, category: "Beverages", stock: 999, barcode: "HOT001" },
  { id: "p6", name: "Green Tea 500ml", price: 1.49, category: "Beverages", stock: 55, barcode: "4901085177563" },

  // Snacks
  { id: "p7", name: "Lays Classic 150g", price: 2.29, category: "Snacks", stock: 40, barcode: "0028400421553" },
  { id: "p8", name: "Oreo Cookies 154g", price: 2.99, category: "Snacks", stock: 35, barcode: "7622210951373" },
  { id: "p9", name: "KitKat 4-finger", price: 1.29, category: "Snacks", stock: 80, barcode: "5000159461122" },
  { id: "p10", name: "Pringles Original 165g", price: 3.49, category: "Snacks", stock: 28, barcode: "0038000845260" },
  { id: "p11", name: "Snickers Bar 50g", price: 1.19, category: "Snacks", stock: 90, barcode: "5000159461801" },
  { id: "p12", name: "Doritos Nacho 150g", price: 2.49, category: "Snacks", stock: 42, barcode: "0028400621571" },

  // Dairy
  { id: "p13", name: "Whole Milk 1L", price: 1.29, category: "Dairy", stock: 50, barcode: "5017602005031" },
  { id: "p14", name: "Greek Yogurt 500g", price: 2.79, category: "Dairy", stock: 20, barcode: "5035466000010" },
  { id: "p15", name: "Cheddar Cheese 200g", price: 2.49, category: "Dairy", stock: 25, barcode: "5017602005048" },
  { id: "p16", name: "Butter 250g", price: 2.19, category: "Dairy", stock: 30, barcode: "5017602005055" },

  // Household
  { id: "p17", name: "Dish Soap 500ml", price: 1.99, category: "Household", stock: 60, barcode: "0037000861317" },
  { id: "p18", name: "Hand Sanitizer 250ml", price: 3.49, category: "Household", stock: 45, barcode: "0381371175202" },
  { id: "p19", name: "Tissue Box 100ct", price: 2.29, category: "Household", stock: 35, barcode: "0036000291440" },
  { id: "p20", name: "AA Batteries 4pk", price: 4.99, category: "Household", stock: 55, barcode: "0041100040602" },

  // Bakery
  { id: "p21", name: "White Bread Loaf", price: 1.99, category: "Bakery", stock: 20, barcode: "5000179200008" },
  { id: "p22", name: "Croissant", price: 1.49, category: "Bakery", stock: 15, barcode: "BAKE001" },
  { id: "p23", name: "Muffin Blueberry", price: 1.79, category: "Bakery", stock: 18, barcode: "BAKE002" },
  { id: "p24", name: "Donut Glazed", price: 1.29, category: "Bakery", stock: 22, barcode: "BAKE003" },
];

export const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

const now = new Date();
function daysAgo(n: number) {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d;
}

export const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    items: [
      { product: PRODUCTS[0], quantity: 2 },
      { product: PRODUCTS[6], quantity: 1 },
      { product: PRODUCTS[8], quantity: 3 },
    ],
    subtotal: 9.63,
    tax: 0.96,
    discount: 0,
    total: 10.59,
    paymentMethod: "card",
    status: "completed",
    createdAt: daysAgo(0),
    cashier: "Alex",
  },
  {
    id: "ORD-1002",
    items: [
      { product: PRODUCTS[2], quantity: 1 },
      { product: PRODUCTS[12], quantity: 2 },
    ],
    subtotal: 5.07,
    tax: 0.51,
    discount: 0.5,
    total: 5.08,
    paymentMethod: "cash",
    status: "completed",
    createdAt: daysAgo(0),
    cashier: "Sam",
  },
  {
    id: "ORD-1003",
    items: [
      { product: PRODUCTS[1], quantity: 4 },
      { product: PRODUCTS[16], quantity: 1 },
      { product: PRODUCTS[20], quantity: 2 },
    ],
    subtotal: 9.93,
    tax: 0.99,
    discount: 0,
    total: 10.92,
    paymentMethod: "mobile",
    status: "completed",
    createdAt: daysAgo(1),
    cashier: "Alex",
  },
  {
    id: "ORD-1004",
    items: [{ product: PRODUCTS[9], quantity: 1 }, { product: PRODUCTS[3], quantity: 2 }],
    subtotal: 7.07,
    tax: 0.71,
    discount: 1.0,
    total: 6.78,
    paymentMethod: "card",
    status: "refunded",
    createdAt: daysAgo(1),
    cashier: "Sam",
  },
  {
    id: "ORD-1005",
    items: [
      { product: PRODUCTS[4], quantity: 2 },
      { product: PRODUCTS[21], quantity: 2 },
      { product: PRODUCTS[22], quantity: 1 },
    ],
    subtotal: 9.75,
    tax: 0.98,
    discount: 0,
    total: 10.73,
    paymentMethod: "cash",
    status: "completed",
    createdAt: daysAgo(2),
    cashier: "Jordan",
  },
  {
    id: "ORD-1006",
    items: [{ product: PRODUCTS[14], quantity: 1 }, { product: PRODUCTS[13], quantity: 1 }],
    subtotal: 5.28,
    tax: 0.53,
    discount: 0,
    total: 5.81,
    paymentMethod: "card",
    status: "completed",
    createdAt: daysAgo(2),
    cashier: "Alex",
  },
  {
    id: "ORD-1007",
    items: [
      { product: PRODUCTS[7], quantity: 2 },
      { product: PRODUCTS[11], quantity: 1 },
      { product: PRODUCTS[1], quantity: 3 },
    ],
    subtotal: 10.44,
    tax: 1.04,
    discount: 0.5,
    total: 10.98,
    paymentMethod: "mobile",
    status: "completed",
    createdAt: daysAgo(3),
    cashier: "Sam",
  },
];

