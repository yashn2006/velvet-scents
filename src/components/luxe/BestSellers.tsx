import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { products, type Category } from "@/lib/products";

const FILTERS: ("All" | Category)[] = ["All", "Arabic", "Designer", "Fresh", "Woody", "Limited"];

export function BestSellers() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [sizes, setSizes] = useState<Record<string, 50 | 100>>({});

  const visible = useMemo(
    () => (filter === "All" ? products : products.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section id="shop" className="relative bg-[#0a0a0a] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="gold-divider font-accent text-xs">Best Sellers</span>
          <h2 className="font-display mt-4 text-4xl text-[#f5f0e8] md:text-6xl">The Most Desired</h2>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-accent rounded-sm border px-4 py-2 text-[11px] transition-all ${
                filter === f
                  ? "border-[#c9a84c] bg-[#c9a84c] text-[#0a0a0a]"
                  : "border-[#2a2a2a] text-[#9a9285] hover:border-[#c9a84c] hover:text-[#c9a84c]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => {
              const size = sizes[p.id] ?? 50;
              const price = size === 50 ? p.price50 : p.price100;
              return (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="group relative overflow-hidden rounded-sm border border-[#2a2a2a] bg-[#111111] transition-all duration-500 hover:-translate-y-2 hover:border-[#c9a84c]/40"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-contain p-8 transition-transform duration-700 group-hover:scale-105" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6))]" />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent px-5 pb-5 pt-10 transition-transform duration-500 group-hover:translate-y-0">
                      <p className="font-accent mb-2 text-[10px] text-[#c9a84c]">Fragrance Notes</p>
                      <NoteRow label="Top" items={p.notes.top} />
                      <NoteRow label="Heart" items={p.notes.heart} />
                      <NoteRow label="Base" items={p.notes.base} />
                    </div>
                  </div>

                  <div className="space-y-3 p-5">
                    <p className="font-accent text-[10px] text-[#c9a84c]">{p.brand}</p>
                    <h3 className="font-display text-2xl text-[#f5f0e8]">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {([50, 100] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => setSizes((m) => ({ ...m, [p.id]: s }))}
                            className={`font-accent rounded-sm border px-2.5 py-1 text-[10px] transition-colors ${
                              size === s
                                ? "border-[#c9a84c] text-[#c9a84c]"
                                : "border-[#2a2a2a] text-[#9a9285] hover:border-[#c9a84c]/60"
                            }`}
                          >
                            {s}ml
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-[#c9a84c]">
                        <Star /> <span className="font-accent text-xs">{p.rating}</span>
                      </div>
                    </div>
                    <p className="font-display text-2xl text-[#c9a84c]">₹{price.toLocaleString("en-IN")}</p>
                    <div className="flex gap-2 pt-1">
                      <button className="btn-ghost-gold flex-1 !py-2.5 !text-[10px]">Add to Cart</button>
                      <a href="#order" className="btn-gold flex-1 !py-2.5 !text-[10px]">Order Now</a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function NoteRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
      <span className="font-accent w-12 text-[9px] text-[#9a9285]">{label}</span>
      {items.map((n) => (
        <span key={n} className="rounded-sm border border-[#2a2a2a] px-2 py-0.5 text-[10px] text-[#f5f0e8]">{n}</span>
      ))}
    </div>
  );
}

function Star() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.95 6.97L22 10l-5.5 4.78L18.18 22 12 18.27 5.82 22l1.68-7.22L2 10l7.05-1.03L12 2z"/>
    </svg>
  );
}