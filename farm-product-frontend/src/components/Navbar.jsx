import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("home");
    const isScrollingRef = useRef(false);
    const { cartCount } = useCart();

    useEffect(() => {
        if (location.pathname !== "/customer/dashboard") {
            setActiveTab("");
            return;
        }

        const sections = ["categories", "featured", "popular"];

        const handleIntersection = (entries) => {
            if (isScrollingRef.current) return;
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveTab(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin: "-120px 0px -60% 0px",
            threshold: 0.1,
        });

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                observer.observe(el);
            }
        });

        const handleScroll = () => {
            if (isScrollingRef.current) return;
            if (window.scrollY < 80) {
                setActiveTab("home");
            }
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, [location.pathname]);

    const scrollToSection = (id) => {
        setActiveTab(id);
        isScrollingRef.current = true;

        const performScroll = () => {
            const section = document.getElementById(id);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
            setTimeout(() => {
                isScrollingRef.current = false;
            }, 800);
        };

        if (location.pathname !== "/customer/dashboard") {
            navigate("/customer/dashboard");
            setTimeout(performScroll, 150);
        } else {
            performScroll();
        }
    };

    const handleHomeClick = () => {
        setActiveTab("home");
        isScrollingRef.current = true;

        if (location.pathname !== "/customer/dashboard") {
            navigate("/customer/dashboard");
            setTimeout(() => {
                isScrollingRef.current = false;
            }, 800);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => {
                isScrollingRef.current = false;
            }, 800);
        }
    };

    return (
        <div className="w-full glass-navbar border-b border-gray-200/50 px-4 py-2 flex justify-between items-center sticky top-[52px] z-10 shadow-sm">
            <div className="flex-1 min-w-0 flex gap-5 overflow-x-auto py-1 mr-2">
                <button
                    onClick={handleHomeClick}
                    className={`text-sm font-semibold whitespace-nowrap pb-1 transition-all active:scale-95 duration-200 ${
                        activeTab === "home"
                            ? "text-green-700 border-b-2 border-green-700 font-bold"
                            : "text-gray-600 hover:text-green-600"
                    }`}
                >
                    Home
                </button>
                <button
                    onClick={() => scrollToSection("categories")}
                    className={`text-sm font-semibold whitespace-nowrap pb-1 transition-all active:scale-95 duration-200 ${
                        activeTab === "categories"
                            ? "text-green-700 border-b-2 border-green-700 font-bold"
                            : "text-gray-600 hover:text-green-600"
                    }`}
                >
                    Categories
                </button>
                <button
                    onClick={() => scrollToSection("featured")}
                    className={`text-sm font-semibold whitespace-nowrap pb-1 transition-all active:scale-95 duration-200 ${
                        activeTab === "featured"
                            ? "text-green-700 border-b-2 border-green-700 font-bold"
                            : "text-gray-600 hover:text-green-600"
                    }`}
                >
                    Featured
                </button>
                <button
                    onClick={() => scrollToSection("popular")}
                    className={`text-sm font-semibold whitespace-nowrap pb-1 transition-all active:scale-95 duration-200 ${
                        activeTab === "popular"
                            ? "text-green-700 border-b-2 border-green-700 font-bold"
                            : "text-gray-600 hover:text-green-600"
                    }`}
                >
                    Popular
                </button>
            </div>

            <button
                onClick={() => navigate("/cart")}
                className="relative p-2 text-gray-600 hover:text-green-700 active:scale-95 transition-all flex items-center shrink-0 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-100"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5.5 h-5.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white animate-bounce-in shadow-sm">
                        {cartCount}
                    </span>
                )}
            </button>
        </div>
    );
};

export default Navbar;
