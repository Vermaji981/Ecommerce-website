const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');

// @desc    Create new order (with backend price, stock & coupon validation)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      return res.status(400).json({ success: false, message: 'Please provide complete shipping address' });
    }

    let subtotal = 0;
    const validatedItems = [];

    // 1. Validate items (supports both MongoDB products & catalog items)
    for (const item of items) {
      let product = null;
      const prodId = item.productId || item.product || item.id || item._id;
      if (prodId && mongoose.Types.ObjectId.isValid(prodId)) {
        product = await Product.findById(prodId);
      }

      if (product && !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `Product ${product.name || ''} is no longer available`
        });
      }

      if (product && product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product "${product.name}". Only ${product.stock} left.`
        });
      }

      const unitPrice = product
        ? (product.discountPrice > 0 && product.discountPrice < product.price ? product.discountPrice : product.price)
        : Number(item.price || item.unitPrice || 0);

      const itemQty = Number(item.quantity || 1);
      const itemTotal = unitPrice * itemQty;
      subtotal += itemTotal;

      validatedItems.push({
        product: product ? product._id : prodId,
        productId: product ? product._id : prodId,
        name: product ? product.name : (item.name || item.title || 'Product'),
        title: product ? product.name : (item.name || item.title || 'Product'),
        image: product ? (product.images && product.images[0] ? product.images[0] : '') : (item.image || ''),
        price: unitPrice,
        quantity: itemQty
      });
    }

    // 2. Validate Coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && (!coupon.expiryDate || coupon.expiryDate > Date.now()) && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount > 0 && discount > coupon.maxDiscountAmount) {
            discount = coupon.maxDiscountAmount;
          }
        } else {
          discount = coupon.discountValue;
        }
        discount = Math.min(discount, subtotal);
        // Increment coupon used count
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    // 3. Shipping Charge calculation (Free above ₹999, else ₹50)
    const shippingCharge = subtotal - discount > 999 ? 0 : 50;
    const totalAmount = Math.max(0, subtotal - discount + shippingCharge);

    // 4. Create Order in MongoDB
    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      shippingAddress,
      subtotal,
      discount,
      shippingCharge,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      orderStatus: 'Confirmed',
      couponCode: couponCode || ''
    });

    // 5. Update Product Stock in MongoDB for real products
    for (const item of validatedItems) {
      if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    // 6. Clear user cart in MongoDB
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // 7. Send Order Confirmation Email
    sendEmail({
      email: req.user.email,
      subject: `My E-commerce Website Order Confirmation #${order._id}`,
      message: `Hello ${req.user.name},\n\nThank you for shopping with us! Your order #${order._id} has been placed successfully.\nTotal Amount: ₹${totalAmount}\nPayment Method: ${paymentMethod}\n\nWe will update you when your order ships!`
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure customer can only view their own order (unless admin)
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, transactionId } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
        order.paymentStatus = 'Paid';
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (transactionId) {
      order.transactionId = transactionId;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${order.orderStatus}`,
      order
    });
  } catch (error) {
    next(error);
  }
};
