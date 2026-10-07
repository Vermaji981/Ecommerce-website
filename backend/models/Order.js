const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'User'
  },
  customerName: {
    type: String,
    trim: true,
    default: 'Customer'
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  items: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  shippingAddress: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  subtotal: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  shippingCharge: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    default: 'CARD'
  },
  paymentStatus: {
    type: String,
    default: 'Paid'
  },
  transactionId: {
    type: String,
    default: ''
  },
  razorpayOrderId: {
    type: String,
    default: ''
  },
  orderStatus: {
    type: String,
    default: 'Confirmed'
  },
  couponCode: {
    type: String,
    default: ''
  },
  deliveredAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
