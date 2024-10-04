import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CoHospitalCategory from './CoHospitalCategory';
import LocationAndAmountSetting from './LocationAndAmountSetting';
import CoSavingsTermAndFrequency from './CoSavingsTermAndFrequency';
import { useNavigate } from 'react-router-dom';
const { Kakao } = window;

const SavingsComponent = ({createMedAccount, ...props}) => {
  const CLIENT_ID = process.env.REACT_APP_KAKAOMAP_KEY;
  const navigate = useNavigate();
  const {
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
    createdAccount,
    setCreatedAccount,
    first,
    setFirst,
    notify
  } = props;
  useEffect(()=>{
    // init 해주기 전에 clean up 을 해준다.
      Kakao.cleanup();
      // 자신의 js 키를 넣어준다.
      Kakao.init(CLIENT_ID);
      // 잘 적용되면 true 를 뱉는다.
      console.log(Kakao.isInitialized());
      
  },[]);
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
        }
    });
};
  const onAgree = async () => {
    try {
        // 계좌를 생성하고 응답을 기다림
        const medAccount = await createMedAccount();
        
        // 응답 데이터를 로그로 출력하여 확인
        console.log('Created MedAccount:', medAccount);
        
        // medAccount가 유효하고, medAccountId가 존재하는지 확인
        if (medAccount && medAccount.medAccountId) {
            setCreatedAccount(medAccount); 
            console.log(medAccount.medAccountId);         
            shareKakao(medAccount.medAccountId);  // medAccountId가 존재하면 공유 기능 호출
        } else {
            console.error('medAccountId가 존재하지 않습니다. 응답 데이터를 확인하세요:', medAccount);
        }
    } catch (error) {
        console.error('Error during account creation:', error);
    }
};


  return (
    <div className="pr-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold mb-4">함께 목표 적금</h2>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" onClick={onBack} className="mr-2 size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </div>
      <AnimatePresence mode="wait">
        {!itemSelected && !amountSelected && (
          <motion.div
              key="HospitalCategory"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
          >
              <CoHospitalCategory 
                  selectedCategory={selectedCategory} 
                  setSelectedCategory={setSelectedCategory} 
                  selectedItem={selectedItem} 
                  setSelectedItem={setSelectedItem} 
                  setSelectedPrice={setSelectedPrice} 
                  setItemSelected={setItemSelected} 
              />
          </motion.div>
        )}
        {itemSelected && !amountSelected && (
          <motion.div
              key="LocationAndAmountSetting"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
          >
              <LocationAndAmountSetting
                  selectedItem={selectedItem}
                  setAmount={setAmount}
                  amount={amount}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchResults={searchResults}
                  handleSearch={handleSearch}
                  loading={loading}
                  setItemSelected={setItemSelected}
                  setAmountSelected={setAmountSelected}
              />
          </motion.div>
        )}
        {amountSelected && (
            <motion.div
                key="SavingsTermAndFrequency"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                <CoSavingsTermAndFrequency
                    setSelectedAccount={setSelectedAccount}
                    selectedAccount={selectedAccount}
                    accounts={accounts}
                    benefit={benefit}
                    setBenefit={setBenefit}
                    term={term}
                    setTerm={setTerm}
                    paymentFrequency={paymentFrequency}
                    setPaymentFrequency={setPaymentFrequency}
                    setAmountSelected={setAmountSelected}
                    calculateSavings={() => calculateSavings(term, amount, benefit, paymentFrequency)}
                    results={results}
                    createMedAccount={createMedAccount}
                    onAgree={onAgree}
                    createdMedAccount={createdAccount}
                    setCreatedMedAccount={setCreatedAccount}
                    first={first}
                    setFirst={setFirst}
                />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavingsComponent;
