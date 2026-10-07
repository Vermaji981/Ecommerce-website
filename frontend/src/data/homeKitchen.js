import mixer1 from "../image/home and kitchen/mixer/BAJAJ GX 1 500 W Mixer Grinder (410570  3 Jars  Blue)/1.webp";
import mixer2 from "../image/home and kitchen/mixer/BAJAJ GX 1 500 W Mixer Grinder (410570  3 Jars  Blue)/2.webp";

import induction1 from "../image/home and kitchen/induction/Prestige 1600 W Induction Cooktop Push Button (Black, PIC 20 NEO)/-original-imahzyzghjfpcv3z.webp";

import basket1 from "../image/home and kitchen/basket/Smartslide Dish Drainer Kitchen Rack Dish Drainer for Kitchen Utensil Dish Rack with Draining tray & Spoon Holder Steel/1.webp";

import jar1 from "../image/home and kitchen/jars and bottle/Akmira Glass Pickle Jar  - 250 ml (Pack of 2, Clear)/1.webp";
import jar2 from "../image/home and kitchen/jars and bottle/Akmira Glass Pickle Jar  - 250 ml (Pack of 2, Clear)/2.webp";

export const homeKitchen = [
  {
    id: "hk-1",
    title: "BAJAJ GX 1 500 W Mixer Grinder with 3 Stainless Steel Jars",
    brand: "Bajaj",
    price: 2199,
    originalPrice: 3499,
    rating: 4.7,
    reviews: 580,
    badge: "Must Have",
    category: "Home & Kitchen",
    images: [mixer1, mixer2],
    colors: ["Classic Blue", "Bright White"],
    description: "Powerful 500W motor mixer grinder equipped with 3 durable stainless steel jars for wet grinding, dry grinding, and chutneys.",
    specifications: [
      "500W High Torque Copper Motor",
      "3 Stainless Steel Jars (1.2L Liquidizing, 0.8L Dry, 0.3L Chutney)",
      "3-Speed Control Knob with Inching feature",
      "Overload protector switch for safety",
    ],
    sku: "BJJ-MIX-500W",
    warranty: "2 Years Product & Motor Warranty",
    inStock: true,
  },
  {
    id: "hk-2",
    title: "Prestige 1600 W Smart Induction Cooktop (PIC 20 NEO)",
    brand: "Prestige",
    price: 1899,
    originalPrice: 3195,
    rating: 4.8,
    reviews: 640,
    badge: "Energy Saver",
    category: "Home & Kitchen",
    images: [induction1],
    colors: ["Black Gloss", "Matte Black"],
    description: "Effortless, fast, and energy-efficient induction cooktop featuring Indian menu presets and automatic voltage regulation.",
    specifications: [
      "1600 Watts Energy-Efficient Cooking",
      "Push Button control panel with preset Indian menus",
      "Built-in Automatic Voltage Regulator (AVR)",
      "Anti-Magnetic Wall & Aerodynamic cooling system",
    ],
    sku: "PRST-IND-1600W",
    warranty: "1 Year Prestige Guarantee",
    inStock: true,
  },
  {
    id: "hk-3",
    title: "Smartslide Stainless Steel Dish Drainer Rack with Water Tray",
    brand: "Smartslide",
    price: 1199,
    originalPrice: 2299,
    rating: 4.8,
    reviews: 290,
    badge: "Rust Proof",
    category: "Home & Kitchen",
    images: [basket1],
    colors: ["Chrome Silver Steel"],
    description: "Heavy-gauge stainless steel kitchen dish drying rack with removable drip tray, cutlery holder, and mug hooks.",
    specifications: [
      "100% Grade 202 Stainless Steel with Mirror Finish",
      "Includes detachable plastic water draining tray",
      "Dedicated spoon, fork, and knife basket attachment",
      "Anti-scratch rubber feet for countertop protection",
    ],
    sku: "SMS-DRN-STEEL",
    warranty: "1 Year Anti-Rust Guarantee",
    inStock: true,
  },
  {
    id: "hk-4",
    title: "Akmira Airtight Glass Pickle & Spice Jars 250ml (Pack of 2)",
    brand: "Akmira",
    price: 349,
    originalPrice: 699,
    rating: 4.6,
    reviews: 185,
    badge: "Pack of 2",
    category: "Home & Kitchen",
    images: [jar1, jar2],
    colors: ["Transparent Glass"],
    description: "Premium food-grade clear glass jars with leakproof airtight clamps for storing pickles, ghee, honey, and dry spices.",
    specifications: [
      "Capacity: 250 ml each (Set of 2 Jars)",
      "BPA-free lead-free thick soda-lime glass",
      "Stainless steel metal clamp with silicone seal gasket",
      "Dishwasher safe and clear view design",
    ],
    sku: "AKM-JAR-250ML",
    warranty: "Quality Sealed Guarantee",
    inStock: true,
  },
];

export const getHomeKitchenById = (id) => homeKitchen.find((hk) => String(hk.id) === String(id));
