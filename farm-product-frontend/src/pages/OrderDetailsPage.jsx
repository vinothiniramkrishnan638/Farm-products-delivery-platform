import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import StatusBadge from "../components/StatusBadge";
import OrderTrackingTimeline from "../components/OrderTrackingTimeline";
import { getOrderDetails, cancelOrder, reorderOrder } from "../api/orderApi";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [showInvoiceNote, setShowInvoiceNote] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getOrderDetails(orderId);
      setOrder(res.data);
    } catch (err) {
      setError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      setError("");
      await cancelOrder(orderId);
      setActionMessage("Order cancelled successfully.");
      await loadOrder();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to cancel order. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = async () => {
    try {
      setReordering(true);
      setError("");
      await reorderOrder(orderId);
      navigate("/cart");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reorder. Please try again.");
    } finally {
      setReordering(false);
    }
  };

  const canCancel = order?.order_status === "Pending";
  const canReorder = order?.order_status === "Delivered";

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

        {loading && <Loader text="Loading order details..." />}

        {actionMessage && (
          <div className="bg-green-100 text-green-800 text-sm font-bold border border-green-300 rounded-xl px-4 py-3 mb-4">
            {actionMessage}
          </div>
        )}

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

              <div>
                <p className="text-xs text-gray-400">Order Date &amp; Time</p>
                <p className="font-semibold text-gray-800">{order.created_at}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Delivery Address</p>
                <p className="font-semibold text-gray-800">{order.delivery_address?.full_name}</p>
                <p className="text-sm text-gray-600">{order.delivery_address?.mobile_number}</p>
                <p className="text-sm text-gray-600">
                  {order.delivery_address?.address}, {order.delivery_address?.village}
                </p>
                <p className="text-sm text-gray-600">
                  {order.delivery_address?.district}, {order.delivery_address?.state} - {order.delivery_address?.pincode}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-400 mb-2">Product Details</p>
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.product_name} x {item.quantity}</span>
                      <span className="text-gray-800 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold">{order.delivery_charge > 0 ? `₹${order.delivery_charge}` : "FREE"}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 text-base">
                  <span>Grand Total</span>
                  <span className="text-green-700">₹{order.total_amount}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400">Payment Method</p>
                <p className="font-semibold text-gray-800">
                  {order.payment_method === "COD" ? "Cash on Delivery" : "Online Payment"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
              <p className="font-bold text-gray-800 font-heading mb-4">Order Tracking</p>
              <OrderTrackingTimeline orderStatus={order.order_status} />
            </div>

            {showInvoiceNote && (
              <div className="bg-green-50 text-green-700 text-sm font-medium rounded-lg px-4 py-3 mb-4 text-center">
                Invoice download will be available in an upcoming module.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowInvoiceNote(true)}
                title="Download Invoice"
                className="border-2 border-gray-300 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-50 transition-colors active:scale-95 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>

              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="border-2 border-red-500 text-red-600 font-extrabold py-3 rounded-2xl hover:bg-red-50 transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center text-sm"
                >
                  {cancelling ? "..." : "Cancel"}
                </button>
              )}

              {canReorder && (
                <button
                  onClick={handleReorder}
                  disabled={reordering}
                  className="shimmer-button text-white font-extrabold py-3 rounded-2xl shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center text-sm"
                >
                  {reordering ? "..." : "Reorder"}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;