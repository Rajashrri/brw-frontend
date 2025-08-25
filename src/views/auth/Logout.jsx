import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from '../../store/auth';
import { BASE_URL } from '../../config/constant';
 const Logout = ()=>{

    const { LogoutUser } = useAuth();

   useEffect(() => {
   LogoutUser();
   },[LogoutUser]);
   localStorage.clear();
   // useEffect(() => {
   //    Destroyotpuser();
   //   },[Destroyotpuser]);

   return <Navigate to={BASE_URL} />
};
export default Logout;

