import React, { useState, useEffect } from "react";
import { getBanners, createBanner, updateBanner, deleteBanner } from "../services/adminService";
import ConfirmModal from "../component/ConfirmModal";
import AdminLoader from "../component/AdminLoader";
import DataTable from "../component/DataTable";
import { FaImage, FaPlus, FaTrash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [discountText, setDiscountText] = useState("");
  const [linkUrl, setLinkUrl] = useState("/shop");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBannersData();
  }, []);

  const fetchBannersData = async () => {
    setLoading(true);
    try {
      const data = await getBanners();
      setBanners(data?.banners || (Array.isArray(data) ? data : []));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch promotional banners.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!title || !imageUrl) {
      setError("Banner Title and Image URL are required.");
      return;
    }

    try {
      await createBanner({
        title,
        subtitle,
        imageUrl,
        discountText,
        linkUrl: linkUrl || "/shop",
        isActive: true
      });

      setSuccessMsg("Banner published successfully!");
      setTitle("");
      setSubtitle("");
      setImageUrl("");
      setDiscountText("");
      setLinkUrl("/shop");
      fetchBannersData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create banner.");
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await updateBanner(banner._id || banner.id, {
        isActive: !banner.isActive
      });
      fetchBannersData();
    } catch (err) {
      console.error(err);
      setError("Failed to update banner status.");
    }
  };

  const handleDeletePrompt = (banner) => {
    setSelectedBanner(banner);
    setDeleteModalOpen(true);
  };

  const confirmDeleteBanner = async () => {
    if (!selectedBanner) return;
    setDeleting(true);
    try {
      await deleteBanner(selectedBanner._id || selectedBanner.id);
      setSuccessMsg(`Banner "${selectedBanner.title}" removed.`);
      setDeleteModalOpen(false);
      setSelectedBanner(null);
      fetchBannersData();
    } catch (err) {
      console.error(err);
      setError("Failed to delete banner.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: "Banner Preview",
      accessor: "imageUrl",
      render: (item) => (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="rounded-3 border shadow-sm"
          style={{ width: "120px", height: "55px", objectFit: "cover" }}
        />
      )
    },
    {
      header: "Title & Details",
      accessor: "title",
      render: (item) => (
        <div>
          <h6 className="fw-bold text-dark mb-0">{item.title}</h6>
          {item.subtitle && <p className="text-muted small mb-0">{item.subtitle}</p>}
          {item.discountText && <span className="badge bg-warning text-dark me-1">{item.discountText}</span>}
        </div>
      )
    },
    {
      header: "Active Status",
      accessor: "isActive",
      render: (item) => (
        <button
          className={`btn btn-sm ${item.isActive ? "btn-success" : "btn-secondary"} rounded-pill px-3 fw-bold`}
          onClick={() => handleToggleActive(item)}
        >
          {item.isActive ? "Active (Live)" : "Disabled"}
        </button>
      )
    }
  ];

  if (loading) return <AdminLoader message="Fetching store banners..." />;

  return (
    <div className="banners-page">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <FaImage className="text-primary" /> Store Promotional Banners
          </h2>
          <p className="text-muted small">Manage main slider highlights and deal banners</p>
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

      <div className="row g-4">
        {/* Form Column */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">Add New Banner</h5>

            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Banner Title *</label>
                <input
                  type="text"
                  className="form-control text-dark fw-bold"
                  required
                  placeholder="e.g. Mega Summer Sale"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Subtitle</label>
                <input
                  type="text"
                  className="form-control text-dark fw-bold"
                  placeholder="e.g. Up to 50% Off Top Brands"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Image URL *</label>
                <input
                  type="text"
                  className="form-control text-dark fw-bold"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Discount Badge Text</label>
                <input
                  type="text"
                  className="form-control text-dark fw-bold"
                  placeholder="e.g. Flat 30% OFF"
                  value={discountText}
                  onChange={(e) => setDiscountText(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Target Link URL</label>
                <input
                  type="text"
                  className="form-control text-dark fw-bold"
                  placeholder="/shop"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold">
                <FaPlus className="me-1" /> Publish Banner
              </button>
            </form>
          </div>
        </div>

        {/* Data Table Column */}
        <div className="col-lg-8">
          <DataTable
            columns={columns}
            data={banners}
            searchKey="title"
            placeholder="Search banners..."
            actions={(item) => (
              <button
                className="btn btn-sm btn-outline-danger rounded-circle"
                title="Delete Banner"
                onClick={() => handleDeletePrompt(item)}
              >
                <FaTrash />
              </button>
            )}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Banner"
        message="Are you sure you want to delete this banner graphic?"
        itemName={selectedBanner?.title}
        onConfirm={confirmDeleteBanner}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedBanner(null);
        }}
        loading={deleting}
      />
    </div>
  );
}

export default Banners;
