import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { getOrderDetails } from "../api/orderApi";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-orange-100 text-orange-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    loadOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#fafbfa] flex flex-col page-fade-in">
      <Header />
      <Navbar />

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        {loading && <Loader text="Loading order details..." />}

        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && order && (
          <>
            <div className="text-center mb-6 animate-bounce-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-800 font-heading">Order Placed Successfully!</p>
              <p className="text-gray-500 text-sm mt-1">Thank you for shopping with Fresh Farm Products</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-bold text-gray-800">{order.order_id}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[order.order_status] || "bg-gray-100 text-gray-600"}`}>
                  {order.order_status}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-400">Order Date</p>
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

              <div>
                <p className="text-xs text-gray-400">Payment Method</p>
                <p className="font-semibold text-gray-800">
                  {order.payment_method === "COD" ? "Cash on Delivery" : "Online Payment"}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-400 mb-2">Items Ordered</p>
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.product_name} x {item.quantity}</span>
                      <span className="text-gray-800 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
                <span>Total Amount</span>
                <span className="text-green-700">₹{order.total_amount}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/customer/dashboard")}
              className="w-full shimmer-button text-white font-bold py-3.5 rounded-2xl shadow-sm mt-6"
            >
              Shop
            </button>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccess;