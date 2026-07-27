import { useState, useEffect } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import OrderListCard from "../components/OrderListCard";
import { getCustomerOrders } from "../api/orderApi";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getCustomerOrders();
      setOrders(res.data);
    } catch (err) {
      setError("Failed to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfa] flex flex-col page-fade-in">
      <Header />
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        <h1 className="text-2xl font-extrabold text-gray-800 font-heading mb-5">My Orders</h1>

        {loading && <Loader text="Loading your orders..." />}

        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-16">
            You haven't placed any orders yet.
          </p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderListCard key={order.order_id} order={order} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyOrders;