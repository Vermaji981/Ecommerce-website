import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../component/Loader";
import {
  FaBoxOpen,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaTimes,
  FaCheck
} from "react-icons/fa";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null);
  const [quickStockId, setQuickStockId] = useState(null);
  const [quickStockVal, setQuickStockVal] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/products?includeInactive=true&limit=all");
      const raw = response.data?.products || response.data?.data || response.data;
      setProducts(Array.isArray(raw) ? raw : []);
    } catch (error) {
      console.error("Unable to fetch products", error);
      showMessage("Failed to load products from server", "danger");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const deleteProduct = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name || 'this product'}"?`)) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      setProducts((currentProducts) =>
        currentProducts.filter((item) => String(item._id || item.id) !== String(productId))
      );
      showMessage(`Product "${name}" deleted successfully!`);
    } catch (error) {
      console.error("Unable to delete product", error);
      showMessage(error.response?.data?.message || "Failed to delete product", "danger");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const prodId = editingProduct._id || editingProduct.id;
      const response = await api.put(`/products/${prodId}`, editingProduct);
      const updated = response.data.product || response.data;
      setProducts(products.map((p) => (String(p._id || p.id) === String(prodId) ? updated : p)));
      setEditingProduct(null);
      showMessage("Product details and stock successfully updated!");
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to update product", "danger");
    }
  };

  const handleQuickStockSave = async (prod) => {
    const newStock = Number(quickStockVal);
    if (isNaN(newStock) || newStock < 0) {
      showMessage("Please enter a valid non-negative stock quantity", "danger");
      return;
    }

    try {
      const prodId = prod._id || prod.id;
      const res = await api.put(`/products/${prodId}`, { stock: newStock });
      const updated = res.data.product || res.data;
      setProducts(products.map((p) => (String(p._id || p.id) === String(prodId) ? updated : p)));
      setQuickStockId(null);
      setQuickStockVal("");
      showMessage(`Stock for "${prod.name || prod.title}" updated to ${newStock}!`);
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to update stock", "danger");
    }
  };

  const safeProductsList = Array.isArray(products) ? products : [];

  const getCatStr = (c) => {
    if (!c) return "General";
    if (typeof c === "object") return c.name || c.title || "General";
    return String(c);
  };

  const categories = [
    "All",
    ...new Set(safeProductsList.map((p) => getCatStr(p.category || p.catogries)).filter(Boolean))
  ];

  const filteredProducts = safeProductsList.filter((p) => {
    const titleName = p.title || p.name || "";
    const descText = p.description || "";
    const skuText = p.SKU || p.sku || "";
    const matchesSearch =
      titleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      descText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skuText.toLowerCase().includes(searchTerm.toLowerCase());

    const catName = getCatStr(p.category || p.catogries);
    const matchesCat = selectedCategory === "All" || catName === selectedCategory;

    const currentStatus = p.status || (p.stock === 0 ? "Out of Stock" : "Active");
    const matchesStatus = selectedStatus === "All" || currentStatus === selectedStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const getStatusBadge = (prod) => {
    const status = prod.status || (prod.stock === 0 ? "Out of Stock" : "Active");
    switch (status) {
      case "Active":
        return <span className="badge bg-success-subtle text-success border border-success-subtle">Active</span>;
      case "Out of Stock":
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Out of Stock</span>;
      case "Draft":
        return <span className="badge bg-secondary-subtle text-dark border border-secondary-subtle">Draft</span>;
      default:
        return <span className="badge bg-light text-dark border">{status}</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) return <Loader text="Fetching live product inventory from MongoDB..." />;

  return (
    <div className="products-page p-3 p-md-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <FaBoxOpen className="text-primary" /> Product Inventory Management
          </h1>
          <p className="text-muted small mb-0">
            View, add, edit, track creator references, and manage stock quantities in MongoDB
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/" target="_blank" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
            <FaExternalLinkAlt /> View Storefront
          </Link>
          <Link to="/admin/add-product" className="btn btn-primary btn-sm d-flex align-items-center gap-2">
            <FaPlus /> Add New Product
          </Link>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show mb-4`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: "", type: "" })}></button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by Product Name, Description, or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaFilter className="text-muted" />
                </span>
                <select
                  className="form-select border-start-0"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat === "All" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="col-12 col-md-2">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedStatus("All");
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-body p-0">
          {filteredProducts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">Product</th>
                    <th>Product ID / SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Created By</th>
                    <th>Date Added</th>
                    <th>Status</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((item) => {
                    const itemImg = item.image || item.img || (Array.isArray(item.images) && item.images[0]) || "";
                    const itemTitle = item.title || item.name || "Product";
                    const fallbackImg = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120";
                    const isQuickStockOpen = quickStockId === (item._id || item.id);

                    return (
                      <tr key={item._id || item.id}>
                        <td className="ps-3">
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={itemImg || fallbackImg}
                              alt={itemTitle}
                              className="rounded border"
                              style={{ width: "45px", height: "45px", objectFit: "cover" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = fallbackImg;
                              }}
                            />
                            <div>
                              <div className="fw-bold text-dark text-truncate" style={{ maxWidth: "200px" }}>
                                {itemTitle}
                              </div>
                              <span className="text-muted small">{item.brand || "Brand"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <code className="text-primary small fw-semibold">
                            {item.SKU || item.sku || `SKU-${String(item._id || item.id).slice(-6)}`}
                          </code>
                        </td>
                        <td>
                          <span className="badge bg-light text-secondary border">
                            {getCatStr(item.category || item.catogries)}
                          </span>
                        </td>
                        <td>
                          <div className="fw-bold text-dark">₹{item.price}</div>
                          {item.discountPrice > 0 && item.discountPrice < item.price && (
                            <small className="text-success">Disc: ₹{item.discountPrice}</small>
                          )}
                        </td>
                        <td>
                          {isQuickStockOpen ? (
                            <div className="d-flex align-items-center gap-1" style={{ maxWidth: "120px" }}>
                              <input
                                type="number"
                                className="form-control form-control-sm px-1 text-center"
                                value={quickStockVal}
                                onChange={(e) => setQuickStockVal(e.target.value)}
                                autoFocus
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-success p-1"
                                onClick={() => handleQuickStockSave(item)}
                              >
                                <FaCheck />
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-secondary p-1"
                                onClick={() => setQuickStockId(null)}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer"
                              title="Click to edit stock quickly"
                              onClick={() => {
                                setQuickStockId(item._id || item.id);
                                setQuickStockVal(String(item.stock !== undefined ? item.stock : 10));
                              }}
                            >
                              <span
                                className={`badge ${
                                  (item.stock !== undefined ? item.stock : 10) > 0
                                    ? "bg-success-subtle text-success border border-success-subtle"
                                    : "bg-danger-subtle text-danger border border-danger-subtle"
                                }`}
                              >
                                {item.stock !== undefined ? item.stock : 10} units ✎
                              </span>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="small fw-semibold text-dark">
                            {item.createdByName || "Administrator"}
                          </div>
                          {item.createdBy && (
                            <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                              ID: {String(item.createdBy).slice(-6)}
                            </div>
                          )}
                        </td>
                        <td className="small text-muted">{formatDate(item.createdAt)}</td>
                        <td>{getStatusBadge(item)}</td>
                        <td className="text-end pe-3">
                          <div className="d-flex justify-content-end gap-1">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                setEditingProduct({
                                  ...item,
                                  title: item.title || item.name,
                                  name: item.name || item.title,
                                  category: getCatStr(item.category || item.catogries),
                                  status: item.status || (item.stock === 0 ? "Out of Stock" : "Active")
                                })
                              }
                              title="Edit product"
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => deleteProduct(item._id || item.id, item.title || item.name)}
                              title="Delete product"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <FaBoxOpen className="fs-1 mb-2 text-secondary opacity-50" />
              <h5>No products found</h5>
              <p className="small mb-3">Try adjusting your search criteria or add new items to the inventory.</p>
              <Link to="/admin/add-product" className="btn btn-primary btn-sm">
                + Add New Product
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.65)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold mb-0">Edit Product Details</h5>
                <button type="button" className="btn-close" onClick={() => setEditingProduct(null)}></button>
              </div>

              <form onSubmit={handleUpdateProduct}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Product Name / Title</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={editingProduct.title || editingProduct.name || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          title: e.target.value,
                          name: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">Regular Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="0"
                        value={editingProduct.price || 0}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">Stock Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="0"
                        value={editingProduct.stock !== undefined ? editingProduct.stock : 10}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={editingProduct.category || "General"}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, category: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">Status</label>
                      <select
                        className="form-select"
                        value={editingProduct.status || "Active"}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, status: e.target.value })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">SKU Reference</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingProduct.SKU || editingProduct.sku || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          SKU: e.target.value.toUpperCase(),
                          sku: e.target.value.toUpperCase()
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Product Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editingProduct.description || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light border-top">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
