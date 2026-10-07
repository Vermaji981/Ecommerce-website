import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi
} from "./api";

export const cartService = {
  getCart: async () => {
    const response = await getCartApi();
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await addToCartApi({ productId, quantity });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await updateCartItemApi(itemId, { quantity });
    return response.data;
  },

  removeCartItem: async (itemId) => {
    const response = await removeCartItemApi(itemId);
    return response.data;
  },

  clearCart: async () => {
    const response = await clearCartApi();
    return response.data;
  }
};

export default cartService;
