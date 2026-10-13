const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  getDashboardStats,
  getInventory,
  getSalesReports
} = require('../controllers/adminController');
const {
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');

// Dashboard & Reports
router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/dashboard-stats', protect, adminOnly, getDashboardStats);
router.get('/inventory', protect, adminOnly, getInventory);
router.get('/reports', protect, adminOnly, getSalesReports);

// User Management via Admin route alias
router.get('/users', protect, adminOnly, getUsers);
router.get('/users/:id', protect, adminOnly, getUserById);
router.put('/users/:id/status', protect, adminOnly, updateUserStatus);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
