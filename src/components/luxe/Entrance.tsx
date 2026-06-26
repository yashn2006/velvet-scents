import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const SESSION_KEY = "entrancePlayed";

export function Entrance() {
  const [active, setActive] = useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [showSkip, setShowSkip] = useState(false);
  const skippableRef = useRef(false);

  // Decide on mount (client only) to avoid SSR hydration mismatch.
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) !== "true") setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const slideDistance = isMobile ? "-55vw" : "-60vw";

    let safetyTimer: number | undefined;

    const ctx = gsap.context(() => {
      gsap.set(".eo-title", { opacity: 0 });
      gsap.set(".eo-burst", { scale: 0, opacity: 0 });
        const tl = gsap.timeline({
          onComplete: () => finish(),
        });
        tlRef.current = tl;

        tl.to(".eo-title", { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.3);

        tl.to(".eo-door-left", { x: slideDistance, duration: 1.3, ease: "power3.inOut" }, 0.5);
        tl.to(".eo-door-right", { x: slideDistance.replace("-", ""), duration: 1.3, ease: "power3.inOut" }, 0.5);
        tl.to(".eo-burst", { scale: 1.2, opacity: 1, duration: 1.3, ease: "power2.out" }, 0.5);

        // After doors finish opening, fade overlay out so hero shows through
        tl.to([".eo-doors-layer", ".eo-burst", ".eo-title"], { opacity: 0, duration: 0.45 }, 1.7);
        tl.to(".eo-backdrop", { opacity: 0, duration: 0.5 }, 1.9);

        // Enable skip after 1.5s
        gsap.delayedCall(1.0, () => {
          skippableRef.current = true;
          setShowSkip(true);
        });
      });

      // Hard safety: never let the overlay block the page for more than 4s.
      safetyTimer = window.setTimeout(() => {
        finish();
      }, 4000);
    }, rootRef);

    const finish = () => {
      if (safetyTimer) window.clearTimeout(safetyTimer);
      sessionStorage.setItem(SESSION_KEY, "true");
      document.body.style.overflow = "auto";
      setActive(false);
    };

    const skip = () => {
      if (!skippableRef.current) return;
      tlRef.current?.kill();
      finish();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    const onClick = () => skip();

    window.addEventListener("keydown", onKey);
    rootRef.current?.addEventListener("click", onClick);

    return () => {
      if (safetyTimer) window.clearTimeout(safetyTimer);
      ctx.revert();
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "auto";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="entrance-overlay"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* Black backdrop */}
      <div
        className="eo-backdrop"
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
        }}
      />

      {/* Golden light burst (between curtains and doors) */}
      <div
        className="eo-burst"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 700,
          height: 700,
          marginLeft: -350,
          marginTop: -350,
          background:
            "radial-gradient(circle, rgba(201,168,76,0.5) 0%, rgba(139,94,60,0.2) 40%, transparent 70%)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* Split black panels */}
      <div
        className="eo-doors-layer"
        style={{ position: "absolute", inset: 0, zIndex: 4 }}
      >
        <div
          className="eo-door-left"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50vw",
            height: "100vh",
            background: "#000",
            willChange: "transform",
          }}
        />
        <div
          className="eo-door-right"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50vw",
            height: "100vh",
            background: "#000",
            willChange: "transform",
          }}
        />
      </div>

      {/* Title */}
      <div
        className="eo-title"
        style={{
          position: "absolute",
          top: 32,
          left: "50%",
          transform: "translateX(-50%)",
          color: "#C9A84C",
          fontFamily: "Cinzel, serif",
          fontSize: 13,
          letterSpacing: "0.4em",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        MAISON OUDH
      </div>

      {/* Skip */}
      {showSkip && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            tlRef.current?.kill();
            sessionStorage.setItem(SESSION_KEY, "true");
            document.body.style.overflow = "auto";
            setActive(false);
          }}
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            color: "#C9A84C",
            fontFamily: "Cinzel, serif",
            fontSize: 11,
            letterSpacing: "0.3em",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 10000,
            animation: "eoFadeIn 0.3s ease forwards",
          }}
        >
          SKIP →
        </button>
      )}

      <style>{`
        @keyframes eoFadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
}