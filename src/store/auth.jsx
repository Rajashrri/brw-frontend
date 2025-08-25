import { createContext, useContext, useEffect, useState } from "react";
import {
    dashboardImg1,
    dashboardImg2,
    dashboardImg3,
    dashboardImg4,
    adminTemplate,
    createProject,
  } from "../images";

export const AuthContext = createContext();

export  const Authprovider = ({children}) =>{

    const [token, setToken ] = useState(localStorage.getItem("token"));
    const [token1, setToken1 ] = useState(localStorage.getItem("tokenotp"));
    const [user, setUser] = useState("");
    const [dynamicMenuItems, setDynamicMenuItems] = useState([]); 

    const storeTokenInLSotp = (serverToken1) => {
        setToken1(serverToken1);
        return localStorage.setItem('tokenotp',serverToken1);
    };

    const storeTokenInLS = (serverToken) => {
        setToken(serverToken);
        return localStorage.setItem('token',serverToken);
    };
    let isLoggedIn = !!token;
    // logout functionality
    const LogoutUser =() =>{
        setToken("");
        return localStorage.removeItem('token');
    };

    const Destroyotpuser =() =>{
        setToken1("");
        return localStorage.removeItem('tokenotp');
    };

    //authentication jwt - to fetch login data 
    const userAuthentication = async() => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/auth/user`,{
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            });
            if(response.ok){
                const data = await response.json();
                console.log(data.userData);
                setUser(data.userData);
            }
        } catch (error) {
            console.log("Error Fetching data");
        }
    };

    const fetchData = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/getall`);
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const result = await response.json();

          // Generate new dynamic menu items
          const menuItemss  = result.page.map((item) => ({
            id: item.page_name,
            title: item.page_name,
            type: "collapse",
            icon: "feather icon-file-text",
            src: dashboardImg4,
            children: [
              {
                id: `${item.page_name}-add`,
                title: `Add ${item.page_name}`,
                type: "item",
                url: `/module-preview/add-${item.page_url}`,
              },
              {
                id: `${item.page_name}-list`,
                title: `${item.page_name} List`,
                type: "item",
                url: `/module-preview/list-${item.page_url}`,
              },
            ],
          }));
          return menuItemss;

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

    //to fetch services in list page 
    // const getServices = async () => {
    //     try {
    //         const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/data/service`,{
    //             method:"GET",
    //         });
    //         if(response.ok){
    //             const data = await response.json();
    //             console.log(data.msg);
    //             setServices(data.msg);
    //         }
    //     } catch (error) {
    //         console.log(`services ${error}`);
    //     }
    // }

    useEffect(() => {
        // getServices();
        userAuthentication();
        fetchData();
    },[]);

    return (
        <AuthContext.Provider value={{isLoggedIn, storeTokenInLS,storeTokenInLSotp, user, Destroyotpuser,LogoutUser,fetchData  }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = ()=>{
    const authContextValue = useContext(AuthContext);
    if(!authContextValue){
        throw new Error("useAuth used outside of the Provider");
    }
    return authContextValue;
}