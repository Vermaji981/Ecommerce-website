const mongoose = require('mongoose');

const StatusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: [
      'Pending',
      'Confirmed',
      'Processing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
      'Returned'
    ]
  },
  previousStatus: {
    type: String,
    default: ''
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  changedByName: {
    type: String,
    default: 'System'
  },
  changedAt: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  }
}, { _id: true });

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    trim: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  customerName: {
    type: String,
    trim: true,
    default: 'Customer'
  },
  email: {
    type: String,
    trim: true,
    default: '',
    index: true
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
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
    index: true
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
    enum: [
      'Pending',
      'Confirmed',
      'Processing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
      'Returned'
    ],
    default: 'Pending',
    index: true
  },
  statusHistory: [StatusHistorySchema],
  couponCode: {
    type: String,
    default: ''
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelReason: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Auto-generate orderId if not provided
OrderSchema.pre('save', function (next) {
  if (!this.orderId) {
    this.orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);

