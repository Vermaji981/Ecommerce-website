const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const sendEmail = require('../utils/sendEmail');
const { logActivity } = require('../utils/activityLogger');

// @desc    Create new order (with backend price, stock & coupon validation)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, customerName, email, phone, city, state, postalCode, pincode, country } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // Helper to sanitize strings
    const cleanString = (val, maxLen = 200) => {
      if (!val || typeof val !== 'string') return '';
      return val.trim().replace(/<[^>]*>?/gm, '').slice(0, maxLen);
    };

    const rawAddress = (typeof shippingAddress === 'object' && shippingAddress !== null)
      ? shippingAddress
      : {};

    const enteredFullName = cleanString(customerName || rawAddress.fullName || rawAddress.name || req.body.name, 100);
    const enteredEmail = cleanString(email || rawAddress.email, 120);
    const enteredPhone = cleanString(phone || rawAddress.phone, 30);
    const enteredStreet = cleanString(typeof shippingAddress === 'string' ? shippingAddress : (rawAddress.street || rawAddress.address || ''), 300);
    const enteredCity = cleanString(city || rawAddress.city, 100);
    const enteredState = cleanString(state || rawAddress.state, 100);
    const enteredPostalCode = cleanString(postalCode || pincode || rawAddress.postalCode || rawAddress.pincode, 20);
    const enteredCountry = cleanString(country || rawAddress.country || 'India', 100);

    if (!enteredStreet) {
      return res.status(400).json({ success: false, message: 'Please provide complete delivery shipping address' });
    }

    // Do NOT use admin credentials as customer details under any circumstances
    const adminEmail = (process.env.ADMIN_EMAIL || 'hv0563163@gmail.com').toLowerCase();
    const isAdminUser = req.user && (
      req.user.role === 'admin' ||
      (req.user.email && req.user.email.toLowerCase() === adminEmail)
    );

    // Prioritize user-entered details; fallback to authenticated user only if NOT admin
    const finalCustomerName = enteredFullName || (!isAdminUser && req.user?.name ? req.user.name : 'Customer');
    const finalEmail = enteredEmail || (!isAdminUser && req.user?.email ? req.user.email : '');
    const finalPhone = enteredPhone || (!isAdminUser && req.user?.phone ? req.user.phone : '');

    const addressComponents = [
      enteredStreet,
      enteredCity,
      enteredState,
      enteredPostalCode,
      enteredCountry
    ].filter(Boolean);
    const formattedAddressStr = addressComponents.join(', ');

    const finalShippingAddress = {
      fullName: finalCustomerName,
      phone: finalPhone,
      email: finalEmail,
      street: enteredStreet,
      address: enteredStreet,
      city: enteredCity,
      state: enteredState,
      postalCode: enteredPostalCode,
      pincode: enteredPostalCode,
      country: enteredCountry,
      formattedAddress: formattedAddressStr
    };

    let subtotal = 0;
    const validatedItems = [];

    // 1. Validate items
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
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    // 3. Shipping Charge calculation
    const shippingCharge = subtotal - discount > 999 ? 0 : 50;
    const totalAmount = Math.max(0, subtotal - discount + shippingCharge);

    const initialOrderStatus = 'Confirmed';
    const initialPaymentStatus = (paymentMethod || '').toUpperCase() === 'COD' ? 'Pending' : 'Pending';

    // 4. Create Order in MongoDB with User-Entered Shipping Details
    const order = await Order.create({
      user: req.user._id,
      customerName: finalCustomerName,
      email: finalEmail,
      phone: finalPhone,
      items: validatedItems,
      shippingAddress: finalShippingAddress,
      subtotal,
      discount,
      shippingCharge,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: initialPaymentStatus,
      orderStatus: initialOrderStatus,
      couponCode: couponCode || '',
      statusHistory: [
        {
          status: initialOrderStatus,
          previousStatus: 'Pending',
          changedBy: req.user._id,
          changedByName: finalCustomerName || 'Customer',
          changedAt: new Date(),
          note: 'Order placed by customer via store checkout'
        }
      ]
    });

    // 5. Update Product Stock in MongoDB
    for (const item of validatedItems) {
      if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    // 6. Clear user cart in MongoDB
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // 7. Log Activity
    await logActivity({
      actionType: 'ORDER_PLACE',
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userRole: req.user.role,
      entityType: 'Order',
      entityId: order._id.toString(),
      orderId: order.orderId || order._id.toString(),
      description: `Customer ${req.user.name} placed order ${order.orderId || order._id} for ₹${totalAmount}`,
      metadata: {
        totalAmount,
        paymentMethod: order.paymentMethod,
        itemsCount: validatedItems.length
      },
      req
    });

    // 8. Send Order Confirmation Email
    sendEmail({
      email: req.user.email,
      subject: `My E-commerce Website Order Confirmation #${order.orderId || order._id}`,
      message: `Hello ${req.user.name},\n\nThank you for shopping with us! Your order #${order.orderId || order._id} has been placed successfully.\nTotal Amount: ₹${totalAmount}\nPayment Method: ${paymentMethod}\n\nWe will update you when your order ships!`
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
    const userEmail = (req.user.email || '').toLowerCase().trim();

    // Authenticated users strictly see orders associated with their account
    // or unassigned legacy orders with their verified email
    const query = req.user.role === 'admin'
      ? { user: req.user._id }
      : {
          $or: [
            { user: req.user._id },
            { user: null, email: userEmail }
          ]
        };

    const orders = await Order.find(query).sort({ createdAt: -1 });

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
    const userEmail = (req.user.email || '').toLowerCase().trim();
    const orderEmail = (order.email || '').toLowerCase().trim();
    const isOwner =
      (order.user && String(order.user._id || order.user) === String(req.user._id)) ||
      (!order.user && orderEmail && userEmail && orderEmail === userEmail);

    if (!isOwner && req.user.role !== 'admin') {
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

// @desc    Cancel order by customer (eligible only before shipping)
// @route   PATCH /api/orders/:id/cancel or PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isOwner =
      (order.user && String(order.user) === String(req.user._id)) ||
      (order.email && req.user.email && order.email.toLowerCase() === req.user.email.toLowerCase());

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    // Order cancellation rules: can only cancel if Pending or Confirmed
    if (!['Pending', 'Confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already "${order.orderStatus}". Orders can only be cancelled while Pending or Confirmed.`
      });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = 'Cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason || 'Cancelled by customer';

    order.statusHistory.push({
      status: 'Cancelled',
      previousStatus,
      changedBy: req.user._id,
      changedByName: req.user.name || 'Customer',
      changedAt: new Date(),
      note: reason ? String(reason).trim() : 'Cancelled by customer'
    });

    await order.save();

    // Restore stock in MongoDB
    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        const prodId = item.productId || item.product;
        if (prodId && mongoose.Types.ObjectId.isValid(prodId)) {
          await Product.findByIdAndUpdate(prodId, {
            $inc: { stock: Number(item.quantity) || 1 }
          });
        }
      }
    }

    // Log Activity
    await logActivity({
      actionType: 'ORDER_CANCEL',
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userRole: req.user.role,
      entityType: 'Order',
      entityId: order._id.toString(),
      orderId: order.orderId || order._id.toString(),
      description: `Order ${order.orderId || order._id} was cancelled by ${req.user.name}. Reason: ${order.cancelReason}`,
      metadata: {
        orderId: order.orderId,
        reason: order.cancelReason,
        previousStatus
      },
      req
    });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
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
    const { orderStatus, paymentStatus, note, transactionId } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.orderStatus;

    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        previousStatus,
        changedBy: req.user._id,
        changedByName: req.user.name || 'Admin',
        changedAt: new Date(),
        note: note || `Status changed to ${orderStatus}`
      });

      if (orderStatus === 'Delivered') {
        order.deliveredAt = new Date();
      } else if (orderStatus === 'Cancelled') {
        order.cancelledAt = new Date();
        order.cancelReason = note || 'Cancelled by admin';
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (transactionId) {
      order.transactionId = transactionId;
    }

    await order.save();

    await logActivity({
      actionType: 'ORDER_STATUS_CHANGE',
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userRole: req.user.role,
      entityType: 'Order',
      entityId: order._id.toString(),
      orderId: order.orderId || order._id.toString(),
      description: `Order ${order.orderId || order._id} status updated from "${previousStatus}" to "${order.orderStatus}" by ${req.user.name}`,
      metadata: {
        orderId: order.orderId,
        previousStatus,
        newStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        note: note || ''
      },
      req
    });

    res.status(200).json({
      success: true,
      message: `Order status updated to ${order.orderStatus}`,
      order
    });
  } catch (error) {
    next(error);
  }
};
