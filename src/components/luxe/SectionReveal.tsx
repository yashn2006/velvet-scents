import { useEffect } from "react";

/**
 * Global IntersectionObserver: every <section> fades + slides up on entry,
 * with its direct children staggered by 0.1s. No per-section wiring required.
 */
export function SectionReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));
    if (!sections.length) return;

    sections.forEach((s) => {
      if (s.dataset.reveal === "off") return;
      s.classList.add("mo-reveal");
      const children = Array.from(s.children) as HTMLElement[];
      children.forEach((c, i) => {
        c.classList.add("mo-reveal-child");
        c.style.transitionDelay = `${i * 0.1}s`;
      });
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return null;
}