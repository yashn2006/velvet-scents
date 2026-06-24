import { useEffect, useRef } from "react";
import bottle from "@/assets/bottle-1.png";

const LINES = [
  "Born in the souks of Arabia.",
  "Refined in the ateliers of Paris.",
  "Delivered to your door in Mumbai.",
];

function parseHex(h: string): [number, number, number] {
  const v = h.replace("#", "");
  return [parseInt(v.slice(0,2),16), parseInt(v.slice(2,4),16), parseInt(v.slice(4,6),16)];
}
function mix(a: string, b: string, t: number) {
  const pa = parseHex(a), pb = parseHex(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

export function ScentStory() {
  const ref = useRef<HTMLElement>(null);

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

      const section = ref.current!;
      const pinTarget = section.querySelector<HTMLElement>(".pin-target")!;
      const bottleEl = section.querySelector<HTMLElement>(".story-bottle")!;
      const lines = section.querySelectorAll<HTMLElement>(".story-line");

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=2400",
        pin: pinTarget,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const c = p < 0.5
            ? mix("#0a0a0a", "#3d1f00", p * 2)
            : mix("#3d1f00", "#8b5e3c", (p - 0.5) * 2);
          pinTarget.style.backgroundColor = c;

          gsap.set(bottleEl, { rotate: p * 360 });

          lines.forEach((el, i) => {
            const start = [0.05, 0.38, 0.7][i];
            const end = [0.32, 0.65, 0.92][i];
            let o = 0, y = 30;
            if (p >= start && p <= end) {
              const t = (p - start) / (end - start);
              o = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
              y = (1 - o) * 30;
            }
            gsap.set(el, { opacity: o, y });
          });
        },
      });
      cleanup = () => st.kill();
    })();
    return () => { cancelled = true; cleanup(); };
  }, []);

  return (
    <section ref={ref} className="relative" style={{ height: "300vh" }}>
      <div className="pin-target relative grid h-screen w-full place-items-center overflow-hidden bg-[#0a0a0a]">
        <img src={bottle} alt="" className="story-bottle pointer-events-none absolute h-[70vh] w-auto opacity-90" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6))]" />
        <div className="relative z-10 flex flex-col items-center gap-12 px-6 text-center">
          {LINES.map((l, i) => (
            <p key={i} className="story-line font-display text-3xl text-[#f5f0e8] opacity-0 md:text-5xl" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>
              {l}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}