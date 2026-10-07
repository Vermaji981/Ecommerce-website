import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying payment...');
  const [details, setDetails] = useState(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const checkSession = async () => {
      if (!sessionId) {
        setStatus('Checkout session ID is missing.');
        return;
      }

      try {
        const response = await api.getCheckoutSession(sessionId);
        if (response?.paid) {
          setStatus('Payment completed successfully! Your order is confirmed.');
        } else {
          setStatus('Payment is pending or not completed yet.');
        }
        setDetails(response?.session || null);
      } catch (error) {
        console.error(error);
        setStatus('Unable to verify payment status right now.');
      }
    };

    checkSession();
  }, [sessionId]);

  return (
    <div className="checkout-page">
      <div className="checkout-message">
        <h1>Thank you for your purchase</h1>
        <p>{status}</p>
        {details && (
          <div className="session-details">
            <p><strong>Order ID:</strong> {details.id}</p>
            <p><strong>Amount:</strong> {details.amount_total / 100} INR</p>
            <p><strong>Payment status:</strong> {details.payment_status}</p>
          </div>
        )}
        <Link to="/" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
