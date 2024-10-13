import React, { useState, useEffect, useCallback} from 'react';
import './Index.css';
import http from '../../api/medisave';
import MainSlides from '../../components/MainSlides';
import { motion, AnimatePresence } from 'framer-motion';
import ReservationEditModal from './ReservationEditModal';
import { useNavigate } from 'react-router-dom';
import Clipboard from '../../assets/images/clipboard.svg'
import Donut from '../../assets/images/donut.svg'
import Piggy from '../../assets/images/Piggy bank.svg'
import Talk from '../../assets/images/talk.svg'
import Stetho from '../../assets/images/stethoscope_3d.png'
import Coin from '../../assets/images/coin.png'
import Growth from '../../assets/images/Growth.png' 
import Investment from '../../assets/images/Investment.png' 


function Index() {
  const BenefitCard = ({ title, description, icon, backgroundColor, link }) => {
    return (
      <div
        className={`w-1/4 p-6 bg-${backgroundColor} text-center rounded-lg shadow-md transition-transform hover:scale-105 hover:bg-green-100 cursor-pointer`}
        onClick={() => navigate(link)}  // 클릭 시 링크로 이동
      >
        <div className="flex justify-center mb-4">
          <img src={icon} alt={title} className="w-16 h-16" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm">{description}</p>
      </div>
    );
  };
  const benefits = [
    {
      title: '목표 적금',
      description: '편하게 모으고 싶은 분들은 주목!',
      icon: Growth,
      backgroundColor: 'blue-100',
      link: '/account',  // 링크 추가
    },
    {
      title: '함께 적금',
      description: '함께 달성하는 목표 금액',
      icon: Investment,
      backgroundColor: 'blue-100',
      link: '/account',  // 링크 추가
    },
    {
      title: '메디포인트',
      description: '치료하면 포인트 적립',
      icon: Coin,
      backgroundColor: 'blue-100',
      link: '/reward',  // 링크 추가
    },
    {
      title: '병원 예약',
      description: '병원 상담으로 치료비 목표 설정',
      icon: Stetho,
      backgroundColor: 'blue-100',
      link: '/price',  // 링크 추가
    },
  ];
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [goal, setGoal] = useState(0)
  const [together, setTogether] = useState(0)
  const [reservations, setReservations] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleLogin = () => {
    navigate('/login');
  };
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
        <div className="flex">
          <div className="w-2/3 bg-white p-6">
              <MainSlides/>
          </div>
          <div className="w-1/3 bg-white p-6">
          {storedUser ? (
            <>
            <div className="w-full flex space-x-4">
              <div className="w-1/2 aspect-square text-xl border bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl p-6 shadow-lg mb-2 transition ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer">
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
              <div className="w-1/2 aspect-square text-xl border bg-gradient-to-r from-green-400 to-green-500 rounded-xl p-6 shadow-lg mb-2 transition ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer">
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
              <div className="w-1/2 aspect-square text-xl border bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg transition ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer">
                <span className="text-3xl text-white">
                  내 메디포인트
                </span>
                <div className="flex justify-center item-center">
                  <span className="text-5xl font-semibold text-white mt-12">
                    {storedUser.reward.toLocaleString() || 0}
                  </span>
                  <span className="text-xl text-white ml-2 mt-16">
                    P
                  </span>
                </div>
              </div>
              <div className="w-1/2 aspect-square text-xl bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 shadow-lg transition ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer"
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
            </>
            ) : (
              <div className="flex justify-center items-center h-full">
                <button onClick={handleLogin} className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700">
                  로그인
                </button>
              </div>
            )}
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
      <div className="m-10">
        <h2 className="text-2xl font-bold text-center mb-6">건강에 보탬이 되는 혜택</h2>
          <div className="flex justify-between space-x-4">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                title={benefit.title}
                description={benefit.description}
                icon={benefit.icon}
                backgroundColor={benefit.backgroundColor}
                link={benefit.link}  // 링크 전달
              />
            ))}
          </div>
        </div>
      </div>
      
    );
  }
  
  export default Index;