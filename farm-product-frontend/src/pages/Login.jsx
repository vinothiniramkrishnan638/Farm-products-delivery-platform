import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginCustomer } = useAuth();

  const [method, setMethod] = useState("password");
  const [loginId, setLoginId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (mobileNumber.length !== 10) {
      setError("Enter a valid 10 digit mobile number");
      return;
    }
    try {
      setLoading(true);
      await api.post("/customer/send-otp", { mobile_number: mobileNumber });
      setOtpSent(true);
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
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-green-700 text-center mb-1">
          Fresh Farm Products
        </h1>
        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        <div className="flex mb-5 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setMethod("password");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              method === "password" ? "bg-green-600 text-white" : "text-gray-500"
            }`}
          >
            Password
          </button>
          <button
            onClick={() => {
              setMethod("otp");
              setError("");
              setOtpSent(false);
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              method === "otp" ? "bg-green-600 text-white" : "text-gray-500"
            }`}
          >
            OTP
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {method === "password" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Mobile Number or Email ID</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                autoComplete="username"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter mobile number or email ID"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your password"
              />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-green-600">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Mobile Number</label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                maxLength={10}
                disabled={otpSent}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                placeholder="10 digit mobile number"
              />
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <>
                <div>
                  <label className="text-sm text-gray-600">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="6 digit OTP"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-sm text-gray-500"
                >
                  Change Mobile Number
                </button>
              </>
            )}
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;