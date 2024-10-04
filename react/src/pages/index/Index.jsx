import React, { useState, useEffect, useCallback} from 'react';
import './Index.css';
import http from '../../api/medisave';
import MainSlides from '../../components/MainSlides';
import { motion, AnimatePresence } from 'framer-motion';
import ReservationEditModal from './ReservationEditModal';


function Index() {
  const [storedUser, setStoredUser] = useState(JSON.parse(localStorage.getItem('user')) || { memberNm: '', reward: 0 });
  const [goal, setGoal] = useState(0)
  const [together, setTogether] = useState(0)
  const [reservations, setReservations] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const loginData = async () => {
    try {
      const response = await http.get(`/api/members/${storedUser.memberId}`); 
      console.log('사용자 정보:', response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };
  const fetchMyData = async () => {
    try {
      const response = await http.get(`/api/account/medlist/${storedUser.memberId}`); 
      console.log(response.data.length);
      setGoal(response.data.length)
    } catch (error) {
      console.error('Failed to fetch insurance data:', error);
    }
  };
  const fetchParticipantData = useCallback(async () => {
    console.log('요청 보냄:');
    try {
      const response = await http.get(`/api/account/participant/${storedUser.memberId}`);
      console.log('API response:', Object.keys(response.data).length);  // API 응답 확인
      setTogether(Object.keys(response.data).length)
    } catch (error) {
      console.error('Failed to fetch participant:', error);
    }
  }, []);
  const fetchReservationData = useCallback(async () => {
    console.log('요청 보냄:');
    try {
      const response = await http.get(`/api/reservations/get/${storedUser.memberId}`);
      console.log('API response:', response.data);  // API 응답 확인
      setReservations(response.data)
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  }, []);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setStoredUser(user);
    }
    loginData()
    fetchMyData();
    fetchParticipantData();
    fetchReservationData();
  }, []);
    return (
      <div className="background">
        <div className="flex shadow-lg p-6 rounded-lg">
          <div className="w-2/3 bg-white p-6">
              <MainSlides/>
          </div>
          <div className="w-1/3 bg-white p-6">
            {/* <div className="text-xl border rounded-lg p-4 shadow-lg mb-2 transition ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer">
              <span>
                {storedUser.memberNm || '사용자'} 님의 보유 포인트 : 
              </span>
            </div> */}
            <div className="w-full flex space-x-4">
              <div className="w-1/2 aspect-square text-xl border bg-[#0bb654] rounded-xl p-6 shadow-lg mb-2 transition ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer">
                <span className="text-3xl text-white">
                  내 목표 적금
                </span>
                <div className="flex justify-center item-center">
                  <span className="text-5xl font-semibold text-white mt-12">
                    {goal || 0}
                  </span>
                  <span className="text-xl text-white ml-2 mt-16">
                    개
                  </span>
                </div>
              </div>
              <div className="w-1/2 aspect-square text-xl border bg-[#9cb1a5] rounded-xl p-6 shadow-lg mb-2 transition ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer">
                <span className="text-3xl text-white">
                  내 함께 적금
                </span>
                <div className="flex justify-center item-center">
                  <span className="text-5xl font-semibold text-white mt-12">
                    {together || 0}
                  </span>
                  <span className="text-xl text-white ml-2 mt-16">
                    개
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full flex mt-4 space-x-4">
              <div className="w-1/2 aspect-square text-xl border bg-[#9cb1a5] rounded-xl p-6 shadow-lg transition ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer">
                <span className="text-3xl text-white">
                  내 메디포인트
                </span>
                <div className="flex justify-center item-center">
                  <span className="text-5xl font-semibold text-white mt-12">
                    {storedUser.reward || 0}
                  </span>
                  <span className="text-xl text-white ml-2 mt-16">
                    P
                  </span>
                </div>
              </div>
              <div className="w-1/2 aspect-square text-xl border bg-[#3c3c3c] rounded-xl p-6 shadow-lg transition ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer"
              onClick={()=>{setIsModalOpen(true)}}>
                <span className="text-3xl text-white">
                  내 예약
                </span>
                <div className="flex justify-center item-center">
                  <span className="text-5xl font-semibold text-white mt-12">
                  {Object.keys(reservations).length || 0}
                  </span>
                  <span className="text-xl text-white ml-2 mt-16">
                    건
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
        {isModalOpen && (
          <ReservationEditModal 
            closeModal={closeModal} 
            reservations={reservations} 
          />
        )}
      </AnimatePresence>
      </div>
    );
  }
  
  export default Index;