import React, { useState, useEffect, useDispatch } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BarChart from '../../components/BarChart';
import http from '../../api/fastapi';
import health from '../../api/health';

const url = "images/ins/";
const insuranceImages = {
  "현대해상": url + "hyundai.svg",
  "동양생명": url + "dongyang.svg",
  "미래에셋생명": url + "mirae.svg",
  "삼성화재": url + "samsung.svg",
  "더케이손해보험": url + "thek.svg",
  "흥국생명": url + "heungguk.svg",
  "메리츠화재": url + "meritz.svg",
  "롯데손해보험": url + "lotte.svg",
  "KB손해보험": url + "kb.svg",
  "라이나생명": url + "aig.svg",
  "교보생명": url + "kyobo.svg",
  "AXA다이렉트": url + "axa.svg",
  "AIA생명": url + "aia.svg",
  "MG손해보험": url + "mg.svg",
  "DB손해보험": url + "db.svg",
  "LIG손해보험": url + "lig.svg",
  "NH농협생명": url + "nh.svg",
  "하나생명": url + "hana.svg",
};

function Insurance() {
  const [insuranceData, setInsuranceData] = useState([{ company: "현대해상", name: "무배당운전자상해보험", premium: "20,000원", canClaim: false },
    { company: "KB손해보험", name: "금쪽같은자녀보험", premium: "107,652원", canClaim: true },
    { company: "연금보험", name: "연금보험", premium: "200,000원", canClaim: false },]);
    const [chartData, setChartData] = useState([
      {
        "category": "내 보험료",
        "보험료": 327652,
        "보험료Color": "#ff6347" // 토마토색
      },
      {
        "category": "20대 평균 보험료",
        "보험료": 210564,
        "보험료Color": "#4682b4" // 스틸 블루색
      }
    ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [residentNumber, setResidentNumber] = useState(9612052490517);
  const [files, setFiles] = useState({
    confirmation: null,
    receipt: null,
    details: null,
    additional: null,
  });
  const [ocrResults, setOcrResults] = useState({
    confirmation: null,
    receipt: null,
    details: null,
    additional: null,
  });
  
  const handleFileChange = async (event, fileType) => {
    const file = event.target.files[0];
    if (file) {
      const newFiles = { ...files, [fileType]: file };
      setFiles(newFiles);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_type', fileType);  // 파일 타입을 폼 데이터에 추가

      try {
        const response = await http.post('/insurance-ocr', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setOcrResults((prevResults) => ({
          ...prevResults,
          [fileType]: response.data,
        }));
      } catch (error) {
        console.error('Failed to upload and process file', error);
      }
    }
  };

  const renderFileInput = (fileType, label) => (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg px-6 bg-gray-50">
      {!files[fileType] && (
        <>
          <input
            id={`file-${fileType}`}
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, fileType)}
          />
          <label htmlFor={`file-${fileType}`} className="flex items-center justify-center h-12 w-12 rounded-full bg-[#009178] cursor-pointer">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </label>
        </>
      )}
      {files[fileType] && (
        <img
          src={URL.createObjectURL(files[fileType])}
          alt="Uploaded file"
          className="w-full h-32 object-cover"
        />
      )}
      <p className="text-gray-500 mt-2">{label}</p>
    </div>
  );

  const renderOcrResult = () => {
    const confirmationResult = ocrResults.confirmation || {};
    const receiptResult = ocrResults.receipt || {};

    return (
      <div className="mt-4 text-left space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">병원 이름:</span>
          <span>{confirmationResult.hospitalName || '병원 이름을 인식 중...'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">환자 이름:</span>
          <span>{confirmationResult.patientName || '환자 이름을 인식 중...'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">진료 기간:</span>
          <span>{confirmationResult.treatmentPeriod || '진료 기간을 인식 중...'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">진단명:</span>
          <span>{confirmationResult.doctorOpinion || '진단명을 인식 중...'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">진료비 총액:</span>
          <span>{receiptResult.totalAmount || '진료비 총액을 인식 중...'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">납부한 금액:</span>
          <span>{receiptResult.paidAmount || '납부한 금액을 인식 중...'}</span>
        </div>
      </div>
    );
  };
  const fetchMyData = async () => {
    try {
      const response = await health.get(`/api/insurance/member/${residentNumber}`); 
      console.log(response.data);
      // 응답 데이터를 원하는 형태로 가공
      const formattedData = response.data.map((item) => ({
        company: item.companyNm, // 예시로 COMPANY_NM 필드를 사용
        name: item.insuranceNm,  // INSURANCE_NM 필드 사용
        premium: `${item.premium}원`, // PREMIUM을 원하는 형식으로 가공
        canClaim: item.silson === 'Y', // 예: 계약 상태가 'A'일 때 청구 가능으로 표시
      }));

      // 상태에 가공된 데이터 저장
      setInsuranceData(formattedData);
    } catch (error) {
      console.error('Failed to fetch insurance data:', error);
    }
  };
  const birthYearDigits = parseInt(residentNumber.toString().substring(0, 2), 10);
  const currentYear = new Date().getFullYear();
  const birthYear = birthYearDigits < 20 ? 2000 + birthYearDigits : 1900 + birthYearDigits;
  const age = currentYear - birthYear;
  const ageGroup = Math.floor(age / 10) * 10; // 10대, 20대, 30대 등으로 계산
  const fetchAverageData = async () => {
    try {
      const response = await health.get(`/api/insurance/average-premium/${birthYearDigits}`);
      console.log('average' + response.data);
      setChartData([
        {
          category: "내 보험료",
          보험료: myPremium,
          보험료Color: "#ff6347", // 토마토색
        },
        {
          category: `${ageGroup}대 평균 보험료`, 
          보험료: response.data,
          보험료Color: "#4682b4", // 스틸 블루색
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch insurance data:', error);
    }
  };

  useEffect(() => {
    fetchMyData();
    fetchAverageData();
  }, []);
  const handleClaimClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const myPremium = chartData.find(item => item.category === "내 보험료")?.보험료 || 0;
  const avgPremium = chartData.find(item => item.category === `${ageGroup}대 평균 보험료`)?.보험료 || 0;
  
  const percentageDifference = ((myPremium - avgPremium) / avgPremium) * 100;
  const comparisonText = percentageDifference > 0
    ? `또래보다 ${Math.abs(percentageDifference.toFixed(0))}% 더 내고 있어요!`
    : `또래보다 ${Math.abs(percentageDifference.toFixed(0))}% 덜 내고 있어요!`;

    return (
      <div className="containers">
        <div className="bg-white py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl text-start">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">보험료 관리</h2>
            </div>
            <div className="flex space-x-6">
              <div className="w-2/3 bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">8월 보험료</h2>
                <div className="flex flex-col space-y-3">
                  {insuranceData.map((insurance, index) => (
                    <div className="flex justify-between items-center" key={index}>
                      <div className="flex items-center">
                        <img
                          src={insuranceImages[insurance.company] || "images/ins/hana.svg"}
                          alt={insurance.company}
                          className="w-6 h-6 mr-2"
                        />
                        <span>{insurance.name}</span>
                        {insurance.canClaim && (
                          <span
                            className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-md cursor-pointer"
                            onClick={handleClaimClick}
                          >
                            병원비 청구
                          </span>
                        )}
                      </div>
                      <span>{insurance.premium}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-right text-xl font-bold">327,652원</div>
              </div>
              <div className="w-1/3 bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">내 보험 진단</h2>
                <div className="text-center mb-4 font-bold text-lg">
                  {comparisonText}
                </div>
                <BarChart data={chartData} />
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isModalOpen && (
            <motion.div className="fixed inset-0 z-10 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-top bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all my-8 max-w-2xl w-full sm:p-6">
                  <div className="flex w-full items-center justify-center h-12 w-12 rounded-full">
                    <img
                      src="/images/talk.svg" 
                      alt="Logo"
                      className="w-10"
                    />
                    <div className="mt-3 text-center sm:mt-5">
                      <h3 className="text-2xl leading-6 font-bold text-gray-900" id="modal-title">
                        병원비 청구
                      </h3>
                    </div>
                  </div>
                  <div className="mt-10">
                    <p className="text-sm text-gray-500">
                      이 보험으로 병원비를 청구하시겠습니까?
                    </p>
                  </div>
                  <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4 h-56">
                    {renderFileInput('confirmation', '진료 확인서')}
                    {renderFileInput('receipt', '진료비 영수증')}
                    {renderFileInput('details', '세부내역서')}
                    {renderFileInput('additional', '추가 서류')}
                  </div>
                  <div className="mt-6">
                    {renderOcrResult()}
                  </div>
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModal}
                    >
                      청구
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={closeModal}
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}

export default Insurance;
