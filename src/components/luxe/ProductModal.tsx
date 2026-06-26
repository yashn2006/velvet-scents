import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { Product } from "@/lib/products";

type Version = "Original" | "Inspired";

function priceFor(p: Product, version: Version, size: 50 | 100) {
  if (version === "Original") {
    return size === 50
      ? (p.originalPrice50 ?? p.price50 * 4)
      : (p.originalPrice100 ?? p.price100 * 4);
  }
  return size === 50
    ? (p.inspiredPrice50 ?? p.price50)
    : (p.inspiredPrice100 ?? p.price100);
}

export function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const overlay = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [origSize, setOrigSize] = useState<50 | 100>(100);
  const [inspSize, setInspSize] = useState<50 | 100>(50);

  useEffect(() => {
    if (!product) return;
    setOrigSize(100); setInspSize(50);
    const tl = gsap.timeline();
    tl.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" })
      .fromTo(
        card.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
        "-=0.05",
      );
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeAnimated(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const closeAnimated = () => {
    gsap.to(card.current, { opacity: 0, scale: 0.92, duration: 0.25, ease: "power2.in" });
    gsap.to(overlay.current, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: onClose });
  };

  if (!product) return null;

  const order = (version: Version, size: 50 | 100) => {
    window.dispatchEvent(new CustomEvent("mo:order-prefill", {
      detail: { productId: product.id, version, size },
    }));
    closeAnimated();
    setTimeout(() => {
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  };

  return (
    <div
      ref={overlay}
      onClick={closeAnimated}
      className="fixed inset-0 z-[120] overflow-hidden"
      style={{ background: "rgba(0,0,0,0.92)", opacity: 0 }}
    >
      <style>{`
        @keyframes mo-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .mo-float { animation: mo-float 3s ease-in-out infinite; }
        @keyframes mo-shine {
          0% { transform: translateX(-120%) rotate(15deg); }
          100% { transform: translateX(220%) rotate(15deg); }
        }
        .mo-stage:hover .mo-shine { animation: mo-shine 1.2s ease-in-out; }
        .mo-stage:hover .mo-bottle { transform: scale(1.04); }
        .mo-stage:hover .mo-halo { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
        .mo-bottle { transition: transform .3s ease; }
        .mo-halo { transition: opacity .4s ease, transform .4s ease; }
        @keyframes mo-card-shimmer {
          0% { transform: translateX(-120%) rotate(20deg); }
          100% { transform: translateX(220%) rotate(20deg); }
        }
        .mo-card { transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
        .mo-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 18px rgba(201,168,76,0.35);
          border-color: rgba(201,168,76,0.6);
        }
        .mo-card:hover .mo-card-shimmer { animation: mo-card-shimmer 1.1s ease-in-out; }
        .mo-noise {
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 3px 3px;
        }
      `}</style>

      <div
        ref={card}
        onClick={(e) => e.stopPropagation()}
        className="relative grid h-full w-full grid-cols-1 md:grid-cols-2"
        style={{ opacity: 0 }}
      >
        <button
          onClick={closeAnimated}
          aria-label="Close"
          className="absolute right-5 top-5 z-30 grid h-11 w-11 place-items-center rounded-full border border-[#c9a84c]/40 bg-black/40 text-xl text-[#c9a84c] backdrop-blur-sm transition-all hover:scale-110 hover:bg-[#c9a84c]/15"
        >
          ✕
        </button>

        {/* LEFT — Visual stage */}
        <div className="mo-stage relative flex items-center justify-center overflow-hidden bg-[#080808] md:h-full">
          <div
            className="mo-halo pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px]"
            style={{
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(201,168,76,0.35), rgba(180,90,30,0.18) 40%, transparent 70%)",
              opacity: 0.85,
              filter: "blur(8px)",
            }}
          />
          <div className="relative flex flex-col items-center px-8 py-12">
            <div className="mo-bottle mo-float relative">
              <img
                src={product.image}
                alt={product.name}
                className="select-none"
                style={{
                  maxHeight: 380,
                  width: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.7))",
                }}
              />
              <div
                className="mo-shine pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
                  mixBlendMode: "screen",
                  opacity: 0.6,
                  transform: "translateX(-120%) rotate(15deg)",
                }}
              />
            </div>
            <img
              src={product.image}
              alt=""
              aria-hidden
              className="-mt-2 select-none"
              style={{
                maxHeight: 200,
                width: "auto",
                objectFit: "contain",
                transform: "scaleY(-1)",
                opacity: 0.2,
                filter: "blur(3px)",
                maskImage: "linear-gradient(to bottom, black, transparent 85%)",
                WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
              }}
            />
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="relative flex h-full flex-col overflow-y-auto bg-[#0c0c0c]">
          <div className="mo-noise pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative z-10 mx-auto w-full max-w-[560px] px-6 py-12 md:px-10 md:py-16">
            <div className="font-accent text-[10px] uppercase tracking-[0.35em] text-[#c9a84c]">
              {(product.originalBrandName ?? product.brand).toUpperCase()}
            </div>
            <h2 className="font-display mt-3 text-[40px] leading-[1.05] text-[#f5f0e8] md:text-[52px]">
              {product.name}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 text-[#c9a84c]">
                {"★".repeat(Math.round(product.rating))}
                <span className="font-accent text-xs text-[#9a9285]">({product.reviews} reviews)</span>
              </span>
              <span className="rounded-sm border border-[#c9a84c]/40 px-2.5 py-1 text-[10px] tracking-[0.25em] text-[#c9a84c]">
                {product.category.toUpperCase()}
              </span>
            </div>
            {product.shortDescription && (
              <p className="mt-5 text-sm leading-relaxed text-[#cfc6b3]">{product.shortDescription}</p>
            )}

            <div className="mt-6 grid grid-cols-3 gap-3">
              <NotesCol label="Top" items={product.notes.top} />
              <NotesCol label="Heart" items={product.notes.heart} />
              <NotesCol label="Base" items={product.notes.base} />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* ORIGINAL */}
              <div
                className="mo-card relative overflow-hidden rounded-[12px] p-5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="mo-card-shimmer pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.18) 50%, transparent 60%)",
                    transform: "translateX(-120%) rotate(20deg)",
                  }}
                />
                <span className="font-accent inline-block rounded-sm border border-[#c9a84c]/60 px-2.5 py-1 text-[10px] tracking-[0.3em] text-[#c9a84c]">
                  ORIGINAL
                </span>
                <p className="mt-3 text-xs leading-relaxed text-[#cfc6b3]">
                  Authentic by{" "}
                  <span className="text-[#c9a84c]">{product.originalBrandName ?? product.brand}</span>.
                </p>
                <SizeToggle value={origSize} onChange={setOrigSize} />
                <div className="mt-3 text-[11px] text-[#6b6457] line-through">
                  ₹{Math.round(priceFor(product, "Original", origSize) * 1.18).toLocaleString("en-IN")}
                </div>
                <div className="font-display text-3xl text-[#c9a84c]">
                  ₹{priceFor(product, "Original", origSize).toLocaleString("en-IN")}
                  <span className="font-accent ml-2 text-[10px] tracking-[0.25em] text-[#9a9285]">
                    / {origSize}ML
                  </span>
                </div>
                <button
                  onClick={() => order("Original", origSize)}
                  className="btn-ghost-gold mt-4 w-full !py-2.5 !text-[11px]"
                >
                  Order Original
                </button>
              </div>

              {/* INSPIRED */}
              <div
                className="mo-card relative overflow-hidden rounded-[12px] p-5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="mo-card-shimmer pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(229,160,80,0.25) 50%, transparent 60%)",
                    transform: "translateX(-120%) rotate(20deg)",
                  }}
                />
                <span className="font-accent inline-block rounded-sm bg-[#c9a84c] px-2.5 py-1 text-[10px] tracking-[0.3em] text-[#0a0a0a]">
                  INSPIRED
                </span>
                <p className="mt-3 text-xs leading-relaxed text-[#cfc6b3]">Same soul, accessible price.</p>
                <SizeToggle value={inspSize} onChange={setInspSize} />
                <div className="mt-3 font-display text-3xl text-[#e0c878]">
                  ₹{priceFor(product, "Inspired", inspSize).toLocaleString("en-IN")}
                  <span className="font-accent ml-2 text-[10px] tracking-[0.25em] text-[#9a9285]">
                    / {inspSize}ML
                  </span>
                </div>
                <p className="mt-1 text-[10px] italic text-[#9a9285]">Loved by 1000+ customers.</p>
                <button
                  onClick={() => order("Inspired", inspSize)}
                  className="btn-gold shimmer-hover mt-4 w-full !py-2.5 !text-[11px]"
                >
                  Order Inspired
                </button>
              </div>
            </div>

            <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
            <p className="mt-4 text-center text-[11px] text-[#9a9285]">
              We deliver across all of Mumbai. Pick a version above to begin your order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SizeToggle({ value, onChange }: { value: 50 | 100; onChange: (v: 50 | 100) => void }) {
  return (
    <div className="mt-4 flex gap-2">
      {([50, 100] as const).map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`font-accent flex-1 rounded-sm border px-3 py-2 text-[10px] tracking-[0.25em] transition-colors ${
            value === s
              ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]"
              : "border-[#2a2a2a] text-[#9a9285] hover:border-[#c9a84c]/60"
          }`}
        >
          {s}ML
        </button>
      ))}
    </div>
  );
}

function NotesCol({ label, items }: { label: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <div className="font-accent text-[10px] tracking-[0.3em] text-[#c9a84c]">{label.toUpperCase()}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((n) => (
          <span key={n} className="rounded-sm border border-[#c9a84c]/40 px-2 py-0.5 text-[10px] text-[#f5f0e8]">
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}