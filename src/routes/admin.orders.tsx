import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { deleteOrder, getOrders, updateOrderStatus, type StoredOrder } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/orders")({ component: OrdersPage });

const STATUSES: StoredOrder["status"][] = ["Pending", "Confirmed", "Delivered", "Cancelled"];

function OrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => { setOrders(getOrders()); }, []);

  const filtered = useMemo(() => orders.filter((o) => {
    if (filter !== "All" && (o.status ?? "Pending") !== filter) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return o.name.toLowerCase().includes(s) || o.phone.includes(s) || o.orderId.toLowerCase().includes(s) || o.productName.toLowerCase().includes(s);
  }), [orders, q, filter]);

  return (
    <div>
      <div>
        <span style={{ fontFamily: "Cinzel, serif" }} className="text-[10px] tracking-[0.4em] text-[#c9a84c]">FULFILMENT</span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl">Orders</h1>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, phone, order id…"
          className="flex-1 min-w-[220px] rounded-sm border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a84c]" />
        <div className="flex gap-1">
          {["All", ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s as string)}
              className={`rounded-sm border px-3 py-2 text-[10px] tracking-[0.2em] ${filter === s ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]" : "border-[#2a2a2a] text-[#9a9285]"}`}>
              {(s as string).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-[#1f1f1f] bg-[#111]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1f1f1f] text-left text-[10px] tracking-[0.3em] text-[#9a9285]">
              <th className="px-4 py-3">DATE</th>
              <th className="px-4 py-3">ORDER</th>
              <th className="px-4 py-3">CUSTOMER</th>
              <th className="px-4 py-3">PRODUCT</th>
              <th className="px-4 py-3">AREA / SLOT</th>
              <th className="px-4 py-3 text-right">TOTAL</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-[#9a9285]">No matching orders.</td></tr>
            )}
            {filtered.map((o) => (
              <tr key={o.orderId} className="border-b border-[#1f1f1f]/60 align-top hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-[#9a9285]">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-[#c9a84c]">{o.orderId}</td>
                <td className="px-4 py-3">
                  <div>{o.name}</div>
                  <div className="text-[11px] text-[#9a9285]">{o.phone}</div>
                </td>
                <td className="px-4 py-3">{o.productName}<div className="text-[11px] text-[#9a9285]">{o.size}ml × {o.qty}</div></td>
                <td className="px-4 py-3 text-[#9a9285]">{o.area}<div className="text-[11px]">{o.slot}</div></td>
                <td className="px-4 py-3 text-right">₹{o.total.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <select value={o.status ?? "Pending"} onChange={(e) => setOrders(updateOrderStatus(o.orderId, e.target.value as StoredOrder["status"]))}
                    className="rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] px-2 py-1 text-xs text-[#f5f0e8] focus:border-[#c9a84c]">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { if (confirm("Delete order " + o.orderId + "?")) { deleteOrder(o.orderId); setOrders(getOrders()); } }}
                    className="text-[10px] tracking-[0.2em] text-red-400/80 hover:text-red-400">DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}