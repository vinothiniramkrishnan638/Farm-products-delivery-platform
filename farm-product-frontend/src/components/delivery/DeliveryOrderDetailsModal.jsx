import { useState, useEffect } from "react";
import { getDeliveryOrderDetails } from "../../api/deliveryApi";

const DeliveryOrderDetailsModal = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDetails();
  }, [orderId]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getDeliveryOrderDetails(orderId);
      setOrder(res.data);
    } catch (err) {
      setError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto p-6">
        <p className="font-bold text-lg text-gray-800 font-heading mb-4">Order Details</p>

        {loading && <p className="text-gray-400 text-sm text-center py-6">Loading...</p>}

        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-3 py-2.5 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && order && (
          <div className="space-y-3 text-sm">
            <p><span className="text-gray-400">Order ID:</span> <span className="font-semibold">{order.order_id}</span></p>
            <p><span className="text-gray-400">Customer:</span> <span className="font-semibold">{order.customer_name}</span></p>
            <p><span className="text-gray-400">Address:</span> <span className="font-semibold">{order.delivery_address}</span></p>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400 mb-2">Items</p>
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span className="text-gray-700">{item.product_name} x {item.quantity}</span>
                  <span className="text-gray-800 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
              <span>Total Amount</span>
              <span className="text-green-700">₹{order.total_amount}</span>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-5 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DeliveryOrderDetailsModal;