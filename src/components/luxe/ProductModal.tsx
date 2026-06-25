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
  const leftCard = useRef<HTMLDivElement>(null);
  const rightCard = useRef<HTMLDivElement>(null);

  const [origSize, setOrigSize] = useState<50 | 100>(100);
  const [inspSize, setInspSize] = useState<50 | 100>(50);

  useEffect(() => {
    if (!product) return;
    setOrigSize(100); setInspSize(50);
    const tl = gsap.timeline();
    tl.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" })
      .fromTo(card.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, "<")
      .fromTo(leftCard.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, "+=0.05")
      .fromTo(rightCard.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, "<");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const order = (version: Version, size: 50 | 100) => {
    window.dispatchEvent(new CustomEvent("mo:order-prefill", {
      detail: { productId: product.id, version, size },
    }));
    onClose();
    setTimeout(() => {
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const close = () => {
    gsap.to(card.current, { opacity: 0, scale: 0.9, duration: 0.2, ease: "power2.in" });
    gsap.to(overlay.current, { opacity: 0, duration: 0.25, onComplete: onClose });
  };

  return (
    <div
      ref={overlay}
      onClick={close}
      className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto p-4"
      style={{ background: "rgba(0,0,0,0.85)", opacity: 0 }}
    >
      <div
        ref={card}
        onClick={(e) => e.stopPropagation()}
        className="relative my-8 w-full max-w-[860px] overflow-hidden rounded-[16px] bg-[#111111]"
        style={{ border: "0.5px solid #c9a84c", opacity: 0 }}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-[#c9a84c]/40 text-[#c9a84c] transition-colors hover:bg-[#c9a84c]/10"
        >
          ✕
        </button>

        {/* TOP — Identity */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[280px,1fr] md:p-8">
          <div className="aspect-square overflow-hidden rounded-sm bg-[#0a0a0a]">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-6" />
          </div>
          <div>
            <div className="font-accent text-[10px] uppercase tracking-[0.35em] text-[#c9a84c]">{product.brand}</div>
            <h2 className="font-display mt-2 text-4xl text-[#f5f0e8] md:text-5xl">{product.name}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-sm border border-[#c9a84c]/40 px-2.5 py-1 text-[10px] tracking-[0.25em] text-[#c9a84c]">
                {product.category.toUpperCase()} OUD
              </span>
              <span className="flex items-center gap-1 text-[#c9a84c]">
                {"★".repeat(Math.round(product.rating))}
                <span className="font-accent text-xs text-[#9a9285]">({product.reviews})</span>
              </span>
            </div>
            {product.shortDescription && (
              <p className="mt-4 text-sm leading-relaxed text-[#9a9285]">{product.shortDescription}</p>
            )}

            <div className="mt-5 space-y-2">
              <NotesRow label="Top" items={product.notes.top} />
              <NotesRow label="Heart" items={product.notes.heart} />
              <NotesRow label="Base" items={product.notes.base} />
            </div>
          </div>
        </div>

        {/* MIDDLE — Two version cards */}
        <div className="grid grid-cols-1 gap-4 px-6 pb-6 md:grid-cols-2 md:px-8">
          {/* Original */}
          <div
            ref={leftCard}
            className="rounded-sm border border-[#c9a84c]/35 bg-[#0d0b06] p-5"
          >
            <span className="font-accent inline-block rounded-sm border border-[#c9a84c]/60 px-2.5 py-1 text-[10px] tracking-[0.3em] text-[#c9a84c]">
              ORIGINAL
            </span>
            <p className="mt-3 text-sm text-[#cfc6b3]">
              The authentic original fragrance by{" "}
              <span className="text-[#c9a84c]">{product.originalBrandName ?? product.brand}</span>.
            </p>
            <SizeToggle value={origSize} onChange={setOrigSize} />
            <div className="font-display mt-3 text-3xl text-[#c9a84c]">
              ₹{priceFor(product, "Original", origSize).toLocaleString("en-IN")}
              <span className="font-accent ml-2 text-[10px] tracking-[0.25em] text-[#9a9285]">/ {origSize}ML</span>
            </div>
            <p className="mt-1 text-[11px] italic text-[#9a9285]">Sourced & delivered authentic. Price may vary.</p>
            <button
              onClick={() => order("Original", origSize)}
              className="btn-ghost-gold mt-4 w-full !py-2.5 !text-[11px]"
            >
              Order Original
            </button>
          </div>

          {/* Inspired */}
          <div
            ref={rightCard}
            className="rounded-sm border border-[#c9a84c]/60 bg-gradient-to-b from-[#1a1108] to-[#0f0a04] p-5"
          >
            <span className="font-accent inline-block rounded-sm bg-[#c9a84c] px-2.5 py-1 text-[10px] tracking-[0.3em] text-[#0a0a0a]">
              INSPIRED
            </span>
            <p className="mt-3 text-sm text-[#cfc6b3]">Our premium inspired version. Same soul, accessible price.</p>
            <SizeToggle value={inspSize} onChange={setInspSize} />
            <div className="font-display mt-3 text-3xl text-[#e0c878]">
              ₹{priceFor(product, "Inspired", inspSize).toLocaleString("en-IN")}
              <span className="font-accent ml-2 text-[10px] tracking-[0.25em] text-[#9a9285]">/ {inspSize}ML</span>
            </div>
            <p className="mt-1 text-[11px] italic text-[#9a9285]">Crafted to mirror the original. Loved by 1000+ customers.</p>
            <button
              onClick={() => order("Inspired", inspSize)}
              className="btn-gold shimmer-hover mt-4 w-full !py-2.5 !text-[11px]"
            >
              Order Inspired
            </button>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="px-6 pb-8 md:px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />
          <div className="mt-5 text-center">
            <div className="font-accent text-[10px] tracking-[0.35em] text-[#c9a84c]">HOW TO ORDER</div>
            <p className="mt-2 text-xs text-[#9a9285]">
              Click Order below and fill your delivery details. We deliver across all of Mumbai.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => order("Original", origSize)} className="btn-ghost-gold flex-1 !py-3 !text-[11px]">
                Order Original
              </button>
              <button onClick={() => order("Inspired", inspSize)} className="btn-gold flex-1 !py-3 !text-[11px]">
                Order Inspired
              </button>
            </div>
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

function NotesRow({ label, items }: { label: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="font-accent w-14 text-[10px] tracking-[0.25em] text-[#9a9285]">{label.toUpperCase()}</span>
      {items.map((n) => (
        <span key={n} className="rounded-sm border border-[#c9a84c]/40 px-2 py-0.5 text-[10px] text-[#f5f0e8]">
          {n}
        </span>
      ))}
    </div>
  );
}