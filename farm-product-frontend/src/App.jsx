import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { DeliveryAuthProvider } from "./context/DeliveryAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import DeliveryProtectedRoute from "./components/delivery/DeliveryProtectedRoute";
import DeliveryLayout from "./components/delivery/DeliveryLayout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerDashboard from "./pages/CustomerDashboard";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminDeliveryManagement from "./pages/admin/AdminDeliveryManagement";
import AdminReports from "./pages/admin/AdminReports";
import RoleSelection from "./pages/RoleSelection";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryDashboardHome from "./pages/delivery/DeliveryDashboardHome";
import DeliveryAssignedOrders from "./pages/delivery/DeliveryAssignedOrders";
import DeliveryHistory from "./pages/delivery/DeliveryHistory";
import DeliveryProfile from "./pages/delivery/DeliveryProfile";

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <DeliveryAuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<RoleSelection />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/category/:id"
                  element={
                    <ProtectedRoute>
                      <CategoryProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/product/:id"
                  element={
                    <ProtectedRoute>
                      <ProductDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-success/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-details/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetailsPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboardHome />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:orderId" element={<AdminOrderDetails />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="delivery" element={<AdminDeliveryManagement />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Route>

                <Route path="/delivery/login" element={<DeliveryLogin />} />
                <Route
                  path="/delivery/dashboard"
                  element={
                    <DeliveryProtectedRoute>
                      <DeliveryLayout />
                    </DeliveryProtectedRoute>
                  }
                >
                  <Route index element={<DeliveryDashboardHome />} />
                  <Route path="assigned-orders" element={<DeliveryAssignedOrders />} />
                  <Route path="history" element={<DeliveryHistory />} />
                  <Route path="profile" element={<DeliveryProfile />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </DeliveryAuthProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;