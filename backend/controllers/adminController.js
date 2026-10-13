const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

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

    // Fetch all products for dynamic live calculation
    let products = [];
    try {
      products = await Product.find({}).populate({ path: 'category', select: 'name', strictPopulate: false });
    } catch (e) {
      products = await Product.find({});
    }
    const totalProducts = products.length;

    // Live Product Calculations: Inventory Value, Total Stock, Category Breakdown
    let totalInventoryValue = 0;
    let totalStockCount = 0;
    const categoryBreakdown = {};

    products.forEach(p => {
      const price = Number(p.price) || 0;
      const stock = p.stock !== undefined && p.stock !== null ? Number(p.stock) : 10;
      totalInventoryValue += price * stock;
      totalStockCount += stock;

      let catName = "General";
      if (typeof p.category === 'object' && p.category !== null && p.category.name) {
        catName = p.category.name;
      } else if (typeof p.category === 'string' && p.category.trim()) {
        catName = p.category;
      } else if (p.catogries) {
        catName = String(p.catogries);
      }
      categoryBreakdown[catName] = (categoryBreakdown[catName] || 0) + 1;
    });

    const lowStockCount = products.filter(p => {
      const st = p.stock !== undefined && p.stock !== null ? Number(p.stock) : 10;
      return st <= 5 && st > 0;
    }).length;

    const outOfStockCount = products.filter(p => {
      const st = p.stock !== undefined && p.stock !== null ? Number(p.stock) : 0;
      return st === 0;
    }).length;

    const averagePrice = totalProducts > 0
      ? Math.round(products.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / totalProducts)
      : 0;

    // Registered Users Calculations
    const totalUsers = await User.countDocuments({});
    const totalCustomers = await User.countDocuments({ role: { $in: ['customer', 'user', 'User'] } });
    const totalAdmins = await User.countDocuments({ role: { $in: ['admin', 'Admin'] } });

    // Registered Users list for dashboard display (latest 8)
    const recentUsers = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(8);

    // Recent Products added list (latest 8)
    let recentProducts = [];
    try {
      recentProducts = await Product.find({})
        .populate({ path: 'category', select: 'name', strictPopulate: false })
        .sort({ createdAt: -1 })
        .limit(8);
    } catch (e) {
      recentProducts = await Product.find({})
        .sort({ createdAt: -1 })
        .limit(8);
    }

    // Orders & Sales calculations
    const totalOrders = await Order.countDocuments({});
    const pendingOrdersCount = await Order.countDocuments({ orderStatus: 'Pending' });
    const deliveredOrdersCount = await Order.countDocuments({ orderStatus: 'Delivered' });

    const completedOrders = await Order.find({
      orderStatus: { $ne: 'Cancelled' }
    });

    const totalRevenue = completedOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    const todayOrders = completedOrders.filter(
      order => new Date(order.createdAt) >= todayStart
    );
    const todaysSales = todayOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    const monthlyOrders = completedOrders.filter(
      order => new Date(order.createdAt) >= monthStart
    );
    const monthlySales = monthlyOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    let recentOrders = [];
    try {
      recentOrders = await Order.find({})
        .populate({ path: 'user', select: 'name email', strictPopulate: false })
        .sort({ createdAt: -1 })
        .limit(5);
    } catch (e) {
      recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);
    }

    const statsObj = {
      totalRevenue,
      todaysSales,
      monthlySales,
      totalOrders,
      pendingOrders: pendingOrdersCount,
      deliveredOrders: deliveredOrdersCount,
      totalCustomers,
      totalAdmins,
      totalUsers,
      totalProducts,
      totalValue: Math.round(totalInventoryValue),
      totalStockCount,
      lowStockProducts: lowStockCount,
      outOfStockCount,
      averagePrice
    };

    res.status(200).json({
      success: true,
      stats: statsObj,
      // Root-level fields for easy direct access
      products: totalProducts,
      users: totalUsers,
      totalCustomers,
      totalAdmins,
      totalValue: Math.round(totalInventoryValue),
      totalStockCount,
      averagePrice,
      orders: totalOrders,
      lowStockProducts: lowStockCount,
      outOfStockCount,
      categoryBreakdown,
      recentProducts,
      recentUsers,
      recentCustomers: recentUsers,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Inventory details (Track stock & low stock alerts)
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
    } // Lowest stock first

    const lowStock = products.filter(p => p.stock <= 5 && p.stock > 0);
    const outOfStock = products.filter(p => p.stock === 0);

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

// @desc    Get Sales Reports (Daily, Monthly, Yearly breakdown)
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getSalesReports = async (req, res, next) => {
  try {
    const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } })
      .sort({ createdAt: 1 });

    // Group sales by month
    const monthlyData = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { revenue: 0, orders: 0 };
      }
      monthlyData[monthYear].revenue += order.totalAmount || 0;
      monthlyData[monthYear].orders += 1;
    });

    const report = Object.keys(monthlyData).map(key => ({
      period: key,
      revenue: monthlyData[key].revenue,
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
