import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    originalPrice: "",
    category: "fashion",
    brand: "",
    image: "",
    image2: "",
    image3: "",
    description: "",
    stock: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);

  const imagePresets = [
    {
      label: "👕 T-Shirt (Front & Back)",
      img1: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
      img2: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
      img3: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"
    },
    {
      label: "👗 Women Dress Gallery",
      img1: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800",
      img2: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
      img3: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800"
    },
    {
      label: "📱 Smartphone Views",
      img1: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
      img2: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
      img3: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800"
    },
    {
      label: "👟 Running Shoes Angles",
      img1: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      img2: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
      img3: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800"
    },
    {
      label: "💻 Laptop Shots",
      img1: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      img2: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
      img3: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800"
    }
  ];

  const sampleProducts = [
    {
      title: "Classic Cotton Crewneck T-Shirt",
      price: 699,
      originalPrice: 1299,
      category: "fashion",
      brand: "Puma",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
      image2: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
      image3: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
      description: "100% premium combed cotton breathable casual T-Shirt for daily wear.",
      stock: 50,
    },
    {
      title: "Aero Running Shoes Pro",
      price: 2499,
      originalPrice: 3499,
      category: "shoes",
      brand: "Nike",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      image2: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
      image3: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800",
      description: "Comfortable running shoes with dual cushioning.",
      stock: 40,
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fillSample = (sample) => {
    setFormData({
      image2: "",
      image3: "",
      ...sample
    });
    setActivePreviewIdx(0);
  };

  const applyPresetImages = (preset) => {
    setFormData((prev) => ({
      ...prev,
      image: preset.img1,
      image2: preset.img2,
      image3: preset.img3
    }));
    setActivePreviewIdx(0);
  };

  const handleFileUpload = (e, fieldName = "image") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image file is too large. Please select an image under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: reader.result
      }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const getSmartCategoryFallback = (cat) => {
    const c = (cat || "").toLowerCase();
    if (c.includes("fashion") || c.includes("shirt") || c.includes("cloth")) {
      return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800";
    }
    if (c.includes("shoe") || c.includes("footwear")) {
      return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800";
    }
    if (c.includes("mobile") || c.includes("phone")) {
      return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800";
    }
    if (c.includes("electronic") || c.includes("computer") || c.includes("laptop")) {
      return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800";
    }
    if (c.includes("sunglass")) {
      return "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800";
    }
    return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const rawList = [formData.image, formData.image2, formData.image3]
        .map(img => (img || "").trim())
        .filter(Boolean);

      if (rawList.length === 0) {
        rawList.push(getSmartCategoryFallback(formData.category));
      }

      const payload = {
        title: formData.title || formData.name,
        name: formData.title || formData.name,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        category: formData.category,
        catogries: formData.category,
        brand: formData.brand || "General",
        image: rawList[0],
        img: rawList[0],
        images: rawList,
        description: formData.description || `${formData.title || 'Product'} - High quality e-commerce item.`,
        stock: Number(formData.stock !== undefined && formData.stock !== "" ? formData.stock : 10),
        SKU: `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      };

      await api.post("/products", payload);
      setSuccess(`Product added successfully! Photo is now live across the website.`);

      setTimeout(() => {
        navigate("/products");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to add product. Make sure admin token is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Product</h1>
          <p className="page-subtitle">Upload a local image file or paste any custom image URL. The product image will display live across all store pages.</p>
        </div>
        <Link to="/products" className="btn btn-secondary">
          ← Back to Products List
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="add-product-grid">
        {/* Main Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label>Product Title / Name <span className="required">*</span></label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Cotton Printed T-Shirt / Smartphone"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) <span className="required">*</span></label>
                <input
                  type="number"
                  step="1"
                  name="price"
                  required
                  placeholder="e.g. 799"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Original Price (₹)</label>
                <input
                  type="number"
                  step="1"
                  name="originalPrice"
                  placeholder="e.g. 1499"
                  value={formData.originalPrice}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category <span className="required">*</span></label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="fashion">Men & Women Fashion / T-Shirts</option>
                  <option value="mobile">Mobiles & Accessories</option>
                  <option value="shoes">Shoes & Footwear</option>
                  <option value="watches">Watches</option>
                  <option value="sunglass">Sunglasses</option>
                  <option value="computer">Computers & Laptops</option>
                  <option value="grocery">Grocery</option>
                  <option value="fitness">Fitness</option>
                  <option value="furniture">Furniture</option>
                  <option value="homekitchen">Home & Kitchen</option>
                  <option value="magazines">Magazines</option>
                  <option value="mobilecovers">Mobile Covers</option>
                  <option value="electronics">Electronics</option>
                </select>
              </div>

              <div className="form-group">
                <label>Brand / Manufacturer</label>
                <input
                  type="text"
                  name="brand"
                  placeholder="e.g. Nike, Puma, Samsung, Apple"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Stock Quantity <span className="required">*</span></label>
              <input
                type="number"
                name="stock"
                required
                placeholder="e.g. 20"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>

            {/* Photo Input Fields: URL or File Upload */}
            <div className="form-group border-top pt-3 mt-3">
              <label className="font-weight-bold text-primary mb-2">📸 Product Main Photo (URL or File Upload):</label>
              
              <div className="mb-3 p-3 bg-light rounded border">
                <label style={{ fontSize: '0.88rem', fontWeight: 'bold' }}>1. Main Featured Photo <span className="required">*</span></label>
                <div className="d-flex flex-column gap-2 mt-1">
                  <div>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Option A: Upload Image from Computer / Phone</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control form-control-sm mt-1"
                      onChange={(e) => handleFileUpload(e, "image")}
                    />
                  </div>
                  <div className="text-center text-muted" style={{ fontSize: '0.78rem' }}>— OR —</div>
                  <div>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Option B: Paste Image URL link</span>
                    <input
                      type="text"
                      name="image"
                      className="form-control form-control-sm mt-1"
                      placeholder="https://images.unsplash.com/photo-... or any image URL"
                      value={formData.image}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-2 p-2 bg-light rounded border">
                <label style={{ fontSize: '0.85rem' }}>2. Second Photo (Optional - Back / Side Angle)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control form-control-sm my-1"
                  onChange={(e) => handleFileUpload(e, "image2")}
                />
                <input
                  type="text"
                  name="image2"
                  className="form-control form-control-sm"
                  placeholder="Or paste 2nd photo URL link"
                  value={formData.image2}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-2 p-2 bg-light rounded border">
                <label style={{ fontSize: '0.85rem' }}>3. Third Photo (Optional - Detail Angle)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control form-control-sm my-1"
                  onChange={(e) => handleFileUpload(e, "image3")}
                />
                <input
                  type="text"
                  name="image3"
                  className="form-control form-control-sm"
                  placeholder="Or paste 3rd photo URL link"
                  value={formData.image3}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Quick Multi-Photo Gallery Presets */}
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', color: '#64748b' }}>⚡ Quick 3-Photo Gallery Presets (Click to autofill 3 photos):</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {imagePresets.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    className="btn btn-sm btn-outline-primary rounded-pill"
                    style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                    onClick={() => applyPresetImages(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Product Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Enter detailed description of the product..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? "Saving to Database..." : "🚀 Save Product with Multi-Photo Gallery"}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Fill & Live Preview Card */}
        <div className="side-panel">
          <div className="card">
            <h3>⚡ Quick Demo Samples</h3>
            <p className="card-subtitle">Click any sample below to autofill form with multi-photos</p>
            <div className="sample-buttons">
              {sampleProducts.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="sample-btn"
                  onClick={() => fillSample(sample)}
                >
                  <span className="sample-title">{sample.title}</span>
                  <span className="sample-price">₹{sample.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Card with Multi-Photo Gallery Switching */}
          <div className="card preview-card">
            <h3>👁️ Live Multi-Photo Gallery Preview</h3>
            <p className="card-subtitle">Click thumbnails below to test gallery switching</p>
            
            {(() => {
              const previewList = [formData.image, formData.image2, formData.image3]
                .map(img => (img || "").trim())
                .filter(Boolean);

              if (previewList.length === 0) {
                previewList.push(getSmartCategoryFallback(formData.category));
              }

              const safeIdx = activePreviewIdx < previewList.length ? activePreviewIdx : 0;
              const currentImg = previewList[safeIdx];

              return (
                <div className="preview-product-card">
                  <div className="position-relative">
                    <img
                      src={currentImg}
                      alt="Preview"
                      className="preview-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getSmartCategoryFallback(formData.category);
                      }}
                    />
                    <span className="badge bg-dark position-absolute bottom-0 end-0 m-2" style={{ fontSize: '0.75rem' }}>
                      Photo {safeIdx + 1} of {previewList.length}
                    </span>
                  </div>

                  {/* Thumbnail Selector in Preview */}
                  {previewList.length > 1 && (
                    <div className="d-flex gap-2 p-2 bg-light border-top justify-content-center">
                      {previewList.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Thumb ${i + 1}`}
                          style={{
                            width: '45px',
                            height: '45px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            border: safeIdx === i ? '2px solid #2874f0' : '1px solid #cbd5e1'
                          }}
                          onClick={() => setActivePreviewIdx(i)}
                        />
                      ))}
                    </div>
                  )}

                  <div className="preview-body">
                    <span className="badge badge-neutral">{formData.category || "Category"}</span>
                    <h4 className="preview-title">{formData.title || "Product Name"}</h4>
                    <p className="preview-desc">
                      {formData.description || "Product description preview will appear here..."}
                    </p>
                    <div className="flex-between">
                      <span className="price-tag">₹{formData.price || "0"}</span>
                      <span className="stock-info">{formData.stock || 0} in stock</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
