import api from "./api";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getInventoryStats = async () => {
  const response = await api.get("/admin/inventory");
  return response.data;
};

export const getAdminProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const updateOrderStatus = async (id, statusData) => {
  const response = await api.put(`/orders/${id}/status`, statusData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUserStatus = async (id, statusData) => {
  const response = await api.put(`/users/${id}/status`, statusData);
  return response.data;
};

export const getBanners = async () => {
  const response = await api.get("/banners");
  return response.data;
};

export const createBanner = async (bannerData) => {
  const response = await api.post("/banners", bannerData);
  return response.data;
};

export const updateBanner = async (id, bannerData) => {
  const response = await api.put(`/banners/${id}`, bannerData);
  return response.data;
};

export const deleteBanner = async (id) => {
  const response = await api.delete(`/banners/${id}`);
  return response.data;
};

export const getCoupons = async () => {
  const response = await api.get("/coupons");
  return response.data;
};

export const createCoupon = async (couponData) => {
  const response = await api.post("/coupons", couponData);
  return response.data;
};

export const deleteCoupon = async (id) => {
  const response = await api.delete(`/coupons/${id}`);
  return response.data;
};

export const getReviews = async (productId = "") => {
  const url = productId ? `/reviews/${productId}` : "/reviews";
  const response = await api.get(url);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};

const adminService = {
  getDashboardStats,
  getInventoryStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserStatus,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getCoupons,
  createCoupon,
  deleteCoupon,
  getReviews,
  deleteReview
};

export default adminService;
