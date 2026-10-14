const formatHostUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") {
    return 'http://localhost:5000';
  }
  let url = rawUrl.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(url)) {
    url = url.startsWith("localhost") || url.startsWith("127.0.0.1")
      ? `http://${url}`
      : `https://${url}`;
  }
  return url.replace(/\/api$/, "");
};

export const API_URL = formatHostUrl(process.env.REACT_APP_API_URL);

export const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
  REFUNDED: 'Refunded'
};

export const PAYMENT_METHODS = {
  RAZORPAY: 'Razorpay',
  COD: 'COD',
  CARD: 'Card'
};
