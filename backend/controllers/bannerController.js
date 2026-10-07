const Banner = require('../models/Banner');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
exports.getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({}).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: banners.length,
      banners
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get banner by ID
// @route   GET /api/banners/:id
// @access  Public
exports.getBannerById = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    res.status(200).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new banner
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, imageUrl, linkUrl, discountText, isActive, displayOrder } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Please provide title and imageUrl' });
    }

    const banner = await Banner.create({
      title,
      subtitle: subtitle || '',
      imageUrl,
      linkUrl: linkUrl || '/shop',
      discountText: discountText || '',
      isActive: typeof isActive === 'boolean' ? isActive : true,
      displayOrder: displayOrder || 0
    });

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = async (req, res, next) => {
  try {
    let banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
