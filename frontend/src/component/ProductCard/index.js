import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaShoppingBag, FaHeart, FaRegHeart, FaCheck } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ id, image, img, images, title, price, originalPrice, link, metadata, rating = 4.7, reviews = 120, badge, onDelete }) => {
  const [wish, setWish] = useState(false);
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const safeId = id ?? "default";
  const productLink = link || `/product/${safeId}`;

  // Smart resolution of image URL
  const resolvedImage = image || img || (Array.isArray(images) && images[0]) || "";

  const getSmartFallback = () => {
    const text = (title + " " + (metadata || "")).toLowerCase();
    if (text.includes("shirt") || text.includes("cloth") || text.includes("fashion") || text.includes("wear") || text.includes("dress")) {
      return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800";
    }
    if (text.includes("shoe") || text.includes("sneaker") || text.includes("footwear")) {
      return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800";
    }
    if (text.includes("phone") || text.includes("mobile") || text.includes("galaxy") || text.includes("iphone")) {
      return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800";
    }
    if (text.includes("laptop") || text.includes("computer") || text.includes("macbook")) {
      return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800";
    }
    if (text.includes("headphone") || text.includes("earphone") || text.includes("audio")) {
      return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
    }
    if (text.includes("sunglass") || text.includes("glass")) {
      return "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800";
    }
    return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800";
  };

  const displayImage = resolvedImage || getSmartFallback();

  const inCart = cartItems.some((item) => String(item._id || item.id) === String(safeId));

  const formatPrice = (val) => {
    if (typeof val === "number" && val > 500) {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
    }
    return `₹ ${val}`;
  };

  const discountPercent = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const renderStars = (score) => {
    const full = Math.floor(score);
    const half = score % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++) stars.push(<FaStar key={i} className="star-icon full" />);
    if (half) stars.push(<FaStarHalfAlt key="half" className="star-icon half" />);
    return stars;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      _id: safeId,
      id: safeId,
      title,
      price,
      originalPrice,
      image: displayImage
    });
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    addToCart({
      _id: safeId,
      id: safeId,
      title,
      price,
      originalPrice,
      image: displayImage
    });
    navigate('/checkout');
  };

  return (
    <article className="product-card">
      <div className="product-top position-relative">
        {badge && <span className={`badge-tag ${badge.toLowerCase().replace(/\s+/g, "-")}`}>{badge}</span>}
        {discountPercent && <span className="discount-tag">-{discountPercent}%</span>}

        <Link to={productLink} aria-label={`View details for ${title}`}>
          <img
            src={displayImage}
            alt={title}
            className="img-fluid"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getSmartFallback();
            }}
          />
        </Link>
      </div>

      <div className="product-body">
        <div className="rating-row">
          <div className="stars">{renderStars(rating)}</div>
          <span className="rating-number">{rating} ({reviews})</span>
        </div>

        <h3 className="product-title">
          <Link to={productLink}>{title}</Link>
        </h3>

        {metadata && <p className="product-metadata">{metadata}</p>}

        <div className="price-row">
          <span className="current-price">{formatPrice(price)}</span>
          {originalPrice && originalPrice > price && (
            <span className="original-price">{formatPrice(originalPrice)}</span>
          )}
        </div>

        <div className="card-buttons">
          <button
            className={`btn-cart ${inCart ? "added" : ""}`}
            onClick={handleAddToCart}
          >
            {inCart ? (
              <>
                <FaCheck className="btn-icon" /> In Cart
              </>
            ) : (
              <>
                <TiShoppingCart className="btn-icon" /> Add to Cart
              </>
            )}
          </button>

          <button
            className={`btn-wishlist ${wish ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setWish(!wish);
            }}
            aria-label="Wishlist"
          >
            {wish ? <FaHeart /> : <FaRegHeart />}
          </button>

          <button onClick={handleBuyNow} className="btn-shop border-0 cursor-pointer">
            <FaShoppingBag className="btn-icon" /> Buy
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
