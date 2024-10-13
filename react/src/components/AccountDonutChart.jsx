import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { linearGradientDef } from '@nivo/core';

const AccountDonutChart = ({ data }) => {
  return (
    <div style={{ width: '500px', height: '500px', margin: '0 auto' }}>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 100, bottom: 80, left: 100 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        colors={{ datum: 'data.color' }}
        borderColor={({ id }) => {
          // '예금'과 '적금'에 따른 색상 지정
          if (id === '함께 적금') return '#ff0844'; 
          if (id === '목표 적금') return '#00c9ff'; 
          if (id === '예금') return '#d6ae7b'; 
          return '#000'; // 기본 색상
        }}
        valueFormat=" >-0,~f"
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        // arcLinkLabelsColor={{ from: 'color' }}
        arcLinkLabelsColor={({ id }) => {
          // '예금'과 '적금'에 따른 색상 지정
          if (id === '함께 적금') return '#ff0844'; 
          if (id === '목표 적금') return '#00c9ff'; 
          if (id === '예금') return '#d6ae7b'; 
          return '#000'; // 기본 색상
        }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]],
        }}
        // 1. defining gradients
        defs={[
          linearGradientDef('gradientA', [
            { offset: 0, color: '#eacda3' },
            { offset: 100, color: '#d6ae7b' },
          ]),
          linearGradientDef('gradientB', [
            { offset: 0, color: '#ffb199' },
            { offset: 100, color: '#ff0844' },
          ]),
          linearGradientDef('gradientC', [
            { offset: 0, color: '#92fe9d' },
            { offset: 100, color: '#00c9ff' },
          ]),
        ]}
        // 2. defining rules to apply those gradients
        fill={[
          { match: { id: '예금' }, id: 'gradientA' },
          { match: { id: '함께 적금' }, id: 'gradientB' },
          { match: { id: '목표 적금' }, id: 'gradientC' },
        ]}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                },
              },
            ],
          },
        ]}
        theme={{
          labels: {
            text: {
              fontSize: 14, // 폰트 크기 설정
              fill: '#000', // 텍스트 색상
              fontFamily: 'hana-regular',
            },
          },
        }}
      />
    </div>
  );
};

export default AccountDonutChart;
