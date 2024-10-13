import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SavingsComponent from './SavingsComponent';
import GoalSavingsComponent from './GoalSavingsComponent';
import Credit from '../../assets/images/Credit card.svg';
import Piggy from '../../assets/images/Piggy bank.svg';
import Investment from '../../assets/images/Investment.png';
import Growth from '../../assets/images/Growth.png';
import Trophy from '../../assets/images/trophy.svg'
import Notice from '../../assets/images/notice.svg'
import Coin from '../../assets/images/coin.png'
import Plus from '../../assets/images/blackplus.png'
import './Account.css';
import http from '../../api/medisave';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Account() {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [itemSelected, setItemSelected] = useState(false);
  const [amount, setAmount] = useState(null);
  const [amountSelected, setAmountSelected] = useState(false);
  const [term, setTerm] = useState(12);
  const [paymentFrequency, setPaymentFrequency] = useState(null);
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [benefit, setBenefit] = useState(0.03);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const memberId = storedUser.memberId;
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [createdAccount, setCreatedAccount] = useState(null);
  const [first, setFirst] = useState(null);
  const notify = (text) => toast(text);
  // 공통 함수 및 로직
  const TAX_RATE = 15.4 / 100;

  const calculateSavings = (term, amount, benefit, paymentFrequency) => {
    if (term >= 12) {
      benefit += 0.002
    }
    const isWeekly = paymentFrequency === "weekly";
    const numInstallments = !isWeekly ? term * 4 : term; // 주간이면 주당 4회, 월간이면 term이 그대로
    console.log(numInstallments)
    let installmentPayment = Math.floor(amount / numInstallments); // 회당 납부액(목표 금액에 가장 가까운 정수로 계산)
    
    // 총 납부액 및 세전 이자 계산
    let totalPayment = installmentPayment * numInstallments;
    let interestBeforeTax = 0;

    for (let i = 1; i <= numInstallments; i++) {
        // 이자는 첫 번째 납입금이 전체 기간 동안 이자가 붙고, 마지막 납입금은 1개월/주 동안 이자가 붙음
        const monthsRemaining = numInstallments - i + 1;
        const currentBenefit = (benefit * monthsRemaining) / numInstallments;
        interestBeforeTax += (installmentPayment * currentBenefit)
    }

    // 세후 이자 계산
    const tax = interestBeforeTax * TAX_RATE;
    const interestAfterTax = interestBeforeTax - tax;

    // 총 지급액 (납입액 + 세후 이자)
    const totalWithInterest = totalPayment + Math.floor(interestAfterTax);

    setResults({
        numInstallments: numInstallments,
        goalAmount: amount,
        totalPayment: totalPayment,
        installmentPayment: installmentPayment,
        interestBeforeTax: Math.floor(interestBeforeTax),
        interestAfterTax: Math.floor(interestAfterTax),
        totalAmount: totalWithInterest,
    });
  };

  const fetchAccounts = async () => {
    try {
      const response = await http.get(`/api/account/list/${memberId}`);
      setAccounts(response.data);
    } catch (error) {
      console.error('계좌 목록 가져오기 오류:', error);
    }
  };
  const handleSearch = async () => {
    setLoading(true);
    try {
        const response = await http.get(`/api/hospitals/search?region=${searchQuery}&selectedItem=${selectedItem}`);
        console.log(response.data);
        setSearchResults(response.data);
        fetchAccounts();
    } catch (error) {
        console.error("Error fetching search results:", error);
    } finally {
        setLoading(false);
    }
};
const getDayOfWeek = (date) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[date.getDay()];
};
const calculateExpectedEndDate = (term, paymentFrequency) => {
    const today = new Date();  // 오늘 날짜
    let expectedEndDate;

    if (paymentFrequency === "monthly") {
        // 오늘 날짜에서 term 개월 후의 날짜 계산
        expectedEndDate = new Date(today.setMonth(today.getMonth() + term));
    } else if (paymentFrequency === "weekly") {
        // 오늘 날짜에서 term * 4 주 후의 날짜 계산
        expectedEndDate = new Date(today.setDate(today.getDate() + (term * 4 * 7)));
    }

    return expectedEndDate;
};
const formatDateToISO = (date) => {
    return date.toISOString().split('T')[0];  // "YYYY-MM-DD" 형식
};
// 적금 계좌 생성
const createMedAccount = async (accountType) => {
    console.log(calculateExpectedEndDate(term, paymentFrequency));
    const today = new Date();  // 현재 날짜 가져오기
    const transferDay = paymentFrequency === "weekly" ? getDayOfWeek(today) : String(today.getDate());  // WEEKLY는 요일, MONTHLY는 날짜의 일(day)
    const params = {
        medAccount: {
            memberId: memberId,
            accountId: selectedAccount.accountId,
            medAccountBalance: accountType === 'FREE' ? first : results.installmentPayment,
            perDepositAmount: accountType === 'FREE' ? first : results.installmentPayment, // 'FREE'일 경우 null 처리
            medAccountDt: formatDateToISO(new Date()),
            targetSavingsAmount: amount,
            interestRate: benefit,
            preTaxInterest: accountType === 'FREE' ? null : results.interestBeforeTax, // 'FREE'일 경우 null 처리
            postTaxInterest: accountType === 'FREE' ? null : results.interestAfterTax, // 'FREE'일 경우 null 처리
            goalPeriodMonths: term, 
            accountType: accountType,
            depositCycle: accountType === 'FREE' ? null : paymentFrequency, // 'FREE'일 경우 null 처리
            transferDay: accountType === 'FREE' ? null : transferDay, // 'FREE'일 경우 null 처리
            expectedEndDate: accountType === 'FREE' ? formatDateToISO(new Date(today.setDate(today.getDate() + 1)))  : formatDateToISO(calculateExpectedEndDate(term, paymentFrequency)),
            // expectedEndDate: accountType === 'FREE' ? formatDateToISO(new Date(today.setMonth(today.getMonth() + term)))  : formatDateToISO(calculateExpectedEndDate(term, paymentFrequency)),
            // expectedEndDate: formatDateToISO(new Date(today.setDate(today.getDate() + 1)))  // 내일 날짜로 설정
            // ,
            expectedMoney: accountType === 'FREE' ? null : results.totalAmount,
            medAccountNm: accountType === 'FREE' ? selectedItem + "함께 적금" : selectedItem + "목표 적금",
            closed: 'N',
            withdraw: 1
        },
        personName: storedUser.memberNm,  // 사용자 이름
        residentRegistrationNumber: storedUser.residentNb,  // 주민번호
        email: storedUser.memberEmail,  // 이메일
        selectedItem: selectedItem  // 선택한 아이템 정보 (상품명, 선택한 적금 등)
    }
    console.log(params);
    
    try {
        const response = await http.post('/api/account/create', params, {
          headers: {
              'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
            throw new Error('Failed to create MedAccount');
        }
        const data = await response.json(); // 응답을 JSON으로 변환
        console.log('Created MedAccount:', data);
        setCreatedAccount(data)
        return data;

    } catch (error) {
        console.error('Error creating MedAccount:', error);
    } finally {
      notify(`${params.medAccount.medAccountNm} 가입이 완료되었습니다! `)
      setTimeout(() => {
        navigate('/mypage');
      }, 3000); // 3초 후 새로고침
      
    }
};
  useEffect(() => {
    fetchAccounts();
  }, []);

  const onBack = () => {
    setActiveComponent(null);
  };

  const renderComponent = () => {
    const commonProps = {
      onBack,
      selectedCategory,
      setSelectedCategory,
      selectedItem,
      setSelectedItem,
      selectedPrice,
      setSelectedPrice,
      itemSelected,
      setItemSelected,
      amount,
      setAmount,
      amountSelected,
      setAmountSelected,
      term,
      setTerm,
      paymentFrequency,
      setPaymentFrequency,
      results,
      setResults,
      searchQuery,
      setSearchQuery,
      searchResults,
      setSearchResults,
      loading,
      setLoading,
      benefit,
      setBenefit,
      accounts,
      setAccounts,
      selectedAccount,
      setSelectedAccount,
      calculateSavings,
      fetchAccounts,
      handleSearch,
      getDayOfWeek,
      calculateExpectedEndDate,
      formatDateToISO,
      createMedAccount,
      createdAccount,
      setCreatedAccount,
      first,
      setFirst, 
      notify
    };

    switch (activeComponent) {
      case 'savings':
        return <SavingsComponent {...commonProps} createMedAccount={() => createMedAccount('FREE')} />;
      case 'goalSavings':
        return <GoalSavingsComponent {...commonProps} createMedAccount={() => createMedAccount('AUTO')}/>;
      default:
        return null;
    }
  };

  return (
    <div className="">
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
      <div className="bg-white py-10">
        <div className="mx-auto max-w-[85%] px-6 lg:px-8">
          <div className="text-start">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">건강 저축 계좌</h2>
            <div className="container mx-auto p-6">
              {/* Title Section */}
              <div className="text-center text-pink-600 text-xl font-bold mb-4">
                최대 연 <span className="text-2xl">4.00%</span> (세전)
              </div>

              {/* Divider */}
              <div className="text-center text-2xl font-bold text-gray-400 my-2">||</div>

              {/* Main Grid Section */}
                <div className="flex justify-between gap-4 text-center">
                  {/* Left Box */}
                  <div className="bg-white shadow-lg p-4 rounded-lg border flex flex-col justify-center items-center">
                    <img
                      className="mx-auto mb-4"
                      src={Trophy}
                      alt="기본금리"
                      width={50}
                    />
                    <p className="text-sm text-teal-600 font-bold">원하는 치료 목표 설정하면</p>
                    <p className="text-2xl text-pink-600 font-bold">기본금리 연 3.00%</p>
                  </div>

                  {/* Plus and Middle Box Container */}
                  <div className="flex justify-center items-center">
                    {/* Plus Image */}
                    <img className="mx-auto w-6 h-6" src={Plus} alt="plus icon" />
                  </div>

                  {/* Middle Box */}
                  <div className="bg-white shadow-lg p-4 rounded-lg border flex flex-col justify-center items-center">
                    <img
                      className="mx-auto mb-4"
                      src={Coin}
                      alt="우대금리"
                      width={50}
                    />
                    <p className="text-sm text-teal-600 font-bold">1년 이상 가입하면</p>
                    <p className="text-2xl text-pink-600 font-bold">우대금리 연 0.20%</p>
                  </div>

                  {/* Plus and Right Box Container */}
                  <div className="flex justify-center items-center">
                    {/* Plus Image */}
                    <img className="mx-auto w-6 h-6" src={Plus} alt="plus icon" />
                  </div>

                  {/* Right Box */}
                  <div className="bg-white shadow-lg p-4 rounded-lg border flex flex-col justify-center items-center">
                    <img
                      className="mx-auto mb-4"
                      src={Notice}
                      alt="스마트폰뱅킹"
                      width={50}
                    />
                    <p className="text-sm text-teal-600 font-bold">함께 적금할 파트너 초대하면(최대 4명)</p>
                    <p className="text-2xl text-pink-600 font-bold">추가금리 연 0.20%</p>
                  </div>
                </div>

              <div className="flex justify-center items-center mt-10">
                {/* Plus Image */}
                <img className="mx-auto w-6 h-6" src={Plus} alt="plus icon" />
              </div>
              {/* Bottom Section */}
              <div className="text-center mt-6 text-lg text-gray-700 bg-white shadow-lg p-4 rounded-lg border">
                <span className="font-bold text-pink-600">치료에 사용했다면, 메디포인트 돌려받기!</span>
                <p className="text-sm text-gray-500 mt-2">
                  만기 해지 후 치료비 사용 증명시
                  치료비의 0.1% 메디포인트로 지급합니다.(최대 3,000P)
                </p>
              </div>
            </div>
            <AnimatePresence>
              {activeComponent === null ? (
                <motion.div
                  className="p-16 flex justify-between"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="butt w-1/3 h-[200px] bg-[#72CA3D] rounded-xl pt-8 pl-8"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    onClick={() => setActiveComponent('goalSavings')}
                  >
                    <h2 className="text-3xl font-medium tracking-tight text-white">치료 목표 적금</h2>
                    <div className="flex justify-end">
                      <img src={Growth} className="w-32 h-32" alt="" />
                    </div>
                  </motion.div>
                  <motion.div
                    className="butt w-1/3 h-[200px] bg-[#fd7702] rounded-xl pt-8 pl-8"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    onClick={() => setActiveComponent('savings')}
                  >
                    <h2 className="text-3xl font-medium tracking-tight text-white">함께 목표 적금</h2>
                    <div className="flex justify-end">
                      <img src={Investment} className="w-32 h-32" alt="" />
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  className="mt-10 "
                  key="content"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  {renderComponent()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
