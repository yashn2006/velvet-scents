import { useEffect, useRef, useCallback } from "react";
import bottle1 from "@/assets/bottle-1.png";
import bottle2 from "@/assets/bottle-2.png";
import bottle3 from "@/assets/bottle-3.png";
import { SHOP } from "@/lib/products";

const RING_BOTTLES = [bottle1, bottle2, bottle3, bottle1, bottle2, bottle3];
const STEP = 360 / RING_BOTTLES.length; // 60deg
const RING_RADIUS = 280; // px

export function Hero() {
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const gsapRef = useRef<typeof import("gsap")["gsap"] | null>(null);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    const cleanupFns: Array<() => void> = [];

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;
      gsapRef.current = gsap;

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

      tl.from(stageRef.current, {
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

  // Nudge: temporarily speed up the spin in a direction by adding a rotateY
  // offset on an inner wrapper. The outer ring keeps its pure CSS infinite
  // spin running underneath, so nothing ever pauses.
  const nudgeRef = useRef<HTMLDivElement>(null);
  const nudgeAccumRef = useRef(0);
  const nudge = useCallback((dir: 1 | -1) => {
    const gsap = gsapRef.current;
    if (!gsap || !nudgeRef.current) return;
    nudgeAccumRef.current += dir * 90;
    gsap.to(nudgeRef.current, {
      rotateY: nudgeAccumRef.current,
      duration: 1.1,
      ease: "power2.out",
    });
  }, []);

  // Swipe support
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let startX = 0;
    let active = false;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; active = true; };
    const onEnd = (e: TouchEvent) => {
      if (!active) return;
      active = false;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) nudge(dx < 0 ? 1 : -1);
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [nudge]);

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <style>{`
        @keyframes maison-ring-spin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
        .maison-ring-spin {
          animation: maison-ring-spin 11s linear infinite;
          transform-style: preserve-3d;
          will-change: transform;
        }
      `}</style>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0a_85%)]" />

      {/* 3D rotating ring of bottles (globe / ferris-wheel spin) */}
      <div
        ref={stageRef}
        className="absolute inset-x-0 bottom-[6vh] z-10 flex items-end justify-center"
        style={{ perspective: "1000px" }}
      >
        <div className="relative h-[60vh] w-full max-w-[1100px] md:h-[70vh]">
          {/* nudge wrapper — GSAP rotates this on click/swipe */}
          <div
            ref={nudgeRef}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* pure-CSS infinite spinning ring */}
            <div ref={ringRef} className="maison-ring-spin absolute inset-0">
              {RING_BOTTLES.map((src, i) => {
                const angle = i * STEP;
                return (
                  <div
                    key={i}
                    className="absolute left-1/2 top-1/2 flex flex-col items-center"
                    style={{
                      transform: `translate(-50%, -40%) rotateY(${angle}deg) translateZ(${RING_RADIUS}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* counter-rotate so bottles always face the camera */}
                    <div
                      className="flex flex-col items-center"
                      style={{
                        transform: `rotateY(${-angle}deg)`,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <img
                        src={src}
                        alt=""
                        draggable={false}
                        className="h-[40vh] w-auto select-none md:h-[48vh]"
                        style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))" }}
                      />
                      <div
                        className="-mt-3 h-8 w-[65%] rounded-[50%]"
                        style={{
                          background:
                            "radial-gradient(ellipse at center, rgba(201,168,76,0.55), transparent 70%)",
                          filter: "blur(6px)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* arrows */}
          <button
            type="button"
            aria-label="Previous bottle"
            onClick={() => nudge(-1)}
            className="group absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#c9a84c]/40 bg-black/40 p-3 text-[#c9a84c] backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70 hover:text-[#f5d97a] md:left-6 md:p-4"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next bottle"
            onClick={() => nudge(1)}
            className="group absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#c9a84c]/40 bg-black/40 p-3 text-[#c9a84c] backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70 hover:text-[#f5d97a] md:right-6 md:p-4"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[60vh] w-[80vw] max-w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.18),transparent_70%)]" />

      <div className="relative z-10 -mt-[10vh] flex flex-col items-center px-6 text-center">
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