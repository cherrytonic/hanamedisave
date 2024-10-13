import React from 'react';
import { ResponsivePie } from '@nivo/pie';


const AccountRadar = ({ data }) => {
    return (
        <div style={{ width: '420px', height: '420px', margin: '0 auto' }}>
            <ResponsivePie
                data={data}
                margin={{ top: 40, right: 100, bottom: 80, left: 100 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={2}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                from: 'color',
                modifiers: [['darker', 0.2]]
                }}
                valueFormat=" >-0,~f"
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]]
                }}
                colors={{ datum: 'data.color' }}
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
                        itemTextColor: '#000'
                        }
                      }
                    ],
                    
                }
                ]}
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
}
    
export default AccountRadar;