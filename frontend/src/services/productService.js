import {
  getProductsApi,
  getProductByIdApi,
  createProductApi,
  updateProductApi,
  deleteProductApi
} from "./api";

export const productService = {
  getProducts: async (params = {}) => {
    const response = await getProductsApi(params);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await getProductByIdApi(id);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await createProductApi(productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await updateProductApi(id, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await deleteProductApi(id);
    return response.data;
  }
};

export default productService;
