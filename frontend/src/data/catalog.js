import { onSaleProducts, getOnSaleProductById } from './onSaleProducts';
import { sunglasses, getSunglassesById } from './sunglasses';
import { shoes, getShoeById } from './shoes';
import { computers, getComputerById } from './computers';
import { mobiles, getMobileById } from './mobiles';
import { grocery, getGroceryById } from './grocery';
import { watches, getWatchById } from './watches';
import { fitness, getFitnessById } from './fitness';
import { furniture, getFurnitureById } from './furniture';
import { homeKitchen, getHomeKitchenById } from './homeKitchen';
import { magazines, getMagazineById } from './magazines';
import { mobileCovers, getMobileCoverById } from './mobileCovers';

const normalizeProduct = (item, categoryName = 'general') => ({
  ...item,
  id: String(item.id),
  category: (categoryName || item.category || 'general').toLowerCase(),
  image: item.images ? item.images[0] : item.img || item.image,
  images: Array.isArray(item.images) && item.images.length ? item.images : (item.img || item.image ? [item.img || item.image] : []),
  colors: Array.isArray(item.colors) && item.colors.length ? item.colors : ['Classic Black', 'White'],
  specifications: Array.isArray(item.specifications) && item.specifications.length ? item.specifications : ['Premium quality', 'Fast delivery', 'Easy returns'],
  description: item.description || `${item.title} is available in our catalog.`,
  warranty: item.warranty || '1 Year Warranty',
  sku: item.sku || `SKU-${item.id}`,
  badge: item.badge || 'Featured',
  rating: item.rating || 4.7,
  reviews: item.reviews || 120,
  brand: item.brand || 'Brand',
  price: item.price || 0,
  originalPrice: item.originalPrice || item.price || 0,
});

export const catalogProducts = [
  ...onSaleProducts.map((item) => normalizeProduct(item, item.category || 'sale')),
  ...sunglasses.map((item) => normalizeProduct(item, 'sunglasses')),
  ...shoes.map((item) => normalizeProduct(item, 'shoes')),
  ...computers.map((item) => normalizeProduct(item, 'electronics')),
  ...mobiles.map((item) => normalizeProduct(item, 'mobile')),
  ...grocery.map((item) => normalizeProduct(item, 'grocery')),
  ...watches.map((item) => normalizeProduct(item, 'watches')),
  ...fitness.map((item) => normalizeProduct(item, 'fitness')),
  ...furniture.map((item) => normalizeProduct(item, 'furniture')),
  ...homeKitchen.map((item) => normalizeProduct(item, 'homekitchen')),
  ...magazines.map((item) => normalizeProduct(item, 'magazines')),
  ...mobileCovers.map((item) => normalizeProduct(item, 'mobilecovers')),
];

export const getProductById = (id) => {
  const normalizedId = String(id);
  return (
    getOnSaleProductById(normalizedId) ||
    getSunglassesById(normalizedId) ||
    getShoeById(normalizedId) ||
    getComputerById(normalizedId) ||
    getMobileById(normalizedId) ||
    getGroceryById(normalizedId) ||
    getWatchById(normalizedId) ||
    getFitnessById(normalizedId) ||
    getFurnitureById(normalizedId) ||
    getHomeKitchenById(normalizedId) ||
    getMagazineById(normalizedId) ||
    getMobileCoverById(normalizedId) ||
    catalogProducts.find((product) => String(product.id) === normalizedId)
  );
};
