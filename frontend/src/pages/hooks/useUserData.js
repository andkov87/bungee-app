import { useEffect, useState } from "react"
import axiosInstance from "../AxiosConfig";


const useUserData = () => {
    const [userData, setUserData] = useState(null);


    const fetchUserData = async() => {
        try {
            const response = await axiosInstance.get('/user');
            const fetchedUserData = await response.data;
            setUserData(fetchedUserData);
            localStorage.setItem("username", fetchUserData.userName)
        
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
    }


    useEffect(() => {        
        
        fetchUserData();
    
    }, [])   
    

   // return userData ? children(userData) : null;
   return [userData,fetchUserData];
}

/*UserDataFetcher.propTypes = {
    shouldRefetch: PropTypes.bool,
    children: PropTypes.func.isRequired,
    setShouldRefetchUserData: PropTypes.func.isRequired
  };*/

export default useUserData;