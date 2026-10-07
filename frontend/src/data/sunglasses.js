import burberry1 from "../image/sunglasss/Burberry - 0BE442741128736/1.avif";
import burberry2 from "../image/sunglasss/Burberry - 0BE442741128736/2.avif";
import burberry3 from "../image/sunglasss/Burberry - 0BE442741128736/3.avif";
import burberry4 from "../image/sunglasss/Burberry - 0BE442741128736/4.avif";
import burberry5 from "../image/sunglasss/Burberry - 0BE442741128736/5.avif";

import coach1 from "../image/sunglasss/COACH - COACH Women Metal Sunglass/1.avif";
import coach2 from "../image/sunglasss/COACH - COACH Women Metal Sunglass/2.avif";
import coach3 from "../image/sunglasss/COACH - COACH Women Metal Sunglass/3.avif";
import coach4 from "../image/sunglasss/COACH - COACH Women Metal Sunglass/4.avif";
import coach5 from "../image/sunglasss/COACH - COACH Women Metal Sunglass/5.avif";

import armani1 from "../image/sunglasss/Emporio-Armani/1.avif";
import armani2 from "../image/sunglasss/Emporio-Armani/2.avif";
import armani3 from "../image/sunglasss/Emporio-Armani/3.avif";
import armani4 from "../image/sunglasss/Emporio-Armani/4.avif";
import armani5 from "../image/sunglasss/Emporio-Armani/5.avif";

import hustlr1 from "../image/sunglasss/Hustlr  Blue Sky/1.webp";
import hustlr3 from "../image/sunglasss/Hustlr  Blue Sky/3.webp";
import hustlr4 from "../image/sunglasss/Hustlr  Blue Sky/4.webp";
import hustlr5 from "../image/sunglasss/Hustlr  Blue Sky/5.webp";
import hustlr6 from "../image/sunglasss/Hustlr  Blue Sky/6.webp";
import hustlrFull from "../image/sunglasss/Hustlr  Blue Sky/blue-sky-full-rim-square-air-essentials-la-e15417-w-c7-eyeglasses_g_6030_16_1_2026.webp";

import michael1 from "../image/sunglasss/Michael Kors - Michael Kors Metal Woman Sunglass            Price inclusive of all taxes/1.avif";
import michael2 from "../image/sunglasss/Michael Kors - Michael Kors Metal Woman Sunglass            Price inclusive of all taxes/2.avif";
import michael3 from "../image/sunglasss/Michael Kors - Michael Kors Metal Woman Sunglass            Price inclusive of all taxes/3.avif";
import michael4 from "../image/sunglasss/Michael Kors - Michael Kors Metal Woman Sunglass            Price inclusive of all taxes/4.avif";
import michael5 from "../image/sunglasss/Michael Kors - Michael Kors Metal Woman Sunglass            Price inclusive of all taxes/5.avif";
import michaelCover from "../image/sunglasss/michal kors.avif";

import ralph1 from "../image/sunglasss/RALPH LAUREN - Ralph Women Injected Sunglass/1.avif";
import ralph2 from "../image/sunglasss/RALPH LAUREN - Ralph Women Injected Sunglass/2.avif";
import ralph3 from "../image/sunglasss/RALPH LAUREN - Ralph Women Injected Sunglass/3.avif";
import ralph4 from "../image/sunglasss/RALPH LAUREN - Ralph Women Injected Sunglass/4.avif";
import ralph5 from "../image/sunglasss/RALPH LAUREN - Ralph Women Injected Sunglass/5.avif";
import ralphCover from "../image/sunglasss/RALPH LAUREN - Ralph Women Injected Sunglass.avif";

import rayban1 from "../image/sunglasss/Rayban Jbior Sole Unisex/1.avif";
import rayban2 from "../image/sunglasss/Rayban Jbior Sole Unisex/2.avif";
import rayban3 from "../image/sunglasss/Rayban Jbior Sole Unisex/3.avif";
import rayban4 from "../image/sunglasss/Rayban Jbior Sole Unisex/4.avif";
import rayban5 from "../image/sunglasss/Rayban Jbior Sole Unisex/5.avif";
import raybanCover from "../image/sunglasss/rayban junior ray ban juniorsole unisex metal sunglass rupee 3752 delrupy4690.avif";

import versace1 from "../image/sunglasss/Versace - Versace Sunglasses/1.avif";
import versace2 from "../image/sunglasss/Versace - Versace Sunglasses/2.avif";
import versace3 from "../image/sunglasss/Versace - Versace Sunglasses/3.avif";
import versace4 from "../image/sunglasss/Versace - Versace Sunglasses/4.avif";
import versace5 from "../image/sunglasss/Versace - Versace Sunglasses/5.avif";
import versace6 from "../image/sunglasss/Versace - Versace Sunglasses/6.avif";
import versace7 from "../image/sunglasss/Versace - Versace Sunglasses/7.avif";

import simpleSunglass from "../simple image/sunglass.avif";

const item = (id, brand, title, price, originalPrice, rating, images, colors, description, specifications, badge = "Hot") => ({
  id,
  brand,
  title,
  price,
  originalPrice,
  rating,
  reviews: 60 + Math.round(rating * 10),
  images,
  colors,
  description,
  specifications,
  sku: `${brand.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase()}-${id.toUpperCase()}`,
  badge,
});

export const sunglasses = [
  // --- BURBERRY ---
  item(
    "burberry-be4427",
    "Burberry",
    "Burberry BE4427 Square Sunglasses",
    12490,
    14990,
    4.7,
    [burberry1, burberry2, burberry3, burberry4, burberry5],
    ["Black", "Havana"],
    "Bold square silhouette featuring signature Burberry detailing and maximum UV sun protection for everyday elegance.",
    ["100% UV Protection (UV400)", "Acetate frame with iconic check accent", "Gradient scratch-resistant lenses", "Includes luxury hard case & polishing cloth"],
    "Luxury"
  ),
  item(
    "burberry-check-tortoise",
    "Burberry",
    "Burberry Check Accent Tortoise Sunglasses",
    13990,
    16500,
    4.8,
    [burberry3, burberry4, burberry5, burberry1, burberry2],
    ["Dark Tortoise", "Havana"],
    "Refined dark tortoise frame styled with Burberry check temple inserts and rich brown tinted lenses.",
    ["100% UV Protection", "Italian acetate frame", "Anti-reflective coating", "Includes branded case & box"],
    "New Arrival"
  ),
  item(
    "burberry-heritage-black",
    "Burberry",
    "Burberry Heritage Black Oval Sunglasses",
    11990,
    13990,
    4.6,
    [burberry2, burberry5, burberry1, burberry3, burberry4],
    ["Classic Black", "Gold Accent"],
    "Sleek heritage oval sunglasses with subtle gold Burberry insignia and UV400 protective lenses.",
    ["UV400 spectrum filter", "Gold-tone temple detailing", "Ergonomic bridge support", "Includes protective case"],
    "Popular"
  ),
  item(
    "burberry-gold-luxe",
    "Burberry",
    "Burberry Gold Check Luxury Sunglasses",
    14500,
    17900,
    4.9,
    [burberry4, burberry1, burberry2, burberry5, burberry3],
    ["Polished Gold", "Gradient Amber"],
    "Statement gold-trimmed oversized frames with gradient amber lenses for high-fashion elegance.",
    ["Gradient tinted lenses", "Full metal & acetate composite frame", "100% UVA/UVB shield", "Includes velvet lining case"],
    "Exclusive"
  ),

  // --- COACH ---
  item(
    "coach-metal",
    "Coach",
    "Coach Women Metal Rose Gold Sunglasses",
    8990,
    10990,
    4.6,
    [coach1, coach2, coach3, coach4, coach5],
    ["Rose Gold", "Gold"],
    "Lightweight premium metal sunglasses with a sleek, polished feminine profile.",
    ["UV400 protective lenses", "Stainless steel lightweight frame", "Adjustable soft nose pads", "Includes branded case & cleaning cloth"],
    "Sale"
  ),
  item(
    "coach-gold-pilot",
    "Coach",
    "Coach Gold Pilot Metal Sunglasses",
    9490,
    11990,
    4.7,
    [coach3, coach4, coach5, coach1, coach2],
    ["Shiny Gold", "Warm Amber"],
    "Classic pilot aviator styling engineered with ultra-light stainless steel and warm tinted lenses.",
    ["Polarized pilot lenses", "Slim temple arms with Coach emblem", "Impact-resistant glass", "Includes signature Coach case"],
    "Trending"
  ),
  item(
    "coach-oval-classic",
    "Coach",
    "Coach Classic Polished Oval Sunglasses",
    7990,
    9990,
    4.5,
    [coach5, coach1, coach2, coach4, coach3],
    ["Silver", "Smoked Grey"],
    "Effortless everyday oval silhouette with polished silver hardware and lightweight fit.",
    ["100% UV Protection", "Lightweight metal frame", "Scratch-resistant polycarbonate lens", "Coach branded cloth included"],
    "Best Seller"
  ),

  // --- EMPORIO ARMANI ---
  item(
    "emporio-armani",
    "Emporio Armani",
    "Emporio Armani EA Modern Aviator",
    10990,
    12990,
    4.8,
    [armani1, armani2, armani3, armani4, armani5],
    ["Matte Black", "Gunmetal"],
    "Modern aviator design crafted with Italian luxury craftsmanship and comfortable spring hinges.",
    ["Polarized anti-glare lenses", "Durable metal frame construction", "100% UVA/UVB protection", "Includes magnetic case"],
    "Top Rated"
  ),
  item(
    "emporio-armani-gunmetal",
    "Emporio Armani",
    "Emporio Armani Gunmetal Shield Sunglasses",
    11490,
    13990,
    4.7,
    [armani3, armani4, armani5, armani1, armani2],
    ["Gunmetal", "Matte Silver"],
    "Futuristic gunmetal shield sunglasses with subtle EA eagle logo detailing and polarized lenses.",
    ["Polarized shield lens", "High-grade alloy frame", "Spring hinge temples", "Hard shell case included"],
    "Hot"
  ),
  item(
    "emporio-armani-matte-black",
    "Emporio Armani",
    "Emporio Armani Matte Black Square Shades",
    9990,
    11990,
    4.6,
    [armani5, armani2, armani1, armani3, armani4],
    ["Matte Black", "Dark Grey Tint"],
    "Sophisticated matte black frame with sharp geometric square lines for urban executive styling.",
    ["100% UV400 Protection", "Matte finish acetate", "Gradient dark grey lens", "EA authenticity card included"],
    "Classic"
  ),

  // --- HUSTLR ---
  item(
    "hustlr-blue-sky",
    "Hustlr",
    "Hustlr Blue Sky Square Sunglasses",
    2499,
    3499,
    4.5,
    [hustlr1, hustlr3, hustlr4, hustlr5, hustlr6],
    ["Blue", "Clear Grey"],
    "Ultra-lightweight square frames designed for modern streetwear and active all-day wear.",
    ["UV400 protection", "TR90 flexible frame material", "Impact & scratch-resistant lenses", "Unisex ergonomic fit"],
    "Trending"
  ),
  item(
    "hustlr-air-essentials",
    "Hustlr",
    "Hustlr Air Essentials Clear Grey Shades",
    2199,
    2999,
    4.6,
    [hustlr4, hustlr5, hustlr6, hustlr1, hustlr3],
    ["Clear Grey", "Translucent Blue"],
    "Light-as-air TR90 frames with subtle crystal grey finish and zero-distortion glare reduction.",
    ["TR90 featherlight polymer", "100% UV rays protection", "Non-slip nose support", "Includes protective pouch"],
    "Popular"
  ),
  item(
    "hustlr-full-rim",
    "Hustlr",
    "Hustlr Full Rim Streetwear Sunglasses",
    2799,
    3999,
    4.8,
    [hustlrFull, hustlr6, hustlr1, hustlr3, hustlr4],
    ["Matte Black", "Sky Blue Rim"],
    "Bold full-rim square frames engineered for sports, outdoor activities and daily street style.",
    ["Category 3 UV filter", "Full rim structural integrity", "Shatter-proof lenses", "Hard travel pouch included"],
    "New Arrival"
  ),

  // --- MICHAEL KORS ---
  item(
    "michael-kors-metal",
    "Michael Kors",
    "Michael Kors Metal Woman Sunglasses",
    11990,
    13990,
    4.7,
    [michaelCover, michael1, michael2, michael3, michael4, michael5],
    ["Gold", "Silver"],
    "High-fashion statement metal sunglasses featuring a polished gold-tone frame and gradient lenses.",
    ["100% UVA/UVB full spectrum protection", "Premium metal construction", "Gradient tinted lenses", "Signature Michael Kors hard case included"],
    "Best Seller"
  ),
  item(
    "michael-kors-gold-glam",
    "Michael Kors",
    "Michael Kors Gold Glamour Aviator",
    12990,
    14990,
    4.8,
    [michael1, michael2, michael4, michael5, michaelCover],
    ["Polished Gold", "Warm Brown Tint"],
    "Chic oversized metal frame adorned with gold chain temple motif and sunburst gradient lenses.",
    ["Full spectrum UV filter", "Gold-plated temple arm detail", "Adjustable nose pads", "Luxe leatherette case"],
    "Luxury"
  ),
  item(
    "michael-kors-gradient",
    "Michael Kors",
    "Michael Kors Rose Gold Gradient Shades",
    10490,
    12490,
    4.6,
    [michael3, michael5, michaelCover, michael2, michael1],
    ["Rose Gold", "Bronze Gradient"],
    "Romantic rose-gold metal frames paired with soft bronze gradient lenses for sun protection.",
    ["100% UV Protection", "Ultra-thin stainless steel frame", "Gradient brown lenses", "Includes MK polishing cloth"],
    "Sale"
  ),

  // --- RALPH LAUREN ---
  item(
    "ralph-lauren-injected",
    "Ralph Lauren",
    "Ralph Lauren Women Injected Sunglasses",
    7490,
    8990,
    4.6,
    [ralphCover, ralph1, ralph2, ralph3, ralph4, ralph5],
    ["Tortoise", "Black"],
    "Classic injected frame silhouette built with comfort fit and timeless preppy style.",
    ["UV protective optical lenses", "Injected acetate durable frame", "Ergonomic bridge support", "Includes protective microfiber pouch"],
    "Classic"
  ),
  item(
    "ralph-lauren-tortoise",
    "Ralph Lauren",
    "Ralph Lauren Tortoise Injected Frame",
    8290,
    9990,
    4.7,
    [ralph1, ralph3, ralph4, ralph5, ralphCover],
    ["Dark Havana", "Tortoise Shell"],
    "Iconic preppy tortoise shell frames finished with the Ralph Lauren logo script on temple arms.",
    ["100% UV Filter", "Injected lightweight acetate", "Glare-free coated lenses", "Ralph Lauren case included"],
    "Popular"
  ),
  item(
    "ralph-lauren-black",
    "Ralph Lauren",
    "Ralph Lauren Preppy Black Classic Shades",
    6990,
    8490,
    4.5,
    [ralph2, ralph5, ralphCover, ralph4, ralph1],
    ["Gloss Black", "Smoke Lens"],
    "Versatile gloss black injected sunglasses suitable for driving, travel, and sunny outings.",
    ["Category 3 UV sun protection", "Durable injected frame", "Comfortable temple tips", "Pouch included"],
    "Best Seller"
  ),

  // --- RAY-BAN ---
  item(
    "rayban-junior-sole",
    "Ray-Ban",
    "Ray-Ban Junior Sole Unisex Sunglasses",
    3752,
    4990,
    4.8,
    [raybanCover, rayban1, rayban2, rayban3, rayban4, rayban5],
    ["Black", "Blue"],
    "Iconic Ray-Ban styling crafted for junior and smaller unisex frame preferences with ultimate comfort.",
    ["100% UV protection lenses", "Signature metal hinge accents", "Lightweight hypoallergenic material", "Ray-Ban original pouch included"],
    "Popular"
  ),
  item(
    "rayban-aviator-black",
    "Ray-Ban",
    "Ray-Ban Classic Metal Black Sunglasses",
    4490,
    5990,
    4.9,
    [rayban1, rayban3, rayban4, rayban5, raybanCover],
    ["Black Metal", "G-15 Dark Green"],
    "Legendary aviator shape made with black metal wire frame and G-15 high-clarity lenses.",
    ["100% UV protection G-15 glass", "Metal wire construction", "Adjustable nose pads", "Original Ray-Ban box & cloth"],
    "Iconic"
  ),
  item(
    "rayban-blue-sole",
    "Ray-Ban",
    "Ray-Ban Blue Tinted Junior Sole Shades",
    3990,
    5290,
    4.7,
    [rayban5, rayban2, rayban4, raybanCover, rayban1],
    ["Electric Blue", "Gunmetal"],
    "Vibrant blue tinted lenses with lightweight gunmetal accents for energetic unisex appeal.",
    ["UV400 protection", "Anti-scratch coating", "Lightweight metal & TR90 hybrid", "Ray-Ban case included"],
    "Trending"
  ),

  // --- VERSACE ---
  item(
    "versace-signature",
    "Versace",
    "Versace Signature Medusa Sunglasses",
    14990,
    17990,
    4.9,
    [versace1, versace2, versace3, versace4, versace5, versace6, versace7],
    ["Black", "Havana"],
    "Unapologetic luxury frame with bold Medusa hardware accents and dark tinted high-contrast lenses.",
    ["100% UV400 maximum protection", "Handcrafted acetate frame", "Anti-scratch protective coating", "Luxury Versace velvet box & authenticity card"],
    "Exclusive"
  ),
  item(
    "versace-black-glam",
    "Versace",
    "Versace High-Fashion Black Frame Shades",
    16490,
    19990,
    4.9,
    [versace4, versace5, versace6, versace7, versace1],
    ["Jet Black", "Gold Medusa Emblem"],
    "High-impact jet black thick acetate frame decorated with 3D gold Medusa head hardware.",
    ["Italian handmade acetate", "100% UVA/UVB protection", "Dark tinted luxury lenses", "Hard shell case & cloth"],
    "Top Rated"
  ),
  item(
    "versace-shield-gold",
    "Versace",
    "Versace Gold Accent Shield Sunglasses",
    17990,
    21990,
    5.0,
    [versace6, versace7, versace1, versace3, versace5],
    ["Gold Shield", "Mirrored Black"],
    "Catwalk-ready gold accent shield sunglasses with rimless mirrored lenses and bold temple branding.",
    ["Mirrored 100% UV shield lens", "Gold-tone temple arms", "Non-allergenic nose pads", "Versace collector box included"],
    "Luxury"
  ),
  item(
    "versace-havana",
    "Versace",
    "Versace Havana Square Luxury Sunglasses",
    15490,
    18990,
    4.8,
    [versace3, versace5, versace7, versace2, versace4],
    ["Havana Brown", "Golden Medusa"],
    "Warm Havana square profile with dark brown lenses and signature Greek Key side accents.",
    ["100% UV Protection", "Premium Havana acetate", "Deep contrast tint", "Luxury case & authenticity plaque"],
    "New Arrival"
  ),

  // --- CLASSIC / SIMPLE ---
  item(
    "classic-uv-sunglass",
    "Classic Eyewear",
    "Classic UV Protected Everyday Sunglasses",
    1499,
    2499,
    4.5,
    [simpleSunglass],
    ["Matte Black", "Clear Frame"],
    "Essential everyday UV400 sunglasses with clean styling and comfortable lightweight fit.",
    ["UV400 lens protection", "Durable lightweight polycarbonate", "Comfort bridge", "Pouch included"],
    "Essential"
  ),
];

export const getSunglassesById = (id) => sunglasses.find((product) => product.id === id);
