const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  createPaymentOrder,
  verifyPayment
} = require('../controllers/paymentController');

// Optional Authentication Middleware (Supports both Logged-in Users & Guest Checkout)
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'shopkart_jwt_secret_key_production_ready_2026'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Proceed as guest checkout if token is invalid or expired
    }
  }
  next();
};

router.post('/create-order', optionalProtect, createPaymentOrder);
router.post('/verify', optionalProtect, verifyPayment);

module.exports = router;
