import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const BarChart = ({ data }) => {
  return (
    <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
      <ResponsiveBar
        data={data}
        keys={['보험료']}
        indexBy="category"
        padding={0.2} // 바 사이의 여백을 늘려서 바의 너비를 줄임
        colors={({ id, data }) => data[`${id}Color`]} // 각 바의 색상을 데이터에서 가져오도록 설정
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
        borderRadius={6}
        labelSkipWidth={12}
        labelSkipHeight={12}
        enableGridY={false}
        animate={true}
        motionConfig={{
          mass: 1,
          tension: 120,
          friction: 40,
          clamp: true,
        }} // 수직 애니메이션을 자연스럽게 설정
        layout="vertical" // 수직 방향 레이아웃 설정
        motionStiffness={170}
        motionDamping={26}
        role="application"
        ariaLabel="보험료 차트"
        barAriaLabel={e => `${e.indexValue}: ${e.value}원`}
      />
    </div>
  );
};

export default BarChart;
