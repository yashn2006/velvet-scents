import { useEffect, useRef, useState } from "react";

const STATS = [
  { label: "Happy Customers", value: 1000, suffix: "+" },
  { label: "Orders Delivered", value: 500, suffix: "+" },
  { label: "Premium Fragrances", value: 50, suffix: "+" },
];

const REVIEWS = [
  { name: "Aarav Mehta", area: "Bandra", text: "Royal Oud Intense smells like Dubai gold. Lasts 12+ hours easily.", perfume: "Royal Oud Intense", stars: 5 },
  { name: "Priya Shah", area: "Andheri", text: "Jasmin Sauvage is my new signature. Compliments every single day.", perfume: "Jasmin Sauvage", stars: 5 },
  { name: "Rohan Iyer", area: "Worli", text: "Packaging felt like opening a Cartier box. Worth every rupee.", perfume: "Nuit d'Or", stars: 5 },
  { name: "Neha Kapoor", area: "Powai", text: "Santal Noir is intoxicating. Husband stole it within a week.", perfume: "Santal Noir", stars: 5 },
  { name: "Vikram Singh", area: "Colaba", text: "Delivery in under 4 hours. Absolutely insane service.", perfume: "Bleu Imperial", stars: 5 },
  { name: "Ananya Rao", area: "Chembur", text: "Oud Mubarak No.1 silenced a room. Five stars isn't enough.", perfume: "Oud Mubarak No.1", stars: 5 },
  { name: "Karan Joshi", area: "Thane", text: "Authentic Cambodian oud at this price? Won me over.", perfume: "Rose d'Arabie", stars: 5 },
  { name: "Sara Khan", area: "Santacruz", text: "Citrus Royale is my morning ritual now. Fresh and elegant.", perfume: "Citrus Royale", stars: 5 },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = performance.now();
        const dur = 1800;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setN(Math.round(p * to));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => { cancelAnimationFrame(raf); obs.disconnect(); };
  }, [to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

export function Reviews() {
  const row = (reversed?: boolean) => (
    <div className="relative overflow-hidden py-3">
      <div className={`flex w-max gap-5 ${reversed ? "marquee-rtl" : "marquee-ltr"} hover:[animation-play-state:paused]`}>
        {[...REVIEWS, ...REVIEWS].map((r, i) => (
          <article key={i} className="w-[340px] shrink-0 rounded-sm border border-[#2a2a2a] bg-[#111111] p-5">
            <div className="mb-2 flex gap-0.5 text-[#c9a84c]">
              {Array.from({ length: r.stars }).map((_, k) => (
                <svg key={k} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.95 6.97L22 10l-5.5 4.78L18.18 22 12 18.27 5.82 22l1.68-7.22L2 10l7.05-1.03L12 2z"/>
                </svg>
              ))}
            </div>
            <p className="font-display text-lg leading-snug text-[#f5f0e8]">"{r.text}"</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[#9a9285]">{r.name} · {r.area}</span>
              <span className="font-accent text-[10px] text-[#c9a84c]">{r.perfume}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  return (
    <section
      className="py-24"
      style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #0A0500 100%)" }}
    >
      <div className="mx-auto max-w-7xl px-6 text-center">
        <span className="font-accent text-xs text-[#c9a84c]">Social Proof</span>
        <h2 className="font-display mt-3 text-4xl text-[#f5f0e8] md:text-5xl">Loved Across Mumbai</h2>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-[#2a2a2a] pt-6">
              <p className="font-display text-5xl text-[#c9a84c] md:text-6xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </p>
              <p className="font-accent mt-2 text-[11px] text-[#9a9285]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-14 space-y-2">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}