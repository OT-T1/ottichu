import React from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import * as data from './chartData';

const options = {
  interaction: {
    mode: 'index',
  },
  scales: {
    y: {
      type: 'linear',
      grid: {
        color: '#E2E2E230',
      },
      axis: 'y',
      display: true,
      position: 'left',
      title: {
        display: true,
        align: 'end',
        color: '#808080',
        font: {
          size: 12,
          family: "'Noto Sans KR', sans-serif",
          weight: 300,
        },
      },
    },
    y_sub: {
      position: 'right',
      title: {
        display: true,
        align: 'end',
        color: '#808080',
        font: {
          size: 12,
          family: "'Noto Sans KR', sans-serif",
          weight: 300,
        },
        text: '단위: 명',
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: '#ECEFF4',
        usePointStyle: true,
        padding: 10,
        font: {
          family: "'Inter', 'serif'",
          lineHeight: 2,
          size: 13,
        },
      },
    },
    tooltip: {
      padding: 10,
      bodySpacing: 5,
      usePointStyle: true,
    },
  },
};

export default function SearchGraph() {
  return (
    <div>
      <ChartWrapper>
        <Line data={data.allData} options={options} width={1000} height={400} />
      </ChartWrapper>
    </div>
  );
}

const ChartWrapper = styled.div`
  margin-top: 0px;
  height: auto;
  margin: auto;
`;
