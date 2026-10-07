import { onSaleProducts } from "./onSaleProducts";
import { sunglasses } from "./sunglasses";
import { shoes } from "./shoes";
import { computers } from "./computers";
import { mobiles } from "./mobiles";
import { grocery } from "./grocery";
import { watches } from "./watches";
import { fitness } from "./fitness";
import { furniture } from "./furniture";
import { homeKitchen } from "./homeKitchen";
import { magazines } from "./magazines";
import { mobileCovers } from "./mobileCovers";

const mapToProduct = (item, categoryName, linkPrefix) => ({
  id: item.id,
  title: item.title,
  brand: item.brand,
  price: item.price,
  originalPrice: item.originalPrice,
  category: (categoryName || item.category || "").toLowerCase(),
  img: item.images ? item.images[0] : item.img,
  link: `${linkPrefix}/${item.id}`,
  metadata: `${item.brand} · ${item.colors ? item.colors[0] : ""}`,
  badge: item.badge,
  rating: item.rating,
  reviews: item.reviews,
});

export const allProducts = [
  ...onSaleProducts.map((p) => mapToProduct(p, p.category, "/product")),
  ...sunglasses.map((item) => mapToProduct(item, "sunglasses", "/sunglasses")),
  ...shoes.map((item) => mapToProduct(item, "shoes", "/product")),
  ...computers.map((item) => mapToProduct(item, "electronics", "/product")),
  ...mobiles.map((item) => mapToProduct(item, "mobile", "/product")),
  ...grocery.map((item) => mapToProduct(item, "grocery", "/product")),
  ...watches.map((item) => mapToProduct(item, "watches", "/product")),
  ...fitness.map((item) => mapToProduct(item, "fitness", "/product")),
  ...furniture.map((item) => mapToProduct(item, "furniture", "/product")),
  ...homeKitchen.map((item) => mapToProduct(item, "homekitchen", "/product")),
  ...magazines.map((item) => mapToProduct(item, "magazines", "/product")),
  ...mobileCovers.map((item) => mapToProduct(item, "mobilecovers", "/product")),
];

export const searchProducts = (query) => {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return allProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      (product.brand && product.brand.toLowerCase().includes(q))
  );
};
