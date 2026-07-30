import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import bgImage from "../assets/farm_background.png";

const Login = () => {
  const navigate = useNavigate();
  const { loginCustomer } = useAuth();

  const [method, setMethod] = useState("password");
  const [loginId, setLoginId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [testOtp, setTestOtp] = useState("");

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await api.post("/customer/login", {
        login_id: loginId,
        password,
      });
      loginCustomer(res.data.token, res.data.customer);
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError("");
    setReceivedOtp("");
    if (mobileNumber.length !== 10) {
      setError("Enter a valid 10 digit mobile number");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/customer/send-otp", { mobile_number: mobileNumber });
      setReceivedOtp(res.data.otp || "");
      setOtpSent(true);
      if (res.data && res.data.otp) {
        setTestOtp(res.data.otp);
        console.log("DEMO OTP GENERATED:", res.data.otp);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await api.post("/customer/verify-otp", {
        mobile_number: mobileNumber,
        otp,
      });
      loginCustomer(res.data.token, res.data.customer);
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid OTP");
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
        <p className="text-center text-gray-600 mb-6 font-medium">Login to your account</p>

        <div className="flex mb-5 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setMethod("password");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              method === "password" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Password
          </button>
          <button
            onClick={() => {
              setMethod("otp");
              setError("");
              setOtpSent(false);
              setReceivedOtp("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              method === "otp" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            OTP
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-3 py-2.5 mb-4">
            {error}
          </div>
        )}

        {method === "password" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Mobile Number or Email ID</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                autoComplete="username"
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
                  autoComplete="current-password"
                  className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
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
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm font-semibold text-green-700 hover:text-green-800 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold py-2.5 rounded-lg btn-3d disabled:opacity-60 transition-colors shadow-md"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Mobile Number</label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                maxLength={10}
                disabled={otpSent}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:bg-gray-100"
                placeholder="10 digit mobile number"
              />
            </div>

            {testOtp && (
              <div className="bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg p-2.5 mb-2 text-center font-semibold animate-pulse">
                🔑 Test OTP: <span className="text-base select-all tracking-wider font-extrabold">{testOtp}</span>
              </div>
            )}

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold py-2.5 rounded-lg btn-3d disabled:opacity-60 transition-colors shadow-md"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <>
                {receivedOtp && (
                  <div className="bg-yellow-100 text-yellow-800 text-center text-lg font-bold rounded-lg px-3 py-3 tracking-widest">
                    {receivedOtp}
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    placeholder="6 digit OTP"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold py-2.5 rounded-lg btn-3d disabled:opacity-60 transition-colors shadow-md"
                >
                  {loading ? "Verifying..." : "Verify OTP & Login"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setReceivedOtp("");
                  }}
                  className="w-full text-sm font-semibold text-gray-500 hover:text-gray-700"
                >
                  Change Mobile Number
                </button>
              </>
            )}
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-700 hover:text-green-800 font-bold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
