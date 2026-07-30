import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import { getAdminOrders } from "../../api/adminApi";

const AdminOrders = () => {
  const navigate = useNavigate();
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
      const res = await getAdminOrders();
      setOrders(res.data);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading orders..." />;

  return (
    <div>
      <p className="text-xl font-extrabold text-gray-800 font-heading mb-5">Order Management</p>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      {/* Desktop view table (hidden on mobile, visible on desktop) */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-400 text-xs uppercase">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="border-b border-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{order.order_id}</td>
                <td className="px-4 py-3 text-gray-600">{order.customer_name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {order.items?.[0]?.product_name}
                  {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                </td>
                <td className="px-4 py-3 text-gray-600">₹{order.total_amount}</td>
                <td className="px-4 py-3 text-gray-600">{order.payment_method}</td>
                <td className="px-4 py-3"><StatusBadge status={order.order_status} /></td>
                <td className="px-4 py-3 text-gray-600">{order.created_at}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => navigate(`/admin/dashboard/orders/${order.order_id}`)}
                    className="p-1.5 rounded-lg text-green-700 hover:bg-green-50 transition-colors flex items-center justify-center"
                    title="View Details"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No orders found.</p>}
      </div>

      {/* Mobile/Tablet view card list (visible on mobile, hidden on desktop) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders.map((order) => (
          <div key={order.order_id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">ORDER ID</span>
                <span className="font-bold text-gray-800">{order.order_id}</span>
              </div>
              <StatusBadge status={order.order_status} />
            </div>

            <div className="space-y-1.5 py-2 border-t border-b border-gray-50 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Customer</span>
                <span className="font-semibold text-gray-700">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Products</span>
                <span className="font-medium text-gray-600 text-right max-w-[180px] truncate">
                  {order.items?.[0]?.product_name}
                  {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Total Amount</span>
                <span className="font-bold text-emerald-700">₹{order.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Payment</span>
                <span className="font-semibold text-gray-600 uppercase text-xs bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Date</span>
                <span className="text-gray-600">{order.created_at}</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => navigate(`/admin/dashboard/orders/${order.order_id}`)}
                className="w-full flex items-center justify-center gap-1.5 text-sm font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-100 px-4 py-2 rounded-lg transition-colors"
                title="View Details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                View Details
              </button>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No orders found.</p>}
      </div>
    </div>
  );
};

export default AdminOrders;