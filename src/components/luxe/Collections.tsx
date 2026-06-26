import { useEffect, useRef } from "react";
import oud from "@/assets/collection-oud.jpg";
import designer from "@/assets/collection-designer.jpg";
import floral from "@/assets/collection-floral.jpg";
import limited from "@/assets/collection-limited.jpg";
import woody from "@/assets/collection-woody.jpg";

const CARDS = [
  { name: "Arabic Oud", img: oud },
  { name: "Designer Luxury", img: designer },
  { name: "Fresh & Floral", img: floral },
  { name: "Limited Edition", img: limited },
  { name: "Woody & Earthy", img: woody },
];

export function Collections() {
  const stripRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".coll-card") ?? [];
      cards.forEach((card, i) => {
        gsap.from(card, {
          x: i % 2 === 0 ? -80 : 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: card, start: "top 85%" },
        });
      });
      cleanup = () => ScrollTrigger.getAll().forEach((t) => t.kill());
    })();
    return () => { cancelled = true; cleanup(); };
  }, []);

  const scrollBy = (delta: number) => stripRef.current?.scrollBy({ left: delta, behavior: "smooth" });

  return (
    <section
      ref={sectionRef}
      id="collections"
      className="relative py-24"
      style={{
        background:
          "linear-gradient(180deg, #0A0A0A 0%, #0C0600 60%, #0A0A0A 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 text-center">
        <span className="font-accent text-xs text-[#c9a84c]">The House</span>
        <h2 className="font-display mt-3 text-4xl text-[#f5f0e8] md:text-6xl">Our Collections</h2>
        <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
      </div>

      <div className="relative mt-14">
        <div
          ref={stripRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-6 pb-6"
          style={{ scrollbarWidth: "none" }}
        >
          {CARDS.map((c) => (
            <div key={c.name} className="coll-card group relative h-[380px] w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-sm border border-[#2a2a2a] transition-transform duration-500 hover:scale-[1.03]">
              <img src={c.img} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50 transition-opacity duration-500 group-hover:from-black/70" />
              <div className="absolute inset-2 border border-transparent transition-all duration-500 group-hover:border-[#c9a84c] group-hover:shadow-[0_0_30px_rgba(201,168,76,0.35)_inset]" />
              <div className="absolute inset-x-0 bottom-8 px-6 text-center">
                <span className="font-accent text-[11px] text-[#c9a84c]">Collection</span>
                <h3 className="font-display mt-2 text-2xl text-[#f5f0e8]">{c.name}</h3>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => scrollBy(-320)} aria-label="Prev" className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-[#2a2a2a] bg-[#0a0a0a]/80 p-3 text-[#c9a84c] backdrop-blur transition-colors hover:border-[#c9a84c] md:block">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 6l-6 6 6 6"/></svg>
        </button>
        <button onClick={() => scrollBy(320)} aria-label="Next" className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-[#2a2a2a] bg-[#0a0a0a]/80 p-3 text-[#c9a84c] backdrop-blur transition-colors hover:border-[#c9a84c] md:block">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>
    </section>
  );
}