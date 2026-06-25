import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { analytics, getOrders, getCustomers, type StoredOrder } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [stats, setStats] = useState({ revenue: 0, units: 0, count: 0, aov: 0, customers: 0 });

  useEffect(() => {
    const o = getOrders();
    const a = analytics();
    setOrders(o);
    setStats({ revenue: a.revenue, units: a.units, count: a.count, aov: a.aov, customers: getCustomers().length });
  }, []);

  const cards = [
    { label: "Revenue", value: "₹" + Math.round(stats.revenue).toLocaleString("en-IN") },
    { label: "Orders", value: stats.count.toString() },
    { label: "Units Sold", value: stats.units.toString() },
    { label: "Avg. Order", value: "₹" + Math.round(stats.aov).toLocaleString("en-IN") },
    { label: "Customers", value: stats.customers.toString() },
  ];

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <span style={{ fontFamily: "Cinzel, serif" }} className="text-[10px] tracking-[0.4em] text-[#c9a84c]">OVERVIEW</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl">Dashboard</h1>
        </div>
        <Link to="/admin/orders" className="text-xs tracking-[0.3em] text-[#c9a84c] hover:text-[#e0c878]">ALL ORDERS →</Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-sm border border-[#1f1f1f] bg-[#111] p-5">
            <div className="text-[10px] tracking-[0.3em] text-[#9a9285]">{c.label.toUpperCase()}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-2 text-3xl text-[#f5f0e8]">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-sm border border-[#1f1f1f] bg-[#111]">
        <div className="flex items-center justify-between border-b border-[#1f1f1f] px-5 py-4">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl">Recent Orders</h2>
          <span className="text-[10px] tracking-[0.3em] text-[#9a9285]">LAST 10</span>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#9a9285]">No orders yet. Place one from the storefront to populate this view.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f] text-left text-[10px] tracking-[0.3em] text-[#9a9285]">
                <th className="px-5 py-3">ORDER</th>
                <th className="px-5 py-3">CUSTOMER</th>
                <th className="px-5 py-3">ITEM</th>
                <th className="px-5 py-3">AREA</th>
                <th className="px-5 py-3 text-right">TOTAL</th>
                <th className="px-5 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((o) => (
                <tr key={o.orderId} className="border-b border-[#1f1f1f]/60 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-[#c9a84c]">{o.orderId}</td>
                  <td className="px-5 py-3">{o.name}</td>
                  <td className="px-5 py-3 text-[#9a9285]">{o.productName} · {o.size}ml × {o.qty}</td>
                  <td className="px-5 py-3 text-[#9a9285]">{o.area}</td>
                  <td className="px-5 py-3 text-right">₹{o.total.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3"><StatusPill status={o.status ?? "Pending"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "border-amber-700/60 text-amber-400",
    Confirmed: "border-blue-700/60 text-blue-400",
    Delivered: "border-emerald-700/60 text-emerald-400",
    Cancelled: "border-red-700/60 text-red-400",
  };
  return <span className={`rounded-sm border px-2 py-1 text-[10px] tracking-[0.2em] ${map[status] ?? ""}`}>{status.toUpperCase()}</span>;
}