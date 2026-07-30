import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import SummaryCard from "../../components/admin/SummaryCard";
import { getDashboardSummary } from "../../api/adminApi";

const AdminDashboardHome = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getDashboardSummary();
      setSummary(res.data);
    } catch (err) {
      setError("Failed to load dashboard summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error) return <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3">{error}</div>;

  return (
    <div>
      <p className="text-xl font-extrabold text-gray-800 font-heading mb-5">Dashboard Overview</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Customers" value={summary.total_customers} />
        <SummaryCard label="Total Categories" value={summary.total_categories} />
        <SummaryCard label="Total Products" value={summary.total_products} />
        <SummaryCard label="Total Orders" value={summary.total_orders} />
        <SummaryCard label="Pending Orders" value={summary.pending_orders} color="text-yellow-600" />
        <SummaryCard label="Delivered Orders" value={summary.delivered_orders} color="text-green-600" />
        <SummaryCard label="Total Revenue" value={`₹${summary.total_revenue}`} color="text-green-700" />
      </div>
    </div>
  );
};

export default AdminDashboardHome;