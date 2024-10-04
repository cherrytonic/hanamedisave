import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import VideoRoomComponent from "../video/components/VideoRoomComponent";
import http from "../../api/medisave"; // Assuming you have http setup for API requests

const Hospital = () => {
  const { reservationId } = useParams(); 
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const memberNm = storedUser.memberNm

  // Fetch reservation data using reservationId from the URL
  const fetchReservationData = useCallback(async () => {
    console.log('Fetching reservation data...');
    
    try {
      const response = await http.get(`/api/reservations/id/${reservationId}`); // Use reservationId from URL
      console.log('API response:', response.data);
      setReservationData(response.data[0]); // Store reservation data
      setLoading(false); // Data fetched, stop loading
    } catch (error) {
      console.error('Failed to fetch reservation:', error);
      setLoading(false); // Even if there is an error, stop loading
    }
  }, [reservationId]);

  // Call fetchReservationData when the component mounts or when reservationId changes
  useEffect(() => {
    fetchReservationData();
  }, [fetchReservationData]);

  // Show a loading spinner or message while data is being fetched
  if (loading) {
    return <div>Loading reservation data...</div>;
  }

  // Once data is loaded, pass the reservation data to VideoRoomComponent
  return (
    <div>
      <h1>Hospital Information</h1>
      <p>Hospital Name: {reservationData.hospitalName}</p>
      <p>Participant: {reservationData.participantName}</p>
      {/* Pass the relevant data to VideoRoomComponent */}
      <VideoRoomComponent hospital={reservationData[8]} memberNm={memberNm} />
    </div>
  );
};

export default Hospital;
