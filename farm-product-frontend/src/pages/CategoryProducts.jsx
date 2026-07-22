import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { getProductsByCategory } from "../api/productApi";

const CategoryProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProductsByCategory(id);
        setProducts(res.data.products || res.data);
        setCategoryName(res.data.category_name || "");
      } catch (err) {
        setError("Failed to load products for this category.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#fafbfa] page-fade-in flex flex-col justify-between">
      <div className="flex-1">
        <Header />
        <Navbar />

        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/customer/dashboard")}
            className="text-green-700 hover:text-green-800 font-bold text-sm bg-green-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm"
          >
            ← Back
          </button>
          <h2 className="font-extrabold text-xl text-gray-800 tracking-tight font-heading">
            {categoryName || "Category Products"}
          </h2>
        </div>

        {loading && <Loader text="Loading products..." />}

        {error && (
          <div className="mx-4 my-3 bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-3 py-2.5">
            {error}
          </div>
        )}

        {!loading && !error && (
          products.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">No products found in this category.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 px-4 pb-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryProducts;