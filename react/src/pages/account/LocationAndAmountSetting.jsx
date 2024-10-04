import React, { useState } from 'react';
import './Account.css'

const LocationAndAmountSetting = ({ selectedItem, amount, setAmount, searchQuery, setSearchQuery, searchResults, handleSearch, loading, setItemSelected, setAmountSelected  }) => {
    return (
        <div className="shadow-lg p-6 rounded-lg">
            <h3 className="text-2xl font-semibold">{selectedItem} 진료비 비교</h3>
            <div className="w-full flex">
                <div className="w-1/2 h-[96%] bg-white rounded-lg shadow-md p-6 z-50 m-1">
                    <h2 className="m-2 text-xl font-bold">{selectedItem} 치료를 받을 지역을 검색해보세요!</h2>
                    <input
                        type="text"
                        placeholder="철산동"
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
                </div>
                <div className="w-1/2 h-[300px] bg-white pl-2 overflow-y-auto z-50 m-1 scrollbar-custom">
                    {loading && <p>로딩 중...</p>}
                    {/* 검색 결과 표시 */}
                    <div className="relative">
                        {/* 병원 리스트 */}
                        <div className="mt-4">
                            {!loading && searchResults && searchResults.length > 0 ? (
                                <ul className="list-none p-0">
                                    {searchResults.map((hospital, idx) => (
                                        <li key={idx} className="border-b rounded-lg shadow-md p-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <strong className="text-lg font-semibold">{hospital.hospital.name}</strong>
                                                    {hospital.items && hospital.items.length > 0 ? (
                                                        <ul className="mt-2">
                                                            {hospital.items.map((item, itemIdx) => (
                                                                <li
                                                                    key={itemIdx}
                                                                    onClick={() => setAmount((item.curAmt * 1.2).toFixed(0))} // 클릭 시 금액 설정
                                                                    className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                                                                >
                                                                    <p className="mt-2 text-sm text-gray-500">{item.npayKorNm}</p>
                                                                    <p className="text-blue-600 text-lg font-bold">{item.curAmt?.toLocaleString()}원</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>치료 항목이 없습니다.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                            <div className="flex justify-center">
                                <div>
                                    <div class=" rotate-sprite"></div>
                                    {!loading && (!searchResults || searchResults.length === 0) && (
                                    <p>검색 결과가 없습니다.</p>
                                    )}
                                </div>
                            </div>
                                
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full bg-white px-6">
                <h3 className="text-2xl font-semibold mb-2">{selectedItem} 적금 금액 설정</h3>
                <h3 className="text-lg font-medium mb-4">* 적금 만기시 진료비가 비싸지는 것에 대비해 더 높은 금액을 설정했어요!</h3>
                <div className="flex">
                    <input type="text" placeholder="금액 입력" value={amount} onInput={(e) => setAmount(e.target.value)} className="border rounded-lg p-4 w-full text-xl" />
                    <span className="ml-6 text-2xl pt-3">원</span>
                </div>
            </div>
            <div className="flex justify-center mt-10 space-x-4">
                <button onClick={() => setItemSelected(false)} className="text-xl bg-white text-[#009178] border border-[#009178] hover:bg-[#009178] hover:text-white font-medium rounded-lg px-5 py-2.5 transition-colors duration-300">다른 치료 선택하기</button>
                <button onClick={() => setAmountSelected(true)} className="text-xl bg-[#009178] text-white border border-[#009178] hover:bg-white hover:text-[#009178] font-medium rounded-lg px-5 py-2.5 transition-colors duration-300">기간 설정하기</button>
            </div>
        </div>
    );
};

export default LocationAndAmountSetting;
