const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const Coupon = require('../models/Coupon');

const initialCategories = [
  {
    name: 'Sunglasses',
    slug: 'sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    description: 'Designer polarized, aviator, and luxury sunglasses with 100% UV protection.'
  },
  {
    name: 'Watches',
    slug: 'watches',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    description: 'Analog, chronograph, and smart wristwatches for men and women.'
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    description: 'Athletic running sneakers, casual loafers, and premium leather footwear.'
  },
  {
    name: 'Mobiles',
    slug: 'mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    description: 'Latest 5G smartphones, flagship devices, and premium accessories.'
  },
  {
    name: 'Computers',
    slug: 'computers',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    description: 'High performance laptops, desktop setups, and pro workstations.'
  },
  {
    name: 'Fitness',
    slug: 'fitness',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    description: 'Gym equipment, yoga mats, resistance bands, and workout accessories.'
  },
  {
    name: 'Furniture',
    slug: 'furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    description: 'Ergonomic office chairs, sofas, modern tables, and luxury living decor.'
  },
  {
    name: 'Grocery',
    slug: 'grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    description: 'Fresh organic groceries, spices, pantry essentials, and beverages.'
  },
  {
    name: 'Home & Kitchen',
    slug: 'homekitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    description: 'Premium cookware, cutlery, smart blenders, and modern kitchen gadgets.'
  },
  {
    name: 'Magazines',
    slug: 'magazines',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    description: 'Popular international lifestyle, technology, fashion, and business publications.'
  },
  {
    name: 'Mobile Covers',
    slug: 'mobilecovers',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80',
    description: 'Shockproof protective cases, aesthetic printed covers, and leather flip pouches.'
  },
  {
    name: 'On Sale',
    slug: 'sale',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
    description: 'Exclusive discounted products, festival specials, and top clearance deals.'
  }
];

const initialBanners = [
  {
    title: 'Festival Mega Sale',
    subtitle: 'Save up to 60% on premium brands across all categories',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80',
    linkUrl: '/shop',
    discountText: 'FLAT 50% OFF',
    isActive: true,
    displayOrder: 1
  },
  {
    title: 'Luxury Watches & Eyewear',
    subtitle: 'Handcrafted timepieces and polarized designer sunglasses',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&auto=format&fit=crop&q=80',
    linkUrl: '/sunglasses',
    discountText: 'EXCLUSIVE COLLECTION',
    isActive: true,
    displayOrder: 2
  },
  {
    title: 'Next-Gen Smartphones & Laptops',
    subtitle: 'Lightning fast 5G smartphones and powerhouse workstations',
    imageUrl: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=1600&auto=format&fit=crop&q=80',
    linkUrl: '/shop',
    discountText: 'SPECIAL TECH DEALS',
    isActive: true,
    displayOrder: 3
  }
];

const initialCoupons = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 499,
    maxDiscountAmount: 300,
    expiryDate: new Date('2028-12-31'),
    usageLimit: 10000,
    isActive: true
  },
  {
    code: 'FESTIVE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 1499,
    maxDiscountAmount: 1000,
    expiryDate: new Date('2028-12-31'),
    usageLimit: 5000,
    isActive: true
  },
  {
    code: 'FLAT200',
    discountType: 'fixed',
    discountValue: 200,
    minOrderAmount: 999,
    maxDiscountAmount: 200,
    expiryDate: new Date('2028-12-31'),
    usageLimit: 5000,
    isActive: true
  },
  {
    code: 'SHOPKART500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 2999,
    maxDiscountAmount: 500,
    expiryDate: new Date('2028-12-31'),
    usageLimit: 2000,
    isActive: true
  }
];

