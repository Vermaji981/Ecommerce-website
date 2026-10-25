const mongoose = require('mongoose');

const ApplicationPaymentSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      required: [true, 'Application Number is required'],
      trim: true,
      index: true
    },
    applicantName: {
      type: String,
      required: [true, 'Applicant Name is required'],
      trim: true
    },
    applicationType: {
      type: String,
      default: 'General Recruitment Examination 2026',
      trim: true
    },
    registrationDate: {
      type: String,
      default: () => new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    },
    category: {
      type: String,
      default: 'General / UR'
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
    fees: {
      applicationFee: { type: Number, default: 500 },
      processingFee: { type: Number, default: 25 },
      gst: { type: Number, default: 4.5 },
      totalAmount: { type: Number, required: true }
    },
    currency: {
      type: String,
      default: 'INR'
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'DEBIT_CARD', 'CREDIT_CARD', 'NET_BANKING', 'OTHER'],
      default: 'UPI'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Cancelled'],
      default: 'Pending',
      index: true
    },
    razorpayOrderId: {
      type: String,
      trim: true,
      default: ''
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      default: ''
    },
    razorpaySignature: {
      type: String,
      trim: true,
      default: ''
    },
    transactionId: {
      type: String,
      trim: true,
      default: ''
    },
    bankReferenceNumber: {
      type: String,
      trim: true,
      default: ''
    },
    failureReason: {
      type: String,
      default: ''
    },
    verifiedAt: {
      type: Date
    },
    user: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ApplicationPayment', ApplicationPaymentSchema);
