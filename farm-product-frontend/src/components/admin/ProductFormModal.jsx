import { useState, useEffect } from "react";

const emptyForm = {
  product_name: "",
  category_id: "",
  price: "",
  stock: "",
  unit: "Kg",
  description: "",
  product_image: "",
  images: "",
};

const ProductFormModal = ({ existingProduct, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        product_name: existingProduct.product_name || "",
        category_id: existingProduct.category_id || "",
        price: existingProduct.price || "",
        stock: existingProduct.stock || "",
        unit: existingProduct.unit || "Kg",
        description: existingProduct.description || "",
        product_image: existingProduct.product_image || "",
        images: (existingProduct.images || []).join(", "),
      });
    } else {
      setFormData(emptyForm);
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.category_id) {
      setError("Please select a category");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        product_name: formData.product_name,
        category_id: Number(formData.category_id),
        price: Number(formData.price),
        stock: Number(formData.stock),
        unit: formData.unit,
        description: formData.description,
        product_image: formData.product_image,
        images: formData.images
          ? formData.images.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await onSave(payload, existingProduct?.id);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <p className="font-bold text-lg text-gray-800 font-heading mb-4">
          {existingProduct ? "Edit Product" : "Add Product"}
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-3 py-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-700">Product Name</label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700">Price</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Kg">Kg</option>
                <option value="Litre">Litre</option>
                <option value="Piece">Piece</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Available Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Main Product Image URL</label>
            <input
              type="text"
              name="product_image"
              value={formData.product_image}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Additional Images (comma separated URLs)</label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://..., https://..."
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

export default ProductFormModal;