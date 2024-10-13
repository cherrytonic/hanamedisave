import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../assets/images/gradientLogo.png'
import hana from '../assets/images/hana-symbol.png'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate();
  const [stompClient, setStompClient] = useState(null);
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null); // 마지막 메시지 상태 추가
  const [hasNotification, setHasNotification] = useState(false); // 초기에는 알림이 있다고 가정
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const handleDropdownClick = () => {
    setDropdownVisible(!dropdownVisible); // 드롭다운 보이기/숨기기 토글
    if (hasNotification) {
      setHasNotification(false); // 알림을 읽었으므로 상태를 false로 변경
    }
  };
  const handleCallAccept = (reservationId) => {
    // 수락 버튼을 클릭하면 예약에 대한 콜 세션으로 이동
    setDropdownVisible(!dropdownVisible);
    navigate(`/hospital/${reservationId}`);  // 예약 ID를 기반으로 비디오 콜 페이지로 이동
  };
  useEffect(() => {
    // 페이지 이동 후 navigate로 전달된 상태값에서 유저 정보가 있는지 확인
    if (location.state?.user) {
      setUser(location.state.user);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      // const socket = new SockJS('http://localhost:8080/ws');
      const socket = new SockJS('https://www.hanamedisave.site/api/ws');
      const stompClient = Stomp.over(socket);
  
      stompClient.connect({}, () => {
        stompClient.subscribe(`/sub/notification/${user.memberId}`, (message) => {
          const notificationMessage = JSON.parse(message.body);  // 메시지를 JSON으로 변환
          console.log("예약 알림 메시지: ", notificationMessage);
  
          // 알림 리스트에 새로운 예약 정보 추가
          setMessages((prevMessages) => [...prevMessages, notificationMessage]);
          setHasNotification(true); // 알림 표시 플래그 설정
        });
      });
  
      setStompClient(stompClient);
  
      return () => {
        if (stompClient) {
          stompClient.disconnect();
        }
      };
    }
  }, [user]);

  
  useEffect(() => {
    // 페이지 이동 후 navigate로 전달된 상태값에서 유저 정보가 있는지 확인
    if (location.state?.user) {
      setUser(location.state.user);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [location]);
  const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
  };
  const handleLogout = () => {
    // WebSocket 연결 해제
    if (stompClient) {
      stompClient.disconnect();
    }
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };
  return (
  <nav className="px-10 w-full">
    <div className="py-4 flex w-full justify-between items-center">
        <Link to="/">
          <div className="flex justify-between items-center">
            <img
              src={Logo} // 로고 이미지 경로
              alt="Logo"
              className="h-14"
            />
            <div className="ml-2 gradient-text gradient-text-inner-shadow">하나메디세이브</div>
          </div>
        </Link>
      <div className="hidden md:flex space-x-6">
        <NavLink
          to="/mypage"
          className={({ isActive }) =>
              `hover:text-[#009178] font-medium relative text-xl group ${isActive ? "text-[#009178]" : "text-gray-800"}`
          }
        >
          내 적금
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#009178] group-hover:scale-x-100 transform scale-x-0 duration-300"></span>
        </NavLink>
        <NavLink
          to="/account"
          className={({ isActive }) =>
            `hover:text-[#009178] font-medium relative text-xl group ${isActive ? "text-[#009178]" : "text-gray-800"}`
        }
        >
          목표 적금 가입
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#009178] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </NavLink>
        <NavLink
          to="/reward"
          className={({ isActive }) =>
            `hover:text-[#009178] font-medium relative text-xl group ${isActive ? "text-[#009178]" : "text-gray-800"}`
        }
        >
          메디포인트
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#009178] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </NavLink>
        <NavLink
          to="/price"
          className={({ isActive }) =>
            `hover:text-[#009178] font-medium relative text-xl group ${isActive ? "text-[#009178]" : "text-gray-800"}`
        }
        >
          병원 예약
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#009178] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </NavLink>
        {/* <div className="relative">
          <button
            className="text-gray-800 hover:text-[#009178] text-xl font-medium relative group"
            onClick={toggleDropdown}  // 드롭다운 열기/닫기 함수
          >
            기타 서비스
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#009178] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </button>
          {dropdownOpen && (
            <div className="absolute mt-2 bg-white border shadow-lg py-2 w-40 z-10 rounded-xl">
              <Link
                to="/price"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                onClick={() => setDropdownOpen(false)} // 링크 클릭 시 드롭다운 닫기
              >
                진료비 비교
              </Link>
              <Link
                to="/hospital"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                onClick={() => setDropdownOpen(false)} // 링크 클릭 시 드롭다운 닫기
              >
                병원 예약
              </Link>
            </div>
          )}
        </div> */}
      </div>
      <div className="flex items-center">
        {user ? (
          // 유저가 로그인된 경우 로그아웃 버튼과 유저 이름 표시
          <>
            <div class="relative">
              <div onClick={handleDropdownClick} className="cursor-pointer mr-4">
                <img class="w-8 h-8 rounded-full" src={hana} alt=""/>
                {hasNotification && (
                  <span className="top-0 left-7 absolute w-3.5 h-3.5 bg-gradient-to-bl from-[#ffb199] to-[#ff0844] rounded-full shadow shadow-inner"></span>
                )}
              </div>
            </div>
            {dropdownVisible && (
                <div id="userDropdown" className="z-10 absolute right-20 top-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-64">
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <div key={index} className="py-2 px-4">
                        <p className="text-sm text-gray-700">병원: {message.hospitalName}</p>
                        <p className="text-sm text-gray-700">예약 시간: {new Date(message.reservationTime).toLocaleString()}</p>
                        <button
                          onClick={() => handleCallAccept(message.reservationId)}
                          className="flex items-center bg-[#009178] text-white p-4 rounded-full hover:bg-[#007a5f] transition-all duration-300 shadow-lg w-14 h-15"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                              />
                            </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 px-4 text-sm text-gray-500">알림이 없습니다.</div>
                  )}
                </div>
              )}
              <span className="text-gray-800 font-medium mr-4">{user.memberNm}님</span>
              <button
                  onClick={handleLogout}
                  className="mx-auto bg-white text-[#009178] border border-[#009178] font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center transition-colors duration-300"
              >
                  로그아웃
              </button>
          </>
        ) : (
          <>
              <NavLink
                  to="/login"
                  className="text-gray-800 hover:text-[#009178] font-medium relative group mr-4"
              >
                  로그인
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#009178] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </NavLink>
              <NavLink
                  to="/signup"
                  className="mx-auto hover:bg-white bg-[#009178] text-white hover:text-[#009178] border border-[#009178] font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center transition-colors duration-300"
              >
                  회원가입
              </NavLink>
          </>
        )}
      </div>
    </div>
  </nav>
  );
}
  
  export default Navbar;