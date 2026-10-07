const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  getDashboardStats,
  getInventory,
  getSalesReports
} = require('../controllers/adminController');

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/inventory', protect, adminOnly, getInventory);
router.get('/reports', protect, adminOnly, getSalesReports);

module.exports = router;
