import { Navigate } from "react-router-dom";
import { useDeliveryAuth } from "../../context/DeliveryAuthContext";

const DeliveryProtectedRoute = ({ children }) => {
    const { partner, loading } = useDeliveryAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-gray-500 font-semibold">Loading...</div>;
    }
    if (!partner) {
        return <Navigate to="/delivery/login" replace />;
    }
    return children;
};

export default DeliveryProtectedRoute;
