import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import DeliveryStatusBadge from "../../components/DeliveryStatusBadge";
import { getMyAssignedOrders, updateDeliveryAssignmentStatus } from "../../api/deliveryApi";

const nextStatusMap = {
  Assigned: {
    label: "Accept Delivery",
    next: "Accepted",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    )
  },
  Accepted: {
    label: "Picked Up",
    next: "Picked Up",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    )
  },
  "Picked Up": {
    label: "Out for Delivery",
    next: "Out for Delivery",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.12-1.014L1.5 12.75c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125l-.755 4.986a1.125 1.125 0 0 1-1.12 1.014H15m0 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75m4.5-6H3m16.5 0a3.75 3.75 0 0 0-3.75-3.75H13.5m-3 0V5.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V8.25" />
      </svg>
    )
  },
  "Out for Delivery": {
    label: "Delivered",
    next: "Delivered",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    )
  }
};

const DeliveryAssignedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyAssignedOrders();
      setOrders(res.data);
    } catch (err) {
      setError("Failed to load assigned orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (assignmentId, nextStatus) => {
    try {
      setUpdatingId(assignmentId);
      setError("");
      await updateDeliveryAssignmentStatus(assignmentId, nextStatus);
      await loadOrders();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update delivery status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader text="Loading assigned orders..." />;

  return (
    <div className="page-fade-in">
      <p className="text-xl font-extrabold text-gray-800 font-heading mb-5">Assigned Orders</p>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-12">No orders assigned to you right now.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 animate-fade-up">
          {orders.map((order) => {
            const action = nextStatusMap[order.delivery_status];
            return (
              <motion.div
                key={order.assignment_id}
                whileHover={{ scale: 1.015, translateY: -4, boxShadow: "0px 15px 30px rgba(59, 130, 246, 0.08)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3 premium-card transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Order ID</span>
                    <span className="font-bold text-gray-800">{order.order_id}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <DeliveryStatusBadge status={order.delivery_status} />
                    <StatusBadge status={order.order_status} />
                  </div>
                </div>

                <div className="space-y-1.5 py-2 border-t border-b border-gray-50 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Customer</span>
                    <span className="font-semibold text-gray-700">{order.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Mobile</span>
                    <span className="font-semibold text-gray-600">{order.customer_mobile}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block">Delivery Address</span>
                    <span className="font-medium text-gray-600">{order.delivery_address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Order Amount</span>
                    <span className="font-bold text-emerald-700">₹{order.total_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Payment</span>
                    <span className="font-semibold text-gray-600 uppercase text-xs">{order.payment_method}</span>
                  </div>
                </div>

                {action && (
                  <button
                    onClick={() => handleUpdateStatus(order.assignment_id, action.next)}
                    disabled={updatingId === order.assignment_id}
                    className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    {updatingId === order.assignment_id ? (
                      "Updating..."
                    ) : (
                      <>
                        {action.icon}
                        {action.label}
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeliveryAssignedOrders;