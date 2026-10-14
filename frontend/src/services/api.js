import axios from "axios";
import { sunglasses } from "../data/sunglasses";
import { watches } from "../data/watches";
import { shoes } from "../data/shoes";
import { mobiles } from "../data/mobiles";
import { computers } from "../data/computers";
import { fitness } from "../data/fitness";
import { furniture } from "../data/furniture";
import { grocery } from "../data/grocery";
import { homeKitchen } from "../data/homeKitchen";
import { magazines } from "../data/magazines";
import { mobileCovers } from "../data/mobileCovers";
import { onSaleProducts } from "../data/onSaleProducts";
import { allProducts as staticProducts } from "../data/products";
import { catalogProducts } from "../data/catalog";

const formatApiUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") {
    return "http://localhost:5000/api";
  }
  let url = rawUrl.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(url)) {
    url = url.startsWith("localhost") || url.startsWith("127.0.0.1")
      ? `http://${url}`
      : `https://${url}`;
  }
  return url.endsWith("/api") ? url : `${url}/api`;
};

const API_BASE_URL = formatApiUrl(process.env.REACT_APP_API_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Helper function to extract and format all static products
const getAllStaticProducts = () => {
  const allStatic = [
    ...(Array.isArray(sunglasses) ? sunglasses : []),
    ...(Array.isArray(watches) ? watches : []),
    ...(Array.isArray(shoes) ? shoes : []),
    ...(Array.isArray(mobiles) ? mobiles : []),
    ...(Array.isArray(computers) ? computers : []),
    ...(Array.isArray(fitness) ? fitness : []),
    ...(Array.isArray(furniture) ? furniture : []),
    ...(Array.isArray(grocery) ? grocery : []),
    ...(Array.isArray(homeKitchen) ? homeKitchen : []),
    ...(Array.isArray(magazines) ? magazines : []),
    ...(Array.isArray(mobileCovers) ? mobileCovers : []),
    ...(Array.isArray(onSaleProducts) ? onSaleProducts : []),
    ...(Array.isArray(staticProducts) ? staticProducts : []),
    ...(Array.isArray(catalogProducts) ? catalogProducts : []),
  ];

  return allStatic.map((p) => {
    const pId = p.id || p._id;
    const pTitle = p.title || p.name || "Product Title";
    const pImage = p.image || p.img || (Array.isArray(p.images) && p.images[0]) || "";
    const pImages = Array.isArray(p.images) && p.images.length ? p.images : [pImage].filter(Boolean);
    return {
      ...p,
      id: pId,
      _id: p._id || pId,
      title: pTitle,
      name: pTitle,
      image: pImage,
      img: pImage,
      images: pImages,
      price: Number(p.price) || 0,
      originalPrice: Number(p.originalPrice) || (p.price ? Math.round(p.price * 1.25) : 0),
      rating: p.rating || 4.7,
      reviews: p.reviews || 120,
      badge: p.badge || "Featured",
      brand: p.brand || "Brand",
      category: typeof p.category === "object" && p.category !== null
        ? (p.category.name || "General")
        : (p.category || p.catogries || "General"),
      description: p.description || `${pTitle} - Premium quality item with fast express shipping.`,
      specifications: Array.isArray(p.specifications) && p.specifications.length > 0
        ? p.specifications
        : ["100% Authentic Quality", "Fast Express Dispatch", "30-Day Easy Replacement"],
      sku: p.sku || `SKU-${pId}`,
      warranty: p.warranty || "1 Year Brand Warranty",
      colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : ["Classic Black", "White"]
    };
  });
};

// Interceptor to attach JWT token to every outgoing request automatically
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
    const regularToken = localStorage.getItem("token");
    const isAdminEndpoint = config.url && (config.url.startsWith('/admin') || config.url.startsWith('/users') || config.url.startsWith('/banners'));

    const tokenToUse = (isAdminEndpoint && adminToken) ? adminToken : (regularToken || adminToken);
    if (tokenToUse) {
      config.headers.Authorization = `Bearer ${tokenToUse}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// --- Individual Named Export Functions ---

// Authentication APIs
export const registerUserApi = (userData) => api.post("/auth/register", userData);
export const loginUserApi = (credentials) => api.post("/auth/login", credentials);
export const verifyOtpApi = (data) => api.post("/auth/verify-otp", data);
export const forgotPasswordApi = (data) => api.post("/auth/forgot-password", data);
export const resetPasswordApi = (data) => api.post("/auth/reset-password", data);

// User Profile APIs
export const getUserProfileApi = () => api.get("/users/profile");
export const updateUserProfileApi = (profileData) => api.put("/users/profile", profileData);
export const addAddressApi = (addressData) => api.post("/users/addresses", addressData);
export const deleteAddressApi = (addressId) => api.delete(`/users/addresses/${addressId}`);

// Products APIs
export const getProductsApi = (params = {}) => api.get("/products", { params: { limit: 200, ...params } });
export const getProductByIdApi = (id) => api.get(`/products/${id}`);
export const createProductApi = (productData) => api.post("/products", productData);
export const updateProductApi = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProductApi = (id) => api.delete(`/products/${id}`);

// Categories APIs
export const getCategoriesApi = () => api.get("/categories");
export const getCategoryByIdApi = (id) => api.get(`/categories/${id}`);
export const createCategoryApi = (categoryData) => api.post("/categories", categoryData);
export const updateCategoryApi = (id, categoryData) => api.put(`/categories/${id}`, categoryData);
export const deleteCategoryApi = (id) => api.delete(`/categories/${id}`);

// Cart APIs
export const getCartApi = () => api.get("/cart");
export const addToCartApi = (data) => api.post("/cart", data);
export const updateCartItemApi = (itemId, data) => api.put(`/cart/${itemId}`, data);
export const removeCartItemApi = (itemId) => api.delete(`/cart/${itemId}`);
export const clearCartApi = () => api.delete("/cart");

// Orders APIs
export const createOrderApi = (orderData) => api.post("/orders", orderData);
export const getMyOrdersApi = () => api.get("/orders/my-orders");
export const getOrderByIdApi = (id) => api.get(`/orders/${id}`);

// Coupons APIs
export const applyCouponApi = (data) => api.post("/coupons/apply", data);
export const getCouponsApi = () => api.get("/coupons");
export const createCouponApi = (couponData) => api.post("/coupons", couponData);
export const updateCouponApi = (id, couponData) => api.put(`/coupons/${id}`, couponData);
export const deleteCouponApi = (id) => api.delete(`/coupons/${id}`);

// Reviews APIs
export const getProductReviewsApi = (productId) => api.get(`/reviews/${productId}`);
export const createReviewApi = (reviewData) => api.post("/reviews", reviewData);
export const deleteReviewApi = (id) => api.delete(`/reviews/${id}`);

// Payment APIs
export const createPaymentOrderApi = (paymentData) => api.post("/payment/create-order", paymentData);
export const verifyPaymentApi = (verificationData) => api.post("/payment/verify", verificationData);

// Admin Dashboard & Management APIs
export const getAdminDashboardStatsApi = () => api.get("/admin/dashboard");
export const getAdminInventoryApi = () => api.get("/admin/inventory");
export const getAdminSalesReportsApi = () => api.get("/admin/reports");
export const getAllAdminOrdersApi = () => api.get("/orders");
export const updateOrderStatusApi = (id, statusData) => api.put(`/orders/${id}/status`, statusData);
export const getAllAdminUsersApi = () => api.get("/users");
export const updateUserStatusApi = (id, statusData) => api.put(`/users/${id}/status`, statusData);

// Banners APIs
export const getBannersApi = () => api.get("/banners");
export const createBannerApi = (bannerData) => api.post("/banners", bannerData);
export const updateBannerApi = (id, bannerData) => api.put(`/banners/${id}`, bannerData);
export const deleteBannerApi = (id) => api.delete(`/banners/${id}`);

// Offers (Coupons) APIs
export const getOffersApi = () => api.get("/coupons");
export const createOfferApi = (offerData) => api.post("/coupons", offerData);
export const updateOfferApi = (id, offerData) => api.put(`/coupons/${id}`, offerData);
export const deleteOfferApi = (id) => api.delete(`/coupons/${id}`);

// --- Attach Helper Methods Directly to `api` Object ---

api.getProducts = async (params = {}) => {
  let backendProducts = [];
  try {
    const res = await getProductsApi(params);
    const raw = res.data?.products || res.data || [];
    if (Array.isArray(raw) && raw.length > 0) {
      backendProducts = raw.map((p) => ({
        ...p,
        id: p._id || p.id,
        _id: p._id || p.id,
        title: p.title || p.name,
        name: p.name || p.title,
        image: p.image || p.img || (Array.isArray(p.images) && p.images[0]) || "",
        img: p.img || p.image || (Array.isArray(p.images) && p.images[0]) || "",
        images: Array.isArray(p.images) && p.images.length ? p.images : [p.image || p.img].filter(Boolean),
        category: typeof p.category === "object" && p.category !== null
          ? (p.category.name || "General")
          : (p.category || p.catogries || "General")
      }));
      return backendProducts;
    }
  } catch (error) {
    console.warn("Backend products API fallback notice:", error?.message);
  }

  // Fallback to static catalog only if backend is unreachable
  const staticProducts = getAllStaticProducts();

  if (params.search) {
    const queryStr = String(params.search).trim().toLowerCase();
    const words = queryStr.split(/\s+/).filter(Boolean);

    const matchesItem = (p) => {
      const fullText = [
        p.title,
        p.name,
        p.category,
        p.brand,
        p.description,
        p.badge,
        p.sku,
        Array.isArray(p.specifications) ? p.specifications.join(" ") : "",
        Array.isArray(p.colors) ? p.colors.join(" ") : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (fullText.includes(queryStr)) return true;
      return words.length > 0 && words.every((w) => fullText.includes(w));
    };

    return staticProducts.filter(matchesItem);
  }

  return staticProducts;
};

api.getProductById = async (id) => {
  if (!id) return null;
  const targetId = String(id);

  // 1. Try fetching from Backend API endpoint directly
  try {
    const res = await getProductByIdApi(id);
    const p = res.data?.product || res.data;
    if (p && (p._id || p.id)) {
      return {
        ...p,
        id: p._id || p.id,
        _id: p._id || p.id,
        title: p.title || p.name,
        name: p.name || p.title,
        image: p.image || p.img || (Array.isArray(p.images) && p.images[0]) || "",
        img: p.img || p.image || (Array.isArray(p.images) && p.images[0]) || "",
        images: Array.isArray(p.images) && p.images.length ? p.images : [p.image || p.img].filter(Boolean),
        category: typeof p.category === "object" && p.category !== null
          ? (p.category.name || "General")
          : (p.category || p.catogries || "General")
      };
    }
  } catch (error) {
    console.warn("Direct product fetch notice:", error?.message);
  }

  // 2. Try fetching from Backend Products List
  try {
    const allBackend = await api.getProducts();
    const foundBackend = allBackend.find((p) => String(p._id || p.id) === targetId);
    if (foundBackend) return foundBackend;
  } catch (e) {
    console.warn("Backend products search notice:", e?.message);
  }

  // 3. Fallback: Search all local static catalog products
  const staticItems = getAllStaticProducts();
  const foundStatic = staticItems.find((p) => String(p.id) === targetId || String(p._id) === targetId);
  if (foundStatic) return foundStatic;

  return null;
};

api.createProduct = async (productData) => {
  const res = await createProductApi(productData);
  return res.data;
};

api.updateProduct = async (id, productData) => {
  const res = await updateProductApi(id, productData);
  return res.data;
};

api.deleteProduct = async (id) => {
  const res = await deleteProductApi(id);
  return res.data;
};

api.loginUser = async (credentials) => {
  const res = await loginUserApi(credentials);
  return res.data;
};

api.registerUser = async (userData) => {
  const res = await registerUserApi(userData);
  return res.data;
};

api.getUserProfile = async () => {
  try {
    const res = await getUserProfileApi();
    return res.data?.user || res.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

api.updateUserProfile = async (profileData) => {
  const res = await updateUserProfileApi(profileData);
  return res.data;
};

api.getOrders = async () => {
  try {
    const res = await getMyOrdersApi();
    return res.data?.orders || res.data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

api.processPayment = async (payload) => {
  const res = await createPaymentOrderApi(payload);
  return res.data;
};

api.getCategories = async () => {
  try {
    const res = await getCategoriesApi();
    return res.data?.categories || res.data || [];
  } catch (error) {
    return [];
  }
};

export default api;

