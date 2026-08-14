import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import StatusBadge from "../components/StatusBadge";
import OrderTrackingTimeline from "../components/OrderTrackingTimeline";
import { trackOrderStatus, getOrderDetails } from "../api/orderApi";

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTracking();
  }, [orderId]);

  const loadTracking = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getOrderDetails(orderId);
      setOrder(res.data);
    } catch (err) {
      setError("Failed to load order tracking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfa] flex flex-col page-fade-in">
      <Header />
      <Navbar />

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/my-orders")}
          className="text-green-700 hover:text-green-800 font-bold text-sm bg-green-50 px-3 py-1.5 rounded-lg mb-5 active:scale-95 transition-all shadow-sm w-fit"
        >
          ← Back to My Orders
        </button>

        {loading && <Loader text="Loading order tracking..." />}

        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && order && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 mb-5">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-bold text-gray-800">{order.order_id}</p>
                </div>
                <StatusBadge status={order.order_status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Delivery Partner</p>
                  <p className="font-semibold text-gray-800">
                    {order.delivery_partner_name || "Not assigned yet"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Partner Mobile Number</p>
                  <p className="font-semibold text-gray-800">
                    {order.delivery_partner_mobile || "-"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400">Estimated Delivery Time</p>
                <p className="font-semibold text-gray-800">
                  {order.estimated_delivery_time || "Not set yet"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-bold text-gray-800 font-heading mb-4">Order Tracking</p>
              <OrderTrackingTimeline orderStatus={order.order_status} />
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderTrackingPage;