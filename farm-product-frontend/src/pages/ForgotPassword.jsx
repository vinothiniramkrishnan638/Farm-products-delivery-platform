import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      setLoading(true);
      const res = await api.post("/customer/forgot-password", {
        login_id: loginId,
      });
      setSuccessMessage(res.data.message || "Reset code sent successfully. Check your terminal/device.");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
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
        <p className="text-center text-gray-500 mb-6">Reset your password</p>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {successMessage ? (
          <div className="space-y-4">
            <div className="bg-green-100 text-green-700 text-sm rounded-lg px-3 py-2">
              {successMessage}
            </div>
            <Link
              to="/login"
              className="block w-full text-center bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Mobile Number or Email ID</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter mobile number or email ID"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-green-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
