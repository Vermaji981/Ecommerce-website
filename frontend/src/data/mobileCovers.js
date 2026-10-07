import cov1Img1 from "../image/mobile covers/Premium Magnetic Transparent Case for Apple iPhone 17 Pro Max with Soft TPU Edges, Camera Bumper & Metal Finish Buttons/1.webp";
import cov1Img2 from "../image/mobile covers/Premium Magnetic Transparent Case for Apple iPhone 17 Pro Max with Soft TPU Edges, Camera Bumper & Metal Finish Buttons/2.webp";

import cov2Img1 from "../image/mobile covers/Anti-Yellow Scratch Resistant Case Support Magnetic Accessories Back Cover For iQOO 13 5G/1.webp";
import cov2Img2 from "../image/mobile covers/Anti-Yellow Scratch Resistant Case Support Magnetic Accessories Back Cover For iQOO 13 5G/2.webp";

import cov3Img1 from "../image/mobile covers/Crystal Clear Hard Anti-Yellow Transparent Back Cover Case For Samsung S23 Ultra 5G/1.webp";
import cov3Img2 from "../image/mobile covers/Crystal Clear Hard Anti-Yellow Transparent Back Cover Case For Samsung S23 Ultra 5G/2.webp";

import cov4Img1 from "../image/mobile covers/Clear Protective Back Cover with Flexible Sides and Hard Back for Google Pixel 10A 5G/1.webp";
import cov4Img2 from "../image/mobile covers/Clear Protective Back Cover with Flexible Sides and Hard Back for Google Pixel 10A 5G/2.webp";

export const mobileCovers = [
  {
    id: "cov-1",
    title: "Premium Magnetic Clear Case for iPhone 17 Pro Max",
    brand: "Apple Accessories",
    price: 699,
    originalPrice: 1299,
    rating: 4.9,
    reviews: 380,
    badge: "MagSafe Ready",
    category: "Mobile Covers",
    images: [cov1Img1, cov1Img2],
    colors: ["Clear Crystal", "Titanium Frame"],
    description: "Shockproof hybrid transparent back cover with built-in magnetic ring for wireless charging, raised camera bumper, and soft TPU edges.",
    specifications: [
      "Compatible Model: Apple iPhone 17 Pro Max",
      "Integrated Strong N52 Magnet Array for fast MagSafe charging",
      "Anti-yellowing PC back with shock-absorbing TPU bumper",
      "Raised 1.5mm camera lens bezel protection",
    ],
    sku: "MAG-COV-IP17PM",
    warranty: "6 Months Anti-Yellowing Warranty",
    inStock: true,
  },
  {
    id: "cov-2",
    title: "Anti-Yellow Scratch Resistant Clear Case for iQOO 13 5G",
    brand: "iQOO Cases",
    price: 499,
    originalPrice: 899,
    rating: 4.7,
    reviews: 210,
    badge: "Scratch Proof",
    category: "Mobile Covers",
    images: [cov2Img1, cov2Img2],
    colors: ["Transparent Black", "Ultra Clear"],
    description: "Military-grade drop protection case featuring crystal clarity, reinforced corner airbags, and tactile responsive buttons.",
    specifications: [
      "Compatible Model: iQOO 13 5G",
      "Dual-layer polycarbonate and flexible TPU construction",
      "Precision cutouts for speaker, ports, and mic",
      "Air-cushion technology for impact absorption",
    ],
    sku: "IQ-COV-135G",
    warranty: "6 Months Product Warranty",
    inStock: true,
  },
  {
    id: "cov-3",
    title: "Crystal Clear Hard Anti-Yellow Cover for Samsung S23 Ultra",
    brand: "Samsung Accessories",
    price: 549,
    originalPrice: 999,
    rating: 4.8,
    reviews: 310,
    badge: "Ultra Clear",
    category: "Mobile Covers",
    images: [cov3Img1, cov3Img2],
    colors: ["Clear Transparent", "Smoke Black"],
    description: "Slim profile ultra-clear back case with S-Pen cutout, raised screen lip, and non-slip side grip texture.",
    specifications: [
      "Compatible Model: Samsung Galaxy S23 Ultra 5G",
      "Dedicated easy-access cutout for S-Pen slot",
      "UV-resistant anti-yellowing coating material",
      "Raised edges for screen and camera protection",
    ],
    sku: "SAM-COV-S23U",
    warranty: "6 Months Brand Guarantee",
    inStock: true,
  },
  {
    id: "cov-4",
    title: "Flexible Sides Hard Back Cover for Google Pixel 10A 5G",
    brand: "Google Accessories",
    price: 449,
    originalPrice: 799,
    rating: 4.6,
    reviews: 175,
    badge: "Drop Tested",
    category: "Mobile Covers",
    images: [cov4Img1, cov4Img2],
    colors: ["Crystal Clear", "Frost Matte"],
    description: "Hybrid protective case combining flexible shock-absorbent TPU sides with a tough rigid PC back panel for Pixel 10A.",
    specifications: [
      "Compatible Model: Google Pixel 10A 5G",
      "Impact resistant corner bumpers",
      "Soft tactile button covers for easy press",
      "Slim non-bulky lightweight armor design",
    ],
    sku: "GGL-COV-P10A",
    warranty: "6 Months Replacement Warranty",
    inStock: true,
  },
];

export const getMobileCoverById = (id) => mobileCovers.find((mc) => String(mc.id) === String(id));
