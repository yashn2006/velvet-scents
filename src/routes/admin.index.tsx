import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, IndianRupee, Package, Users, ShoppingBag, TrendingUp } from "lucide-react";
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
    { label: "Revenue",    value: "₹" + Math.round(stats.revenue).toLocaleString("en-IN"), trend: +12.4, icon: IndianRupee },
    { label: "Orders",     value: stats.count.toString(),                                  trend: +6.1,  icon: Package },
    { label: "Units Sold", value: stats.units.toString(),                                  trend: +3.8,  icon: ShoppingBag },
    { label: "Avg. Order", value: "₹" + Math.round(stats.aov).toLocaleString("en-IN"),     trend: -1.2,  icon: TrendingUp },
    { label: "Customers",  value: stats.customers.toString(),                              trend: +9.7,  icon: Users },
  ];

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <span style={{ fontFamily: "Cinzel, serif" }} className="text-[10px] tracking-[0.4em] text-[#c9a84c]">OVERVIEW</span>
          <p className="mt-2 text-sm text-[#9a9285]">Welcome back — here's the maison today.</p>
        </div>
        <Link to="/admin/orders" className="text-xs tracking-[0.3em] text-[#c9a84c] hover:text-[#e0c878]">ALL ORDERS →</Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => {
          const Icon = c.icon;
          const up = c.trend >= 0;
          return (
            <div key={c.label} className="admin-stat">
              <div className="flex items-start justify-between">
                <div className="text-[10px] tracking-[0.3em] text-[#9a9285]">{c.label.toUpperCase()}</div>
                <div className="grid h-9 w-9 place-items-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.06)] text-[#c9a84c]">
                  <Icon size={16} strokeWidth={1.5} />
                </div>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-3 text-4xl text-[#c9a84c]">{c.value}</div>
              <div className={`mt-2 inline-flex items-center gap-1 text-[11px] ${up ? "text-emerald-400" : "text-red-400"}`}>
                {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span>{up ? "+" : ""}{c.trend.toFixed(1)}%</span>
                <span className="text-[#666]">vs last week</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-[rgba(201,168,76,0.2)] bg-[#0d0d0d]">
        <div className="flex items-center justify-between border-b border-[rgba(201,168,76,0.15)] px-5 py-4">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-[#f5f0e8]">Recent Orders</h2>
          <span style={{ fontFamily: "Cinzel, serif" }} className="text-[10px] tracking-[0.3em] text-[#c9a84c]">LAST 10</span>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#9a9285]">No orders yet. Place one from the storefront to populate this view.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th>Order</th>
                <th>Customer</th>
                <th>Item</th>
                <th>Area</th>
                <th className="text-right">Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((o) => (
                <tr key={o.orderId}>
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
  return <span className="admin-badge" data-status={status}>{status}</span>;
}