const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// @desc    Get all products (with Search, Filter, Sort, Pagination)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    // 1. Search Query (Name or Description or Brand)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex }
      ];
    }

    // 2. Category Filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // 3. Brand Filter
    if (req.query.brand) {
      query.brand = new RegExp(req.query.brand, 'i');
    }

    // 4. Featured Filter
    if (req.query.isFeatured === 'true') {
      query.isFeatured = true;
    }

    // 5. In Stock Filter
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // 6. Price Range Filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // 7. Rating Filter
    if (req.query.rating) {
      query.ratings = { $gte: Number(req.query.rating) };
    }

    // Sorting options
    let sortOptions = { createdAt: -1 }; // Default: Newest first
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sortOptions = { price: 1 };
          break;
        case 'price_desc':
          sortOptions = { price: -1 };
          break;
        case 'rating':
          sortOptions = { ratings: -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    }

// Helper function to safely resolve categories without CastError
const resolveCategoriesForProducts = async (products) => {
  if (!Array.isArray(products) || products.length === 0) return [];
  
  const categories = await Category.find({}).lean();
  const catMap = new Map();
  categories.forEach(c => {
    catMap.set(String(c._id), { _id: c._id, name: c.name, slug: c.slug });
    if (c.slug) catMap.set(c.slug.toLowerCase(), { _id: c._id, name: c.name, slug: c.slug });
    if (c.name) catMap.set(c.name.toLowerCase(), { _id: c._id, name: c.name, slug: c.slug });
  });

  return products.map(p => {
    const doc = p && typeof p.toObject === 'function' ? p.toObject() : { ...p };
    if (typeof doc.category === 'object' && doc.category !== null && doc.category.name) {
      return doc;
    }
    const catVal = doc.category || doc.catogries;
    if (catVal) {
      const found = catMap.get(String(catVal)) || catMap.get(String(catVal).toLowerCase());
      if (found) {
        doc.category = found;
      } else {
        doc.category = {
          _id: mongoose.Types.ObjectId.isValid(catVal) ? catVal : undefined,
          name: typeof catVal === 'string' ? (catVal.charAt(0).toUpperCase() + catVal.slice(1)) : 'General',
          slug: typeof catVal === 'string' ? catVal.toLowerCase() : 'general'
        };
      }
    } else {
      doc.category = { name: 'General', slug: 'general' };
    }
    return doc;
  });
};

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    let products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    try {
      products = await Product.populate(products, { path: 'category', select: 'name slug', strictPopulate: false });
    } catch (e) {
      // Safe fallback if raw populate fails
    }

    const formattedProducts = await resolveCategoriesForProducts(products);

    res.status(200).json({
      success: true,
      count: formattedProducts.length,
      totalProducts,
      page,
      totalPages,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      products: formattedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    let product = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      product = await Product.findById(req.params.id);
    } else {
      product = await Product.findOne({ SKU: req.params.id.toUpperCase() });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const [formatted] = await resolveCategoriesForProducts([product]);
    res.status(200).json({
      success: true,
      product: formatted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { name, title, description, price, originalPrice, discountPrice, category, catogries, brand, images, image, img, stock, SKU, sku, isFeatured } = req.body;

    const productName = (name || title || '').trim();
    const productPrice = Number(price || 0);
    const productCategory = (category || catogries || 'general').trim();
    const productBrand = (brand || 'General').trim();
    const productDesc = (description || `${productName} - High quality e-commerce product.`).trim();
    const productStock = stock !== undefined && stock !== null && stock !== '' ? Number(stock) : 10;
    
    let rawImages = Array.isArray(images) && images.length > 0 ? images : [image || img].filter(Boolean);
    if (rawImages.length === 0) {
      rawImages = ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'];
    }

    const productSKU = (SKU || sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`).toString().toUpperCase();

    if (!productName || !productPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Product Name and Price'
      });
    }

    const existingSKU = await Product.findOne({ SKU: productSKU });
    let finalSKU = productSKU;
    if (existingSKU) {
      finalSKU = `${productSKU}-${Math.floor(Math.random() * 1000)}`;
    }

    let resolvedCategory = productCategory;
    if (!mongoose.Types.ObjectId.isValid(productCategory)) {
      try {
        let catDoc = await Category.findOne({
          $or: [
            { name: new RegExp(`^${productCategory}$`, 'i') },
            { slug: productCategory.toLowerCase() }
          ]
        });
        if (!catDoc) {
          catDoc = await Category.create({
            name: productCategory.charAt(0).toUpperCase() + productCategory.slice(1),
            slug: productCategory.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            description: `${productCategory} Category`
          });
        }
        resolvedCategory = catDoc._id;
      } catch (e) {
        resolvedCategory = productCategory;
      }
    }

    const product = await Product.create({
      name: productName,
      title: productName,
      description: productDesc,
      price: productPrice,
      originalPrice: Number(originalPrice || productPrice),
      discountPrice: discountPrice || 0,
      category: resolvedCategory,
      catogries: productCategory,
      brand: productBrand,
      image: rawImages[0],
      img: rawImages[0],
      images: rawImages,
      stock: productStock,
      SKU: finalSKU,
      isFeatured: isFeatured || false
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.body.SKU && req.body.SKU !== product.SKU) {
      const existingSKU = await Product.findOne({ SKU: req.body.SKU.toUpperCase() });
      if (existingSKU) {
        return res.status(400).json({ success: false, message: 'Product with this SKU already exists' });
      }
      req.body.SKU = req.body.SKU.toUpperCase();
    }

    if (req.body.category && !mongoose.Types.ObjectId.isValid(req.body.category)) {
      const catDoc = await Category.findOne({
        $or: [
          { name: new RegExp(`^${req.body.category}$`, 'i') },
          { slug: String(req.body.category).toLowerCase() }
        ]
      });
      if (catDoc) req.body.category = catDoc._id;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    const [formatted] = await resolveCategoriesForProducts([product]);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: formatted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
