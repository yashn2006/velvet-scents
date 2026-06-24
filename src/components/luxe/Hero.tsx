import { useEffect, useRef } from "react";
import bottle1 from "@/assets/bottle-1.png";
import bottle2 from "@/assets/bottle-2.png";
import bottle3 from "@/assets/bottle-3.png";
import { SHOP } from "@/lib/products";

export function Hero() {
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bottlesRef = useRef<HTMLDivElement>(null);

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

      const bottles = bottlesRef.current?.querySelectorAll<HTMLImageElement>(".bottle") ?? [];
      gsap.set(bottles, { y: 120, opacity: 0, rotate: (i: number) => (i % 2 === 0 ? -8 : 8) });
      tl.to(bottles, {
        y: 0, opacity: 1, rotate: 0,
        duration: 1.4, stagger: 0.3, ease: "power3.out",
      }, 0.6).add(() => {
        bottles.forEach((b, i) => {
          gsap.to(b, { y: -12, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.2 });
        });
      });

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

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0a_85%)]" />

      <div ref={bottlesRef} className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center gap-2 md:gap-16">
        <img src={bottle2} alt="" className="bottle h-[35vh] w-auto translate-y-6 opacity-80 md:h-[55vh]" />
        <img src={bottle1} alt="" className="bottle h-[50vh] w-auto md:h-[70vh]" />
        <img src={bottle3} alt="" className="bottle h-[35vh] w-auto translate-y-6 opacity-80 md:h-[55vh]" />
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