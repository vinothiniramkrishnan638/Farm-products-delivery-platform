import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
    // Check if the request URL targets an admin endpoint
    const isAdminRequest = config.url && (config.url.includes("/admin") || config.url.includes("admin/"));
    
    // Choose the appropriate token based on target URL
    const tokenKey = isAdminRequest ? "adminToken" : "customerToken";
    const token = localStorage.getItem(tokenKey);
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname;
            if (currentPath === "/admin/login" || currentPath === "/login") {
                return Promise.reject(error);
            }
            // Determine if the failed request was an admin request or we are currently on an admin page path
            const isAdminPath = currentPath.startsWith("/admin");
            if (isAdminPath) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminData");
                window.location.href = "/admin/login";
            } else {
                localStorage.removeItem("customerToken");
                localStorage.removeItem("customerData");
                window.location.href = "/login";
            }
        }
        if (error.response && error.response.data && error.response.data.detail) {
            const detail = error.response.data.detail;
            if (Array.isArray(detail)) {
                error.response.data.detail = detail.map(d => d.msg).join(", ");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
