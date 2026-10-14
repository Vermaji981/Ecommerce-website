const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    customId: {
      type: String,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price must be non-negative']
    },
    category: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Category',
      required: [true, 'Product category is required']
    },
    catogries: {
      type: String,
      default: 'General'
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    images: {
      type: [String],
      required: [true, 'At least one product image URL is required'],
      validate: [val => val.length > 0, 'Please provide at least one image URL']
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 10
    },
    SKU: {
      type: String,
      required: [true, 'Product SKU is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    ratings: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    rating: {
      type: Number,
      default: 4.5
    },
    numReviews: {
      type: Number,
      default: 12
    },
    reviews: {
      type: Number,
      default: 12
    },
    badge: {
      type: String,
      default: 'Featured'
    },
    warranty: {
      type: String,
      default: '1 Year Brand Warranty'
    },
    specifications: {
      type: [String],
      default: ['100% Authentic Quality', 'Fast Express Dispatch', '30-Day Easy Replacement']
    },
    colors: {
      type: [String],
      default: ['Classic Black', 'Silver']
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Virtual field to get final effective selling price
ProductSchema.virtual('finalPrice').get(function () {
  return this.discountPrice > 0 && this.discountPrice < this.price
    ? this.discountPrice
    : this.price;
});

module.exports = mongoose.model('Product', ProductSchema);
