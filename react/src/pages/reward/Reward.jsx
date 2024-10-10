import React, { useState, useEffect, useDispatch } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplitText } from '../../components/SplitText';
import http from '../../api/fastapi';
import medisave from '../../api/medisave';
import Talk from '../../assets/images/talk.svg'


function Reward() {
  const [medAccountData, setMedAccountData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storedUser, setStoredUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [selectedAccount, setSelectedAccount] = useState([])
  const isRewardAvailable = (expectedEndDate) => {
    const today = new Date(); // 오늘 날짜
    const endDate = new Date(expectedEndDate); // expectedEndDate를 Date 객체로 변환

    // 오늘 또는 오늘 이전인 경우 true 반환
    return endDate <= today;
  };
  const [files, setFiles] = useState({
    confirmation: null,
    receipt: null,
    detail: null,
    additional: null,
  });
  const [ocrResults, setOcrResults] = useState({
    confirmation: null,
    receipt: null,
    detail: null,
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
  const formatAccountId = (accountId) => {
    const str = accountId.toString();
    return `${str.substring(0, 3)}-${str.substring(3, 9)}-${str.substring(9)}`;
  };
  const renderFileInput = (fileType, label) => (
    <div className="flex flex-col w-[80%] items-center justify-center border-2 border-dashed border-gray-300 rounded-lg px-6 bg-gray-50">
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
          className="w-full h-[80%] object-cover"
        />
      )}
      <p className="text-gray-500 mt-2">{label}</p>
    </div>
  );

  const renderOcrResult = () => {
    const confirmationResult = ocrResults.confirmation || {};
    const receiptResult = ocrResults.receipt || {};
    const detailResult = ocrResults.detail || {};

    return (
      <div className="mt-4 text-left space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">병원 이름:</span>
          <span>{detailResult.hospital_name || '병원 이름을 인식 중...'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">환자 이름:</span>
          <span>{detailResult.patient_name || '환자 이름을 인식 중...'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">진료 기간:</span>
          <span>{detailResult.treatment_date || '진료 기간을 인식 중...'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">치료명:</span>
          <span>{detailResult.treatment_item || '치료명을 인식 중...'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">진료비 총액:</span>
          <span>{detailResult.price || '치료비를 인식 중...'}</span>
        </div>
      </div>
    );
  };
  const fetchMyData = async () => {
    try {
      const response = await medisave.get(`/api/account/medlistClosed/${storedUser.memberId}`); 
      console.log(response.data);
      setMedAccountData(response.data);
    } catch (error) {
      console.error('Failed to fetch insurance data:', error);
    }
  };
  
  const claim = async () => {
    const detailResult = ocrResults.detail || {};
    const price = parseFloat(detailResult.price?.replace(/,/g, '') || 0); // 숫자로 변환
    const reward = price * 0.001;  // 0.1% 리워드 계산
    try {
      // FormData 객체 생성
      const formData = new FormData();
      formData.append('memberId', storedUser.memberId);
      formData.append('medAccountId', selectedAccount.medAccountId);  // 만기해지한 계좌의 ID
      formData.append('rewardAmount', reward.toFixed(0));    // 리워드 금액
      formData.append('treatmentNm', ocrResults.detail.treatment_item);  
      formData.append('document', files.detail);  // 업로드한 파일 추가
      // FormData 내용 출력
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
            
  
      // 리워드 생성 요청
      const response = await medisave.post('/api/reward/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // 파일을 포함한 폼 데이터 전송
        },
      });
      
      console.log('리워드 생성 성공:', response.data);

      // rewardable 업데이트 요청
    const updateParams = {
      medAccountId: selectedAccount.medAccountId,
    };

    const updateResponse = await medisave.post('/api/account/update-rewardable', 
      updateParams,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    console.log('rewardable 업데이트 성공:', updateResponse.data);

    // reward_history 저장 후 claim 관련 함수 호출
    const params = {
      memberId: storedUser.memberId,
      reward: reward.toFixed(0),
    };

    // 리워드 신청 요청
    const claimResponse = await medisave.post('/api/members/claim', 
      params,
      {
        headers: {
          'Content-Type': 'application/json',  // JSON 형식 요청임을 명시
          Accept: 'application/json',
        },
      }
    ); 
    console.log('리워드 신청 성공:', claimResponse.data);

    // 사용자의 최신 정보 요청
    const updatedUserResponse = await medisave.get(`/api/members/${storedUser.memberId}`);
    console.log(updatedUserResponse);

    // localStorage에 업데이트된 사용자 정보 저장
    localStorage.setItem('user', JSON.stringify(updatedUserResponse.data));

    // setStoredUser 상태를 업데이트하여 UI에도 반영
    setStoredUser(updatedUserResponse.data);

      
    } catch (error) {
      console.error('리워드 생성 실패:', error);
    }
  };
  
  useEffect(() => {
    fetchMyData();
  }, []);
  const handleClaimClick = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAccount(null); 
    setIsModalOpen(false);
  };
  const totalBalance = medAccountData.reduce((acc, account) => acc + account.medAccountBalance, 0);
    return (
      <div className="containers">
        <div className="bg-white py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl text-start">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">메디포인트 신청</h2>
            </div>
            <div className="flex justify-center">
              <h1 className="text-4xl mr-2">
                내 메디포인트:
              </h1>
              <h1 className="text-4xl">
                <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <SplitText
                        alternate={true}
                        // initial={{ y: '100%' }}
                        // animate="visible"
                        // variants={{
                        //   visible: i => ({
                        //     y: 0,
                        //     transition: {
                        //       delay: i * 0.1
                        //     }
                        //   })
                        // }}
                      >
                        {String(storedUser.reward)}
                      </SplitText>
                    </motion.div>
                </AnimatePresence>
              </h1>
              <h1 className="text-4xl mr-2">
                P
              </h1>
            </div>
            <div className="flex justify-center items-center space-x-4">
              <div className="flex justify-center items-center mt-10">
                {/* Circle 1 */}
                <div className="relative z-0 w-72 h-72 bg-yellow-400 rounded-full flex flex-col justify-center items-center">
                  <p className="text-xl font-bold">하나.</p>
                  <p className="text-xl font-bold">목표했던</p>
                  <p className="text-xl font-bold">진료를 받는다.</p>
                </div>
                
                {/* Circle 2 */}
                <div className="relative -ml-10 z-0 w-72 h-72 bg-teal-400 rounded-full flex flex-col justify-center items-center">
                  <p className="text-xl font-bold">둘.</p>
                  <p className="text-xl font-bold">진료 세부내역서를</p>
                  <p className="text-xl font-bold">발급받는다.</p>
                </div>
                
                {/* Circle 3 */}
                <div className="relative -ml-10 z-10 w-72 h-72 bg-yellow-400 rounded-full flex flex-col justify-center items-center">
                  <p className="text-xl font-bold">셋.</p>
                  <p className="text-xl font-bold">세부내역서를</p>
                  <p className="text-xl font-bold">업로드한다.</p>
                  <div className="flex flex-col justify-center items-center absolute bottom-12">
                    <p className="text-base mt-1">만기해지 이후, 최근 3년 이내</p>
                    <p className="text-base">진료로 신청 가능합니다.</p>
                  </div>
                </div>
                {/* Circle 4 */}
                <div className="relative -ml-10 z-20 w-72 h-72 bg-teal-400 rounded-full flex flex-col justify-center items-center">
                  <p className="text-xl font-bold">넷.</p>
                  <p className="text-xl font-bold">치료비의 0.1%를</p>
                  <p className="text-xl font-bold">메디포인트를 환급받는다!</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="w-full bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">내 적금 현황</h2>
                <div className="flex flex-col space-y-3">
                  {medAccountData.map((account, index) => (
                    <div className="flex justify-between items-center" key={index}>
                      <div className="flex items-center">
                        <span>{account.medAccountNm}({formatAccountId(account.medAccountId)})</span>
                        {account.rewardable && account.rewardable.trim() === 'N' ? (
                          <span className="ml-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                            지급완료
                          </span>
                        ) : (
                          <span
                            className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-md cursor-pointer"
                            onClick={() => handleClaimClick(account)}
                          >
                            신청가능
                          </span>
                        )}
                      </div>
                      <span>{account.medAccountBalance.toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-6">

                  <span className="text-right text-xl font-bold">총 적금액</span>
                  <span className="text-right text-xl font-bold">{totalBalance.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isModalOpen && (
            <motion.div className="fixed inset-0 z-30 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-top bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all my-8 max-w-3xl w-full sm:p-6">
                  <div className="flex w-full items-center justify-center h-12 w-12 rounded-full">
                    <img
                      src={Talk}
                      alt="Logo"
                      className="w-10"
                    />
                    <div className="mt-3 text-center sm:mt-5">
                      <h3 className="text-2xl leading-6 font-bold text-gray-900" id="modal-title">
                        메디포인트 신청
                      </h3>
                    </div>
                  </div>
                  <div className="mt-10">
                    <p className="text-sm text-gray-500">
                      해당 진료내역으로 메디포인트를 신청하시겠습니까?
                    </p>
                  </div>
                  <div className="mt-5 sm:mt-6 flex justify-center w-full h-96">
                    {/* {renderFileInput('confirmation', '진료 확인서')} */}
                    {/* {renderFileInput('receipt', '진료비 영수증')} */}
                    {renderFileInput('detail', '세부내역서')}
                    {/* {renderFileInput('additional', '추가 서류')} */}
                  </div>
                  <div className="mt-6">
                    {renderOcrResult()}
                  </div>
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={claim}
                    >
                      신청
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

export default Reward;
