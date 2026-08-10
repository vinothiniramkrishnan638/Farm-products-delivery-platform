import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getAdminOrders } from "../../api/adminApi";
import {assignOrderToPartner} from "../../api/deliveryApi"

const AssignOrderModal = ({ partner, onClose, onAssigned }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getAdminOrders();
      // Only show orders that are currently in "Pending" status for assignment
      const pendingOrders = res.data.filter(order => order.order_status === "Pending");
      setOrders(pendingOrders);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedOrderId) {
      setError("Please select an order.");
      return;
    }
    try {
      setAssigning(true);
      setError("");
      await assignOrderToPartner(selectedOrderId, partner.id);
      onAssigned(selectedOrderId);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to assign order.");
    } finally {
      setAssigning(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50 animate-fade-up">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <p className="font-bold text-lg text-gray-800 font-heading mb-4">
          Assign Order to {partner.name}
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-3 py-2.5 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-sm text-center py-6">Loading orders...</p>
        ) : (
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an order</option>
            {orders.map((order) => (
              <option key={order.order_id} value={order.order_id}>
                {order.order_id} - {order.customer_name} - ₹{order.total_amount}
              </option>
            ))}
          </select>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={assigning}
            className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {assigning ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AssignOrderModal;