import { useEffect } from "react";

export function CustomCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = document.createElement("div");
    dot.className = "mo-cursor";
    document.body.appendChild(dot);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let expanded = false;
    let raf = 0;
    let clickScale = 1;
    let clickAnim = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.opacity = "1";
    };
    const onLeave = () => { dot.style.opacity = "0"; };

    const isHover = (el: Element | null) =>
      !!el && !!el.closest(
        'a, button, [role="button"], input, select, textarea, label, .mo-card, .mo-cursor-hover',
      );
    const onOver = (e: MouseEvent) => {
      const want = isHover(e.target as Element);
      if (want !== expanded) {
        expanded = want;
        dot.classList.toggle("is-expanded", expanded);
      }
    };
    const onDown = () => {
      clickScale = 0.7;
      cancelAnimationFrame(clickAnim);
      const start = performance.now();
      const ease = () => {
        const t = Math.min(1, (performance.now() - start) / 220);
        clickScale = 0.7 + (1 - 0.7) * t;
        if (t < 1) clickAnim = requestAnimationFrame(ease);
      };
      clickAnim = requestAnimationFrame(ease);
    };

    const tick = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${clickScale})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(clickAnim);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseleave", onLeave);
      dot.remove();
    };
  }, []);

  return null;
}