import { useEffect, useState } from "react";
import axiosInstance from "../AxiosConfig";

const useBookingData = () => {
    const [bookingData, setBookingData] = useState(null);

    const fetchBookingData = async() => {
        try {
            const response = await axiosInstance.get("/booking/all_bookings");
            const fetchedBookingData = await response.data;
            setBookingData(fetchedBookingData);
            
        } catch (error) {
            console.error("Error fetching booking data: ", error);
        }

    }

    useEffect(() => {
        fetchBookingData();

    }, [])

    return [bookingData, fetchBookingData];
}

export default useBookingData;