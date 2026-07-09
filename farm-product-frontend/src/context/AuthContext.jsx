import { createContext,useContext,useState,useEffect } from "react";

const AuthContext = createContext();
export const AuthProvider =({children}) =>{
    const [customer,setCustomer] = useState(null);
    const[loading,setLoading]= useState(true);

    useEffect(()=>{
        const savedData =localStorage.getItem("customerData");
        if (savedData){
            setCustomer(JSON.parse(savedData));
        }
        setLoading(false);

    },[]);
    const loginCustomer = (token,customerData) =>{
        localStorage.setItem("customerToken",token);
        localStorage.setItem("customerData",JSON.stringify(customerData));
        setCustomer(customerData);
    };
    const logoutCustomer = () =>{
        localStorage.removeItem("customerToken");
        localStorage.removeItem("customerData");
        setCustomer(null);
    };
    return(
        <AuthContext.Provider value={{ customer,loading,loginCustomer,logoutCustomer}}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth =()=> useContext(AuthContext);
