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
    const section = ref.current;
    if (!section) return;

    const pinTarget = section.querySelector<HTMLElement>(".pin-target");
    const bottleEl = section.querySelector<HTMLElement>(".story-bottle");
    const lines = Array.from(section.querySelectorAll<HTMLElement>(".story-line"));
    if (!pinTarget || !bottleEl || !lines.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ticking = false;

    const clamp = (n: number) => Math.max(0, Math.min(1, n));
    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const p = clamp(-rect.top / travel);
      const c = p < 0.5
        ? mix("#0a0500", "#4a1f00", p * 2)
        : mix("#4a1f00", "#a06028", (p - 0.5) * 2);

      pinTarget.style.backgroundColor = c;
      bottleEl.style.transform = reduceMotion
        ? "translate3d(0,0,0)"
        : `translate3d(0,0,0) rotate(${p * 540}deg) scale(${1 + p * 0.06})`;

      lines.forEach((el, i) => {
        const start = [0, 0.34, 0.66][i];
        const end = [0.34, 0.68, 1][i];
        const local = clamp((p - start) / (end - start));
        const fade = local < 0.18 ? local / 0.18 : local > 0.82 ? (1 - local) / 0.18 : 1;
        const opacity = i === 0 && p < 0.04 ? 0.45 + p * 12 : fade;
        el.style.opacity = String(clamp(opacity));
        el.style.transform = `translate3d(0, ${(1 - clamp(opacity)) * 26}px, 0)`;
      });
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section ref={ref} data-reveal="off" className="relative bg-[#0a0a0a]" style={{ height: "300vh" }}>
      <div className="pin-target sticky top-0 grid h-screen w-full place-items-center overflow-hidden bg-[#0a0a0a]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[78vh] w-[78vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.24),rgba(139,94,60,0.12)_38%,transparent_68%)] blur-2xl" />
        <img
          src={bottle}
          alt="Maison Oudh perfume bottle rotating through the scent story"
          className="story-bottle pointer-events-none absolute z-[2] h-[62vh] w-auto opacity-95 will-change-transform md:h-[70vh]"
          style={{ filter: "brightness(1.12) drop-shadow(0 0 34px rgba(201,168,76,0.35)) drop-shadow(0 34px 55px rgba(0,0,0,0.75))" }}
        />
        <div className="pointer-events-none absolute left-1/2 top-[72%] z-[1] h-20 w-[360px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.42),transparent_68%)] blur-xl" />
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