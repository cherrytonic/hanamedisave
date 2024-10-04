import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import DonutChart from '../../components/DonutChart';
import http from '../../api/medisave';

function Cost() {
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [currentChart, setCurrentChart] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    months: {
      '8월': {
        total: '1,789,512원',
        details: {
          total: [
            { label: '식비', value: '700,351원', color: 'bg-orange-400' },
            { label: '주거비', value: '440,854원', color: 'bg-blue-400' },
            { label: '쇼핑', value: '340,351원', color: 'bg-blue-300' },
            { label: '의료비', value: '172,351원', color: 'bg-green-400' },
            { label: '기타', value: '247,589원', color: 'bg-blue-200' },
          ],
          medical: [
            { label: '병원', value: '120,000원', color: 'bg-red-400' },
            { label: '약국', value: '52,351원', color: 'bg-green-400' },
          ],
        }
      },
      '7월': {
        total: '3,789,512원',
        details: {
          total: [
            { label: '식비', value: '1,200,351원', color: 'bg-orange-400' },
            { label: '주거비', value: '1,040,854원', color: 'bg-blue-400' },
            { label: '쇼핑', value: '1,000,351원', color: 'bg-blue-300' },
            { label: '의료비', value: '200,351원', color: 'bg-green-400' },
            { label: '기타', value: '347,589원', color: 'bg-blue-200' },
          ],
          medical: [
            { label: '병원', value: '150,000원', color: 'bg-red-400' },
            { label: '약국', value: '50,351원', color: 'bg-green-400' },
          ],
        }
      },
      '6월': {
        total: '2,345,678원',
        details: {
          total: [
            { label: '식비', value: '800,351원', color: 'bg-orange-400' },
            { label: '주거비', value: '640,854원', color: 'bg-blue-400' },
            { label: '쇼핑', value: '500,351원', color: 'bg-blue-300' },
            { label: '의료비', value: '120,351원', color: 'bg-green-400' },
            { label: '기타', value: '283,589원', color: 'bg-blue-200' },
          ],
          medical: [
            { label: '병원', value: '100,000원', color: 'bg-red-400' },
            { label: '약국', value: '20,351원', color: 'bg-green-400' },
          ],
        }
      }
    },
    charts: {
      total: [
        { id: '식비', label: '식비', value: 454, color: 'hsl(308, 70%, 50%)' },
        { id: '주거비', label: '주거비', value: 272, color: 'hsl(338, 70%, 50%)' },
        { id: '의료비', label: '의료비', value: 15, color: 'hsl(291, 70%, 50%)' },
        { id: '기타', label: '기타', value: 182, color: 'hsl(257, 70%, 50%)' },
        { id: '쇼핑', label: '쇼핑', value: 396, color: 'hsl(52, 70%, 50%)' },
      ],
      medical: [
        { id: '병원', label: '병원', value: 600, color: 'hsl(128, 70%, 50%)' },
        { id: '건강물품구입', label: '건강물품구입', value: 500, color: 'hsl(208, 70%, 50%)' },
        { id: '약국', label: '약국', value: 300, color: 'hsl(0, 70%, 50%)' },
        { id: '기타', label: '기타', value: 200, color: 'hsl(48, 70%, 50%)' },
      ]
    }
  });

  // 백엔드에서 데이터를 받아오는 함수
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = useCallback(async (center) => {
    console.log('요청 보냄:');
    const params = {
      cardNb: 1234567890123456
    };
    console.log(typeof params.cardNb);
    try {
      const response = await http.get('/api/consumes/by-card', {
        params,
        headers: {
          Accept: 'application/json',
        },
      });
      console.log('API response:', response);  // API 응답 확인
      const chartData = transformChartData(response.data)
      setData(chartData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
      setLoading(false);
    }
  }, []);
  const transformChartData = (chartData) => {
    // chartData를 가공하여 필요한 형식으로 변환
    const monthsData = {};
    const chartsData = {
      total: [],
      medical: [],
    };
  
    const groupAndSumByCategory = (data) => {
      return data.reduce((acc, item) => {
        const existingCategory = acc.find(category => category.label === item.label);
        if (existingCategory) {
          existingCategory.value = (
            parseInt(existingCategory.value.replace(/,/g, '').replace('원', '')) +
            parseInt(item.value.replace(/,/g, '').replace('원', ''))
          ).toLocaleString() + '원';
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);
    };
  
    // chartData.months는 객체이므로 Object.entries를 사용하여 순회합니다.
    Object.entries(chartData.months).forEach(([month, monthData]) => {
      // total 데이터를 가공하면서 같은 카테고리끼리 합산
      const totalDetails = groupAndSumByCategory(monthData.total);
  
      // 의료비 데이터를 가공하면서 같은 카테고리끼리 합산
      const medicalDetails = groupAndSumByCategory(monthData.medical);
  
      const totalSpending = totalDetails.reduce((acc, item) => {
        return acc + parseInt(item.value.replace(/,/g, '').replace('원', ''));
      }, 0).toLocaleString() + '원';
  
      // months 데이터를 생성
      monthsData[month] = {
        total: totalSpending,
        details: {
          total: totalDetails,
          medical: medicalDetails,
        },
      };
    });
  
    // charts 데이터를 가공 (차트에서 사용할 형식으로)
    chartsData.total = chartData.charts.total.map((category) => ({
      id: category.id,
      label: category.label,
      value: category.value,
      color: getColorForCategory(category.label),
    }));
  
    chartsData.medical = chartData.charts.medical.map((category) => ({
      id: category.id,
      label: category.label,
      value: category.value,
      color: getColorForCategory(category.label),
    }));
  
    return {
      months: monthsData,
      charts: chartsData,
    };
  };
  
  function getColorForCategory(category) {
    const colorMap = {};

    // 랜덤 색상을 생성하는 함수
    function generateRandomColor() {
      const hue = Math.floor(Math.random() * 360); // 0~360도 사이에서 색상을 무작위로 생성
      const saturation = Math.floor(Math.random() * 30) + 70; // 채도를 70~100% 사이에서 랜덤으로 설정
      const lightness = Math.floor(Math.random() * 20) + 40; // 명도를 40~60% 사이에서 랜덤으로 설정
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    // 카테고리에 대한 색상을 맵에서 찾거나 없으면 새로 생성
    if (!colorMap[category]) {
      colorMap[category] = generateRandomColor();
    }

    // 카테고리에 해당하는 색상을 반환
    return colorMap[category];
  }
  const handleToggle = (month) => {
    if (expandedMonth === month) {
      setExpandedMonth(null);
    } else {
      setExpandedMonth(month);

      // 선택한 월의 데이터를 기반으로 차트 업데이트
      const selectedData = data.months[month].details[currentChart === 1 ? 'total' : 'medical'];
      setData((prevData) => ({
        ...prevData,
        charts: {
          ...prevData.charts,
          [currentChart === 1 ? 'total' : 'medical']: selectedData.map(detail => ({
            id: detail.label,
            label: detail.label,
            value: parseInt(detail.value.replace(/,/g, '').replace('원', '')),
            color: detail.color
          }))
        }
      }));
    }
  };
  return (
    <div className="containers">
      <div className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl text-start">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">지출 분석</h2>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setCurrentChart(1)}
                className={`px-4 py-2 rounded-md ${currentChart === 1 ? 'bg-[#009178] text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                총 지출
              </button>
              <button
                onClick={() => setCurrentChart(2)}
                className={`px-4 py-2 rounded-md ${currentChart === 2 ? 'bg-[#009178] text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                의료비 지출
              </button>
            </div>
          </div>
          <div className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 mt-4 lg:mx-0 lg:flex lg:max-w-none">
            <DonutChart data={currentChart === 1 ? data.charts.total : data.charts.medical} />
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
              <div className="rounded-2xl bg-gray-50 py-8 ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col">
                <div className="px-8">
                  {Object.entries(data.months).map(([month, monthData]) => (
                    <motion.div
                      key={month}
                      className="bg-white rounded-2xl shadow-lg mb-4 p-4"
                      initial={{ maxHeight: '4rem' }}
                      animate={{ maxHeight: expandedMonth === month ? '500px' : '4rem' }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      onClick={() => handleToggle(month)}
                    >
                      <div className="flex justify-between items-center cursor-pointer">
                        <h3 className="text-xl font-bold text-gray-900">{month} 총 지출</h3>
                        <p className="text-xl font-semibold text-gray-600">{monthData.total}</p>
                      </div>
                      {expandedMonth === month && (
                        <div className="mt-4">
                          {monthData.details[currentChart === 1 ? 'total' : 'medical'].length > 0 ? (
                            monthData.details[currentChart === 1 ? 'total' : 'medical'].map((detail, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center mt-2"
                              >
                                <div className="flex items-center">
                                  <span
                                    className={`w-3 h-3 rounded-full mr-2 ${detail.color}`}
                                  ></span>
                                  <span className="text-gray-700">{detail.label}</span>
                                </div>
                                <span className="text-gray-700">{detail.value}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 mt-4">상세 데이터 없음</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cost;
