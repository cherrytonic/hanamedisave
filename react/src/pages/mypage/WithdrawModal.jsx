import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Check from '../../assets/images/check.png'

const WithdrawModal = ({ isOpen, closeModal, account, closureDetails, closeAccount, withdraw, toggleDropdown, open, checked, selectedAccount, formatAccountId, accounts, handleAccountSelect }) => {
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  if (!isOpen) return null;
  return (
    <AnimatePresence>
    <motion.div className="fixed inset-0 z-30 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg z-10 w-11/12 md:w-1/2 p-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-2xl font-semibold">{account.medAccountNm} ({account.medAccountId})</h3>
          <button className="text-gray-500 hover:text-black" onClick={closeModal}>&times;</button>
        </div>
        <div className="mt-4">
          <p className="text-xl" >우대 이율: {(closureDetails.interestRate * 100).toFixed(2)}%</p>
          <p className="text-xl">세전 이자: {closureDetails.interestBeforeTax}원</p>
          <p className="text-xl">세후 이자: {closureDetails.interestAfterTax}원</p>
          <p className="text-xl">중도 인출 잔여 횟수: {account.withdraw}회</p>
          <p className="text-xl">총 해지 금액: {closureDetails.totalClosureAmount}원</p>
        </div>
        {(account.withdraw !== 0)&& (
          <>
          <h3 className="text-xl font-semibold my-4">중도 인출 금액</h3>
            <div className="flex my-2">
              <input type="text" placeholder="금액 입력" value={withdrawAmount} onInput={(e) => setWithdrawAmount(e.target.value)} className="border rounded-lg p-3 w-full text-xl text-left" />
              <span className="ml-6 text-xl pt-3">원</span>
          </div>
          </>
          )}
        <h3 className="text-xl font-semibold my-4">어느 계좌로 입금할까요?</h3>
            <div className="w-full relative">
            <button
                onClick={toggleDropdown}
                className={`focus:outline-none w-full cursor-pointer text-lg text-gray-700 hover:text-black flex justify-between p-2 pl-3 pr-1 border-b border-[#009178] ${open ? 'shadow-none border-gray-300' : ''}`}
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
                    className="w-full bg-white absolute z-10 left-0 shadow w-40 rounded text-gray-500 origin-top shadow-lg transition-transform transform scale-y-100"
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
        </div>
        <div className="mt-6 flex justify-center">
        <button
          className={`text-xl bg-[#009178] text-white border border-[#009178] hover:bg-white hover:text-[#009178] font-medium rounded-lg px-5 py-2.5 transition-colors duration-300 mx-2 ${
            account.withdraw === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => withdraw(account.medAccountId, withdrawAmount, selectedAccount.accountId)}
          disabled={account.withdraw === 0}  // withdraw가 0일 때 비활성화
        >
              중도 인출하기
          </button>
          <button className="text-xl bg-white text-[#009178] border border-[#009178] hover:bg-[#009178] hover:text-white font-medium rounded-lg px-5 py-2.5 transition-colors duration-300 mx-2" onClick={() => closeAccount(account.medAccountId, account.medAccountBalance, selectedAccount.accountId)}>
            해지하기 
          </button>
        </div>
      </div>
    </div>
    </motion.div>
    </AnimatePresence>
  );
};

export default WithdrawModal;
