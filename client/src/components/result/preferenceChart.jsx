import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function PreferenceChart({ categories }) {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const labels = [];
    const percent = [];

    Object.keys(categories).map((category) => labels.push(category));
    Object.keys(categories).map((category) =>
      percent.push(categories[category]),
    );

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
      datalabels: {
        display: true,
        align: 'bottom',
        // formatter(value) {
        //   return `${value}%`;
        // },
        font: {
          size: 18,
          color: 'green',
        },
      },
    },
  };

  const plugins = [ChartDataLabels];

  return (
    <TestDiv>
      <StyledTitle>{Object.keys(categories)[0]}를 가장 선호합니다</StyledTitle>
      <StyledDiv>
        <Pie data={data} options={options} plugins={plugins} />
      </StyledDiv>
    </TestDiv>
  );
}

const TestDiv = styled.div`
  text-align: center;
  /* border: 2px solid red; */
`;

const StyledTitle = styled.h1`
  margin-bottom: 0.6em;
`;

const StyledDiv = styled.div`
  width: 40vw;
  height: 36vh;
  background: linear-gradient(
    126.6deg,
    rgba(255, 255, 255, 0.12) 28.69%,
    rgba(255, 255, 255, 0) 100%
  );
  backdrop-filter: blur(140px);
  border-radius: 25px;
  border: 2px solid #ffffff1f;
`;
