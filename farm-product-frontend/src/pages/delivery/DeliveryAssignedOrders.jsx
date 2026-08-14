import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import DeliveryStatusBadge from "../../components/DeliveryStatusBadge";
import DeliveryOrderDetailsModal from "../../components/delivery/DeliveryOrderDetailsModal";
import {
  getMyAssignedOrders,
  updateDeliveryAssignmentStatus,
} from "../../api/deliveryApi";

const nextStatusMap = {
  Assigned: {
    label: "Accept",
    next: "Accepted",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },

  Accepted: {
    label: "Pickup",
    next: "Picked Up",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5 12 3 3.75 7.5m16.5 0v9L12 21l-8.25-4.5v-9M12 21V12m8.25-4.5L12 12 3.75 7.5"
        />
      </svg>
    ),
  },

  "Picked Up": {
    label: "Transit",
    next: "Out for Delivery",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM15.75 18.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM3 6h11.25v9.75H3V6ZM14.25 9h3.75l3 3.75v3H14.25V9Z"
        />
      </svg>
    ),
  },

  "Out for Delivery": {
    label: "Deliver",
    next: "Delivered",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
};

const DeliveryAssignedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [viewingOrderId, setViewingOrderId] = useState(null);

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
      setError(
        err.response?.data?.detail ||
          "Failed to update delivery status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Assigned Orders
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-12">
          No orders assigned to you right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 animate-fade-up">
          {orders.map((order) => {
            const action = nextStatusMap[order.delivery_status];

            return (
              <motion.div
                key={order.assignment_id}
                whileHover={{
                  scale: 1.015,
                  translateY: -4,
                  boxShadow:
                    "0px 15px 30px rgba(59, 130, 246, 0.08)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3 premium-card transition-all duration-300"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">
                      Order ID
                    </span>

                    <span className="font-bold text-gray-800">
                      {order.order_id}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <DeliveryStatusBadge
                      status={order.delivery_status}
                    />

                    <StatusBadge status={order.order_status} />
                  </div>
                </div>

                {/* Order Information */}
                <div className="space-y-1.5 py-2 border-t border-b border-gray-50 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">
                      Customer
                    </span>

                    <span className="font-semibold text-gray-700">
                      {order.customer_name}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">
                      Mobile
                    </span>

                    <span className="font-semibold text-gray-600">
                      {order.customer_mobile}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 text-xs block">
                      Delivery Address
                    </span>

                    <span className="font-medium text-gray-600">
                      {order.delivery_address}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">
                      Order Amount
                    </span>

                    <span className="font-bold text-emerald-700">
                      ₹{order.total_amount}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">
                      Payment
                    </span>

                    <span className="font-semibold text-gray-600 uppercase text-xs">
                      {order.payment_method}
                    </span>
                  </div>
                </div>

                {/* Call Customer + View Details */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${order.customer_mobile}`}
                    title="Call Customer"
                    className="flex items-center justify-center border-2 border-blue-600 text-blue-700 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                  </a>

                  <button
                    onClick={() =>
                      setViewingOrderId(order.order_id)
                    }
                    className="border-2 border-gray-300 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                  >
                    Details
                  </button>
                </div>

                {/* Status Update Button */}
                {action && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        order.assignment_id,
                        action.next
                      )
                    }
                    disabled={
                      updatingId === order.assignment_id
                    }
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

      {/* Order Details Modal */}
      {viewingOrderId && (
        <DeliveryOrderDetailsModal
          orderId={viewingOrderId}
          onClose={() => setViewingOrderId(null)}
        />
      )}
    </div>
  );
};

export default DeliveryAssignedOrders;