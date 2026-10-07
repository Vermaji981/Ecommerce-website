import dumbell1 from "../image/fittnes/dumbell/Adrenex 3 IN 1 Convertible Dumbbells Kit 12 Kg For Home Gym Adjustable Dumbbell (12 kg)/1.webp";
import dumbell2 from "../image/fittnes/dumbell/Adrenex 3 IN 1 Convertible Dumbbells Kit 12 Kg For Home Gym Adjustable Dumbbell (12 kg)/2.webp";

import resBand1 from "../image/fittnes/resistanceband/BOLDFIT Resistance Tube, Exercise & Stretching Resistance Band Set For Men & Women Workout Resistance Tube (Red)/-original-imahe3ka9kpzdanf.webp";
import resBand2 from "../image/fittnes/resistanceband/BOLDFIT Resistance Tube, Exercise & Stretching Resistance Band Set For Men & Women Workout Resistance Tube (Red)/-original-imahe3kanae8yrxf.webp";

import ankle1 from "../image/fittnes/ankleweight/SLOVIC Ankle Weights With Adjustable Straps For All Fitness Levels  500g Pair Set Black Ankle Weight (1 kg)/1.webp";
import ankle2 from "../image/fittnes/ankleweight/SLOVIC Ankle Weights With Adjustable Straps For All Fitness Levels  500g Pair Set Black Ankle Weight (1 kg)/2.webp";

import bench1 from "../image/fittnes/gymbench/DreamFit 3in1 Multipurpose Fitness Bench/1.webp";

export const fitness = [
  {
    id: "fit-1",
    title: "Adrenex 3-in-1 Convertible Dumbbells Kit (12 Kg)",
    brand: "Adrenex",
    price: 1299,
    originalPrice: 2499,
    rating: 4.8,
    reviews: 215,
    badge: "Home Gym",
    category: "Fitness",
    images: [dumbell1, dumbell2],
    colors: ["Red/Black Set", "Full Black"],
    description: "Versatile 3-in-1 adjustable dumbbell and barbell weight set ideal for full-body strength workout at home.",
    specifications: [
      "Total Weight: 12 Kg set with connector rod",
      "Durable PVC-coated anti-roll plates",
      "Ergonomic non-slip padded handles",
      "Easily convertible into barbell or kettlebell setup",
    ],
    sku: "ADX-DB-12KG",
    warranty: "6 Months Brand Warranty",
    inStock: true,
  },
  {
    id: "fit-2",
    title: "BOLDFIT Heavy Duty Resistance Tube & Band Set",
    brand: "Boldfit",
    price: 499,
    originalPrice: 999,
    rating: 4.6,
    reviews: 180,
    badge: "50% Off",
    category: "Fitness",
    images: [resBand1, resBand2],
    colors: ["Red Tube", "Multi-Color Pack"],
    description: "Premium natural latex resistance tube with cushioned foam handles, door anchor, and ankle straps for stretching and body workout.",
    specifications: [
      "100% Snap-proof natural latex tubing",
      "Padded heavy-duty foam handles",
      "Includes door anchor and travel pouch",
      "Ideal for muscle toning, rehab, and crossfit training",
    ],
    sku: "BLD-RES-RED",
    warranty: "1 Year Replacement Warranty",
    inStock: true,
  },
  {
    id: "fit-3",
    title: "SLOVIC Adjustable Ankle & Wrist Weights (1 Kg Pair)",
    brand: "Slovic",
    price: 699,
    originalPrice: 1299,
    rating: 4.7,
    reviews: 320,
    badge: "Best Seller",
    category: "Fitness",
    images: [ankle1, ankle2],
    colors: ["Black Pair", "Blue Pair"],
    description: "Ergonomic padded ankle and wrist weights with adjustable velcro straps designed for cardio, leg exercise, running, and physiotherapy.",
    specifications: [
      "Set of 2 x 500g (Total 1 Kg)",
      "Breathable moisture-wicking neoprene material",
      "Strong velcro closure ensures snug non-slip fit",
      "Perfect for walking, leg lifts, and workout intensity",
    ],
    sku: "SLC-ANK-1KG",
    warranty: "6 Months Quality Guarantee",
    inStock: true,
  },
  {
    id: "fit-4",
    title: "DreamFit 3-in-1 Multipurpose Adjustable Gym Bench",
    brand: "DreamFit",
    price: 3499,
    originalPrice: 6999,
    rating: 4.9,
    reviews: 410,
    badge: "Heavy Duty",
    category: "Fitness",
    images: [bench1],
    colors: ["Black Steel Frame"],
    description: "Heavy-duty commercial grade steel workout bench supporting flat, incline, and decline positions for intense bench press and dumbbell routines.",
    specifications: [
      "300 Kg Max Weight Load Capacity",
      "7-Position incline/decline backrest adjustment",
      "High-density sweat-resistant foam padding",
      "Foldable space-saving design for easy storage",
    ],
    sku: "DRM-BNCH-3IN1",
    warranty: "2 Years Heavy Frame Warranty",
    inStock: true,
  },
];

export const getFitnessById = (id) => fitness.find((f) => String(f.id) === String(id));
