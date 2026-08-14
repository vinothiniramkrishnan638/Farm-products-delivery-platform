
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import OrderListCard from "../components/OrderListCard";
import {
  getOrderHistory,
  reorderOrder,
} from "../api/orderApi";

const OrderHistory = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reorderingId, setReorderingId] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getOrderHistory();

      setOrders(res.data);
    } catch (err) {
      setError(
        "Failed to load order history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderId) => {
    try {
      setReorderingId(orderId);
      setError("");

      await reorderOrder(orderId);

      navigate("/cart");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to reorder. Please try again."
      );
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfa] flex flex-col page-fade-in">
      <Header />
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        {/* Page Title */}
        <h1 className="text-2xl font-extrabold text-gray-800 font-heading mb-5">
          Order History
        </h1>

        {/* Loading */}
        {loading && (
          <Loader text="Loading order history..." />
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Empty Orders */}
        {!loading &&
          !error &&
          orders.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-16">
              No delivered or cancelled orders yet.
            </p>
          )}

        {/* Order List */}
        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="space-y-2"
                >
                  {/* Order Card */}
                  <OrderListCard order={order} />

                  {/* Reorder Button */}
                  {order.order_status === "Delivered" && (
                    <button
                      onClick={() =>
                        handleReorder(order.order_id)
                      }
                      disabled={
                        reorderingId === order.order_id
                      }
                      className="w-full bg-green-600 text-white font-bold py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      {reorderingId === order.order_id
                        ? "Reordering..."
                        : "Reorder"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistory;

