import { useAdminAuth } from "../../context/AdminAuthContext";

const AdminHeader = ({ onToggleSidebar }) => {
  const { admin } = useAdminAuth();

  return (
    <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Burger Button */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-gray-600 hover:text-green-700 active:scale-95 transition-all bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100"
          title="Open Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <p className="font-heading font-bold text-base md:text-lg text-gray-800">Admin Dashboard</p>
      </div>
      <p className="text-sm text-gray-500">
        Welcome, <span className="font-semibold text-gray-800">{admin?.full_name}</span>
      </p>
    </div>
  );
};

export default AdminHeader;