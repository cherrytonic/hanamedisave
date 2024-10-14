import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Check from '../../assets/images/check.png'
import http from '../../api/medisave';
function Family() {
  const { medAccountId } = useParams(); // URL에서 medAccountId 가져오기
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const memberId = storedUser.memberId; // 로그인된 사용자 ID
  const [first, setFirst] = useState(null);
  const [point, setPoint] = useState(0);
  const inputRefs = useRef([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [password, setPassword] = useState(['', '', '', ''])
  const [checked, setChecked] = useState(false)
  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const navigate = useNavigate();
  const fetchAccounts = async () => {
    try {
      const response = await http.get(`/api/account/list/${memberId}`);
      setAccounts(response.data);
    } catch (error) {
      console.error('계좌 목록 가져오기 오류:', error);
    }
  };
  useEffect(() => {
    fetchAccounts(); // 컴포넌트가 렌더링될 때 API 호출
  }, []);
  const handleJoin = async () => {
    const totalAmount = (!isNaN(parseInt(first)) && !isNaN(parseInt(point)) 
    ? (parseInt(first) + parseInt(point)).toString()  // 합친 값을 문자열로 변환
    : "0");
    
    try {
      const response = await http.post(`/api/account/join/${medAccountId}`, {
        memberId: memberId,
        depositAmount: first,
        point: point,
      });
      console.log(response.data);  // 성공적으로 참여했을 때 처리
    } catch (error) {
      console.error("Error joining MedAccount:", error.response ? error.response.data : error.message);
    } finally {
      navigate('/mypage')
    }
  };
  const toggleDropdown = () => {
    setOpen(!open);
  };
  const formatAccountId = (accountId) => {
    const str = accountId.toString();
    return `${str.substring(0, 3)}-${str.substring(3, 9)}-${str.substring(9)}`;
  };
  const checkPassword = async () => {
    const enteredPassword = password.join(''); // 배열을 문자열로 변환
    console.log('Entered Password:', enteredPassword);
    try {
        const response = await http.post(`/api/account/verify-password`, {
            accountId: selectedAccount.accountId, // 선택된 계좌 ID
            password: enteredPassword            // 입력한 비밀번호
        });
        if (response.status === 200) {  // 비밀번호가 맞다면
            setChecked(true);
            setOpenModal(false);
        } else {
            console.log('비밀번호 불일치');
        }
    } catch (error) {
        console.error('비밀번호 확인 중 오류 발생:', error);
    }
  };
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 3) {
        inputRefs.current[index + 1].focus();
    }
    const newPassword = [...password]; // 기존 비밀번호 상태를 복사
    newPassword[index] = value; // 해당 인덱스의 값을 업데이트
    setPassword(newPassword); // 새로운 비밀번호 배열로 업데이트
  };
  const handleAccountSelect = (account) => {
    setSelectedAccount(account); // 선택된 계좌를 저장
    setOpen(false); // 드롭다운 닫기
    setOpenModal(true)
  };
    return (
      <div className="containers">
        <div className="bg-white py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl text-start">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">적금 가입하기</h2>
            </div>
            <div className="w-full h-[96%] bg-white rounded-lg shadow-md p-6 z-50 m-1">                
              <div className="w-full flex mt-4">
                <div className="w-1/2 bg-white p-6">
                    <h3 className="text-2xl font-semibold my-8">어느 계좌에서 출금할까요?</h3>
                </div>
                <div className="w-1/2 bg-white p-6">
                  <div className="w-full relative">
                      <button
                          onClick={toggleDropdown}
                          className={`focus:outline-none w-full cursor-pointer text-xl text-gray-700 hover:text-black flex justify-between p-2 pl-3 pr-1 border-b border-[#009178] ${open ? 'shadow-none border-gray-300' : ''}`}
                      >
                          <div className="flex">
                              {checked && (
                                  <img className="size-6 mr-2" src={Check} alt=""/>
                              )}
                          {selectedAccount ? `하나 ${formatAccountId(selectedAccount.accountId)}` : '계좌번호를 선택하세요.'}
                          </div>
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className={`ml-1 transform duration-300 fill-current text-gray-500 w-6 h-6 ${open ? 'rotate-180' : ''}`}
                          >
                              <path
                                  fillRule="evenodd"
                                  d="M15.3 10.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4l3.3 3.29 3.3-3.3z"
                              />
                          </svg>
                      </button>
                      {open && (
                          <ul
                              className="w-full bg-white absolute left-0 shadow w-40 rounded text-gray-500 origin-top shadow-lg transition-transform transform scale-y-100"
                          >
                              {accounts.map((account, idx) => (
                              <li key={idx}
                              className="py-1 px-3 block text-gray-500 hover:bg-green-100"
                              onClick={() => handleAccountSelect(account)}
                              >
                                  하나 {formatAccountId(account.accountId)}
                              </li>
                          ))}
                          </ul>
                      )}
                      {selectedAccount && (
                          <div className="mt-2 text-xl text-gray-600 text-end">
                              출금 가능 금액: {selectedAccount.accountBalance.toLocaleString()} 원
                          </div>
                      )}
                      
                  </div>
                </div>
              </div>
              <div className="w-full mt-4 p-6">
                <h3 className="text-2xl font-semibold mb-6">얼마를 납입할까요?</h3>
                  <div className="flex">
                      <input type="text" placeholder="금액 입력" value={first} onInput={(e) => setFirst(e.target.value)} className="focus:outline-none w-full cursor-pointer text-xl text-gray-700 hover:text-black flex justify-between p-2 pl-3 pr-1 text-lg border-b border-[#009178] text-right" />
                      <span className="ml-4 text-xl pt-3">원</span>
                  </div>
                  <p className="font-semibold mt-6 text-xl">메디포인트 사용(가용 포인트 : {storedUser.reward.toLocaleString()}p)</p>
                  <div className="flex mt-2">
                      <input type="text" placeholder="포인트 입력" value={point} onInput={(e) => setPoint(e.target.value)} className="focus:outline-none w-full cursor-pointer text-xl text-gray-700 hover:text-black flex justify-between p-2 pl-3 pr-1 text-lg border-b border-[#009178] text-right" />
                      <span className="ml-4 text-xl pt-5">P</span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <h3 className="text-2xl font-semibold mt-4">총 납입액</h3>
                    <h3 className="text-2xl font-semibold mt-4">{(!isNaN(parseInt(first)) && !isNaN(parseInt(point)) ? (parseInt(first) + parseInt(point)).toLocaleString() : 0)} 원</h3>
                  </div>
              </div>
              {openModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg p-8">
                    <h2 className="text-xl font-bold mb-4">계좌 비밀번호 입력</h2>
                    <div className="flex justify-center gap-2 mb-6">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                type="text"
                                maxLength="1"
                                pattern="[0-9]"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                required
                                onChange={(e) => handleInputChange(e, index)}
                                value={password[index]}
                            />
                        ))}
                    </div>
                    <div className="flex justify-center">
                      <button
                          className="bg-[#009178] hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          onClick={() => checkPassword()}
                      >
                          확인
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-center mt-10 space-x-4">

                <button onClick={() => {
                  handleJoin()
                  // navigate('/')
                }} className="text-xl bg-[#009178] text-white border border-[#009178] hover:bg-white hover:text-[#009178] font-medium rounded-lg px-5 py-2.5 transition-colors duration-300">적금 참여하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Family;