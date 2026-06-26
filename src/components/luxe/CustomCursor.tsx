import { useEffect } from "react";

export function CustomCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    // Skip on admin routes
    if (window.location.pathname.startsWith("/admin")) return;

    const ring = document.createElement("div");
    ring.className = "mo-cursor mo-cursor-ring";
    const dot = document.createElement("div");
    dot.className = "mo-cursor mo-cursor-dot";

    const TRAIL_COUNT = 6;
    const trails: HTMLDivElement[] = [];
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const t = document.createElement("div");
      t.className = "mo-cursor mo-cursor-trail";
      t.style.opacity = String([0.5, 0.4, 0.3, 0.2, 0.15, 0.08][i]);
      trails.push(t);
      document.body.appendChild(t);
    }
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    const trailPos = trails.map(() => ({ x: targetX, y: targetY }));
    let raf = 0;
    let inHero = true;

    const setVisible = (v: boolean) => {
      const op = v && !inHero ? "1" : "0";
      ring.style.opacity = op;
      dot.style.opacity = op;
      trails.forEach((t, i) => {
        t.style.visibility = v && !inHero ? "visible" : "hidden";
        void i;
      });
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      setVisible(true);
    };

    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };
    const onEnter = () => setVisible(true);

    const isInteractive = (el: Element | null) =>
      !!el && !!el.closest('a, button, [role="button"], input, select, textarea, label, .mo-card, .mo-cursor-hover');
    const isText = (el: Element | null) =>
      !!el && !!el.closest("p, h1, h2, h3, h4, h5, h6, span, li");

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element;
      ring.classList.toggle("is-hover", isInteractive(el));
      ring.classList.toggle("is-text", !isInteractive(el) && isText(el));
      dot.classList.toggle("is-hidden", isInteractive(el));
    };

    const onDown = () => {
      ring.classList.add("is-down");
      dot.classList.add("is-down");
    };
    const onUp = () => {
      ring.classList.remove("is-down");
      dot.classList.remove("is-down");
    };

    const tick = () => {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      ring.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;

      // trail follows ring with progressive lag
      let px = curX, py = curY;
      for (let i = 0; i < trails.length; i++) {
        const speed = 0.35 - i * 0.04;
        trailPos[i].x += (px - trailPos[i].x) * speed;
        trailPos[i].y += (py - trailPos[i].y) * speed;
        trails[i].style.transform = `translate3d(${trailPos[i].x}px, ${trailPos[i].y}px, 0) translate(-50%, -50%)`;
        px = trailPos[i].x;
        py = trailPos[i].y;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hide while hero is visible
    const hero = document.querySelector("#hero, .hero-section");
    let observer: IntersectionObserver | null = null;
    if (hero) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inHero = entry.isIntersecting && entry.intersectionRatio > 0.1;
            setVisible(true);
            document.body.classList.toggle("mo-cursor-in-hero", inHero);
          });
        },
        { threshold: [0, 0.1, 0.5] },
      );
      observer.observe(hero);
    } else {
      inHero = false;
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseenter", onEnter);
      ring.remove();
      dot.remove();
      trails.forEach((t) => t.remove());
      document.body.classList.remove("mo-cursor-in-hero");
    };
  }, []);

  return null;
}