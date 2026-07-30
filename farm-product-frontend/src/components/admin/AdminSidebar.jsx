import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Categories", path: "/admin/dashboard/categories" },
  { label: "Products", path: "/admin/dashboard/products" },
  { label: "Orders", path: "/admin/dashboard/orders" },
  { label: "Customers", path: "/admin/dashboard/customers" },
  { label: "Delivery Management", path: "/admin/dashboard/delivery" },
  { label: "Reports", path: "/admin/dashboard/reports" },
  { label: "Profile", path: "/admin/dashboard/profile" },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    if (onClose) onClose();
    navigate("/admin/login");
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-3 mb-6">
        <p className="font-heading font-extrabold text-lg text-white">Fresh Farm Admin</p>
        {/* Mobile Sidebar Close Button */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 text-green-100 hover:text-white rounded-lg hover:bg-white/10 active:scale-95 transition-all"
          title="Close Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin/dashboard"}
            onClick={() => {
              if (onClose) onClose();
            }}
            className={({ isActive }) =>
              `text-sm font-semibold px-3 py-2.5 rounded-lg transition-colors ${
                isActive ? "bg-white/15 text-white" : "text-green-100/80 hover:bg-white/10"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="text-sm font-bold px-3 py-2.5 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors mt-4 shrink-0"
      >
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop static vertical sidebar (hidden on mobile, visible from md up) */}
      <div className="hidden md:flex w-64 bg-gradient-to-b from-green-900 to-emerald-950 text-white min-h-screen flex-col py-6 px-3 shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer frosted backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 md:hidden animate-fade-in"
          onClick={onClose}
        ></div>
      )}

      {/* Mobile sliding Drawer (hidden on desktop, slides in from left on mobile) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-900 to-emerald-950 text-white flex flex-col py-6 px-3 shadow-2xl md:hidden transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default AdminSidebar;