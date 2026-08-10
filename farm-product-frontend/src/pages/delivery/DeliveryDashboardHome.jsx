import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import SummaryCard from "../../components/admin/SummaryCard";
import { getDeliveryDashboardSummary } from "../../api/deliveryApi";

const DeliveryDashboardHome = () => {
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
      const res = await getDeliveryDashboardSummary();
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
    <div className="page-fade-in">
      <p className="text-xl font-extrabold text-gray-800 font-heading mb-5 animate-title-bounce">Dashboard Overview</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up">
        <SummaryCard label="Today's Deliveries" value={summary.today_deliveries} color="text-blue-600" theme="blue" />
        <SummaryCard label="Pending Deliveries" value={summary.pending_deliveries} color="text-orange-600" theme="blue" />
        <SummaryCard label="Completed Deliveries" value={summary.completed_deliveries} color="text-green-600" theme="blue" />
      </div>
    </div>
  );
};

export default DeliveryDashboardHome;