import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import curtainAsset from "@/assets/entrance/curtain.png.asset.json";
import doorLeftAsset from "@/assets/entrance/door-left.png.asset.json";
import doorRightAsset from "@/assets/entrance/door-right.png.asset.json";

const SESSION_KEY = "entrancePlayed";

function preload(urls: string[]) {
  return Promise.all(
    urls.map(
      (u) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = u;
        }),
    ),
  );
}

export function Entrance() {
  const [active, setActive] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) !== "true";
  });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [showSkip, setShowSkip] = useState(false);
  const skippableRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const doorAngle = isMobile ? 100 : 108;

    const ctx = gsap.context(() => {
      const root = rootRef.current!;
      gsap.set(root, { perspective: isMobile ? 800 : 1400 });
      gsap.set(".eo-title", { opacity: 0 });
      gsap.set(".eo-burst", { scale: 0, opacity: 0 });
      gsap.set(".eo-curtain-left, .eo-curtain-right", { xPercent: 0, scaleX: (i, el) => (el as HTMLElement).classList.contains("eo-curtain-right") ? -1 : 1 });

      preload([curtainAsset.url, doorLeftAsset.url, doorRightAsset.url]).then(() => {
        const tl = gsap.timeline({
          onComplete: () => finish(),
        });
        tlRef.current = tl;

        tl.to(".eo-title", { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.3);

        tl.to(".eo-door-left", { rotateY: -doorAngle, duration: 1.5, ease: "power3.inOut" }, 0.6);
        tl.to(".eo-door-right", { rotateY: doorAngle, duration: 1.5, ease: "power3.inOut" }, 0.6);
        tl.to(".eo-burst", { scale: 1.2, opacity: 1, duration: 1.5, ease: "power2.out" }, 0.6);

        tl.to(".eo-curtain-left", { xPercent: -100, duration: 1.2, ease: "power2.inOut" }, 2.1);
        tl.to(".eo-curtain-right", { xPercent: 100, duration: 1.2, ease: "power2.inOut" }, 2.1);
        tl.to(".eo-curtain-left", { scaleX: 1.07, duration: 0.15, yoyo: true, repeat: 1 }, 3.15);
        tl.to(".eo-curtain-right", { scaleX: -1.07, duration: 0.15, yoyo: true, repeat: 1 }, 3.15);

        // Fade out overlay backdrop near end so hero shows through; final removal in onComplete
        tl.to(".eo-doors-layer", { opacity: 0, duration: 0.5 }, 2.6);
        tl.to(".eo-backdrop", { opacity: 0, duration: 0.6 }, 3.3);
        tl.to({}, { duration: 0.6 }, 3.9); // pad to ~4.5s

        // Enable skip after 1.5s
        gsap.delayedCall(1.5, () => {
          skippableRef.current = true;
          setShowSkip(true);
        });
      });
    }, rootRef);

    const finish = () => {
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

      {/* Curtains (behind doors) */}
      <img
        src={curtainAsset.url}
        alt=""
        className="eo-curtain-left"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50vw",
          height: "100vh",
          objectFit: "cover",
          objectPosition: "right center",
          zIndex: 2,
          willChange: "transform",
        }}
      />
      <img
        src={curtainAsset.url}
        alt=""
        className="eo-curtain-right"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50vw",
          height: "100vh",
          objectFit: "cover",
          objectPosition: "left center",
          zIndex: 2,
          willChange: "transform",
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

      {/* Doors layer */}
      <div
        className="eo-doors-layer"
        style={{ position: "absolute", inset: 0, zIndex: 4, transformStyle: "preserve-3d" }}
      >
        <img
          src={doorLeftAsset.url}
          alt=""
          className="eo-door-left"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50vw",
            height: "100vh",
            objectFit: "cover",
            objectPosition: "right center",
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        />
        <img
          src={doorRightAsset.url}
          alt=""
          className="eo-door-right"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50vw",
            height: "100vh",
            objectFit: "cover",
            objectPosition: "left center",
            transformOrigin: "right center",
            transformStyle: "preserve-3d",
            willChange: "transform",
            backfaceVisibility: "hidden",
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