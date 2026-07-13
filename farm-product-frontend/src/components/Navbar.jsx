import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("home");
    const isScrollingRef = useRef(false);

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
        <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex gap-5 sticky top-[53px] z-10 overflow-x-auto shadow-sm">
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
    );
};

export default Navbar;