const initialProducts = [
  // Sunglasses
  {
    name: 'Ray-Ban Aviator Classic Polarized',
    title: 'Ray-Ban Aviator Classic Polarized',
    customId: 'sun-1',
    categoryName: 'Sunglasses',
    catogries: 'sunglasses',
    brand: 'Ray-Ban',
    price: 6499,
    originalPrice: 8999,
    discountPrice: 6499,
    stock: 45,
    SKU: 'SUN-RAYB-01',
    ratings: 4.8,
    rating: 4.8,
    numReviews: 142,
    reviews: 142,
    badge: 'Best Seller',
    isFeatured: true,
    description: 'The iconic Ray-Ban Aviator Classic sunglasses featuring crystal green polarized lenses and gold metallic frame for unmatched glare elimination and UV protection.',
    specifications: ['100% UV400 Protection', 'Polarized Crystal Lenses', 'Lightweight Gold Alloy Frame', 'Includes Premium Leather Case'],
    colors: ['Gold / Green', 'Black / Grey', 'Silver / Blue'],
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Oakley Holbrook Sport Sunglasses',
    title: 'Oakley Holbrook Sport Sunglasses',
    customId: 'sun-2',
    categoryName: 'Sunglasses',
    catogries: 'sunglasses',
    brand: 'Oakley',
    price: 5299,
    originalPrice: 7499,
    discountPrice: 5299,
    stock: 35,
    SKU: 'SUN-OAKL-02',
    ratings: 4.7,
    rating: 4.7,
    numReviews: 98,
    reviews: 98,
    badge: 'Popular',
    isFeatured: false,
    description: 'Oakley Holbrook combines timeless, classic styling with modern Oakley performance technology. Accented by metal rivets and Oakley icons, perfect for everyday performance.',
    specifications: ['Prizm Lens Technology', 'O Matter Stress-Resistant Frame', 'High Definition Optics (HDO)'],
    colors: ['Matte Black / Prizm Black', 'Woodgrain / Prizm Tungsten'],
    images: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Gucci Hexagonal Luxury Sunglasses',
    title: 'Gucci Hexagonal Luxury Sunglasses',
    customId: 'sun-3',
    categoryName: 'Sunglasses',
    catogries: 'sunglasses',
    brand: 'Gucci',
    price: 18999,
    originalPrice: 24999,
    discountPrice: 18999,
    stock: 18,
    SKU: 'SUN-GUCC-03',
    ratings: 4.9,
    rating: 4.9,
    numReviews: 64,
    reviews: 64,
    badge: 'Luxury',
    isFeatured: true,
    description: 'Designer hexagonal wire frame Italian sunglasses showcasing Gucci iconic interlocking G logo on the temples and gradient tinted lenses.',
    specifications: ['Made in Italy', 'Gradient Brown Lenses', 'Interlocking G Embellishment', 'Velvet Hard Case'],
    colors: ['Gold / Brown Gradient', 'Shiny Black'],
    images: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Watches
  {
    name: 'Fossil Grant Chronograph Leather Watch',
    title: 'Fossil Grant Chronograph Leather Watch',
    customId: 'watch-1',
    categoryName: 'Watches',
    catogries: 'watches',
    brand: 'Fossil',
    price: 9495,
    originalPrice: 12995,
    discountPrice: 9495,
    stock: 50,
    SKU: 'WAT-FOSS-01',
    ratings: 4.6,
    rating: 4.6,
    numReviews: 210,
    reviews: 210,
    badge: 'Trending',
    isFeatured: true,
    description: 'Crafted with Roman numeral indices and vintage stopwatch design, Fossil Grant timepiece delivers masculine elegance with supple genuine brown leather strap.',
    specifications: ['44mm Stainless Steel Case', 'Quartz Chronograph Movement', '5 ATM Water Resistance', 'Genuine Brown Leather'],
    colors: ['Luggage Brown / Navy Dial', 'Black / Black Dial'],
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Casio G-Shock Rugged Solar Smartwatch',
    title: 'Casio G-Shock Rugged Solar Smartwatch',
    customId: 'watch-2',
    categoryName: 'Watches',
    catogries: 'watches',
    brand: 'Casio',
    price: 11999,
    originalPrice: 15495,
    discountPrice: 11999,
    stock: 40,
    SKU: 'WAT-CASI-02',
    ratings: 4.9,
    rating: 4.9,
    numReviews: 320,
    reviews: 320,
    badge: 'Tough',
    isFeatured: false,
    description: 'Indestructible shock resistant carbon core guard structure with solar charging, Bluetooth smartphone link, and 200m water resistance.',
    specifications: ['200M Water Resistance', 'Tough Solar Power', 'Bluetooth Phone Sync', 'World Time 300 Cities'],
    colors: ['Stealth Matte Black', 'Military Olive Green'],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    title: 'Apple Watch Series 9 GPS 45mm',
    customId: 'watch-3',
    categoryName: 'Watches',
    catogries: 'watches',
    brand: 'Apple',
    price: 41900,
    originalPrice: 44900,
    discountPrice: 41900,
    stock: 25,
    SKU: 'WAT-APPL-03',
    ratings: 4.9,
    rating: 4.9,
    numReviews: 450,
    reviews: 450,
    badge: 'Premium',
    isFeatured: true,
    description: 'Powerful S9 SiP chip with magical Double Tap gesture control, brighter Always-On display, advanced health sensors including ECG and Blood Oxygen.',
    specifications: ['Always-On Retina OLED 2000 nits', 'ECG & Blood Oxygen Sensors', 'Crash & Fall Detection', '18 Hours Battery'],
    colors: ['Midnight Aluminum', 'Starlight', 'Silver'],
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Shoes
  {
    name: 'Nike Air Zoom Pegasus 40 Running Shoes',
    title: 'Nike Air Zoom Pegasus 40 Running Shoes',
    customId: 'shoe-1',
    categoryName: 'Shoes',
    catogries: 'shoes',
    brand: 'Nike',
    price: 8995,
    originalPrice: 11895,
    discountPrice: 8995,
    stock: 60,
    SKU: 'SHO-NIKE-01',
    ratings: 4.8,
    rating: 4.8,
    numReviews: 530,
    reviews: 530,
    badge: 'Hot Deal',
    isFeatured: true,
    description: 'A springy ride for any run with responsive Nike React technology, dual Zoom Air units at forefoot and heel for energetic bounce across all road distances.',
    specifications: ['Dual Zoom Air Units', 'Engineered Mesh Breathability', 'Waffle Outsole Traction', 'Lightweight 285g'],
    colors: ['Pure Platinum / Bright Crimson', 'Triple Black', 'White / Laser Orange'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Adidas Ultraboost Light Performance Sneakers',
    title: 'Adidas Ultraboost Light Performance Sneakers',
    customId: 'shoe-2',
    categoryName: 'Shoes',
    catogries: 'shoes',
    brand: 'Adidas',
    price: 13999,
    originalPrice: 18999,
    discountPrice: 13999,
    stock: 45,
    SKU: 'SHO-ADID-02',
    ratings: 4.7,
    rating: 4.7,
    numReviews: 310,
    reviews: 310,
    badge: 'Top Rated',
    isFeatured: true,
    description: 'Experience epic energy return with the lightest Boost midsole ever made. Primeknit+ textile upper provides snug sock-like comfort on every stride.',
    specifications: ['Light Boost Midsole Compound', 'Primeknit+ Upper', 'Continental WinterGrip Rubber', 'Linear Energy Push System'],
    colors: ['Core Black / Cloud White', 'Lucid Lemon / Wonder Blue'],
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Puma RS-X Triple Retro Chunky Sneakers',
    title: 'Puma RS-X Triple Retro Chunky Sneakers',
    customId: 'shoe-3',
    categoryName: 'Shoes',
    catogries: 'shoes',
    brand: 'Puma',
    price: 5499,
    originalPrice: 8999,
    discountPrice: 5499,
    stock: 55,
    SKU: 'SHO-PUMA-03',
    ratings: 4.6,
    rating: 4.6,
    numReviews: 180,
    reviews: 180,
    badge: 'Popular',
    isFeatured: false,
    description: 'Disruptive silhouette with extreme proportions, mesh and synthetic leather upper, and ultra-plush Running System cushioning technology.',
    specifications: ['Puma Running System Cushioning', 'Chunky Rubber Outsole', 'Mesh and Leather Overlays'],
    colors: ['Triple White', 'Black / Ultra Red'],
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Mobiles
  {
    name: 'Apple iPhone 15 Pro Max 256GB Titanium',
    title: 'Apple iPhone 15 Pro Max 256GB Titanium',
    customId: 'mob-1',
    categoryName: 'Mobiles',
    catogries: 'mobiles',
    brand: 'Apple',
    price: 134999,
    originalPrice: 149900,
    discountPrice: 134999,
    stock: 30,
    SKU: 'MOB-IPHO-01',
    ratings: 4.9,
    rating: 4.9,
    numReviews: 890,
    reviews: 890,
    badge: 'Flagship',
    isFeatured: true,
    description: 'Forged in titanium with aerospace-grade strength, super-fast A17 Pro gaming chip, 5x telephoto optical zoom camera, and customizable Action button.',
    specifications: ['6.7" Super Retina XDR OLED 120Hz', 'A17 Pro 3nm Processor', '48MP Main + 5x Telephoto Zoom', 'USB-C 3.0 High Speed Transfer'],
    colors: ['Natural Titanium', 'Blue Titanium', 'Black Titanium', 'White Titanium'],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Samsung Galaxy S24 Ultra 5G AI Smartphone',
    title: 'Samsung Galaxy S24 Ultra 5G AI Smartphone',
    customId: 'mob-2',
    categoryName: 'Mobiles',
    catogries: 'mobiles',
    brand: 'Samsung',
    price: 119999,
    originalPrice: 134999,
    discountPrice: 119999,
    stock: 35,
    SKU: 'MOB-SAMS-02',
    ratings: 4.8,
    rating: 4.8,
    numReviews: 620,
    reviews: 620,
    badge: 'AI Powered',
    isFeatured: true,
    description: 'Galaxy AI with Circle to Search, Live Translate, Note Assist, 200MP Quad Telephoto Camera, titanium frame, and built-in S Pen stylus.',
    specifications: ['6.8" Dynamic AMOLED 2X 2600 nits', 'Snapdragon 8 Gen 3 for Galaxy', '200MP Camera + 100x Space Zoom', 'Built-in S-Pen Stylus'],
    colors: ['Titanium Gray', 'Titanium Black', 'Titanium Violet'],
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'OnePlus 12 5G Hasselblad Flagship',
    title: 'OnePlus 12 5G Hasselblad Flagship',
    customId: 'mob-3',
    categoryName: 'Mobiles',
    catogries: 'mobiles',
    brand: 'OnePlus',
    price: 64999,
    originalPrice: 69999,
    discountPrice: 64999,
    stock: 40,
    SKU: 'MOB-ONEP-03',
    ratings: 4.7,
    rating: 4.7,
    numReviews: 410,
    reviews: 410,
    badge: 'Speed King',
    isFeatured: false,
    description: 'Elite speed powered by Snapdragon 8 Gen 3, 100W SUPERVOOC charging, 4th Gen Hasselblad Camera System with 64MP periscope telephoto lens.',
    specifications: ['6.82" 2K 120Hz ProXDR Display', '5400mAh Battery + 100W Charging', '50MP Sony LYT-808 Camera Sensor'],
    colors: ['Silky Black', 'Flowy Emerald'],
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Computers
  {
    name: 'Apple MacBook Pro 16" M3 Max 36GB Unified Memory',
    title: 'Apple MacBook Pro 16" M3 Max 36GB Unified Memory',
    customId: 'comp-1',
    categoryName: 'Computers',
    catogries: 'computers',
    brand: 'Apple',
    price: 289900,
    originalPrice: 319900,
    discountPrice: 289900,
    stock: 20,
    SKU: 'COM-MACB-01',
    ratings: 4.9,
    rating: 4.9,
    numReviews: 180,
    reviews: 180,
    badge: 'Pro Grade',
    isFeatured: true,
    description: 'Extreme workstation power with Apple M3 Max 14-core CPU and 30-core GPU, Liquid Retina XDR display with 1600 nits peak brightness, and up to 22 hours battery.',
    specifications: ['M3 Max Chip (14-core CPU, 30-core GPU)', '36GB Unified RAM + 1TB SSD', '16.2" Liquid Retina XDR 120Hz Display', '22 Hours Battery Life'],
    colors: ['Space Black', 'Silver'],
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Dell XPS 15 InfinityEdge OLED Laptop',
    title: 'Dell XPS 15 InfinityEdge OLED Laptop',
    customId: 'comp-2',
    categoryName: 'Computers',
    catogries: 'computers',
    brand: 'Dell',
    price: 184999,
    originalPrice: 209999,
    discountPrice: 184999,
    stock: 25,
    SKU: 'COM-DELL-02',
    ratings: 4.7,
    rating: 4.7,
    numReviews: 140,
    reviews: 140,
    badge: 'Creator Choice',
    isFeatured: true,
    description: 'Stunning 3.5K OLED touchscreen display packed inside CNC machined aluminum chassis with Intel Core i9 13th Gen processor and NVIDIA GeForce RTX 4060 graphics.',
    specifications: ['15.6" 3.5K OLED Touchscreen', 'Intel Core i9-13900H Processor', '32GB DDR5 RAM + 1TB NVMe SSD', 'NVIDIA GeForce RTX 4060 8GB'],
    colors: ['Platinum Silver with Black Carbon Fiber'],
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Fitness
  {
    name: 'Bowflex SelectTech Adjustable Dumbbells Pair (5-52.5 lbs)',
    title: 'Bowflex SelectTech Adjustable Dumbbells Pair (5-52.5 lbs)',
    customId: 'fit-1',
    categoryName: 'Fitness',
    catogries: 'fitness',
    brand: 'Bowflex',
    price: 24999,
    originalPrice: 32999,
    discountPrice: 24999,
    stock: 30,
    SKU: 'FIT-BOWF-01',
    ratings: 4.8,
    rating: 4.8,
    numReviews: 240,
    reviews: 240,
    badge: 'Top Home Gym',
    isFeatured: true,
    description: 'Replaces 15 sets of weights in one compact system. Easily adjust resistance from 5 lbs up to 52.5 lbs per dumbbell with the turn of a selector dial.',
    specifications: ['Adjusts from 5 to 52.5 lbs', 'Space-saving compact tray', 'Durable metal weight plates'],
    colors: ['Black / Red'],
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Furniture
  {
    name: 'Herman Miller Aeron Ergonomic Office Chair',
    title: 'Herman Miller Aeron Ergonomic Office Chair',
    customId: 'furn-1',
    categoryName: 'Furniture',
    catogries: 'furniture',
    brand: 'Herman Miller',
    price: 94999,
    originalPrice: 119999,
    discountPrice: 94999,
    stock: 15,
    SKU: 'FUR-HERM-01',
    ratings: 4.9,
    rating: 4.9,
    numReviews: 195,
    reviews: 195,
    badge: 'Ergonomic King',
    isFeatured: true,
    description: 'The pinnacle of ergonomic seating. Pellicle 8Z breathable mesh distributes weight evenly across 8 zones to keep you cool and completely supported all day.',
    specifications: ['PostureFit SL Lumbar Support', 'Pellicle 8Z Breathable Suspension', 'Fully Adjustable 3D Armrests', '12 Year Warranty'],
    colors: ['Mineral / Satin Aluminum', 'Graphite Black'],
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580481077195-c3f295175e11?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Grocery
  {
    name: 'Organic Blue Mountain Arabica Coffee Beans 1kg',
    title: 'Organic Blue Mountain Arabica Coffee Beans 1kg',
    customId: 'groc-1',
    categoryName: 'Grocery',
    catogries: 'grocery',
    brand: 'Artisan Roast',
    price: 1499,
    originalPrice: 1999,
    discountPrice: 1499,
    stock: 100,
    SKU: 'GRO-COFF-01',
    ratings: 4.7,
    rating: 4.7,
    numReviews: 340,
    reviews: 340,
    badge: 'Organic',
    isFeatured: false,
    description: '100% shade-grown Arabica coffee beans carefully medium-dark roasted to bring out chocolatey undertones, smooth body, and low acidity.',
    specifications: ['100% Single Origin Arabica', 'USDA Certified Organic', 'Resealable Degassing Valve Pack', 'Net Weight: 1000g'],
    colors: ['Whole Beans'],
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Home & Kitchen
  {
    name: 'Ninja Foodi 8-in-1 DualZone Air Fryer XL',
    title: 'Ninja Foodi 8-in-1 DualZone Air Fryer XL',
    customId: 'home-1',
    categoryName: 'Home & Kitchen',
    catogries: 'homekitchen',
    brand: 'Ninja',
    price: 14999,
    originalPrice: 19999,
    discountPrice: 14999,
    stock: 40,
    SKU: 'KIT-NINJ-01',
    ratings: 4.8,
    rating: 4.8,
    numReviews: 480,
    reviews: 480,
    badge: 'Best Cookware',
    isFeatured: true,
    description: 'Features 2 independent cooking baskets that let you cook 2 foods, 2 ways, finishing at the exact same time with Smart Finish technology.',
    specifications: ['8-in-1 Versatility (Air Fry, Roast, Broil, Bake)', 'Dual 4-Quart Nonstick Baskets', 'Smart Finish & Match Cook Mode', 'Dishwasher Safe Parts'],
    colors: ['Matte Black / Stainless Steel'],
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Magazines
  {
    name: 'Architectural Digest & Tech Annual Collector Edition',
    title: 'Architectural Digest & Tech Annual Collector Edition',
    customId: 'mag-1',
    categoryName: 'Magazines',
    catogries: 'magazines',
    brand: 'Condé Nast',
    price: 899,
    originalPrice: 1200,
    discountPrice: 899,
    stock: 80,
    SKU: 'MAG-COND-01',
    ratings: 4.6,
    rating: 4.6,
    numReviews: 95,
    reviews: 95,
    badge: 'Collector',
    isFeatured: false,
    description: 'Hardbound luxury glossy annual edition featuring the world’s most stunning interior designs, sustainable architectural masterpieces, and modern tech smart homes.',
    specifications: ['Hardbound Glossy Paper', '320 High-Res Illustrated Pages', 'Exclusive Interview Chapters'],
    colors: ['Collector Hardcover'],
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Mobile Covers
  {
    name: 'Spigen Tough Armor Heavy Duty Case with Kickstand',
    title: 'Spigen Tough Armor Heavy Duty Case with Kickstand',
    customId: 'cov-1',
    categoryName: 'Mobile Covers',
    catogries: 'mobilecovers',
    brand: 'Spigen',
    price: 1499,
    originalPrice: 2499,
    discountPrice: 1499,
    stock: 120,
    SKU: 'COV-SPIG-01',
    ratings: 4.8,
    rating: 4.8,
    numReviews: 610,
    reviews: 610,
    badge: 'Bestseller',
    isFeatured: false,
    description: 'Dual layer protection with shock absorption TPU and polycarbonate shell. Built-in kickstand for hands-free landscape viewing and raised lips for camera protection.',
    specifications: ['Air Cushion Drop Defense', 'Mil-Grade Certified Protection', 'Integrated Reinforced Kickstand'],
    colors: ['Gunmetal', 'Abyss Green', 'Black'],
    images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

const seedInitialData = async () => {
  try {
    console.log('[Atlas Seeder] Checking MongoDB Atlas collections...');

    // 1. Seed Categories
    const categoryDocMap = new Map();
    for (const catData of initialCategories) {
      let existingCat = await Category.findOne({
        $or: [{ slug: catData.slug }, { name: catData.name }]
      });

      if (!existingCat) {
        existingCat = await Category.create(catData);
        console.log(`[Atlas Seeder] Created Category in Atlas: ${catData.name}`);
      }
      categoryDocMap.set(catData.name.toLowerCase(), existingCat);
      categoryDocMap.set(catData.slug.toLowerCase(), existingCat);
    }

    // 2. Seed Products
    for (const prodData of initialProducts) {
      let existingProd = await Product.findOne({
        $or: [
          { SKU: prodData.SKU },
          { customId: prodData.customId },
          { name: prodData.name }
        ]
      });

      if (!existingProd) {
        const catKey = (prodData.categoryName || prodData.catogries || '').toLowerCase();
        const matchedCat = categoryDocMap.get(catKey);
        const resolvedCategory = matchedCat ? matchedCat._id : prodData.categoryName;

        await Product.create({
          name: prodData.name,
          title: prodData.title,
          customId: prodData.customId,
          description: prodData.description,
          price: prodData.price,
          originalPrice: prodData.originalPrice,
          discountPrice: prodData.discountPrice,
          category: resolvedCategory,
          catogries: prodData.catogries,
          brand: prodData.brand,
          image: prodData.images[0],
          img: prodData.images[0],
          images: prodData.images,
          stock: prodData.stock,
          SKU: prodData.SKU,
          ratings: prodData.ratings,
          rating: prodData.rating,
          numReviews: prodData.numReviews,
          reviews: prodData.reviews,
          badge: prodData.badge,
          warranty: prodData.warranty || '1 Year Brand Warranty',
          specifications: prodData.specifications,
          colors: prodData.colors,
          isFeatured: prodData.isFeatured,
          isActive: true
        });
        console.log(`[Atlas Seeder] Stored Product in Atlas: ${prodData.name} (₹${prodData.price})`);
      }
    }

    // 3. Seed Banners
    for (const bannerData of initialBanners) {
      const existingBanner = await Banner.findOne({ title: bannerData.title });
      if (!existingBanner) {
        await Banner.create(bannerData);
        console.log(`[Atlas Seeder] Stored Banner in Atlas: ${bannerData.title}`);
      }
    }

    // 4. Seed Coupons
    for (const couponData of initialCoupons) {
      const existingCoupon = await Coupon.findOne({ code: couponData.code });
      if (!existingCoupon) {
        await Coupon.create(couponData);
        console.log(`[Atlas Seeder] Stored Coupon in Atlas: ${couponData.code}`);
      }
    }

    console.log('[Atlas Seeder] ✅ All initial store data successfully verified & stored in MongoDB Atlas!');
  } catch (error) {
    console.error('[Atlas Seeder Error]:', error.message);
  }
};

module.exports = seedInitialData;
