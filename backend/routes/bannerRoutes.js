const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/bannerController');

// Public Routes
router.get('/', getBanners);
router.get('/:id', getBannerById);

// Admin Protected Routes
router.post('/', protect, adminOnly, createBanner);
router.put('/:id', protect, adminOnly, updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

module.exports = router;
