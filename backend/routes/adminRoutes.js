const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  getDashboardStats,
  getAdminUsers,
  getAdminUserById,
  updateUserStatus,
  getActivityLogs,
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  getInventory,
  getSalesReports
} = require('../controllers/adminController');
const {
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// All admin routes require authentication & super admin role
router.use(protect);
router.use(adminOnly);

// 1. Dashboard & Reports
router.get('/dashboard', getDashboardStats);
router.get('/dashboard-stats', getDashboardStats);
router.get('/inventory', getInventory);
router.get('/reports', getSalesReports);

// 2. User Management
router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserById);
router.patch('/users/:id/status', updateUserStatus);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// 3. Activity Logs Monitoring
router.get('/activity-logs', getActivityLogs);

// 4. Order Management & Delivery Status Control
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.patch('/orders/:id/status', updateAdminOrderStatus);
router.put('/orders/:id/status', updateAdminOrderStatus);

// 5. Product Management
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
