import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import medisave from '../../api/medisave';
import ReservationModal from '../price/ReservationModal';
import { useNavigate } from "react-router-dom";
import './Index.css'


const ReservationEditModal = ({ closeModal, reservations }) => {
    const navigate = useNavigate();
    const [reservationId, setReservationId] = useState([])
    const [selectedHospitalId, setSelectedHospitalId] = useState(null); 
    const [selectedHospitalNm, setSelectedHospitalNm] = useState(null); 
  // 예약 취소 기능 (API를 통해 예약 취소 처리)
  const handleCancelReservation = async (reservationId) => {
    try {
      await medisave.post(`/api/reservations/cancel`, { reservationId });
      alert('예약이 취소되었습니다.');
      navigate('/')
      // 필요한 경우 예약 데이터를 다시 불러오거나 UI를 갱신하는 로직 추가
    } catch (error) {
      console.error('예약 취소 중 오류 발생:', error);
      alert('예약 취소에 실패했습니다.');
    }
  };
  const createReservation = async (hospitalId, memberId, reservationTime) => {
    try {
      const response = await medisave.post(`/api/reservations/update/${reservationId}`, {
        hospitalId,
        memberId,
        reservationTime,
      });
      return response.data;
    } catch (error) {
      console.error('예약 생성 중 오류 발생:', error);
      return null;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeModal}
    >
      <motion.div
        className="modal-container"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>내 예약 정보</h2>
          <button onClick={closeModal}>×</button>
        </div>

        {selectedHospitalId ? (
          <ReservationModal
            selectedHospitalId={selectedHospitalId}
            setSelectedHospitalId={setSelectedHospitalId}
            selectedHospitalNm={selectedHospitalNm}
            title={"상담 예약 변경하기"}
            confirm={"변경하기"}
            createReservation={createReservation}
          />
        ) : (
          <div className="overflow-y-auto max-h-96">
            {reservations.length > 0 ? (
              <table className="reservation-table">
                <thead>
                  <tr>
                    <th>병원 이름</th>
                    <th>주소</th>
                    <th>예약 시간</th>
                    <th>변경/취소</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation[0]}>
                      <td>{reservation[8]}</td>
                      <td>{reservation[9]}</td>
                      <td>{new Date(reservation[3]).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })}
                      </td>
                      <td className="button-group">
                        <button
                          onClick={() => {
                            setReservationId(reservation[0]);
                            setSelectedHospitalId(reservation[7]);
                            setSelectedHospitalNm(reservation[8]);
                          }}
                          className="edit-btn"
                        >
                          예약 변경
                        </button>
                        <button
                          onClick={() => handleCancelReservation(reservation[0])}
                          className="cancel-btn"
                        >
                          취소하기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>예약 내역이 없습니다.</p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ReservationEditModal;
