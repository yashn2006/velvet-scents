import { createFileRoute, Link, Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isAuthed, login, logout } from "@/lib/admin-store";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin · Maison Oudh" }, { name: "robots", content: "noindex" }] }),
});

function AdminLayout() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { setAuthed(isAuthed()); setReady(true); }, []);

  if (!ready) return <div className="min-h-screen bg-[#0a0a0a]" />;
  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;
  return <Shell onLogout={() => { logout(); setAuthed(false); }} />;
}

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="grid min-h-screen place-items-center bg-[#0a0a0a] px-6">
      <form
        onSubmit={(e) => { e.preventDefault(); if (login(user, pass)) onAuth(); else setErr("Invalid credentials"); }}
        className="w-full max-w-sm rounded-sm border border-[#2a2a2a] bg-[#111] p-8"
      >
        <div className="mb-6 text-center">
          <span style={{ fontFamily: "Cinzel, serif" }} className="text-[10px] tracking-[0.4em] text-[#c9a84c]">MAISON OUDH</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-2 text-3xl text-[#f5f0e8]">Admin</h1>
        </div>
        <label className="mb-3 block">
          <span className="mb-1 block text-[10px] tracking-[0.3em] text-[#9a9285]">USERNAME</span>
          <input value={user} onChange={(e) => setUser(e.target.value)}
            className="w-full rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a84c]" />
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] tracking-[0.3em] text-[#9a9285]">PASSWORD</span>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
            className="w-full rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a84c]" />
        </label>
        {err && <p className="mt-3 text-xs text-red-400">{err}</p>}
        <button className="mt-6 w-full rounded-sm bg-[#c9a84c] py-3 text-xs font-semibold tracking-[0.3em] text-[#0a0a0a] hover:bg-[#e0c878]">
          SIGN IN
        </button>
        <p className="mt-4 text-center text-[10px] text-[#666]">Demo: admin / maisonoudh</p>
      </form>
    </div>
  );
}

const NAV: { to: string; label: string; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/inventory", label: "Inventory" },
  { to: "/admin/analytics", label: "Analytics" },
];

function Shell({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8]">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-[#1f1f1f] bg-[#0d0d0d] p-6 md:block">
        <Link to="/admin" className="block">
          <span style={{ fontFamily: "Cinzel, serif" }} className="text-[10px] tracking-[0.4em] text-[#c9a84c]">MAISON OUDH</span>
          <div style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl">Atelier</div>
        </Link>
        <nav className="mt-10 space-y-1">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as "/admin"}
                className={`block rounded-sm px-3 py-2 text-sm transition-colors ${
                  active ? "bg-[#c9a84c]/10 text-[#c9a84c]" : "text-[#9a9285] hover:bg-white/5 hover:text-[#f5f0e8]"
                }`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={() => { onLogout(); router.navigate({ to: "/admin" }); }}
          className="absolute bottom-6 left-6 right-6 rounded-sm border border-[#2a2a2a] py-2 text-[10px] tracking-[0.3em] text-[#9a9285] hover:border-[#c9a84c] hover:text-[#c9a84c]">
          LOG OUT
        </button>
      </aside>

      <header className="sticky top-0 z-10 flex items-center gap-3 overflow-x-auto border-b border-[#1f1f1f] bg-[#0d0d0d]/95 px-4 py-3 backdrop-blur md:hidden">
        {NAV.map((n) => {
          const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to as "/admin"} className={`whitespace-nowrap text-xs ${active ? "text-[#c9a84c]" : "text-[#9a9285]"}`}>
              {n.label}
            </Link>
          );
        })}
        <button onClick={onLogout} className="ml-auto whitespace-nowrap text-[10px] tracking-[0.3em] text-[#9a9285]">EXIT</button>
      </header>

      <main className="md:pl-60">
        <div className="mx-auto max-w-7xl p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}