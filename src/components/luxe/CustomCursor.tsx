import { useEffect } from "react";

export function CustomCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.location.pathname.startsWith("/admin")) {
      document.body.style.cursor = "auto";
      return;
    }

    const ring = document.createElement("div");
    ring.id = "cursor-ring";
    const dot = document.createElement("div");
    dot.id = "cursor-dot";
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    };
    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      raf = requestAnimationFrame(animate);
    };
    animate();

    const isInteractive = (el: Element | null) =>
      !!el && !!el.closest('a, button, [role="button"], input, select, textarea, label, .mo-card');
    const onOver = (e: MouseEvent) => {
      ring.classList.toggle("hovering", isInteractive(e.target as Element));
    };
    const onDown = () => ring.classList.add("clicking");
    const onUp = () => ring.classList.remove("clicking");

    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget && !(e as MouseEvent).clientX) {
        ring.style.opacity = "0";
        dot.style.opacity = "0";
      }
    };
    const onEnter = () => {
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseenter", onEnter);
      ring.remove();
      dot.remove();
    };
  }, []);

  return null;
}