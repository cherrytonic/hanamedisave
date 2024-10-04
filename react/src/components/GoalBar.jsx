import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const GoalBar = ({ data }) => {
  return (
    <div style={{ width: '300px', height: '50px', margin: '0' }} >
      <ResponsiveBar
        
        data={data}
        keys={['달성률', '남은 부분']}
        indexBy="category"
        padding={0.2} // 바 사이의 여백을 설정
        colors={({ id, data }) => {
          if (id === '달성률') {
            return data['달성률Color'];  // 달성된 부분의 색상
          } else {
            return '#d3d3d3';  // 남은 부분의 회색
          }
        }}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        axisTop={null}
        axisRight={null}
        axisBottom={null} 
        axisLeft={null}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]]
        }}
        borderRadius={4}
        labelSkipWidth={12}
        labelSkipHeight={12}
        enableGridY={false}
        animate={true}
        layout="horizontal" // 수평 방향 레이아웃
        role="application"
        ariaLabel="목표 달성률"
        barAriaLabel={e => `${e.indexValue}: ${e.value}% 달성`}
        theme={{
            labels: {
              text: {
                fontSize: 14, // 폰트 크기 설정
                fill: '#000', // 텍스트 색상
                fontFamily: 'hana-regular'
              }
            }
          }}
      />
    </div>
  );
};

export default GoalBar;
