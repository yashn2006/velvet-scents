import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORY_LABELS, type Category, type Mood, type Product } from "@/lib/products";
import { getProducts, subscribeProducts, type StockItem } from "@/lib/admin-store";
import { ProductModal } from "./ProductModal";

const CAT_FILTERS: ("All" | Category)[] = ["All", "Arabic", "Designer", "Fresh", "Woody", "Limited"];
const MOOD_FILTERS: ("All" | Mood)[] = ["All", "Romantic", "Intense", "Fresh", "Royal", "Mysterious"];
const PER_PAGE = 9;

export function BestSellers() {
  const [cat, setCat] = useState<(typeof CAT_FILTERS)[number]>("All");
  const [mood, setMood] = useState<(typeof MOOD_FILTERS)[number]>("All");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<Product | null>(null);
  const [liveProducts, setLiveProducts] = useState<StockItem[]>([]);

  // Live sync with admin inventory: initial fetch, then subscribe to
  // upsert/delete events, cross-tab storage events, and a 30s refresh.
  useEffect(() => {
    const load = () => setLiveProducts(getProducts());
    load();
    const unsub = subscribeProducts(load);
    return unsub;
  }, []);

  const filtered = useMemo(
    () =>
      liveProducts.filter(
        (p) =>
          p.active !== false &&
          (cat === "All" || p.category === cat) &&
          (mood === "All" || p.mood === mood),
      ),
    [cat, mood, liveProducts],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const resetPage = () => setPage(1);

  return (
    <section
      id="shop"
      className="relative py-24"
      style={{
        background:
          "linear-gradient(180deg, #0A0A0A 0%, #0F0800 50%, #0A0A0A 100%)",
      }}
    >
      {/* subtle gold noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.03,
          backgroundImage:
            "radial-gradient(rgba(201,168,76,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="gold-divider font-accent text-xs">Shop The House</span>
          <h2 className="font-display mt-4 text-4xl text-[#f5f0e8] md:text-6xl">The Collection</h2>
        </div>

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {CAT_FILTERS.map((f) => {
            const label = f === "All" ? "All" : CATEGORY_LABELS[f];
            const activeF = cat === f;
            return (
              <button
                key={f}
                onClick={() => { setCat(f); resetPage(); }}
                className={`font-accent rounded-sm border px-4 py-2 text-[11px] tracking-[0.2em] transition-all ${
                  activeF
                    ? "border-[#c9a84c] bg-[#c9a84c] text-[#0a0a0a]"
                    : "border-[#c9a84c]/40 bg-[#0a0a0a] text-[#c9a84c] hover:border-[#c9a84c] hover:bg-[#c9a84c]/10"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Mood filter */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="font-accent mr-2 text-[10px] tracking-[0.3em] text-[#9a9285]">MOOD</span>
          {MOOD_FILTERS.map((m) => {
            const activeF = mood === m;
            return (
              <button
                key={m}
                onClick={() => { setMood(m); resetPage(); }}
                className={`font-accent rounded-full border px-3.5 py-1.5 text-[10px] tracking-[0.2em] transition-all ${
                  activeF
                    ? "border-[#c9a84c] bg-[#c9a84c] text-[#0a0a0a]"
                    : "border-[#c9a84c]/30 bg-transparent text-[#c9a84c]/80 hover:border-[#c9a84c] hover:text-[#c9a84c]"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>

        {/* Grid (3x3) */}
        <div className="relative mt-12 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${cat}-${mood}-${safePage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={() => setActive(p)} />
              ))}
              {visible.length === 0 && (
                <div className="col-span-full py-20 text-center font-accent text-xs tracking-[0.3em] text-[#9a9285]">
                  NO FRAGRANCES MATCH THIS COMBINATION
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
              const activeF = n === safePage;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  aria-label={`Page ${n}`}
                  className={`font-accent h-10 w-10 rounded-sm border text-sm transition-all ${
                    activeF
                      ? "border-[#c9a84c] bg-[#c9a84c] text-[#0a0a0a]"
                      : "border-[#c9a84c]/40 bg-transparent text-[#c9a84c] hover:border-[#c9a84c] hover:bg-[#c9a84c]/10"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <ProductModal product={active} onClose={() => setActive(null)} />
    </section>
  );
}

function ProductCard({ product, onOpen }: { product: StockItem; onOpen: () => void }) {
  const fromPrice = Math.min(
    product.inspiredPrice50 ?? product.price50,
    product.inspiredPrice100 ?? product.price100,
  );
  const outOfStock = (product.stock ?? 0) <= 0;
  return (
    <article
      onClick={outOfStock ? undefined : onOpen}
      className="mo-card group relative cursor-pointer overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(201,168,76,0.15)",
        borderRadius: 16,
        backdropFilter: "blur(8px)",
        padding: 24,
        cursor: outOfStock ? "not-allowed" : undefined,
      }}
    >
      {/* diagonal glass shine */}
      <span aria-hidden className="mo-card-shine" />

      {outOfStock && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[16px] bg-black/70 backdrop-blur-[2px]">
          <span
            className="font-accent rounded-sm border border-[#c9a84c] bg-[#0a0a0a]/80 px-4 py-2 text-[11px] tracking-[0.35em] text-[#c9a84c]"
            style={{ transform: "rotate(-6deg)" }}
          >
            OUT OF STOCK
          </span>
        </div>
      )}

      {/* Image stage */}
      <div className="relative mx-auto flex h-[200px] items-center justify-center">
        <div className="mo-card-glow pointer-events-none absolute inset-0" />
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`mo-card-img relative h-full w-auto max-w-full object-contain transition-transform duration-[400ms] ease-out ${outOfStock ? "opacity-40 grayscale" : ""}`}
        />
      </div>

      <div className="relative mt-5 space-y-2 text-center">
        <p className="font-accent text-[10px] tracking-[0.3em] text-[#c9a84c]">{product.brand.toUpperCase()}</p>
        <h3 className="font-display text-[20px] leading-tight text-[#f5f0e8]">{product.name}</h3>
        <div className="flex items-center justify-center gap-1 text-[#c9a84c]">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} filled={i < Math.round(product.rating)} />
          ))}
          <span className="font-accent ml-1 text-[10px] text-[#9a9285]">({product.reviews})</span>
        </div>
        <p className="font-display text-[18px] text-[#c9a84c]">
          from ₹{fromPrice.toLocaleString("en-IN")}
        </p>
        <div className="pt-2">
          <button
            disabled={outOfStock}
            onClick={(e) => { e.stopPropagation(); if (!outOfStock) onOpen(); }}
            className="mo-card-cta font-accent inline-flex items-center justify-center rounded-sm border border-[#c9a84c] px-5 py-2 text-[10px] tracking-[0.3em] text-[#c9a84c] transition-all hover:bg-[#c9a84c] hover:text-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#c9a84c]"
          >
            {outOfStock ? "UNAVAILABLE" : "VIEW DETAILS"}
          </button>
        </div>
      </div>
    </article>
  );
}

function Star({ filled = true }: { filled?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l2.95 6.97L22 10l-5.5 4.78L18.18 22 12 18.27 5.82 22l1.68-7.22L2 10l7.05-1.03L12 2z"/>
    </svg>
  );
}