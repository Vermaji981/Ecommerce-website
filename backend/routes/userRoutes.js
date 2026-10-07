const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress,
  getUsers,
  getUserById,
  updateUserStatus
} = require('../controllers/userController');

// Customer Protected Routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

// Admin Protected Routes
router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id/status', protect, adminOnly, updateUserStatus);

module.exports = router;
