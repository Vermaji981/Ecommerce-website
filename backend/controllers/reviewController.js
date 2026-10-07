const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
exports.createProductReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide productId, rating, and comment' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment
    });

    // Recalculate product rating & number of reviews in MongoDB
    const allReviews = await Review.find({ product: productId });
    const numReviews = allReviews.length;
    const avgRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

    product.numReviews = numReviews;
    product.ratings = Number(avgRating.toFixed(1));
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review (Admin/Owner)
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate product ratings in MongoDB
    const allReviews = await Review.find({ product: productId });
    const numReviews = allReviews.length;
    const avgRating = numReviews > 0 ? allReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews : 0;

    await Product.findByIdAndUpdate(productId, {
      numReviews,
      ratings: Number(avgRating.toFixed(1))
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
