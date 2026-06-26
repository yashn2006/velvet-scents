import { useEffect, useState } from "react";

const NAME = "MAISON OUDH";

export function LaunchIntro() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("launched") === "true") {
      document.querySelector(".hero-section")?.classList.add("visible");
      return;
    }
    setShow(true);
    const t1 = setTimeout(() => {
      setFadeOut(true);
      document.querySelector(".hero-section")?.classList.add("visible");
    }, 2000);
    const t2 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("launched", "true");
    }, 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <span className="launch-line" />
      <div className="launch-name">
        {NAME.split("").map((ch, i) => (
          <span
            key={i}
            style={{ animationDelay: `${0.5 + i * 0.05}s` }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>
      <div className="launch-tagline">
        Crafted for those who speak without words.
      </div>
      <style>{`
        @keyframes launchLineExpand {
          from { width: 0px; opacity: 0; }
          to { width: 180px; opacity: 1; }
        }
        @keyframes launchLetterReveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes launchFadeIn {
          from { opacity: 0; }
          to { opacity: 0.6; }
        }
        .launch-line {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          height: 1px;
          width: 0;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
          animation: launchLineExpand 0.6s ease forwards;
        }
        .launch-name {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px;
          color: #C9A84C;
          letter-spacing: 0.5em;
          white-space: nowrap;
          padding-left: 0.5em;
        }
        .launch-name span {
          display: inline-block;
          opacity: 0;
          animation: launchLetterReveal 0.6s ease forwards;
        }
        .launch-tagline {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          margin-top: 80px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(245,240,232,0.6);
          letter-spacing: 0.2em;
          opacity: 0;
          text-align: center;
          animation: launchFadeIn 0.5s ease forwards;
          animation-delay: 1.1s;
        }
        @media (max-width: 640px) {
          .launch-name { font-size: 28px; letter-spacing: 0.3em; }
          .launch-line { animation-name: launchLineExpandMobile; }
          @keyframes launchLineExpandMobile {
            from { width: 0px; opacity: 0; }
            to { width: 120px; opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
}