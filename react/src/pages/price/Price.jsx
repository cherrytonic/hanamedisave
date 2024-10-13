import React, { useEffect, useState, useCallback } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import './Price.css'
import http from '../../api/medisave';
import { motion } from 'framer-motion'; 
import MarkerImage from '../../assets/images/marker.svg'
import CloseImage from '../../assets/images/CloseBtn.svg'
import ChatWindow from '../chatting/Chatwindow';
import ReservationModal from './ReservationModal';

const { kakao } = window;

function Price() {

  const [chattingHospital, setChattingHospital] = useState(null); // 병원 ID를 저장하는 상태
  const [selectedHospitalId, setSelectedHospitalId] = useState(null); //
  const [selectedHospitalNm, setSelectedHospitalNm] = useState(null); //
  const [zoomLevel,setZoomLevel] = useState(3);
  const [hoveredHospital, setHoveredHospital] = useState(null); // Hover 상태 관리
  const [timeSlots, setTimeSlots] = useState([])
  const [hospitals, setHospitals] = useState([
    {
      "id": 44,
      "name": "강남안과의원",
      "address": "경기도 광명시 오리로 857, 3층 301/305호 (철산동, 일청빌딩)",
      "phoneNumber": "02-2684-8800",
      "latitude": 126.8662685,
      "longitude": 37.4749016,
      isOpen: false,
    },
    {
      "id": 48,
      "name": "더밝은안과의원",
      "address": "경기도 광명시 오리로 870, 4층 (철산동, 스타힐스빌딩)",
      "phoneNumber": "02-2614-1114",
      "latitude": 126.8659802,
      "longitude": 37.4760713,
      isOpen: false,
    }
  ]);
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [filteredHospitals, setFilteredHospitals] = useState([]); // 필터된 병원 데이터
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({  
    lat: 37.47538479735877,
    lng: 126.87080360792716,
  })
  const createReservation = async (hospitalId, memberId, reservationTime) => {
    try {
      const response = await http.post('/api/reservations/create', {
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
  // 병원 데이터를 가져오는 함수
  const fetchNearbyHospitals = useCallback(async (center) => {
    console.log('요청 보냄:', center);
    const params = {
      longitude: parseFloat(center.lng),
      latitude: parseFloat(center.lat),
    };
    try {
      const response = await http.get('/api/hospInfo', {
        params,
        headers: {
          Accept: 'application/json',
        },
      });
      console.log('API response:', response);  // API 응답 확인
      const hospitalsData = response.data;
      // 병원 데이터와 비급여 항목을 병합하여 상태 저장
      const hospitalsWithState = hospitalsData.map(({ hospital, items }) => ({
        ...hospital,
        items: items || [], // items 배열이 없을 경우 빈 배열로 설정
        isOpen: false,      // 초기 상태는 모두 닫힘
      }));
      setHospitals(hospitalsWithState);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
      setLoading(false);
    }
  }, []);
  const handleMapDragEnd = useCallback((map) => {
    const center = {
      lat: map.getCenter().getLat(),
      lng: map.getCenter().getLng(),
    };
    setMapCenter(center); 
    setZoomLevel(map.getLevel());
    fetchNearbyHospitals(center); 
  }, [fetchNearbyHospitals]);
  // 검색 핸들러
  const handleSearch = () => {
    const results = hospitals
      .map(hospital => {
        // '도수치료'가 포함된 비급여 항목만 필터링
        const matchedItems = hospital.items.filter(item =>
          item.yadmNpayCdNm && item.yadmNpayCdNm.includes(searchQuery)
        );
        // 필터된 항목이 있으면 해당 병원과 항목을 결과로 포함
        if (matchedItems.length > 0) {
          return {
            ...hospital,
            items: matchedItems, // 필터된 항목만 저장
          };
        } else {
          return null; // 일치하는 항목이 없으면 결과에서 제외
        }
      })
      .filter(hospital => hospital !== null); // null 값 제거
    setSearchResults(results);
    // 첫 번째 검색 결과의 병원으로 지도 이동
    if (results.length > 0) {
      const firstHospital = results[0];
      setMapCenter({
        lat: parseFloat(firstHospital.latitude),
        lng: parseFloat(firstHospital.longitude),
      });
      setZoomLevel(0)
      setHospitals((prevHospitals) =>
        prevHospitals.map((hospital) => {
          if (hospital.id === firstHospital.id) {
            return { ...hospital, isOpen: true }; // 첫 병원 정보 열기
          }
          return { ...hospital, isOpen: false }; // 나머지 병원 정보는 닫기
        })
      );
    }
  };
  const checkSlotAvailability = async (hospitalId, reservationTime) => {
    try {
      const response = await http.get('/api/reservations/available', {
        params: {
          hospitalId: hospitalId,
          reservationTime: reservationTime.toISOString(), // 예약 시간을 ISO 형식으로 전달
        },
      });
  
      return response.data; // 예약 가능 여부 (true: 가능, false: 불가능)

    } catch (error) {
      console.error("예약 가능 여부 확인 중 오류 발생:", error);
      return false; // 오류가 발생하면 false 반환
    }
  };
  
  // 첫 로딩 시에만 병원 정보 요청
  useEffect(() => {
    fetchNearbyHospitals(mapCenter);  // 첫 로딩일 때만 실행
  }, [fetchNearbyHospitals]);
  // useEffect(() => {
  //   console.log("Updated hospitals:", hospitals);
  // }, [hospitals]); // hospitals 상태가 변경될 때마다 로그 출력
  const toggleInfoWindow = (hospitalId) => {
    setHospitals(hospitals.map(hospital => {
      if (hospital.id === hospitalId) {
        return { ...hospital, isOpen: !hospital.isOpen };
      } else {
        return { ...hospital, isOpen: false };
      }
    }));
  };
  return (
    <div className="containers">
      <div className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
          <div className="text-start">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">병원 예약</h2>            
             {/* 지도 */}
            {hospitals.length > 0 && (
              <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                <Map
                  center={mapCenter}
                  style={{ width: '100%', height: '600px' }}
                  level={zoomLevel}
                  onDragEnd={handleMapDragEnd}
                  onLoad={() => setTimeout(() => setLoading(false), 500)}
                >
                  {!loading && hospitals.map((hospital, index) => {
                    const markerPosition = {
                      lat: parseFloat(hospital.latitude),
                      lng: parseFloat(hospital.longitude),
                    };
                    return (
                      <CustomOverlayMap
                        key={index}
                        position={markerPosition}
                        yAnchor={1.5} // 마커 위치 조정
                      >
                        <div
                          className="relative cursor-pointer flex flex-col items-center"
                          onMouseEnter={() => setHoveredHospital(hospital.id)}
                          onMouseLeave={() => setHoveredHospital(null)}
                          onClick={() => toggleInfoWindow(hospital.id)}
                        >
                          {/* 마커 이미지 */}
                          <div className="custom-marker" />

                          {/* Hover 시 간단한 정보 표시 */}
                          {hoveredHospital === hospital.id && !hospital.isOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-[10px] bg-white border border-gray-300 rounded-lg p-2 shadow-lg text-gray-800 font-medium overlay-box"
                          >
                            <div className="overlay-arrow"></div> {/* 세모 추가 */}
                            {hospital.name}
                          </motion.div>
                        )}

                        {hospital.isOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-[10px] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-[260px] h-[220px] overflow-x-hidden overflow-y-auto overlay-box"
                          >
                            <div className="overlay-arrow"></div>
                            <img
                              src={CloseImage}
                              alt="닫기"
                              className="absolute top-0 right-0 w-3 h-3 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleInfoWindow(hospital.id);
                              }}
                            />
                            <div className="text-content">
                              <div className="text-[#009178] font-bold text-lg mb-2">{hospital.name}</div>
                              <p className="text-gray-600 text-sm mb-2">{hospital.address}</p>
                              <div className="text-gray-600 text-sm">전화번호: {hospital.phoneNumber}</div>
                              <div className="mt-4">
                                <span className="text-[#009178] font-semibold">비급여 항목</span>
                                {hospital.items.length > 0 ? (
                                  <ul className="list-none p-0 mt-2 text-sm">
                                    {hospital.items.map((item, idx) => (
                                      <li key={idx} className="flex justify-between text-gray-700 mb-2">
                                        <span className="text-break">{item.npayKorNm}</span>
                                        <span className="ml-2 font-semibold text-gray-900">
                                          {item.curAmt?.toLocaleString()}원
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <span className="text-gray-500">정보 없음</span>
                                )}
                              </div>
                            </div>
                            <div className="overlay-arrow"></div> {/* 세모 추가 */}
                          </motion.div>
                        )}
                        </div>
                      </CustomOverlayMap>

                    );
                  })}
                </Map>
                {/* 검색창 및 결과 패널 */}
                <div className="absolute right-0 top-0 w-1/3 h-[96%] bg-white rounded-lg shadow-md p-6 overflow-y-auto z-50 m-1">
                {selectedHospitalId ? (
                  // ChatWindow 컴포넌트만 렌더링 (병원 ID에 따라)
                  // <ChatWindow 
                  // setChattingHospitalId={setChattingHospitalId}
                  // chattingHospitalId={chattingHospitalId} />
                  <ReservationModal
                    selectedHospitalId={selectedHospitalId}
                    setSelectedHospitalId={setSelectedHospitalId}
                    selectedHospitalNm={selectedHospitalNm}
                    setChattingHospital={setChattingHospital}
                    title={"상담 예약하기"}
                    confirm={"예약하기"}
                    createReservation={createReservation}
                  />
                  ) : ( 
                  <>
                    <h2 className="m-2 text-xl font-bold">진료항목을 검색해보세요!</h2>
                    <input
                      type="text"
                      placeholder="비급여 진료 항목 검색"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-2.5 rounded-md mb-2.5 border border-gray-300"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    />
                    <button
                      onClick={handleSearch}
                      className="w-full p-2.5 bg-[#009178] text-white rounded-md border-none cursor-pointer"
                    >
                      검색
                    </button>
                    {/* 검색 결과 표시 */}
                    <div className="relative">
                      {/* 병원 리스트 */}
                      <div className="mt-4"> 
                        {searchResults.length > 0 ? (
                          <ul className="list-none p-0">
                            {searchResults.map((hospital, idx) => (
                              <li key={idx} className="mb-5 border-b pb-3">
                                <div className="flex justify-between items-center mb-2">
                                  <div>
                                    <strong className="text-lg font-semibold">{hospital.name}</strong>
                                    <p className="text-sm text-gray-500">{hospital.items[0]?.yadmNpayCdNm}</p>
                                    <p className="text-blue-600 text-lg font-bold">{hospital.items[0]?.curAmt?.toLocaleString()}원</p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setSelectedHospitalId(hospital.id)
                                      setSelectedHospitalNm(hospital.name)
                                      setChattingHospital(hospital)
                                    }} // 병원 ID로 채팅창 열기
                                    className="p-2.5 bg-[#009178] text-white rounded-md border-none"
                                  >
                                    상담 예약하기
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>검색 결과가 없습니다.</p>
                        )}
                      </div>
                    </div>
                </>
              )}
              </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
  
  export default Price;