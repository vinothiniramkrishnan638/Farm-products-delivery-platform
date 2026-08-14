const trackingSteps = [
  "Order Placed",
  "Order Confirmed",
  "Preparing",
  "Picked Up",
  "Out for Delivery",
  "Delivered",
];

const statusToStepIndex = {
  Pending: 0,
  Confirmed: 1,
  Preparing: 2,
  "Picked Up": 3,
  "Out for Delivery": 4,
  Delivered: 5,
};

const OrderTrackingTimeline = ({ orderStatus }) => {
  if (orderStatus === "Cancelled") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-700 font-bold">This order has been cancelled.</p>
      </div>
    );
  }

  const currentStepIndex = statusToStepIndex[orderStatus] ?? 0;

  return (
    <div className="space-y-0">
      {trackingSteps.map((step, index) => {
        const isCompleted = index <= currentStepIndex;
        const isLast = index === trackingSteps.length - 1;

        return (
          <div key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isCompleted ? "bg-green-600 text-white" : "bg-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-7 ${isCompleted && index < currentStepIndex ? "bg-green-600" : "bg-gray-200"}`}></div>
              )}
            </div>
            <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
              <p className={`text-sm font-semibold ${isCompleted ? "text-gray-800" : "text-gray-400"}`}>
                {step}
              </p>
              {index === currentStepIndex && (
                <p className="text-xs text-green-700 font-semibold mt-0.5">Current Status</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTrackingTimeline;