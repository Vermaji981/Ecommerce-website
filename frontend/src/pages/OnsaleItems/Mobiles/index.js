import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mobiles } from "../../../data/mobiles";
import { FaRegEye, FaRegHeart, FaHeart, FaStar, FaStarHalfAlt, FaShoppingBag, FaCheck, FaTimes } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { useCart } from "../../../context/CartContext";
import { api } from "../../../services/api";

const MobilesPage = () => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [wishlistState, setWishlistState] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [allProducts, setAllProducts] = useState(mobiles);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const data = await api.getProducts();
        if (Array.isArray(data)) {
          const categoryItems = data.filter((p) => {
            const cat = String(typeof p.category === 'object' ? (p.category?.name || p.category?.slug || '') : (p.category || p.catogries || "")).toLowerCase();
            return cat.includes("mobile") || cat.includes("phone");
          });
          if (categoryItems.length > 0) {
            const backendIds = new Set(categoryItems.map(p => String(p._id || p.id)));
            const staticExtra = mobiles.filter(s => !backendIds.has(String(s.id)));
            setAllProducts([...categoryItems, ...staticExtra]);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch backend mobiles:", err);
      }
    };
    fetchCategoryProducts();
  }, []);

  const brands = ["All", ...Array.from(new Set(allProducts.map((item) => item.brand || "Brand")))];

  const filteredMobiles = selectedBrand === "All"
    ? allProducts
    : allProducts.filter((item) => item.brand === selectedBrand);

  const toggleCart = (item, e) => {
    if (e) e.stopPropagation();
    addToCart({
      _id: item.id,
      id: item.id,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.images ? item.images[0] : item.img
    });
  };

  const handleBuyNow = (item, e) => {
    if (e) e.stopPropagation();
    addToCart({
      _id: item.id,
      id: item.id,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.images ? item.images[0] : item.img
    });
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') || localStorage.getItem('currentUser');
    if (!token && !user) {
      navigate('/auth?redirect=/checkout', {
        state: { error: 'Please login or create an account to buy this product.' }
      });
      return;
    }
    navigate("/checkout");
  };

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlistState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star-icon full" />);
    }
    if (hasHalf) {
      stars.push(<FaStarHalfAlt key="half" className="star-icon half" />);
    }
    return stars;
  };

  return (
    <div className="sunglasses-catalog-page">
      {/* Hero Banner Section */}
      <section className="sunglass-hero">
        <div className="container-hero">
          <div className="hero-badge">📱 Smartphones & Mobiles</div>
          <h1>Next-Gen Mobile Phones & Gadgets</h1>
          <p>
            Discover state-of-the-art smartphones, flagship camera phones, and ultra-fast 5G devices from top global mobile brands.
          </p>

          {/* Brand Filter Bar */}
          <div className="brand-filter-bar">
            {brands.map((brand) => (
              <button
                key={brand}
                className={`filter-btn ${selectedBrand === brand ? "active" : ""}`}
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section className="catalog-container">
        <div className="catalog-header">
          <h2>
            Showing {filteredMobiles.length} {filteredMobiles.length === 1 ? "Mobile Phone" : "Mobile Phone Models"}
          </h2>
          <span className="subtitle">High performance 5G smartphones with official warranty</span>
        </div>

        <div className="sunglasses-grid">
          {filteredMobiles.map((item) => {
            const inCart = cartItems.some((c) => String(c._id || c.id) === String(item.id));
            const isWishlisted = wishlistState[item.id];
            const discountPercent = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

            return (
              <div className="sunglass-card" key={item.id}>
                {/* Top Image Box */}
                <div className="card-image-box">
                  <span className={`badge-tag ${item.badge.toLowerCase().replace(/\s+/g, "-")}`}>
                    {item.badge}
                  </span>
                  {discountPercent > 0 && (
                    <span className="discount-tag">-{discountPercent}%</span>
                  )}

                  <Link to={`/product/${item.id}`} className="image-link" aria-label={`View ${item.title}`}>
                    <img src={item.images[0]} alt={item.title} className="main-img" />
                    {item.images[1] && (
                      <img src={item.images[1]} alt={`${item.title} view`} className="hover-img" />
                    )}
                  </Link>

                  {/* Hover Action Overlay */}
                  <div className="overlay-actions">
                    <button
                      className="action-icon-btn"
                      title="Quick View"
                      onClick={() => setQuickViewProduct(item)}
                      aria-label="Quick View"
                    >
                      <FaRegEye />
                    </button>
                    <button
                      className={`action-icon-btn ${isWishlisted ? "active" : ""}`}
                      title={isWishlisted ? "Remove Wishlist" : "Add to Wishlist"}
                      onClick={(e) => toggleWishlist(item.id, e)}
                      aria-label="Wishlist"
                    >
                      {isWishlisted ? <FaHeart className="wish-active" /> : <FaRegHeart />}
                    </button>
                    <button
                      className={`action-icon-btn ${inCart ? "active" : ""}`}
                      title={inCart ? "In Cart" : "Add to Cart"}
                      onClick={(e) => toggleCart(item, e)}
                      aria-label="Cart"
                    >
                      {inCart ? <FaCheck /> : <TiShoppingCart />}
                    </button>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="card-info">
                  <span className="brand-name">{item.brand}</span>
                  <h3 className="product-title">
                    <Link to={`/product/${item.id}`}>{item.title}</Link>
                  </h3>

                  {/* Rating & Reviews */}
                  <div className="rating-row">
                    <div className="stars">{renderStars(item.rating)}</div>
                    <span className="rating-number">{item.rating} ({item.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="price-row">
                    <span className="current-price">{formatPrice(item.price)}</span>
                    {item.originalPrice > item.price && (
                      <span className="original-price">{formatPrice(item.originalPrice)}</span>
                    )}
                  </div>

                  {/* Product Buttons */}
                  <div className="card-buttons">
                    <button
                      className={`btn-cart ${inCart ? "added" : ""}`}
                      onClick={(e) => toggleCart(item, e)}
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
                      className={`btn-wishlist ${isWishlisted ? "active" : ""}`}
                      onClick={(e) => toggleWishlist(item.id, e)}
                      aria-label="Toggle Wishlist"
                    >
                      {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                    </button>

                    <button className="btn-shop border-0 cursor-pointer" onClick={(e) => handleBuyNow(item, e)}>
                      <FaShoppingBag className="btn-icon" /> Buy
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="quickview-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal-btn"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <div className="quickview-content">
              <div className="quickview-image">
                <img src={quickViewProduct.images[0]} alt={quickViewProduct.title} />
              </div>
              <div className="quickview-details">
                <span className="brand-badge">{quickViewProduct.brand}</span>
                <h2>{quickViewProduct.title}</h2>
                <div className="rating-row">
                  <div className="stars">{renderStars(quickViewProduct.rating)}</div>
                  <span>{quickViewProduct.rating} ({quickViewProduct.reviews} reviews)</span>
                </div>
                <div className="price-row">
                  <span className="current-price">{formatPrice(quickViewProduct.price)}</span>
                  <span className="original-price">{formatPrice(quickViewProduct.originalPrice)}</span>
                </div>
                <p className="quickview-desc">{quickViewProduct.description}</p>

                <div className="modal-specs">
                  {quickViewProduct.specifications.map((spec, i) => (
                    <span key={i} className="spec-chip">✓ {spec}</span>
                  ))}
                </div>

                <div className="modal-actions">
                  <Link
                    to={`/product/${quickViewProduct.id}`}
                    className="btn-full-details"
                    onClick={() => setQuickViewProduct(null)}
                  >
                    View Full Product Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilesPage;
