import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import medisave from '../../api/medisave';
import DatePicker from 'react-datepicker';
import { ko } from "date-fns/locale";
import './Price.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DATE_FORMAT = 'yyyy년 MM월 dd일';
const DATE_FORMAT_CALENDAR = 'yyyy년 MM월';

const ReservationModal = ({ title, confirm, createReservation, selectedHospitalId, setSelectedHospitalId, selectedHospitalNm }) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const memberId = storedUser.memberId;
  const navigate = useNavigate();
  const notify = (text) => toast(text);

  // 시간 슬롯 정의
  const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  ];

  // 선택된 날짜와 시간 상태
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // 각 시간 슬롯의 예약 가능 여부 저장
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  // 날짜 선택 시 호출되는 함수
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // 시간 슬롯 선택 시 호출되는 함수
  const handleTimeSlotChange = (e) => {
    setSelectedTime(e.target.value);
  };

  // 예약 가능 여부 확인 함수 (백엔드와 통신)
const checkSlotAvailability = async (hospitalId, reservationTime) => {
  try {
      const response = await medisave.get('/api/reservations/available', {
          params: {
              hospitalId: hospitalId, // hospitalId 명시적으로 전달
              reservationTime: reservationTime, // reservationTime은 ISO 문자열로 변환
          },
      });
      return response.data; // true: 예약 가능, false: 예약 불가능
  } catch (error) {
      console.error('예약 가능 여부 확인 중 오류 발생:', error);
      return false; // 오류가 발생하면 예약 불가능으로 처리
  }
};


const convertTo24HourFormat = (time12h) => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours}:${minutes}:00`;
};

const checkAvailability = async (date) => {
  setLoading(true);
  const availabilityCheck = {};
  for (const time of timeSlots) {
    const reservationTime = new Date(date);
    const [hours, minutes] = convertTo24HourFormat(time).split(':');
    reservationTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const offset = reservationTime.getTimezoneOffset() * 60000;
    const localISOTime = new Date(reservationTime.getTime() - offset).toISOString();
    
    const isAvailable = await checkSlotAvailability(selectedHospitalId, localISOTime);
    availabilityCheck[time] = isAvailable;
  }
  setAvailability(availabilityCheck);
  setLoading(false);
};

  // 날짜 변경 시 예약 가능 여부 확인
  useEffect(() => {
    if (selectedDate) {
      checkAvailability(selectedDate);
    }
  }, [selectedDate]);

  // 예약 처리 함수
// 시간 변환과 예약 확인 함수
const handleReservation = async () => {
  if (!selectedDate || !selectedTime) {
    alert('날짜와 시간을 선택해주세요.');
    return;
  }

  // 선택한 시간을 AM/PM 형식에서 24시간 형식으로 변환
  const [time, period] = selectedTime.split(' ');
  let [hour, minute] = time.split(':');

  hour = parseInt(hour, 10);
  minute = parseInt(minute, 10);

  if (period === 'PM' && hour < 12) {
    hour += 12;  // PM인 경우 12시간 추가
  } else if (period === 'AM' && hour === 12) {
    hour = 0;  // 12:00 AM은 00:00으로 변환
  }

  // 선택한 날짜에 시간 설정
  const reservationDateTime = new Date(selectedDate);
  reservationDateTime.setHours(hour, minute, 0);

  // 로컬 시간에서 UTC로 변환
  const offset = reservationDateTime.getTimezoneOffset() * 60000;
  const localISOTime = new Date(reservationDateTime.getTime() - offset).toISOString();

  console.log('ISO 시간:', localISOTime);

  // 백엔드에 슬롯 가능 여부 확인
  const isAvailable = await checkSlotAvailability(selectedHospitalId, localISOTime);
  if (!isAvailable) {
    notify('선택한 시간은 이미 예약되었습니다.');
    return;
  }

  // 예약 생성
  const reservation = await createReservation(selectedHospitalId, memberId, localISOTime);
  if (reservation) {
    notify('예약이 성공적으로 완료되었습니다.');
    setTimeout(() => {
      navigate('/');
    }, 3000); 
  } else {
    notify('예약에 실패했습니다.');
  }
};


  return (
    <>
      <ToastContainer
          position="top-center" // 알람 위치 지정
          autoClose={3000} // 자동 off 시간
          hideProgressBar={false} // 진행시간바 숨김
          closeOnClick // 클릭으로 알람 닫기
          rtl={false} // 알림 좌우 반전
          pauseOnFocusLoss // 화면을 벗어나면 알람 정지
          draggable // 드래그 가능
          pauseOnHover // 마우스를 올리면 알람 정지
          theme="light"
          // limit={1} // 알람 개수 제한
        />
      <AnimatePresence>
        <motion.div
          className="bg-white w-full p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col w-full items-start pb-2">
            <div className="flex w-full items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">{selectedHospitalNm} {title}</h3>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" onClick={() => { setSelectedHospitalId(null) }} className="mr-2 size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </div>
            <div className="w-full">
              <h3 className="text-lg font-semibold my-3">날짜를 선택하세요</h3>
              <div className="w-full flex justify-center mb-3">
                <DatePicker
                  locale={ko}
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat={DATE_FORMAT}
                  dateFormatCalendar={DATE_FORMAT_CALENDAR}
                  className="block w-full px-2 py-1.5 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#009178]"
                  inline
                  minDate={new Date()}
                />
              </div>
              {selectedDate && (
                <>
                  <label className="text-lg font-semibold">예약 가능한 시간</label>
                  {loading ? (
                    <p className="my-8">예약 가능 시간을 확인합니다...</p>
                  ) : (
                    <ul id="timetable" className="grid w-full grid-cols-3 gap-3 my-6">
                    {timeSlots.map((slot, index) => (
                      <li key={index}>
                        <input
                          type="radio"
                          id={`slot-${index}`}
                          value={slot}
                          className="hidden peer"
                          name="timetable"
                          onChange={handleTimeSlotChange}
                          checked={selectedTime === slot}
                          disabled={!availability[slot]} // 예약 불가능한 시간은 비활성화
                        />
                        <label
                          htmlFor={`slot-${index}`}
                          className={`inline-flex items-center justify-center w-full px-2 py-2 text-sm font-medium text-center border rounded-lg cursor-pointer
                            ${availability[slot] ? 'bg-white hover:bg-gray-50 text-gray-500' : 'bg-gray-300 text-gray-400 cursor-not-allowed'} peer-checked:bg-[#009178] peer-checked:text-white`}
                        >
                          {slot}
                        </label>
                      </li>
                    ))}
                  </ul>
                  
                  )}
                  {selectedTime && (
                    <div className="mt-4 text-lg text-gray-700">
                      선택한 시간: <span className="font-bold">{selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 {selectedTime}</span>
                    </div>
                  )}
                  <button
                    onClick={handleReservation}
                    className="w-full mt-4 p-2.5 bg-[#009178] text-white rounded-md"
                    disabled={!selectedTime} // 선택한 시간 없을 때 비활성화
                  >
                    {confirm}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ReservationModal;
