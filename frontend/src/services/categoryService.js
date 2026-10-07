import {
  getCategoriesApi,
  getCategoryByIdApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi
} from "./api";

export const categoryService = {
  getCategories: async () => {
    const response = await getCategoriesApi();
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await getCategoryByIdApi(id);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await createCategoryApi(categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await updateCategoryApi(id, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await deleteCategoryApi(id);
    return response.data;
  }
};

export default categoryService;
