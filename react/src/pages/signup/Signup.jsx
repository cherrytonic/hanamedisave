import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import IdenModal from "./IdenModal";
import { userInfo, idenVC, certInfo } from '../../store/userSlice';
import http from '../../api/medisave'
import './Signup.css'
function Signup() {
  const dispatch = useDispatch();
  const [idenModal, setIdenModal] = useState(false);
  const [idenComplete, setIdenComplete] = useState(false);
  const [name, setName] = useState(null);
  const [resident1, setResident1] = useState(null);
  const [resident2, setResident2] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [id, setId] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [isOpenTerms, setIsOpenTerms] = useState(true); // 회원가입 약관 드롭다운
  const [isOpenService, setIsOpenService] = useState(true); // 서비스 동의 드롭다운
  const navigate = useNavigate();
  const handleClick = () => {
    setLoading(true);
    setChecked(false);

    // 2초 후 로딩을 중단하고 체크 표시로 변경
    setTimeout(() => {
      setLoading(false);
      setChecked(true);
    }, 2000);
  };
  const sendInfo = () => {
    const info = {
      name,
      resident1,
      resident2
    };
    dispatch(userInfo(info));
  };
  const signUp = async (e) => {
    e.preventDefault(); 
    const params = {
      memberId: id,
      residentNb: resident1 + resident2,
      memberEmail: email,
      memberPhoneNb: phone,
      memberPw: password,
      memberNm: name
    }
    console.log(params);
    
    try {
      const response = await http.post(
        '/api/members/register',
        params,  // 데이터를 JSON 형식으로 전송
        {
          headers: {
            'Content-Type': 'application/json',  // JSON 형식 요청임을 명시
            Accept: 'application/json',
          },
        }
      );
      const data = await response.data;
      console.log(data);
    } catch (error) {
        console.error("회원가입 오류:", error);
    } finally {
      navigate('/login')
    }
  }
    return (
      <div className="w-[80%] mx-auto">
        <Modal
        isOpen={idenModal}
        onRequestClose={() => setIdenModal(false)}
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <IdenModal
          setIdenModal={setIdenModal}
          setIdenComplete={(res) => {
            if (res) {
              setIdenComplete(true);
            }
          }}
          inputname={name}
          inputResident1={resident1}
          inputResident2={resident2}
        />
      </Modal>
        <h1 className="my-10 text-center text-2xl font-bold">회원가입</h1>
        <form onSubmit={signUp} class="w-1/2 mx-auto">
          <div class="relative z-0 w-full mb-5 group">
            <div className="flex">
              <div className="w-5/6 mr-10">
                <input type="text" name="id" id="floating_id" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#009178] focus:outline-none focus:ring-0 focus:border-[#009178] peer" onChange={(e) => setId(e.target.value)}  placeholder=" " required />
                <label for="floating_id" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#009178] peer-focus:dark:text-[#009178] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">아이디</label>
              </div>
              <div className="w-1/6">
              <button
                type="button"
                className={`${
                  loading
                    ? 'bg-[#009178] text-white'
                    : checked
                    ? 'bg-white text-[#009178]'
                    : 'bg-white hover:bg-[#009178] hover:text-white text-[#009178]'
                } border border-[#009178] font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center transition-colors duration-300 w-full`} // transition 속성으로 부드러운 전환
                onClick={handleClick}
                disabled={loading || checked} // 로딩 중이거나 체크되면 버튼 비활성화
                style={{ minWidth: '150px' }} // 크기를 고정하기 위한 최소 너비 설정
              >
                {loading ? (
                  // 로딩 중일 때 보여줄 스피너 (초록색)
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-5 h-5 mr-2 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : checked ? (
                  // 로딩이 끝나면 체크 표시
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  // 기본 버튼 텍스트
                  '중복 확인'
                )}
              </button>
              </div>
            </div>
          </div>
          <div class="grid md:grid-cols-2 md:gap-6">
            <div class="relative z-0 w-full mb-5 group">
                <input type="password" name="floating_password" id="floating_password" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#009178] focus:outline-none focus:ring-0 focus:border-[#009178] peer" onChange={(e) => setPassword(e.target.value)}  placeholder=" " required />
                <label for="floating_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#009178] peer-focus:dark:text-[#009178] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">비밀번호</label>
            </div>
            <div class="relative z-0 w-full mb-5 group">
                <input type="password" name="repeat_password" id="floating_repeat_password" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#009178] focus:outline-none focus:ring-0 focus:border-[#009178] peer" placeholder=" " required />
                <label for="floating_repeat_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#009178] peer-focus:dark:text-[#009178] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">비밀번호 확인</label>
            </div>
          </div>
            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="relative z-0 w-full mb-5 group">
                  <input type="text" name="resident1" id="resident1" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#009178] focus:outline-none focus:ring-0 focus:border-[#009178] peer" placeholder=" " required 
                  onChange={(e) => setResident1(e.target.value)}/>
                  <label for="floating_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#009178] peer-focus:dark:text-[#009178] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">주민등록번호 앞자리</label>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                  <input type="password" name="resident2" id="resident2" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#009178] focus:outline-none focus:ring-0 focus:border-[#009178] peer" placeholder=" " required
                  onChange={(e) => setResident2(e.target.value)} />
                  <label for="floating_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#009178] peer-focus:dark:text-[#009178] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">주민등록번호 뒷자리</label>
              </div>
            </div>
            <div class="relative z-0 w-full mb-5 group">
              <div className="flex">
                <div className="w-5/6 mr-10">
                  <input type="text" name="floating_name" id="floating_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#009178] focus:outline-none focus:ring-0 focus:border-[#009178] peer" placeholder=" " required 
                  onChange={(e) => setName(e.target.value)}/>
                  <label for="floating_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#009178] peer-focus:dark:text-[#009178] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">이름</label>
                </div>
                <div className="w-1/6">
                  <button
                    type="button"
                    className={`${
                      checked
                        ? 'bg-white text-[#009178]'
                        : 'bg-white hover:bg-[#009178] hover:text-white text-[#009178]'
                    } border border-[#009178] font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center transition-colors duration-300 w-full`} // transition 속성으로 부드러운 전환
                    onClick={()=>{ sendInfo(); setIdenModal(true)}}
                    disabled={idenComplete} // 신분증 검사완료되면 비활성화
                    style={{ minWidth: '150px' }} // 크기를 고정하기 위한 최소 너비 설정
                  >
                    {idenComplete ? (
                      // 로딩이 끝나면 체크 표시
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    ) : (
                      // 기본 버튼 텍스트
                      '신분증 첨부'
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div class="relative z-0 w-full mb-5 group">
                <input type="email" name="floating_email" id="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#009178] focus:outline-none focus:ring-0 focus:border-[#009178] peer" onChange={(e) => setEmail(e.target.value)}  placeholder=" " required />
                <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#009178] peer-focus:dark:text-[#009178] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
            </div>
            <div class="relative z-0 w-full mb-5 group">
                <input type="tel" name="floating_phone" id="floating_phone" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#009178] focus:outline-none focus:ring-0 focus:border-[#009178] peer" onChange={(e) => setPhone(e.target.value)}  placeholder=" "/>
                <label for="floating_phone" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#009178] peer-focus:dark:text-[#009178] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">전화번호 (01012345678)</label>
            </div>
        {/* 회원가입 약관 드롭다운 */}
        <div className="w-full mb-5 group">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpenTerms(!isOpenTerms)}>
            <h2 className="text-lg font-bold">회원가입 약관</h2>
            <div class="p-4">
              <div class="flex items-center mr-4 mb-2">
                <input type="checkbox" id="join-confirm" checked={checked1} onChange={(e) => {setChecked1(e.target.checked);
                setIsOpenTerms(!e.target.checked);  
                }} name="join-confirm" value="yes" class="opacity-0 absolute h-8 w-8" />
                <div class="bg-white border-2 rounded-md border-[#009178] w-8 h-8 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-[#009178]">
                  <svg class="fill-current hidden w-3 h-3 text-[#009178] pointer-events-none" version="1.1" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" fill-rule="evenodd">
                    <g transform="translate(-9 -11)" fill="#009178" fill-rule="nonzero">
                    <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
                    </g>
                  </g>
                  </svg>
                </div>
                <label for="join-confirm" class="select-none">동의합니다.</label>
              </div>
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpenTerms ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="mt-3 p-3 border rounded-lg bg-gray-50 h-40 overflow-y-scroll max-h-36 scrollbar-custom">
            <div class="container mx-auto bg-white p-6 rounded-lg shadow-lg">
              <h1 class="text-3xl font-bold mb-6">전자금융거래기본약관</h1>

              <p class="text-lg mb-4">“이 약관은 공정거래위원회의 표준약관과 동일하지 않습니다.”</p>

              <h2 class="text-2xl font-semibold mb-4">제1조 (목적)</h2>
              <p class="mb-6 indent-8">
                  이 약관은 하나메디세이브와 이용자 사이의 전자금융거래에 관한 기본적인 사항을 정함으로써, 거래의 신속하고 효율적인 처리를 도모하고 거래당사자 상호간의 이해관계를 합리적으로 조정하는 것을 목적으로 합니다.
              </p>

              <h2 class="text-2xl font-semibold mb-4">제2조 (용어의 정의)</h2>
              <p class="mb-4 indent-8">① 이 약관에서 사용하는 용어의 의미는 다음 각 호와 같습니다.</p>

              <ul class="list-decimal pl-10 space-y-3">
                  <li>
                      “전자금융거래“ 라 함은 은행이 전자적 장치를 통하여 제공하는 금융상품 및 서비스를 이용자가 전자적 장치를 통하여 비대면·자동화된 방식으로 직접 이용하는 거래를 말합니다.
                  </li>
                  <li>
                      “이용자”라 함은 전자금융거래를 위하여 은행과 체결한 계약(이하 "전자금융거래계약"이라 합니다.)에 따라 전자금융거래를 이용하는 고객을 말합니다.
                  </li>
                  <li>
                      “지급인”이라 함은 전자금융거래에 의하여 자금이 출금되는 계좌(이하 “출금계좌”라 합니다.)의 명의인을 말합니다.
                  </li>
                  <li>
                      “수취인”이라 함은 전자금융거래에 의하여 자금이 입금되는 계좌(이하 “입금계좌”라 합니다.)의 명의인을 말합니다.
                  </li>
                  <li>
                      “전자적 장치” 라 함은 현금자동지급기, 자동입출금기, 지급용단말기, 컴퓨터, 전화기 그 밖에 전자적 방법으로 전자금융거래정보를 전송하거나 처리하는데 이용되는 장치를 말합니다.
                  </li>
                  <li>
                      “접근매체”라 함은 전자금융거래에 있어서 거래지시를 하거나 이용자 및 거래내용의 진정성을 확보하기 위하여 사용되는 다음 각목의 어느 하나에 해당하는 수단 또는 정보를 말합니다.
                      <ul class="list-disc pl-10 mt-3">
                          <li>가. 은행이 제공한 전자식 카드 및 이에 준하는 전자적 정보</li>
                          <li>나. 「전자서명법」에 따른 전자서명생성정보 또는 인증서</li>
                          <li>다. 은행에 등록된 이용자 번호</li>
                          <li>라. 등록되어 있는 이용자의 생체정보</li>
                          <li>마. 가목 또는 나목의 수단이나 정보를 사용하는 데 필요한 비밀번호</li>
                      </ul>
                  </li>
                  <li>
                      “전자문서”라 함은 「전자문서 및 전자거래기본법」 제2조 제1호의 규정에 따라 작성·변환되거나 송신·수신 또는 저장된 정보를 말합니다.
                  </li>
                  <li>
                      “거래지시”라 함은 이용자가 전자금융거래계약에 의하여 은행에 개별적인 전자금융거래의 처리를 지시하는 것을 말합니다.
                  </li>
                  <li>
                      “오류”라 함은 이용자의 고의 또는 과실 없이 전자금융거래가 약관(개별약관을 포함합니다.), 전자금융거래계약 또는 이용자가 거래지시한 대로 이행되지 아니한 경우를 말합니다.
                  </li>
                  <li>
                      “계좌송금”이라 함은 이용자가 자동입출금기를 통하여 자기 또는 타인의 계좌에 자금을 입금하는 것을 말합니다.
                  </li>
              </ul>
          </div>
            </div>
          </div>
        </div>
        {/* 서비스 동의 드롭다운 */}
        <div className="w-full mb-5 group">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpenService(!isOpenService)}>
            <h2 className="text-lg font-bold">서비스 동의</h2>
            <div class="p-4">
              <div class="flex items-center mr-4 mb-2">
                <input type="checkbox" id="service-confirm" checked={checked2} onChange={(e) => {setChecked2(e.target.checked);
                setIsOpenService(!e.target.checked);  
              }} name="service-confirm" value="yes" class="opacity-0 absolute h-8 w-8" />
                <div class="bg-white border-2 rounded-md border-[#009178] w-8 h-8 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-[#009178]">
                  <svg class="fill-current hidden w-3 h-3 text-[#009178] pointer-events-none" version="1.1" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" fill-rule="evenodd">
                    <g transform="translate(-9 -11)" fill="#009178" fill-rule="nonzero">
                    <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
                    </g>
                  </g>
                  </svg>
                </div>
                <label for="service-confirm" class="select-none">동의합니다.</label>
              </div>
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpenService ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
            >
            <div className="mt-3 p-3 border rounded-lg bg-gray-50 overflow-y-scroll max-h-36 scrollbar-custom">
            <div class="container mx-auto bg-white p-6 rounded-lg shadow-lg">
              <h1 class="text-3xl font-bold mb-6">하나은행 전자금융서비스 이용약관</h1>

              <h2 class="text-2xl font-semibold mb-4">제 1 조 (목적)</h2>
              <p class="mb-4 indent-8">
                  ① 이 약관은 (주)하나은행(이하 '은행'이라 함)과 은행이 제공하는 전자금융서비스 (인터넷뱅킹, 모바일뱅킹, 폰뱅킹 등 이하 '서비스'라 함)를 이용하고자 하는 이용자 (이하 '이용자'라 함) 간의 서비스 이용에 관한 제반 사항을 정함을 목적으로 합니다.
              </p>
              <p class="mb-6 indent-8">
                  ② 이 약관에서 정하지 아니한 사항은 전자금융거래법 및 관계법령, 전자금융거래 기본약관 (이하 '기본약관'이라 함), 기타 관련 약관 및 규약을 적용합니다.
              </p>

              <h2 class="text-2xl font-semibold mb-4">제 2 조 (정의)</h2>
              <p class="mb-4 indent-8">① 이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
              <ul class="list-decimal pl-10 space-y-3">
                  <li>
                      “보안매체”라 함은 은행이 이용자의 전자금융 거래 시 이용자 본인확인을 위하여 교부하는 접근매체로서 자물쇠카드 또는 일회용비밀번호발생기(OTP) 등을 말합니다.
                  </li>
                  <li>
                      “공인인증서”라 함은 전자금융거래 시 이용자 본인확인을 위하여 공인인증기관으로부터 발급받은 전자서명키를 담고 있는 전자적 정보를 말합니다.
                  </li>
                  <li>
                      “이용자 비밀번호”라 함은 은행이 이용자의 전자금융 거래 시 이용자 본인확인을 위하여 필요로 하는 비밀번호로서 전자금융 신청 시 이용자가 직접 등록하는 비밀번호를 말합니다.
                  </li>
                  <li>
                      “생체인증”이라 함은 이용자가 본인의 스마트폰에 미리 저장해 둔 생체정보(생체에서 발생하는 홍채, 지문 등의 정보)를 이용하여 스마트폰뱅킹의 로그인 또는 계좌이체 등 이체성 거래 시 공인인증서 대신 사용할 수 있는 본인 인증 수단을 말합니다.
                  </li>
                  <li>
                      기타 이 약관에서 정의하지 아니하는 용어는 전자금융 거래법 및 관계법령, 기본약관, 기타 관련 약관 및 규약에서 정하는 바에 따릅니다.
                  </li>
              </ul>

              <h2 class="text-2xl font-semibold mb-4">제 3 조 (서비스 종류)</h2>
              <p class="mb-6 indent-8">
                  이 약관에 의해 제공되는 서비스는 각종 조회, 자금이체, 신규계좌 개설, 대출실행, 자동이체등록, 공과금 수납, 사고신고, 환전, 해외송금 등입니다.
              </p>
          </div>
            </div>
          </div>
        </div>
        <div class="flex z-0 w-full mb-5 group">
          <button disabled={!idenComplete || !checked1 || !checked2} 
          className={`mx-auto bg-white text-[#009178] border border-[#009178] font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center transition-colors duration-300
            ${!idenComplete || !checked1 || !checked2 ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#009178] hover:text-white'}`}
          >회원가입</button>
        </div>
        </form>
      </div>
    );
  }
  
  export default Signup;