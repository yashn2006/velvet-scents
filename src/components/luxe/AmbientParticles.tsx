import { useEffect, useRef } from "react";

/**
 * Site-wide ambient gold dust — tiny gold particles drifting upward across
 * the whole page. Fixed, pointer-events-none, blended over section bgs.
 */
export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; r: number; o: number; vy: number; vx: number };
    let parts: P[] = [];

    const resize = () => {
      cvs.width = Math.floor(window.innerWidth * dpr);
      cvs.height = Math.floor(window.innerHeight * dpr);
      cvs.style.width = window.innerWidth + "px";
      cvs.style.height = window.innerHeight + "px";
      const count = window.innerWidth < 640 ? 20 : 28;
      parts = Array.from({ length: count }, () => spawn(true));
    };

    const spawn = (initial = false): P => ({
      x: Math.random() * cvs.width,
      y: initial ? Math.random() * cvs.height : cvs.height + Math.random() * 40,
      r: (1 + Math.random()) * dpr,
      o: 0.15 + Math.random() * 0.15,
      vy: -(0.15 + Math.random() * 0.35) * dpr,
      vx: (Math.random() - 0.5) * 0.1 * dpr,
    });

    const tick = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.y += p.vy;
        p.x += p.vx;
        if (p.y < -10) parts[i] = spawn(false);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 200, 120, ${p.o})`;
        ctx.shadowColor = "rgba(201,168,76,0.5)";
        ctx.shadowBlur = 6 * dpr;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}