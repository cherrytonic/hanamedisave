import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Tooltip from "../../components/Tooltip";
import Eye from '../../assets/images/eyes_3d.png';
import Tooth from '../../assets/images/tooth_3d.png';
import Mirror from '../../assets/images/mirror_3d.png';
import Syringe from '../../assets/images/syringe_3d.png';
import Stethoscope from '../../assets/images/stethoscope_3d.png'
import CoLocationAndAmountSetting from './CoLocationAndAmountSetting'; 

const HospitalCategory = ({ selectedCategory, selectedItem, setSelectedCategory, setSelectedItem, setSelectedPrice, setItemSelected }) => {

    const categories = {
        '건강검진': [
            { name: '프리미엄 건강검진(남)', averagePrice: 3300000, details: '[기본종합검진포함] 뇌MRI/뇌MRA/경동맥MRA, PET - CT (전신),                심장초음파, 갑상선초음파, 골다공증정밀검사, 동맥경화협착검사(PWV), 심장특수혈액검사(호모시스테인,BNP 등 7종), 대장내시경(진정),   폐암표지자 검사, 자율신경기능(스트레스) 검사, 전립선초음파, 남성호르몬검사' },
            { name: '프리미엄 건강검진(여)', averagePrice: 3700000, details: '[기본종합검진포함] 뇌MRI/뇌MRA/경동맥MRA, PET - CT (전신),                심장초음파, 갑상선초음파, 골다공증정밀검사, 동맥경화협착검사(PWV), 심장특수혈액검사(호모시스테인,BNP 등 7종), 대장내시경(진정),   폐암표지자 검사, 자율신경기능(스트레스) 검사, 유방초음파, 유방X-선 촬영, 유방암표지자검사, 부인과초음파, HPV(인유두종바이러스검사), 여성호르몬검사' },
        ],
        '치과': [
            { name: '임플란트', averagePrice: 1200000 },
            { name: '교정', averagePrice: 5000000 },
            { name: '틀니', averagePrice: 3000000 }
        ],
        '피부과': [
            { name: '모발이식 1000모', averagePrice: 3000000 },
            { name: '모발이식 2000모', averagePrice: 5000000 }
        ],
        '기타': [] // 직접 입력용
    };

    const handleInput = (event) => {
        setSelectedItem(event.target.value);
    };

    const renderContent = () => {
        if (selectedCategory === '기타') {
            return (
                <motion.div
                    key="기타"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <h3 className="text-2xl font-bold mb-4">기타 치료</h3>
                    <input
                        type="text"
                        placeholder="직접 입력하세요."
                        className="border rounded-lg p-2 w-full text-xl"
                        onInput={handleInput}
                    />
                </motion.div>
            );
        }

        const items = categories[selectedCategory];
        if (!items) {
            return <h2 className="text-3xl mb-4">카테고리를 선택해주세요.</h2>;
        }

        return (
            <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <h3 className="text-2xl font-bold mb-4">{selectedCategory} 치료 목록</h3>
                <ul className="list-inside">
                {items.map((item, index) => {
                    const listItem = (
                        <li
                            key={index}
                            className={`text-xl border rounded-lg p-4 shadow-lg mb-2 transition ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer ${
                                selectedItem === item.name ? 'bg-green-100 scale-105' : 'bg-white'
                            }`}
                            onClick={() => {
                                setSelectedItem(item.name);
                                setSelectedPrice(item.averagePrice);
                            }}
                        >
                            {item.name}
                        </li>
                    );

                    return item.details ? (
                        <Tooltip key={index} message={item.details}>
                            {listItem}
                        </Tooltip>
                    ) : (
                        listItem
                    );
})}
                </ul>
            </motion.div>
        );
    };

    return (
        <>
                <div className="flex space-x-10 shadow-lg p-6 rounded-lg">
                    <div className="w-1/2 bg-white p-6">
                        <div className="flex space-x-6">
                            <motion.div
                                className={`w-1/2 aspect-square border p-6 rounded-lg transition ease-in-out hover:shadow-md hover:-translate-y-1 hover:scale-105 cursor-pointer ${
                                    selectedCategory === '건강검진' ? 'bg-green-100 scale-105' : ''
                                }`}
                                onClick={() => setSelectedCategory('건강검진')}
                            >
                                <h2 className="text-2xl font-bold mb-10">건강검진</h2>
                                <div className="flex justify-center">
                                    <img src={Stethoscope} className="w-36" alt="건강검진" />
                                </div>
                            </motion.div>
                            <motion.div
                                className={`w-1/2 aspect-square border p-6 rounded-lg transition ease-in-out hover:shadow-md hover:-translate-y-1 hover:scale-105 cursor-pointer ${
                                    selectedCategory === '치과' ? 'bg-green-100 scale-105' : ''
                                }`}
                                onClick={() => setSelectedCategory('치과')}
                            >
                                <h2 className="text-2xl font-bold mb-10">치과</h2>
                                <div className="flex justify-center">
                                    <img src={Tooth} className="w-36" alt="치과" />
                                </div>
                            </motion.div>
                        </div>
                        <div className="flex space-x-6 mt-6">
                            <motion.div
                                className={`w-1/2 aspect-square border p-6 rounded-lg transition ease-in-out hover:shadow-md hover:-translate-y-1 hover:scale-105 cursor-pointer ${
                                    selectedCategory === '피부과' ? 'bg-green-100 scale-105' : ''
                                }`}
                                onClick={() => setSelectedCategory('피부과')}
                            >
                                <h2 className="text-2xl font-bold mb-10">피부과</h2>
                                <div className="flex justify-center">
                                    <img src={Mirror} className="w-36" alt="피부과" />
                                </div>
                            </motion.div>
                            <motion.div
                                className={`w-1/2 aspect-square border p-6 rounded-lg transition ease-in-out hover:shadow-md hover:-translate-y-1 hover:scale-105 cursor-pointer ${
                                    selectedCategory === '기타' ? 'bg-green-100 scale-105' : ''
                                }`}
                                onClick={() => setSelectedCategory('기타')}
                            >
                                <h2 className="text-2xl font-bold mb-10">기타</h2>
                                <div className="flex justify-center">
                                    <img src={Syringe} className="w-36" alt="기타" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    <div className="w-1/2 bg-white p-6">
                        {renderContent()}
                        <div className="flex justify-center mt-10">
                            <button
                                className="text-2xl mx-auto hover:bg-white bg-[#009178] text-white hover:text-[#009178] border border-[#009178] font-medium rounded-lg px-5 py-2.5 text-center flex items-center justify-center transition-colors duration-300"
                                onClick={() => setItemSelected(true)} // 금액 설정 화면으로 이동
                            >
                                금액과 기간 선택하기
                            </button>
                        </div>
                    </div>
                </div>
        </>
    );
};

export default HospitalCategory;
