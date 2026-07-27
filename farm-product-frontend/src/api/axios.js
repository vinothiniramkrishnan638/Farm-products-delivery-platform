import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("customerToken");
    if (token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401){
            localStorage.removeItem("customerToken");
            localStorage.removeItem("customerData");
            window.location.href = "/login";
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
