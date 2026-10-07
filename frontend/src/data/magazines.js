import mag1 from "../image/magzine/horerr/Imaginator Publishing Imaginator Magazine - FOLK HORROR SPECIAL EDITION (English, Paperback, Miller Ken)/1.webp";
import mag2 from "../image/magzine/horerr/Living Dead Press Presents Magazine Summer 2011 (English, Paperback, unknown)/1.webp";

export const magazines = [
  {
    id: "mag-1",
    title: "Imaginator Magazine - Folk Horror Special Edition",
    brand: "Imaginator Publishing",
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviews: 85,
    badge: "Special Edition",
    category: "Magazines",
    images: [mag1],
    colors: ["Paperback Edition"],
    description: "Exclusive collector's folk horror issue packed with captivating short stories, full-color illustrations, and dark folklore essays.",
    specifications: [
      "Language: English | Format: Softcover Collector Paperback",
      "Over 120 pages of original dark fantasy & horror features",
      "High quality gloss paper finish",
      "Limited edition release",
    ],
    sku: "IMG-MAG-FOLK01",
    warranty: "100% Original Collector Printing",
    inStock: true,
  },
  {
    id: "mag-2",
    title: "Living Dead Press Presents Magazine (Summer Edition)",
    brand: "Living Dead Press",
    price: 349,
    originalPrice: 499,
    rating: 4.7,
    reviews: 62,
    badge: "Limited Print",
    category: "Magazines",
    images: [mag2],
    colors: ["Summer Issue Print"],
    description: "Classic quarterly horror anthology magazine showcasing independent authors, horror cinema reviews, and graphic art spreads.",
    specifications: [
      "Language: English | Paperback",
      "Quarterly summer issue with exclusive interviews",
      "Premium print cover with durable binding",
      "Net Weight: 250g",
    ],
    sku: "LDP-MAG-SUMMER",
    warranty: "Authentic Publication",
    inStock: true,
  },
];

export const getMagazineById = (id) => magazines.find((m) => String(m.id) === String(id));
