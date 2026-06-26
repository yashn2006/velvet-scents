import { SHOP } from "@/lib/products";

export function Footer() {
  return (
    <footer
      className="relative border-t border-[#c9a84c]/40 pt-16 text-[#9a9285]"
      style={{
        background: "#050505",
        boxShadow: "0 -1px 40px rgba(201,168,76,0.15)",
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-12 md:grid-cols-4">
        <div>
          <h3 className="font-display text-3xl text-[#f5f0e8]">{SHOP.name}</h3>
          <p className="mt-3 text-sm leading-relaxed">{SHOP.tagline}</p>
        </div>
        <FooterCol title="Quick Links" links={["Home","Collections","Order","About"]} />
        <div>
          <h4 className="font-accent text-[11px] text-[#c9a84c]">Delivery Info</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Mumbai-only delivery</li>
            <li>Free above ₹999</li>
            <li>Same-day in select areas</li>
          </ul>
        </div>
        <div>
          <h4 className="font-accent text-[11px] text-[#c9a84c]">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>WhatsApp: <span className="text-[#f5f0e8]">+91 99999 99999</span></li>
            <li>Instagram: <span className="text-[#f5f0e8]">{SHOP.instagram}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#1a1a1a] py-5 text-center text-xs">
        <div>© {new Date().getFullYear()} {SHOP.name}. All rights reserved.</div>
        <div className="mt-2 font-accent tracking-[0.3em] text-[#9a9285]">
          CRAFTED BY{" "}
          <a
            href="https://coreegin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a84c] transition-colors hover:text-[#f5d98a]"
          >
            COREEGIN
          </a>{" "}
          ·{" "}
          <a
            href="https://coreegin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a84c] transition-colors hover:text-[#f5d98a]"
          >
            coreegin.com
          </a>
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#8b6f1f] via-[#c9a84c] to-[#8b6f1f] py-2.5 text-center">
        <span className="font-accent text-[11px] text-[#0a0a0a]">Free Delivery Across Mumbai on Orders Above ₹999</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-accent text-[11px] text-[#c9a84c]">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l}><a className="transition-colors hover:text-[#c9a84c]" href={`#${l.toLowerCase()}`}>{l}</a></li>
        ))}
      </ul>
    </div>
  );
}