import React, { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/adminService";
import ConfirmModal from "../component/ConfirmModal";
import AdminLoader from "../component/AdminLoader";
import DataTable from "../component/DataTable";
import { FaTags, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const fetchCategoriesData = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : data?.categories || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, { name, description, image });
        setSuccessMsg("Category updated successfully!");
      } else {
        await createCategory({ name, description, image });
        setSuccessMsg("New category added successfully!");
      }

      setName("");
      setDescription("");
      setImage("");
      setEditingId(null);
      fetchCategoriesData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save category.");
    }
  };

  const handleEditClick = (category) => {
    setEditingId(category._id || category.id);
    setName(category.name || "");
    setDescription(category.description || "");
    setImage(category.image || "");
  };

  const handleDeletePrompt = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return;
    setDeleting(true);
    try {
      await deleteCategory(selectedCategory._id || selectedCategory.id);
      setSuccessMsg(`Category "${selectedCategory.name}" deleted.`);
      setDeleteModalOpen(false);
      setSelectedCategory(null);
      fetchCategoriesData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete category.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: "Category Name",
      accessor: "name",
      render: (item) => (
        <div className="d-flex align-items-center gap-2">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="rounded-circle border"
              style={{ width: "36px", height: "36px", objectFit: "cover" }}
            />
          )}
          <span className="fw-bold text-dark">{item.name}</span>
        </div>
      )
    },
    {
      header: "Description",
      accessor: "description",
      render: (item) => <span className="text-dark fw-semibold">{item.description || "N/A"}</span>
    },
    {
      header: "Status",
      accessor: "isActive",
      render: (item) => (
        <span className={`badge ${item.isActive !== false ? "bg-success" : "bg-secondary"} px-3 py-1.5 rounded-pill`}>
          {item.isActive !== false ? "Active" : "Disabled"}
        </span>
      )
    }
  ];

  if (loading) return <AdminLoader message="Fetching category index..." />;

  return (
    <div className="categories-page">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <FaTags className="text-primary" /> Store Categories
          </h2>
          <p className="text-muted small">Manage e-commerce product taxonomy & navigation filters</p>
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
            <h5 className="fw-bold text-dark mb-3">
              {editingId ? "Edit Category" : "Add New Category"}
            </h5>

            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Category Name *</label>
                <input
                  type="text"
                  className="form-control text-dark fw-bold"
                  required
                  placeholder="e.g. Fashion, Electronics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Image URL (Optional)</label>
                <input
                  type="text"
                  className="form-control text-dark fw-bold"
                  placeholder="https://example.com/category.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Description</label>
                <textarea
                  className="form-control text-dark fw-bold"
                  rows="3"
                  placeholder="Short description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold">
                  {editingId ? "Update Category" : <><FaPlus className="me-1" /> Add Category</>}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill"
                    onClick={() => {
                      setEditingId(null);
                      setName("");
                      setDescription("");
                      setImage("");
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Data Table Column */}
        <div className="col-lg-8">
          <DataTable
            columns={columns}
            data={categories}
            searchKey="name"
            placeholder="Search categories..."
            actions={(item) => (
              <div className="d-flex align-items-center justify-content-end gap-2">
                <button
                  className="btn btn-sm btn-outline-primary rounded-circle"
                  title="Edit Category"
                  onClick={() => handleEditClick(item)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger rounded-circle"
                  title="Delete Category"
                  onClick={() => handleDeletePrompt(item)}
                >
                  <FaTrash />
                </button>
              </div>
            )}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        itemName={selectedCategory?.name}
        onConfirm={confirmDeleteCategory}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        loading={deleting}
      />
    </div>
  );
}

export default Categories;
