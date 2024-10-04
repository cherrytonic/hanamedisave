import React, { useState, useEffect } from 'react';
const { Kakao } = window;


const JoinModal = ({ isOpen, onClose, createMedAccount, onAgree }) => {
    const CLIENT_ID = process.env.REACT_APP_KAKAOMAP_KEY;
    const realUrl = "http://localhost:3000/price"
    useEffect(()=>{
    	// init 해주기 전에 clean up 을 해준다.
        Kakao.cleanup();
        // 자신의 js 키를 넣어준다.
        Kakao.init(CLIENT_ID);
        // 잘 적용되면 true 를 뱉는다.
        console.log(Kakao.isInitialized());
        
    },[]);

    const shareKakao = () =>{
        Kakao.Share.sendCustom({
            templateId: 112236,
            templateArgs: {
                url: 'price',
            }
        });
    }
    const [checkedItems, setCheckedItems] = useState({
        agree1: false,
        agree2: false,
        agree3: false,
        agree4: false,
        agree5: false,
        depositProtection: false,
        understanding: false,
    });
    const [openItems, setOpenItems] = useState({
        agree1: false,
        agree2: false,
        agree3: false,
        agree4: false,
        agree5: false,
    });

  const handleCheckboxChange = (e) => {
    const name = e.target.name;
        const isChecked = e.target.checked;

        // 체크박스 상태 변경
        setCheckedItems({
            ...checkedItems,
            [name]: isChecked,
        });

        // 체크되면 content 부분을 닫음
        if (isChecked) {
            setOpenItems({
                ...openItems,
                [name]: false,  // 해당 항목의 content 닫기
            });
        }
    };

    const handleToggleItem = (item) => {
        setOpenItems({
        ...openItems,
        [item]: !openItems[item],
        });
    };
    const allChecked = Object.values(checkedItems).every(Boolean); // 모든 체크박스가 체크되었는지 확인

    return (
        <>
        {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full h-[70%] shadow-lg">
                <h2 className="text-xl font-bold mb-4">함께적금 초대</h2>
                <div className="border rounded-lg mb-4 p-4 flex justify-between" >
                    <div>
                        <h3 className="text-lg font-bold">예금자보호법 설명 확인</h3>
                        <p className="text-sm text-gray-600">
                            이 예금은 예금자보호법에 따라 원금과 소정의 이자를 포함하여 1인당 "5천만원"까지(본 은행의 여타 보호상품과 합산) 보호됩니다.
                        </p>
                    </div>
                    <div className="flex items-center">
                    <label className="relative inline-flex items-center">
                        <input
                        type="checkbox"
                        checked={checkedItems.depositProtection} // 예금자보호법 체크 상태 관리
                        onChange={handleCheckboxChange}
                        name="depositProtection"  // 이름 설정
                        className="sr-only"  // 기본 체크박스를 숨김
                        />
                        <div className="bg-white border-2 rounded-md border-[#009178] w-8 h-8 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-[#009178]">
                        {checkedItems.depositProtection && (
                            <svg className="fill-current w-3 h-3 text-[#009178]" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" fillRule="evenodd">
                                <g transform="translate(-9 -11)" fill="#009178" fillRule="nonzero">
                                <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
                                </g>
                            </g>
                            </svg>
                        )}
                        </div>
                    </label>
                    <span>예금자보호법에 동의합니다.</span>
                    </div>
                </div>
                <div className="border rounded-lg mb-4 p-4 flex justify-between" >
                    <div>
                        <h3 className="text-lg font-bold">상품설명 이해 안내</h3>
                        <p className="text-sm text-gray-600">
                            본인은 상품의 주요 내용에 대하여 충분히 이해하였습니까?(충분한 이해없이 확인했을 경우, 추후 소송이나 분쟁에서 불리하게 적용될 수 있습니다.)
                        </p>
                    </div>
                    <div className="flex items-center">
                    <label className="relative inline-flex items-center">
                        <input
                        type="checkbox"
                        checked={checkedItems.understanding} // 예금자보호법 체크 상태 관리
                        onChange={handleCheckboxChange}
                        name="understanding"  // 이름 설정
                        className="sr-only"  // 기본 체크박스를 숨김
                        />
                        <div className="bg-white border-2 rounded-md border-[#009178] w-8 h-8 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-[#009178]">
                        {checkedItems.understanding && (
                            <svg className="fill-current w-3 h-3 text-[#009178]" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" fillRule="evenodd">
                                <g transform="translate(-9 -11)" fill="#009178" fillRule="nonzero">
                                <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
                                </g>
                            </g>
                            </svg>
                        )}
                        </div>
                    </label>
                    <span>네, 충분히 이해했습니다.</span>
                    </div>
                </div>
                <button 
                    className='grey-btn'
                    onClick={() => {
                        shareKakao()
                    }}
                > 카카오톡 공유하기 </button>
                <div className="flex justify-center space-x-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                    나중에 초대하기
                </button>
                <button
                    className='px-4 py-2 rounded-lg bg-[#009178] text-white'
                    onClick={onAgree}
                >
                    초대하기
                </button>
                </div>
            </div>
            </div>
        )}
        </>
    );
};

export default JoinModal;
