import { useState, useEffect } from "react";

const emptyForm = { category_name: "", category_image: "" };

const CategoryFormModal = ({ existingCategory, onClose, onSave }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingCategory) {
      setFormData({
        category_name: existingCategory.category_name || "",
        category_image: existingCategory.category_image || "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [existingCategory]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSaving(true);
      await onSave(formData, existingCategory?.id);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <p className="font-bold text-lg text-gray-800 font-heading mb-4">
          {existingCategory ? "Edit Category" : "Add Category"}
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-3 py-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-700">Category Name</label>
            <input
              type="text"
              name="category_name"
              value={formData.category_name}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Category Image URL</label>
            <input
              type="text"
              name="category_image"
              value={formData.category_image}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-600 text-white font-semibold py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;