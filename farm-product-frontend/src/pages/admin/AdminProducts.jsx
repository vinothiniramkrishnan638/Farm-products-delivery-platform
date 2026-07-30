import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import ProductFormModal from "../../components/admin/ProductFormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import {
  getAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateProductStock,
  toggleProductStatus,
  getAdminCategories,
} from "../../api/adminApi";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [stockEdits, setStockEdits] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productsRes, categoriesRes] = await Promise.all([getAdminProducts(), getAdminCategories()]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData, productId) => {
    if (productId) {
      await updateAdminProduct(productId, formData);
    } else {
      await addAdminProduct(formData);
    }
    setShowModal(false);
    setEditingProduct(null);
    await loadData();
  };

  const handleDelete = async () => {
    try {
      await deleteAdminProduct(deleteTarget);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete product.");
      setDeleteTarget(null);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleProductStatus(id);
      await loadData();
    } catch (err) {
      setError("Failed to update product status.");
    }
  };

  const handleStockUpdate = async (id) => {
    const newStock = stockEdits[id];
    if (newStock === undefined || newStock === "") return;
    if (Number(newStock) < 0) {
      setError("stock cannot be negative");
      return;
    }
    try {
      await updateProductStock(id, Number(newStock));
      setStockEdits((prev) => ({ ...prev, [id]: undefined }));
      await loadData();
    } catch (err) {
      setError("Failed to update stock.");
    }
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.category_name : "-";
  };

  if (loading) return <Loader text="Loading products..." />;

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <p className="text-xl font-extrabold text-gray-800 font-heading">Product Management</p>
        <button
          onClick={() => { setEditingProduct(null); setShowModal(true); }}
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
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{product.product_name}</td>
                <td className="px-4 py-3 text-gray-600">{getCategoryName(product.category_id)}</td>
                <td className="px-4 py-3 text-gray-600">₹{product.price} / {product.unit}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      defaultValue={product.stock}
                      onChange={(e) => setStockEdits((prev) => ({ ...prev, [product.id]: e.target.value }))}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                    <button onClick={() => handleStockUpdate(product.id)} className="text-xs font-semibold text-blue-600 hover:underline">Update</button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${product.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => { setEditingProduct(product); setShowModal(true); }} 
                      className="p-1.5 rounded-lg text-green-700 hover:bg-green-50 transition-colors" 
                      title="Edit Product"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(product.id)} 
                      className="text-xs font-semibold text-blue-600 hover:underline px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      {product.status === "active" ? "Disable" : "Enable"}
                    </button>
                    <button 
                      onClick={() => setDeleteTarget(product.id)} 
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" 
                      title="Delete Product"
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
        {products.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No products found.</p>}
      </div>

      {/* Mobile/Tablet view card list (visible on mobile, hidden on desktop) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800">{product.product_name}</h3>
                <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                  {getCategoryName(product.category_id)}
                </span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${product.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {product.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 border-t border-b border-gray-50 text-sm">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Price</span>
                <span className="font-semibold text-gray-700">₹{product.price} / {product.unit}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Stock</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    defaultValue={product.stock}
                    onChange={(e) => setStockEdits((prev) => ({ ...prev, [product.id]: e.target.value }))}
                    className="w-16 border border-gray-300 rounded px-2 py-0.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                  />
                  <button onClick={() => handleStockUpdate(product.id)} className="text-xs font-bold text-blue-600 hover:underline">Update</button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end items-center pt-1 border-t border-gray-50">
              <button 
                onClick={() => { setEditingProduct(product); setShowModal(true); }} 
                className="p-2 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 border border-green-100 transition-colors"
                title="Edit Product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              <button 
                onClick={() => handleToggleStatus(product.id)} 
                className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-100 transition-colors"
              >
                {product.status === "active" ? "Disable" : "Enable"}
              </button>
              <button 
                onClick={() => setDeleteTarget(product.id)} 
                className="p-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors"
                title="Delete Product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No products found.</p>}
      </div>

      {showModal && (
        <ProductFormModal
          existingProduct={editingProduct}
          categories={categories}
          onClose={() => { setShowModal(false); setEditingProduct(null); }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message="Are you sure you want to delete this product? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminProducts;