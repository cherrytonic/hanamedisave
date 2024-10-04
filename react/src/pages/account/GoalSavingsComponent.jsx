import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HospitalCategory from './HospitalCategory';
import LocationAndAmountSetting from './LocationAndAmountSetting';
import SavingsTermAndFrequency from './SavingsTermAndFrequency';
import http from '../../api/medisave'

const GoalSavingsComponent = ({createMedAccount, ...props}) => {
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
        notify

    } = props;
    const navigate = useNavigate(); // react-router-dom v5 사용 시
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const memberId = storedUser.memberId;
    const TAX_RATE = 15.4 / 100;
    const onAgree = () => {
        createMedAccount('AUTO')

    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    
    return (
        <div className="pr-6">
            <div className="flex justify-between">
                <h2 className="text-3xl font-bold mb-4">치료 목표 적금</h2>
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
                        <HospitalCategory 
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
                        <SavingsTermAndFrequency
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
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GoalSavingsComponent;
