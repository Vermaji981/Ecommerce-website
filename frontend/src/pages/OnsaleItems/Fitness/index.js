import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProductsApi } from "../../../services/api";
import { FaRegEye, FaRegHeart, FaHeart, FaStar, FaStarHalfAlt, FaShoppingBag, FaCheck, FaTimes } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";

const FitnessPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [cartState, setCartState] = useState({});
  const [wishlistState, setWishlistState] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProductsApi({ category: "Fitness" });
        let raw = res.data?.products || res.data || [];
        if (!Array.isArray(raw) || raw.length === 0) {
          // Fallback to all products if specific category tag has zero items
          const allRes = await getProductsApi();
          raw = allRes.data?.products || allRes.data || [];
        }
        const formatted = raw.map((p) => ({
          ...p,
          id: p._id || p.id,
          title: p.name || p.title,
          price: p.price || 0,
          originalPrice: p.originalPrice || Math.round((p.price || 100) * 1.2),
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || p.img || "/placeholder.jpg"],
          badge: p.badge || (p.featured ? "Featured" : "Popular"),
          brand: p.brand || "Generic",
          rating: p.rating || 4.5,
          reviews: p.reviewsCount || p.reviews || 10,
          specifications: Array.isArray(p.specifications) ? p.specifications : ["100% Genuine Quality"]
        }));
        setProducts(formatted);
      } catch (error) {
        console.error("Error fetching fitness products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const brands = ["All", ...Array.from(new Set(products.map((item) => item.brand)))];

  const filteredFitness = selectedBrand === "All"
    ? products
    : products.filter((item) => item.brand === selectedBrand);

  const toggleCart = (id, e) => {
    e.stopPropagation();
    setCartState((prev) => ({ ...prev, [id]: !prev[id] }));
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
      <section className="sunglass-hero">
        <div className="container-hero">
          <div className="hero-badge">🏋️ Fitness & Home Gym Gear</div>
          <h1>Fitness Equipment & Workout Accessories</h1>
          <p>
            Build your ultimate home gym with adjustable dumbbells, resistance tubes, gym benches, and strength training gear.
          </p>

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

      <section className="catalog-container">
        <div className="catalog-header">
          <h2>
            Showing {filteredFitness.length} {filteredFitness.length === 1 ? "Fitness Item" : "Fitness Products"}
          </h2>
          <span className="subtitle">High quality gym essentials for body transformation and workout training</span>
        </div>

        <div className="sunglasses-grid">
          {loading ? (
            <div className="text-center py-5 w-100 col-12">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading fitness items...</span>
              </div>
            </div>
          ) : (
            filteredFitness.map((item) => {
            const inCart = cartState[item.id];
            const isWishlisted = wishlistState[item.id];
            const discountPercent = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

            return (
              <div className="sunglass-card" key={item.id}>
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
                      onClick={(e) => toggleCart(item.id, e)}
                      aria-label="Cart"
                    >
                      {inCart ? <FaCheck /> : <TiShoppingCart />}
                    </button>
                  </div>
                </div>

                <div className="card-info">
                  <span className="brand-name">{item.brand}</span>
                  <h3 className="product-title">
                    <Link to={`/product/${item.id}`}>{item.title}</Link>
                  </h3>

                  <div className="rating-row">
                    <div className="stars">{renderStars(item.rating)}</div>
                    <span className="rating-number">{item.rating} ({item.reviews})</span>
                  </div>

                  <div className="price-row">
                    <span className="current-price">{formatPrice(item.price)}</span>
                    {item.originalPrice > item.price && (
                      <span className="original-price">{formatPrice(item.originalPrice)}</span>
                    )}
                  </div>

                  <div className="card-buttons">
                    <button
                      className={`btn-cart ${inCart ? "added" : ""}`}
                      onClick={(e) => toggleCart(item.id, e)}
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

                    <Link to={`/product/${item.id}`} className="btn-shop">
                      <FaShoppingBag className="btn-icon" /> Shop
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      </section>

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

export default FitnessPage;
