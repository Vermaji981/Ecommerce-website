import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch backend cart when authenticated
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Unauthenticated fallback to local state if needed
      setCartItems([]);
      setCartSubtotal(0);
      return;
    }

    setLoading(true);
    try {
      const data = await cartService.getCart();
      if (data && data.success && data.cart) {
        setCartItems(data.cart.items || []);
        setCartSubtotal(data.cart.subtotal || 0);
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
    const token = localStorage.getItem('token');
    const productId = product._id || product.id || product.productId;

    if (!token) {
      // Local fallback for guest users
      setCartItems((prev) => {
        const existingIndex = prev.findIndex((item) => String(item.productId || item._id) === String(productId));
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantityToAdd;
          return updated;
        }
        return [
          ...prev,
          {
            _id: `guest_${Date.now()}`,
            productId,
            name: product.name || product.title,
            price: product.price,
            discountPrice: product.discountPrice,
            unitPrice: product.discountPrice > 0 ? product.discountPrice : product.price,
            image: product.image || (product.images && product.images[0]) || '',
            stock: product.stock || 10,
            quantity: quantityToAdd
          }
        ];
      });
      return { success: true, message: 'Added to local cart' };
    }

    try {
      const data = await cartService.addToCart(productId, quantityToAdd);
      await fetchCart();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (newQty <= 0) {
        setCartItems(prev => prev.filter(i => String(i._id) !== String(itemId)));
      } else {
        setCartItems(prev => prev.map(i => String(i._id) === String(itemId) ? { ...i, quantity: newQty } : i));
      }
      return;
    }

    try {
      if (newQty <= 0) {
        await cartService.removeCartItem(itemId);
      } else {
        await cartService.updateCartItem(itemId, newQty);
      }
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems(prev => prev.filter(i => String(i._id) !== String(itemId)));
      return;
    }

    try {
      await cartService.removeCartItem(itemId);
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await cartService.clearCart();
      } catch (e) {
        console.error('Error clearing backend cart:', e);
      }
    }
    setCartItems([]);
    setCartSubtotal(0);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartTotal = cartSubtotal;

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
