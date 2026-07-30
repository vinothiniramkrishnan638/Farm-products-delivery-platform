import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";
import bgImage from "../../assets/farm_background.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAdminAuth();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    console.log("handleSubmit triggered. Event:", e ? e.type : "none");
    if (e && e.preventDefault) {
      e.preventDefault();
      console.log("preventDefault called");
    }
    setError("");
    try {
      setLoading(true);
      const res = await adminLogin(loginId, password);
      loginAdmin(res.data.token, res.data.admin);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login failed:", err);
      setError("Invalid mobile number or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative overflow-hidden animate-slide-in-left"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Background Mask for High Readability */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"></div>

      <div className="w-full max-w-sm rounded-2xl shadow-xl p-6 relative z-10 glass-card animate-bounce-in card-3d-hover">
        <h1 className="text-2xl font-bold text-green-700 text-center mb-1 animate-title-bounce">
          Fresh Farm Products
        </h1>
        <p className="text-center text-gray-600 mb-6 font-medium">Admin Panel Login</p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-3 py-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Mobile Number or Email ID</label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              placeholder="Enter mobile number or email ID"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.82 7.82L21 21m-2.228-2.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold py-2.5 rounded-lg btn-3d disabled:opacity-60 transition-colors shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;