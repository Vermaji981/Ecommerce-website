import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import {
  FaCreditCard,
  FaQrcode,
  FaUniversity,
  FaMoneyBillWave,
  FaLock,
  FaCheckCircle,
  FaShieldAlt,
  FaArrowLeft,
  FaSpinner,
  FaReceipt
} from 'react-icons/fa';
import './CheckoutPayment.css';

const CheckoutPayment = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    customerName: '',
    email: '',
    phone: '',
    shippingAddress: '',
    city: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');

  // Card State
  const [cardData, setCardData] = useState({
    cardNumber: '4532 8921 4092 1184',
    expiry: '08/28',
    cvv: '889',
    cardHolder: 'Happy Verma'
  });

  // UPI State
  const [upiId, setUpiId] = useState('happy@okicici');

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  // Processing & Success State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user') || localStorage.getItem('currentUser');
    if (!token && !userStr) {
      navigate('/auth?redirect=/checkout', {
        replace: true,
        state: { error: 'Please login or create an account to proceed to payment.' }
      });
      return;
    }

    // Load pre-existing profile if any
    api.getUserProfile()
      .then((profile) => {
        if (profile) {
          setCustomer({
            customerName: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            shippingAddress: profile.address || '',
            city: profile.city || '',
            pincode: profile.pincode || ''
          });
        }
      })
      .catch(() => {});
  }, [navigate]);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user') || localStorage.getItem('currentUser');
    if (!token && !userStr) {
      setErrorMsg('You must be logged in to place an order or complete payment.');
      navigate('/auth?redirect=/checkout', {
        state: { error: 'Please login or create an account to complete your payment.' }
      });
      return;
    }

    if (!customer.customerName || !customer.email || !customer.shippingAddress) {
      setErrorMsg('Please fill in your shipping details (Name, Email, Address)');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);
    setProcessingStep(1);

    // Step 1: Connecting to Gateway
    setTimeout(() => {
      setProcessingStep(2); // Verifying Bank Credentials
      setTimeout(() => {
        setProcessingStep(3); // Saving to Database (MongoDB)
        
        const effectiveTotal = cartTotal > 0 ? cartTotal : cartItems.reduce((acc, item) => {
          const p = Number(item.unitPrice || item.price || item.discountPrice || 0);
          const q = Number(item.quantity || 1);
          return acc + (p * q);
        }, 0);

        const formattedItems = cartItems.map((item) => ({
          id: String(item.productId || item._id || item.id),
          productId: String(item.productId || item._id || item.id),
          name: item.title || item.name || 'Product',
          title: item.title || item.name || 'Product',
          price: Number(item.unitPrice || item.price || 0),
          quantity: Number(item.quantity || 1),
          image: item.image || ''
        }));

        // Execute payment processing call
        const payload = {
          ...customer,
          items: formattedItems,
          amount: effectiveTotal,
          totalAmount: effectiveTotal,
          paymentMethod: paymentMethod.toUpperCase()
        };

        api.processPayment(payload)
          .then((res) => {
            if (res && res.success && res.order) {
              setProcessingStep(4);
              setTimeout(() => {
                setIsProcessing(false);
                setCompletedOrder(res.order);
                clearCart();
              }, 800);
            } else {
              throw new Error(res?.error || res?.message || 'Payment failed');
            }
          })
          .catch((err) => {
            setIsProcessing(false);
            setErrorMsg(err.response?.data?.message || err.message || 'Payment processing failed. Please try again.');
          });
      }, 1000);
    }, 1000);
  };

  if (completedOrder) {
    return (
      <div className="payment-success-wrapper py-5">
        <div className="container" style={{ maxWidth: '650px' }}>
          <div className="card border-0 shadow-lg text-center p-4 rounded-4">
            <div className="success-icon-badge mb-3">
              <FaCheckCircle className="text-success" style={{ fontSize: '4.5rem' }} />
            </div>
            <h2 className="font-weight-bold text-success">Payment Successful!</h2>
            <p className="text-muted">
              Thank you for your purchase! Your order has been stored in the database.
            </p>

            <div className="order-details-box bg-light rounded-3 p-3 my-3 text-start">
              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <span className="text-muted">Order ID:</span>
                <span className="font-weight-bold">{completedOrder.orderId}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <span className="text-muted">Transaction ID:</span>
                <span className="font-weight-bold text-primary">{completedOrder.transactionId}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <span className="text-muted">Payment Method:</span>
                <span className="font-weight-bold badge bg-dark">{completedOrder.paymentMethod}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <span className="text-muted">Total Paid:</span>
                <span className="font-weight-bold text-success h5 mb-0">
                  {formatPrice(completedOrder.totalAmount)}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Items Count:</span>
                <span className="font-weight-bold">{completedOrder.items?.length || 1} items</span>
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-center mt-3">
              <button
                className="btn btn-outline-primary rounded-pill px-4"
                onClick={() => navigate('/profile')}
              >
                <FaReceipt className="mr-2" /> View Order History
              </button>
              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>No items in cart to checkout</h3>
        <button className="btn btn-primary mt-3 rounded-pill" onClick={() => navigate('/')}>
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-payment-page py-4">
      <div className="container">
        <div className="d-flex align-items-center mb-4">
          <button className="btn btn-link text-dark p-0 me-3" onClick={() => navigate('/cart')}>
            <FaArrowLeft style={{ fontSize: '1.2rem' }} />
          </button>
          <h2 className="font-weight-bold mb-0">Payment Gateway</h2>
        </div>

        {errorMsg && <div className="alert alert-danger rounded-3">{errorMsg}</div>}

        <form onSubmit={handlePaymentSubmit}>
          <div className="row">
            {/* Left Column: Shipping & Payment Options */}
            <div className="col-lg-8 mb-4">
              {/* Shipping Address Card */}
              <div className="card border-0 shadow-sm rounded-3 mb-4">
                <div className="card-header bg-white font-weight-bold py-3 border-0">
                  <h5 className="mb-0 font-weight-bold text-primary">1. Customer & Shipping Details</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label font-weight-semibold">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customerName"
                        value={customer.customerName}
                        onChange={handleInputChange}
                        placeholder="e.g. Happy Verma"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label font-weight-semibold">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={customer.email}
                        onChange={handleInputChange}
                        placeholder="happy@example.com"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label font-weight-semibold">Mobile Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={customer.phone}
                        onChange={handleInputChange}
                        placeholder="9817200000"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label font-weight-semibold">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={customer.city}
                        onChange={handleInputChange}
                        placeholder="New Delhi"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label font-weight-semibold">Delivery Address *</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        name="shippingAddress"
                        value={customer.shippingAddress}
                        onChange={handleInputChange}
                        placeholder="House no, Street, Landmark..."
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-white font-weight-bold py-3 border-0">
                  <h5 className="mb-0 font-weight-bold text-primary">2. Select Payment Method</h5>
                </div>

                <div className="card-body">
                  <div className="nav nav-pills payment-nav gap-2 mb-4" role="tablist">
                    <button
                      type="button"
                      className={`nav-link ${paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <FaCreditCard className="me-2" /> Credit / Debit Card
                    </button>

                    <button
                      type="button"
                      className={`nav-link ${paymentMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <FaQrcode className="me-2" /> UPI / QR Code
                    </button>

                    <button
                      type="button"
                      className={`nav-link ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('netbanking')}
                    >
                      <FaUniversity className="me-2" /> Net Banking
                    </button>

                    <button
                      type="button"
                      className={`nav-link ${paymentMethod === 'cod' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <FaMoneyBillWave className="me-2" /> Cash on Delivery
                    </button>
                  </div>

                  {/* Payment Details Body based on tab */}
                  {paymentMethod === 'card' && (
                    <div className="payment-tab-content bg-light p-3 rounded-3">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label font-weight-semibold">Card Number</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control font-monospace"
                              name="cardNumber"
                              value={cardData.cardNumber}
                              onChange={handleCardChange}
                              maxLength="19"
                              placeholder="4532 8921 4092 1184"
                            />
                            <span className="input-group-text bg-white">
                              <FaCreditCard className="text-primary" />
                            </span>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label font-weight-semibold">Expiry Date</label>
                          <input
                            type="text"
                            className="form-control"
                            name="expiry"
                            value={cardData.expiry}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label font-weight-semibold">CVV Code</label>
                          <input
                            type="password"
                            className="form-control"
                            name="cvv"
                            value={cardData.cvv}
                            onChange={handleCardChange}
                            maxLength="4"
                            placeholder="***"
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label font-weight-semibold">Cardholder Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="cardHolder"
                            value={cardData.cardHolder}
                            onChange={handleCardChange}
                            placeholder="Name on card"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="payment-tab-content bg-light p-3 rounded-3 text-center">
                      <h6 className="font-weight-bold mb-3">Scan QR Code or Enter UPI ID</h6>
                      <div className="qr-code-box p-3 bg-white d-inline-block rounded border mb-3 shadow-sm">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=${encodeURIComponent(
                            upiId
                          )}&pn=ECommerceApp&am=${cartTotal}`}
                          alt="UPI QR Code"
                          style={{ width: '160px', height: '160px' }}
                        />
                        <div className="small text-muted mt-2">Scan with GPay / PhonePe / Paytm</div>
                      </div>

                      <div className="input-group style-upi-input mx-auto" style={{ maxWidth: '400px' }}>
                        <input
                          type="text"
                          className="form-control"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi"
                        />
                        <button className="btn btn-outline-success" type="button">
                          Verify VPA
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="payment-tab-content bg-light p-3 rounded-3">
                      <label className="form-label font-weight-semibold mb-2">Select Your Bank</label>
                      <select
                        className="form-select form-select-lg"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                      >
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="payment-tab-content bg-light p-3 rounded-3">
                      <div className="d-flex align-items-center">
                        <FaMoneyBillWave className="text-success me-3" style={{ fontSize: '2rem' }} />
                        <div>
                          <h6 className="font-weight-bold mb-1">Cash on Delivery</h6>
                          <p className="mb-0 small text-muted">
                            Pay in cash when your products are delivered to your doorstep.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Complete Payment */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 p-3 sticky-top" style={{ top: '90px' }}>
                <h5 className="font-weight-bold mb-3 border-bottom pb-2">Order Items</h5>

                <div className="cart-summary-items mb-3" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                  {cartItems.map((item) => (
                    <div key={item._id || item.id} className="d-flex align-items-center mb-2">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                        alt={item.title || item.name || 'Product'}
                        className="rounded me-2"
                        style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1 me-2 small">
                        <div className="fw-bold text-truncate" style={{ maxWidth: '140px' }}>
                          {item.title || item.name || 'Product'}
                        </div>
                        <span className="text-muted">Qty: {item.quantity || 1}</span>
                      </div>
                      <div className="fw-bold small">{formatPrice(Number(item.unitPrice || item.price || 0) * Number(item.quantity || 1))}</div>
                    </div>
                  ))}
                </div>

                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping Fee</span>
                    <span className="text-success fw-bold">FREE</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 border-top pt-2">
                    <span className="h5 font-weight-bold mb-0">Total Payable</span>
                    <span className="h5 font-weight-bold text-success mb-0">{formatPrice(cartTotal)}</span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success btn-lg w-100 rounded-pill font-weight-bold py-3 shadow-sm"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <FaSpinner className="spinner-icon me-2" /> Processing...
                      </>
                    ) : (
                      <>
                        <FaLock className="me-2" /> Pay Now ({formatPrice(cartTotal)})
                      </>
                    )}
                  </button>

                  <div className="text-center mt-3 small text-muted">
                    <FaShieldAlt className="text-success me-1" /> Encrypted & Secure Database Storage
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Processing Modal Overlay */}
        {isProcessing && (
          <div className="processing-overlay">
            <div className="processing-modal bg-white p-4 rounded-4 shadow-lg text-center">
              <div className="mb-3">
                <FaSpinner className="spinner-icon text-primary" style={{ fontSize: '3rem' }} />
              </div>
              <h4 className="font-weight-bold">Processing Your Payment</h4>
              <p className="text-muted mb-4">Please do not close or refresh this window.</p>

              <div className="processing-steps text-start">
                <div className={`step-item ${processingStep >= 1 ? 'active' : ''}`}>
                  <FaCheckCircle className="step-check" /> 1. Connecting to Secure Gateway...
                </div>
                <div className={`step-item ${processingStep >= 2 ? 'active' : ''}`}>
                  <FaCheckCircle className="step-check" /> 2. Authorizing Transaction with Bank...
                </div>
                <div className={`step-item ${processingStep >= 3 ? 'active' : ''}`}>
                  <FaCheckCircle className="step-check" /> 3. Storing Order in Database (MongoDB)...
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPayment;
