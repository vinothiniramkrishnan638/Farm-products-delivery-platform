import { NavLink, useNavigate } from "react-router-dom";
import { useDeliveryAuth } from "../../context/DeliveryAuthContext";

const menuItems = [
  { label: "Dashboard", path: "/delivery/dashboard" },
  { label: "Assigned Orders", path: "/delivery/dashboard/assigned-orders" },
  { label: "Delivery History", path: "/delivery/dashboard/history" },
  { label: "Profile", path: "/delivery/dashboard/profile" },
];
const DeliverySidebar = ({ isOpen, onClose }) => {
    const { logoutPartner } = useDeliveryAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutPartner();
        if (onClose) onClose();
        navigate("/delivery/login");
    };

    const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-3 mb-6">
        <p className="font-heading font-extrabold text-lg text-white">Fresh Farm Delivery</p>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-white/10 active:scale-95 transition-all"
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
            end={item.path === "/delivery/dashboard"}
            onClick={() => {
              if (onClose) onClose();
            }}
            className={({ isActive }) =>
              `text-sm font-semibold px-3 py-2.5 rounded-lg transition-colors ${
                isActive ? "bg-white/15 text-white" : "text-blue-100/80 hover:bg-white/10"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="text-sm font-bold px-3 py-2.5 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors mt-4 shrink-0 flex items-center justify-center gap-1.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
        </svg>
        Logout
      </button>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex w-64 bg-gradient-to-b from-blue-900 to-cyan-950 text-white min-h-screen flex-col py-6 px-3 shrink-0">
        {sidebarContent}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 md:hidden animate-fade-in"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-cyan-950 text-white flex flex-col py-6 px-3 shadow-2xl md:hidden transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}

export default DeliverySidebar;