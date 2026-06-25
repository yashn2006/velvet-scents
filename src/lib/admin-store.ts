import { products as seedProducts, type Product } from "./products";

const ORDERS_KEY = "maisonoudh_orders";
const PRODUCTS_KEY = "maisonoudh_products";
const AUTH_KEY = "maisonoudh_admin_token";

export const ADMIN_CREDS = { user: "admin", pass: "maisonoudh" };

export interface StoredOrder {
  orderId: string;
  createdAt: string;
  name: string;
  phone: string;
  address: string;
  area: string;
  productId: string;
  productName: string;
  size: 50 | 100;
  qty: number;
  slot: string;
  notes?: string;
  unit: number;
  total: number;
  status?: "Pending" | "Confirmed" | "Delivered" | "Cancelled";
}

export interface StockItem extends Product {
  stock: number;
  active: boolean;
}

/* -------- Auth (mock JWT) -------- */
export function login(user: string, pass: string) {
  if (user !== ADMIN_CREDS.user || pass !== ADMIN_CREDS.pass) return false;
  const payload = btoa(JSON.stringify({ sub: user, exp: Date.now() + 1000 * 60 * 60 * 8 }));
  const token = `mh.${payload}.sig`;
  localStorage.setItem(AUTH_KEY, token);
  return true;
}
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  const t = localStorage.getItem(AUTH_KEY);
  if (!t) return false;
  try {
    const [, b] = t.split(".");
    const { exp } = JSON.parse(atob(b));
    return exp > Date.now();
  } catch { return false; }
}

/* -------- Orders -------- */
export function getOrders(): StoredOrder[] {
  try {
    const raw = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    return raw.map((o: StoredOrder) => ({ ...o, status: o.status ?? "Pending" }));
  } catch { return []; }
}
export function setOrders(list: StoredOrder[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
}
export function updateOrderStatus(id: string, status: StoredOrder["status"]) {
  const list = getOrders().map((o) => o.orderId === id ? { ...o, status } : o);
  setOrders(list);
  return list;
}
export function deleteOrder(id: string) {
  setOrders(getOrders().filter((o) => o.orderId !== id));
}

/* -------- Products / Inventory -------- */
function seedStock(p: Product): StockItem { return { ...p, stock: 25, active: true }; }

export function getProducts(): StockItem[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      const init = seedProducts.map(seedStock);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw);
  } catch { return seedProducts.map(seedStock); }
}
export function saveProducts(list: StockItem[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
}
export function upsertProduct(item: StockItem) {
  const list = getProducts();
  const i = list.findIndex((p) => p.id === item.id);
  if (i >= 0) list[i] = item; else list.unshift(item);
  saveProducts(list);
  return list;
}
export function deleteProduct(id: string) {
  saveProducts(getProducts().filter((p) => p.id !== id));
}

/* -------- Customers (derived) -------- */
export interface CustomerRow {
  phone: string;
  name: string;
  orders: number;
  spend: number;
  lastOrder: string;
  areas: string[];
  history: StoredOrder[];
}
export function getCustomers(): CustomerRow[] {
  const map = new Map<string, CustomerRow>();
  for (const o of getOrders()) {
    const k = o.phone || o.name;
    const c = map.get(k) ?? {
      phone: o.phone, name: o.name, orders: 0, spend: 0, lastOrder: o.createdAt, areas: [], history: [],
    };
    c.orders += 1;
    c.spend += o.total;
    if (o.createdAt > c.lastOrder) c.lastOrder = o.createdAt;
    if (o.area && !c.areas.includes(o.area)) c.areas.push(o.area);
    c.history.push(o);
    map.set(k, c);
  }
  return [...map.values()].sort((a, b) => b.spend - a.spend);
}

/* -------- Analytics helpers -------- */
export function analytics() {
  const orders = getOrders();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const units = orders.reduce((s, o) => s + o.qty, 0);
  const aov = orders.length ? revenue / orders.length : 0;

  const byDay = new Map<string, number>();
  const byCat = new Map<string, number>();
  const byArea = new Map<string, number>();
  const byProduct = new Map<string, { name: string; qty: number; revenue: number }>();
  const prods = getProducts();

  for (const o of orders) {
    const d = o.createdAt.slice(0, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + o.total);
    byArea.set(o.area, (byArea.get(o.area) ?? 0) + o.total);
    const p = prods.find((x) => x.id === o.productId);
    const cat = p?.category ?? "Other";
    byCat.set(cat, (byCat.get(cat) ?? 0) + o.total);
    const cur = byProduct.get(o.productId) ?? { name: o.productName, qty: 0, revenue: 0 };
    cur.qty += o.qty; cur.revenue += o.total;
    byProduct.set(o.productId, cur);
  }

  return {
    revenue, units, aov, count: orders.length,
    daily: [...byDay.entries()].sort(([a],[b]) => a.localeCompare(b)).map(([date, total]) => ({ date, total })),
    byCategory: [...byCat.entries()].map(([name, value]) => ({ name, value })),
    byArea: [...byArea.entries()].sort((a,b) => b[1]-a[1]).slice(0, 8).map(([name, value]) => ({ name, value })),
    topProducts: [...byProduct.values()].sort((a,b) => b.revenue - a.revenue).slice(0, 5),
  };
}