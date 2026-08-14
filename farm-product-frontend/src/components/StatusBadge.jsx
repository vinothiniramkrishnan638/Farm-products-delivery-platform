const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-orange-100 text-orange-700",
  "Picked Up": "bg-cyan-100 text-cyan-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

export default StatusBadge;