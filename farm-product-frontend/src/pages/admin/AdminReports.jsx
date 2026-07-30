import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import SummaryCard from "../../components/admin/SummaryCard";
import { getDashboardSummary } from "../../api/adminApi";

const AdminReports = () => {
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
      setError("Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading reports..." />;
  if (error) return <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3">{error}</div>;

  return (
    <div>
      <p className="text-xl font-extrabold text-gray-800 font-heading mb-5">Reports</p>
      <p className="text-sm text-gray-500 mb-5">Detailed analytics and downloadable reports will be available in an upcoming module. Below is a quick summary.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryCard label="Total Orders" value={summary.total_orders} />
        <SummaryCard label="Delivered Orders" value={summary.delivered_orders} color="text-green-600" />
        <SummaryCard label="Total Revenue" value={`₹${summary.total_revenue}`} color="text-green-700" />
      </div>
    </div>
  );
};

export default AdminReports;