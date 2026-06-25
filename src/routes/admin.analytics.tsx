import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { analytics } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

const GOLD = ["#c9a84c", "#e0c878", "#a8862f", "#f5d98a", "#8a6d1f"];

function AnalyticsPage() {
  const [data, setData] = useState<ReturnType<typeof analytics> | null>(null);
  useEffect(() => { setData(analytics()); }, []);

  if (!data) return null;

  return (
    <div>
      <div>
        <span style={{ fontFamily: "Cinzel, serif" }} className="text-[10px] tracking-[0.4em] text-[#c9a84c]">INTELLIGENCE</span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl">Analytics</h1>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Daily Revenue">
          {data.daily.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.daily}>
                <CartesianGrid stroke="#1f1f1f" />
                <XAxis dataKey="date" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={tt} formatter={(v: number) => "₹" + v.toLocaleString("en-IN")} />
                <Line type="monotone" dataKey="total" stroke="#c9a84c" strokeWidth={2} dot={{ fill: "#c9a84c" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Revenue by Category">
          {data.byCategory.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.byCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                  {data.byCategory.map((_, i) => <Cell key={i} fill={GOLD[i % GOLD.length]} />)}
                </Pie>
                <Tooltip contentStyle={tt} formatter={(v: number) => "₹" + v.toLocaleString("en-IN")} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#9a9285" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Top Areas (Mumbai)">
          {data.byArea.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.byArea}>
                <CartesianGrid stroke="#1f1f1f" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={tt} formatter={(v: number) => "₹" + v.toLocaleString("en-IN")} />
                <Bar dataKey="value" fill="#c9a84c" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Top Products">
          {data.topProducts.length === 0 ? <Empty /> : (
            <ul className="divide-y divide-[#1f1f1f]">
              {data.topProducts.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl text-[#c9a84c]">{(i + 1).toString().padStart(2, "0")}</span>
                    <div>
                      <div className="text-[#f5f0e8]">{p.name}</div>
                      <div className="text-[11px] text-[#9a9285]">{p.qty} units</div>
                    </div>
                  </div>
                  <div className="text-[#c9a84c]">₹{p.revenue.toLocaleString("en-IN")}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

const tt = { background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 2, fontSize: 12 } as const;

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-[#1f1f1f] bg-[#111] p-5">
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mb-4 text-2xl">{title}</h2>
      {children}
    </div>
  );
}
function Empty() { return <div className="grid h-[260px] place-items-center text-sm text-[#9a9285]">No data yet — place an order from the storefront.</div>; }