import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { linearGradientDef } from '@nivo/core';

const BarChart = ({ data }) => {
  const formatMonth = (monthYear) => {
    return monthYear.split(' ')[0]; // 공백으로 나누고 첫 번째 값 반환
  };
  const formatNumberWithCommas = (number) => {
    return number.toLocaleString(); // 숫자에 세 자리마다 쉼표 추가
  };

  return (
    <div style={{ width: '500px', height: '500px', margin: '0 auto' }}>
      <ResponsiveBar
        data={data.map(item => ({ ...item, month: formatMonth(item.month) }))}
        keys={['예금', '적금']}
        indexBy="month"
        padding={0.5}
        margin={{ top: 50, right: 0, bottom: 100, left: 100 }}
        colors={({ id }) => {
          // '예금'과 '적금'에 따른 색상 지정
          if (id === '예금') return '#eacda3'; // 예금에 대한 색상
          if (id === '적금') return '#00c9ff'; // 적금에 대한 색상
          return '#000'; // 기본 색상
        }}
        // 1. defining gradients
        defs={[
          linearGradientDef('gradientA', [
            { offset: 0, color: '#eacda3' },
            { offset: 100, color: '#d6ae7b' },
          ]),
          linearGradientDef('gradientD', [
            { offset: 0, color: '#e55d87' },
            { offset: 100, color: '#5fc3e4' },
          ]),
          linearGradientDef('gradientC', [
            { offset: 0, color: '#92fe9d' },
            { offset: 100, color: '#00c9ff' },
          ]),
        ]}
        // 2. defining rules to apply those gradients
        fill={[
          { match: { id: '예금' }, id: 'gradientA' },
          { match: { id: '적금' }, id: 'gradientC' },
          { match: { id: '목표 적금' }, id: 'gradientC' },
        ]}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: 42,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '금액 (원)',
          legendPosition: 'middle',
          legendOffset: -90,
          format: (value) => formatNumberWithCommas(value),
        }}
        valueFormat=" >-0,~f"
        theme={{
          axis: {
            legend: {
              text: {
                fontSize: 17,
              },
            },
            ticks: {
              text: {
                fontSize: 16,
              },
            },
          },
          labels: {
            text: {
              fontSize: 14, // 폰트 크기 설정
              fill: '#000', // 텍스트 색상
              fontFamily: 'hana-regular',
            },
          },
        }}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        borderRadius={6}
        labelSkipWidth={12}
        labelSkipHeight={12}
        enableGridY={true}
        animate={true}
        motionStiffness={170}
        motionDamping={26}
        role="application"
        ariaLabel="자산 추이 차트"
        motionConfig={{
          mass: 1,
          tension: 120,
          friction: 40,
          clamp: true,
        }} // 수직 애니메이션을 자연스럽게 설정
        layout="vertical" // 수직 방향 레이아웃 설정
      />
    </div>
  );
};

export default BarChart;
