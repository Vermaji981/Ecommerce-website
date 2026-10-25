const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
  {
    activityId: {
      type: String,
      index: true
    },
    actionType: {
      type: String,
      required: true,
      enum: [
        'USER_REGISTER',
        'USER_LOGIN',
        'USER_LOGOUT',
        'USER_STATUS_CHANGE',
        'PRODUCT_CREATE',
        'PRODUCT_UPDATE',
        'PRODUCT_DELETE',
        'ORDER_PLACE',
        'PAYMENT_SUCCESS',
        'PAYMENT_FAILED',
        'ORDER_STATUS_CHANGE',
        'ORDER_CANCEL'
      ],
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    userName: {
      type: String,
      default: 'System / Guest'
    },
    userEmail: {
      type: String,
      default: ''
    },
    userRole: {
      type: String,
      default: 'customer'
    },
    entityType: {
      type: String,
      enum: ['User', 'Product', 'Order', 'Payment', 'System'],
      default: 'System'
    },
    entityId: {
      type: String,
      default: ''
    },
    orderId: {
      type: String,
      default: ''
    },
    productId: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate activityId before saving if not present
ActivityLogSchema.pre('save', function (next) {
  if (!this.activityId) {
    this.activityId = `ACT-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;
  }
  next();
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
