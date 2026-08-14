import { createContext, useContext, useState, useEffect } from "react";
import { getDeliveryProfile } from "../api/deliveryApi";

const DeliveryAuthContext = createContext();

export const DeliveryAuthProvider = ({ children }) => {
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("deliveryToken");
        const savedData = localStorage.getItem("deliveryData");
        if (token && savedData) {
            setPartner(JSON.parse(savedData));
            
            getDeliveryProfile()
                .then((res) => {
                    localStorage.setItem("deliveryData", JSON.stringify(res.data));
                    setPartner(res.data);
                })
                .catch((err) => {
                    if (err.response && err.response.status === 401) {
                        localStorage.removeItem("deliveryToken");
                        localStorage.removeItem("deliveryData");
                        setPartner(null);
                    } else {
                        console.error("Failed to sync delivery profile:", err);
                    }
                });
        }
        setLoading(false);
    }, []);

    const loginPartner = (token, partnerData) => {
        localStorage.setItem("deliveryToken", token);
        localStorage.setItem("deliveryData", JSON.stringify(partnerData));
        setPartner(partnerData);
    };

    const logoutPartner = () => {
        localStorage.removeItem("deliveryToken");
        localStorage.removeItem("deliveryData");
        setPartner(null);
    };

    return (
        <DeliveryAuthContext.Provider value={{ partner, loading, loginPartner, logoutPartner }}>
            {children}
        </DeliveryAuthContext.Provider>
    );
};

export const useDeliveryAuth = () => useContext(DeliveryAuthContext);