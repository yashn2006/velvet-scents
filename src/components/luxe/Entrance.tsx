import { useEffect, useRef, useState } from "react";
import doorLeftAsset from "@/assets/entrance/door-left.png.asset.json";
import doorRightAsset from "@/assets/entrance/door-right.png.asset.json";
import curtainAsset from "@/assets/entrance/curtain.png.asset.json";

const SESSION_KEY = "mo-entrance-played";

export function Entrance() {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    document.body.style.overflow = "hidden";

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled || !rootRef.current) return;

      const root = rootRef.current;
      const q = gsap.utils.selector(root);

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(SESSION_KEY, "1");
          document.body.style.overflow = "";
          setHidden(true);
        },
      });
      tlRef.current = tl;

      // 0.3s: title fade in
      tl.to(q(".mo-ent-title"), { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3);

      // 0.6s: doors open + light burst
      tl.to(
        q(".mo-ent-door-left"),
        { rotateY: -105, duration: 1.4, ease: "power3.inOut" },
        0.6,
      );
      tl.to(
        q(".mo-ent-door-right"),
        { rotateY: 105, duration: 1.4, ease: "power3.inOut" },
        0.6,
      );
      tl.to(
        q(".mo-ent-burst"),
        { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out" },
        0.6,
      );
      tl.to(q(".mo-ent-title"), { opacity: 0, duration: 0.5 }, 1.4);

      // 2.0s: curtains sweep
      tl.to(
        q(".mo-ent-curtain-left"),
        { xPercent: -100, duration: 1.1, ease: "power2.inOut" },
        2.0,
      );
      tl.to(
        q(".mo-ent-curtain-right"),
        { xPercent: 100, duration: 1.1, ease: "power2.inOut" },
        2.0,
      );
      tl.to(
        q(".mo-ent-curtain-left, .mo-ent-curtain-right"),
        { scaleX: 1.06, duration: 0.15, ease: "power1.out", yoyo: true, repeat: 1 },
        2.95,
      );

      // 2.8s: fade out whole overlay (hero reveals beneath)
      tl.to(root, { opacity: 0, duration: 0.6, ease: "power2.out" }, 2.8);
      tl.to(q(".mo-ent-burst"), { opacity: 0, duration: 0.6 }, 2.8);

      // 4.2s end
      tl.to({}, { duration: 0.6 }, 3.6);
    })();

    const skipTimer = window.setTimeout(() => {
      setShowSkip(true);
      setCanSkip(true);
    }, 1500);

    return () => {
      cancelled = true;
      window.clearTimeout(skipTimer);
      tlRef.current?.kill();
      document.body.style.overflow = "";
    };
  }, [mounted]);

  const skip = () => {
    if (!canSkip) return;
    tlRef.current?.progress(1);
  };

  if (!mounted || hidden) return null;

  return (
    <div
      ref={rootRef}
      onClick={skip}
      className="fixed inset-0 z-[9999] bg-black overflow-hidden"
      style={{ perspective: "1400px" }}
    >
      {/* Title above seam */}
      <div
        className="mo-ent-title pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 text-center"
        style={{ opacity: 0, transform: "translate(-50%, 12px)" }}
      >
        <div
          className="text-[#C9A84C] tracking-[0.5em] text-3xl md:text-5xl"
          style={{ fontFamily: "'Cinzel', serif", textShadow: "0 0 30px rgba(201,168,76,0.5)" }}
        >
          MAISON OUDH
        </div>
      </div>

      {/* Golden light burst from center seam */}
      <div
        className="mo-ent-burst pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "140vmax",
          height: "140vmax",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.45) 0%, rgba(201,168,76,0.15) 30%, transparent 65%)",
          opacity: 0,
          transform: "translate(-50%, -50%) scale(0)",
          zIndex: 1,
        }}
      />

      {/* Doors */}
      <div
        className="mo-ent-door-left absolute top-0 left-0 h-screen"
        style={{
          width: "50vw",
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          zIndex: 3,
        }}
      >
        <img
          src={doorLeftAsset.url}
          alt=""
          className="block w-full h-full object-cover"
          style={{ objectPosition: "right center" }}
          draggable={false}
        />
      </div>
      <div
        className="mo-ent-door-right absolute top-0 right-0 h-screen"
        style={{
          width: "50vw",
          transformOrigin: "right center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          zIndex: 3,
        }}
      >
        <img
          src={doorRightAsset.url}
          alt=""
          className="block w-full h-full object-cover"
          style={{ objectPosition: "left center" }}
          draggable={false}
        />
      </div>

      {/* Curtains (behind doors so they're revealed when doors swing open) */}
      <div
        className="mo-ent-curtain-left absolute top-0 left-0 h-screen pointer-events-none"
        style={{ width: "50vw", zIndex: 2 }}
      >
        <img
          src={curtainAsset.url}
          alt=""
          className="block w-full h-full object-cover"
          draggable={false}
        />
      </div>
      <div
        className="mo-ent-curtain-right absolute top-0 right-0 h-screen pointer-events-none"
        style={{ width: "50vw", zIndex: 2 }}
      >
        <img
          src={curtainAsset.url}
          alt=""
          className="block w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
          draggable={false}
        />
      </div>

      {/* Skip button */}
      {showSkip && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            skip();
          }}
          className="absolute bottom-6 right-6 z-[10] text-xs tracking-[0.3em] text-[#C9A84C]/80 hover:text-[#C9A84C] border border-[#C9A84C]/40 hover:border-[#C9A84C] px-4 py-2 rounded-full backdrop-blur-sm bg-black/40 transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          SKIP →
        </button>
      )}
    </div>
  );
}