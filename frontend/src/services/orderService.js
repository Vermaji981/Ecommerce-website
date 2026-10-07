import {
  createOrderApi,
  getMyOrdersApi,
  getOrderByIdApi,
  getAllAdminOrdersApi,
  updateOrderStatusApi
} from "./api";

export const orderService = {
  createOrder: async (orderData) => {
    const response = await createOrderApi(orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await getMyOrdersApi();
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await getOrderByIdApi(id);
    return response.data;
  },

  getAllAdminOrders: async () => {
    const response = await getAllAdminOrdersApi();
    return response.data;
  },

  updateOrderStatus: async (id, statusData) => {
    const response = await updateOrderStatusApi(id, statusData);
    return response.data;
  }
};

export default orderService;
