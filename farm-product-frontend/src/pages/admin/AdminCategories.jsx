import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import chickenFarmCategory from "../../assets/chicken_farm_category.jpg";
import freshWaterPrawn from "../../assets/fresh_water_prawn.jpg";
import CategoryFormModal from "../../components/admin/CategoryFormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import {
  getAdminCategories,
  addAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  toggleCategoryStatus,
} from "../../api/adminApi";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const getCategoryImage = (cat) => {
    if (cat.category_name) {
      const name = cat.category_name.toLowerCase();
      if (name.includes("chicken farm")) return chickenFarmCategory;
      if (name.includes("fresh water prawn")) return freshWaterPrawn;
    }
    return cat.category_image;
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminCategories();
      setCategories(res.data);
    } catch (err) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData, categoryId) => {
    if (categoryId) {
      await updateAdminCategory(categoryId, formData);
    } else {
      await addAdminCategory(formData);
    }
    setShowModal(false);
    setEditingCategory(null);
    await loadCategories();
  };

  const handleDelete = async () => {
    try {
      await deleteAdminCategory(deleteTarget);
      setDeleteTarget(null);
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete category.");
      setDeleteTarget(null);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleCategoryStatus(id);
      await loadCategories();
    } catch (err) {
      setError("Failed to update category status.");
    }
  };

  if (loading) return <Loader text="Loading categories..." />;

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <p className="text-xl font-extrabold text-gray-800 font-heading">Category Management</p>
        <button
          onClick={() => { setEditingCategory(null); setShowModal(true); }}
          className="bg-green-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-green-700 text-sm flex items-center gap-1.5 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
          </svg>
          Add
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      {/* Desktop view table (hidden on mobile, visible on desktop) */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-400 text-xs uppercase">
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Category Name</th>
              <th className="px-4 py-3">Total Products</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-50">
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {getCategoryImage(cat) ? (
                      <img src={getCategoryImage(cat)} alt={cat.category_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-green-700 font-bold text-sm">
                        {cat.category_name?.charAt(0)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">{cat.category_name}</td>
                <td className="px-4 py-3 text-gray-600">{cat.product_count}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cat.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {cat.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => { setEditingCategory(cat); setShowModal(true); }} 
                      className="p-1.5 rounded-lg text-green-700 hover:bg-green-50 transition-colors" 
                      title="Edit Category"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(cat.id)} 
                      className="text-xs font-semibold text-blue-600 hover:underline px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      {cat.status === "active" ? "Disable" : "Enable"}
                    </button>
                    <button 
                      onClick={() => setDeleteTarget(cat.id)} 
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" 
                      title="Delete Category"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No categories found.</p>}
      </div>

      {/* Mobile/Tablet view card list (visible on mobile, hidden on desktop) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  {getCategoryImage(cat) ? (
                    <img src={getCategoryImage(cat)} alt={cat.category_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-green-700 font-bold text-base">
                      {cat.category_name?.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{cat.category_name}</h3>
                  <span className="text-xs text-gray-400">
                    {cat.product_count ?? 0} Products
                  </span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cat.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {cat.status}
              </span>
            </div>

            <div className="flex gap-3 justify-end items-center pt-2 border-t border-gray-50">
              <button 
                onClick={() => { setEditingCategory(cat); setShowModal(true); }} 
                className="p-2 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 border border-green-100 transition-colors"
                title="Edit Category"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              <button 
                onClick={() => handleToggleStatus(cat.id)} 
                className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-100 transition-colors"
              >
                {cat.status === "active" ? "Disable" : "Enable"}
              </button>
              <button 
                onClick={() => setDeleteTarget(cat.id)} 
                className="p-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors"
                title="Delete Category"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No categories found.</p>}
      </div>

      {showModal && (
        <CategoryFormModal
          existingCategory={editingCategory}
          onClose={() => { setShowModal(false); setEditingCategory(null); }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message="Are you sure you want to delete this category? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminCategories;