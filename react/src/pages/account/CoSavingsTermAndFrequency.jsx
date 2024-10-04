import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import http from '../../api/medisave'
import Check from '../../assets/images/check.png'
import AgreementModal from './AgreementModal';



const SavingsTermAndFrequency = ({ term, setTerm, paymentFrequency, setPaymentFrequency, calculateSavings, results, benefit, setBenefit, setAmountSelected, accounts, setSelectedAccount, selectedAccount, createMedAccount, onAgree, first, setFirst }) => {
    
    const inputRefs = useRef([]);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [password, setPassword] = useState(['', '', '', ''])
    const [checked, setChecked] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
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
    const toggleDropdown = () => {
        setOpen(!open);
    };
    const handleSliderChange = (e) => {
        const newTerm = parseInt(e.target.value, 10);
        setTerm(newTerm);
        if (term >= 12) {
            setBenefit(0.035);  // 12개월 이상이면 benefit을 0.035로 고정
        } else {
            setBenefit(0.03);   // 12개월 미만이면 기본 benefit 값으로 설정
        }
        calculateSavings();  // 계산 함수 호출
    };
    const handleAccountSelect = (account) => {
        setSelectedAccount(account); // 선택된 계좌를 저장
        setOpen(false); // 드롭다운 닫기
        setOpenModal(true)
    };
    const [showResults, setShowResults] = useState(false); 

    const handleCalculateClick = () => {
        
        calculateSavings(); 
        console.log(results);
        setShowResults(true);
    };
    const formatAccountId = (accountId) => {
        const str = accountId.toString();
        return `${str.substring(0, 3)}-${str.substring(3, 9)}-${str.substring(9)}`;
    };
    return (
        <div>
            <div className="flex-col shadow-lg p-6 rounded-lg">
                <div className="w-full flex">
                    <div className="w-1/2 bg-white p-6">
                        <h3 className="text-2xl font-semibold mb-8">적립 기간 선택</h3>
                        <div className="relative w-[85%] mx-auto">
                            <input
                                type="range"
                                id="price-range"
                                className="w-full accent-[#009178]"
                                min="6"
                                max="24"
                                value={term}
                                step="1"
                                onInput={handleSliderChange}
                            />
                            <div
                                className="absolute left-0"
                                style={{ left: `${((term - 6) / (24 - 6)) * 100}%`, transform: 'translateX(-50%)' }}
                            >
                                <span className="block mt-2 text-center text-xl">{term}개월</span>
                            </div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                            <span className="text-xl">6개월</span>
                            <span className="text-xl">2년</span>
                        </div>
                    </div>
                    <div className="w-1/2 bg-white p-6">
                        <h3 className="text-2xl font-semibold mb-4">첫 납입액으로 얼마를 설정할까요?</h3>
                        <input type="text" placeholder="금액 입력" value={first} onInput={(e) => setFirst(e.target.value)} className="border rounded-lg p-4 w-[80%] text-xl" />
                    <span className="ml-6 text-2xl pt-3">원</span>
                    </div>
                </div>
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
                <button onClick={() => setAmountSelected(false)} className="text-xl bg-white text-[#009178] border border-[#009178] hover:bg-[#009178] hover:text-white font-medium rounded-lg px-5 py-2.5 transition-colors duration-300">목표 금액 재설정하기</button>
                <button onClick={() => {setIsModalOpen(true)}} className="text-xl bg-[#009178] text-white border border-[#009178] hover:bg-white hover:text-[#009178] font-medium rounded-lg px-5 py-2.5 transition-colors duration-300">적금 가입하기</button>
            </div>
            <AgreementModal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
            onAgree={async () => {
                onAgree();
                setIsModalOpen(false); // 모달 닫기
            }} />
        </div>
    );
};

export default SavingsTermAndFrequency;
