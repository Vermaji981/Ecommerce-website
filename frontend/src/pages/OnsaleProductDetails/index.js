import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { IoArrowBack } from "react-icons/io5";
import img1 from "../../image/sunglasss/Emporio-Armani/2.avif";
import img2 from "../../image/sunglasss/COACH - COACH Women Metal Sunglass/1.avif";
import img3 from "../../image/sunglasss/Burberry - 0BE442741128736/1.avif";
import img4 from "../../image/sunglasss/Hustlr  Blue Sky/1.webp";
import img5 from "../../image/sunglasss/Michael Kors - Michael Kors Metal Woman Sunglass            Price inclusive of all taxes/1.avif";
import img6 from "../../image/sunglasss/RALPH LAUREN - Ralph Women Injected Sunglass/1.avif";
import img7 from "../../image/sunglasss/Rayban Jbior Sole Unisex/1.avif";
import img8 from "../../image/sunglasss/Versace - Versace Sunglasses/1.avif";
import laptop from "../../image/laptop.jfif";
import redtape from "../../image/redtape.jfif";
import redtape1 from "../../image/redtape1.jfif";
import redtape3 from "../../image/redtape3.jfif";
import apple2 from "../../image/apple2.jfif";
import apple from "../../image/apple.jfif";
import bag from "../../simple image/bag.avif";

const OnsaleProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isPurchased, setIsPurchased] = useState(false);

  // isme productdetail h jisme uske price hor baki sari detail h
  const products = {
    1: {
      id: 1,
      title: 'Emporio-Armani',
      price: 20000,
      image: img1,
      rating: 4.8,
      reviews: 256,
      category: 'Sunglass',
      description: 'Emporio Armani - Emporio Armani Grey Cateye Sunglasses.',
      specifications: [
        "Reinforcing the brand's commitment to sustainable fashion.",
        "Feminine cat eye shape with multi-faceted details and geometric cuts.",
        "Colored spotted havanas & transparent colors in bio-acetate with partly bio-based lenses.",
        "Alluring metal core engraved with geometric pattern and sustainability logo inside temple.",
        "Regular Fit - High Bridge Fit | Frame Shape: Cat Eye | Frame Color: Shiny Pink Havana",
      ],
      warranty: 'No',
      inStock: true,
      sku: 'IPHONE17-001',
    },
    2: {
      id: 2,
      title: 'MacBook Pro Laptop',
      price: 100,
      image: laptop,
      rating: 4.9,
      reviews: 512,
      category: 'Electronics',
      description: 'Powerful MacBook Pro laptop for professionals and creators.',
      specifications: [
        '15-inch Liquid Retina display',
        'M3 Max chip',
        '36GB unified memory',
        '512GB SSD storage',
        '16-core GPU',
        '17-hour battery life',
      ],
      warranty: '2 Years AppleCare+',
      inStock: true,
      sku: 'MBP-M3-001',
    },
    3: {
      id: 3,
      title: 'Redtape Casual Shoes',
      price: 35,
      image: redtape,
      rating: 4.5,
      reviews: 189,
      category: 'Shoes',
      description: 'Comfortable casual shoes perfect for everyday wear.',
      specifications: [
        'Premium leather upper',
        'Memory foam insole',
        'Lightweight rubber sole',
        'Available sizes: 6-12',
        'Multiple colors available',
        'Water resistant',
      ],
      warranty: '6 Months Manufacturer Warranty',
      inStock: true,
      sku: 'REDTAPE-CASUAL-001',
    },
    4: {
      id: 4,
      title: 'Redtape Classic Oxford',
      price: 40,
      image: redtape1,
      rating: 4.6,
      reviews: 234,
      category: 'Shoes',
      description: 'Elegant classic oxford shoes for formal occasions.',
      specifications: [
        'Genuine leather construction',
        'Breathable lining',
        'Slip-resistant sole',
        'Size range: 6-13',
        'Black and Brown colors',
        'Professional look',
      ],
      warranty: '6 Months Manufacturer Warranty',
      inStock: true,
      sku: 'REDTAPE-OXFORD-001',
    },
    5: {
      id: 5,
      title: 'Redtape Premium Boots',
      price: 45,
      image: redtape3,
      rating: 4.7,
      reviews: 178,
      category: 'Shoes',
      description: 'Premium boots with superior comfort and durability.',
      specifications: [
        'Full grain leather',
        'Waterproof technology',
        'Steel reinforced toe',
        'Thermal insulation',
        'Sizes 6-14',
        'Eco-friendly materials',
      ],
      warranty: '1 Year Manufacturer Warranty',
      inStock: true,
      sku: 'REDTAPE-BOOT-001',
    },
    6: {
      id: 6,
      title: 'Apple Watch Series 9',
      price: 70,
      image: apple2,
      rating: 4.8,
      reviews: 445,
      category: 'Electronics',
      description: 'Advanced smartwatch with health monitoring and fitness tracking.',
      specifications: [
        '1.9-inch Retina display',
        'Always-On capability',
        'Blood oxygen monitor',
        'ECG app',
        'Water resistant 50m',
        '18-hour battery life',
      ],
      warranty: '1 Year Apple Warranty',
      inStock: true,
      sku: 'APPLEWATCH-S9-001',
    },
    7: {
      id: 7,
      title: 'Apple AirPods Pro',
      price: 60,
      image: apple,
      rating: 4.7,
      reviews: 678,
      category: 'Electronics',
      description: 'Premium wireless earbuds with active noise cancellation.',
      specifications: [
        'Active Noise Cancellation',
        'Transparency mode',
        'Spatial audio support',
        '6-hour battery per charge',
        '30-hour total with case',
        'Touch controls',
      ],
      warranty: '2 Years Apple Warranty',
      inStock: true,
      sku: 'AIRPODS-PRO-001',
    },
    8: {
      id: 8,
      title: 'Designer Leather Bag',
      price: 20,
      image: bag,
      rating: 4.4,
      reviews: 156,
      category: 'Bags',
      description: 'Stylish designer leather bag suitable for daily use.',
      specifications: [
        'Genuine leather material',
        'Multiple compartments',
        'Adjustable straps',
        'Leather handles',
        'RFID protection',
        'Capacity: 15L',
      ],
      warranty: '1 Year Leather Guarantee',
      inStock: true,
      sku: 'BAG-DESIGNER-001',
    },
  };

  const product = products[id];

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <h2>Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const handlePurchase = () => {
    setIsPurchased(true);
    alert(`✅ Successfully purchased ${quantity} x ${product.title}!\nTotal: $${(product.price * quantity).toFixed(2)}`);
    setTimeout(() => setIsPurchased(false), 3000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };
   return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/shop" className="back-link">
          <Button startIcon={<IoArrowBack />}>
            Back to Shop
          </Button>
        </Link>

        <div className="product-detail-content">
          <div className="row">
            {/* Product Image */}
            <div className="col-md-5">
              <div className="product-image-container">
                <img src={product.image} alt={product.title} className="product-detail-image" />
                <div className="product-badge">
                  {typeof product.category === 'object' && product.category !== null 
                    ? (product.category.name || 'General') 
                    : (product.category || 'General')}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="col-md-7">
              <div className="product-info">
                <h1>{product.title}</h1>

                {/* Rating */}
                <div className="rating-section">
                  <span className="stars">⭐ {product.rating}</span>
                  <span className="reviews">({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="price-section">
                  <div className="current-price">${product.price}</div>
                  <div className="stock-status">
                    {product.inStock ? (
                      <span className="in-stock">✓ In Stock</span>
                    ) : (
                      <span className="out-of-stock">Out of Stock</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="description-section">
                  <h3>Description</h3>
                  <p>{product.description}</p>
                </div>

                {/* Specifications */}
                <div className="specifications-section">
                  <h3>Specifications</h3>
                  <ul className="specs-list">
                    {product.specifications.map((spec, idx) => (
                      <li key={idx}>✓ {spec}</li>
                    ))}
                  </ul>
                </div>

                {/* Warranty */}
                <div className="warranty-section">
                  <h4>🛡️ Warranty: {product.warranty}</h4>
                </div>

                {/* SKU */}
                <div className="sku-section">
                  <small>SKU: {product.sku}</small>
                </div>

                {/* Purchase Section */}
                <div className="purchase-section">
                  <div className="quantity-selector">
                    <label>Quantity:</label>
                    <select value={quantity} onChange={handleQuantityChange}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                    

                <div className="Purchase m-10px">
                  <button 
                    className={`purchase-btn ${isPurchased ? 'purchased' : ''}`}
                    onClick={handlePurchase}
                    disabled={!product.inStock}
                  >
                    {isPurchased ? '✅ Purchased!' : `🛒 Buy Now - $${(product.price * quantity).toFixed(2)}`}
                  </button>

                  <button className="wishlist-btn">
                    ❤️ Add to Wishlist
                  </button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="additional-info">
                  <div className="info-item">
                    <span>🚚 Free Shipping</span> on orders over $50
                  </div>
                  <div className="info-item">
                    <span>🔄 Easy Returns</span> within 30 days
                  </div>
                  <div className="info-item">
                    <span>💳 Secure Payment</span> methods available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnsaleProductDetails;
