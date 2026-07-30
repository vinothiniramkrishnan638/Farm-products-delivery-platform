import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-950 flex flex-col justify-between px-4 py-8 relative overflow-hidden font-sans">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-400/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Section */}
      <div className="w-full max-w-4xl mx-auto text-center z-10">
        <div className="flex items-center justify-center gap-2 mb-2 animate-fade-in-down">
          <svg className="w-10 h-10 text-emerald-400 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m12-9h3.75a2.25 2.25 0 0 1 2.25 2.25V15a2.25 2.25 0 0 1-2.25 2.25H15M9 6H5.25A2.25 2.25 0 0 0 3 8.25v6.75A2.25 2.25 0 0 0 5.25 17.25H9" />
          </svg>
          <span className="font-heading font-extrabold text-3xl tracking-tight text-white drop-shadow-md">
            Fresh Farm Products
          </span>
        </div>
        <p className="text-emerald-100/80 font-medium text-sm md:text-base tracking-wide max-w-md mx-auto drop-shadow">
          Your digital gateway to locally sourced, fresh, and organic farm produce.
        </p>
      </div>

      {/* Selector Cards Container */}
      <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 my-auto z-10 py-8">
        
        {/* Customer Portal Card */}
        <div
          onClick={() => navigate("/login")}
          className="group cursor-pointer bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-400/35 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[300px]"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-300 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all duration-300 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-wide font-heading">
              Customer Portal
            </h2>
            <p className="text-emerald-100/70 text-xs md:text-sm leading-relaxed px-4">
              Browse organic categories, place fresh orders, track live deliveries, and manage your custom profile.
            </p>
          </div>
          <span className="inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 group-hover:text-emerald-200 mt-6 transition-colors">
            Shop Fresh Produce
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>

        {/* Admin Portal Card */}
        <div
          onClick={() => navigate("/admin/login")}
          className="group cursor-pointer bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-8 text-center shadow-2xl hover:shadow-green-500/10 hover:border-green-400/35 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[300px]"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-500/20 text-green-300 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-green-500/30 transition-all duration-300 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-wide font-heading">
              Admin Portal
            </h2>
            <p className="text-emerald-100/70 text-xs md:text-sm leading-relaxed px-4">
              Manage inventory products, handle category additions, update status timelines, and review client transactions.
            </p>
          </div>
          <span className="inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-300 group-hover:text-green-200 mt-6 transition-colors">
            Access Dashboard
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
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
