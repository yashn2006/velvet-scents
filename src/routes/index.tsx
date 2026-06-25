import { createFileRoute } from "@tanstack/react-router";
import { LoadingScreen } from "@/components/luxe/LoadingScreen";
import { Nav } from "@/components/luxe/Nav";
import { Hero } from "@/components/luxe/Hero";
import { Collections } from "@/components/luxe/Collections";
import { BestSellers } from "@/components/luxe/BestSellers";
import { ScentStory } from "@/components/luxe/ScentStory";
import { OrderForm } from "@/components/luxe/OrderForm";
import { Reviews } from "@/components/luxe/Reviews";
import { Footer } from "@/components/luxe/Footer";
import { FloatingButtons } from "@/components/luxe/FloatingButtons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Oudh — Luxury Perfumery, Mumbai" },
      { name: "description", content: "Arabic oud, designer luxury, fresh & floral, woody, and limited edition perfumes. Free delivery across Mumbai on orders above ₹999." },
      { property: "og:title", content: "Maison Oudh — Crafted for those who speak without words" },
      { property: "og:description", content: "Luxury perfumery delivered across Mumbai." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8]">
      <LoadingScreen />
      <Nav />
      <Hero />
      <ScentStory />
      <Collections />
      <BestSellers />
      <OrderForm />
      <Reviews />
      <Footer />
      <FloatingButtons />
    </main>
  );
}
