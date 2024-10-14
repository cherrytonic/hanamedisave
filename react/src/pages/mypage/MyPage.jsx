import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountDonutChart from '../../components/AccountDonutChart';
import AccountBarChart from '../../components/AccountBarChart';
import AccountRadar from '../../components/AccountRadar';
import GoalBar from '../../components/GoalBar';
import ClosureModal from './ClosureModal'
import Check from '../../assets/images/check.png'
import http from '../../api/medisave';
import WithdrawModal from './WithdrawModal';
import LoadingOverlay from '../../components/LoadingOverlay';
import './MyPage.css'
const { Kakao } = window;

function MyPage() {
  const navigate = useNavigate();
  const CLIENT_ID = process.env.REACT_APP_KAKAOMAP_KEY;
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null); // 마지막 메시지 상태 추가
  const lastMessageTextRef = useRef(null); // 마지막 처리된 메시지 텍스트 추적
  useEffect(()=>{
    // init 해주기 전에 clean up 을 해준다.
      Kakao.cleanup();
      // 자신의 js 키를 넣어준다.
      Kakao.init(CLIENT_ID);
      // 잘 적용되면 true 를 뱉는다.
      console.log(Kakao.isInitialized());
      
  },[]);
  const processedMessages = useRef(new Set()); // Set을 ref로 사용
  const clientRef = useRef(null); // 클라이언트 객체를 ref로 저장
  const connectWebSocket = () => {
    if (clientRef.current) return; // 이미 연결되어 있으면 실행하지 않음
    // const socket = new SockJS('http://localhost:8080/ws');
    const socket = new SockJS('https://www.hanamedisave.site/api/ws');
    const client = Stomp.over(socket);

    client.connect({}, () => {
      if (!client.connected) return;

      client.subscribe('/sub/medAccount/closure', (message) => {
        const newMessage = JSON.parse(message.body);
        console.log('뉴메세지', newMessage);

        if (!processedMessages.current.has(newMessage.text)) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          notify(newMessage.text);

          processedMessages.current.add(newMessage.text); // Set에 메시지 추가
        }
      });
    });

    clientRef.current = client; // 연결된 클라이언트를 ref에 저장
  };

  useEffect(() => {
    connectWebSocket(); // 컴포넌트가 처음 렌더링될 때 WebSocket 연결

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect(); // 컴포넌트가 언마운트될 때 연결 해제
        clientRef.current = null; // 클라이언트 초기화
      }
    };
  }, []); // 빈 배열로 한 번만 실행


  const shareKakao = (medAccountId) => {
    console.log('shareKakao에서 받은 medAccountId:', medAccountId);
    if (!medAccountId) {
        console.error('medAccountId가 유효하지 않습니다.');
        return;
    }
    Kakao.Share.sendCustom({
        templateId: 112236,
        templateArgs: {
            url: `join/${medAccountId}`,
            name: memberNm
        }
    });
};
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const memberId = storedUser.memberId;
  const memberNm = storedUser.memberNm;
  const [donutData, setDonutData] = useState([]);
  const [barData, setBarData] = useState([
      // { month: "7월 2024", totalAssets: 1500000, "예금": 600000, "적금": 900000 },
      // { month: "8월 2024", totalAssets: 1000000, "예금": 500000, "적금": 500000 },
    ]);
  const [expandedAccount, setExpandedAccount] = useState(null);
  const [accountData, setAccountData] = useState([]);
  const [first, setFirst] = useState(null);
  const [point, setPoint] = useState("0");
  const inputRefs = useRef([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [password, setPassword] = useState(['', '', '', ''])
  const [checked, setChecked] = useState(false)
  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetNumber, setTargetNumber] = useState(null);
  const [goalAccount, setGoalAccount] = useState([])
  const isCloseAvailable = (expectedEndDate) => {
    const today = new Date(); // 오늘 날짜
    const endDate = new Date(expectedEndDate); // expectedEndDate를 Date 객체로 변환

    // 오늘 또는 오늘 이전인 경우 true 반환
    return endDate <= today;
  };
  const sendMoney = async () => {
    const totalAmount = (!isNaN(parseInt(first)) && !isNaN(parseInt(point)) 
    ? (parseInt(first) + parseInt(point)).toString()  // 합친 값을 문자열로 변환
    : "0");
    try {
      const response = await http.post(`/api/account/send/${targetNumber}`, {
        memberId: memberId,
        depositAmount: totalAmount,
        point: point
      });

      const updatedReward = response.data.newReward;
      console.log(updatedReward);
      
      const user = JSON.parse(localStorage.getItem('user'));
      user.reward = updatedReward;
      localStorage.setItem('user', JSON.stringify(user));

    } catch (error) {
      console.error("Error joining MedAccount:", error.response ? error.response.data : error.message);
    } finally {
      setIsModalOpen(false)
      notify('송금 완료되었습니다!')
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3초 후 새로고침
    }
  };
  const handleOpen = () => {
    setOpen(!open);
  }
  const handleModalOpen = (num) => {
    setTargetNumber(num)
  }
  const handleModalClose = () => {
    setTargetNumber(null)
  }
  const fetchAccounts = async () => {
    try {
      const response = await http.get(`/api/account/list/${memberId}`);
      setAccounts(response.data);
    } catch (error) {
      console.error('계좌 목록 가져오기 오류:', error);
    }
  };
  useEffect(() => {
    fetchAccounts();
    fetchMyData(); // 컴포넌트가 렌더링될 때 API 호출
  }, []);
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
  const transformDonutData = (responseData) => {
      const depositTotal = responseData.depositAccounts.reduce((sum, account) => sum + account.accountBalance, 0);
      const regularSavingsTotal = responseData.regularSavings.reduce((sum, account) => sum + account.medAccountBalance, 0);
      const freeInstallmentTotal = responseData.freeInstallmentSavings.reduce((sum, account) => sum + account.medAccountBalance, 0);
      return [
        { id: '예금', label: '예금', value: depositTotal, color: '#d6ae7b' },
        { id: '목표 적금', label: '목표 적금', value: regularSavingsTotal, color: '#00c9ff' },
        { id: '함께 적금', label: '함께 적금', value: freeInstallmentTotal, color: '#ff0844' },
      ];
  };
  const handleToggle = (accountId) => {
    setExpandedAccount(expandedAccount === accountId ? null : accountId);
  };
  const getAchievementRate = (balance, target) => {
    return ((balance / target) * 100).toFixed(1);
  };
  const [expandedMedAccount, setExpandedMedAccount] = useState(null);

  // 계좌를 클릭할 때 확장/축소 상태를 변경하는 함수
  const handleMedToggle = (accountId) => {
    if (expandedMedAccount === accountId) {
      setExpandedMedAccount(null); // 동일 계좌 클릭 시 축소
    } else {
      setExpandedMedAccount(accountId); // 다른 계좌 클릭 시 해당 계좌 확장
    }
  };
  const transformBarData = (responseData) => {
    const monthData = {};
  
    // 예금의 월별 변화 처리
    Object.keys(responseData.monthlyAccountTrends).forEach(accountId => {
      const accountTrends = responseData.monthlyAccountTrends[accountId];
      Object.keys(accountTrends).forEach(month => {
        if (!monthData[month]) {
          monthData[month] = { totalAssets: 0, '적금': 0, '예금': 0 };
        }
        monthData[month]['예금'] += accountTrends[month];
      });
    });
  
    // 적금의 월별 변화 처리
    Object.keys(responseData.monthlySavingTrends).forEach(medAccountId => {
      const savingTrends = responseData.monthlySavingTrends[medAccountId];
      Object.keys(savingTrends).forEach(month => {
        if (!monthData[month]) {
          monthData[month] = { totalAssets: 0, '적금': 0, '예금': 0 };
        }
        monthData[month]['적금'] += savingTrends[month];
      });
    });

    // 날짜 문자열을 Date 객체로 변환하는 함수
    const parseDate = (monthString) => {
      const [month, year] = monthString.split(' ');
      const monthNumber = month.replace('월', '').trim();
      return new Date(`${year}-${monthNumber}-01`); // 'YYYY-MM-01' 형식으로 변환
    };

    // 누적 자산 계산 및 정렬
    const sortedData = Object.keys(monthData).map(month => {
      const deposits = monthData[month]['예금'];
      const savings = monthData[month]['적금'];
      const totalAssets = deposits + savings;
  
      return {
        month,
        totalAssets,
        '적금': savings,
        '예금': deposits,
      };
    }).sort((a, b) => parseDate(b.month) - parseDate(a.month));  // 미래의 날짜부터 정렬

    // 가장 미래의 6개월치 데이터만 반환
    return sortedData.slice(0, 6);
};

  
  const processData = (medAccount) => {
    const { records, targetSavingAmount } = medAccount;
  
    // 참여자 색상 배열 (고정 순서)
    const colors = ['#FF0844', '#90F7D6', '#FF9068', '#F7FF00', '#00C9FF'];
  
    // senderName별 savingAmount 합산
    const senderData = {};
    const sortedRecords = records.sort((a, b) => new Date(a.savingDate) - new Date(b.savingDate));
    sortedRecords.forEach(record => {
      const sender = record.senderName || "Unknown";  // senderName이 null이면 "Unknown"으로 처리
      if (!senderData[sender]) {
        senderData[sender] = 0;
      }
      senderData[sender] += record.savingAmount;
    });
  
    // 도넛 차트에 표시할 데이터 생성
    const chartData = Object.keys(senderData).map((sender, index) => {
      let color;
  
      if (sender === memberNm) {
        // 로그인한 사용자에게는 고정 색상 #00C9FF
        color = '#00C9FF';
      } else {
        // 다른 참여자들에게 색상을 할당
        color = colors[index % (colors.length - 1)];  // 로그인한 사용자를 위한 색상 하나는 제외
      }
  
      return {
        id: sender,
        label: sender,
        value: senderData[sender],
        color: color
      };
    });
  
    // 나머지 부족한 금액 계산
    const totalSaved = Object.values(senderData).reduce((acc, curr) => acc + curr, 0);
    const remainingAmount = Math.max(0, targetSavingAmount - totalSaved); // 남은 금액이 0보다 작으면 0으로 처리
  
    // 부족한 부분을 회색으로 추가 (남은 금액이 있을 경우에만 추가)
    if (remainingAmount > 0) {
      chartData.push({
        id: '잔여금액',
        label: '잔여금액',
        value: remainingAmount,
        color: '#d3d3d3' // 회색으로 표시
      });
    }
    return chartData;
  };
  
  useEffect(() => {
    fetchData();
    fetchParticipantData();
  }, []);
  const processAccounts = (accounts) => {
    // 1. 계좌들을 medAccountDt 기준으로 정렬
    const sortedAccounts = accounts.sort((a, b) => new Date(a.medAccountDt) - new Date(b.medAccountDt));
  
    // 2. 각 계좌의 records를 transactionDate 기준으로 정렬
    sortedAccounts.forEach(account => {
      if (account.records) {
        account.records.sort((a, b) => new Date(a.transactionDate) - new Date(b.transactionDate));
      }
    });
  
    return sortedAccounts;
  };
  const fetchData = useCallback(async (center) => {
    console.log('요청 보냄:');
    try {
        const response = await http.get(`/api/account/analyze/${memberId}`);
        console.log('API response:', response);  // API 응답 확인
        const donutChartData = transformDonutData(response.data)
        const newBarData = transformBarData(response.data)
        console.log(newBarData);
        
        console.log('도넛데이터', donutChartData);
        setDonutData(donutChartData);
        setBarData(sortDataByMonth(newBarData));
        setLoading(false);
    } catch (error) {
        console.error('Failed to fetch asset:', error);
        setLoading(false);
    }
  }, []);
  const fetchMyData = async () => {
    try {
      const response = await http.get(`/api/account/medlist/${memberId}`); 
      console.log(response.data);
      setGoalAccount(processAccounts(response.data));
      console.log('goalAccount', response.data);
      
    } catch (error) {
      console.error('Failed to fetch medAccount data:', error);
    }
  };
  const fetchParticipantData = useCallback(async () => {
    console.log('요청 보냄:');
    try {
      const response = await http.get(`/api/account/participant/${memberId}`);
      console.log('API response:', response.data);  // API 응답 확인
      const processedData = Object.entries(response.data).reduce((acc, [accountId, account]) => {
        const chartData = processData(account);  // 계좌별 차트 데이터 생성
        acc[accountId] = { ...account, chartData };  // 계좌 데이터에 차트 데이터를 추가
        return acc;
      }, {});
      console.log('processdData', processedData);
      
      setAccountData(processedData); 
      setLoading(false);
    } catch (error) {
        console.error('Failed to fetch participant:', error);
        setLoading(false);
    }
  }, []);
  // 만기 해지
  const [isClosureModalOpen, setClosureModalOpen] = useState(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedMedAccount, setSelectedMedAccount] = useState(null);
  const closeClosureModal = () => {
    setClosureModalOpen(false);
  };
  const closeWithdrawModal = () => {
    setWithdrawModalOpen(false);
  };

  const showModal = (account) => {
    setSelectedMedAccount(account)
    const closureDetails = calculateClosureAmount(account);
    setClosureModalOpen(true);
  };
  const showWithdrawModal = (account) => {
    setSelectedMedAccount(account)
    const closureDetails = calculateClosureAmount(account);
    setWithdrawModalOpen(true);
  };
  const notify = (text) => toast(text);
  const closeAccount = async (medAccountId, amount, accountId) => {
    try {
      const response = await http.post(`/api/account/close/${medAccountId}`, {
        amount: 3647111,
        accountId: accountId
      }); 
      notify('적금 해지 완료되었습니다.')

      // 3초 후에 페이지 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3초 후 새로고침
    } catch (error) {
      console.error('Failed to close ACCOUNT:', error);
    }
  };

  const sortDataByMonth = (data) => {
    return data.sort((a, b) => {
        const parseMonth = (monthString) => {
            const [month, year] = monthString.split(" ");
            const monthNumber = month.replace("월", "").padStart(2, '0'); // "9월" -> "09"
            return `${year}-${monthNumber}`; // "2024-09" 형식으로 변환
        };

        const dateA = new Date(parseMonth(a.month));
        const dateB = new Date(parseMonth(b.month));

        return dateA - dateB;
    });
};
  
  const withdraw = async (medAccountId, amount, accountId) => {
    try {
      const response = await http.post(`/api/account/withdraw/${medAccountId}`, {
        amount: amount,
        accountId: accountId
      }); 
      setTimeout(() => {
        notify('중도 인출이 완료되었습니다.')
        window.location.reload();
      }, 3000); // 3초 후 새로고침
    } catch (error) {
      console.error('Failed to close ACCOUNT:', error);
    }
  }

  const TAX_RATE = 15.4 / 100;

  // 우대 이율 계산 (FREE 계좌의 경우 참여자에 따라 추가 이율 부여)
  const calculateInterestRate = (account, accountData) => {    
    if (!account) {
      console.error('Account is null or undefined');
      return 0;  // 기본값 반환
    }
    let baseRate = account.interestRate;  
    return baseRate;
  };
  

  // 복리 이자 계산 함수 (납입 이후 현재 시점까지 경과한 기간을 기준으로 이자 계산)
const calculateCompoundInterest = (account, accountData) => {
  if (!account) {
    console.error('Account is null or undefined');
    return { interestBeforeTax: 0, interestAfterTax: 0 };
  }

  const TAX_RATE = 15.4 / 100; // 세율
  let interestRate = calculateInterestRate(account, accountData); // 우대 이율 계산
  let interestBeforeTax = 0;

  const today = new Date(); // 현재 날짜

  // FREE 계좌에 대한 이자 계산 (각 입금 기록에 따라 일 단위로 계산)
  if (account.accountType === 'FREE') {
    const currentAccountData = accountData?.[`${account.medAccountNm} (${account.medAccountId})`];
    if (currentAccountData) {
      currentAccountData.records.forEach(record => {
        const savingDate = new Date(record.savingDate);
        const today = new Date(); // 현재 날짜
        const daysPassed = Math.ceil((today - savingDate) / (1000 * 60 * 60 * 24)); // 경과된 일수   
        if (daysPassed > 0) {
          // 일 단위 이자 계산 (단리 방식): 원금 * (연이율(%) / 100 / 365) * 경과 일수
          interestBeforeTax += record.savingAmount * (interestRate / 365) * daysPassed;
        }     
      });
    }
  } else {
    // 정기적금 계좌에 대한 이자 계산
    const months = account.goalPeriodMonths;
    const isWeekly = account.depositCycle === 'weekly';
    const numInstallments = isWeekly ? months * 4 : months;

    // 납입 주기에 따른 이자 계산
    for (let i = 1; i <= numInstallments; i++) {
      const currentInstallmentDate = new Date(account.firstDepositDate);
      if (isWeekly) {
        currentInstallmentDate.setDate(currentInstallmentDate.getDate() + (i * 7)); // 주 단위로 날짜 계산
      } else {
        currentInstallmentDate.setMonth(currentInstallmentDate.getMonth() + i); // 월 단위로 날짜 계산
      }

      // 만약 현재 날짜보다 이전 납입일이라면 이자 계산
      if (currentInstallmentDate <= today) {
        const daysPassed = Math.ceil((today - currentInstallmentDate) / (1000 * 60 * 60 * 24));
        const monthsPassed = daysPassed / 30;

        // 이자 계산: 원금 * (1 + (연이율 / 12))^개월 수
        interestBeforeTax += account.perDepositAmount * Math.pow(1 + (interestRate / 12), monthsPassed);
      }
    }
  }

  const tax = interestBeforeTax * TAX_RATE;
  const interestAfterTax = interestBeforeTax - tax;

  return { interestBeforeTax: interestBeforeTax.toFixed(2), interestAfterTax: interestAfterTax.toFixed(2) };
};


  // 계좌 해지 금액 계산
  const calculateClosureAmount = (account) => {
    if (!account) {
      return { interestBeforeTax: 0, interestAfterTax: 0 };  // 기본값 반환
    }
  
    const { interestBeforeTax, interestAfterTax } = calculateCompoundInterest(account, accountData);
    const totalClosureAmount = account.medAccountBalance + Math.floor(interestAfterTax);

    return {
      totalClosureAmount,
      interestBeforeTax: Math.floor(interestBeforeTax),
      interestAfterTax: Math.floor(interestAfterTax),
      interestRate: calculateInterestRate(account),
    };
  };

  if (loading) {
    return  <LoadingOverlay message="데이터를 불러오고 있습니다..." />;  // 로딩 중일 때 표시될 내용
  }

  if (!accountData) {
    return <div>No data available</div>;  // 데이터가 없을 때 표시될 내용
  }
  return (
    <div className="containers">
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
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl text-start">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">내 자산 현황</h2>
            </div>
            <div className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 mt-4 lg:mx-0 flex justify-between lg:max-w-none">
                <div className="p-4 w-1/2">
                    <h3 className="p-4 text-2xl font-semibold">자산 비율</h3>
                    <AccountDonutChart data={donutData} />
                </div>
                <div className="p-4 w-1/2">
                    <h3 className="p-4 text-2xl font-semibold">월별 자산 변화</h3>
                    <AccountBarChart data={barData} />
                </div>
            </div>
        </div>
      </div>
      <div className="bg-white pb-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl text-start">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">내 목표 적금</h2>
            </div>
            <div className="mx-auto max-w-2xl rounded-3xl ring-1 p-6 ring-gray-200 mt-4 lg:mx-0 justify-between lg:max-w-none">
            <h3 className="p-4 text-2xl font-semibold">적금 관리</h3>
            {goalAccount.map((account, index) => {
              // 달성률을 계산: (현재 적립금 / 목표 적립금) * 100
              const achievementRate = Math.round((account.medAccountBalance / account.targetSavingsAmount) * 1000) / 10;

              // 남은 부분은 항상 0 이상으로 설정 (초과한 금액을 표현하기 위해)
              const remainingRate = Math.max(100 - achievementRate, 0);
              return (     
                <div className="flex justify-between items-start p-4 bg-white shadow-sm rounded-lg" key={index}>
                  <div className="w-1/2 flex justify-between">
                  <motion.div
                    key={account.medAccountId}
                    className="bg-white rounded-2xl w-full shadow-lg p-4 overflow-y-scroll scrollbar-custom"
                    initial={{ maxHeight: '4rem' }}
                    animate={{ maxHeight: expandedMedAccount === account.medAccountId ? '500px' : '4rem' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    onClick={() => handleMedToggle(account.medAccountId)} // 클릭 시 상세 정보 토글
                  >
                    <div className="flex justify-between">
                      <span className="text-xl font-semibold">{account.medAccountNm}</span>
                      <div className="flex ">
                        <span className="ml-2 text-xl font-semibold">{account.medAccountBalance.toLocaleString()}원</span>
                        {isCloseAvailable(account.expectedEndDate) ? (
                          <span
                            className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-md cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 전파 중단 (부모 div 클릭 방지)
                              showModal(account);
                            }}
                          >
                            만기
                          </span>
                        ) : (
                          <span
                            className="ml-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-md cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 전파 중단 (부모 div 클릭 방지)
                              showWithdrawModal(account);
                            }}
                          >
                            중도인출
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 클릭 시 확장된 상태에서만 상세 정보 표시 */}
                    {expandedMedAccount === account.medAccountId && (
                      <div className="mt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-600 mb-4">
                            만기
                          </span>
                          <span className="text-lg font-semibold text-gray-600 mb-4">
                            {account.expectedEndDate}       
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-600 mb-4">
                            달성률
                          </span>
                          <span className="text-lg font-semibold text-gray-600 mb-4">
                            {achievementRate}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-600 mb-4">
                            우대이율
                          </span>
                          <span className="text-lg font-semibold text-gray-600 mb-4">
                          {(account.interestRate * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-600 mb-4">
                            계좌번호
                          </span>
                          <span className="text-lg font-semibold text-gray-600 mb-4">
                            {formatAccountId(account.medAccountId)}
                          </span>
                        </div>
                        {/* 입금 기록 표시 */}
                        <p className="text-md font-semibold text-gray-600 mb-4">
                          입금 기록
                        </p>
                        {account.records && account.records.length > 0 ? (
                          account.records.map((record, index) => (
                            <div key={index} className="flex justify-between items-center mt-2">
                              <div className="flex items-center">
                                <span className="text-gray-700">{record.transactionDate.split('T')[0]}</span> {/* 날짜 표시 */}
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-700 mr-2">{record.sender || 'Unknown'}</span>
                                <span className="text-gray-700">{record.amount.toLocaleString()} 원</span> {/* 금액 표시 */}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 mt-4">입금 기록이 없습니다.</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                  <ClosureModal 
                    isOpen={isClosureModalOpen} 
                    closeModal={closeClosureModal} 
                    account={selectedMedAccount}
                    closureDetails={calculateClosureAmount(selectedMedAccount)} 
                    closeAccount={closeAccount}
                    toggleDropdown={toggleDropdown}
                    open={open}
                    checked={checked}
                    selectedAccount={selectedAccount}
                    formatAccountId={formatAccountId}
                    accounts={accounts}
                    handleAccountSelect={handleAccountSelect}
                  />
                    <WithdrawModal 
                    isOpen={isWithdrawModalOpen} 
                    closeModal={closeWithdrawModal} 
                    account={selectedMedAccount}
                    closureDetails={calculateClosureAmount(selectedMedAccount)} 
                    withdraw={withdraw}
                    closeAccount={closeAccount}
                    toggleDropdown={toggleDropdown}
                    open={open}
                    checked={checked}
                    selectedAccount={selectedAccount}
                    formatAccountId={formatAccountId}
                    accounts={accounts}
                    handleAccountSelect={handleAccountSelect}
                  />
                  {/* GoalBar 차트 */}
                </div>
                <div className="w-1/2 mt-1 flex justify-center items-center">
                  <GoalBar 
                    data={[{
                      category: account.medAccountNm,
                      '달성률': achievementRate.toFixed(1), // 달성된 부분
                      '남은 부분': remainingRate.toFixed(1), // 남은 부분
                      달성률Color: (achievementRate >= 100) ? '#4caf50' : '#ff9800' // 색상
                    }]}
                  />
                  <div className="flex flex-col justify-center">
                    <span className="ml-2 text-lg">%</span>
                  </div>
                </div>
                </div>
              );
            })}
            </div>
        </div>
      </div>
      <div className="bg-white pb-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl text-start">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">내 함께 적금</h2>
          </div>
            <div className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 mt-4 lg:mx-0 lg:max-w-none p-4 relative">
                <h3 className="p-4 text-2xl font-semibold">계좌 정보와 적금 참여율</h3>
                {Object.entries(accountData).map(([accountId, accountData]) => (
                  <div className="flex justify-center relative">
                    {targetNumber === accountData.medAccountId && (
                <div className="absolute w-1/2 right-0 bg-white rounded-lg shadow-md p-6 z-50">            
                <div className="w-full p-6 mt-4">
                  <div className="flex justify-between mb-8">
                    <h3 className="text-2xl font-semibold">어느 계좌에서 출금할까요?</h3>
                    <button className="text-gray-500 hover:text-black text-lg" onClick={handleModalClose}>&times;</button>
                  </div>
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
                <div className="w-full mt-4 p-6">
                  <h3 className="text-2xl font-semibold mb-4">얼마를 납입할까요?</h3>
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
                  <button onClick={() => {sendMoney()
                  }} className="text-xl bg-[#009178] text-white border border-[#009178] hover:bg-white hover:text-[#009178] font-medium rounded-lg px-5 py-2.5 transition-colors duration-300">송금</button>
                </div>
              </div>
              )}
                    <div className="p-4 w-1/2">
                      <div className="">
                        <motion.div
                          key={accountId}
                          className="bg-white rounded-2xl shadow-lg p-4 overflow-y-scroll scrollbar-custom"
                          initial={{ maxHeight: '4rem' }}
                          animate={{ maxHeight: expandedAccount === accountId ? '500px' : '4rem' }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                          onClick={() => handleToggle(accountId)}
                        >
                          {/* 계좌 정보 표시 */}
                          <div className="flex justify-between items-center cursor-pointer">
                            <h3 className="text-xl font-bold text-gray-900">{accountData.medAccountName}</h3>
                            <div className="flex">                         
                              <p className="text-xl font-semibold text-gray-600">
                                {accountData.medAccountBalance.toLocaleString()}원
                              </p>
                              <button className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-md cursor-pointer z-10" onClick={()=>handleModalOpen(accountData.medAccountId)}>송금하기</button>
                            </div>
                          </div>
                          {/* 입금 기록 표시 (클릭 시 확장) */}
                          {expandedAccount === accountId && (
                            <div className="mt-4">
                              <div className="flex justify-between">
                                <span className="text-lg font-semibold text-gray-600 mb-4">
                                  만기
                                </span>
                                <span className="text-lg font-semibold text-gray-600 mb-4">
                                  {accountData.expectedEndDate}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-lg font-semibold text-gray-600 mb-4">
                                  달성률
                                </span>
                                <span className="text-lg font-semibold text-gray-600 mb-4">
                                  {getAchievementRate(accountData.medAccountBalance, accountData.targetSavingAmount)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-lg font-semibold text-gray-600 mb-4">
                                  우대이율
                                </span>
                                <span className="text-lg font-semibold text-gray-600 mb-4">
                                {(accountData.interestRate * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-lg font-semibold text-gray-600 mb-4">
                                  계좌번호
                                </span>
                                <span className="text-lg font-semibold text-gray-600 mb-4">
                                  {formatAccountId(accountData.medAccountId)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-lg font-semibold text-gray-600 mb-4">
                                  초대하기
                                </span>
                                <div id="kakaotalk-sharing-btn" onClick={() => {shareKakao(accountData.medAccountId)}}>
                                  <img className="size-8" src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                                    alt="카카오톡 공유 보내기 버튼" />
                                </div>
                              </div>
                            <p className="text-md font-semibold text-gray-600 mb-4">
                              입금 기록
                            </p>
                              {accountData.records.length > 0 ? (
                                accountData.records.map((record, index) => (
                                  <div key={index} className="flex justify-between items-center mt-2">
                                    <div className="flex items-center">
                                      <span className="text-gray-700">{record.savingDate.split('T')[0]}</span> {/* 날짜 표시 */}
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-gray-700 mr-2">{record.senderName || 'Unknown'}</span>
                                      <span className="text-gray-700">{record.savingAmount.toLocaleString()} 원</span> {/* 금액 표시 */}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-500 mt-4">입금 기록이 없습니다.</p>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>
                    <div className="p-4 w-1/2">
                      <AccountRadar data={accountData.chartData}/>
                    </div>
                  </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
export default MyPage;