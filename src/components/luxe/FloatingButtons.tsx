import { useEffect, useState } from "react";
import { SHOP } from "@/lib/products";

export function FloatingButtons() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <a
        href={`https://wa.me/${SHOP.whatsapp}`}
        target="_blank" rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-transform hover:scale-110"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.81 11.81 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.554-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/>
        </svg>
      </a>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-24 right-6 z-50 grid h-12 w-12 place-items-center rounded-full border border-[#c9a84c] bg-[#0a0a0a] text-[#c9a84c] transition-all hover:bg-[#c9a84c] hover:text-[#0a0a0a] ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
    </>
  );
}