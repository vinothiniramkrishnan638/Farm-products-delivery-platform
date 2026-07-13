import {useAuth} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { customer, logoutCustomer } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutCustomer();
        navigate("/login");
    };
    return (
        <div className="bg-gradient-to-r from-green-800 to-green-700 text-white px-4 py-3.5 flex justify-between items-center sticky top-0 z-20 shadow-md border-b border-green-900/10">
            <div>
                <p className="font-extrabold text-lg leading-tight tracking-tight font-heading drop-shadow-sm">Fresh Farm Products</p>
                <p className="text-xs opacity-80">Welcome, {customer?.full_name}</p>
            </div>
            <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold px-4 py-1.5 rounded-xl shadow-sm active:scale-95 transition-all duration-150"
            >
                Logout
            </button>
        </div>
    );
};
export default Header;