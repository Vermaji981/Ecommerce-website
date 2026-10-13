import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaArrowLeft, FaShieldAlt, FaTruck, FaLock, FaShoppingBag } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartSubtotal, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart-container">
        <div className="container text-center py-5">
          <div className="empty-cart-icon mb-3">
            <FaShoppingBag style={{ fontSize: '4rem', color: '#6366f1' }} />
          </div>
          <h2>Your Shopping Cart is Empty</h2>
          <p className="text-muted">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/" className="btn btn-primary mt-3 btn-lg rounded-pill">
            <FaArrowLeft className="mr-2" /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page py-4">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="h2 font-weight-bold mb-0">Shopping Cart ({cartItems.length} items)</h1>
          <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="row">
          {/* Left Column: Cart Items List */}
          <div className="col-lg-8 mb-4">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th scope="col" className="py-3 px-4">Product</th>
                        <th scope="col" className="py-3">Price</th>
                        <th scope="col" className="py-3">Quantity</th>
                        <th scope="col" className="py-3">Total</th>
                        <th scope="col" className="py-3 px-4 text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => {
                        const itemPrice = Number(item.price || 0);
                        const itemQty = Number(item.quantity || 1);
                        const itemTotal = itemPrice * itemQty;

                        return (
                          <tr key={item._id || item.id}>
                            <td className="py-3 px-4">
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.image || 'https://via.placeholder.com/80'}
                                  alt={item.title}
                                  className="rounded mr-3"
                                  style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                />
                                <div>
                                  <h6 className="mb-1 font-weight-bold">{item.title || item.name}</h6>
                                  {item.color && (
                                    <span className="badge bg-light text-dark border">
                                      {item.color}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 font-weight-semibold">{formatPrice(itemPrice)}</td>
                            <td className="py-3">
                              <div className="input-group input-group-sm" style={{ width: '110px' }}>
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => updateQuantity(item._id || item.id, itemQty - 1)}
                                >
                                  -
                                </button>
                                <span className="input-group-text bg-white px-3 fw-bold">{itemQty}</span>
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => updateQuantity(item._id || item.id, itemQty + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-3 font-weight-bold text-primary">{formatPrice(itemTotal)}</td>
                            <td className="py-3 px-4 text-end">
                              <button
                                className="btn btn-link text-danger p-0"
                                onClick={() => removeFromCart(item._id || item.id)}
                                title="Remove item"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <Link to="/" className="text-decoration-none text-muted font-weight-bold">
                <FaArrowLeft className="mr-1" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-3 p-3">
              <h5 className="font-weight-bold mb-3 border-bottom pb-2">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="font-weight-bold">{formatPrice(cartSubtotal)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Shipping</span>
                <span className="text-success font-weight-bold">FREE</span>
              </div>

              <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                <span className="text-muted">Estimated Tax</span>
                <span>₹0</span>
              </div>

              <div className="d-flex justify-content-between mb-4">
                <span className="h5 font-weight-bold mb-0">Total Amount</span>
                <span className="h5 font-weight-bold text-primary mb-0">{formatPrice(cartTotal)}</span>
              </div>

              <button
                className="btn btn-success btn-lg w-100 rounded-pill font-weight-bold py-3 mb-3 shadow-sm"
                onClick={() => navigate('/checkout')}
              >
                <FaLock className="mr-2" /> Proceed to Payment
              </button>

              <div className="p-3 bg-light rounded text-center small text-muted">
                <div className="d-flex align-items-center justify-content-center mb-1">
                  <FaShieldAlt className="text-success mr-2" /> 100% Secure Checkout
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <FaTruck className="text-primary mr-2" /> Free Fast Delivery Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
