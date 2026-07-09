import { BrowserRouter,Route,Routes,Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register"
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerDashboard from "./pages/CustomerDashboard";

function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard/>
            </ProtectedRoute>

          }
          />

      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App;