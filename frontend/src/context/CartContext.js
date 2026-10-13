import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  // Sync to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  // Dynamically computed cart metrics
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = Number(item.unitPrice || item.discountPrice || item.price || 0);
    const qty = Number(item.quantity || 1);
    return acc + (price * qty);
  }, 0);

  const cartSubtotal = cartTotal;
  const cartCount = cartItems.reduce((acc, item) => acc + Number(item.quantity || 1), 0);

  // Fetch backend cart when authenticated
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const data = await cartService.getCart();
      if (data && data.success && data.cart && Array.isArray(data.cart.items) && data.cart.items.length > 0) {
        setCartItems(data.cart.items);
      }
    } catch (error) {
      console.warn('[CartContext] Backend cart fetch error:', error?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantityToAdd = 1) => {
    if (!product) return;

    const productId = String(product._id || product.id || product.productId || `item_${Date.now()}`);
    const title = product.title || product.name || 'Product';
    const price = Number(product.discountPrice > 0 && product.discountPrice < product.price ? product.discountPrice : (product.price || 0));
    const image = product.image || product.img || (Array.isArray(product.images) && product.images[0]) || '';
    const stock = Number(product.stock || 10);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => String(item.productId || item._id || item.id) === String(productId));
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantityToAdd,
          price,
          unitPrice: price,
          title,
          name: title,
          image
        };
        return updated;
      }
      return [
        ...prev,
        {
          _id: productId,
          id: productId,
          productId,
          title,
          name: title,
          price,
          discountPrice: Number(product.discountPrice || 0),
          unitPrice: price,
          image,
          stock,
          quantity: quantityToAdd
        }
      ];
    });

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await cartService.addToCart(productId, quantityToAdd, {
          name: title,
          title,
          price,
          image
        });
      } catch (error) {
        console.warn('[CartContext] Backend cart sync notice:', error?.message);
      }
    }

    return { success: true, message: 'Product added to cart' };
  };

  const updateQuantity = async (itemId, newQty) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((i) => String(i._id || i.id || i.productId) !== String(itemId)));
    } else {
      setCartItems((prev) =>
        prev.map((i) =>
          String(i._id || i.id || i.productId) === String(itemId) ? { ...i, quantity: newQty } : i
        )
      );
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        if (newQty <= 0) {
          await cartService.removeCartItem(itemId);
        } else {
          await cartService.updateCartItem(itemId, newQty);
        }
      } catch (error) {
        console.warn('[CartContext] Update quantity sync notice:', error?.message);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => prev.filter((i) => String(i._id || i.id || i.productId) !== String(itemId)));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await cartService.removeCartItem(itemId);
      } catch (error) {
        console.warn('[CartContext] Remove item sync notice:', error?.message);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    try {
      localStorage.removeItem('cartItems');
    } catch (e) {}

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await cartService.clearCart();
      } catch (e) {
        console.warn('[CartContext] Clear cart sync notice:', e?.message);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        cartTotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
