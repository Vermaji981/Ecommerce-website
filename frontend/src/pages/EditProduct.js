import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../services/adminService";
import AdminLoader from "../component/AdminLoader";
import { FaEdit, FaSave, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProductById(id);
      const product = data?.product || data;
      if (product) {
        setName(product.name || product.title || "");
        setPrice(product.price || "");
        setDiscount(product.discount || "0");
        setStock(product.stock !== undefined ? product.stock : "");
        setCategory(product.category?.name || product.category || "");
        setImage(product.image || product.img || (Array.isArray(product.images) && product.images[0]) || "");
        setDescription(product.description || "");
        setIsFeatured(Boolean(product.isFeatured));
        setIsActive(product.isActive !== undefined ? Boolean(product.isActive) : true);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load product details for editing.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      await updateProduct(id, {
        name,
        title: name,
        price: Number(price),
        discount: Number(discount),
        stock: Number(stock),
        category,
        image,
        images: [image],
        description,
        isFeatured,
        isActive
      });

      setSuccessMsg("Product updated successfully! Customer store synchronization active.");
      setTimeout(() => {
        navigate("/admin/products");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AdminLoader message="Fetching product specifications..." />;

  return (
    <div className="edit-product-page">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <button className="btn btn-outline-secondary rounded-pill btn-sm mb-2" onClick={() => navigate("/admin/products")}>
            <FaArrowLeft className="me-1" /> Back to Products
          </button>
          <h2 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <FaEdit className="text-primary" /> Edit Product Details
          </h2>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 mb-4 d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success rounded-3 mb-4 d-flex align-items-center">
          <FaCheckCircle className="me-2" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label fw-bold text-dark">Product Title / Name *</label>
              <input
                type="text"
                className="form-control text-dark fw-bold"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold text-dark">Category *</label>
              <input
                type="text"
                className="form-control text-dark fw-bold"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold text-dark">Price (₹) *</label>
              <input
                type="number"
                className="form-control text-dark fw-bold"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold text-dark">Discount (%)</label>
              <input
                type="number"
                className="form-control text-dark fw-bold"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold text-dark">Stock Units *</label>
              <input
                type="number"
                className="form-control text-dark fw-bold"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label fw-bold text-dark">Product Image URL *</label>
              <input
                type="text"
                className="form-control text-dark fw-bold"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label fw-bold text-dark">Description</label>
              <textarea
                className="form-control text-dark fw-bold"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="col-md-6">
              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isFeaturedSwitch"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <label className="form-check-label fw-bold text-dark ms-2" htmlFor="isFeaturedSwitch">
                  Mark as Featured Product
                </label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isActiveSwitch"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <label className="form-check-label fw-bold text-dark ms-2" htmlFor="isActiveSwitch">
                  Active (Visible on Customer Store)
                </label>
              </div>
            </div>

            <div className="col-12 mt-4 text-end">
              <button
                type="button"
                className="btn btn-outline-secondary me-2 rounded-pill px-4 fw-bold"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 fw-bold"
                disabled={submitting}
              >
                {submitting ? "Saving..." : <><FaSave className="me-1" /> Save Changes</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
