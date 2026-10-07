import timex1 from "../image/watches/Timex Men's Black Dial Analog Watch/1.webp";
import timex2 from "../image/watches/Timex Men's Black Dial Analog Watch/2.webp";
import timex3 from "../image/watches/Timex Men's Black Dial Analog Watch/3.webp";

import fastrack1 from "../image/watches/Fastrack Men's Analog Watch/1.webp";
import fastrack2 from "../image/watches/Fastrack Men's Analog Watch/2.webp";

import sylvi1 from "../image/watches/Boys Sylvi Bolt Silver Black Digital Watch/1.webp";
import sylvi2 from "../image/watches/Boys Sylvi Bolt Silver Black Digital Watch/2.webp";

import mastop1 from "../image/watches/MASTOP Men's Luxury Big Dial Dragon Quartz Watch/1.webp";
import mastop2 from "../image/watches/MASTOP Men's Luxury Big Dial Dragon Quartz Watch/2.webp";

import jaipur1 from "../image/watches/Jaipur Watch Company Roman BAAGH Gold Plated Watch/1.webp";
import jaipur2 from "../image/watches/Jaipur Watch Company Roman BAAGH Gold Plated Watch/2.webp";

export const watches = [
  {
    id: "wtch-1",
    title: "Timex Men's Classic Black Dial Analog Watch",
    brand: "Timex",
    price: 1995,
    originalPrice: 2495,
    rating: 4.8,
    reviews: 420,
    badge: "Popular",
    category: "Watches",
    images: [timex1, timex2, timex3],
    colors: ["Black Strap", "Brown Leather"],
    description: "Sleek and sophisticated Timex analog watch featuring a durable stainless steel case, quartz movement, and premium water resistance.",
    specifications: [
      "Dial Color: Black | Case Material: Stainless Steel",
      "Strap Color: Black | Band Width: 20mm",
      "Water Resistance Depth: 50 Meters",
      "Japanese Quartz Movement with 1 Year Warranty",
    ],
    sku: "TMX-BLK-4001",
    warranty: "1 Year Official Timex Warranty",
    inStock: true,
  },
  {
    id: "wtch-2",
    title: "Fastrack Men's Trendsetting Sporty Analog Watch",
    brand: "Fastrack",
    price: 1495,
    originalPrice: 1895,
    rating: 4.7,
    reviews: 350,
    badge: "Hot Sale",
    category: "Watches",
    images: [fastrack1, fastrack2],
    colors: ["Silver Metal", "Matte Black"],
    description: "Bold and vibrant analog wrist watch designed for youth and sports enthusiasts. Features rugged casing and precise timekeeping.",
    specifications: [
      "High durability mineral glass dial window",
      "Comfortable ergonomic silicone strap",
      "Water resistant up to 30M",
      "Quartz movement with 2 years battery life",
    ],
    sku: "FST-SPRT-2002",
    warranty: "2 Year Fastrack Brand Guarantee",
    inStock: true,
  },
  {
    id: "wtch-3",
    title: "Sylvi Bolt Silver Black Digital & Analog Sports Watch",
    brand: "Sylvi",
    price: 1299,
    originalPrice: 2999,
    rating: 4.9,
    reviews: 580,
    badge: "55% Off",
    category: "Watches",
    images: [sylvi1, sylvi2],
    colors: ["Silver Black", "Full Black"],
    description: "Dual time display sports digital watch with stopwatch, alarm clock, calendar, and LED backlight for night visibility.",
    specifications: [
      "Dual Analog & Digital LED Movement",
      "Functions: Stopwatch, Alarm, Date & Day, Backlight",
      "Water resistant casing with stainless steel back",
      "Heavy duty silicone strap with steel buckle",
    ],
    sku: "SLV-BLT-DIGI",
    warranty: "1 Year Sylvi Brand Warranty",
    inStock: true,
  },
  {
    id: "wtch-4",
    title: "MASTOP Men's Luxury Big Dial 3D Dragon Quartz Watch",
    brand: "MASTOP",
    price: 2499,
    originalPrice: 4999,
    rating: 4.8,
    reviews: 290,
    badge: "Luxury Gold",
    category: "Watches",
    images: [mastop1, mastop2],
    colors: ["Gold Stainless Steel", "Black Gold"],
    description: "Exquisite 3D golden dragon carved dial design. Perfect statement luxury timepiece for parties, events, and giftings.",
    specifications: [
      "3D Carved Golden Dragon Art Dial",
      "High quality IP gold plated stainless steel strap",
      "Scratch resistant Hardlex crystal glass",
      "Luminous hands for glow in dark view",
    ],
    sku: "MST-DRG-LUX",
    warranty: "1 Year International Warranty",
    inStock: true,
  },
  {
    id: "wtch-5",
    title: "Jaipur Watch Company Roman BAAGH Gold Plated Watch",
    brand: "Jaipur Watch Co",
    price: 8999,
    originalPrice: 12499,
    rating: 4.9,
    reviews: 140,
    badge: "Heritage Edition",
    category: "Watches",
    images: [jaipur1, jaipur2],
    colors: ["Gold Roman Dial", "Royal Brown"],
    description: "Royal Indian heritage inspired handcrafted watch with authentic vintage coin detail, gold polish, and genuine leather strap.",
    specifications: [
      "Handcrafted Indian Heritage Coin Motif Dial",
      "23K Gold Plated Stainless Steel Casing",
      "Genuine Italian Leather Strap",
      "Swiss Quartz Precision Movement",
    ],
    sku: "JWC-BGH-ROYAL",
    warranty: "2 Years Premium Heritage Warranty",
    inStock: true,
  },
];

export const getWatchById = (id) => watches.find((w) => String(w.id) === String(id));
