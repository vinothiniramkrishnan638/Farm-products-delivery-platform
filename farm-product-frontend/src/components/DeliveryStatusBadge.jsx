const deliveryStatusColors={
    Assigned:"bg-gray-100 text-gray-700",
    Accepted:"bg-blue-100 text-blue-700",
    "Picked Up": "bg-orange-100 text-orange-700",
    "Out for Delivery":"bg-purple-100 text-purple-700",
    Delivered:"bg-green-100 text-green-700",
};
const DeliveryStatusBadge =({status})=>{
    return(
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${deliveryStatusColors[status]||"bg-gray-100 text-gray-600"}`}>
              {status}


        </span>
    )
}
export default DeliveryStatusBadge;