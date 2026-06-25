import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getCustomers, type CustomerRow } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/customers")({ component: CustomersPage });

function CustomersPage() {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<CustomerRow | null>(null);

  useEffect(() => { setRows(getCustomers()); }, []);

  const filtered = useMemo(() => rows.filter((c) =>
    !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q)
  ), [rows, q]);

  return (
    <div>
      <div>
        <span style={{ fontFamily: "Cinzel, serif" }} className="text-[10px] tracking-[0.4em] text-[#c9a84c]">CLIENTELE</span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl">Customers</h1>
      </div>

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone…"
        className="mt-6 w-full max-w-md rounded-sm border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a84c]" />

      <div className="mt-6 overflow-x-auto rounded-sm border border-[#1f1f1f] bg-[#111]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1f1f1f] text-left text-[10px] tracking-[0.3em] text-[#9a9285]">
              <th className="px-4 py-3">NAME</th>
              <th className="px-4 py-3">PHONE</th>
              <th className="px-4 py-3 text-right">ORDERS</th>
              <th className="px-4 py-3 text-right">LIFETIME SPEND</th>
              <th className="px-4 py-3">LAST ORDER</th>
              <th className="px-4 py-3">AREAS</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-[#9a9285]">No customers yet.</td></tr>}
            {filtered.map((c) => (
              <tr key={c.phone || c.name} className="border-b border-[#1f1f1f]/60 hover:bg-white/[0.02]">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-[#9a9285]">{c.phone}</td>
                <td className="px-4 py-3 text-right">{c.orders}</td>
                <td className="px-4 py-3 text-right text-[#c9a84c]">₹{c.spend.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-[#9a9285]">{new Date(c.lastOrder).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-[#9a9285]">{c.areas.join(", ")}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setOpen(c)} className="text-[10px] tracking-[0.2em] text-[#c9a84c] hover:text-[#e0c878]">HISTORY →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 z-30 grid place-items-center bg-black/80 p-4">
          <div onClick={(e) => e.stopPropagation()} className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-sm border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] tracking-[0.3em] text-[#9a9285]">CUSTOMER</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-[#f5f0e8]">{open.name}</h2>
                <p className="text-xs text-[#9a9285]">{open.phone}</p>
              </div>
              <button onClick={() => setOpen(null)} className="text-[#9a9285] hover:text-[#f5f0e8]">✕</button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-sm border border-[#2a2a2a] p-3"><div className="text-[#9a9285]">Orders</div><div className="text-lg text-[#f5f0e8]">{open.orders}</div></div>
              <div className="rounded-sm border border-[#2a2a2a] p-3"><div className="text-[#9a9285]">Spend</div><div className="text-lg text-[#c9a84c]">₹{open.spend.toLocaleString("en-IN")}</div></div>
              <div className="rounded-sm border border-[#2a2a2a] p-3"><div className="text-[#9a9285]">Areas</div><div className="text-lg text-[#f5f0e8]">{open.areas.length}</div></div>
            </div>
            <h3 className="mt-6 text-[10px] tracking-[0.3em] text-[#9a9285]">ORDER HISTORY</h3>
            <ul className="mt-3 space-y-2">
              {open.history.map((o) => (
                <li key={o.orderId} className="flex items-center justify-between rounded-sm border border-[#1f1f1f] p-3 text-sm">
                  <div>
                    <div className="text-[#c9a84c]">{o.orderId}</div>
                    <div className="text-xs text-[#9a9285]">{o.productName} · {o.size}ml × {o.qty} · {new Date(o.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">₹{o.total.toLocaleString("en-IN")}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}