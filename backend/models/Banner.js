const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide banner title'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide banner image URL'],
    trim: true
  },
  linkUrl: {
    type: String,
    trim: true,
    default: '/shop'
  },
  discountText: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', BannerSchema);
