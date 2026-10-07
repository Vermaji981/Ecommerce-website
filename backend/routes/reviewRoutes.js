const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProductReviews,
  createProductReview,
  deleteReview
} = require('../controllers/reviewController');

router.get('/:productId', getProductReviews);
router.post('/', protect, createProductReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
