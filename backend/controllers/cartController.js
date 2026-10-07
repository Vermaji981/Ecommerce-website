const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price discountPrice images stock brand category SKU isActive'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out inactive products or missing products
    const validItems = cart.items.filter(item => item.product && item.product.isActive);

    // Calculate totals
    let subtotal = 0;
    const formattedItems = validItems.map(item => {
      const p = item.product;
      const unitPrice = p.discountPrice > 0 && p.discountPrice < p.price ? p.discountPrice : p.price;
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      return {
        _id: item._id,
        productId: p._id,
        name: p.name,
        price: p.price,
        discountPrice: p.discountPrice,
        unitPrice,
        image: p.images && p.images.length > 0 ? p.images[0] : '',
        stock: p.stock,
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
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ success: false, message: 'Product is currently Out of Stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    let newQuantity = quantity;
    if (itemIndex > -1) {
      newQuantity = cart.items[itemIndex].quantity + quantity;
    }

    // Dynamic stock check: prevent purchasing more than available stock
    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot add more items. Only ${product.stock} units available in stock.`
      });
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity: newQuantity });
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
