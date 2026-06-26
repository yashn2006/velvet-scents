import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MUMBAI_AREAS, SHOP, products } from "@/lib/products";

const inputCls =
  "w-full rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-sm text-[#f5f0e8] outline-none transition-colors focus:border-[#c9a84c] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]";

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>;
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-accent mb-2 block text-[10px] text-[#9a9285]">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

function SuccessOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pieces = Array.from({ length: 50 }, (_, i) => i);
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] grid place-items-center overflow-hidden bg-[#0a0a0a]/95 backdrop-blur">
          {pieces.map((i) => (
            <span key={i}
              className="confetti-fall absolute top-0 block h-2 w-2 rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                background: i % 2 ? "#c9a84c" : "#e0c878",
                animationDuration: `${2 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }} />
          ))}
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
            className="relative max-w-md px-8 text-center">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-[#c9a84c] text-[#c9a84c]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
            </div>
            <h3 className="font-display text-4xl text-[#f5f0e8]">Order Placed</h3>
            <p className="mt-4 text-sm text-[#9a9285]">We'll contact you on WhatsApp shortly to confirm your bespoke delivery.</p>
            <button onClick={onClose} className="btn-ghost-gold mt-8">Close</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OrderForm() {
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    area: "",
    productId: products[0].id,
    size: 50 as 50 | 100,
    version: "Inspired" as "Original" | "Inspired",
    qty: 1,
    slot: "Morning (9am–1pm)",
    notes: "",
  });

  const product = useMemo(() => products.find((p) => p.id === form.productId)!, [form.productId]);
  const unit = (() => {
    if (form.version === "Original") {
      return form.size === 50
        ? (product.originalPrice50 ?? product.price50 * 4)
        : (product.originalPrice100 ?? product.price100 * 4);
    }
    return form.size === 50
      ? (product.inspiredPrice50 ?? product.price50)
      : (product.inspiredPrice100 ?? product.price100);
  })();
  const total = unit * form.qty;

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ productId: string; version: "Original" | "Inspired"; size: 50 | 100 }>;
      if (!ev.detail) return;
      setForm((f) => ({
        ...f,
        productId: ev.detail.productId,
        version: ev.detail.version,
        size: ev.detail.size,
      }));
    };
    window.addEventListener("mo:order-prefill", handler as EventListener);
    return () => window.removeEventListener("mo:order-prefill", handler as EventListener);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone";
    if (form.address.trim().length < 5) e.address = "Address required";
    if (!form.area) e.area = "Select your area";
    if (form.qty < 1 || form.qty > 10) e.qty = "Quantity 1-10";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const order = {
      ...form,
      productName: `${product.name} (${form.version})`,
      unit, total,
      createdAt: new Date().toISOString(),
      orderId: "MO-" + Date.now().toString(36).toUpperCase(),
    };
    try {
      const all = JSON.parse(localStorage.getItem("maisonoudh_orders") || "[]");
      all.unshift(order);
      localStorage.setItem("maisonoudh_orders", JSON.stringify(all));
    } catch { /* ignore */ }

    const msg =
      `*New Order — ${SHOP.name}*%0A` +
      `Order: ${order.orderId}%0A` +
      `Name: ${form.name}%0A` +
      `Phone: ${form.phone}%0A` +
      `Area: ${form.area}%0A` +
      `Address: ${form.address}%0A` +
      `Perfume: ${product.name} — ${form.version} (${form.size}ml) x${form.qty}%0A` +
      `Slot: ${form.slot}%0A` +
      `Total: ₹${total.toLocaleString("en-IN")}%0A` +
      (form.notes ? `Notes: ${form.notes}` : "");
    window.open(`https://wa.me/${SHOP.whatsapp}?text=${msg}`, "_blank");
    setSuccess(true);
  };

  return (
    <section
      id="order"
      className="relative py-24"
      style={{
        background:
          "linear-gradient(135deg, #0D0500 0%, #0A0A0A 50%, #080010 100%)",
      }}
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="font-accent text-xs text-[#c9a84c]">Bespoke Service</span>
          <h2 className="font-display mt-3 text-4xl text-[#f5f0e8] md:text-5xl">Order Your Signature Scent</h2>
          <p className="mt-3 text-sm text-[#9a9285]">Mumbai-only delivery · We confirm every order over WhatsApp.</p>
        </div>

        <form onSubmit={submit} className="mt-12 space-y-5 rounded-sm border border-[#2a2a2a] bg-[#111111] p-6 md:p-10">
          <Grid>
            <Field label="Full Name" error={errors.name}>
              <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="Phone (10 digits)" error={errors.phone}>
              <input inputMode="numeric" maxLength={10} className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} />
            </Field>
          </Grid>

          <Field label="Delivery Address" error={errors.address}>
            <textarea rows={2} className={inputCls} value={form.address} onChange={(e) => set("address", e.target.value)} />
          </Field>

          <Grid>
            <Field label="Mumbai Area" error={errors.area}>
              <select className={inputCls} value={form.area} onChange={(e) => set("area", e.target.value)}>
                <option value="">Select area</option>
                {MUMBAI_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Select Perfume">
              <select className={inputCls} value={form.productId} onChange={(e) => set("productId", e.target.value)}>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.brand}</option>)}
              </select>
            </Field>
          </Grid>

          <Field label="Version">
            <div className="flex gap-2">
              {(["Original", "Inspired"] as const).map((v) => (
                <button type="button" key={v} onClick={() => set("version", v)}
                  className={`font-accent flex-1 rounded-sm border px-4 py-3 text-[11px] tracking-[0.3em] transition-colors ${
                    form.version === v ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]" : "border-[#2a2a2a] text-[#9a9285]"
                  }`}>
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </Field>

          <Grid>
            <Field label="Size">
              <div className="flex gap-2">
                {([50, 100] as const).map((s) => (
                  <button type="button" key={s} onClick={() => set("size", s)}
                    className={`font-accent flex-1 rounded-sm border px-4 py-3 text-[11px] transition-colors ${
                      form.size === s ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]" : "border-[#2a2a2a] text-[#9a9285]"
                    }`}>
                    {s}ml · ₹{(() => {
                      if (form.version === "Original") {
                        return (s === 50 ? (product.originalPrice50 ?? product.price50 * 4) : (product.originalPrice100 ?? product.price100 * 4));
                      }
                      return (s === 50 ? (product.inspiredPrice50 ?? product.price50) : (product.inspiredPrice100 ?? product.price100));
                    })().toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Quantity" error={errors.qty}>
              <input type="number" min={1} max={10} className={inputCls} value={form.qty} onChange={(e) => set("qty", Math.max(1, Math.min(10, +e.target.value || 1)))} />
            </Field>
          </Grid>

          <Field label="Preferred Delivery Slot">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {["Morning (9am–1pm)","Afternoon (1pm–5pm)","Evening (5pm–9pm)"].map((s) => (
                <button type="button" key={s} onClick={() => set("slot", s)}
                  className={`font-accent rounded-sm border px-3 py-3 text-[11px] transition-colors ${
                    form.slot === s ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]" : "border-[#2a2a2a] text-[#9a9285]"
                  }`}>{s}</button>
              ))}
            </div>
          </Field>

          <Field label="Special Instructions (optional)">
            <textarea rows={2} className={inputCls} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </Field>

          <div className="flex items-center justify-between border-t border-[#2a2a2a] pt-5">
            <span className="font-accent text-xs text-[#9a9285]">Total</span>
            <span className="font-display text-3xl text-[#c9a84c]">₹{total.toLocaleString("en-IN")}</span>
          </div>

          <button type="submit" className="btn-gold shimmer-hover w-full !py-4">Place My Order</button>
        </form>
      </div>

      <SuccessOverlay open={success} onClose={() => setSuccess(false)} />
    </section>
  );
}