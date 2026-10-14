const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

// Initialize Razorpay Instance safely
const getRazorpayInstance = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && !process.env.RAZORPAY_KEY_ID.includes('your_key')) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return null;
};

// @desc    Create Razorpay Order / Process Direct Payment & Store in MongoDB
// @route   POST /api/payment/create-order
// @access  Public / Private
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const {
      amount,
      totalAmount,
      customerName,
      email,
      phone,
      shippingAddress,
      city,
      pincode,
      items,
      paymentMethod,
      currency = 'INR'
    } = req.body;

    const amountVal = Number(amount || totalAmount || 0);

    if (!amountVal || amountVal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment amount is required'
      });
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const transactionId = `TXN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required: You must be logged in to make a payment or place an order.'
      });
    }

    const formattedAddress = typeof shippingAddress === 'string'
      ? `${shippingAddress}, ${city || ''} ${pincode || ''}`
      : shippingAddress || `${city || ''} ${pincode || ''}`;

    // Create & Save Order in MongoDB Atlas
    const order = await Order.create({
      orderId,
      transactionId,
      user: req.user._id,
      customerName: customerName || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone || '',
      shippingAddress: formattedAddress,
      items: items || [],
      subtotal: amountVal,
      totalAmount: amountVal,
      paymentMethod: (paymentMethod || 'CARD').toUpperCase(),
      paymentStatus: (paymentMethod || '').toUpperCase() === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Confirmed'
    });

    const razorpay = getRazorpayInstance();

    if (razorpay) {
      const options = {
        amount: Math.round(amountVal * 100),
        currency,
        receipt: `receipt_${orderId}`
      };

      const razorpayOrder = await razorpay.orders.create(options);

      return res.status(200).json({
        success: true,
        message: 'Payment order created',
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        order
      });
    } else {
      // Instant Successful Payment Simulation & MongoDB Save
      return res.status(200).json({
        success: true,
        message: 'Payment processed successfully and order stored in MongoDB',
        orderId: order.orderId,
        transactionId: order.transactionId,
        amount: Math.round(amountVal * 100),
        currency,
        key: 'rzp_test_simulated_key',
        isSimulation: true,
        order
      });
    }
  } catch (error) {
    console.error('[Payment Error]:', error);
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Public / Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: 'Missing payment verification credentials' });
    }

    let isValidSignature = false;

    if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      isValidSignature = expectedSignature === razorpay_signature;
    } else {
      isValidSignature = true;
    }

    if (!isValidSignature) {
      if (dbOrderId) {
        await Order.findByIdAndUpdate(dbOrderId, { paymentStatus: 'Failed' });
      }
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature'
      });
    }

    if (dbOrderId) {
      await Order.findByIdAndUpdate(dbOrderId, {
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed',
        transactionId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    next(error);
  }
};
