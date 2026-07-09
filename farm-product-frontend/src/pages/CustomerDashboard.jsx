import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CustomerDashboard =() =>{
    const {customer,logoutCustomer}=useAuth();
    const navigate = useNavigate();
    const handleLogout =() =>{
        logoutCustomer();
        navigate("/login");
    };
   
  return (
    <div className="min-h-screen bg-green-50">
      <div className="bg-green-600 text-white px-4 py-4 flex justify-between items-center">
        <div>
          <p className="text-sm opacity-80">Welcome</p>
          <p className="font-semibold">{customer?.full_name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white text-green-700 text-sm font-medium px-3 py-1.5 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <p className="text-xs text-gray-400">Customer ID</p>
          <p className="font-semibold text-gray-800">{customer?.customer_id}</p>
        </div>
        <p className="text-gray-500 text-sm text-center mt-8">
          Products, cart and order tracking will appear here in upcoming modules.
        </p>
      </div>
    </div>
  );
};

export default CustomerDashboard;