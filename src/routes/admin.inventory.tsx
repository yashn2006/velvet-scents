import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { deleteProduct, getProducts, saveProducts, upsertProduct, type StockItem } from "@/lib/admin-store";
import type { Category } from "@/lib/products";

export const Route = createFileRoute("/admin/inventory")({ component: InventoryPage });

const CATS: Category[] = ["Arabic", "Designer", "Fresh", "Woody", "Limited"];

function blank(): StockItem {
  return {
    id: "p" + Date.now().toString(36),
    name: "", brand: "Maison Oudh", category: "Arabic",
    image: "", price50: 2999, price100: 4999, rating: 5, reviews: 0,
    notes: { top: [], heart: [], base: [] },
    originalBrandName: "", shortDescription: "",
    originalPrice50: 12000, originalPrice100: 18000,
    inspiredPrice50: 599, inspiredPrice100: 999,
    stock: 10, active: true,
  };
}

function InventoryPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [edit, setEdit] = useState<StockItem | null>(null);

  useEffect(() => { setItems(getProducts()); }, []);

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <span style={{ fontFamily: "Cinzel, serif" }} className="text-[10px] tracking-[0.4em] text-[#c9a84c]">CATALOGUE</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl">Inventory</h1>
        </div>
        <button onClick={() => setEdit(blank())} className="rounded-sm bg-[#c9a84c] px-4 py-2 text-[10px] tracking-[0.3em] text-[#0a0a0a] hover:bg-[#e0c878]">+ NEW PRODUCT</button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="group rounded-sm border border-[#1f1f1f] bg-[#111] p-4">
            <div className="aspect-square overflow-hidden rounded-sm bg-[#0a0a0a]">
              {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-contain p-4" /> : <div className="grid h-full place-items-center text-[#333]">No image</div>}
            </div>
            <div className="mt-3 flex items-start justify-between">
              <div>
                <div className="text-[10px] tracking-[0.3em] text-[#c9a84c]">{p.category.toUpperCase()}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl">{p.name || "Untitled"}</div>
                <div className="text-xs text-[#9a9285]">{p.brand}</div>
              </div>
              <span className={`text-[10px] tracking-[0.2em] ${p.stock > 5 ? "text-emerald-400" : p.stock > 0 ? "text-amber-400" : "text-red-400"}`}>
                {p.stock > 0 ? `${p.stock} IN STOCK` : "OUT OF STOCK"}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="text-[#9a9285]">₹{p.price50.toLocaleString("en-IN")} / ₹{p.price100.toLocaleString("en-IN")}</div>
              <div className="flex gap-2">
                <button onClick={() => setEdit(p)} className="text-[10px] tracking-[0.2em] text-[#c9a84c] hover:text-[#e0c878]">EDIT</button>
                <button onClick={() => { if (confirm("Delete " + p.name + "?")) { deleteProduct(p.id); setItems(getProducts()); } }}
                  className="text-[10px] tracking-[0.2em] text-red-400/80 hover:text-red-400">DELETE</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {edit && (
        <Editor item={edit}
          onClose={() => setEdit(null)}
          onSave={(it) => { upsertProduct(it); setItems(getProducts()); setEdit(null); }}
        />
      )}

      <p className="mt-6 text-[10px] text-[#666]">Stage 2 stores inventory in your browser (mock backend). Cloudinary uploads will activate when the Node + MongoDB backend is enabled in Stage 3.</p>
    </div>
  );
}

function Editor({ item, onClose, onSave }: { item: StockItem; onClose: () => void; onSave: (it: StockItem) => void }) {
  const [it, setIt] = useState<StockItem>(item);

  const onFile = (f: File | null) => {
    if (!f) return;
    if (f.size > 800 * 1024) { alert("Image too large (max 800KB for local storage)."); return; }
    const r = new FileReader();
    r.onload = () => setIt((s) => ({ ...s, image: String(r.result) }));
    r.readAsDataURL(f);
  };

  const input = "w-full rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a84c]";
  const lbl = "block text-[10px] tracking-[0.3em] text-[#9a9285] mb-1";

  const notesStr = (k: "top" | "heart" | "base") => it.notes[k].join(", ");
  const setNotes = (k: "top" | "heart" | "base", v: string) =>
    setIt((s) => ({ ...s, notes: { ...s.notes, [k]: v.split(",").map((x) => x.trim()).filter(Boolean) } }));

  return (
    <div onClick={onClose} className="fixed inset-0 z-30 grid place-items-center bg-black/80 p-4">
      <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(it); }}
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-sm border border-[#2a2a2a] bg-[#0d0d0d] p-6">
        <div className="flex items-start justify-between">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl">{item.name ? "Edit Product" : "New Product"}</h2>
          <button type="button" onClick={onClose} className="text-[#9a9285]">✕</button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label><span className={lbl}>NAME</span><input required className={input} value={it.name} onChange={(e) => setIt({ ...it, name: e.target.value })} /></label>
          <label><span className={lbl}>BRAND (shop)</span><input className={input} value={it.brand} onChange={(e) => setIt({ ...it, brand: e.target.value })} /></label>
          <label><span className={lbl}>ORIGINAL BRAND</span><input className={input} value={it.originalBrandName ?? ""} onChange={(e) => setIt({ ...it, originalBrandName: e.target.value })} /></label>
          <label><span className={lbl}>CATEGORY</span>
            <select className={input} value={it.category} onChange={(e) => setIt({ ...it, category: e.target.value as Category })}>
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label><span className={lbl}>STOCK</span><input type="number" min={0} className={input} value={it.stock} onChange={(e) => setIt({ ...it, stock: +e.target.value })} /></label>
          <label><span className={lbl}>RATING</span><input type="number" step="0.1" min={0} max={5} className={input} value={it.rating} onChange={(e) => setIt({ ...it, rating: +e.target.value })} /></label>
          <label><span className={lbl}>REVIEWS</span><input type="number" className={input} value={it.reviews} onChange={(e) => setIt({ ...it, reviews: +e.target.value })} /></label>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-sm border border-[#c9a84c]/30 bg-[#0d0b06] p-4 md:grid-cols-4">
          <div className="col-span-2 md:col-span-4 text-[10px] tracking-[0.3em] text-[#c9a84c]">ORIGINAL PRICES (₹)</div>
          <label><span className={lbl}>ORIGINAL 50ml</span><input type="number" className={input} value={it.originalPrice50 ?? 0} onChange={(e) => setIt({ ...it, originalPrice50: +e.target.value })} /></label>
          <label><span className={lbl}>ORIGINAL 100ml</span><input type="number" className={input} value={it.originalPrice100 ?? 0} onChange={(e) => setIt({ ...it, originalPrice100: +e.target.value })} /></label>
          <label><span className={lbl}>INSPIRED 50ml</span><input type="number" className={input} value={it.inspiredPrice50 ?? it.price50} onChange={(e) => setIt({ ...it, inspiredPrice50: +e.target.value, price50: +e.target.value })} /></label>
          <label><span className={lbl}>INSPIRED 100ml</span><input type="number" className={input} value={it.inspiredPrice100 ?? it.price100} onChange={(e) => setIt({ ...it, inspiredPrice100: +e.target.value, price100: +e.target.value })} /></label>
        </div>

        <div className="mt-4">
          <label className="block"><span className={lbl}>SHORT DESCRIPTION</span>
            <textarea rows={2} className={input} value={it.shortDescription ?? ""} onChange={(e) => setIt({ ...it, shortDescription: e.target.value })} />
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <label><span className={lbl}>TOP NOTES (comma sep)</span><input className={input} value={notesStr("top")} onChange={(e) => setNotes("top", e.target.value)} /></label>
          <label><span className={lbl}>HEART NOTES</span><input className={input} value={notesStr("heart")} onChange={(e) => setNotes("heart", e.target.value)} /></label>
          <label><span className={lbl}>BASE NOTES</span><input className={input} value={notesStr("base")} onChange={(e) => setNotes("base", e.target.value)} /></label>
        </div>

        <div className="mt-4">
          <span className={lbl}>IMAGE</span>
          <div className="flex items-center gap-4">
            <div className="grid h-24 w-24 place-items-center rounded-sm border border-[#2a2a2a] bg-[#0a0a0a]">
              {it.image ? <img src={it.image} alt="" className="h-full w-full object-contain p-2" /> : <span className="text-[10px] text-[#666]">No image</span>}
            </div>
            <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              className="text-xs text-[#9a9285] file:mr-3 file:rounded-sm file:border-0 file:bg-[#c9a84c] file:px-3 file:py-2 file:text-[10px] file:tracking-[0.2em] file:text-[#0a0a0a]" />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-sm border border-[#2a2a2a] px-4 py-2 text-[10px] tracking-[0.3em] text-[#9a9285]">CANCEL</button>
          <button className="rounded-sm bg-[#c9a84c] px-6 py-2 text-[10px] tracking-[0.3em] text-[#0a0a0a] hover:bg-[#e0c878]">SAVE</button>
        </div>
      </form>
    </div>
  );
}

// keep saveProducts in module graph (used elsewhere conceptually)
void saveProducts;