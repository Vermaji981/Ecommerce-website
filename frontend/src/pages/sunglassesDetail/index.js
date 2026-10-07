import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useCart } from "../../context/CartContext";
import {
  FaStar,
  FaStarHalfAlt,
  FaShoppingBag,
  FaHeart,
  FaRegHeart,
  FaCheckCircle,
  FaShieldAlt,
  FaTruck,
  FaSyncAlt,
  FaArrowLeft
} from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";

const SunglassesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [orderNotice, setOrderNotice] = useState(null);

  const inCart = cartItems.some((item) => String(item._id || item.id) === String(id));

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProductById(id);
        if (data) {
          setProduct(data);
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching sunglasses detail:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const colorSwatches = {
    Black: "#171717",
    Havana: "#784a2d",
    "Rose Gold": "#c88c87",
    Gold: "#d4af37",
    "Matte Black": "#252525",
    Gunmetal: "#4d555c",
    Blue: "#3d79b9",
    "Clear Grey": "#99a3a4",
    Silver: "#c0c0c0",
    Tortoise: "#6e3612",
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  if (loading) {
    return (
      <div className="sunglasses-detail-container loading-state" style={{ padding: "4rem", textAlign: "center" }}>
        <h3>Loading Product Details...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="sunglasses-detail-container not-found">
        <div className="container">
          <h2>Product Not Found</h2>
          <p>We couldn't find the requested item.</p>
          <Link to="/shop" className="back-link-btn">
            <FaArrowLeft /> Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++) stars.push(<FaStar key={i} className="star-icon full" />);
    if (half) stars.push(<FaStarHalfAlt key="half" className="star-icon half" />);
    return stars;
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedColor);
    setOrderNotice('Added to cart!');
    setTimeout(() => setOrderNotice(null), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity, selectedColor);
    navigate('/checkout');
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="sunglasses-detail-page">
      <div className="detail-wrapper">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb-nav">
          <Link to="/Sunglass" className="back-link">
            <FaArrowLeft className="arrow-icon" /> Back to Sunglasses Collection
          </Link>
          <span className="separator">/</span>
          <span className="brand-crumb">{product.brand}</span>
          <span className="separator">/</span>
          <span className="current-crumb">{product.title}</span>
        </nav>

        {/* Product Detail Grid */}
        <div className="detail-grid">
          {/* Left Column: Gallery */}
          <div className="gallery-section">
            <div className="main-image-card">
              <span className="badge-overlay">{product.badge}</span>
              <img
                src={product.images[activeImageIndex]}
                alt={`${product.title} view ${activeImageIndex + 1}`}
                className="featured-image"
              />
            </div>

            {/* Thumbnail Strip */}
            <div className="thumbnail-strip">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${idx === activeImageIndex ? "active" : ""}`}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Information & Controls */}
          <div className="info-section">
            <div className="brand-badge-chip">{product.brand}</div>
            <h1 className="product-heading">{product.title}</h1>

            {/* Rating */}
            <div className="detail-rating">
              <div className="stars">{renderStars(product.rating)}</div>
              <span className="rating-score">{product.rating}</span>
              <span className="reviews-count">({product.reviews} customer reviews)</span>
            </div>

            {/* Price Block */}
            <div className="price-block">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="original-price">{formatPrice(product.originalPrice)}</span>
                  <span className="save-badge">Save {discountPercent}%</span>
                </>
              )}
            </div>

            <p className="stock-status">
              <FaCheckCircle className="check-icon" /> In Stock &bull; Dispatches within 24 hours
            </p>

            <p className="product-description">{product.description}</p>

            {/* Color Swatch Selection */}
            <div className="option-group">
              <label className="option-label">
                Select Frame Color: <span className="selected-val">{selectedColor}</span>
              </label>
              <div className="swatch-list">
                {product.colors.map((col) => (
                  <button
                    key={col}
                    className={`swatch-btn ${selectedColor === col ? "active" : ""}`}
                    onClick={() => setSelectedColor(col)}
                  >
                    <span
                      className="swatch-dot"
                      style={{ backgroundColor: colorSwatches[col] || "#666" }}
                    />
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="option-group">
              <label className="option-label">Quantity:</label>
              <div className="qty-picker">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  &minus;
                </button>
                <span className="qty-val">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="action-buttons-group">
              <button
                className={`btn-detail-cart ${inCart ? "added" : ""}`}
                onClick={handleAddToCart}
              >
                <TiShoppingCart className="btn-icon" />
                {inCart ? "✔ Item in Cart" : "Add to Cart"}
              </button>

              <button
                className={`btn-detail-wishlist ${isWishlisted ? "active" : ""}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Wishlist"
              >
                {isWishlisted ? <FaHeart className="wish-icon active" /> : <FaRegHeart className="wish-icon" />}
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </button>

              <button className="btn-buy-now" onClick={handleBuyNow}>
                <FaShoppingBag className="btn-icon" /> Buy Now ({formatPrice(product.price * quantity)})
              </button>
            </div>

            {/* Notification Banner */}
            {orderNotice && (
              <div className="order-notification" role="status">
                <FaCheckCircle className="notif-icon" /> {orderNotice}
              </div>
            )}

            {/* Guarantee / Features list */}
            <div className="value-props">
              <div className="prop-item">
                <FaShieldAlt className="prop-icon" />
                <span>100% Authentic Guarantee</span>
              </div>
              <div className="prop-item">
                <FaTruck className="prop-icon" />
                <span>Free Express Delivery</span>
              </div>
              <div className="prop-item">
                <FaSyncAlt className="prop-icon" />
                <span>30-Day Easy Returns</span>
              </div>
            </div>

            {/* Detailed Specifications */}
            <div className="specifications-box">
              <h3>Product Specifications</h3>
              <ul className="spec-list">
                {product.specifications.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
              <div className="sku-info">
                <strong>SKU ID:</strong> <span>{product.sku}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunglassesDetail;
