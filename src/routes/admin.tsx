import { createFileRoute, Link, Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, LayoutDashboard, Package, Users, Boxes, BarChart3, LogOut } from "lucide-react";
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
    <div className="admin-shell grid min-h-screen place-items-center px-6">
      <form
        onSubmit={(e) => { e.preventDefault(); if (login(user, pass)) onAuth(); else setErr("Invalid credentials"); }}
        className="w-full max-w-sm rounded-xl border border-[rgba(201,168,76,0.25)] bg-[#0d0d0d] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="mb-6 text-center">
          <span style={{ fontFamily: "Cinzel, serif" }} className="text-[10px] tracking-[0.4em] text-[#c9a84c]">MAISON OUDH</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-2 text-3xl text-[#f5f0e8]">Atelier</h1>
        </div>
        <label className="mb-3 block">
          <span style={{ fontFamily: "Cinzel, serif" }} className="mb-1 block text-[10px] tracking-[0.3em] text-[#c9a84c]">USERNAME</span>
          <input value={user} onChange={(e) => setUser(e.target.value)} className="w-full px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span style={{ fontFamily: "Cinzel, serif" }} className="mb-1 block text-[10px] tracking-[0.3em] text-[#c9a84c]">PASSWORD</span>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full px-3 py-2 text-sm" />
        </label>
        {err && <p className="mt-3 text-xs text-red-400">{err}</p>}
        <button className="btn-gold mt-6 w-full rounded-md bg-gradient-to-b from-[#e0c878] to-[#c9a84c] py-3 text-xs font-semibold tracking-[0.3em] text-[#0a0a0a]">
          SIGN IN
        </button>
        <p className="mt-4 text-center text-[10px] text-[#666]">Demo: admin / maisonoudh</p>
      </form>
    </div>
  );
}

type NavItem = { to: string; label: string; exact?: boolean; icon: typeof LayoutDashboard };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", exact: true, icon: LayoutDashboard },
  { to: "/admin/orders", label: "Orders", icon: Package },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

function Shell({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const current = NAV.find((n) => (n.exact ? pathname === n.to : pathname.startsWith(n.to))) ?? NAV[0];

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="admin-shell admin-layout min-h-screen">
      {/* Sidebar — desktop */}
      <aside
        className="hidden flex-col md:flex"
        style={{ position: "fixed", top: 0, left: 0, width: 260, height: "100vh", zIndex: 100, background: "#0D0D0D", borderRight: "1px solid rgba(201,168,76,0.2)" }}
      >
        <Link to="/admin" className="block px-6 pt-8 pb-6">
          <span style={{ fontFamily: "Cinzel, serif" }} className="text-[10px] tracking-[0.45em] text-[#c9a84c]/80">MAISON OUDH</span>
          <div style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-1 text-3xl text-[#c9a84c]">Atelier</div>
        </Link>
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.35)] to-transparent" />

        <nav className="mt-6 flex-1 space-y-1 px-3">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link key={n.to} to={n.to as "/admin"} className={`admin-nav-item ${active ? "is-active" : ""}`}>
                <Icon size={16} strokeWidth={1.5} />
                <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{n.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User block */}
        <div className="mx-4 mb-6 rounded-xl border border-[rgba(201,168,76,0.2)] bg-[#111] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#e0c878] to-[#8b5e3c] text-sm font-semibold text-[#0a0a0a]">
              MO
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-[#f5f0e8]">Atelier Admin</div>
              <div className="text-[10px] tracking-[0.2em] text-[#9a9285]">SUPERUSER</div>
            </div>
          </div>
          <button
            onClick={() => { onLogout(); router.navigate({ to: "/admin" }); }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-[#2a2a2a] py-2 text-[10px] tracking-[0.3em] text-[#9a9285] transition hover:border-[#c9a84c] hover:text-[#c9a84c]"
          >
            <LogOut size={12} /> LOG OUT
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <header className="sticky top-0 z-20 flex items-center gap-3 overflow-x-auto border-b border-[rgba(201,168,76,0.2)] bg-[#0d0d0d]/95 px-4 py-3 backdrop-blur md:hidden">
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

      <main
        className="admin-main"
        style={{ minHeight: "100vh", overflowY: "auto" }}
      >
        {/* Desktop topbar */}
        <div className="admin-topbar hidden md:flex">
          <div>
            <span style={{ fontFamily: "Cinzel, serif" }} className="text-[10px] tracking-[0.4em] text-[#c9a84c]/70">
              {current.label.toUpperCase()}
            </span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl text-[#c9a84c] leading-tight">
              {current.label}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl text-[#f5f0e8]">
                {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
              <div className="text-[10px] tracking-[0.3em] text-[#9a9285]">
                {now.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
              </div>
            </div>
            <button className="relative grid h-10 w-10 place-items-center rounded-full border border-[rgba(201,168,76,0.3)] text-[#c9a84c] transition hover:border-[#c9a84c] hover:bg-[rgba(201,168,76,0.08)]">
              <Bell size={16} strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#c9a84c] shadow-[0_0_8px_#c9a84c]" />
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}