const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    try {
      cart = await Cart.populate(cart, {
        path: 'items.product',
        select: 'name price discountPrice images image img stock brand category SKU isActive',
        strictPopulate: false
      });
    } catch (e) {
      // Safe fallback if raw populate fails
    }

    // Calculate totals
    let subtotal = 0;
    const formattedItems = cart.items.map(item => {
      const p = item.product && typeof item.product === 'object' && item.product.name ? item.product : null;
      const unitPrice = p
        ? (p.discountPrice > 0 && p.discountPrice < p.price ? p.discountPrice : p.price)
        : Number(item.price || 0);
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      const pImage = p
        ? (p.images && p.images.length > 0 ? p.images[0] : (p.image || p.img || ''))
        : (item.image || '');

      return {
        _id: item._id,
        productId: p ? p._id : item.product,
        name: p ? p.name : (item.name || 'Product'),
        title: p ? p.name : (item.name || 'Product'),
        price: unitPrice,
        discountPrice: p ? p.discountPrice : 0,
        unitPrice,
        image: pImage,
        stock: p ? p.stock : 10,
        quantity: item.quantity,
        itemTotal
      };
    });

    res.status(200).json({
      success: true,
      cart: {
        _id: cart._id,
        items: formattedItems,
        totalItems: formattedItems.reduce((acc, curr) => acc + curr.quantity, 0),
        subtotal
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, name, title, price, image } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    let product = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => String(item.product) === String(productId) || (item.product && String(item.product._id) === String(productId))
    );

    let newQuantity = quantity;
    if (itemIndex > -1) {
      newQuantity = cart.items[itemIndex].quantity + quantity;
    }

    const itemPrice = product
      ? (product.discountPrice > 0 ? product.discountPrice : product.price)
      : Number(price || 0);

    const itemName = product ? product.name : (name || title || 'Product');
    const itemImage = product ? (product.images && product.images[0] ? product.images[0] : '') : (image || '');

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = newQuantity;
      if (itemPrice > 0) cart.items[itemIndex].price = itemPrice;
      if (itemName) cart.items[itemIndex].name = itemName;
      if (itemImage) cart.items[itemIndex].image = itemImage;
    } else {
      cart.items.push({
        product: product ? product._id : productId,
        name: itemName,
        price: itemPrice,
        image: itemImage,
        quantity: newQuantity
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product added to cart successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    // Stock check
    const product = await Product.findById(item.product);
    if (!product || quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product ? product.stock : 0} units available in stock`
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart item updated'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    next(error);
  }
};
