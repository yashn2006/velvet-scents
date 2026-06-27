const lattafaQahwa = "/bottles/lattafa-khamrah-qahwa.png";
const lattafaWaha = "/bottles/lattafa-khamrah-waha.png";
const lattafaKhamrah = "/bottles/lattafa-khamrah.png";
const acquaProfumo = "/bottles/acqua-profumo.png";
const clubDeNuit = "/bottles/club-de-nuit.png";
const acquaParfum = "/bottles/acqua-parfum.png";
const oudGlory = "/bottles/oud-for-glory.png";
const sauvage = "/bottles/sauvage-elixir.png";
// aliases used across the catalogue
const bottle1 = lattafaQahwa;
const bottle2 = lattafaWaha;
const bottle3 = lattafaKhamrah;

export type Category = "Arabic" | "Designer" | "Fresh" | "Woody" | "Limited";
export type Mood = "Romantic" | "Intense" | "Fresh" | "Royal" | "Mysterious";

export const CATEGORY_LABELS: Record<Category, string> = {
  Arabic: "Arabic Oud",
  Designer: "Designer",
  Fresh: "Fresh & Floral",
  Woody: "Woody",
  Limited: "Limited Edition",
};

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
  mood?: Mood;
}

export const products: Product[] = [
  {
    id: "p1", name: "Royal Oud Intense", brand: "Maison Oudh", category: "Arabic",
    image: bottle3, price50: 3499, price100: 5999, rating: 4.9, reviews: 218,
    notes: { top: ["Saffron", "Bergamot"], heart: ["Rose", "Cinnamon"], base: ["Oud", "Amber"] },
    originalBrandName: "Initio Parfums",
    shortDescription: "A regal oud composition wrapped in saffron smoke and Damascus rose — built for evenings that linger.",
    originalPrice50: 18500, originalPrice100: 28500,
    inspiredPrice50: 599, inspiredPrice100: 999, mood: "Royal",
  },
  {
    id: "p2", name: "Nuit d'Or", brand: "Atelier Paris", category: "Designer",
    image: bottle1, price50: 4299, price100: 6999, rating: 4.8, reviews: 312,
    notes: { top: ["Black Pepper", "Mandarin"], heart: ["Iris", "Leather"], base: ["Vetiver", "Musk"] },
    originalBrandName: "Tom Ford",
    shortDescription: "Polished leather and dusky iris — a Parisian midnight bottled with quiet confidence.",
    originalPrice50: 14500, originalPrice100: 22500,
    inspiredPrice50: 549, inspiredPrice100: 949, mood: "Mysterious",
  },
  {
    id: "p3", name: "Jasmin Sauvage", brand: "Maison Oudh", category: "Fresh",
    image: bottle2, price50: 2799, price100: 4499, rating: 4.7, reviews: 156,
    notes: { top: ["Bergamot", "Pink Pepper"], heart: ["Jasmine", "Neroli"], base: ["White Musk", "Cedar"] },
    originalBrandName: "Creed",
    shortDescription: "Sunlit jasmine over crisp neroli — luminous, weightless, unmistakably elegant.",
    originalPrice50: 19500, originalPrice100: 32000,
    inspiredPrice50: 499, inspiredPrice100: 899, mood: "Fresh",
  },
  {
    id: "p4", name: "Santal Noir", brand: "Atelier Paris", category: "Woody",
    image: bottle1, price50: 3899, price100: 6299, rating: 4.8, reviews: 201,
    notes: { top: ["Cardamom"], heart: ["Sandalwood", "Cedar"], base: ["Oud", "Amber"] },
    originalBrandName: "Le Labo",
    shortDescription: "Creamy Mysore sandalwood softened with cardamom and warm amber resin.",
    originalPrice50: 21500, originalPrice100: 33500,
    inspiredPrice50: 649, inspiredPrice100: 1099, mood: "Intense",
  },
  {
    id: "p5", name: "Oud Mubarak No.1", brand: "Maison Oudh", category: "Limited",
    image: bottle3, price50: 5999, price100: 9999, rating: 5.0, reviews: 88,
    notes: { top: ["Saffron"], heart: ["Rose Taifi"], base: ["Cambodian Oud", "Ambergris"] },
    originalBrandName: "Amouage",
    shortDescription: "Our flagship limited edition — Cambodian oud, Rose Taifi, and ambergris in perfect equilibrium.",
    originalPrice50: 24500, originalPrice100: 39500,
    inspiredPrice50: 799, inspiredPrice100: 1399, mood: "Royal",
  },
  {
    id: "p6", name: "Rose d'Arabie", brand: "Maison Oudh", category: "Arabic",
    image: bottle2, price50: 2999, price100: 4899, rating: 4.6, reviews: 142,
    notes: { top: ["Bergamot"], heart: ["Damask Rose", "Saffron"], base: ["Oud", "Patchouli"] },
    originalBrandName: "Montale",
    shortDescription: "Damask rose and Persian saffron over a deep oud base — feminine yet commanding.",
    originalPrice50: 13500, originalPrice100: 20500,
    inspiredPrice50: 549, inspiredPrice100: 949, mood: "Romantic",
  },
  {
    id: "p7", name: "Bleu Imperial", brand: "Atelier Paris", category: "Designer",
    image: bottle1, price50: 3599, price100: 5799, rating: 4.7, reviews: 278,
    notes: { top: ["Grapefruit", "Lavender"], heart: ["Pink Pepper", "Ginger"], base: ["Cedar", "Vetiver"] },
    originalBrandName: "Chanel",
    shortDescription: "Cool grapefruit and lavender layered over cedar — versatile from boardroom to evening.",
    originalPrice50: 12500, originalPrice100: 19500,
    inspiredPrice50: 499, inspiredPrice100: 899, mood: "Fresh",
  },
  {
    id: "p8", name: "Citrus Royale", brand: "Maison Oudh", category: "Fresh",
    image: bottle2, price50: 2499, price100: 3999, rating: 4.5, reviews: 109,
    notes: { top: ["Lemon", "Bergamot"], heart: ["Petitgrain", "Mint"], base: ["Musk", "Cedar"] },
    originalBrandName: "Acqua di Parma",
    shortDescription: "Sicilian lemon and petitgrain over soft musk — bright, effortless, Mediterranean.",
    originalPrice50: 11500, originalPrice100: 17500,
    inspiredPrice50: 449, inspiredPrice100: 799, mood: "Fresh",
  },
  {
    id: "p9", name: "Cedrus Noir", brand: "Atelier Paris", category: "Woody",
    image: bottle3, price50: 3299, price100: 5499, rating: 4.8, reviews: 165,
    notes: { top: ["Black Pepper"], heart: ["Atlas Cedar", "Vetiver"], base: ["Oud", "Tobacco"] },
    originalBrandName: "Byredo",
    shortDescription: "Atlas cedar with smoked tobacco and black pepper — woods rendered in noir.",
    originalPrice50: 17500, originalPrice100: 26500,
    inspiredPrice50: 599, inspiredPrice100: 999, mood: "Mysterious",
  },
  {
    id: "p10", name: "Amber Majlis", brand: "Maison Oudh", category: "Arabic",
    image: bottle3, price50: 3299, price100: 5499, rating: 4.7, reviews: 134,
    notes: { top: ["Cardamom", "Pink Pepper"], heart: ["Rose", "Labdanum"], base: ["Amber", "Oud"] },
    originalBrandName: "Maison Francis Kurkdjian",
    shortDescription: "A warm amber-oud accord softened by Taif rose — opulence in slow motion.",
    originalPrice50: 19500, originalPrice100: 29500,
    inspiredPrice50: 649, inspiredPrice100: 1099, mood: "Romantic",
  },
  {
    id: "p11", name: "Velour Tabac", brand: "Atelier Paris", category: "Designer",
    image: bottle1, price50: 3799, price100: 6199, rating: 4.8, reviews: 187,
    notes: { top: ["Bergamot", "Apple"], heart: ["Tobacco Leaf", "Cinnamon"], base: ["Vanilla", "Tonka"] },
    originalBrandName: "Tom Ford",
    shortDescription: "Sweet tobacco leaf wrapped in vanilla and tonka — a velvet smoke signature.",
    originalPrice50: 22500, originalPrice100: 34500,
    inspiredPrice50: 599, inspiredPrice100: 1049, mood: "Intense",
  },
  {
    id: "p12", name: "Marine Lumière", brand: "Maison Oudh", category: "Fresh",
    image: bottle2, price50: 2599, price100: 4299, rating: 4.6, reviews: 121,
    notes: { top: ["Sea Salt", "Bergamot"], heart: ["Calone", "Jasmine"], base: ["Driftwood", "Musk"] },
    originalBrandName: "Giorgio Armani",
    shortDescription: "An oceanic breeze of sea salt, calone and driftwood — clean and effortless.",
    originalPrice50: 13500, originalPrice100: 21500,
    inspiredPrice50: 499, inspiredPrice100: 899, mood: "Fresh",
  },
  {
    id: "p13", name: "Vetiver Royale", brand: "Atelier Paris", category: "Woody",
    image: bottle3, price50: 3199, price100: 5299, rating: 4.7, reviews: 142,
    notes: { top: ["Grapefruit"], heart: ["Haitian Vetiver", "Iris"], base: ["Cedar", "Ambroxan"] },
    originalBrandName: "Guerlain",
    shortDescription: "Smoky Haitian vetiver lifted by iris and ambroxan — masculine, polished, modern.",
    originalPrice50: 16500, originalPrice100: 25500,
    inspiredPrice50: 549, inspiredPrice100: 949, mood: "Royal",
  },
  {
    id: "p14", name: "Mukhallat Khas", brand: "Maison Oudh", category: "Limited",
    image: bottle1, price50: 6499, price100: 10999, rating: 5.0, reviews: 64,
    notes: { top: ["Saffron", "Pink Pepper"], heart: ["Rose Taifi", "Jasmine"], base: ["Aged Oud", "Musk"] },
    originalBrandName: "Roja Parfums",
    shortDescription: "A private mukhallat: aged oud, Taif rose and saffron — limited to 200 bottles a year.",
    originalPrice50: 28500, originalPrice100: 44500,
    inspiredPrice50: 849, inspiredPrice100: 1499, mood: "Mysterious",
  },
  {
    id: "p15", name: "Fleur de Nuit", brand: "Maison Oudh", category: "Fresh",
    image: bottle2, price50: 2899, price100: 4699, rating: 4.6, reviews: 153,
    notes: { top: ["Mandarin", "Pear"], heart: ["Tuberose", "Orange Blossom"], base: ["White Musk", "Sandalwood"] },
    originalBrandName: "Yves Saint Laurent",
    shortDescription: "Tuberose and orange blossom under a soft white musk — a nocturnal floral.",
    originalPrice50: 14500, originalPrice100: 22500,
    inspiredPrice50: 519, inspiredPrice100: 919, mood: "Romantic",
  },
  {
    id: "p16", name: "Ébène Privé", brand: "Atelier Paris", category: "Woody",
    image: bottle3, price50: 3699, price100: 5999, rating: 4.8, reviews: 176,
    notes: { top: ["Black Pepper", "Elemi"], heart: ["Ebony Wood", "Patchouli"], base: ["Oud", "Leather"] },
    originalBrandName: "Hermès",
    shortDescription: "Dark ebony and patchouli with a whisper of leather — a private study after midnight.",
    originalPrice50: 19500, originalPrice100: 29500,
    inspiredPrice50: 599, inspiredPrice100: 1049, mood: "Mysterious",
  },
  {
    id: "p17", name: "Or Sultan", brand: "Maison Oudh", category: "Arabic",
    image: bottle1, price50: 4499, price100: 7499, rating: 4.9, reviews: 198,
    notes: { top: ["Saffron", "Bergamot"], heart: ["Oud", "Rose"], base: ["Amber", "Sandalwood"] },
    originalBrandName: "Xerjoff",
    shortDescription: "Liquid gold for a sultan — saffron, oud and Damascus rose over warm sandalwood.",
    originalPrice50: 22500, originalPrice100: 35500,
    inspiredPrice50: 699, inspiredPrice100: 1199, mood: "Royal",
  },
  {
    id: "p18", name: "Cuir Noir Edition", brand: "Atelier Paris", category: "Limited",
    image: bottle2, price50: 5499, price100: 8999, rating: 4.9, reviews: 72,
    notes: { top: ["Birch Tar"], heart: ["Leather", "Iris"], base: ["Oud", "Castoreum"] },
    originalBrandName: "Dior Privé",
    shortDescription: "Smoked leather, birch tar and aged oud — an animalic statement, strictly limited.",
    originalPrice50: 26500, originalPrice100: 42500,
    inspiredPrice50: 799, inspiredPrice100: 1399, mood: "Intense",
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
