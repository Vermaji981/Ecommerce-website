import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaQuestionCircle,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    // Simulate API request send
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
    }, 1000);
  };

  return (
    <div className="contact-page">
      {/* Contact Hero Banner */}
      <div className="contact-hero">
        <h1>Get in Touch With Us</h1>
        <p>
          Have questions about your order, products, or feedback? We're here to help you 24/7. Reach out to our customer support team!
        </p>
      </div>

      {/* Contact Main Container */}
      <div className="contact-container">
        <div className="contact-card-box row g-0">
          {/* Left Info Sidebar */}
          <div className="col-lg-5 contact-info-sidebar">
            <div className="contact-info-header">
              <h3>Contact Information</h3>
              <p>Fill out the form or contact us directly using the details below.</p>

              <div className="contact-info-items">
                <div className="info-item-single">
                  <div className="info-item-icon">
                    <FaPhoneAlt />
                  </div>
                  <div className="info-item-text">
                    <label>Phone Number</label>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </div>
                </div>

                <div className="info-item-single">
                  <div className="info-item-icon">
                    <FaEnvelope />
                  </div>
                  <div className="info-item-text">
                    <label>Email Address</label>
                    <a href="mailto:support@mywebsite.com">support@mywebsite.com</a>
                  </div>
                </div>

                <div className="info-item-single">
                  <div className="info-item-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="info-item-text">
                    <label>Headquarters</label>
                    <p>123 Commerce Tower, Tech Hub, New Delhi - 110001, India</p>
                  </div>
                </div>

                <div className="info-item-single">
                  <div className="info-item-icon">
                    <FaClock />
                  </div>
                  <div className="info-item-text">
                    <label>Working Hours</label>
                    <p>Monday - Saturday: 9:00 AM - 8:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-social-footer">
              <span>Connect with us:</span>
              <div className="social-links-row">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link-badge" aria-label="Facebook">
                  <FaFacebookF />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link-badge" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link-badge" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link-badge" aria-label="LinkedIn">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>

          {/* Right Form Side */}
          <div className="col-lg-7 contact-form-side">
            <h3>Send Us a Message</h3>
            <p>Fill in the form below and our team will respond within 24 hours.</p>

            {submitted && (
              <div className="contact-success-alert">
                <FaCheckCircle />
                <div>
                  <strong>Thank You!</strong>
                  <p className="mb-0">Your message has been sent successfully. We will get back to you shortly!</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="row">
                <div className="col-md-6 form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 form-group">
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    className="form-control"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status">Order Status & Tracking</option>
                    <option value="Product Question">Product & Stock Info</option>
                    <option value="Returns & Refund">Returns & Refund</option>
                    <option value="Feedback">Feedback & Suggestions</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  className="form-control"
                  placeholder="How can we help you today?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending Message..."
                ) : (
                  <>
                    Send Message <FaPaperPlane />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Quick Section */}
        <div className="contact-faq-section">
          <h2>Frequently Asked Questions</h2>
          <p className="sub">Quick answers to common questions</p>

          <div className="faq-grid">
            <div className="faq-card">
              <h4>
                <FaQuestionCircle className="text-primary" /> How do I track my order?
              </h4>
              <p>
                Once your order ships, you will receive an SMS and email with your tracking number. You can also view status under your account profile.
              </p>
            </div>

            <div className="faq-card">
              <h4>
                <FaQuestionCircle className="text-primary" /> What is the return policy?
              </h4>
              <p>
                We offer a hassle-free 7-day return policy on all eligible items. Visit our Return Policy page to initiate a return request easily.
              </p>
            </div>

            <div className="faq-card">
              <h4>
                <FaQuestionCircle className="text-primary" /> What payment methods are accepted?
              </h4>
              <p>
                We accept all major Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery (COD).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
