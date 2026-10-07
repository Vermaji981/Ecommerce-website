import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../component/Loader";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      const raw = response.data?.products || response.data?.data || response.data;
      setProducts(Array.isArray(raw) ? raw : []);
    } catch (error) {
      console.error("Unable to fetch products", error);
      showMessage("Failed to load products from server", "error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  };

  const deleteProduct = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name || 'this product'}"?`)) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      setProducts((currentProducts) =>
        currentProducts.filter((item) => String(item._id || item.id) !== String(productId))
      );
      showMessage("Product deleted successfully from database!");
    } catch (error) {
      console.error("Unable to delete product", error);
      showMessage(error.response?.data?.message || "Failed to delete product", "error");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const prodId = editingProduct._id || editingProduct.id;
      const response = await api.put(`/products/${prodId}`, editingProduct);
      setProducts(products.map(p => String(p._id || p.id) === String(prodId) ? (response.data.product || response.data) : p));
      setEditingProduct(null);
      showMessage("Product updated successfully!");
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to update product", "error");
    }
  };

  const safeProductsList = Array.isArray(products) ? products : [];

  const getCatStr = (c) => {
    if (!c) return "General";
    if (typeof c === "object") return c.name || c.title || "General";
    return String(c);
  };

  const categories = ["All", ...new Set(safeProductsList.map(p => getCatStr(p.category || p.catogries)).filter(Boolean))];

  const filteredProducts = safeProductsList.filter(p => {
    const titleName = p.title || p.name || "";
    const descText = p.description || "";
    const matchesSearch = titleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          descText.toLowerCase().includes(searchTerm.toLowerCase());
    const catName = getCatStr(p.category || p.catogries);
    const matchesCat = selectedCategory === "All" || catName === selectedCategory;
    return matchesSearch && matchesCat;
  });

  if (loading) return <Loader text="Fetching live product inventory..." />;

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Products</h1>
          <p className="page-subtitle">View, edit, and delete products stored in MongoDB that appear on your frontend store</p>
        </div>
        <div className="header-actions">
          <Link to="/" target="_blank" className="btn btn-secondary">
            🌐 View Main Website
          </Link>
          <Link to="/add-product" className="btn btn-primary">
            + Add New Product
          </Link>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filter-bar card">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search product name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <label>Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="table-responsive">
          {filteredProducts.length > 0 ? (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Description</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item) => {
                  const itemImg = item.image || item.img || (Array.isArray(item.images) && item.images[0]) || "";
                  const itemTitle = item.title || item.name || "Product";
                  const fallbackImg = itemTitle.toLowerCase().includes("shirt") || itemTitle.toLowerCase().includes("cloth") || itemTitle.toLowerCase().includes("fashion")
                    ? "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120"
                    : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120";

                  return (
                    <tr key={item._id || item.id}>
                      <td>
                        <div className="product-table-info">
                          <img
                            src={itemImg || fallbackImg}
                            alt={itemTitle}
                            className="table-thumb"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = fallbackImg;
                            }}
                          />
                          <div>
                            <strong className="product-name">{itemTitle}</strong>
                            <span className="product-id">ID: {String(item._id || item.id).slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                    <td>
                      <span className="badge badge-neutral">{getCatStr(item.category || item.catogries)}</span>
                    </td>
                    <td>
                      <span className="price-tag">₹{item.price}</span>
                    </td>
                    <td>
                      <span className={(item.stock !== undefined ? item.stock : 10) > 0 ? "badge badge-success" : "badge badge-danger"}>
                        {item.stock !== undefined ? item.stock : 10} left
                      </span>
                    </td>
                    <td className="desc-cell">
                      {item.description ? (item.description.length > 50 ? item.description.substring(0, 50) + "..." : item.description) : "—"}
                    </td>
                    <td className="text-right action-buttons">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setEditingProduct({ ...item, title: item.title || item.name, category: item.catogries || item.category })}
                        title="Edit product"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteProduct(item._id || item.id, item.title || item.name)}
                        title="Delete product"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>Try clearing filters or add your first product to display on the frontend.</p>
              <Link to="/add-product" className="btn btn-primary">+ Add Product</Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button className="close-btn" onClick={() => setEditingProduct(null)}>✕</button>
            </div>
            <form onSubmit={handleUpdateProduct}>
              <div className="form-group">
                <label>Product Title / Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title || editingProduct.name || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock !== undefined ? editingProduct.stock : 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  required
                  value={getCatStr(editingProduct.category || editingProduct.catogries)}
                  onChange={(e) => setEditingProduct({ ...editingProduct, catogries: e.target.value, category: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={editingProduct.image || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
