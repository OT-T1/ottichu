import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function PreferenceChart({ categories }) {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [topGenres, setTopGenres] = useState('');

  useEffect(() => {
    const labels = [];
    const percent = [];

    Object.keys(categories).map((category) => labels.push(category));
    Object.keys(categories).map((category) =>
      percent.push(categories[category]),
    );

    // percent가 max인 인덱스
    const isLargeNumber = (element) => element === Math.max(...percent);
    const index = percent.findIndex(isLargeNumber);
    setTopGenres(labels[index]);

    const newData = {
      labels,
      datasets: [
        {
          label: '장르 선호도',
          borderWidth: 1,
          data: percent,
          backgroundColor: [
            '#BF616A',
            '#D08770',
            '#EBCB8B',
            '#A3BE8C',
            '#B48EAD',
          ],
          borderColor: ['#D8DEE9'],
        },
      ],
    };

    setData(newData);
  }, [categories]);

  const options = {
    maintainAspectRatio: false,
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
      datalabels: {
        display: true,
        align: 'bottom',
        formatter(value) {
          return `${value}%`;
        },
        font: {
          size: 16,
        },
        color: '#2E3440',
      },
    },
  };

  const plugins = [ChartDataLabels];

  return (
    <ChartWrapper>
      <StyledTitle>{topGenres}를 가장 선호합니다</StyledTitle>
      <StyledDiv>
        <Pie data={data} options={options} plugins={plugins} />
      </StyledDiv>
    </ChartWrapper>
  );
}

const ChartWrapper = styled.div`
  text-align: center;
`;

const StyledTitle = styled.h1`
  margin-bottom: 0.6em;
`;

const StyledDiv = styled.div`
  width: 40vw;
  height: 50vh;
  padding: 1em 1em;
  background: linear-gradient(
    126.6deg,
    rgba(255, 255, 255, 0.12) 28.69%,
    rgba(255, 255, 255, 0) 100%
  );
  backdrop-filter: blur(140px);
  border-radius: 25px;
  border: 2px solid #ffffff1f;
`;
