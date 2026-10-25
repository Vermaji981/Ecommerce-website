const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { logActivity } = require('../utils/activityLogger');

// @desc    Get dynamic admin dashboard statistics & calculated metrics from MongoDB
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // 1. Dynamic User counts
    const totalRegisteredUsers = await User.countDocuments({});
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalCustomers = await User.countDocuments({ role: { $in: ['customer', 'user', 'User'] } });
    const totalAdmins = await User.countDocuments({ role: { $in: ['admin', 'Admin'] } });

    // 2. Dynamic Product counts & inventory calculations
    let products = [];
    try {
      products = await Product.find({}).populate({ path: 'category', select: 'name', strictPopulate: false });
    } catch (e) {
      products = await Product.find({});
    }
    const totalProducts = products.length;

    let totalInventoryValue = 0;
    let totalStockCount = 0;
    const categoryBreakdown = {};

    products.forEach((p) => {
      const price = Number(p.price) || 0;
      const stock = p.stock !== undefined && p.stock !== null ? Number(p.stock) : 10;
      totalInventoryValue += price * stock;
      totalStockCount += stock;

      let catName = 'General';
      if (typeof p.category === 'object' && p.category !== null && p.category.name) {
        catName = p.category.name;
      } else if (typeof p.category === 'string' && p.category.trim()) {
        catName = p.category;
      } else if (p.catogries) {
        catName = String(p.catogries);
      }
      categoryBreakdown[catName] = (categoryBreakdown[catName] || 0) + 1;
    });

    const lowStockCount = products.filter((p) => {
      const st = p.stock !== undefined && p.stock !== null ? Number(p.stock) : 10;
      return st <= 5 && st > 0;
    }).length;

    const outOfStockCount = products.filter((p) => {
      const st = p.stock !== undefined && p.stock !== null ? Number(p.stock) : 0;
      return st === 0;
    }).length;

    const averagePrice =
      totalProducts > 0
        ? Math.round(products.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / totalProducts)
        : 0;

    // 3. Dynamic Order counts by specific statuses
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });
    const confirmedOrders = await Order.countDocuments({ orderStatus: 'Confirmed' });
    const outForDeliveryOrders = await Order.countDocuments({ orderStatus: 'Out for Delivery' });
    const returnedOrders = await Order.countDocuments({ orderStatus: 'Returned' });

    // 4. Dynamic Sales from verified successful payments (paymentStatus: 'Paid')
    const paidOrders = await Order.find({ paymentStatus: 'Paid' });
    const totalSales = paidOrders.reduce((acc, order) => acc + (Number(order.totalAmount) || 0), 0);

    // Today's & Monthly Sales from verified payments
    const todayPaidOrders = paidOrders.filter((order) => new Date(order.createdAt) >= todayStart);
    const todaysSales = todayPaidOrders.reduce((acc, order) => acc + (Number(order.totalAmount) || 0), 0);

    const monthlyPaidOrders = paidOrders.filter((order) => new Date(order.createdAt) >= monthStart);
    const monthlySales = monthlyPaidOrders.reduce((acc, order) => acc + (Number(order.totalAmount) || 0), 0);

    // Recent registered users (exclude password)
    const recentUsers = await User.find({})
      .select('-password -otp -otpExpire -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 })
      .limit(8);

    // Recent products
    let recentProducts = [];
    try {
      recentProducts = await Product.find({})
        .populate({ path: 'category', select: 'name', strictPopulate: false })
        .sort({ createdAt: -1 })
        .limit(8);
    } catch (e) {
      recentProducts = await Product.find({}).sort({ createdAt: -1 }).limit(8);
    }

    // Recent orders
    let recentOrders = [];
    try {
      recentOrders = await Order.find({})
        .populate({ path: 'user', select: 'name email phone', strictPopulate: false })
        .sort({ createdAt: -1 })
        .limit(6);
    } catch (e) {
      recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(6);
    }

    // Recent Activity logs
    const recentActivities = await ActivityLog.find({})
      .sort({ createdAt: -1 })
      .limit(8);

    const statsObj = {
      // Required Dashboard Statistics
      totalRegisteredUsers,
      activeUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      confirmedOrders,
      outForDeliveryOrders,
      returnedOrders,
      totalSales: Math.round(totalSales * 100) / 100,

      // Additional Inventory & User Insights
      totalRevenue: Math.round(totalSales * 100) / 100,
      todaysSales: Math.round(todaysSales * 100) / 100,
      monthlySales: Math.round(monthlySales * 100) / 100,
      totalCustomers,
      totalAdmins,
      totalUsers: totalRegisteredUsers,
      totalValue: Math.round(totalInventoryValue),
      totalStockCount,
      lowStockProducts: lowStockCount,
      outOfStockCount,
      averagePrice
    };

    res.status(200).json({
      success: true,
      stats: statsObj,
      // Root-level fields for backwards compatibility with UI
      totalRegisteredUsers,
      activeUsers,
      products: totalProducts,
      users: totalRegisteredUsers,
      orders: totalOrders,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalSales: Math.round(totalSales * 100) / 100,
      totalCustomers,
      totalAdmins,
      totalValue: Math.round(totalInventoryValue),
      totalStockCount,
      averagePrice,
      lowStockProducts: lowStockCount,
      outOfStockCount,
      categoryBreakdown,
      recentProducts,
      recentUsers,
      recentCustomers: recentUsers,
      recentOrders,
      recentActivities
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search, filter, pagination, order counts, and product counts
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAdminUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const query = {};

    // 1. Search by name, email, or exact ID
    if (req.query.search) {
      const searchStr = req.query.search.trim();
      const searchRegex = new RegExp(searchStr, 'i');
      if (mongoose.Types.ObjectId.isValid(searchStr)) {
        query.$or = [{ _id: searchStr }, { name: searchRegex }, { email: searchRegex }];
      } else {
        query.$or = [{ name: searchRegex }, { email: searchRegex }];
      }
    }

    // 2. Filter by account status
    if (req.query.status) {
      const statusLower = req.query.status.toLowerCase();
      if (statusLower === 'active') {
        query.isActive = true;
      } else if (statusLower === 'inactive' || statusLower === 'deactivated') {
        query.isActive = false;
      }
    }

    // 3. Filter by role
    if (req.query.role && req.query.role !== 'all') {
      query.role = req.query.role.toLowerCase();
    }

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -otp -otpExpire -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Dynamically calculate total orders and total products added for each user
    const userIds = users.map((u) => u._id);
    const userEmails = users.map((u) => u.email).filter(Boolean);

    // Fetch order counts
    const orders = await Order.find({
      $or: [{ user: { $in: userIds } }, { email: { $in: userEmails } }]
    }).select('user email totalAmount');

    // Fetch product counts added by users
    const products = await Product.find({
      createdBy: { $in: userIds }
    }).select('createdBy');

    const enrichedUsers = users.map((user) => {
      const userDoc = user.toObject();
      const userOrders = orders.filter(
        (o) =>
          (o.user && String(o.user) === String(user._id)) ||
          (o.email && user.email && o.email.toLowerCase() === user.email.toLowerCase())
      );
      const userProducts = products.filter(
        (p) => p.createdBy && String(p.createdBy) === String(user._id)
      );

      return {
        ...userDoc,
        totalOrders: userOrders.length,
        totalSpent: userOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0),
        totalProductsAdded: userProducts.length,
        lastActiveTime: userDoc.lastActive || userDoc.updatedAt || userDoc.createdAt
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      total: totalUsers,
      page,
      pages: Math.ceil(totalUsers / limit) || 1,
      users: enrichedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user details, order history & activity logs (Admin only)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getAdminUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -otp -otpExpire -resetPasswordToken -resetPasswordExpire'
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get order history for this user
    const orders = await Order.find({
      $or: [{ user: user._id }, { email: user.email }]
    }).sort({ createdAt: -1 });

    // Get activity history for this user
    const activities = await ActivityLog.find({
      $or: [{ user: user._id }, { userEmail: user.email }]
    })
      .sort({ createdAt: -1 })
      .limit(30);

    // Get products created by this user if any
    const productsCreated = await Product.find({ createdBy: user._id }).sort({ createdAt: -1 });

    const totalSpent = orders
      .filter((o) => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        totalOrders: orders.length,
        totalSpent,
        totalProductsAdded: productsCreated.length,
        lastActiveTime: user.lastActive || user.updatedAt || user.createdAt
      },
      orders,
      activities,
      productsCreated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate or Deactivate User Account (Admin only)
// @route   PATCH /api/admin/users/:id/status or PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Protect Super Admin account
    const adminEmail = (process.env.ADMIN_EMAIL || 'hv0563163@gmail.com').toLowerCase();
    if (user.email.toLowerCase() === adminEmail && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Super Admin account cannot be deactivated'
      });
    }

    const previousStatus = user.isActive;
    user.isActive = typeof isActive === 'boolean' ? isActive : !user.isActive;
    await user.save();

    // Record server-side activity log
    await logActivity({
      actionType: 'USER_STATUS_CHANGE',
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userRole: req.user.role,
      entityType: 'User',
      entityId: user._id.toString(),
      description: `User account "${user.name}" (${user.email}) was ${user.isActive ? 'ACTIVATED' : 'DEACTIVATED'} by admin ${req.user.name}`,
      metadata: {
        targetUserId: user._id,
        targetEmail: user.email,
        previousStatus,
        newStatus: user.isActive
      },
      req
    });

    res.status(200).json({
      success: true,
      message: `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Activity Logs with search, filters and date range
// @route   GET /api/admin/activity-logs
// @access  Private/Admin
exports.getActivityLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    // 1. Search query (description, activityId, userName, userEmail, entityId, orderId, productId)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [
        { activityId: searchRegex },
        { description: searchRegex },
        { userName: searchRegex },
        { userEmail: searchRegex },
        { orderId: searchRegex },
        { productId: searchRegex },
        { entityId: searchRegex }
      ];
    }

    // 2. Action Type filter
    if (req.query.actionType && req.query.actionType !== 'all') {
      query.actionType = req.query.actionType.toUpperCase();
    }

    // 3. User filter (by ObjectId or email)
    if (req.query.userId) {
      if (mongoose.Types.ObjectId.isValid(req.query.userId)) {
        query.user = req.query.userId;
      } else {
        query.userEmail = new RegExp(req.query.userId.trim(), 'i');
      }
    }

    // 4. Date Range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        const end = new Date(req.query.endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const totalLogs = await ActivityLog.countDocuments(query);
    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: logs.length,
      total: totalLogs,
      page,
      pages: Math.ceil(totalLogs / limit) || 1,
      logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders with search, filters, pagination for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAdminOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const query = {};

    // 1. Search by Order ID, customer name, email, or item title
    if (req.query.search) {
      const searchStr = req.query.search.trim();
      const searchRegex = new RegExp(searchStr, 'i');
      query.$or = [
        { orderId: searchRegex },
        { customerName: searchRegex },
        { email: searchRegex },
        { 'shippingAddress.fullName': searchRegex },
        { 'shippingAddress.email': searchRegex },
        { 'shippingAddress.city': searchRegex },
        { 'items.name': searchRegex },
        { 'items.title': searchRegex }
      ];
    }

    // 2. Filter by Order Status
    if (req.query.orderStatus && req.query.orderStatus !== 'all') {
      query.orderStatus = req.query.orderStatus;
    }

    // 3. Filter by Payment Status
    if (req.query.paymentStatus && req.query.paymentStatus !== 'all') {
      query.paymentStatus = req.query.paymentStatus;
    }

    // 4. Date range filter
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        const end = new Date(req.query.endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      total: totalOrders,
      page,
      pages: Math.ceil(totalOrders / limit) || 1,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details with status history (Admin)
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
exports.getAdminOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone role');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin-Controlled Order and Delivery Status update
// @route   PATCH /api/admin/orders/:id/status or PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateAdminOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, note } = req.body;

    const allowedOrderStatuses = [
      'Pending',
      'Confirmed',
      'Processing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
      'Returned'
    ];

    const allowedPaymentStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousOrderStatus = order.orderStatus;
    const previousPaymentStatus = order.paymentStatus;

    // Validate Order Status if provided
    if (orderStatus) {
      if (!allowedOrderStatuses.includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid order status "${orderStatus}". Allowed: ${allowedOrderStatuses.join(', ')}`
        });
      }

      // Record transition history
      order.orderStatus = orderStatus;

      order.statusHistory.push({
        status: orderStatus,
        previousStatus: previousOrderStatus,
        changedBy: req.user._id,
        changedByName: req.user.name || 'Admin',
        changedAt: new Date(),
        note: note ? String(note).trim() : `Status updated to ${orderStatus}`
      });

      if (orderStatus === 'Delivered') {
        order.deliveredAt = new Date();
      } else if (orderStatus === 'Cancelled') {
        order.cancelledAt = new Date();
        order.cancelReason = note || 'Cancelled by Admin';
      }
    }

    // Separate Payment Status update if provided (DO NOT tie automatically)
    if (paymentStatus) {
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment status "${paymentStatus}". Allowed: ${allowedPaymentStatuses.join(', ')}`
        });
      }
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    // Record Activity Log
    await logActivity({
      actionType: 'ORDER_STATUS_CHANGE',
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userRole: req.user.role,
      entityType: 'Order',
      entityId: order._id.toString(),
      orderId: order.orderId || order._id.toString(),
      description: `Order ${order.orderId || order._id} status changed from "${previousOrderStatus}" to "${order.orderStatus}" by ${req.user.name}`,
      metadata: {
        orderId: order.orderId,
        previousOrderStatus,
        newOrderStatus: order.orderStatus,
        previousPaymentStatus,
        newPaymentStatus: order.paymentStatus,
        note: note || ''
      },
      req
    });

    res.status(200).json({
      success: true,
      message: `Order status successfully updated to "${order.orderStatus}"`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Inventory details
// @route   GET /api/admin/inventory
// @access  Private/Admin
exports.getInventory = async (req, res, next) => {
  try {
    let products = [];
    try {
      products = await Product.find({})
        .populate({ path: 'category', select: 'name', strictPopulate: false })
        .sort({ stock: 1 });
    } catch (e) {
      products = await Product.find({}).sort({ stock: 1 });
    }

    const lowStock = products.filter((p) => p.stock <= 5 && p.stock > 0);
    const outOfStock = products.filter((p) => p.stock === 0);

    res.status(200).json({
      success: true,
      totalProducts: products.length,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Sales Reports
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getSalesReports = async (req, res, next) => {
  try {
    const orders = await Order.find({ paymentStatus: 'Paid' }).sort({ createdAt: 1 });

    const monthlyData = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { revenue: 0, orders: 0 };
      }
      monthlyData[monthYear].revenue += Number(order.totalAmount) || 0;
      monthlyData[monthYear].orders += 1;
    });

    const report = Object.keys(monthlyData).map((key) => ({
      period: key,
      revenue: Math.round(monthlyData[key].revenue * 100) / 100,
      orders: monthlyData[key].orders
    }));

    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
};
