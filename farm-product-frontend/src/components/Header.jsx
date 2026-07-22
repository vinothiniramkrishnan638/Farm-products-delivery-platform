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
        <div className="glass-header text-white px-4 py-3 flex justify-between items-center sticky top-0 z-20 shadow-md border-b border-green-950/20 glow-border">
            <div className="flex items-center gap-2">
                <span className="text-xl animate-float">🌿</span>
                <div>
                    <p className="font-extrabold text-lg leading-tight tracking-tight font-heading drop-shadow-sm flex items-center gap-1.5">
                        Fresh Farm Products
                    </p>
                    <p className="text-xs opacity-90 font-medium">Welcome, <span className="font-bold text-green-200">{customer?.full_name}</span></p>
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs font-bold px-4 py-1.5 rounded-xl shadow-sm active:scale-95 transition-all duration-150"
            >
                Logout
            </button>
        </div>
    );
};
export default Header;