import { useEffect, useState } from "react";
import { SHOP } from "@/lib/products";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 80);
    onS();
    window.addEventListener("scroll", onS, { passive: true });
    return () => window.removeEventListener("scroll", onS);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-black/85 backdrop-blur-2xl border-b border-[#c9a84c]/30"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="font-display text-xl text-[#f5f0e8] md:text-2xl">{SHOP.name}</a>
        <nav className="hidden gap-8 md:flex">
          {[["Collections","#collections"],["Shop","#shop"],["Order","#order"]].map(([l,h]) => (
            <a key={l} href={h} className="mo-nav-link font-accent text-[11px] text-[#9a9285]">{l}</a>
          ))}
        </nav>
        <a href="#order" className="font-accent rounded-sm border border-[#c9a84c] px-4 py-2 text-[10px] text-[#c9a84c] transition-colors hover:bg-[#c9a84c] hover:text-[#0a0a0a]">Order Now</a>
      </div>
    </header>
  );
}