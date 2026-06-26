import { useEffect, useRef, useState } from "react";
import khamrah from "@/assets/bottles/khamrah.avif.asset.json";
import adgProfumo from "@/assets/bottles/adg-profumo.avif.asset.json";
import cdnim from "@/assets/bottles/cdnim.avif.asset.json";
import adgParfum from "@/assets/bottles/adg-parfum.avif.asset.json";
import oudGlory from "@/assets/bottles/oud-glory.avif.asset.json";
import sauvage from "@/assets/bottles/sauvage.avif.asset.json";
import { SHOP } from "@/lib/products";

const PODIUM_BOTTLES = [
  { src: khamrah.url, name: "Lattafa Khamrah Waha" },
  { src: adgProfumo.url, name: "Acqua di Gio Profumo" },
  { src: cdnim.url, name: "Club de Nuit Intense" },
  { src: adgParfum.url, name: "Acqua di Gio Parfum" },
  { src: oudGlory.url, name: "Lattafa Oud For Glory" },
  { src: sauvage.url, name: "Dior Sauvage Elixir" },
];
// duplicate the list once for seamless infinite loop
const TRAIN = [...PODIUM_BOTTLES, ...PODIUM_BOTTLES];

export function Hero() {
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const podiumRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);
  const spotlightZoneRef = useRef<HTMLDivElement>(null);
  const [activeName, setActiveName] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    const cleanupFns: Array<() => void> = [];

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const resize = () => {
        canvas.width = canvas.offsetWidth * devicePixelRatio;
        canvas.height = canvas.offsetHeight * devicePixelRatio;
      };
      resize();
      window.addEventListener("resize", resize);
      const PARTICLES = Array.from({ length: 90 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vy: Math.random() * 0.3 + 0.1,
        a: Math.random() * 0.5 + 0.1,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of PARTICLES) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(201,168,76,${p.a})`;
          ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();
          p.y -= p.vy;
          if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
      cleanupFns.push(() => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
      });

      const tl = gsap.timeline();
      tl.to(leftCurtainRef.current, { xPercent: -100, duration: 1.4, ease: "power3.inOut" }, 0)
        .to(rightCurtainRef.current, { xPercent: 100, duration: 1.4, ease: "power3.inOut" }, 0);

      tl.from(podiumRef.current, {
        opacity: 0, y: 80, duration: 1.4, ease: "power3.out",
      }, 0.6);

      const title = titleRef.current;
      if (title) {
        const text = title.textContent ?? "";
        title.textContent = "";
        for (const ch of text) {
          const span = document.createElement("span");
          span.textContent = ch === " " ? "\u00a0" : ch;
          span.style.display = "inline-block";
          span.style.opacity = "0";
          title.appendChild(span);
        }
        tl.to(title.children, { opacity: 1, y: 0, duration: 0.6, stagger: 0.045, ease: "power2.out" }, 1.4);
      }

      tl.from(taglineRef.current, { opacity: 0, y: 20, duration: 1, ease: "power2.out" }, 2.0)
        .from(ctaRef.current, { opacity: 0, y: 20, duration: 1, ease: "power2.out" }, 2.4);
    })();

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  // Spotlight detection: which bottle is in the center spotlight zone
  useEffect(() => {
    const zone = spotlightZoneRef.current;
    const train = trainRef.current;
    if (!zone || !train) return;
    let raf = 0;
    const tick = () => {
      const zr = zone.getBoundingClientRect();
      const zc = zr.left + zr.width / 2;
      let bestEl: HTMLElement | null = null;
      let bestDist = Infinity;
      const items = train.querySelectorAll<HTMLElement>("[data-bottle]");
      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - zc);
        if (d < bestDist) { bestDist = d; bestEl = el; }
      });
      items.forEach((el) => {
        const isActive = el === bestEl && bestDist < 90;
        el.dataset.active = isActive ? "1" : "0";
      });
      if (bestEl && bestDist < 90) {
        setActiveName((bestEl as HTMLElement).dataset.name ?? null);
      } else {
        setActiveName(null);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <style>{`
        @keyframes maison-train-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .maison-train {
          animation: maison-train-scroll 18s linear infinite;
          will-change: transform;
        }
        [data-bottle] .bottle-img { transition: transform .45s ease, filter .45s ease; }
        [data-bottle] .bottle-glow { transition: opacity .45s ease, transform .45s ease, filter .45s ease; }
        [data-bottle][data-active="1"] .bottle-img {
          transform: translateY(-14px) scale(1.25);
          filter: brightness(1.3) drop-shadow(0 30px 50px rgba(201,168,76,0.45));
        }
        [data-bottle][data-active="1"] .bottle-glow {
          opacity: 1;
          transform: scaleX(1.4);
          filter: blur(14px);
        }
      `}</style>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0a_85%)]" />

      {/* Soft ambient glow under the podium */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[40vh] w-[90vw] max-w-[1100px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(180,60,30,0.18),transparent_70%)]" />

      {/* PODIUM STAGE */}
      <div ref={podiumRef} className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="relative mx-auto w-full">
          {/* spotlight beam from above */}
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: "180px",
              width: "260px",
              height: "70vh",
              background:
                "linear-gradient(to bottom, rgba(255,236,180,0) 0%, rgba(255,236,180,0.18) 70%, rgba(255,236,180,0.32) 100%)",
              clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
              filter: "blur(10px)",
              opacity: 0.6,
              mixBlendMode: "screen",
            }}
          />

          {/* bottle train */}
          <div className="relative h-[300px] overflow-hidden md:h-[340px]">
            {/* side vignettes */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[180px] bg-gradient-to-r from-[#0a0a0a] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[180px] bg-gradient-to-l from-[#0a0a0a] to-transparent" />

            {/* center spotlight detection zone */}
            <div
              ref={spotlightZoneRef}
              className="pointer-events-none absolute left-1/2 top-0 z-10 h-full w-[2px] -translate-x-1/2"
            />

            <div ref={trainRef} className="maison-train absolute bottom-0 left-0 flex items-end" style={{ width: "max-content" }}>
              {TRAIN.map((b, i) => (
                <div
                  key={i}
                  data-bottle
                  data-name={b.name}
                  data-active="0"
                  className="relative flex flex-col items-center"
                  style={{ paddingLeft: 60, paddingRight: 60 }}
                >
                  <img
                    src={b.src}
                    alt={b.name}
                    draggable={false}
                    className="bottle-img select-none"
                    style={{
                      height: "var(--bottle-h, 260px)",
                      width: "auto",
                      objectFit: "contain",
                      filter: "drop-shadow(0 20px 24px rgba(0,0,0,0.7))",
                    }}
                  />
                  {/* reflection */}
                  <img
                    src={b.src}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="select-none"
                    style={{
                      position: "absolute",
                      bottom: "calc(-1 * var(--bottle-h, 260px) * 0.55)",
                      height: "calc(var(--bottle-h, 260px) * 0.55)",
                      width: "auto",
                      objectFit: "contain",
                      transform: "scaleY(-1)",
                      opacity: 0.25,
                      filter: "blur(4px)",
                      maskImage: "linear-gradient(to bottom, black, transparent 90%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black, transparent 90%)",
                    }}
                  />
                  {/* individual pedestal glow */}
                  <div
                    className="bottle-glow pointer-events-none"
                    style={{
                      position: "absolute",
                      bottom: -6,
                      width: 160,
                      height: 28,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(ellipse at center, rgba(201,168,76,0.7), transparent 70%)",
                      filter: "blur(10px)",
                      opacity: 0.55,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* THE PODIUM SURFACE */}
          <div
            className="relative h-[120px] w-full"
            style={{
              background:
                "linear-gradient(to bottom, #0d0d0d 0%, #060606 60%, #000 100%)",
              boxShadow: "0 -1px 0 rgba(201,168,76,0.55), 0 -20px 60px rgba(0,0,0,0.6) inset",
            }}
          >
            {/* gold top edge highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
          </div>
        </div>
      </div>

      {/* Active bottle name above spotlight */}
      <div className="pointer-events-none absolute inset-x-0 z-20 flex justify-center" style={{ bottom: "calc(140px + 340px + 8px)" }}>
        <span
          className="font-display text-2xl text-[#c9a84c] transition-opacity duration-500 md:text-3xl"
          style={{ opacity: activeName ? 1 : 0, letterSpacing: "0.02em" }}
        >
          {activeName ?? "\u00a0"}
        </span>
      </div>

      <div className="relative z-10 mb-[28vh] flex flex-col items-center px-6 text-center md:mb-[32vh]">
        <span className="font-accent text-xs text-[#c9a84c]">Est. 2025 · Bombay</span>
        <h1 ref={titleRef} className="font-display mt-4 text-[15vw] leading-[0.95] text-[#f5f0e8] md:text-[96px]" style={{ letterSpacing: "-0.02em" }}>
          {SHOP.name}
        </h1>
        <p ref={taglineRef} className="mt-4 max-w-md text-sm text-[#9a9285] md:text-base">{SHOP.tagline}</p>
        <div ref={ctaRef} className="mt-8">
          <a href="#collections" className="btn-ghost-gold cta-pulse">Explore Collection</a>
        </div>
      </div>

      <a href="#collections" aria-label="Scroll" className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[#c9a84c] bounce-arrow">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>

      {/* curtain — on top, slides outward */}
      <div ref={leftCurtainRef} className="pointer-events-none absolute inset-y-0 left-0 z-30 w-1/2 bg-gradient-to-r from-black via-[#0a0a0a] to-[#1a1a1a]" />
      <div ref={rightCurtainRef} className="pointer-events-none absolute inset-y-0 right-0 z-30 w-1/2 bg-gradient-to-l from-black via-[#0a0a0a] to-[#1a1a1a]" />
    </section>
  );
}