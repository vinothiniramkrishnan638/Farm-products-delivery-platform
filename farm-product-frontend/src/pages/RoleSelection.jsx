import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";

const RoleSelection = () => {
  const navigate = useNavigate();

  // Mouse coordinates tracking for Customer card 3D tilt
  const customerX = useMotionValue(150);
  const customerY = useMotionValue(150);
  const customerRotateX = useTransform(customerY, [0, 300], [12, -12]);
  const customerRotateY = useTransform(customerX, [0, 300], [-12, 12]);

  // Mouse coordinates tracking for Admin card 3D tilt
  const adminX = useMotionValue(150);
  const adminY = useMotionValue(150);
  const adminRotateX = useTransform(adminY, [0, 300], [12, -12]);
  const adminRotateY = useTransform(adminX, [0, 300], [-12, 12]);

  // Mouse coordinates tracking for Delivery Partner card 3D tilt
  const deliveryX = useMotionValue(150);
  const deliveryY = useMotionValue(150);
  const deliveryRotateX = useTransform(deliveryY, [0, 300], [12, -12]);
  const deliveryRotateY = useTransform(deliveryX, [0, 300], [-12, 12]);

  // Mouse coordinates tracking for Left 3D Showcase card
  const leftX = useMotionValue(175);
  const leftY = useMotionValue(200);
  const leftRotateX = useTransform(leftY, [0, 400], [15, -15]);
  const leftRotateY = useTransform(leftX, [0, 350], [-15, 15]);

  const handleCustomerMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    customerX.set(e.clientX - rect.left);
    customerY.set(e.clientY - rect.top);
  };

  const handleCustomerMouseLeave = () => {
    customerX.set(150);
    customerY.set(150);
  };

  const handleAdminMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    adminX.set(e.clientX - rect.left);
    adminY.set(e.clientY - rect.top);
  };

  const handleAdminMouseLeave = () => {
    adminX.set(150);
    adminY.set(150);
  };

  const handleDeliveryMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    deliveryX.set(e.clientX - rect.left);
    deliveryY.set(e.clientY - rect.top);
  };

  const handleDeliveryMouseLeave = () => {
    deliveryX.set(150);
    deliveryY.set(150);
  };

  const handleLeftMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    leftX.set(e.clientX - rect.left);
    leftY.set(e.clientY - rect.top);
  };

  const handleLeftMouseLeave = () => {
    leftX.set(175);
    leftY.set(200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-950 flex flex-col justify-between px-4 py-8 relative overflow-hidden font-sans">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-400/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Container combining Left and Right columns */}
      <div className="w-full max-w-7xl mx-auto my-auto flex flex-col lg:flex-row items-center justify-center gap-6 z-10 py-6">
        
        {/* Left Column: Local Interactive 3D Parallax Showcase */}
        <div 
          onMouseMove={handleLeftMouseMove}
          onMouseLeave={handleLeftMouseLeave}
          className="w-full lg:w-[35%] h-[380px] lg:h-[440px] bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 flex items-center justify-center relative shadow-2xl cursor-pointer select-none perspective-[1000px]"
        >
          <motion.div
            style={{
              rotateX: leftRotateX,
              rotateY: leftRotateY,
              transformStyle: "preserve-3d",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="w-[280px] h-[280px] relative flex items-center justify-center"
          >
            {/* Ambient Background Glow (translateZ: -50px) */}
            <div 
              style={{ transform: "translateZ(-50px)" }}
              className="absolute w-[200px] h-[200px] bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"
            />

            {/* Concentric Rotating Dash Ring (translateZ: -20px) */}
            <motion.div
              style={{ transform: "translateZ(-20px)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-[220px] h-[220px] rounded-full border border-dashed border-emerald-500/20 pointer-events-none"
            />

            {/* Background 3D Parallax Bubbles */}
            <motion.div
              style={{ transform: "translateZ(-30px)" }}
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-10 w-3 h-3 bg-emerald-400/20 rounded-full blur-[1px]"
            />
            <motion.div
              style={{ transform: "translateZ(-60px)" }}
              animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-16 right-12 w-4 h-4 bg-teal-400/15 rounded-full blur-[2px]"
            />
            <motion.div
              style={{ transform: "translateZ(30px)" }}
              animate={{ y: [0, -8, 0], x: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-16 right-16 w-2.5 h-2.5 bg-green-400/30 rounded-full"
            />
            <motion.div
              style={{ transform: "translateZ(-15px)" }}
              animate={{ y: [0, 10, 0], x: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-12 left-14 w-3.5 h-3.5 bg-emerald-300/20 rounded-full blur-[1px]"
            />

            {/* Glassmorphic Central Plate (translateZ: 0px) */}
            <div 
              style={{ transform: "translateZ(0px)" }}
              className="w-[180px] h-[180px] bg-gradient-to-br from-emerald-950/45 to-teal-950/45 backdrop-blur-xl rounded-full border border-white/15 shadow-2xl flex flex-col items-center justify-center text-center p-4"
            >
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center mb-2.5 border border-emerald-500/30">
                <span className="text-xl">🌱</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-300 font-heading">Fresh Products</h3>
              <p className="text-[10px] text-white/70 mt-1.5 leading-relaxed px-1">
                Tilt or hover to explore organic categories
              </p>
            </div>

            {/* Orbiting Item 1: Milk & Dairy (translateZ: 40px) */}
            <motion.div
              style={{ transform: "translateZ(40px)" }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 bg-emerald-600/90 text-white font-extrabold px-3.5 py-1.5 rounded-full border border-emerald-400 shadow-xl text-xs flex items-center gap-1.5"
            >
              <span>🥛</span> Milk &amp; Dairy
            </motion.div>

            {/* Orbiting Item 2: Country Chicken (translateZ: 45px) */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="absolute top-2 -right-4 bg-green-600/90 text-white font-extrabold px-3.5 py-1.5 rounded-full border border-green-400 shadow-xl text-xs flex items-center gap-1.5"
            >
              <span>🐔</span> Country Chicken
            </motion.div>

            {/* Orbiting Item 3: Goat & Meat (translateZ: 55px) */}
            <motion.div
              style={{ transform: "translateZ(55px)" }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute bottom-[28%] -left-16 bg-emerald-700/95 text-white font-extrabold px-3.5 py-1.5 rounded-full border border-emerald-400 shadow-xl text-xs flex items-center gap-1.5"
            >
              <span>🐐</span> Goat &amp; Meat
            </motion.div>

            {/* Orbiting Item 4: Fresh Seafood (translateZ: 50px) */}
            <motion.div
              style={{ transform: "translateZ(50px)" }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute top-1/2 -right-16 -translate-y-1/2 bg-green-600/90 text-white font-extrabold px-3.5 py-1.5 rounded-full border border-green-400 shadow-xl text-xs flex items-center gap-1.5"
            >
              <span>🐟</span> Fresh Seafood
            </motion.div>

            {/* Orbiting Item 5: Country Eggs (translateZ: 60px) */}
            <motion.div
              style={{ transform: "translateZ(60px)" }}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute -bottom-6 -right-6 bg-teal-600/90 text-white font-extrabold px-3.5 py-1.5 rounded-full border border-teal-400 shadow-xl text-xs flex items-center gap-1.5"
            >
              <span>🥚</span> Country Eggs
            </motion.div>

          </motion.div>
        </div>

        {/* Right Column: Portal Cards and Header */}
        <div className="w-full lg:w-[65%] flex flex-col justify-between gap-4">
          {/* Header Section */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
              <svg className="w-9 h-9 text-emerald-400 drop-shadow-md animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m12-9h3.75a2.25 2.25 0 0 1 2.25 2.25V15a2.25 2.25 0 0 1-2.25 2.25H15M9 6H5.25A2.25 2.25 0 0 0 3 8.25v6.75A2.25 2.25 0 0 0 5.25 17.25H9" />
              </svg>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white drop-shadow-md">
                Fresh Farm Products
              </span>
            </div>
            <p className="text-emerald-100/80 font-medium text-xs md:text-sm tracking-wide max-w-md mx-auto lg:mx-0 drop-shadow">
              Your digital gateway to locally sourced, fresh, and organic farm produce.
            </p>
          </div>

          {/* Selector Cards Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 py-2 perspective-[1000px]">
            
            {/* Customer Portal Card */}
            <motion.div
              style={{
                rotateX: customerRotateX,
                rotateY: customerRotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleCustomerMouseMove}
              onMouseLeave={handleCustomerMouseLeave}
              onClick={() => navigate("/login")}
              className="group cursor-pointer bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 text-center shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-400/35 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[260px]"
            >
              <div className="space-y-3">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-300 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all duration-300 shadow-inner">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-extrabold text-white tracking-wide font-heading">
                  Customer Portal
                </h2>
                <p className="text-emerald-100/70 text-xs leading-relaxed px-2">
                  Browse organic categories, place fresh orders, track live deliveries, and manage your custom profile.
                </p>
              </div>
              <span className="inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 group-hover:text-emerald-200 mt-4 transition-colors">
                Shop Fresh Produce
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </motion.div>

            {/* Admin Portal Card */}
            <motion.div
              style={{
                rotateX: adminRotateX,
                rotateY: adminRotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleAdminMouseMove}
              onMouseLeave={handleAdminMouseLeave}
              onClick={() => navigate("/admin/login")}
              className="group cursor-pointer bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 text-center shadow-2xl hover:shadow-green-500/10 hover:border-green-400/35 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[260px]"
            >
              <div className="space-y-3">
                <div className="w-14 h-14 bg-green-500/20 text-green-300 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-green-500/30 transition-all duration-300 shadow-inner">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                  </svg>
                </div>
                <h2 className="text-lg font-extrabold text-white tracking-wide font-heading">
                  Admin Portal
                </h2>
                <p className="text-emerald-100/70 text-xs leading-relaxed px-2">
                  Manage inventory products, handle category additions, update status timelines, and review client transactions.
                </p>
              </div>
              <span className="inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-300 group-hover:text-green-200 mt-4 transition-colors">
                Access Dashboard
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </motion.div>

            {/* Delivery Partner Portal Card */}
            <motion.div
              style={{
                rotateX: deliveryRotateX,
                rotateY: deliveryRotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleDeliveryMouseMove}
              onMouseLeave={handleDeliveryMouseLeave}
              onClick={() => navigate("/delivery/login")}
              className="group cursor-pointer bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 text-center shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/35 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[260px]"
            >
              <div className="space-y-3">
                <div className="w-14 h-14 bg-blue-500/20 text-blue-300 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-blue-500/30 transition-all duration-300 shadow-inner">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.12-1.014L1.5 12.75c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125l-.755 4.986a1.125 1.125 0 0 1-1.12 1.014H15m0 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75m4.5-6H3m16.5 0a3.75 3.75 0 0 0-3.75-3.75H13.5m-3 0V5.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V8.25M6.75 12h.008v.008H6.75V12Zm0-3h.008v.008H6.75V9Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-extrabold text-white tracking-wide font-heading">
                  Delivery Partner
                </h2>
                <p className="text-blue-100/70 text-xs leading-relaxed px-2">
                  Access assigned delivery runs, update routing status timelines, and review your history.
                </p>
              </div>
              <span className="inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-300 group-hover:text-blue-200 mt-4 transition-colors">
                Start Delivering
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </motion.div>

          </div>
        </div>

      </div>

      {/* Footer Section */}
      <div className="w-full text-center z-10">
        <p className="text-xs text-emerald-200/50 tracking-wider">
          &copy; {new Date().getFullYear()} Fresh Farm Products. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
