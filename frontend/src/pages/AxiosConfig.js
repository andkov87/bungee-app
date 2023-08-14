import axios from "axios";

const API_BASE_URL = 'http://localhost:8080';


const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type':'application/json',
    },
 
});


axiosInstance.interceptors.response.use(
  (response) => {
    const tokenResponse = response.data;
    
    if (tokenResponse && tokenResponse.token) {
      const newToken = tokenResponse.token;

      console.log(newToken);    

      // Update the stored token with the new token
      localStorage.setItem('jwtToken', newToken);
      

      // Update the 'Authorization' header with the new token for subsequent requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`; 
    }
    return response;
  },
  (error) => {
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        config.headers['authorization'] = `Bearer ${token}`;
      } 
      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

export default axiosInstance;