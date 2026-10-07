import tata from "../image/grocery/pulses/Tata Sampann Green Moong Dal (Whole) (500 g)/1.webp";
import tata1 from "../image/grocery/pulses/Tata Sampann Green Moong Dal (Whole) (500 g)/2.webp";
import tata2 from "../image/grocery/pulses/Tata Sampann Green Moong Dal (Whole) (500 g)/3.webp";


import aasirvad from "../image/grocery/aata/Sri Sauham Premium Dalia Godhuma Rava & Broken Wheat  Thuli Gehun Daliya (1000 g)/1.webp";
import aasirvad1 from "../image/grocery/aata/Sri Sauham Premium Dalia Godhuma Rava & Broken Wheat  Thuli Gehun Daliya (1000 g)/2.webp";
import aasirvad2 from "../image/grocery/aata/Sri Sauham Premium Dalia Godhuma Rava & Broken Wheat  Thuli Gehun Daliya (1000 g)/3.webp";


import fortune from "../image/grocery/oil/FORTUNE health physically refined Rice Bran Oil Pouch (870 g)/1.webp";


import catchup from "../image/grocery/catch up/Gustora Tomato I Rich & Smooth I No Artificial Color Sauces & Ketchup (1 kg)/1.webp";

import catch1 from "../image/grocery/catch up/GREEN PIECE Jain Sauce With No OnionGarlic Green Chilli SauceCatchup .(Pack of 2) Sauce (2 x 500 ml)/1.webp";

import ghee from "../image/grocery/ghee/1.jpg";
import ghee2 from "../image/grocery/ghee/2.webp";

export const grocery = [
  {
    id: "groc-1",
    title: "Aashirvaad Shuddh Chakki Whole Wheat Atta",
    brand: "Aashirvaad",
    price: 385,
    originalPrice: 460,
    rating: 4.8,
    reviews: 840,
    badge: "Daily Essential",
    category: "Grocery",
    images: [aasirvad, aasirvad1, aasirvad2],
    colors: ["10 kg Pack", "5 kg Pack"],
    description: "100% pure high-quality whole wheat grain flour sourced from MP wheat fields for soft, fluffy rotis and superior nutrition.",
    specifications: [
      "100% Whole Wheat Grain (0% Maida)",
      "High natural dietary fiber content",
      "Process lock technology for maximum hygiene and freshness",
      "Pack size: 10 kg economy family pack",
    ],
    sku: "ASH-ATTA-10KG",
    warranty: "Freshness Guaranteed / Sealed Quality",
    inStock: true,
  },
  {
    id: "groc-2",
    title: "Fortune Sunlite Refined Sunflower Oil",
    brand: "Fortune",
    price: 699,
    originalPrice: 850,
    rating: 4.7,
    reviews: 520,
    badge: "Best Seller",
    category: "Grocery",
    images: [fortune],
    colors: ["5 Litre Can", "1 Litre Pouch"],
    description: "Light, healthy, and easy to digest refined sunflower oil enriched with Vitamin A & D for heart-healthy cooking.",
    specifications: [
      "Rich in natural Vitamin E & fortified with Vitamin A & D",
      "Light and low-absorption technology",
      "High smoke point ideal for frying and everyday cooking",
      "Pack size: 5 Litre Jar",
    ],
    sku: "FRT-SUN-5L",
    warranty: "100% Pure Edible Oil Guarantee",
    inStock: true,
  },
  {
    id: "groc-3",
    title: "Tata Sampann Unpolished Toor Dal (Arhar)",
    brand: "Tata",
    price: 185,
    originalPrice: 220,
    rating: 4.9,
    reviews: 410,
    badge: "Unpolished",
    category: "Grocery",
    images: [tata, tata1, tata2],
    colors: ["1 kg Pack"],
    description: "High-protein unpolished Toor Dal naturally rich in fiber and essential nutrients, processed without any chemical polish.",
    specifications: [
      "100% Unpolished Arhar / Toor Dal",
      "Natural taste, rich protein & dietary fiber source",
      "Strict quality checks by Chef Sanjeev Kapoor",
      "Pack size: 1 kg pack",
    ],
    sku: "TTA-TOOR-1KG",
    warranty: "Tata Quality Promise",
    inStock: true,
  },
  {
    id: "groc-4",
    title: "Heinz Tomato Ketchup Squeezy Bottle",
    brand: "Heinz",
    price: 145,
    originalPrice: 175,
    rating: 4.8,
    reviews: 290,
    badge: "15% Off",
    category: "Grocery",
    images: [catch1],
    colors: ["500g Bottle"],
    description: "Thick, rich, and delicious tomato ketchup made from sun-ripened Heinz tomato seeds for unmatched flavor.",
    specifications: [
      "No artificial colors or preservatives added",
      "Made from 100% real sun-ripened red tomatoes",
      "Easy upside-down squeezy bottle design",
      "Net Weight: 500g",
    ],
    sku: "HNZ-KCH-500G",
    warranty: "100% Original Heinz Quality",
    inStock: true,
  },
  {
    id: "groc-5",
    title: "Amul Pure Cow Ghee Tin",
    brand: "Amul",
    price: 635,
    originalPrice: 690,
    rating: 4.9,
    reviews: 950,
    badge: "Pure Ghee",
    category: "Grocery",
    images: [ghee, ghee2],
    colors: ["1 Litre Tin"],
    description: "Traditional granular pure cow ghee made from fresh cream, offering rich aroma, golden color, and wholesome taste.",
    specifications: [
      "100% Pure natural cow ghee",
      "Rich source of Vitamin A, D, E and K",
      "Granular texture with authentic traditional aroma",
      "Pack size: 1 Litre Tin",
    ],
    sku: "AML-GHEE-1L",
    warranty: "Amul Trust & Purity Guarantee",
    inStock: true,
  },
  {
    id: "groc-6",
    title: "Gustora Tomato I Rich & Smooth I No Artificial Color Sauces & Ketchup (1 kg)",
    brand: "Gustora",
    price: 145,
    originalPrice: 175,
    rating: 4.8,
    reviews: 290,
    badge: "15% Off",
    category: "Grocery",
    images: [catchup],
    colors: ["500g Bottle"],
    description: "Thick, rich, and delicious tomato ketchup made from sun-ripened Heinz tomato seeds for unmatched flavor.",
    specifications: [
      "No artificial colors or preservatives added",
      "Made from 100% real sun-ripened red tomatoes",
      "Easy upside-down squeezy bottle design",
      "Net Weight: 500g",
    ],
    sku: "HNZ-KCH-500G",
    warranty: "100% Original Heinz Quality",
    inStock: true,
  },


];

export const getGroceryById = (id) => grocery.find((g) => String(g.id) === String(id));
