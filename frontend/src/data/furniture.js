import sofa1 from "../image/furniture/sofa/Casaliving Premium Stephanie Fabric 3 Seater  Sofa (Finish Color - Black Grey, Pre-assembled)/symmetrical-86-black-grey-195-na-no-50-4f-193r-is1b-casaliving-original-imahfhkhcxycfryf.webp";
import sofa2 from "../image/furniture/sofa/Casaliving Premium Stephanie Fabric 3 Seater  Sofa (Finish Color - Black Grey, Pre-assembled)/symmetrical-86-black-grey-195-na-no-50-4f-193r-is1b.webp";

import bed1 from "../image/furniture/bed/Flipkart Perfect Homes Stout with Storage Headboard Solid Wood Queen Box Bed, 220 cm x 158 cm (7.22 ft x 5.18 ft) (Finish Color - Dark Walnut, Delivery Condition - Knock Down)/1.webp";
import bed2 from "../image/furniture/bed/Flipkart Perfect Homes Stout with Storage Headboard Solid Wood Queen Box Bed, 220 cm x 158 cm (7.22 ft x 5.18 ft) (Finish Color - Dark Walnut, Delivery Condition - Knock Down)/2.webp";

import chair1 from "../image/furniture/chari/HOMIBOSS Plastic Chairs for Home & Outdoor  Strong & Durable  Balcony & Office Use Plastic Dining Chair (Set of 2, Finish Color - GREY)/1.webp";
import chair2 from "../image/furniture/chari/HOMIBOSS Plastic Chairs for Home & Outdoor  Strong & Durable  Balcony & Office Use Plastic Dining Chair (Set of 2, Finish Color - GREY)/2.webp";

import table1 from "../image/furniture/table/EAGLE INDUSTRIES Foldable Study Table for Home, Laptop Table with Cup Holder & Phone Slot Wood Portable Laptop Table (Finish Color - Wood Grain Finish, Pre Assembled)/1.webp";
import table2 from "../image/furniture/table/EAGLE INDUSTRIES Foldable Study Table for Home, Laptop Table with Cup Holder & Phone Slot Wood Portable Laptop Table (Finish Color - Wood Grain Finish, Pre Assembled)/3.webp";

export const furniture = [
  {
    id: "furn-1",
    title: "Casaliving Premium Stephanie Fabric 3-Seater Sofa",
    brand: "Casaliving",
    price: 14999,
    originalPrice: 24999,
    rating: 4.8,
    reviews: 310,
    badge: "Best Seller",
    category: "Furniture",
    images: [sofa1, sofa2],
    colors: ["Black Grey", "Beige Comfort"],
    description: "Modern luxury 3-seater sofa made with high-density foam cushions and premium upholstery fabric for your living space.",
    specifications: [
      "Frame Material: Solid Salwood & Ply",
      "Upholstery: Premium Breathable Linen Fabric",
      "High resilient 32 density foam cushioning",
      "Pre-assembled & ready to use",
    ],
    sku: "CSL-SOFA-3STR",
    warranty: "3 Years Structural Warranty",
    inStock: true,
  },
  {
    id: "furn-2",
    title: "Perfect Homes Solid Wood Queen Bed with Storage",
    brand: "Perfect Homes",
    price: 18999,
    originalPrice: 29999,
    rating: 4.9,
    reviews: 450,
    badge: "Solid Wood",
    category: "Furniture",
    images: [bed1, bed2],
    colors: ["Dark Walnut", "Teak Finish"],
    description: "Spacious solid wood queen-size box bed featuring an integrated headboard storage compartment and dark walnut polish.",
    specifications: [
      "Dimensions: 220 cm x 158 cm (Queen Bed)",
      "Material: Termite-resistant engineered wood & solid timber",
      "Under-bed box storage for extra bedding and pillows",
      "Headboard display shelf for convenience",
    ],
    sku: "PFH-BED-QNWD",
    warranty: "5 Years Manufacturer Warranty",
    inStock: true,
  },
  {
    id: "furn-3",
    title: "HOMIBOSS Heavy Duty Plastic Balcony Chairs (Set of 2)",
    brand: "Homiboss",
    price: 1299,
    originalPrice: 2499,
    rating: 4.7,
    reviews: 195,
    badge: "Pack of 2",
    category: "Furniture",
    images: [chair1, chair2],
    colors: ["Cool Grey", "Matte Black"],
    description: "Ultra-durable weather-resistant plastic armchairs suitable for dining, living room, balcony, garden, and office use.",
    specifications: [
      "Material: 100% Virgin Grade Heavy Duty Polypropylene",
      "Ergonomic back support & wide seating area",
      "Weather-proof & easy to wash stackable design",
      "Weight capacity: Up to 150 Kg per chair",
    ],
    sku: "HMB-CHR-SET2",
    warranty: "1 Year Plastic Replacement Warranty",
    inStock: true,
  },
  {
    id: "furn-4",
    title: "EAGLE Portable Foldable Laptop & Study Table",
    brand: "Eagle Industries",
    price: 499,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 620,
    badge: "58% Off",
    category: "Furniture",
    images: [table1, table2],
    colors: ["Wood Grain", "Walnut Finish"],
    description: "Multi-functional bed study desk with built-in cup holder, tablet/phone slot, and anti-slip foldable metal legs.",
    specifications: [
      "Top Material: High Density Engineered Wood (MDF)",
      "Built-in tablet groove and mug holder slot",
      "Foldable steel legs with rubber anti-skid sleeves",
      "Pre-assembled & lightweight portable design",
    ],
    sku: "EGL-TBL-FOLD",
    warranty: "6 Months Brand Warranty",
    inStock: true,
  },
];

export const getFurnitureById = (id) => furniture.find((f) => String(f.id) === String(id));
