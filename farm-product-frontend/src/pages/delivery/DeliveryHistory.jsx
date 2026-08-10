import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import { getDeliveryHistory } from "../../api/deliveryApi";

const DeliveryHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getDeliveryHistory();
      setHistory(res.data);
    } catch (err) {
      setError("Failed to load delivery history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading delivery history..." />;

  return (
    <div className="page-fade-in">
      <p className="text-xl font-extrabold text-gray-800 font-heading mb-5">Delivery History</p>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      {history.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-12">No completed deliveries yet.</p>
      ) : (
        <>
          {/* Desktop view table (hidden on mobile, visible on desktop) */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto premium-card animate-fade-up">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-400 text-xs uppercase">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Delivered At</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.assignment_id} className="border-b border-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">{item.order_id}</td>
                    <td className="px-4 py-3 text-gray-600">{item.customer_name}</td>
                    <td className="px-4 py-3 text-gray-600">₹{item.total_amount}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.order_status} /></td>
                    <td className="px-4 py-3 text-gray-600">{item.delivered_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet view card list (visible on mobile, hidden on desktop) */}
          <div className="grid grid-cols-1 gap-4 md:hidden animate-fade-up">
            {history.map((item) => (
              <div key={item.assignment_id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3 premium-card">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Order ID</span>
                    <span className="font-bold text-gray-800">{item.order_id}</span>
                  </div>
                  <StatusBadge status={item.order_status} />
                </div>

                <div className="space-y-1.5 py-2 border-t border-b border-gray-50 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Customer</span>
                    <span className="font-semibold text-gray-700">{item.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Amount</span>
                    <span className="font-bold text-emerald-700">₹{item.total_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Delivered At</span>
                    <span className="text-gray-600">{item.delivered_at}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryHistory;