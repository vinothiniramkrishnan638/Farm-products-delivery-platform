import { useState } from "react";
import { Outlet } from "react-router-dom";
import DeliverySidebar from "./DeliverySidebar"
import DeliveryHeader from "./DeliveryHeader";

const DeliveryLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fafbfa]">
      <DeliverySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <DeliveryHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DeliveryLayout;