import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutCancel = () => {
  return (
    <div className="checkout-page">
      <div className="checkout-message">
        <h1>Payment Canceled</h1>
        <p>Your payment process was canceled. You can try again or continue shopping.</p>
        <Link to="/" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    </div>
  );
};

export default CheckoutCancel;
