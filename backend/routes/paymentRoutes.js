const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/authMiddleware');
const {
  createPaymentOrder,
  verifyPayment,
  getApplicationFeeDetails,
  createApplicationFeeOrder,
  verifyApplicationFeePayment,
  recordApplicationFeeFailure
} = require('../controllers/paymentController');

// Standard E-Commerce Checkout / Orders
router.post('/create-order', optionalAuth, createPaymentOrder);
router.post('/verify', optionalAuth, verifyPayment);

// Government Application Form Fee Payment Desk Routes
router.get('/application/:appNumber', optionalAuth, getApplicationFeeDetails);
router.post('/application/create-order', optionalAuth, createApplicationFeeOrder);
router.post('/application/verify', optionalAuth, verifyApplicationFeePayment);
router.post('/application/failure', optionalAuth, recordApplicationFeeFailure);

module.exports = router;
