import bottle1 from "@/assets/bottle-1.png";
import bottle2 from "@/assets/bottle-2.png";
import bottle3 from "@/assets/bottle-3.png";

export type Category = "Arabic" | "Designer" | "Fresh" | "Woody" | "Limited";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  image: string;
  price50: number;
  price100: number;
  rating: number;
  reviews: number;
  notes: { top: string[]; heart: string[]; base: string[] };
  originalBrandName?: string;
  shortDescription?: string;
  originalPrice50?: number;
  originalPrice100?: number;
  inspiredPrice50?: number;
  inspiredPrice100?: number;
}

export const products: Product[] = [
  {
    id: "p1", name: "Royal Oud Intense", brand: "Maison Oudh", category: "Arabic",
    image: bottle3, price50: 3499, price100: 5999, rating: 4.9, reviews: 218,
    notes: { top: ["Saffron", "Bergamot"], heart: ["Rose", "Cinnamon"], base: ["Oud", "Amber"] },
    originalBrandName: "Initio Parfums",
    shortDescription: "A regal oud composition wrapped in saffron smoke and Damascus rose — built for evenings that linger.",
    originalPrice50: 18500, originalPrice100: 28500,
    inspiredPrice50: 599, inspiredPrice100: 999,
  },
  {
    id: "p2", name: "Nuit d'Or", brand: "Atelier Paris", category: "Designer",
    image: bottle1, price50: 4299, price100: 6999, rating: 4.8, reviews: 312,
    notes: { top: ["Black Pepper", "Mandarin"], heart: ["Iris", "Leather"], base: ["Vetiver", "Musk"] },
    originalBrandName: "Tom Ford",
    shortDescription: "Polished leather and dusky iris — a Parisian midnight bottled with quiet confidence.",
    originalPrice50: 14500, originalPrice100: 22500,
    inspiredPrice50: 549, inspiredPrice100: 949,
  },
  {
    id: "p3", name: "Jasmin Sauvage", brand: "Maison Oudh", category: "Fresh",
    image: bottle2, price50: 2799, price100: 4499, rating: 4.7, reviews: 156,
    notes: { top: ["Bergamot", "Pink Pepper"], heart: ["Jasmine", "Neroli"], base: ["White Musk", "Cedar"] },
    originalBrandName: "Creed",
    shortDescription: "Sunlit jasmine over crisp neroli — luminous, weightless, unmistakably elegant.",
    originalPrice50: 19500, originalPrice100: 32000,
    inspiredPrice50: 499, inspiredPrice100: 899,
  },
  {
    id: "p4", name: "Santal Noir", brand: "Atelier Paris", category: "Woody",
    image: bottle1, price50: 3899, price100: 6299, rating: 4.8, reviews: 201,
    notes: { top: ["Cardamom"], heart: ["Sandalwood", "Cedar"], base: ["Oud", "Amber"] },
    originalBrandName: "Le Labo",
    shortDescription: "Creamy Mysore sandalwood softened with cardamom and warm amber resin.",
    originalPrice50: 21500, originalPrice100: 33500,
    inspiredPrice50: 649, inspiredPrice100: 1099,
  },
  {
    id: "p5", name: "Oud Mubarak No.1", brand: "Maison Oudh", category: "Limited",
    image: bottle3, price50: 5999, price100: 9999, rating: 5.0, reviews: 88,
    notes: { top: ["Saffron"], heart: ["Rose Taifi"], base: ["Cambodian Oud", "Ambergris"] },
    originalBrandName: "Amouage",
    shortDescription: "Our flagship limited edition — Cambodian oud, Rose Taifi, and ambergris in perfect equilibrium.",
    originalPrice50: 24500, originalPrice100: 39500,
    inspiredPrice50: 799, inspiredPrice100: 1399,
  },
  {
    id: "p6", name: "Rose d'Arabie", brand: "Maison Oudh", category: "Arabic",
    image: bottle2, price50: 2999, price100: 4899, rating: 4.6, reviews: 142,
    notes: { top: ["Bergamot"], heart: ["Damask Rose", "Saffron"], base: ["Oud", "Patchouli"] },
    originalBrandName: "Montale",
    shortDescription: "Damask rose and Persian saffron over a deep oud base — feminine yet commanding.",
    originalPrice50: 13500, originalPrice100: 20500,
    inspiredPrice50: 549, inspiredPrice100: 949,
  },
  {
    id: "p7", name: "Bleu Imperial", brand: "Atelier Paris", category: "Designer",
    image: bottle1, price50: 3599, price100: 5799, rating: 4.7, reviews: 278,
    notes: { top: ["Grapefruit", "Lavender"], heart: ["Pink Pepper", "Ginger"], base: ["Cedar", "Vetiver"] },
    originalBrandName: "Chanel",
    shortDescription: "Cool grapefruit and lavender layered over cedar — versatile from boardroom to evening.",
    originalPrice50: 12500, originalPrice100: 19500,
    inspiredPrice50: 499, inspiredPrice100: 899,
  },
  {
    id: "p8", name: "Citrus Royale", brand: "Maison Oudh", category: "Fresh",
    image: bottle2, price50: 2499, price100: 3999, rating: 4.5, reviews: 109,
    notes: { top: ["Lemon", "Bergamot"], heart: ["Petitgrain", "Mint"], base: ["Musk", "Cedar"] },
    originalBrandName: "Acqua di Parma",
    shortDescription: "Sicilian lemon and petitgrain over soft musk — bright, effortless, Mediterranean.",
    originalPrice50: 11500, originalPrice100: 17500,
    inspiredPrice50: 449, inspiredPrice100: 799,
  },
  {
    id: "p9", name: "Cedrus Noir", brand: "Atelier Paris", category: "Woody",
    image: bottle3, price50: 3299, price100: 5499, rating: 4.8, reviews: 165,
    notes: { top: ["Black Pepper"], heart: ["Atlas Cedar", "Vetiver"], base: ["Oud", "Tobacco"] },
    originalBrandName: "Byredo",
    shortDescription: "Atlas cedar with smoked tobacco and black pepper — woods rendered in noir.",
    originalPrice50: 17500, originalPrice100: 26500,
    inspiredPrice50: 599, inspiredPrice100: 999,
  },
];

export const MUMBAI_AREAS = [
  "Andheri","Bandra","Borivali","Dadar","Kurla","Chembur","Colaba","Worli","Thane","Navi Mumbai",
  "Panvel","Malad","Kandivali","Goregaon","Santacruz","Vile Parle","Powai","Mulund","Vikhroli","Ghatkopar",
];

export const SHOP = {
  name: "Maison Oudh",
  tagline: "Crafted for those who speak without words.",
  whatsapp: "919999999999",
  instagram: "@maisonoudh",
};
