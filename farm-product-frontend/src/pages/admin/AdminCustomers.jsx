import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { getAdminCustomers, toggleCustomerStatus } from "../../api/adminApi";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingCustomer, setViewingCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminCustomers();
      setCustomers(res.data);
    } catch (err) {
      setError("Failed to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (customerId) => {
    try {
      await toggleCustomerStatus(customerId);
      await loadCustomers();
    } catch (err) {
      setError("Failed to update customer status.");
    }
  };

  if (loading) return <Loader text="Loading customers..." />;

  return (
    <div>
      <p className="text-xl font-extrabold text-gray-800 font-heading mb-5">Customer Management</p>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      {/* Desktop view table (hidden on mobile, visible on desktop) */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-400 text-xs uppercase">
              <th className="px-4 py-3">Customer ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Village</th>
              <th className="px-4 py-3">Total Orders</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customer_id} className="border-b border-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{customer.customer_id}</td>
                <td className="px-4 py-3 text-gray-600">{customer.full_name}</td>
                <td className="px-4 py-3 text-gray-600">{customer.mobile_number}</td>
                <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                <td className="px-4 py-3 text-gray-600">{customer.village}</td>
                <td className="px-4 py-3 text-gray-600">{customer.total_orders}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setViewingCustomer(customer)} 
                      className="p-1.5 rounded-lg text-green-700 hover:bg-green-50 transition-colors" 
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(customer.customer_id)} 
                      className="text-xs font-semibold text-blue-600 hover:underline px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      {customer.status === "active" ? "Disable" : "Enable"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No customers found.</p>}
      </div>

      {/* Mobile/Tablet view card list (visible on mobile, hidden on desktop) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {customers.map((customer) => (
          <div key={customer.customer_id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">CUSTOMER ID</span>
                <span className="font-bold text-gray-800">{customer.customer_id}</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${customer.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {customer.status || "active"}
              </span>
            </div>

            <div className="space-y-1.5 py-2 border-t border-b border-gray-50 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Name</span>
                <span className="font-semibold text-gray-700">{customer.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Mobile</span>
                <span className="font-semibold text-gray-600">{customer.mobile_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Email</span>
                <span className="font-semibold text-gray-600 truncate max-w-[180px]">{customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Village</span>
                <span className="font-semibold text-gray-600">{customer.village}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Total Orders</span>
                <span className="font-bold text-emerald-700">{customer.total_orders}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end items-center pt-1 border-t border-gray-50">
              <button 
                onClick={() => setViewingCustomer(customer)} 
                className="p-2 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 border border-green-100 transition-colors"
                title="View Details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
              <button 
                onClick={() => handleToggleStatus(customer.customer_id)} 
                className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-100 transition-colors"
              >
                {customer.status === "active" ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
        {customers.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No customers found.</p>}
      </div>

      {viewingCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
            <p className="font-bold text-lg text-gray-800 font-heading mb-4">Customer Details</p>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Customer ID:</span> <span className="font-semibold">{viewingCustomer.customer_id}</span></p>
              <p><span className="text-gray-400">Name:</span> <span className="font-semibold">{viewingCustomer.full_name}</span></p>
              <p><span className="text-gray-400">Mobile:</span> <span className="font-semibold">{viewingCustomer.mobile_number}</span></p>
              <p><span className="text-gray-400">Email:</span> <span className="font-semibold">{viewingCustomer.email}</span></p>
              <p><span className="text-gray-400">Village:</span> <span className="font-semibold">{viewingCustomer.village}</span></p>
              <p><span className="text-gray-400">Total Orders:</span> <span className="font-semibold">{viewingCustomer.total_orders}</span></p>
            </div>
            <button
              onClick={() => setViewingCustomer(null)}
              className="w-full mt-5 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;