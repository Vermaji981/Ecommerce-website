import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  FaArrowLeft,
} from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Classic Black");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [orderNotice, setOrderNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const inCart = cartItems.some((item) => String(item._id || item.id) === String(id));

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const found = await api.getProductById(id);
        if (!cancelled) {
          setProduct(found || null);
          setSelectedColor(found?.colors?.[0] || "Classic Black");
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      loadProduct();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const colorSwatches = {
    "Titanium Black": "#171717",
    "Natural Titanium": "#8f8b82",
    "Deep Blue": "#1d2a44",
    "Space Black": "#1c1d21",
    Silver: "#d0d3d4",
    "Classic White": "#ffffff",
    "Midnight Navy": "#0b1b3d",
    Black: "#111111",
    "Tan Brown": "#8b5a2b",
    "Classic Black": "#171717",
    "Rustic Brown": "#6e3612",
    "Matte Black": "#252525",
    Midnight: "#192026",
    Starlight: "#e6e2d8",
    RED: "#d92b2b",
    White: "#ffffff",
    "Cognac Brown": "#965228",
    "Charcoal Black": "#22252a",
    Beige: "#d6c5b3",
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const renderStars = (rating) => {
    const score = rating || 4.5;
    const full = Math.floor(score);
    const half = score % 1 >= 0.5;
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

  if (isLoading) {
    return (
      <div className="sunglasses-detail-container not-found py-5">
        <div className="container text-center">
          <h2>Loading product...</h2>
          <p>Please wait while we load the product details.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="sunglasses-detail-container not-found py-5">
        <div className="container text-center py-4">
          <h2>Product Not Found</h2>
          <p>We couldn't find the requested product details.</p>
          <Link to="/shop" className="btn btn-primary rounded-pill mt-3">
            <FaArrowLeft className="me-2" /> Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const productColors = Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : ["Classic Black", "White"];
  const productSpecs = Array.isArray(product.specifications) && product.specifications.length > 0 ? product.specifications : ["Premium quality", "Fast delivery", "Easy returns"];
  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.image || product.img ? [product.image || product.img] : []);

  const categoryName = typeof product.category === 'object' && product.category !== null
    ? (product.category.name || product.category.title || 'General')
    : (product.category || product.catogries || 'General');

  return (
    <div className="product-detail-page">
      <div className="detail-wrapper">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb-nav">
          <Link to="/" className="back-link">
            <FaArrowLeft className="arrow-icon" /> Back to Products
          </Link>
          <span className="separator">/</span>
          <span className="brand-crumb">{categoryName}</span>
          <span className="separator">/</span>
          <span className="current-crumb">{product.title}</span>
        </nav>

        {/* Product Detail Grid */}
        <div className="detail-grid">
          {/* Left Column: Gallery */}
          <div className="gallery-section">
            <div className="main-image-card">
              <span className="badge-overlay">{product.badge || "Featured"}</span>
              <img
                src={productImages[activeImageIndex] || product.image || product.img}
                alt={`${product.title} view ${activeImageIndex + 1}`}
                className="featured-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800";
                }}
              />
            </div>

            {/* Thumbnail Strip */}
            <div className="thumbnail-strip">
              {productImages.filter(Boolean).map((img, idx) => (
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
            <div className="brand-badge-chip">{product.brand || "Brand"} &bull; {categoryName}</div>
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
              <FaCheckCircle className="check-icon" /> In Stock &bull; Dispatches in 24 Hours
            </p>

            <p className="product-description">{product.description}</p>

            {/* Color Swatch Selection */}
            {productColors.length > 0 && (
              <div className="option-group">
                <label className="option-label">
                  Select Color/Variant: <span className="selected-val">{selectedColor}</span>
                </label>
                <div className="swatch-list">
                  {productColors.map((col) => (
                    <button
                      key={col}
                      className={`swatch-btn ${selectedColor === col ? "active" : ""}`}
                      onClick={() => setSelectedColor(col)}
                    >
                      <span
                        className="swatch-dot"
                        style={{ backgroundColor: colorSwatches[col] || "#888" }}
                      />
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                {isWishlisted ? (
                  <FaHeart className="wish-icon active" />
                ) : (
                  <FaRegHeart className="wish-icon" />
                )}
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </button>

              <button className="btn-buy-now" onClick={handleBuyNow}>
                <FaShoppingBag className="btn-icon" /> Buy Now ({formatPrice(product.price * quantity)})
              </button>
            </div>

            {/* Order Notice */}
            {orderNotice && (
              <div className="order-notification" role="status">
                <FaCheckCircle className="notif-icon" /> {orderNotice}
              </div>
            )}

            {/* Value Props */}
            <div className="value-props">
              <div className="prop-item">
                <FaShieldAlt className="prop-icon" />
                <span>{product.warranty}</span>
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

            {/* Specifications */}
            <div className="specifications-box">
              <h3>Product Specifications</h3>
              <ul className="spec-list">
                {productSpecs.map((spec, i) => (
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

export default ProductDetail;
