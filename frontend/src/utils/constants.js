export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
