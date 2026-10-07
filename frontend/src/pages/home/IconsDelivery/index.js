import React from "react";
import { Link } from "react-router-dom";
import deliveryIcon from "../../../icon/delivery.jfif";
import originalIcon from "../../../icon/orignal.jfif";
import paymentIcon from "../../../icon/payment.png";
import returnIcon from "../../../icon/return.jfif";

const deliverySystem = () => {
  return (
    <div className="delivery-section">
      <div className="delivery-bar">
        <div className="delivery-item">
          <Link to="/">
            <img src={deliveryIcon} alt="Fast delivery" />
            <div className="delivery-text">
              <strong>Fast Delivery</strong>
              <span>Quick shipping on all orders</span>
            </div>
          </Link>
        </div>

        <div className="delivery-item">
          <Link to="/">
            <img src={originalIcon} alt="Original products" />
            <div className="delivery-text">
              <strong>100% Original</strong>
              <span>Trusted and genuine products</span>
            </div>
          </Link>
        </div>

        <div className="delivery-item">
          <Link to="/">
            <img src={paymentIcon} alt="Secure payment" />
            <div className="delivery-text">
              <strong>Secure Payment</strong>
              <span>Safe checkout with trusted methods</span>
            </div>
          </Link>
        </div>

        <div className="delivery-item">
          <Link to="/">
            <img src={returnIcon} alt="Return policy" />
            <div className="delivery-text">
              <strong>Return Policy</strong>
              <span>Free returns on eligible orders.</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default deliverySystem;
